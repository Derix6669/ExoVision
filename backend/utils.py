import numpy as np
import pandas as pd
from typing import List, Dict, Any
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

def prepare_features(features: Dict[str, float]) -> np.ndarray:
    """
    Prepare input features for model prediction
    
    Args:
        features: Dictionary of feature names and values
        
    Returns:
        numpy array of features in correct order
    """
    feature_order = [
        'orbital_period',
        'transit_duration', 
        'transit_depth',
        'planet_radius',
        'signal_to_noise',
        'koi_score'
    ]
    
    return np.array([[features[key] for key in feature_order]])

def calculate_feature_importance(model, feature_names: List[str]) -> Dict[str, float]:
    """
    Calculate feature importance from the model
    
    Args:
        model: Trained scikit-learn model
        feature_names: List of feature names
        
    Returns:
        Dictionary mapping feature names to importance scores
    """
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
    elif hasattr(model, 'coef_'):
        importances = np.abs(model.coef_[0])
    else:
        return {}
    
    return dict(zip(feature_names, importances.tolist()))

def plot_to_base64(fig) -> str:
    """
    Convert matplotlib figure to base64 string
    
    Args:
        fig: Matplotlib figure object
        
    Returns:
        Base64 encoded string of the plot
    """
    buffer = BytesIO()
    fig.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    return f"data:image/png;base64,{image_base64}"

def create_confusion_matrix_plot(y_true: np.ndarray, y_pred: np.ndarray) -> str:
    """
    Create confusion matrix visualization
    
    Args:
        y_true: True labels
        y_pred: Predicted labels
        
    Returns:
        Base64 encoded confusion matrix plot
    """
    from sklearn.metrics import confusion_matrix
    
    cm = confusion_matrix(y_true, y_pred)
    
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
    ax.set_xlabel('Predicted')
    ax.set_ylabel('Actual')
    ax.set_title('Confusion Matrix')
    ax.set_xticklabels(['False Positive', 'Confirmed'])
    ax.set_yticklabels(['False Positive', 'Confirmed'])
    
    return plot_to_base64(fig)

def create_feature_importance_plot(importances: Dict[str, float]) -> str:
    """
    Create feature importance bar plot
    
    Args:
        importances: Dictionary of feature importances
        
    Returns:
        Base64 encoded feature importance plot
    """
    features = list(importances.keys())
    values = list(importances.values())
    
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.barh(features, values, color='skyblue')
    ax.set_xlabel('Importance')
    ax.set_title('Feature Importance')
    ax.grid(axis='x', alpha=0.3)
    
    return plot_to_base64(fig)
