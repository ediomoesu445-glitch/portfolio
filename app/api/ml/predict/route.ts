import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Fallback for the FastAPI /api/ml/predict endpoint.
 *
 * A faithful port of backend/app/services/ml.py — same rules, same weights,
 * same exclusion. If you change one, change both; the backend test suite is
 * the authority on the expected bands.
 *
 * This is the ghost-transaction project's explainable rule tier, not the
 * trained model. No labels are involved, which is the point: the deployment
 * target has none either.
 */
const schema = z.object({
  amount: z.number().min(0),
  oldBalanceOrig: z.number().min(0).default(0),
  newBalanceOrig: z.number().min(0).default(0),
  oldBalanceDest: z.number().min(0).default(0),
  newBalanceDest: z.number().min(0).default(0),
  type: z
    .enum(["TRANSFER", "CASH_OUT", "PAYMENT", "DEBIT", "CASH_IN"])
    .default("TRANSFER"),
});

const TOLERANCE = 0.01;
const RULE_VERSION = "explainable-rule-v1";

const money = (value: number) =>
  value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function band(score: number) {
  if (score >= 0.66) return "high";
  if (score >= 0.33) return "elevated";
  return "low";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Could not read that request." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { detail: "Some fields were not valid numbers." },
      { status: 422 },
    );
  }

  const started = performance.now();
  const {
    amount,
    oldBalanceOrig,
    newBalanceOrig,
    oldBalanceDest,
    newBalanceDest,
    type,
  } = parsed.data;

  const origError = oldBalanceOrig - amount - newBalanceOrig;
  const destError = oldBalanceDest + amount - newBalanceDest;

  const ghostDestination = amount > 0 && oldBalanceDest === 0 && newBalanceDest === 0;
  const destMismatch = amount > 0 && Math.abs(destError) > TOLERANCE;
  const origMismatch = amount > 0 && Math.abs(origError) > TOLERANCE;
  const riskyType = type === "TRANSFER" || type === "CASH_OUT";

  const signals = [
    {
      name: "ghost_destination",
      label: "Ghost destination",
      triggered: ghostDestination,
      weight: 0.45,
      detail: ghostDestination
        ? "Destination received value but reports no balance before or after."
        : "Destination balances move as expected for the amount.",
    },
    {
      name: "dest_balance_error",
      label: "Destination ledger mismatch",
      triggered: destMismatch,
      weight: 0.25,
      detail: destMismatch
        ? `Destination is out by ${money(destError)} against the amount moved.`
        : "Destination reconciles to within a rounding unit.",
    },
    {
      name: "orig_balance_error",
      label: "Origin ledger mismatch",
      triggered: origMismatch,
      weight: 0.2,
      detail: origMismatch
        ? `Origin is out by ${money(origError)} against the amount moved.`
        : "Origin reconciles to within a rounding unit.",
    },
    {
      name: "transfer_type",
      label: "Movement type",
      triggered: riskyType,
      weight: 0.1,
      detail: riskyType
        ? `${type} can move value out of the system.`
        : `${type} does not move value out of the system.`,
    },
  ];

  // Computed, shown, and kept out of the score on purpose.
  const fullDrain =
    amount > 0 &&
    newBalanceOrig === 0 &&
    Math.abs(oldBalanceOrig - amount) <= TOLERANCE;

  const score = Math.min(
    signals.reduce(
      (total, signal) => total + (signal.triggered ? signal.weight : 0),
      0,
    ),
    1,
  );

  return NextResponse.json({
    score: Number(score.toFixed(4)),
    band: band(score),
    signals,
    excluded: [
      {
        name: "is_full_drain",
        label: "Full drain (excluded)",
        triggered: fullDrain,
        weight: 0,
        detail:
          "Account emptied exactly. Excluded from the score: this feature encodes the simulator's generator signature, and deleting it cost 0.1376 PR-AUC. It is shown so you can see it fire, not scored.",
      },
    ],
    rule_version: RULE_VERSION,
    note: "Scored by the explainable rule tier, not the trained XGBoost model. No labels are used. This is an investigative lead, never a determination of fraud.",
    latency_ms: Number((performance.now() - started).toFixed(3)),
  });
}
