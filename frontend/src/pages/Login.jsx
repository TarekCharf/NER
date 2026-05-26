import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import { KeyRound, User, Loader2, Zap } from "lucide-react";

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-base)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "DM Sans, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glow1: {
    position: "absolute", top: "-10rem", left: "50%", transform: "translateX(-50%)",
    width: "40rem", height: "40rem", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute", bottom: "-8rem", right: "-8rem",
    width: "28rem", height: "28rem", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1,
    width: "100%", maxWidth: "22rem",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-default)",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },
  logoWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    marginBottom: "1.75rem", gap: "0.75rem",
  },
  logoIcon: {
    width: "2.75rem", height: "2.75rem", borderRadius: "0.625rem",
    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 24px rgba(99,102,241,0.4)",
  },
  title: {
    fontFamily: "Syne, sans-serif", fontSize: "1.375rem",
    fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em",
  },
  sub: { fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" },
  error: {
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
    color: "#f87171", fontSize: "0.8rem", padding: "0.75rem 1rem",
    borderRadius: "0.5rem", marginBottom: "1rem", fontWeight: 500,
  },
  fieldGroup: { marginBottom: "1rem" },
  label: {
    display: "block", fontSize: "0.7rem", fontWeight: 600,
    color: "var(--text-muted)", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: "0.4rem",
  },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute", left: "0.75rem", top: "50%",
    transform: "translateY(-50%)", color: "var(--text-muted)",
    pointerEvents: "none",
  },
  input: {
    width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem",
    paddingTop: "0.625rem", paddingBottom: "0.625rem",
    background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
    borderRadius: "0.625rem", color: "var(--text-primary)",
    fontSize: "0.875rem", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "0.75rem",
    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
    border: "none", borderRadius: "0.625rem",
    color: "white", fontSize: "0.875rem", fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "0.5rem", marginTop: "1.25rem",
    fontFamily: "DM Sans, sans-serif",
    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
    transition: "opacity 0.2s, transform 0.1s",
  },
  footer: {
    marginTop: "1.25rem", paddingTop: "1.25rem",
    borderTop: "1px solid var(--border-subtle)",
    textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await authService.login(form.username, form.password);
      navigate("/dashboard");
    } catch {
      setError("Identifiants ou mot de passe incorrects.");
    } finally { setLoading(false); }
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "var(--border-subtle)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={S.page}>
      <div style={S.glow1} />
      <div style={S.glow2} />

      <div style={S.card}>
        <div style={S.logoWrap}>
          <div style={S.logoIcon}>
            <Zap size={18} color="white" strokeWidth={2.5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={S.title}>NER Platform</div>
            <div style={S.sub}>Connexion à votre espace Darija NER</div>
          </div>
        </div>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Nom d'utilisateur</label>
            <div style={S.inputWrap}>
              <User size={15} style={S.inputIcon} />
              <input
                type="text" placeholder="Ex: tarek_dev"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={S.input} required
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Mot de passe</label>
            <div style={S.inputWrap}>
              <KeyRound size={15} style={S.inputIcon} />
              <input
                type="password" placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={S.input} required
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading} style={S.btn}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
            {loading ? "Authentification…" : "Se connecter"}
          </button>
        </form>

        <div style={S.footer}>
          Pas encore de compte ?{" "}
          <Link to="/register" style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}>
            S'inscrire
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}