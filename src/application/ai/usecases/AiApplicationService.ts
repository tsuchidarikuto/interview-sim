// src/application/ai/usecases/AiApplicationService.ts

import {
  IAiModelService,
  AiModelCompletionParams,
  StructuredResponse,
} from "@/infrastructure/ai/IAiModelService"; // Corrected path

// Define DTOs for the application service methods
// These might be more specific than the generic AiModelCompletionParams

export interface GenerateQuestionsDto {
  topic: string;
  count: number;
  difficulty?: string; // e.g., "easy", "medium", "hard"
  // Any other params relevant to question generation
}

export interface AnalyzeInterviewDto {
  transcript: string;
  // Potentially include candidate info, job description context, etc.
}

// Expected response structures for the DTOs
export interface Question {
  id: string;
  question: string;
}

export interface InterviewAnalysis {
  feedback: {
    positive: string;
    negative: string;
  };
  score: {
    technical: number;
    communication: number;
    teamwork: number;
    logicalThinking: number;
    learningDesire: number;
    companyUnderstanding: number;
  };
}

export class AiApplicationService {
  private aiModelService: IAiModelService;

  constructor(aiModelService: IAiModelService) {
    this.aiModelService = aiModelService;
  }

  async generateInterviewQuestions(
    dto: GenerateQuestionsDto
  ): Promise<StructuredResponse<{ questions: Question[] }>> {
    const systemContext = `You are an expert interviewer. Generate ${
      dto.count
    } interview questions about ${dto.topic}. Difficulty: ${dto.difficulty || 'medium'}. Ensure IDs are unique strings.`;
    const prompt = `Please provide the questions in the specified format. Topic: ${dto.topic}. Count: ${dto.count}.`;

    return this.aiModelService.getCompletion<{ questions: Question[] }>({
      prompt,
      systemContext,
      schemaName: "questions", // This matches the key in OpenAiService schemas
      modelName: "gpt-3.5-turbo", // Or make this configurable
    });
  }

  async analyzeInterviewPerformance(
    dto: AnalyzeInterviewDto
  ): Promise<StructuredResponse<InterviewAnalysis>> {
    const systemContext =
      "You are an expert interview analyst. Analyze the provided interview transcript and provide structured feedback and scores based on the defined schema. Focus on technical skills, communication, teamwork, logical thinking, learning desire, and company understanding.";
    const prompt = `Interview Transcript:\n${dto.transcript}\n\nPlease provide your analysis.`;

    return this.aiModelService.getCompletion<InterviewAnalysis>({
      prompt,
      systemContext,
      schemaName: "interviewResult", // Matches key in OpenAiService schemas
      modelName: "gpt-4", // Example: using a different model for analysis
    });
  }

  async checkUserResponse(
    prompt: string,
    systemContext?: string
  ): Promise<StructuredResponse<any>> { // Adjust 'any' to a more specific type if available
    return this.aiModelService.getCompletion<any>({ // Adjust 'any'
      prompt,
      systemContext: systemContext || "Analyze the user's response.",
      schemaName: "checkResponse", // Matches key in OpenAiService schemas
    });
  }

  async getGenericCompletion(
    prompt: string,
    systemContext?: string,
    modelName?: string
  ): Promise<StructuredResponse<any>> { // Adjust 'any'
    return this.aiModelService.getCompletion<any>({ // Adjust 'any'
      prompt,
      systemContext,
      modelName,
      responseSchema: null, // Explicitly no schema from our predefined map
    });
  }
}
