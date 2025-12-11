import OpenAI from 'openai';

// Configuration
const API_KEY = "AIzaSyCY3PakdavPezIQpJb9Db4JiYWcSw4tDsc"; // Replace with your actual API key

const client = new OpenAI({
    apiKey: API_KEY,
});

async function listModels() {
    try {
        const list = await client.models.list();
        console.log("Available OpenAI Models:");
        for await (const model of list) {
            console.log(`- ${model.id}`);
        }
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
