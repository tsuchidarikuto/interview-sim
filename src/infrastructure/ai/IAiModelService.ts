// src/infrastructure/ai/IAiModelService.ts

// Define a generic structure for schema-based responses
// This can be expanded or made more specific as needed.
export interface StructuredResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: any; // To store the original response from the AI provider
}

export interface AiModelCompletionParams {
  prompt: string;
  systemContext?: string;
  modelName?: string; // e.g., "gpt-3.5-turbo", "gemini-pro"
  // eslint-disable-next-line @typescript-eslint/ban-types
  responseSchema?: object | null; // Zod schema or similar for structured output
  schemaName?: string; // Name of the schema, if using a map/registry
}

export interface IAiModelService {
  getCompletion<T = any>(
    params: AiModelCompletionParams
  ): Promise<StructuredResponse<T>>;

  // Could add other methods like:
  // getStreamingCompletion(params: AiModelCompletionParams): AsyncIterable<string>;
  // generateEmbeddings(text: string): Promise<number[]>;
}
