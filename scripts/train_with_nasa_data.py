"""
Complete workflow: Fetch NASA data and train model
"""

import subprocess
import sys
from pathlib import Path

def main():
    print("=" * 60)
    print("NASA Exoplanet Model Training Workflow")
    print("=" * 60)
    
    # Step 1: Fetch NASA data
    print("\n[Step 1/2] Fetching real NASA Kepler data...")
    try:
        result = subprocess.run(
            ["python", "scripts/fetch_nasa_training_data.py"],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error fetching data: {e}")
        print(e.stderr)
        sys.exit(1)
    
    # Step 2: Train model
    print("\n[Step 2/2] Training model with NASA data...")
    training_file = Path("data/nasa_kepler_training.csv")
    
    if not training_file.exists():
        print(f"Error: Training file not found at {training_file}")
        sys.exit(1)
    
    try:
        result = subprocess.run(
            ["python", "scripts/train_model.py", str(training_file)],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
        
        print("\n" + "=" * 60)
        print("SUCCESS! Model trained with real NASA data")
        print("=" * 60)
        print("\nYou can now use the trained model for predictions!")
        
    except subprocess.CalledProcessError as e:
        print(f"Error training model: {e}")
        print(e.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
