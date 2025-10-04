import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
from pathlib import Path

# Create synthetic training data based on NASA Kepler statistics
np.random.seed(42)

n_samples = 500

# Generate realistic exoplanet features
data = {
    'koi_period': np.random.lognormal(3.5, 1.2, n_samples),  # Orbital period
    'koi_duration': np.random.lognormal(1.0, 0.5, n_samples),  # Transit duration
    'koi_impact': np.random.uniform(0, 1, n_samples),  # Impact parameter
    'koi_depth': np.random.lognormal(-7, 1.5, n_samples),  # Transit depth
    'koi_prad': np.random.lognormal(0.5, 0.8, n_samples),  # Planet radius
    'koi_insol': np.random.lognormal(2, 2, n_samples),  # Insolation
    'koi_model_snr': np.random.lognormal(2.5, 0.8, n_samples),  # SNR
    'koi_srad': np.random.normal(1.0, 0.3, n_samples),  # Stellar radius
    'koi_steff': np.random.normal(5500, 800, n_samples),  # Stellar temp
    'koi_slogg': np.random.normal(4.4, 0.3, n_samples),  # Surface gravity
    'koi_fpflag_nt': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
    'koi_fpflag_ss': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
    'koi_fpflag_co': np.random.choice([0, 1], n_samples, p=[0.92, 0.08]),
    'koi_fpflag_ec': np.random.choice([0, 1], n_samples, p=[0.88, 0.12])
}

df = pd.DataFrame(data)

# Create labels based on realistic criteria
# Confirmed exoplanets typically have:
# - Good SNR (> 10)
# - Reasonable planet radius (0.5 - 20 Earth radii)
# - Low false positive flags
# - Consistent orbital parameters

confirmed_criteria = (
    (df['koi_model_snr'] > 10) &
    (df['koi_prad'] > 0.5) &
    (df['koi_prad'] < 20) &
    (df['koi_fpflag_nt'] == 0) &
    (df['koi_fpflag_ss'] == 0) &
    (df['koi_depth'] > 0.0001)
)

# Add some noise to make it realistic
noise = np.random.random(n_samples) > 0.15
df['koi_disposition'] = ((confirmed_criteria & noise).astype(int))

# Train initial model
features = [
    'koi_period', 'koi_duration', 'koi_impact', 'koi_depth',
    'koi_prad', 'koi_insol', 'koi_model_snr', 'koi_srad', 
    'koi_steff', 'koi_slogg', 'koi_fpflag_nt', 'koi_fpflag_ss', 
    'koi_fpflag_co', 'koi_fpflag_ec'
]

X = df[features]
y = df['koi_disposition']

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)

model.fit(X, y)

# Save model
model_dir = Path('models')
model_dir.mkdir(exist_ok=True)

model_path = model_dir / 'current_model.pkl'
joblib.dump(model, model_path)

print(f"Initial model created and saved to {model_path}")
print(f"Training samples: {len(df)}")
print(f"Confirmed: {sum(y == 1)}, False Positive: {sum(y == 0)}")
