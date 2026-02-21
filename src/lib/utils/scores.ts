export interface ScoreInputs {
  execution: number;
  tonality: number;
  investment: number;
  close: number;
  recovery: number;
}

export function calcOverallScore(scores: ScoreInputs): number {
  const weights = {
    execution: 0.3,
    tonality: 0.25,
    investment: 0.2,
    close: 0.15,
    recovery: 0.1,
  };

  const total =
    scores.execution * weights.execution +
    scores.tonality * weights.tonality +
    scores.investment * weights.investment +
    scores.close * weights.close +
    scores.recovery * weights.recovery;

  return Math.round(total * 10) / 10;
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "#22C55E";
  if (score >= 6) return "#EAB308";
  if (score >= 4) return "#FF5500";
  return "#EF4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Sharp";
  if (score >= 6) return "Functional";
  if (score >= 4) return "Developing";
  return "Grind Mode";
}

export function getPhaseIndex(phase: string): number {
  const phases: Record<string, number> = {
    opener: 0,
    stack: 1,
    hook: 2,
    rapport: 3,
    close: 4,
  };
  return phases[phase] ?? 0;
}

export function getPhaseLabel(index: number): string {
  const labels = ["Opener", "Stack", "Hook", "Rapport", "Close"];
  return labels[index] ?? "Unknown";
}
