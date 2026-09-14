"""Schemas for the live demo endpoint.

The demo scores a single transaction with the project's *explainable rule
tier* — the label-free detector, not the trained XGBoost model. That is a
deliberate choice: the rule is deterministic, needs no model artefact, and is
the part of the method that actually transfers to an unlabelled target.
"""

from typing import Literal

from pydantic import BaseModel, Field

TransferType = Literal["TRANSFER", "CASH_OUT", "PAYMENT", "DEBIT", "CASH_IN"]


class PredictionRequest(BaseModel):
    """One transaction, in the shape the PaySim schema uses."""

    amount: float = Field(ge=0, description="Value moved by the transaction.")
    old_balance_orig: float = Field(
        default=0.0, ge=0, alias="oldBalanceOrig",
        description="Originating account balance before the transaction.",
    )
    new_balance_orig: float = Field(
        default=0.0, ge=0, alias="newBalanceOrig",
        description="Originating account balance after the transaction.",
    )
    old_balance_dest: float = Field(
        default=0.0, ge=0, alias="oldBalanceDest",
        description="Destination account balance before the transaction.",
    )
    new_balance_dest: float = Field(
        default=0.0, ge=0, alias="newBalanceDest",
        description="Destination account balance after the transaction.",
    )
    transfer_type: TransferType = Field(default="TRANSFER", alias="type")

    model_config = {"populate_by_name": True}


class Signal(BaseModel):
    """One rule, and whether this transaction tripped it."""

    name: str
    label: str
    triggered: bool
    weight: float
    detail: str


class PredictionResponse(BaseModel):
    score: float = Field(ge=0.0, le=1.0)
    band: Literal["low", "elevated", "high"]
    signals: list[Signal]
    #: Signals computed but deliberately kept out of the score.
    excluded: list[Signal] = Field(default_factory=list)
    rule_version: str
    note: str
    latency_ms: float
