import { useEffect, useState } from "react";
import {
  User,
  Mail,
  AtSign,
  CheckCircle,
  XCircle,
  Pencil,
  Save,
  X,
} from "lucide-react";
import userService from "../services/userService";

const inputStyle = {
  width: "100%",
  padding: "0.625rem 0.875rem 0.625rem 2.5rem",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "0.625rem",
  color: "var(--text-primary)",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "DM Sans, sans-serif",
  boxSizing: "border-box",
};

const readonlyBoxStyle = {
  width: "100%",
  padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "0.625rem",
  color: "var(--text-primary)",
  fontSize: "0.875rem",
  position: "relative",
  fontFamily: "DM Sans, sans-serif",
  boxSizing: "border-box",
};

const iconStyle = {
  position: "absolute",
  left: "0.875rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-muted)",
};

export default function Profil() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Nouveaux états pour la gestion du mot de passe dans le modal
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    userService
      .getProfile()
      .then((res) => {
        setProfile(res.data || res);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du profil", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    userService
      .updateProfile(profile)
      .then((res) => {
        setProfile(res.data || res);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour du profil", err);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // Nouvelle fonction pour soumettre le changement de mot de passe
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setSaving(true);
    userService
      .changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      })
      .then(() => {
        setPasswordSuccess("Votre mot de passe a été modifié avec succès !");
        setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        // Ferme le modal après 2 secondes
        setTimeout(() => {
          closeModal();
        }, 2000);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.old_password?.[0] || "Une erreur est survenue lors du changement.";
        setPasswordError(errMsg);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          color: "var(--text-muted)",
        }}
      >
        Chargement des informations...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "DM Sans, sans-serif",
        textAlign: "left",
      }}
    >
      {/* En-tête du profil */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "between",
          gap: "1.5rem",
          marginBottom: "2.5rem",
          background: "var(--bg-card)",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "1.75rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
          }}
        >
          {profile?.username ? profile.username[0] : "U"}
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            {profile?.first_name && profile?.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : profile?.username}
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0 0",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            Utilisateur de la plateforme NER
          </p>
        </div>

        <button
          onClick={openModal}
          style={{
            padding: "0.6rem 1rem",
            background: "transparent",
            border: "1px solid #6366f1",
            borderRadius: "0.5rem",
            color: "#6366f1",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
            transition: "all 0.2s",
          }}
        >
          Sécurité & MDP
        </button>
      </div>

      {/* Contenu principal / Formulaire */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "1rem",
          border: "1px solid var(--border-color)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.15rem",
              color: "var(--text-primary)",
              fontWeight: 600,
            }}
          >
            Informations personnelles
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              <Pencil size={14} />
              Modifier
            </button>
          )}
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {/* Username - Readonly */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Nom d'utilisateur
              </label>
              <div style={readonlyBoxStyle}>
                <AtSign size={16} style={iconStyle} />
                {profile?.username}
              </div>
            </div>

            {/* Email - Readonly */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Adresse email
              </label>
              <div style={readonlyBoxStyle}>
                <Mail size={16} style={iconStyle} />
                {profile?.email}
              </div>
            </div>

            {/* Prénom */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Prénom
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={iconStyle} />
                <input
                  type="text"
                  name="first_name"
                  value={profile?.first_name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    ...inputStyle,
                    border: isEditing ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
                    background: isEditing ? "var(--bg-card)" : "var(--bg-elevated)",
                  }}
                  placeholder="Non renseigné"
                />
              </div>
            </div>

            {/* Nom */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Nom de famille
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={iconStyle} />
                <input
                  type="text"
                  name="last_name"
                  value={profile?.last_name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    ...inputStyle,
                    border: isEditing ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
                    background: isEditing ? "var(--bg-card)" : "var(--bg-elevated)",
                  }}
                  placeholder="Non renseigné"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "0.65rem 1.2rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  background: "transparent",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.5rem",
                  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <Save size={14} />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FENÊTRE MODALE : Formulaire de Modification de Mot de Passe */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              width: "100%",
              maxWidth: "420px",
              borderRadius: "1rem",
              border: "1px solid var(--border-color)",
              padding: "2rem",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <h3
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: "1.25rem",
                color: "var(--text-primary)",
                fontWeight: 700,
              }}
            >
              Sécurité du compte
            </h3>

            {/* Messages d'erreur ou de succès */}
            {passwordError && (
              <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.5rem", color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div style={{ padding: "0.75rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "0.5rem", color: "#10b981", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  Ancien mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "1rem" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "1rem" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "1rem" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1rem",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "1.25rem",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "0.65rem 1rem",
                    borderRadius: "0.65rem",
                    border: "1px solid var(--border-subtle)",
                    background: "transparent",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 1.2rem",
                    background: saving
                      ? "var(--bg-elevated)"
                      : "linear-gradient(135deg, #6366f1, #7c3aed)",
                    border: "none",
                    borderRadius: "0.65rem",
                    color: "white",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                  }}
                >
                  <Save size={14} />
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}