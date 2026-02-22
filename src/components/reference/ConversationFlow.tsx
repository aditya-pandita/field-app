"use client";

// src/components/reference/ConversationFlow.tsx
// The 5-phase cold approach conversation framework

const PHASES = [
  {
    number: "I",
    roman: "01",
    name: "The Opener",
    subtitle: "The Stop + Direct Compliment",
    color: "#FF5500",
    description:
      "Cut in front or alongside. State your intention openly: you noticed her and had to say something. Give a genuine, specific observation — not a generic compliment. Address something real: her style, the way she carries herself, something unique.",
    example:
      "Excuse me — I know this is random, but I was walking behind you and you have this really calm, deliberate energy. It caught my attention.",
    signals: null,
  },
  {
    number: "II",
    roman: "02",
    name: "The Stack",
    subtitle: "Immediate Momentum: Cold Reads & Observations",
    color: "#FF5500",
    description:
      "Don't wait for her response to lead. Bridge immediately into 2–3 cold reads or observations about her — her style suggests she's creative, she looks like she's not from here, she has that look of someone who has a very specific opinion about coffee. Makes her feel seen, not interrogated.",
    example:
      "You look very Parisian actually — not the tourist Parisian, the real thing. Are you French? No wait — Eastern European. Am I close?",
    signals: {
      warm: {
        label: "SHE'S WARM / ENGAGED",
        text: "She's smiling, making eye contact, playing along. She's either correcting your cold read (good — she's invested) or elaborating. Let her talk. You've hooked her. Move to rapport.",
      },
      cold: {
        label: "SHE'S COLD / IN A RUSH",
        text: "She's half-turning to leave, giving short answers. Do NOT chase or over-explain. Either release the pressure ('I know this was random — I'll let you go') or spike curiosity one time: 'You seem like you have an interesting story, actually.' Then wait.",
      },
    },
  },
  {
    number: "III",
    roman: "03",
    name: "The Hook Point",
    subtitle: "She Starts Investing",
    color: "#EAB308",
    description:
      "The hook point is the moment she shifts from being stopped by you to actively participating in the conversation. She asks YOU a question. She qualifies herself. She laughs and touches your arm. This is the signal to slow down — you've earned the conversation.",
    example:
      "She says: \"Wait, what made you think I was from Paris?\" ← This is the hook. She's curious. Now you lead.",
    signals: null,
  },
  {
    number: "IV",
    roman: "04",
    name: "Rapport",
    subtitle: "Deep Dive: Real Connection",
    color: "#22C55E",
    description:
      "Now you go beneath surface level. Ask about her passions, not her job. Find what lights her up. Spike genuine curiosity — share something real about yourself first before asking. Use playful teasing and callback humor to keep it light. Rapport without attraction = friendzone. Mix them.",
    example:
      "Not: 'What do you do?' → But: 'You seem like you do something creative — or something that drives you crazy but you can't quit it.' Then share your version first.",
    signals: null,
  },
  {
    number: "V",
    roman: "05",
    name: "The Close",
    subtitle: "Number · Instant Date · Bounce",
    color: "#FF5500",
    description:
      "Close before the energy dips. 3–7 minutes is the sweet spot for a first cold approach in motion. Don't wait for permission to close — lead into it. Best closes come from a natural high point in conversation, not when things are stalling. Give her a reason to meet again that makes sense.",
    example:
      "Look — I want to hear that story properly. Give me your number and let's continue this over coffee. What's your number?",
    signals: {
      warm: {
        label: "INSTANT DATE",
        text: "If she has time and energy is high: 'Are you busy right now? Let's get a coffee.' Don't hesitate. Instant dates convert at 3x the rate of numbers alone.",
      },
      cold: {
        label: "SHE DECLINES",
        text: "Smile. 'Fair enough — you're brave for even stopping. I respect it.' Leave with high value intact. Never argue, never explain. The graceful exit IS the game.",
      },
    },
  },
];

export function ConversationFlow() {
  return (
    <div className="max-w-3xl space-y-12">
      {/* Phase pipeline overview */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {PHASES.map((phase, idx) => (
          <div key={phase.number} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#666666] tracking-widest">
                {phase.roman}
              </span>
              <span className="font-[family-name:var(--font-syne)] text-sm font-bold text-white">
                {phase.name}
              </span>
            </div>
            {idx < PHASES.length - 1 && (
              <div className="w-8 h-px bg-[#252525] flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1A1A1A]" />

      {/* Phase detail cards */}
      {PHASES.map((phase, idx) => (
        <div key={phase.number} className="space-y-4">
          {/* Phase header */}
          <div className="flex items-baseline gap-4">
            <span
              className="font-[family-name:var(--font-syne)] text-5xl font-bold"
              style={{ color: "#252525" }}
            >
              {idx + 1}
            </span>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase"
                  style={{ color: phase.color }}
                >
                  PHASE {phase.number}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white">
                {phase.name}
              </h3>
              <p className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#666666] tracking-wide mt-1">
                {phase.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#888888] text-[14px] leading-relaxed pl-16">
            {phase.description}
          </p>

          {/* Example line */}
          <div className="ml-16 border-l-2 border-[#FF5500] pl-4 bg-[rgba(255,85,0,0.04)] py-3 pr-4">
            <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest mb-2">
              EXAMPLE
            </p>
            <p className="text-[#CCCCCC] text-sm italic leading-relaxed">
              &ldquo;{phase.example}&rdquo;
            </p>
          </div>

          {/* Warm/cold signals */}
          {phase.signals && (
            <div className="ml-16 grid sm:grid-cols-2 gap-3 mt-4">
              <div className="border border-[#22C55E]/20 bg-[#22C55E]/5 p-4">
                <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#22C55E] tracking-widest uppercase mb-2">
                  ▲ {phase.signals.warm.label}
                </p>
                <p className="text-[#888888] text-xs leading-relaxed">
                  {phase.signals.warm.text}
                </p>
              </div>
              <div className="border border-[#EF4444]/20 bg-[#EF4444]/5 p-4">
                <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#EF4444] tracking-widest uppercase mb-2">
                  ▼ {phase.signals.cold.label}
                </p>
                <p className="text-[#888888] text-xs leading-relaxed">
                  {phase.signals.cold.text}
                </p>
              </div>
            </div>
          )}

          {idx < PHASES.length - 1 && (
            <div className="h-px bg-[#1A1A1A] mt-8" />
          )}
        </div>
      ))}
    </div>
  );
}
