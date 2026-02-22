import { NextRequest, NextResponse } from "next/server";
import { getArchetypeById } from "@/lib/adversary/archetypes";
import { buildAdversarySystemPrompt, ADVERSARY_DEBRIEF_PROMPT } from "@/lib/adversary/prompts";
import type { AdversaryArchetype, AdversaryIntensity, DebriefResult } from "@/lib/firebase/types";

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
    const transcript = messages
      .map((m) => `${m.role === "user" ? "You" : archetype.name}: ${m.content}`)
      .join("\n");

    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `Here's the conversation transcript:\n\n${transcript}\n\n${ADVERSARY_DEBRIEF_PROMPT}` },
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
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Groq API error: ${error}` }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let jsonStr = content.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    try {
      const debrief = JSON.parse(jsonStr) as DebriefResult;
      return NextResponse.json(debrief);
    } catch {
      return NextResponse.json({ error: "Failed to parse debrief response" }, { status: 422 });
    }
  } catch (error) {
    console.error("Adversary debrief error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
