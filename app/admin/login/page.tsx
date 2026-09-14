"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setBusy(false);
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      setError(payload.message ?? "Incorrect password.");
      setPassword("");
      return;
    }

    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-sm">
      <h1 className="text-ink font-display text-2xl font-bold">Content admin</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Sign in to edit the site&rsquo;s content.
      </p>

      <label htmlFor="password" className="text-ink mt-8 block text-sm font-medium">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="rounded-card border-line bg-bg text-ink focus:border-normal focus:ring-focus/40 mt-1.5 w-full border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      />

      {error && (
        <p role="alert" className="text-alarm mt-3 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-card bg-normal text-normal-ink mt-6 w-full px-4 py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Checking..." : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
