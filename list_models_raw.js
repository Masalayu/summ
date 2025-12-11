import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCY3PakdavPezIQpJb9Db4JiYWcSw4tDsc";

// Using fetch directly to list models
async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models for generateContent:");
            data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => {
                console.log(`- ${m.name}`);
            });
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
