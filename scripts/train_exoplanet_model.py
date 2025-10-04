import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import json
import joblib
import sys
from pathlib import Path

# External libraries
try:
    from xgboost import XGBClassifier
    from lightgbm import LGBMClassifier
    HAS_ADVANCED_MODELS = True
except ImportError:
    HAS_ADVANCED_MODELS = False
    print("[v0] XGBoost/LightGBM not available, using Random Forest only")

def train_model(csv_path):
    """Train exoplanet classification model using the exact approach from user's code"""
    
    print(f"[v0] Loading data from {csv_path}...")
    df = pd.read_csv(csv_path, sep=',', low_memory=False)
    
    # Feature columns (exactly as user specified)
    features = [
        'source', 'radius', 'radius_err1', 'radius_err2',
        'orbital_period', 'orbital_period_err1', 'orbital_period_err2',
        'equilibrium_temp', 'equilibrium_temp_err1', 'equilibrium_temp_err2',
        'transit_depth', 'transit_depth_err1', 'transit_depth_err2',
        'transit_duration', 'transit_midpoint', 'semi_major_axis',
        'planet_density', 'planet_mass',
        'stellar_teff', 'stellar_teff_err1', 'stellar_teff_err2',
        'stellar_logg', 'stellar_logg_err1', 'stellar_logg_err2',
        'stellar_radius', 'stellar_radius_err1', 'stellar_radius_err2',
        'stellar_mass', 'stellar_mass_err1', 'stellar_mass_err2',
        'stellar_density', 'stellar_metallicity',
        'discovery_year', 'discovery_method', 'host_name',
        'ra', 'ra_err1', 'ra_err2', 'dec', 'dec_err1', 'dec_err2',
        'pm_ra', 'pm_dec',
        'toi', 'kepid', 'k2_name', 'epic_candname', 'tic_id'
    ]
    
    target = 'disposition'
    
    # Check columns
    missing_cols = [col for col in features + [target] if col not in df.columns]
    if missing_cols:
        print(f"[v0] ⚠️ Missing columns: {missing_cols}")
        return None
    
    print("[v0] ✅ All columns found")
    
    # Filter and clean
    df = df[features + [target]].dropna(subset=[target])
    
    # Label mapping (exactly as user specified)
    label_map = {
        'CONFIRMED': 1,
        'FALSE POSITIVE': 0,
        'CANDIDATE': 2
    }
    df[target] = df[target].map(label_map)
    df = df[df[target].isin([0, 1])]  # Keep only confirmed / false positive
    
    print(f"[v0] Dataset size: {len(df)} samples")
    print(f"[v0] Class distribution: {df[target].value_counts().to_dict()}")
    
    # Split features and target
    X = df[features]
    y = df[target]
    
    # One-hot encode categorical features (CRITICAL: drop_first=True)
    X_encoded = pd.get_dummies(X, drop_first=True)
    
    print(f"[v0] Features after encoding: {X_encoded.shape[1]} columns")
    
    # Save feature names for later use in predictions
    feature_names = X_encoded.columns.tolist()
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, stratify=y, random_state=42, test_size=0.25
    )
    
    print(f"[v0] Training set: {len(X_train)} samples")
    print(f"[v0] Test set: {len(X_test)} samples")
    
    # Define models
    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=200, 
            max_depth=10, 
            random_state=42,
            n_jobs=-1
        )
    }
    
    if HAS_ADVANCED_MODELS:
        models["XGBoost"] = XGBClassifier(
            eval_metric='logloss',
            use_label_encoder=False,
            random_state=42
        )
        models["LightGBM"] = LGBMClassifier(random_state=42)
    
    # Train and evaluate
    results = {}
    best_model = None
    best_accuracy = 0
    best_model_name = ""
    
    for name, model in models.items():
        print(f"\n[v0] 🚀 Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        results[name] = acc
        
        print(f"[v0] 📊 {name} - Accuracy: {acc:.4f}")
        
        # Get detailed metrics
        report = classification_report(y_test, y_pred, output_dict=True)
        cm = confusion_matrix(y_test, y_pred)
        
        print(f"[v0] Confusion Matrix:\n{cm}")
        
        # Track best model
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_model_name = name
        
        # Save model
        model_filename = f"data/{name.lower().replace(' ', '_')}_model.pkl"
        Path("data").mkdir(exist_ok=True)
        joblib.dump(model, model_filename)
        print(f"[v0] Saved model to {model_filename}")
    
    # Save best model as default
    joblib.dump(best_model, "data/exoplanet_model.pkl")
    print(f"\n[v0] ✅ Best model: {best_model_name} (Accuracy: {best_accuracy:.4f})")
    
    # Save feature names and metadata
    metadata = {
        "feature_names": feature_names,
        "model_type": best_model_name,
        "accuracy": best_accuracy,
        "n_features": len(feature_names),
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "class_distribution": {
            "confirmed": int(sum(y == 1)),
            "false_positive": int(sum(y == 0))
        }
    }
    
    with open("data/model_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"[v0] Saved metadata to data/model_metadata.json")
    
    # Get feature importances
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
        feature_importance = dict(zip(feature_names, importances.tolist()))
        
        # Save top 20 features
        top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:20]
        
        with open("data/feature_importance.json", "w") as f:
            json.dump(dict(top_features), f, indent=2)
        
        print(f"[v0] Saved feature importance to data/feature_importance.json")
    
    return {
        "success": True,
        "model_name": best_model_name,
        "accuracy": best_accuracy,
        "results": results
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[v0] Usage: python train_exoplanet_model.py <csv_path>")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    result = train_model(csv_path)
    
    if result:
        print(f"\n[v0] Training complete!")
        print(json.dumps(result, indent=2))
    else:
        print("[v0] Training failed")
        sys.exit(1)
