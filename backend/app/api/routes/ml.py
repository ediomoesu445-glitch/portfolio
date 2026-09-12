from fastapi import APIRouter, HTTPException

from app.schemas.ml import PredictionRequest, PredictionResponse
from app.services import ml as service

router = APIRouter(prefix="/ml", tags=["ml-demo"])


@router.get("/model-info", summary="Demo model status")
def model_info() -> dict[str, str | bool]:
    return service.model_info()


@router.post("/predict", response_model=PredictionResponse, summary="Run the demo model")
def predict(payload: PredictionRequest) -> PredictionResponse:
    try:
        return service.predict(payload)
    except service.ModelNotReady as error:
        raise HTTPException(status_code=501, detail=str(error)) from error
