import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { signIn, isAuthenticated, initialising } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialising && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [initialising, isAuthenticated, navigate]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      await signIn(form);
      navigate({ to: "/dashboard", replace: true });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="glass w-full max-w-md rounded-3xl p-7 sm:p-9">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl brand-gradient"><Sparkles className="h-5 w-5 text-primary-foreground" /></span>
          <span className="text-xl font-bold">Assetscape Wealth</span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to retrieve your saved portfolio from PostgreSQL.</p>
        {error ? <div className="mt-5 rounded-xl border border-negative/30 bg-negative/10 p-3 text-sm text-negative">{error}</div> : null}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Email
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input className="h-11 w-full bg-transparent outline-none" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </span>
          </label>
          <label className="block text-sm font-medium">Password
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <LockKeyhole className="h-4 w-4 text-muted-foreground" />
              <input className="h-11 w-full bg-transparent outline-none" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
            </span>
          </label>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <button disabled={loading} className="press w-full rounded-xl brand-gradient px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">New user? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
      </section>
    </main>
  );
}
