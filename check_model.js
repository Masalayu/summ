import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDfcV8noNOnqEDrfqeMFQM-2FqPZY85cYw";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // For the current SDK version, we might not have a direct listModels method exposed easily 
        // on the main entry point in all versions, but let's try the standard way or just test a known fallback.
        // Actually, the error message suggested: "Call ListModels to see the list of available models".
        // The Node SDK might not have a direct 'listModels' helper on 'genAI' in all versions, 
        // but let's try to just test 'gemini-pro' which is the standard stable model.

        // Instead of complex listing which might fail if SDK differs, let's just try to generate with 'gemini-pro'
        // to see if it works.

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("gemini-pro works:", response.text());

    } catch (error) {
        console.error("Error testing gemini-pro:", error.message);
    }
}

listModels();
