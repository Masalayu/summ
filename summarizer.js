import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

// Configuration
const API_KEY = "AIzaSyCY3PakdavPezIQpJb9Db4JiYWcSw4tDsc"; // Replace with your actual Gemini API key

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


async function extractText(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (ext === '.txt') {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            throw new Error("Unsupported file format.");
        }
    } catch (error) {
        throw new Error(`Error extracting text: ${error.message}`);
    }
}

async function summarizeText(text) {
    try {
        const prompt = `
        Tolong buatkan ringkasan yang komprehensif namun padat dari teks berikut. 
        Ringkasan harus menangkap poin-poin utama dan ide-ide penting.
        Gunakan bahasa yang sama dengan teks asli (jika teks Indonesia, ringkas dalam Indonesia).
        
        Teks:
        ${text}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return summary;
    } catch (error) {
        throw new Error(`Error during summarization: ${error.message}`);
    }
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log(JSON.stringify({ error: "No file path provided." }));
        process.exit(1);
    }

    const filePath = args[0];

    try {
        const text = await extractText(filePath);
        if (!text || !text.trim()) {
            console.log(JSON.stringify({ error: "Could not extract text or file is empty." }));
            process.exit(1);
        }

        const summary = await summarizeText(text);
        console.log(JSON.stringify({ summary: summary }));

    } catch (error) {
        console.log(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
}

main();
