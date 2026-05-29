require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User Message:", message);

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Give short and clear answers in 3-5 lines unless the user asks for detailed explanations.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices[0].message.content;

    console.log("AI Reply:", reply);

    res.json({
      reply,
    });

  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    res.status(500).json({
      reply:
        error.message ||
        "Something went wrong",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});