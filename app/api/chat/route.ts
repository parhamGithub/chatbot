import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Set the runtime to 'edge' for better performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const { text } = await generateText({
      model: google("models/gemini-2.5-flash"),
      prompt,
    });

    // Return the AI's response
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors gracefully
    return new Response(JSON.stringify({ error: "Failed to generate text" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
