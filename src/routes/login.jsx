import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Coffee, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — AssetSphere" },
      { name: "description", content: "Sign in to your AssetSphere account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@assetsphere.io");
  const [password, setPassword] = useState("demo1234");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ email, password });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err?.message || "Invalid credentials. Try the demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl brand-gradient shadow-[var(--shadow-float)]">
            <Coffee className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-xl font-bold">AssetSphere</span>
        </Link>

        {/* card */}
        <div className="spatial-card grain p-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your portfolio dashboard.
          </p>

          {/* demo hint */}
          <div className="mt-4 rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Demo account:</span>{" "}
            email <code className="font-mono text-primary">demo@assetsphere.io</code> ·
            password <code className="font-mono text-primary">demo1234</code>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-border bg-card/60 px-3.5 text-sm outline-none ring-0 transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="you@example.com"
              />
            </div>

            {/* password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card/60 px-3.5 pr-11 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-negative">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="press mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl brand-gradient text-sm font-semibold text-primary-foreground shadow-[var(--shadow-float)] disabled:opacity-60"
            >
              {loading ? "Signing in…" : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
