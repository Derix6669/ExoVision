import pandas as pd
import numpy as np
from datetime import datetime
import os

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples
n_samples = 200

# Generate sample data with realistic ranges based on known exoplanets
data = {
    # Basic Info
    'source': np.random.choice(['Kepler', 'TESS', 'K2', 'Ground'], n_samples),
    'host_name': [f'Star-{i:04d}' for i in range(n_samples)],
    'discovery_year': np.random.randint(2009, 2024, n_samples),
    'discovery_method': np.random.choice(['Transit', 'Radial Velocity', 'Imaging', 'Microlensing'], n_samples, p=[0.7, 0.2, 0.05, 0.05]),
    
    # Planet Properties (realistic ranges)
    'pl_rade': np.random.lognormal(0.5, 0.8, n_samples),  # Planet radius in Earth radii (0.5-10)
    'pl_bmasse': np.random.lognormal(0.5, 1.5, n_samples),  # Planet mass in Earth masses
    'pl_dens': np.random.uniform(0.1, 10, n_samples),  # Density in g/cm³
    'pl_orbper': np.random.lognormal(2, 2, n_samples),  # Orbital period in days (1-1000)
    'pl_eqt': np.random.uniform(200, 2000, n_samples),  # Equilibrium temperature in K
    'pl_insol': np.random.lognormal(0, 2, n_samples),  # Insolation flux
    'pl_orbsmax': np.random.lognormal(-1, 1, n_samples),  # Semi-major axis in AU
    'pl_orbeccen': np.random.beta(2, 5, n_samples),  # Orbital eccentricity (0-1)
    'pl_orbincl': np.random.uniform(80, 90, n_samples),  # Orbital inclination in degrees
    'pl_tranmid': np.random.uniform(2454900, 2459000, n_samples),  # Transit midpoint (BJD)
    'pl_imppar': np.random.uniform(0, 1, n_samples),  # Impact parameter
    
    # Transit Properties
    'pl_trandep': np.random.uniform(0.001, 0.05, n_samples),  # Transit depth (fraction)
    'pl_trandur': np.random.uniform(1, 10, n_samples),  # Transit duration in hours
    'pl_ratdor': np.random.uniform(5, 50, n_samples),  # Ratio of distance to stellar radius
    'pl_ratror': np.random.uniform(0.01, 0.2, n_samples),  # Ratio of planet to stellar radius
    
    # Stellar Properties
    'st_teff': np.random.normal(5500, 1000, n_samples),  # Stellar effective temperature in K
    'st_logg': np.random.normal(4.5, 0.5, n_samples),  # Stellar surface gravity
    'st_rad': np.random.lognormal(0, 0.3, n_samples),  # Stellar radius in solar radii
    'st_mass': np.random.lognormal(0, 0.3, n_samples),  # Stellar mass in solar masses
    'st_dens': np.random.uniform(0.5, 5, n_samples),  # Stellar density
    'st_met': np.random.normal(0, 0.3, n_samples),  # Stellar metallicity [Fe/H]
    'st_lum': np.random.lognormal(0, 0.5, n_samples),  # Stellar luminosity
    'st_age': np.random.uniform(0.5, 13, n_samples),  # Stellar age in Gyr
    'st_vsini': np.random.uniform(0, 20, n_samples),  # Stellar rotation velocity
    'st_rotp': np.random.uniform(5, 50, n_samples),  # Stellar rotation period in days
    
    # Positional Data
    'ra': np.random.uniform(0, 360, n_samples),  # Right ascension in degrees
    'dec': np.random.uniform(-90, 90, n_samples),  # Declination in degrees
    'sy_dist': np.random.lognormal(5, 1, n_samples),  # Distance in parsecs
    'sy_pm': np.random.uniform(0, 100, n_samples),  # Proper motion
    'sy_pmra': np.random.uniform(-100, 100, n_samples),  # Proper motion in RA
    'sy_pmdec': np.random.uniform(-100, 100, n_samples),  # Proper motion in Dec
    'sy_plx': np.random.uniform(0.1, 50, n_samples),  # Parallax in mas
    
    # Photometry
    'sy_vmag': np.random.uniform(8, 16, n_samples),  # V-band magnitude
    'sy_jmag': np.random.uniform(7, 15, n_samples),  # J-band magnitude
    'sy_hmag': np.random.uniform(7, 15, n_samples),  # H-band magnitude
    'sy_kmag': np.random.uniform(7, 15, n_samples),  # K-band magnitude
    'sy_gaiamag': np.random.uniform(8, 16, n_samples),  # Gaia magnitude
    
    # Catalog Identifiers (some will be null)
    'toi': [f'TOI-{i}' if np.random.random() > 0.7 else '' for i in range(n_samples)],
    'kepid': [str(np.random.randint(1000000, 9999999)) if np.random.random() > 0.5 else '' for _ in range(n_samples)],
    'k2_name': [f'K2-{i}' if np.random.random() > 0.8 else '' for i in range(n_samples)],
    'epic_candname': [f'EPIC-{np.random.randint(100000, 999999)}' if np.random.random() > 0.8 else '' for _ in range(n_samples)],
    'tic_id': [str(np.random.randint(10000000, 99999999)) if np.random.random() > 0.6 else '' for _ in range(n_samples)],
    
    # Additional metrics
    'koi_score': np.random.uniform(0.5, 1.0, n_samples),  # KOI score (higher = more likely planet)
    'koi_fpflag_nt': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),  # Not transit-like flag
    'koi_fpflag_ss': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),  # Stellar eclipse flag
    'koi_fpflag_co': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),  # Centroid offset flag
    'koi_fpflag_ec': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),  # Ephemeris match flag
}

# Create DataFrame
df = pd.DataFrame(data)

# Create disposition based on realistic criteria
# Planets with good characteristics are more likely to be CONFIRMED
disposition = []
for idx, row in df.iterrows():
    score = 0
    
    # Good indicators for confirmed planet
    if row['koi_score'] > 0.8:
        score += 3
    if row['pl_rade'] < 4:  # Not too large
        score += 2
    if row['pl_trandep'] > 0.005:  # Good transit depth
        score += 2
    if row['discovery_method'] == 'Transit':
        score += 1
    if row['koi_fpflag_nt'] == 0 and row['koi_fpflag_ss'] == 0:
        score += 2
    
    # Assign disposition based on score
    if score >= 6:
        disposition.append('CONFIRMED')
    else:
        disposition.append('FALSE POSITIVE')

df['disposition'] = disposition

# Add some randomness (10% chance to flip)
flip_mask = np.random.random(n_samples) < 0.1
df.loc[flip_mask, 'disposition'] = df.loc[flip_mask, 'disposition'].apply(
    lambda x: 'FALSE POSITIVE' if x == 'CONFIRMED' else 'CONFIRMED'
)

os.makedirs('public', exist_ok=True)

# Save to CSV
output_file = 'public/sample_training_data.csv'
df.to_csv(output_file, index=False)

print(f"Generated {n_samples} samples")
print(f"CONFIRMED: {(df['disposition'] == 'CONFIRMED').sum()}")
print(f"FALSE POSITIVE: {(df['disposition'] == 'FALSE POSITIVE').sum()}")
print(f"Saved to: {output_file}")
