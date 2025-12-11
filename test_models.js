import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCY3PakdavPezIQpJb9Db4JiYWcSw4tDsc";
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = [
    "gemini-2.5-flash",
    "gemini-1.0-pro",
    "gemini-pro-vision"
];

async function testModels() {
    console.log("Testing models...");
    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log("SUCCESS");
        } catch (error) {
            console.log(`FAILED: ${error.message.split('\n')[0]}`); // Print first line of error
        }
    }
}

testModels();
