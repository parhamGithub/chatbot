/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/asr/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // use Node (multipart support)
export const dynamic = "force-dynamic";   // avoid caching

export async function POST(req: Request) {
  try {
    const incoming = await req.formData();

    const file = incoming.get("file") as File | null;
    const task = (incoming.get("task") as string) || "transcribe";  // or "translate"
    const language = (incoming.get("language") as string) || "";    // e.g., "fa"

    // New: optional streaming metadata
    const sessionId = (incoming.get("sessionId") as string) || "";
    const seq = (incoming.get("seq") as string) || "";
    const end = (incoming.get("end") as string) || "";              // "true" on final flush, if you use it

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Rebuild FormData to forward to your ASR server
    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("task", task);
    if (language)  fd.append("language", language);
    if (sessionId) fd.append("sessionId", sessionId);
    if (seq)       fd.append("seq", seq);
    if (end)       fd.append("end", end);

    // (Optional) If your ASR supports more knobs, pass them through here:
    // for (const key of ["chunk_length_s", "stride_left_s", "stride_right_s", "prompt"]) {
    //   const v = incoming.get(key);
    //   if (typeof v === "string" && v) fd.append(key, v);
    // }

    const upstream = await fetch(process.env.ASR_URL!, {
      method: "POST",
      body: fd,
      // No manual headers: fetch sets multipart boundaries automatically
      // Keep connections alive for rapid chunk posts
      keepalive: true,
    });

    // Try to relay JSON cleanly; if not JSON, pass a generic error with status
    const text = await upstream.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      if (!upstream.ok) {
        return NextResponse.json(
          { error: `ASR upstream ${upstream.status} ${upstream.statusText}`, raw: text.slice(0, 5000) },
          { status: upstream.status }
        );
      }
      // If OK but not JSON, wrap it
      data = { text };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "ASR proxy failed" },
      { status: 500 }
    );
  }
}
