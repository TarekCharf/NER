import { Bell, Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import userService from "../services/userService";

export default function Header() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    userService.getProfile().then((res) => {setUser(res.data || res)}).catch(() => {});
  }, []);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header
      style={{
        height: "3.75rem",
        background: "rgba(8, 11, 20, 0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "fixed",
        top: 0,
        right: 0,
        left: "15rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
        zIndex: 10,
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", width: "18rem" }}>
        <Search
          size={13}
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une phrase…"
          style={{
            width: "100%",
            paddingLeft: "2.25rem",
            paddingRight: "1rem",
            paddingTop: "0.45rem",
            paddingBottom: "0.45rem",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "0.625rem",
            color: "var(--text-primary)",
            fontSize: "0.8125rem",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            fontFamily: "DM Sans, sans-serif",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-subtle)";
            e.target.style.boxShadow = "none";
          }}
        />
        {query && (
          <kbd
            style={{
              position: "absolute",
              right: "0.6rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.6rem",
              color: "var(--text-muted)",
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.25rem",
              padding: "0.1rem 0.35rem",
            }}
          >
            ↵
          </kbd>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Notification bell */}
        <button
          style={{
            position: "relative",
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            borderRadius: "0.5rem",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-elevated)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
          onClick={() => setHasNotif(false)}
        >
          <Bell size={14} strokeWidth={1.75} />
          {hasNotif && (
            <span
              style={{
                position: "absolute",
                top: "0.3rem",
                right: "0.3rem",
                width: "0.4rem",
                height: "0.4rem",
                background: "var(--accent)",
                borderRadius: "50%",
                border: "1.5px solid var(--bg-base)",
              }}
            />
          )}
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "1.25rem", background: "var(--border-subtle)" }} />

        {/* User avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.3rem 0.625rem 0.3rem 0.3rem",
            borderRadius: "0.625rem",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "0.375rem",
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6875rem",
              fontWeight: 700,
              color: "white",
              fontFamily: "Syne, sans-serif",
              boxShadow: "0 0 8px rgba(99,102,241,0.3)",
            }}
          >
            {initials}
          </div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            {user?.username || "Utilisateur"}
          </span>
          <ChevronDown size={12} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}