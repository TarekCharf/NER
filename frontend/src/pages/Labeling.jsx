import { useState } from "react";
import { Brain, Send, Loader2, Tag, Sparkles } from "lucide-react";
import nerService from "../services/nerService";

const LABEL_STYLES = {
  PER:  { bg: "rgba(99,102,241,0.12)", color: "#818cf8",  border: "rgba(99,102,241,0.25)" },
  ORG:  { bg: "rgba(251,191,36,0.10)", color: "#fbbf24",  border: "rgba(251,191,36,0.22)" },
  LOC:  { bg: "rgba(45,212,191,0.10)", color: "#2dd4bf",  border: "rgba(45,212,191,0.22)" },
  MISC: { bg: "rgba(167,139,250,0.10)", color: "#a78bfa", border: "rgba(167,139,250,0.22)" },
  O:    { bg: "rgba(139,148,158,0.10)", color: "#8b93b0",  border: "rgba(139,148,158,0.20)" },
};

const LABEL_NAMES = { PER: "Personne", ORG: "Organisation", LOC: "Lieu", MISC: "Divers", O: "Autre" };

export default function Labeling() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const response = await nerService.analyze({ text: text.trim() });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de l'analyse.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
          Analyse & Labeling IA
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Soumettez un texte en Darija pour extraire automatiquement les entités nommées.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", alignItems: "start" }}>

        {/* ── Input panel ── */}
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "0.875rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Brain size={16} color="var(--accent-light)" />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Texte à analyser
            </span>
          </div>

          <form onSubmit={handleAnalyze} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Exemple : Mohammed Benali kayn f Casablanca, khdam f Maroc Telecom men 2020..."
              required
              style={{
                width: "100%", padding: "0.875rem 1rem",
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: "0.625rem", color: "var(--text-primary)",
                fontSize: "0.9rem", fontFamily: "DM Sans, sans-serif",
                resize: "vertical", outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                lineHeight: 1.7, boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-subtle)"; e.target.style.boxShadow = "none"; }}
            />

            {error && (
              <div style={{
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                color: "#f87171", fontSize: "0.8rem", padding: "0.75rem 1rem",
                borderRadius: "0.5rem", fontWeight: 500,
              }}>{error}</div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit" disabled={loading || !text.trim()}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.625rem 1.25rem",
                  background: loading || !text.trim()
                    ? "var(--bg-elevated)"
                    : "linear-gradient(135deg, #6366f1, #7c3aed)",
                  border: "none", borderRadius: "0.625rem",
                  color: loading || !text.trim() ? "var(--text-muted)" : "white",
                  fontSize: "0.875rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  boxShadow: loading || !text.trim() ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
                  transition: "all 0.2s",
                }}
              >
                {loading
                  ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Analyse en cours…</>
                  : <><Sparkles size={15} /> Lancer la prédiction</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* ── Results panel ── */}
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "0.875rem", padding: "1.5rem",
          minHeight: "16rem", display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Tag size={14} color="var(--teal)" />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Entités détectées
            </span>
            {result?.entities?.length > 0 && (
              <span style={{
                marginLeft: "auto", fontSize: "0.7rem", fontWeight: 600,
                background: "rgba(45,212,191,0.1)", color: "var(--teal)",
                border: "1px solid rgba(45,212,191,0.2)",
                borderRadius: "9999px", padding: "0.1rem 0.5rem",
              }}>
                {result.entities.length}
              </span>
            )}
          </div>

          {!result && !loading && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", color: "var(--text-muted)" }}>
              <Brain size={32} style={{ opacity: 0.3 }} />
              <span style={{ fontSize: "0.8rem", textAlign: "center" }}>
                Lancez une analyse pour voir les entités extraites
              </span>
            </div>
          )}

          {loading && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <Loader2 size={28} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Le modèle extrait les entités…</span>
            </div>
          )}

          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {result.entities?.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Aucune entité détectée dans ce texte.
                </p>
              ) : (
                result.entities.map((entity) => {
                  const style = LABEL_STYLES[entity.label] || LABEL_STYLES.O;
                  return (
                    <div key={entity.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.625rem 0.875rem",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "0.5rem",
                    }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>
                        {entity.text}
                      </span>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700,
                        background: style.bg, color: style.color,
                        border: `1px solid ${style.border}`,
                        borderRadius: "0.375rem", padding: "0.15rem 0.5rem",
                        letterSpacing: "0.04em",
                      }}>
                        {LABEL_NAMES[entity.label] || entity.label_display}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}