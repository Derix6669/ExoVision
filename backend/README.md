# ExoVision Backend API

Python FastAPI backend for the ExoVision exoplanet discovery assistant.

## Setup

1. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run the server:
\`\`\`bash
python main.py
\`\`\`

Or with uvicorn directly:
\`\`\`bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

## API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check

### Model Management
- `POST /api/upload-model` - Upload ML model
- `GET /api/model-info` - Get current model info
- `DELETE /api/model` - Remove current model

### Predictions (Coming in next tasks)
- `POST /api/predict` - Single prediction
- `POST /api/predict-batch` - Batch predictions
- `POST /api/predict-csv` - CSV file predictions

### Visualizations (Coming in next tasks)
- `GET /api/confusion-matrix` - Generate confusion matrix
- `GET /api/feature-importance` - Feature importance plot
- `POST /api/shap-values` - SHAP explanation plots

### Training (Coming in next tasks)
- `POST /api/retrain` - Retrain model with new data

## Development

The API runs on `http://localhost:8000`

API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
