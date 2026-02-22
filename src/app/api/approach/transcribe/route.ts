import { NextRequest, NextResponse } from "next/server";

const GROQ_WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3-turbo";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 25MB." }, { status: 413 });
    }

    const groqForm = new FormData();
    groqForm.append("file", audioFile, audioFile.name);
    groqForm.append("model", MODEL);
    groqForm.append("response_format", "json");
    groqForm.append("language", "en");

    const response = await fetch(GROQ_WHISPER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: groqForm,
    });

    if (response.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Transcription failed: ${error}` }, { status: response.status });
    }

    const data = await response.json();
    const transcript = data.text?.trim() || "";

    const durationSecs = Math.ceil(audioFile.size / 16000);

    return NextResponse.json({ transcript, durationSecs });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Transcription service unavailable" }, { status: 503 });
  }
}
