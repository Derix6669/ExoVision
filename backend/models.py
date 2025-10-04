from pydantic import BaseModel, Field
from typing import Optional, List

class ExoplanetFeatures(BaseModel):
    """Input features for exoplanet classification"""
    orbital_period: float = Field(..., description="Orbital period in days", gt=0)
    transit_duration: float = Field(..., description="Transit duration in hours", gt=0)
    transit_depth: float = Field(..., description="Transit depth in ppm", gt=0)
    planet_radius: float = Field(..., description="Planet radius in Earth radii", gt=0)
    signal_to_noise: float = Field(..., description="Signal-to-noise ratio", gt=0)
    koi_score: float = Field(..., description="KOI score", ge=0, le=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "orbital_period": 365.25,
                "transit_duration": 3.5,
                "transit_depth": 1000.0,
                "planet_radius": 1.2,
                "signal_to_noise": 15.5,
                "koi_score": 0.85
            }
        }

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    prediction: str = Field(..., description="Predicted class: 'confirmed' or 'false-positive'")
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    probabilities: dict = Field(..., description="Class probabilities")
    
class BatchPredictionRequest(BaseModel):
    """Request model for batch predictions"""
    data: List[ExoplanetFeatures]

class ModelMetadata(BaseModel):
    """Model metadata information"""
    filename: str
    size: int
    uploaded_at: str
    format: str
    type: Optional[str] = None

class TrainingRequest(BaseModel):
    """Request model for model retraining"""
    epochs: Optional[int] = Field(10, description="Number of training epochs")
    learning_rate: Optional[float] = Field(0.001, description="Learning rate")
    test_size: Optional[float] = Field(0.2, description="Test set size ratio", ge=0, le=1)
