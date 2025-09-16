/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/asr/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node (not Edge) for streaming/form-data

export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const file = incoming.get("file") as File | null;
    const task = (incoming.get("task") as string) || "transcribe"; // or "translate"
    const language = (incoming.get("language") as string) || ""; // e.g., "fa"

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Rebuild FormData to forward to your ASR server
    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("task", task);
    if (language) fd.append("language", language);

    // Optional: pass more knobs through (must match your ASR server params)
    // fd.append("chunk_length_s", "30");
    // fd.append("stride_left_s", "5");
    // fd.append("stride_right_s", "5");
    const user = process.env.ASR_USER;
    const pass = process.env.ASR_PASSWORD;

    const auth = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

    const res = await fetch(process.env.ASR_URL!, {
      method: "POST",
      body: fd,
      headers: { Authorization: auth }, // CORS: your server allows Authorization

      // Note: no headers; fetch will set proper multipart boundary
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "ASR proxy failed" },
      { status: 500 },
    );
  }
}
