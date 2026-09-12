"""Schemas for the live ML demo endpoint.

Phase 6 fills in the real model. The request/response shape is defined now so
the frontend can be built against a stable contract.
"""

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    #: Placeholder input. Phase 6 replaces this with the real feature payload.
    features: dict[str, float] = Field(default_factory=dict)


class PredictionLabel(BaseModel):
    label: str
    score: float = Field(ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    model_version: str
    predictions: list[PredictionLabel]
    latency_ms: float
