import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setError("");
    try { setResult(await requestPasswordReset(email)); } catch (e) { setError(e.message); }
  }
  return <main className="grid min-h-screen place-items-center bg-background px-4"><section className="glass w-full max-w-md rounded-3xl p-8">
    <h1 className="text-2xl font-bold">Reset password</h1><p className="mt-2 text-sm text-muted-foreground">Enter the account email.</p>
    {error ? <p className="mt-4 text-sm text-negative">{error}</p> : null}
    {result ? <div className="mt-4 rounded-xl bg-positive/10 p-3 text-sm"><p>{result.message}</p>{result.devResetToken ? <p className="mt-2 break-all"><strong>Local development token:</strong> {result.devResetToken}</p> : null}</div> : null}
    <form onSubmit={submit} className="mt-5 space-y-4"><input className="h-11 w-full rounded-xl border border-border bg-background px-3" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /><button className="w-full rounded-xl brand-gradient px-4 py-3 font-semibold text-primary-foreground">Create reset request</button></form>
    <Link to="/login" className="mt-5 block text-center text-sm text-primary">Back to sign in</Link>
  </section></main>;
}
