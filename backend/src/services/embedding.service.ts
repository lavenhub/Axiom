import { openai, EMBEDDING_MODEL } from '../config/openai.js';

export class EmbeddingService {
  static async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return response.data[0].embedding;
  }
}
