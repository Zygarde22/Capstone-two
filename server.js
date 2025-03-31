"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mime = require("mime-types");  // Add mime module to handle file extensions
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Set up the Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // or use another available model
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

app.use(cors());
app.use(express.json());

// POST endpoint to handle chatbot interactions
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "No message provided." });
  }

  try {
    // Start a new chat session with the Gemini API
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(message);

    // Extract the chatbot's response from the result
    const candidates = result.response.candidates;
    let botResponse = "Sorry, I couldn't get a response.";

    // Loop through candidates and get the text response
    for (let candidate of candidates) {
      for (let part of candidate.content.parts) {
        if (part.inlineData) {
          // If inline data (such as a file), save it
          const mimeType = part.inlineData.mimeType;
          const extension = mime.extension(mimeType);
          const filename = `output_${candidate.index}_${part.index}.${extension}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        }
      }

      // Get the main text response (if available)
      if (candidate.content.text) {
        botResponse = candidate.content.text;
        break; // Stop after finding the first valid response
      }
    }

    res.json({ message: botResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Error with the chatbot." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
