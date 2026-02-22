import { NextRequest, NextResponse } from "next/server";
import { getScenarioById } from "@/lib/scenario/scenarios";
import { buildSystemPrompt } from "@/lib/scenario/prompts";
import type { ScenarioMessage, Difficulty } from "@/lib/firebase/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { messages, scenarioId, difficulty } = body as {
      messages: ScenarioMessage[];
      scenarioId: string;
      difficulty: Difficulty;
    };

    if (!messages || !scenarioId || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt(scenario, difficulty);

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
        max_tokens: 200,
        temperature: 0.85,
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
    console.error("Scenario chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
