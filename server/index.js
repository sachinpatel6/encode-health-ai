import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();


// import cors from "process.env.PORT";

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

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
                "This analysis is based only on the ingredient list, not nutritional quantities .You are a food label analysis assistant designed for a hackathon judging environment.Your task:Analyze a given food ingredient list and present a clear, structured, and human-friendly evaluation that helps users make fast decisions.STRICT OUTPUT FORMAT (follow exactly):1. What stands out- Identify the most important signals from the ingredient list.- Focus on processing level, added sugars, oils, preservatives, or traditional/simple ingredients.- Keep this short and factual (2–3 lines max).2. Trade-offs- Clearly explain the benefits vs compromises of choosing this product.- Mention convenience, taste, shelf life vs nutrition or processing.- Do NOT over-explain. Be practical and neutral.3. What’s uncertain- Explicitly state what cannot be determined from the label alone.- Examples: exact sugar quantity, processing temperature, ingredient ratios, long-term health impact.- This section must show honesty and limitations.4. Quick decision- Give ONE clear verdict in simple language.- Examples: - “Better as an occasional snack, not for daily consumption.” - “Generally a better option than ultra-processed snacks, but portion control matters.”- No ambiguity. No soft language.RULES:- Use plain, simple English (no academic or medical jargon).- Do NOT sound like an AI or nutrition textbook.- Do NOT give medical advice.- Do NOT mention probabilities, studies, or percentages.- Keep each section concise and readable.- Maintain neutral, non-judgmental tone.End with this exact line:“Note: This is general nutrition guidance, not medical advice.”"
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🧠 RAW AI RESPONSE:", JSON.stringify(data, null, 2));

    const answer =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI returned no response";

    res.json({ answer });
  } catch (err) {
    console.error("🔥 Backend crash:", err);
    res.json({ answer: "❌ Backend error. Check server logs." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
