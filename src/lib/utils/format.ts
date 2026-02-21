import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatDate(
  date: Date | string | null,
  fmt: "short" | "long" | "day" = "short"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  switch (fmt) {
    case "short":
      return format(d, "MMM d");
    case "long":
      return format(d, "MMMM d, yyyy");
    case "day":
      return format(d, "EEE");
    default:
      return format(d, "MMM d");
  }
}

export function formatScore(score: number | null): string {
  if (score === null || score === undefined) return "—";
  return score.toFixed(1);
}

export function formatPct(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return `${Math.round(n)}%`;
}

export function getRelativeDay(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDuration(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  if (mins > 0) {
    return `${mins}m ${remainingSecs}s`;
  }
  return `${secs}s`;
}
