"""Live ML demo — implemented in Phase 6.

The interface is fixed now so the frontend can be built against it. Until the
model lands, `predict` raises ModelNotReady and the route answers 501 with an
explicit message rather than inventing a result.
"""

from app.schemas.ml import PredictionRequest, PredictionResponse

MODEL_VERSION = "not-yet-trained"


class ModelNotReady(RuntimeError):
    """Raised while the demo model has not been implemented or loaded."""


def model_info() -> dict[str, str | bool]:
    return {
        "model_version": MODEL_VERSION,
        "ready": False,
        "note": "Live demo model arrives in Phase 6.",
    }


def predict(request: PredictionRequest) -> PredictionResponse:
    raise ModelNotReady("The demo model is not available yet (Phase 6).")
