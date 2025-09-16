/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/asr/route.ts
import { NextResponse } from "next/server";
import { experimental_transcribe as transcribe } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "nodejs"; // ensure Node (not Edge) for streaming/form-data

export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const file = incoming.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Convert to a supported binary type for `audio`
    const audioBytes = new Uint8Array(await file.arrayBuffer());

    const result = await transcribe({
      // @ts-ignore
      model: openai.transcription("whisper-1"),
      audio: audioBytes,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.log("ASR proxy error", err);
    return NextResponse.json(
      { error: err?.message || "ASR proxy failed" },
      { status: 500 },
    );
  }
}
