import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { MODEL } from "@/generated/prisma";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const gemini = createOpenAICompatible({
    name: "google/gemini-2.0-flash-001",
    baseURL: "https://ai.liara.ir/api/v1/68461303f45c00abaa4c320f",
    apiKey: process.env.API_TOKEN,
  });

  // const openAi4 = createOpenAICompatible({
  //   name: "openai/gpt-4.1",
  //   baseURL: "https://ai.liara.ir/api/v1/68461303f45c00abaa4c320f",
  //   apiKey: process.env.API_TOKEN,
  // });
  const claude = createOpenAICompatible({
    name: "anthropic/claude-3.7-sonnet",
    baseURL: "https://ai.liara.ir/api/v1/68461303f45c00abaa4c320f",
    apiKey: process.env.API_TOKEN,
  });

  let chatModel = openai("gpt-4o");

  switch (model as MODEL) {
    case "GPT_4_O":
      chatModel = openai("gpt-4o");
      break;
    case "GEMINI_2_FLASH":
      chatModel = gemini("google/gemini-2.0-flash-001");
      break;
    case "CLAUDE_3_7_SONNET":
      chatModel = claude("anthropic/claude-3.7-sonnet");
  }
  const result = streamText({
    model: chatModel,
    messages: convertToModelMessages(messages),
    system: "you are nexiino, trained my nexiino co",
  });

  return result.toUIMessageStreamResponse();
}
