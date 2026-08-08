import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/reset-password")({ component: ResetPasswordPage });

function ResetPasswordPage() {
  const { resetPassword } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ token: "", newPassword: "" }); const [error, setError] = useState("");
  async function submit(e) { e.preventDefault(); try { await resetPassword(form.token, form.newPassword); navigate({ to: "/login" }); } catch (x) { setError(x.message); } }
  return <main className="grid min-h-screen place-items-center bg-background px-4"><section className="glass w-full max-w-md rounded-3xl p-8"><h1 className="text-2xl font-bold">Set a new password</h1>{error ? <p className="mt-4 text-sm text-negative">{error}</p> : null}<form onSubmit={submit} className="mt-5 space-y-4"><textarea className="min-h-24 w-full rounded-xl border border-border bg-background p-3" placeholder="Reset token" required value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} /><input className="h-11 w-full rounded-xl border border-border bg-background px-3" type="password" required minLength={8} placeholder="New password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /><button className="w-full rounded-xl brand-gradient px-4 py-3 font-semibold text-primary-foreground">Update password</button></form><Link to="/login" className="mt-5 block text-center text-sm text-primary">Back to sign in</Link></section></main>;
}
