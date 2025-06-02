// src/infrastructure/ai/OpenAiService.ts

import { OpenAI } from "openai";
import { zodResponseFormat }_from "openai/helpers/zod.mjs";
import { z } from "zod";
import {
  IAiModelService,
  AiModelCompletionParams,
  StructuredResponse,
} from "./IAiModelService";

// Define the schemas that were in the original API route
// This could be moved to a shared location or a schema registry if they grow
const schemas = {
  questions: z.object({
    questions: z.array(
      z.object({
        id: z.string(),
        question: z.string(),
      })
    ),
  }),
  interviewResult: z.object({
    feedback: z.object({
      positive: z.string(),
      negative: z.string(),
    }),
    score: z.object({
      technical: z.number(),
      communication: z.number(),
      teamwork: z.number(),
      logicalThinking: z.number(),
      learningDesire: z.number(),
      companyUnderstanding: z.number(),
    }),
  }),
  checkResponse: z.object({
    isSubjectEnd: z.boolean(),
    interest: z.number(),
    isInjected: z.boolean(),
    response: z.string(),
  }),
};

export class OpenAiService implements IAiModelService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required.");
    }
    this.openai = new OpenAI({ apiKey });
  }

  public async getCompletion<T = any>(
    params: AiModelCompletionParams
  ): Promise<StructuredResponse<T>> {
    const {
      prompt,
      systemContext,
      modelName = "gpt-3.5-turbo", // Default model
      responseSchema, // This would be the actual Zod schema object
      schemaName, // This is the name to look up in our predefined `schemas` map
    } = params;

    let resolvedSchema: z.ZodSchema | undefined = undefined;

    if (responseSchema) {
      // If a schema object is directly provided, use it
      resolvedSchema = responseSchema as z.ZodSchema;
    } else if (schemaName && schemas[schemaName as keyof typeof schemas]) {
      // Otherwise, try to find it in our predefined map
      resolvedSchema = schemas[schemaName as keyof typeof schemas];
    }

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      if (systemContext) {
        messages.push({ role: "system", content: systemContext });
      }
      messages.push({ role: "user", content: prompt });

      const completion = await this.openai.chat.completions.create({
        model: modelName,
        messages: messages,
        response_format: resolvedSchema
          ? zodResponseFormat(resolvedSchema, schemaName || "schema") // schemaName is just a label here
          : undefined,
      });

      // The response from zodResponseFormat is already parsed if a schema is used.
      // If no schema, `completion.choices[0]?.message?.content` is the string.
      const messageContent = completion.choices[0]?.message?.content;

      let dataToReturn: T | undefined = undefined;
      if (resolvedSchema) {
        // zodResponseFormat directly returns the parsed object.
        // It might be nested if the schema itself is complex.
        // For the given schemas, the result seems to be directly the object.
        dataToReturn = messageContent as T;
      } else if (messageContent) {
        // If no schema, try to parse if it looks like JSON, otherwise return as string.
        // This part might need refinement based on expected non-schema responses.
        try {
          dataToReturn = JSON.parse(messageContent) as T;
        } catch (e) {
          // If not JSON, return as string (assuming T could be string)
          dataToReturn = messageContent as unknown as T;
        }
      }


      return {
        success: true,
        data: dataToReturn,
        rawResponse: completion,
      };
    } catch (error: any) {
      console.error(`Error in OpenAiService: ${error.message}`);
      return {
        success: false,
        error: error.message || "Failed to get completion from OpenAI.",
        rawResponse: error,
      };
    }
  }
}
