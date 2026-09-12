"use client";

import { useId, useState } from "react";
import { z } from "zod";
import { submitContact } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Mirrors backend/app/schemas/contact.py so both sides agree on what is valid. */
const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail, please — at least 20 characters.")
    .max(4000, "That is longer than the form accepts."),
});

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const formId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const parsed = schema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof Errors;
        next[field] ??= issue.message;
      }
      setErrors(next);
      setStatus("error");
      setFeedback("Check the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setStatus("sending");
    setFeedback("");

    const result = await submitContact({
      ...parsed.data,
      // Honeypot: real visitors never see this field.
      company: (data.get("company") as string) || undefined,
    });

    setStatus(result.ok ? "sent" : "error");
    setFeedback(result.message);
    if (result.ok) form.reset();
  }

  const fieldClass =
    "w-full rounded-card border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-5">
      <div>
        <label
          htmlFor={`${formId}-name`}
          className="text-overline text-ink-subtle font-mono uppercase"
        >
          Name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={cn(
            fieldClass,
            "mt-2",
            errors.name ? "border-alarm" : "border-line",
          )}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className="text-alarm mt-1.5 text-[13px]">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${formId}-email`}
          className="text-overline text-ink-subtle font-mono uppercase"
        >
          Email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={cn(
            fieldClass,
            "mt-2",
            errors.email ? "border-alarm" : "border-line",
          )}
        />
        {errors.email && (
          <p id={`${formId}-email-error`} className="text-alarm mt-1.5 text-[13px]">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="text-overline text-ink-subtle font-mono uppercase"
        >
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={cn(
            fieldClass,
            "mt-2 resize-y",
            errors.message ? "border-alarm" : "border-line",
          )}
        />
        {errors.message && (
          <p id={`${formId}-message-error`} className="text-alarm mt-1.5 text-[13px]">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot. Hidden from people, not from bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>

        <p
          aria-live="polite"
          className={cn(
            "text-[13px]",
            status === "sent" && "text-normal",
            status === "error" && "text-alarm",
            status !== "sent" && status !== "error" && "text-ink-subtle",
          )}
        >
          {feedback}
        </p>
      </div>
    </form>
  );
}
