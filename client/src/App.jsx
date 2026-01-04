import { useState } from "react";
import Chat from "./chat";

export default function App() {
  const [start, setStart] = useState(false);

  if (!start) {
    return (
     <div style={styles.landing}>
  <div style={styles.landingCard}>
    <h1 style={styles.title}>Eat Smarter. Instantly.</h1>

    <p style={styles.subtitle}>
      Paste any food label and get clear, honest ingredient insights in seconds.
    </p>

    <button style={styles.primaryBtn} onClick={() => setStart(true)}>
      Analyze Ingredients
    </button>

    <p style={styles.footerText}>
      Built for Encode 2026 • IIT Guwahati
    </p>
  </div>
</div>

    );
  }

  return <Chat />;
}

const styles = {

  landing: {
    minHeight: "100vh",
    background: "#f7f9fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  landingCard: {
    background: "#ffffff",
    padding: "40px 36px",
    borderRadius: "20px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1e7f43",
  },
  subtitle: {
    fontSize: "15px",
    color: "#555",
    marginBottom: "28px",
    lineHeight: "1.6",
  },
  primaryBtn: {
    background: "#1e7f43",
    color: "#fff",
    border: "none",
    padding: "14px 26px",
    fontSize: "15px",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
  },
  footerText: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#888",
  },
};

