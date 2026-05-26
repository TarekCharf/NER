import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/userService";
import authService from "../services/authService";
import { Mail, User, KeyRound, Loader2, Zap } from "lucide-react";

const inputBase = {
  width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem",
  paddingTop: "0.625rem", paddingBottom: "0.625rem",
  background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
  borderRadius: "0.625rem", color: "var(--text-primary)",
  fontSize: "0.875rem", outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
};

const focusStyle = (e) => {
  e.target.style.borderColor = "var(--accent)";
  e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
};
const blurStyle = (e) => {
  e.target.style.borderColor = "var(--border-subtle)";
  e.target.style.boxShadow = "none";
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userService.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      });
      
      // Stockage automatique des tokens fournis par la vue Django
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        setError(data.username?.[0] || data.email?.[0] || data.password?.[0] || "Données invalides.");
      } else {
        setError("Impossible de lier le serveur d'authentification.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const fields = [
    { key: "username", label: "Nom d'utilisateur", type: "text", placeholder: "Ex: omar_7", icon: User },
    { key: "email",    label: "Adresse email",      type: "email", placeholder: "nom@exemple.com", icon: Mail },
    { key: "password", label: "Mot de passe",       type: "password", placeholder: "Minimum 8 caractères", icon: KeyRound },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-base)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "DM Sans, sans-serif", position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glows */}
      <div style={{
        position: "absolute", top: "-12rem", left: "50%", transform: "translateX(-50%)",
        width: "44rem", height: "44rem", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-6rem", left: "-6rem",
        width: "28rem", height: "28rem", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "22rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "1rem", padding: "2rem",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.75rem", gap: "0.75rem" }}>
          <div style={{
            width: "2.75rem", height: "2.75rem", borderRadius: "0.625rem",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(99,102,241,0.4)",
          }}>
            <Zap size={18} color="white" strokeWidth={2.5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Créer un compte
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Rejoignez la plateforme NER
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
            color: "#f87171", fontSize: "0.8rem", padding: "0.75rem 1rem",
            borderRadius: "0.5rem", marginBottom: "1rem", fontWeight: 500,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block", fontSize: "0.7rem", fontWeight: 600,
                color: "var(--text-muted)", letterSpacing: "0.08em",
                textTransform: "uppercase", marginBottom: "0.4rem",
              }}>{label}</label>
              <div style={{ position: "relative" }}>
                <Icon size={15} style={{
                  position: "absolute", left: "0.75rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
                }} />
                <input
                  type={type} placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={inputBase} required
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "0.75rem",
              background: loading ? "var(--bg-elevated)" : "linear-gradient(135deg, #6366f1, #7c3aed)",
              border: "none", borderRadius: "0.625rem",
              color: loading ? "var(--text-muted)" : "white",
              fontSize: "0.875rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              marginTop: "1.25rem", fontFamily: "DM Sans, sans-serif",
              boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
              transition: "all 0.2s",
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
            {loading ? "Création du compte…" : "S'inscrire et se connecter"}
          </button>
        </form>

        <div style={{
          marginTop: "1.25rem", paddingTop: "1.25rem",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)",
        }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}>
            Se connecter
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}