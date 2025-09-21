import { convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const chatModel = openai("gpt-4o");

  const result = streamText({
    model: chatModel,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
