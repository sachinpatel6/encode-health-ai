import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  async function send() {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const res = await fetch("https://encode-health-ai-production.up.railway.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      const blocks = data.answer
        .split("\n\n")
        .filter((b) => b.trim() !== "");

      const aiMsg = {
        from: "ai",
        blocks: blocks,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch  {
      setMessages((prev) => [
        ...prev,
        { from: "ai", blocks: ["Something went wrong. Please try again."] },
      ]);
    }

    setTyping(false);
    setInput("");
  }

  return (
    <div style={styles.chat}>
      {/* HEADER */}
      <header style={styles.header}>
        🥗 Ask Before You Eat
        <div style={styles.subHeader}>
          Paste ingredients. Get clarity. Decide smarter.
        </div>
      </header>

      {/* MESSAGES */}
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={m.from === "user" ? styles.userBubble : styles.aiWrapper}
          >
            {m.from === "ai" ? (
              m.blocks.map((block, idx) => (
                <div key={idx} style={styles.aiCard}>
                  {block.split("\n").map((line, l) => (
                    <p key={l} style={{ margin: "6px 0" }}>
                      {line}
                    </p>
                  ))}
                </div>
              ))
            ) : (
              <p>{m.text}</p>
            )}
          </div>
        ))}

        {typing && (
          <p style={{ color: "#777", fontSize: "14px" }}>
            ⏳ Analyzing ingredients…
          </p>
        )}
      </div>

      {/* INPUT AREA */}
      <div style={styles.inputArea}>
        <textarea
          style={styles.textarea}
          placeholder={`Paste ingredients exactly as on food label

Example:
Whole wheat flour, sugar, refined palm oil, honey, salt, natural flavours`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button style={styles.sendBtn} onClick={send}>
          Analyze
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  chat: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "sans-serif",
    background: "#f7f9fb",
  },

  header: {
    padding: "16px",
    fontSize: "22px",
    fontWeight: "700",
    background: "#1e7f43",
    color: "white",
    textAlign: "center",
  },

  subHeader: {
    fontSize: "13px",
    fontWeight: "400",
    marginTop: "4px",
    opacity: 0.9,
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    paddingBottom: "140px",
  },

  aiWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "20px",
  },

  aiCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "16px 18px",
    border: "1px solid #e6e6e6",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    maxWidth: "820px",
    lineHeight: "1.6",
  },

  userBubble: {
    background: "#2e7d32",
    color: "white",
    padding: "12px 16px",
    borderRadius: "14px",
    marginLeft: "auto",
    marginBottom: "16px",
    maxWidth: "70%",
    lineHeight: "1.5",
  },

  inputArea: {
    display: "flex",
    gap: "12px",
    padding: "14px",
    borderTop: "1px solid #ddd",
    background: "white",
  },

  textarea: {
    flex: 1,
    minHeight: "120px",
    resize: "vertical",
    padding: "14px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none",
    lineHeight: "1.6",
  },

  sendBtn: {
    background: "#1e7f43",
    color: "white",
    border: "none",
    padding: "14px 22px",
    fontSize: "15px",
    borderRadius: "10px",
    cursor: "pointer",
    height: "fit-content",
  },
};
