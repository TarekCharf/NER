import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  History,
  User,
  LogOut,
  Zap,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard",    path: "/dashboard",  icon: LayoutDashboard },
  { name: "Labeling IA",  path: "/labeling",   icon: Sparkles },
  { name: "Historique",   path: "/historique", icon: History },
  { name: "Mon Profil",   path: "/profil",     icon: User },
];

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside
      style={{
        width: "15rem",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 20,
      }}
    >
      {/* ── Logo ── */}
      <div>
        <div
          style={{
            height: "4rem",
            display: "flex",
            alignItems: "center",
            padding: "0 1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(99,102,241,0.4)",
            }}
          >
            <Zap size={14} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              NER Platform
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              AI · DARIJA
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav style={{ padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.12em", padding: "0 0.75rem", marginBottom: "0.5rem", textTransform: "uppercase" }}>
            Navigation
          </div>

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "white" : "var(--text-secondary)",
                  background: isActive ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "transparent",
                  boxShadow: isActive ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--accent-subtle)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 1.75} />
                <span>{item.name}</span>
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      right: "0.625rem",
                      width: "0.3rem",
                      height: "0.3rem",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.7)",
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            background: "rgba(45,212,191,0.06)",
            border: "1px solid rgba(45,212,191,0.15)",
            borderRadius: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "0.4rem",
              height: "0.4rem",
              borderRadius: "50%",
              background: "var(--teal)",
              animation: "pulseDot 2s infinite",
            }}
          />
          <span style={{ fontSize: "0.7rem", color: "var(--teal)", fontWeight: 500 }}>
            Modèle IA actif
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            width: "100%",
            padding: "0.6rem 0.75rem",
            background: "rgba(248,113,113,0.05)",
            border: "1px solid rgba(248,113,113,0.12)",
            borderRadius: "0.625rem",
            color: "#f87171",
            fontSize: "0.8125rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "DM Sans, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.10)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.05)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,0.12)";
          }}
        >
          <LogOut size={14} strokeWidth={2} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}