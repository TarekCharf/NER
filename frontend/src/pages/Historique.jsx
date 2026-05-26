import { useEffect, useState } from "react";
import { History, Calendar, Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import nerService from "../services/nerService";

const LABEL_STYLES = {
  PER:  { bg: "rgba(99,102,241,0.12)",  color: "#818cf8",  border: "rgba(99,102,241,0.25)" },
  ORG:  { bg: "rgba(251,191,36,0.10)",  color: "#fbbf24",  border: "rgba(251,191,36,0.22)" },
  LOC:  { bg: "rgba(45,212,191,0.10)",  color: "#2dd4bf",  border: "rgba(45,212,191,0.22)" },
  MISC: { bg: "rgba(167,139,250,0.10)", color: "#a78bfa",  border: "rgba(167,139,250,0.22)" },
};

export default function Historique() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nerService.list()
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
            Historique
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {history.length > 0 ? `${history.length} analyse${history.length > 1 ? "s" : ""} sauvegardée${history.length > 1 ? "s" : ""}` : "Consultez vos phrases labélisées"}
          </p>
        </div>
        {history.length > 0 && (
          <Link to="/labeling" style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.5rem 1rem",
            background: "var(--accent-subtle)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "0.625rem", color: "var(--accent-light)",
            fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
            transition: "all 0.2s",
          }}>
            Nouvelle analyse <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 0", gap: "1rem" }}>
          <div style={{
            width: "1.75rem", height: "1.75rem",
            border: "2px solid var(--border-default)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Chargement de l'historique…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && history.length === 0 && (
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "0.875rem", padding: "4rem 2rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
          maxWidth: "28rem", margin: "2rem auto",
        }}>
          <div style={{
            width: "3rem", height: "3rem", borderRadius: "0.75rem",
            background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <History size={20} color="var(--text-muted)" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem" }}>
              Aucune analyse enregistrée
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              Lancez votre première analyse depuis la section Labeling IA.
            </p>
          </div>
          <Link to="/labeling" style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            borderRadius: "0.625rem", color: "white",
            fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          }}>
            Lancer une analyse <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ── List ── */}
      {!loading && history.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {history.map((item) => (
            <div key={item.id} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
              borderRadius: "0.875rem", padding: "1.25rem 1.5rem",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-active)"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.875rem" }}>
                {/* Texte analysé */}
                <p style={{
                  fontSize: "0.9375rem", color: "var(--text-primary)",
                  fontWeight: 500, lineHeight: 1.6, flex: 1,
                  borderLeft: "2px solid var(--border-active)",
                  paddingLeft: "0.875rem", margin: 0,
                }}>
                  {item.text}
                </p>

                {/* Date */}
                {item.created_at && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    fontSize: "0.7rem", color: "var(--text-muted)",
                    background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                    borderRadius: "0.375rem", padding: "0.25rem 0.625rem",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    <Calendar size={10} />
                    {new Date(item.created_at).toLocaleDateString("fr-FR")}
                  </div>
                )}
              </div>

              {/* Entities */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {item.entities?.length > 0 ? (
                  item.entities.map((ent) => {
                    const s = LABEL_STYLES[ent.label] || LABEL_STYLES.PER;
                    return (
                      <span key={ent.id} style={{
                        display: "inline-flex", alignItems: "center", gap: "0.375rem",
                        padding: "0.25rem 0.625rem",
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.border}`,
                        borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: 600,
                      }}>
                        <Layers size={10} />
                        {ent.text}
                        <span style={{ opacity: 0.6, fontSize: "0.7rem", fontWeight: 400 }}>
                          · {ent.label_display || ent.label}
                        </span>
                      </span>
                    );
                  })
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    Aucune entité détectée
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}