import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
import joblib
import json
import sys
from pathlib import Path
from datetime import datetime

def train_exoplanet_model(csv_path, test_size=0.2, random_state=42):
    """
    Train Random Forest model on NASA Kepler exoplanet data
    
    Args:
        csv_path: Path to training CSV file
        test_size: Proportion of data for testing (default 0.2)
        random_state: Random seed for reproducibility (default 42)
    
    Returns:
        Dictionary with training results and metrics
    """
    
    # NASA Kepler features used for classification
    features = [
        'koi_period',      # Orbital period (days)
        'koi_duration',    # Transit duration (hours)
        'koi_impact',      # Impact parameter
        'koi_depth',       # Transit depth (ppm)
        'koi_prad',        # Planet radius (Earth radii)
        'koi_insol',       # Insolation flux (Earth flux)
        'koi_model_snr',   # Signal-to-noise ratio
        'koi_srad',        # Stellar radius (Solar radii)
        'koi_steff',       # Stellar effective temperature (K)
        'koi_slogg',       # Stellar surface gravity (log10(cm/s²))
        'koi_fpflag_nt',   # Not transit-like flag
        'koi_fpflag_ss',   # Stellar eclipse flag
        'koi_fpflag_co',   # Centroid offset flag
        'koi_fpflag_ec'    # Ephemeris match flag
    ]
    
    target = 'koi_disposition'
    
    try:
        # Load data
        df = pd.read_csv(csv_path)
        
        # Check if required columns exist
        missing_features = [f for f in features if f not in df.columns]
        if missing_features:
            return {
                'success': False,
                'error': f'Missing required columns: {", ".join(missing_features)}'
            }
        
        if target not in df.columns:
            return {
                'success': False,
                'error': f'Missing target column: {target}'
            }
        
        # Filter and clean data
        df = df[features + [target]].dropna()
        
        if len(df) < 10:
            return {
                'success': False,
                'error': 'Insufficient data after cleaning (need at least 10 samples)'
            }
        
        # Map disposition labels to binary classification
        label_map = {
            'CONFIRMED': 1,
            'FALSE POSITIVE': 0,
            'CANDIDATE': 2
        }
        
        df[target] = df[target].map(label_map)
        
        # Remove CANDIDATE class for binary classification
        df = df[df[target] != 2]
        
        if len(df) < 10:
            return {
                'success': False,
                'error': 'Insufficient confirmed/false positive samples (need at least 10)'
            }
        
        # Prepare features and target
        X = df[features]
        y = df[target]
        
        # Check class balance
        class_counts = y.value_counts()
        if len(class_counts) < 2:
            return {
                'success': False,
                'error': 'Need both confirmed and false positive samples'
            }
        
        # Train/test split with stratification
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=test_size, 
            stratify=y, 
            random_state=random_state
        )
        
        # Train Random Forest model
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            random_state=random_state,
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred, zero_division=0)),
            'f1_score': float(f1_score(y_test, y_pred, zero_division=0)),
            'train_samples': int(len(X_train)),
            'test_samples': int(len(X_test)),
            'total_samples': int(len(df)),
            'confirmed_count': int(sum(y == 1)),
            'false_positive_count': int(sum(y == 0))
        }
        
        # Feature importance
        feature_importance = {
            feature: float(importance) 
            for feature, importance in zip(features, model.feature_importances_)
        }
        
        # Sort by importance
        feature_importance = dict(
            sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        )
        
        # Save model
        model_dir = Path('models')
        model_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        model_filename = f'exoplanet_model_{timestamp}.pkl'
        model_path = model_dir / model_filename
        
        joblib.dump(model, model_path)
        
        # Save as current model too
        current_model_path = model_dir / 'current_model.pkl'
        joblib.dump(model, current_model_path)
        
        return {
            'success': True,
            'metrics': metrics,
            'feature_importance': feature_importance,
            'model_path': str(model_path),
            'timestamp': timestamp
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No CSV file path provided'
        }))
        sys.exit(1)
    
    csv_path = sys.argv[1]
    test_size = float(sys.argv[2]) if len(sys.argv) > 2 else 0.2
    
    result = train_exoplanet_model(csv_path, test_size)
    print(json.dumps(result))
