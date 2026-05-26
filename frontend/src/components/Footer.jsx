export default function Footer() {
  return (
    <footer
      style={{
        height: "3rem",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
        background: "var(--bg-surface)",
      }}
    >
      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
        © {new Date().getFullYear()}{" "}
        <span style={{ color: "var(--text-secondary)" }}>NER Platform</span>
        {" "}· Darija NER AI
      </span>

      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        {["Conditions", "Confidentialité", "Support"].map((label) => (
          <a
            key={label}
            href="#"
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}