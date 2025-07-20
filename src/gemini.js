let apiKey = "AIzaSyC5OYkPP0ASDdJ2oE1y6mZ22wSzgrZoCk4";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function askGemini(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response.text();
    console.log("Gemini:", response);
    return response;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, something went wrong while generating a response.";
  }
}

export default askGemini;