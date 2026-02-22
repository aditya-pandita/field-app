import { NextRequest, NextResponse } from "next/server";
import { getArchetypeById } from "@/lib/adversary/archetypes";
import { buildAdversarySystemPrompt } from "@/lib/adversary/prompts";
import type { AdversaryArchetype, AdversaryIntensity } from "@/lib/firebase/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { messages, archetypeId, intensity } = body as {
      messages: { role: "user" | "assistant"; content: string; timestamp: number }[];
      archetypeId: AdversaryArchetype;
      intensity: AdversaryIntensity;
    };

    if (!messages || !archetypeId || !intensity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const archetype = getArchetypeById(archetypeId);
    if (!archetype) {
      return NextResponse.json({ error: "Archetype not found" }, { status: 404 });
    }

    const systemPrompt = buildAdversarySystemPrompt(archetype, intensity);

    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: groqMessages,
        max_tokens: 150,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Groq API error: ${error}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "...";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Adversary chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
