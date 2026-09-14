"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { scoreTransaction, type ScoreResult } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/utils";

const TRANSFER_TYPES = ["TRANSFER", "CASH_OUT", "PAYMENT", "DEBIT", "CASH_IN"] as const;

type TransferType = (typeof TRANSFER_TYPES)[number];

interface Form {
  label: string;
  amount: number;
  oldBalanceOrig: number;
  newBalanceOrig: number;
  oldBalanceDest: number;
  newBalanceDest: number;
  type: TransferType;
}

/** Two transactions in the PaySim schema, one clean and one not. */
const PRESETS: Record<"ghost" | "clean", Form> = {
  ghost: {
    label: "Ghost destination",
    amount: 181,
    oldBalanceOrig: 181,
    newBalanceOrig: 0,
    oldBalanceDest: 0,
    newBalanceDest: 0,
    type: "TRANSFER",
  },
  clean: {
    label: "Reconciling payment",
    amount: 100,
    oldBalanceOrig: 500,
    newBalanceOrig: 400,
    oldBalanceDest: 200,
    newBalanceDest: 300,
    type: "PAYMENT",
  },
};

const FIELDS: { key: keyof Form; label: string }[] = [
  { key: "amount", label: "Amount" },
  { key: "oldBalanceOrig", label: "Origin before" },
  { key: "newBalanceOrig", label: "Origin after" },
  { key: "oldBalanceDest", label: "Destination before" },
  { key: "newBalanceDest", label: "Destination after" },
];

const BANDS = {
  low: { pill: "normal", label: "Low" },
  elevated: { pill: "alarm", label: "Elevated" },
  high: { pill: "alarm", label: "High" },
} as const;

/**
 * The live demo: paste a transaction, get a score and the reasons behind it.
 *
 * The call path is real end to end - this posts to the FastAPI service when
 * one is configured, and to the Next route handler otherwise. What it runs is
 * the project's explainable rule tier, not the trained model, and the response
 * says so rather than leaving it to be assumed.
 */
export function MlDemo() {
  const formId = useId();
  const [form, setForm] = useState<Form>(PRESETS.ghost);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [status, setStatus] = useState<"idle" | "scoring" | "error">("idle");
  const [error, setError] = useState("");

  function set(key: keyof Form, value: string) {
    setForm((current) => ({ ...current, [key]: Number(value) || 0 }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("scoring");
    setError("");
    const response = await scoreTransaction(form);
    if (response.ok) {
      setResult(response.data);
      setStatus("idle");
    } else {
      setStatus("error");
      setError(response.message);
    }
  }

  return (
    <section className="border-line bg-surface border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline>Live demo · explainable rule tier</Overline>
        <Pill variant="normal">real call path</Pill>
      </div>

      <div className="grid gap-px lg:grid-cols-2">
        {/* Input ------------------------------------------------------- */}
        <form onSubmit={onSubmit} className="bg-bg p-6">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setForm(PRESETS[key]);
                  setResult(null);
                }}
                className="interactive rounded-card border-line text-ink-muted hover:text-ink border px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase"
              >
                {PRESETS[key].label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={`${formId}-${field.key}`}
                  className="text-overline text-ink-subtle font-mono uppercase"
                >
                  {field.label}
                </label>
                <input
                  id={`${formId}-${field.key}`}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  value={form[field.key] as number}
                  onChange={(event) => set(field.key, event.target.value)}
                  className="rounded-card border-line bg-surface text-ink focus-visible:outline-focus mt-2 w-full border px-3 py-2 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor={`${formId}-type`}
                className="text-overline text-ink-subtle font-mono uppercase"
              >
                Type
              </label>
              <select
                id={`${formId}-type`}
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value as TransferType,
                  }))
                }
                className="rounded-card border-line bg-surface text-ink focus-visible:outline-focus mt-2 w-full border px-3 py-2 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {TRANSFER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button type="submit" variant="primary" disabled={status === "scoring"}>
              {status === "scoring" ? "Scoring…" : "Score this transaction"}
            </Button>
            {status === "error" && (
              <p role="alert" className="text-alarm text-[13px]">
                {error}
              </p>
            )}
          </div>
        </form>

        {/* Output ------------------------------------------------------ */}
        <div className="bg-bg p-6" aria-live="polite">
          {!result ? (
            <p className="text-ink-subtle text-sm">
              Score a transaction to see the rules it tripped and why.
            </p>
          ) : (
            <>
              <div className="flex items-baseline gap-4">
                <span
                  className="font-display text-ink text-4xl font-bold tabular-nums"
                  data-tabular
                >
                  {result.score.toFixed(2)}
                </span>
                <Pill variant={BANDS[result.band].pill}>
                  {BANDS[result.band].label}
                </Pill>
                <span className="text-ink-subtle font-mono text-[11px]">
                  {result.latency_ms.toFixed(1)} ms
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {result.signals.map((signal, index) => (
                  <motion.li
                    key={signal.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: 0.05 * index }}
                    className="border-line border-l pl-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className={cn(
                          "text-sm",
                          signal.triggered ? "text-alarm" : "text-ink-subtle",
                        )}
                      >
                        {signal.label}
                      </span>
                      <span className="text-ink-subtle font-mono text-[11px]">
                        {signal.triggered ? `+${signal.weight.toFixed(2)}` : "-"}
                      </span>
                    </div>
                    <p className="text-ink-subtle mt-1 text-[13px] leading-snug">
                      {signal.detail}
                    </p>
                  </motion.li>
                ))}
              </ul>

              {result.excluded.map((signal) => (
                <div
                  key={signal.name}
                  className="border-alarm/40 bg-alarm-soft mt-5 border border-dashed p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-alarm text-sm">{signal.label}</span>
                    <span className="text-ink-subtle font-mono text-[11px]">
                      {signal.triggered ? "fired" : "not fired"} · +0.00
                    </span>
                  </div>
                  <p className="text-ink-muted mt-1 text-[13px] leading-snug">
                    {signal.detail}
                  </p>
                </div>
              ))}

              <p className="border-line text-ink-subtle mt-5 border-t pt-4 text-[13px] leading-relaxed">
                {result.note} <span className="font-mono">{result.rule_version}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
