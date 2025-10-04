"""
Fetch real NASA Kepler exoplanet data for model training
Downloads data from NASA Exoplanet Archive API and prepares it for training
"""

import requests
import pandas as pd
from pathlib import Path
import sys

def fetch_kepler_data(limit=5000):
    """
    Fetch Kepler Objects of Interest (KOI) data from NASA Exoplanet Archive
    
    Args:
        limit: Maximum number of records to fetch
    
    Returns:
        DataFrame with Kepler data
    """
    
    # NASA Exoplanet Archive TAP service
    base_url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    
    # Query for Kepler KOI data with all required features
    query = """
    SELECT 
        koi_period, koi_duration, koi_impact, koi_depth, 
        koi_prad, koi_insol, koi_model_snr,
        koi_srad, koi_steff, koi_slogg,
        koi_fpflag_nt, koi_fpflag_ss, koi_fpflag_co, koi_fpflag_ec,
        koi_disposition
    FROM koi
    WHERE koi_disposition IN ('CONFIRMED', 'FALSE POSITIVE')
    AND koi_period IS NOT NULL
    AND koi_duration IS NOT NULL
    AND koi_depth IS NOT NULL
    AND koi_prad IS NOT NULL
    AND koi_model_snr IS NOT NULL
    """
    
    params = {
        "query": query,
        "format": "csv"
    }
    
    try:
        print(f"[v0] Fetching Kepler data from NASA Exoplanet Archive...")
        response = requests.get(base_url, params=params, timeout=60)
        response.raise_for_status()
        
        # Save raw response
        data_dir = Path("data")
        data_dir.mkdir(exist_ok=True)
        
        raw_file = data_dir / "nasa_kepler_raw.csv"
        with open(raw_file, "w") as f:
            f.write(response.text)
        
        print(f"[v0] Raw data saved to {raw_file}")
        
        # Load and clean data
        df = pd.read_csv(raw_file)
        
        print(f"[v0] Downloaded {len(df)} records")
        print(f"[v0] Confirmed: {sum(df['koi_disposition'] == 'CONFIRMED')}")
        print(f"[v0] False Positives: {sum(df['koi_disposition'] == 'FALSE POSITIVE')}")
        
        # Remove rows with missing values in critical columns
        df_clean = df.dropna()
        
        print(f"[v0] After cleaning: {len(df_clean)} records")
        
        # Save cleaned training data
        training_file = data_dir / "nasa_kepler_training.csv"
        df_clean.to_csv(training_file, index=False)
        
        print(f"[v0] Training data saved to {training_file}")
        print(f"[v0] Columns: {list(df_clean.columns)}")
        
        return df_clean
        
    except requests.exceptions.RequestException as e:
        print(f"[v0] Error fetching data: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"[v0] Error processing data: {e}")
        sys.exit(1)

if __name__ == "__main__":
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    df = fetch_kepler_data(limit)
    
    print(f"\n[v0] SUCCESS: Ready for training with {len(df)} samples")
    print(f"[v0] Run training with: python scripts/train_model.py data/nasa_kepler_training.csv")
