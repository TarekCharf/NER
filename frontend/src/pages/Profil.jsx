import { useEffect, useState } from "react";
import { Save, User, Mail, AtSign, CheckCircle, XCircle } from "lucide-react";
import userService from "../services/userService";

const inputStyle = {
  width: "100%", padding: "0.625rem 0.875rem 0.625rem 2.5rem",
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

export default function Profil() {
  const [user, setUser] = useState({ username: "", email: "", first_name: "", last_name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    userService.getProfile()
      .then((data) => setUser(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      await userService.updateProfile({ username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name });
      setMsg({ type: "success", text: "Profil mis à jour avec succès !" });
    } catch {
      setMsg({ type: "error", text: "Erreur lors de la mise à jour." });
    } finally { setSaving(false); setTimeout(() => setMsg(null), 4000); }
  };

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "U";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0", color: "var(--text-muted)", fontSize: "0.875rem" }}>
      Chargement du profil…
    </div>
  );

  return (
    <div style={{ maxWidth: "34rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
          Mon Profil
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Gérez vos informations personnelles.
        </p>
      </div>

      {/* ── Avatar card ── */}
      <div style={{
        background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "0.875rem", padding: "1.5rem",
        display: "flex", alignItems: "center", gap: "1.25rem",
      }}>
        <div style={{
          width: "3.5rem", height: "3.5rem", borderRadius: "0.875rem",
          background: "linear-gradient(135deg, #6366f1, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Syne, sans-serif", fontSize: "1.125rem", fontWeight: 800,
          color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.35)",
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {user.first_name || user.username} {user.last_name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            {user.email}
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{
        background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "0.875rem", padding: "1.5rem",
      }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
          Informations du compte
        </div>

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Nom / Prénom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              { key: "last_name", label: "Nom", icon: User },
              { key: "first_name", label: "Prénom", icon: User },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                  {label}
                </label>
                <div style={{ position: "relative" }}>
                  <Icon size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                  <input
                    type="text" value={user[key]}
                    onChange={(e) => setUser({ ...user, [key]: e.target.value })}
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Username */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
              Nom d'utilisateur
            </label>
            <div style={{ position: "relative" }}>
              <AtSign size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input
                type="text" value={user.username} required
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
              Adresse email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input
                type="email" value={user.email} required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
          </div>

          {/* Message */}
          {msg && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 500,
              background: msg.type === "success" ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
              border: `1px solid ${msg.type === "success" ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
              color: msg.type === "success" ? "#34d399" : "#f87171",
            }}>
              {msg.type === "success" ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {msg.text}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.25rem" }}>
            <button
              type="submit" disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                background: saving ? "var(--bg-elevated)" : "linear-gradient(135deg, #6366f1, #7c3aed)",
                border: "none", borderRadius: "0.625rem",
                color: saving ? "var(--text-muted)" : "white",
                fontSize: "0.875rem", fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "DM Sans, sans-serif",
                boxShadow: saving ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
                transition: "all 0.2s",
              }}
            >
              <Save size={14} />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}