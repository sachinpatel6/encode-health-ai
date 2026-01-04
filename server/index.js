import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

/* ✅ CORS – MOBILE + DESKTOP SAFE */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

/* ✅ API ROUTE */
app.post("/ask", async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) {
      return res.json({ answer: "❌ No input received" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Analyze food ingredients and give simple health guidance. End with: Note: This is general nutrition guidance, not medical advice."
            },
            {
              role: "user",
              content: text
            }
          ]
        }),
      }
    );

    const data = await response.json();
    const answer =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI returned no response";

    res.json({ answer });

  } catch (err) {
    console.error("🔥 Backend crash:", err);
    res.json({ answer: "❌ Backend error. Check server logs." });
  }
});

/* ✅ PORT FOR RAILWAY */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
