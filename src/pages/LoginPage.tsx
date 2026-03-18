import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Radio, Shield, Sparkles } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAccounts = useMemo(
    () => [
      { role: "Admin", email: "admin@traffic.io", password: "admin123" },
      { role: "Operator", email: "operator@traffic.io", password: "op123" },
    ],
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate("/dashboard");
    else setError("Invalid credentials. Use one of the operator credentials below.");
  };

  const fillAccount = (account: (typeof quickAccounts)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,163,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(75,171,255,0.12),transparent_30%),linear-gradient(180deg,rgba(6,12,20,0.1),rgba(6,12,20,0.7))]" />
      <div className="absolute left-10 top-10 h-56 w-56 rounded-full blur-3xl bg-primary/10" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full blur-3xl bg-accent/10" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
        <section className="hidden lg:flex glass-card border-primary/20 p-8 flex-col justify-between min-h-[640px]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary font-mono-code text-xs uppercase tracking-[0.3em]">
              <Radio className="w-4 h-4" /> Adaptive Control Grid
            </div>
            <h1 className="mt-8 font-display text-5xl leading-tight tracking-[0.16em] neon-text-green">
              TRAFFIC AI
            </h1>
            <p className="mt-4 text-lg text-foreground/90 max-w-xl leading-relaxed">
              Smart junction intelligence with live detection, adaptive signal timing, and analytics synchronized to the active traffic feed.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              [Shield, "Secure operator access", "Role-based entry for admin and operator accounts."],
              [Sparkles, "Live adaptive analytics", "Charts, density, and signal decisions stay tied to the current feed."],
              [LockKeyhole, "Command-grade interface", "High-contrast cyber dashboard designed to match the control-room UI."],
            ].map(([Icon, title, body]) => {
              const Glyph = Icon as typeof Shield;
              return (
                <div key={title} className="rounded-2xl border border-border bg-muted/20 p-4 flex items-start gap-4">
                  <div className="mt-0.5 rounded-xl bg-primary/10 border border-primary/20 p-2 text-primary">
                    <Glyph className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm tracking-[0.22em] text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8 lg:p-10 border-primary/20 shadow-[0_0_40px_rgba(0,255,163,0.08)]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-[28px] border border-primary/20 bg-primary/10 neon-glow-green flex items-center justify-center mb-5">
              <Radio className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-[0.24em] neon-text-green">TRAFFIC AI</h2>
            <p className="text-muted-foreground mt-3 max-w-sm">Smart city traffic management access portal for the live adaptive control system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 tracking-wide">Control Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-secondary/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="admin@traffic.io"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-secondary/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive border border-destructive/20 bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold tracking-[0.24em] text-sm hover:opacity-90 transition-all disabled:opacity-50 neon-glow-green inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  AUTHENTICATING
                </span>
              ) : (
                <>
                  ACCESS SYSTEM <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-mono-code uppercase tracking-[0.28em] text-muted-foreground mb-3">Quick access credentials</p>
            <div className="space-y-3">
              {quickAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillAccount(account)}
                  className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-left hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-xs tracking-[0.22em] text-primary">{account.role}</p>
                      <p className="text-sm text-foreground mt-1">{account.email}</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono-code">{account.password}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
