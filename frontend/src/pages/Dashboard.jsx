import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/userService";
import nerService from "../services/nerService";
import { Sparkles, ListCheck, Activity, RefreshCw, ArrowRight } from "lucide-react";

const cardAccents = [
  { color: "#6366f1", glow: "rgba(99,102,241,0.15)", icon: ListCheck, iconColor: "#818cf8" },
  { color: "#8b5cf6", glow: "rgba(139,92,246,0.15)", icon: Sparkles, iconColor: "#a78bfa" },
  { color: "#2dd4bf", glow: "rgba(45,212,191,0.12)", icon: Activity, iconColor: "#2dd4bf" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total_sentences: 0, total_entities: 0, precision_rate: "—" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile().then((res) => {setUser(res.data || res)}).catch(() => navigate("/login"));
    nerService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const cards = [
    { label: "Phrases analysées", value: stats.total_sentences, sub: "Données temps réel" },
    { label: "Entités détectées", value: stats.total_entities, sub: "PER · LOC · ORG" },
    { label: "Précision IA", value: stats.precision_rate, sub: "Modèle Darija NER" },
  ];

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 0", gap: "1rem" }}>
      <RefreshCw size={24} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Chargement du tableau de bord…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ── Greeting ── */}
      <div>
        <h1 style={{
          fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800,
          color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.4rem",
        }}>
          Bonjour, {user?.username || "Utilisateur"} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Vue d'ensemble de vos analyses de reconnaissance d'entités nommées.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {cards.map((card, i) => {
          const accent = cardAccents[i];
          const Icon = accent.icon;
          return (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.875rem", padding: "1.25rem 1.5rem",
              position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, transform 0.2s",
              cursor: "default",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-active)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Background glow */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: "8rem", height: "8rem", borderRadius: "50%",
                background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`,
                transform: "translate(30%, -30%)", pointerEvents: "none",
              }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
                    {card.label}
                  </div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: accent.iconColor, marginTop: "0.5rem", fontWeight: 500 }}>
                    {card.sub}
                  </div>
                </div>
                <div style={{
                  width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem",
                  background: `${accent.glow}`, border: `1px solid ${accent.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={accent.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CTA banner ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(45,212,191,0.05))",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0.875rem", padding: "1.5rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem",
      }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Analyser un nouveau texte
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            Soumettez une phrase en Darija pour extraire automatiquement les entités nommées.
          </div>
        </div>
        <Link to="/labeling" style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.625rem 1.25rem",
          background: "linear-gradient(135deg, #6366f1, #7c3aed)",
          borderRadius: "0.625rem", color: "white",
          fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          Labeling IA <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}