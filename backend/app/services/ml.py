"""The live demo scorer.

This is the ghost-transaction project's *explainable rule tier*, implemented
in full - not a stub and not a mock. It uses no trained model and no labels,
which is the point: the deployment target has no labels either, so the rule is
the part of the method that transfers.

It is not the XGBoost model, and the response says so. The PR-AUC figures on
the case study belong to that model on a held-out PaySim split; nothing here
reproduces them.

The one deliberate omission is `is_full_drain`. It is computed and returned so
a reader can see it fire, but it is excluded from the score because the
project's own diagnostic showed it encodes the simulator's generator
signature rather than fraudulent behaviour - deleting it cost 0.1376 PR-AUC,
and putting it back here would repeat the mistake the project exists to
document.
"""

import time

from app.schemas.ml import PredictionRequest, PredictionResponse, Signal

RULE_VERSION = "explainable-rule-v1"

#: Tolerance for floating-point balance reconciliation, in currency units.
BALANCE_TOLERANCE = 0.01


class ModelNotReady(RuntimeError):
    """Raised when a scorer is unavailable."""


def _band(score: float) -> str:
    if score >= 0.66:
        return "high"
    if score >= 0.33:
        return "elevated"
    return "low"


def predict(request: PredictionRequest) -> PredictionResponse:
    started = time.perf_counter()

    amount = request.amount
    orig_error = request.old_balance_orig - amount - request.new_balance_orig
    dest_error = request.old_balance_dest + amount - request.new_balance_dest

    signals: list[Signal] = []

    # 1. The destination received value and has nothing to show for it. This is
    #    the ghost-destination rule: 93.63% precision on the labelled proxy,
    #    using no labels at any point.
    ghost_destination = (
        amount > 0
        and request.old_balance_dest == 0
        and request.new_balance_dest == 0
    )
    signals.append(
        Signal(
            name="ghost_destination",
            label="Ghost destination",
            triggered=ghost_destination,
            weight=0.45,
            detail=(
                "Destination received value but reports no balance before or after."
                if ghost_destination
                else "Destination balances move as expected for the amount."
            ),
        )
    )

    # 2. The destination ledger does not reconcile against the amount moved.
    dest_mismatch = amount > 0 and abs(dest_error) > BALANCE_TOLERANCE
    signals.append(
        Signal(
            name="dest_balance_error",
            label="Destination ledger mismatch",
            triggered=dest_mismatch,
            weight=0.25,
            detail=(
                f"Destination is out by {dest_error:,.2f} against the amount moved."
                if dest_mismatch
                else "Destination reconciles to within a rounding unit."
            ),
        )
    )

    # 3. The originating ledger does not reconcile either.
    orig_mismatch = amount > 0 and abs(orig_error) > BALANCE_TOLERANCE
    signals.append(
        Signal(
            name="orig_balance_error",
            label="Origin ledger mismatch",
            triggered=orig_mismatch,
            weight=0.2,
            detail=(
                f"Origin is out by {orig_error:,.2f} against the amount moved."
                if orig_mismatch
                else "Origin reconciles to within a rounding unit."
            ),
        )
    )

    # 4. Transfer and cash-out are the only types fraud takes in this schema.
    risky_type = request.transfer_type in {"TRANSFER", "CASH_OUT"}
    signals.append(
        Signal(
            name="transfer_type",
            label="Movement type",
            triggered=risky_type,
            weight=0.1,
            detail=(
                f"{request.transfer_type} can move value out of the system."
                if risky_type
                else f"{request.transfer_type} does not move value out of the system."
            ),
        )
    )

    # Computed, shown, and kept out of the score on purpose.
    full_drain = amount > 0 and request.new_balance_orig == 0 and (
        abs(request.old_balance_orig - amount) <= BALANCE_TOLERANCE
    )
    excluded = [
        Signal(
            name="is_full_drain",
            label="Full drain (excluded)",
            triggered=full_drain,
            weight=0.0,
            detail=(
                "Account emptied exactly. Excluded from the score: this feature "
                "encodes the simulator's generator signature, and deleting it cost "
                "0.1376 PR-AUC. It is shown so you can see it fire, not scored."
            ),
        )
    ]

    score = sum(signal.weight for signal in signals if signal.triggered)
    score = round(min(score, 1.0), 4)

    return PredictionResponse(
        score=score,
        band=_band(score),
        signals=signals,
        excluded=excluded,
        rule_version=RULE_VERSION,
        note=(
            "Scored by the explainable rule tier, not the trained XGBoost model. "
            "No labels are used. This is an investigative lead, never a "
            "determination of fraud."
        ),
        latency_ms=round((time.perf_counter() - started) * 1000, 3),
    )


def model_info() -> dict[str, str | bool]:
    return {
        "rule_version": RULE_VERSION,
        "ready": True,
        "kind": "explainable-rule",
        "note": (
            "The label-free rule tier from the ghost-transaction project. The "
            "trained model is not served here."
        ),
    }
