import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Zone principale */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingLeft: "15rem",
          minHeight: "100vh",
        }}
      >
        <Header />

        <main
          className="fade-up"
          style={{
            flex: 1,
            padding: "2rem",
            paddingTop: "5.75rem",  /* header height + gap */
            maxWidth: "72rem",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}