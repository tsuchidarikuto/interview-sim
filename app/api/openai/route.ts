import { NextResponse, NextRequest } from 'next/server';
import { AiApplicationService } from '@/application/ai/usecases/AiApplicationService';
import { OpenAiService } from '@/infrastructure/ai/OpenAiService';
import { StructuredResponse } from '@/infrastructure/ai/IAiModelService';

// Instantiate services
// In a real app, use dependency injection or a service locator.
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY is not set. AI functionality will be disabled.");
  // Optionally throw an error to prevent startup if AI is critical
  // throw new Error("OPENAI_API_KEY is not set.");
}

const openAiService = apiKey ? new OpenAiService(apiKey) : null;
const aiApplicationService = openAiService ? new AiApplicationService(openAiService) : null;

interface ApiRequestPayload {
  prompt: string;
  model?: string; // Will be handled by AiApplicationService or OpenAiService defaults
  system?: string;
  schemaName?: 'questions' | 'interviewResult' | 'checkResponse' | 'undefined' | string; // Making it more flexible
  // Add other specific DTO fields if needed, e.g., for GenerateQuestionsDto
  topic?: string;
  count?: number;
  difficulty?: string;
  transcript?: string;
}

export async function POST(req: NextRequest) {
  if (!aiApplicationService) {
    return NextResponse.json(
      { error: "AI service is not configured due to missing API key." },
      { status: 503 } // Service Unavailable
    );
  }

  try {
    const body = (await req.json()) as ApiRequestPayload;
    const { prompt, system, schemaName, model, topic, count, difficulty, transcript } = body;

    let response: StructuredResponse<any>;

    switch (schemaName) {
      case 'questions':
        if (!topic || count === undefined) {
          return NextResponse.json(
            { error: "Missing 'topic' or 'count' for questions schema" },
            { status: 400 }
          );
        }
        response = await aiApplicationService.generateInterviewQuestions({
          topic,
          count,
          difficulty,
          // prompt is not directly used here, system context is built in service
        });
        break;
      case 'interviewResult':
        if (!transcript) {
          return NextResponse.json(
            { error: "Missing 'transcript' for interviewResult schema" },
            { status: 400 }
          );
        }
        response = await aiApplicationService.analyzeInterviewPerformance({
          transcript,
        });
        break;
      case 'checkResponse':
        // This use case might need a more specific DTO if it evolves
        response = await aiApplicationService.checkUserResponse(prompt, system);
        break;
      case 'undefined':
      case undefined: // Handle generic completion if no schema or 'undefined'
        response = await aiApplicationService.getGenericCompletion(
          prompt,
          system,
          model
        );
        break;
      default:
        // Fallback for any other schemaName, assuming generic completion
        // Or return an error if strict schema matching is required:
        // return NextResponse.json({ error: `Unknown schemaName: ${schemaName}` }, { status: 400 });
        console.warn(`Unknown schemaName: ${schemaName}, using generic completion.`);
        response = await aiApplicationService.getGenericCompletion(
          prompt,
          system,
          model
        );
        break;
    }

    if (response.success) {
      // The 'data' from StructuredResponse is the actual payload (e.g., the object from zodResponseFormat)
      // The original API returned the full OpenAI response object.
      // To maintain compatibility or if the client expects the full OpenAI object,
      // we might need to adjust what AiApplicationService or IAiModelService returns,
      // or specifically return response.rawResponse here.
      // For now, returning the processed data.
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: response.error, details: response.rawResponse },
        { status: 500 }
      );
    }
  } catch (e: any) {
    console.error(`Error in API endpoint: ${e.message}`);
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 });
  }
}