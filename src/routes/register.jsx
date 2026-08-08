import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { signUp, isAuthenticated, initialising } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialising && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [initialising, isAuthenticated, navigate]);

  async function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    try {
      await signUp({ fullName: form.fullName, email: form.email, password: form.password });
      navigate({ to: "/dashboard", replace: true });
    } catch (nextError) {
      setError(nextError.message);
    } finally { setLoading(false); }
  }

  const input = "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/30";
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="glass w-full max-w-md rounded-3xl p-7 sm:p-9">
        <Link to="/" className="mb-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl brand-gradient"><Sparkles className="h-5 w-5 text-primary-foreground" /></span><span className="text-xl font-bold">Assetscape Wealth</span></Link>
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your records are isolated by user and saved permanently.</p>
        {error ? <div className="mt-5 rounded-xl border border-negative/30 bg-negative/10 p-3 text-sm text-negative">{error}</div> : null}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Full name<input className={input} required minLength={2} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label className="block text-sm font-medium">Email<input className={input} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="block text-sm font-medium">Password<input className={input} type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><span className="mt-1 block text-xs text-muted-foreground">Use uppercase, lowercase, and a number.</span></label>
          <label className="block text-sm font-medium">Confirm password<input className={input} type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label>
          <button disabled={loading} className="press w-full rounded-xl brand-gradient px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>
      </section>
    </main>
  );
}
