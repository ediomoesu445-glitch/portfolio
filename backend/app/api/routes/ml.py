from fastapi import APIRouter, HTTPException

from app.schemas.ml import PredictionRequest, PredictionResponse
from app.services import ml as service

router = APIRouter(prefix="/ml", tags=["ml-demo"])


@router.get("/model-info", summary="Demo scorer status")
def model_info() -> dict[str, str | bool]:
    return service.model_info()


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Score one transaction with the explainable rule tier",
)
def predict(payload: PredictionRequest) -> PredictionResponse:
    try:
        return service.predict(payload)
    except service.ModelNotReady as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
