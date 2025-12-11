import OpenAI from 'openai';
const client = new OpenAI({ apiKey: 'test' });
console.log('client.responses is:', client.responses);
