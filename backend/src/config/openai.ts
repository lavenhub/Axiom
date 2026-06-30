import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const GPT_MODEL = 'llama3-8b-8192';
