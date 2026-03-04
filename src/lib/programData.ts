// Static source-of-truth for the Desensitization Training Program.
// Zero runtime dependencies — no imports needed.

export type TrackId   = "aggressive" | "chill";
export type TaskType  = "compliment_guy" | "compliment_girl" | "warmup" | "persistence" | "number_close";

export interface TaskTypeMeta {
  label:    string;
  tag:      string;
  loggable: boolean;
  color:    string;
}

export const TASK_TYPE_META: Record<TaskType, TaskTypeMeta> = {
  compliment_guy:  { label: "Compliment Guy",  tag: "SOCIAL",      loggable: false, color: "#666666" },
  compliment_girl: { label: "Compliment Girl", tag: "DIRECT",      loggable: true,  color: "#A855F7" },
  warmup:          { label: "Warm-Up",         tag: "WARM-UP",     loggable: true,  color: "#3B82F6" },
  persistence:     { label: "Persistence",     tag: "PERSISTENCE", loggable: true,  color: "#F59E0B" },
  number_close:    { label: "Number Close",    tag: "CLOSE",       loggable: true,  color: "#FF5500" },
};

export interface TaskDef {
  id:    string;
  type:  TaskType;
  label: string;
}

export interface DayDef {
  day:         number;
  title:       string;
  description: string;
  tasks:       TaskDef[];
}

export interface TrackDef {
  id:         TrackId;
  label:      string;
  accentColor: string;
  days:       DayDef[];
}

// ── Aggressive Track ──────────────────────────────────────────────────────────

const AGGRESSIVE: TrackDef = {
  id: "aggressive",
  label: "Aggressive",
  accentColor: "#FF5500",
  days: [
    {
      day: 1,
      title: "Spark the State",
      description: "Break the opener reflex — social warmth first, then direct. Volume matters, outcome doesn't.",
      tasks: [
        { id: "gc1",  type: "compliment_guy",  label: "Compliment a guy" },
        { id: "gc2",  type: "compliment_guy",  label: "Compliment a guy" },
        { id: "gc3",  type: "compliment_guy",  label: "Compliment a guy" },
        { id: "grl1", type: "compliment_girl", label: "Compliment a girl" },
        { id: "grl2", type: "compliment_girl", label: "Compliment a girl" },
        { id: "grl3", type: "compliment_girl", label: "Compliment a girl" },
        { id: "w1",   type: "warmup",          label: "Warm-up approach" },
        { id: "w2",   type: "warmup",          label: "Warm-up approach" },
        { id: "w3",   type: "warmup",          label: "Warm-up approach" },
        { id: "w4",   type: "warmup",          label: "Warm-up approach" },
        { id: "w5",   type: "warmup",          label: "Warm-up approach" },
      ],
    },
    {
      day: 2,
      title: "Push Through Friction",
      description: "Volume reps, then hold sets longer than comfortable. The urge to eject is the training variable.",
      tasks: [
        { id: "w1",  type: "warmup",      label: "Warm-up approach" },
        { id: "w2",  type: "warmup",      label: "Warm-up approach" },
        { id: "w3",  type: "warmup",      label: "Warm-up approach" },
        { id: "w4",  type: "warmup",      label: "Warm-up approach" },
        { id: "w5",  type: "warmup",      label: "Warm-up approach" },
        { id: "p1",  type: "persistence", label: "Persist 3+ min in set" },
        { id: "p2",  type: "persistence", label: "Persist 3+ min in set" },
        { id: "p3",  type: "persistence", label: "Persist 3+ min in set" },
      ],
    },
    {
      day: 3,
      title: "Go for the Number",
      description: "Same volume, now add the ask. Getting rejected on the number is still a win — the ask is the rep.",
      tasks: [
        { id: "a1",  type: "warmup",      label: "Approach" },
        { id: "a2",  type: "warmup",      label: "Approach" },
        { id: "a3",  type: "warmup",      label: "Approach" },
        { id: "a4",  type: "warmup",      label: "Approach" },
        { id: "a5",  type: "warmup",      label: "Approach" },
        { id: "nc1", type: "number_close", label: "Approach + close attempt" },
        { id: "nc2", type: "number_close", label: "Approach + close attempt" },
        { id: "nc3", type: "number_close", label: "Approach + close attempt" },
      ],
    },
    {
      day: 4,
      title: "Full Send",
      description: "Maximum volume day. High approach count, high close count. Momentum is everything — don't stop.",
      tasks: [
        { id: "a1",  type: "warmup",       label: "Approach" },
        { id: "a2",  type: "warmup",       label: "Approach" },
        { id: "a3",  type: "warmup",       label: "Approach" },
        { id: "a4",  type: "warmup",       label: "Approach" },
        { id: "a5",  type: "warmup",       label: "Approach" },
        { id: "a6",  type: "warmup",       label: "Approach" },
        { id: "a7",  type: "warmup",       label: "Approach" },
        { id: "a8",  type: "warmup",       label: "Approach" },
        { id: "a9",  type: "warmup",       label: "Approach" },
        { id: "a10", type: "warmup",       label: "Approach" },
        { id: "nc1", type: "number_close", label: "Approach + close attempt" },
        { id: "nc2", type: "number_close", label: "Approach + close attempt" },
        { id: "nc3", type: "number_close", label: "Approach + close attempt" },
        { id: "nc4", type: "number_close", label: "Approach + close attempt" },
        { id: "nc5", type: "number_close", label: "Approach + close attempt" },
      ],
    },
  ],
};

// ── Chill Track ───────────────────────────────────────────────────────────────

const CHILL: TrackDef = {
  id: "chill",
  label: "Chill",
  accentColor: "#3B82F6",
  days: [
    {
      day: 1,
      title: "Open Your Mouth",
      description: "The only job today is to speak to three strangers. Remove the identity barrier: talking to people is normal.",
      tasks: [
        { id: "gc1", type: "compliment_guy", label: "Compliment a guy" },
        { id: "gc2", type: "compliment_guy", label: "Compliment a guy" },
        { id: "gc3", type: "compliment_guy", label: "Compliment a guy" },
      ],
    },
    {
      day: 2,
      title: "First Contact",
      description: "Same energy, different target. A genuine compliment — specific, delivered with eye contact.",
      tasks: [
        { id: "grl1", type: "compliment_girl", label: "Compliment a girl" },
        { id: "grl2", type: "compliment_girl", label: "Compliment a girl" },
        { id: "grl3", type: "compliment_girl", label: "Compliment a girl" },
      ],
    },
    {
      day: 3,
      title: "Warm-Up Sets",
      description: "Start talking. No outcome expected. Open, say something, see what happens.",
      tasks: [
        { id: "w1", type: "warmup", label: "Warm-up approach" },
        { id: "w2", type: "warmup", label: "Warm-up approach" },
        { id: "w3", type: "warmup", label: "Warm-up approach" },
      ],
    },
    {
      day: 4,
      title: "Hold the Frame",
      description: "Two openers to get loose, then hold two sets past the ejection urge. Stay in when it gets awkward.",
      tasks: [
        { id: "w1", type: "warmup",      label: "Warm-up approach" },
        { id: "w2", type: "warmup",      label: "Warm-up approach" },
        { id: "p1", type: "persistence", label: "Persist 3+ min in set" },
        { id: "p2", type: "persistence", label: "Persist 3+ min in set" },
      ],
    },
    {
      day: 5,
      title: "Build Volume",
      description: "Five approaches. Pure reps. Build the reflex — opener is automatic now.",
      tasks: [
        { id: "a1", type: "warmup", label: "Approach" },
        { id: "a2", type: "warmup", label: "Approach" },
        { id: "a3", type: "warmup", label: "Approach" },
        { id: "a4", type: "warmup", label: "Approach" },
        { id: "a5", type: "warmup", label: "Approach" },
      ],
    },
    {
      day: 6,
      title: "First Close Attempt",
      description: "Add the ask. Rejection on the number is a pass — you asked, that's all that matters.",
      tasks: [
        { id: "a1",  type: "warmup",       label: "Approach" },
        { id: "a2",  type: "warmup",       label: "Approach" },
        { id: "a3",  type: "warmup",       label: "Approach" },
        { id: "nc1", type: "number_close", label: "Approach + close attempt" },
        { id: "nc2", type: "number_close", label: "Approach + close attempt" },
      ],
    },
    {
      day: 7,
      title: "Stack the Reps",
      description: "More volume, more holding. Five openers and two persistence reps — train the hold reflex.",
      tasks: [
        { id: "a1", type: "warmup",      label: "Approach" },
        { id: "a2", type: "warmup",      label: "Approach" },
        { id: "a3", type: "warmup",      label: "Approach" },
        { id: "a4", type: "warmup",      label: "Approach" },
        { id: "a5", type: "warmup",      label: "Approach" },
        { id: "p1", type: "persistence", label: "Persist 3+ min in set" },
        { id: "p2", type: "persistence", label: "Persist 3+ min in set" },
      ],
    },
    {
      day: 8,
      title: "Close More",
      description: "Flip the ratio — more closes than openers. Getting the ask out is the skill.",
      tasks: [
        { id: "a1",  type: "warmup",       label: "Approach" },
        { id: "a2",  type: "warmup",       label: "Approach" },
        { id: "a3",  type: "warmup",       label: "Approach" },
        { id: "nc1", type: "number_close", label: "Approach + close attempt" },
        { id: "nc2", type: "number_close", label: "Approach + close attempt" },
        { id: "nc3", type: "number_close", label: "Approach + close attempt" },
      ],
    },
    {
      day: 9,
      title: "Program Finale",
      description: "Peak volume, peak intent. This is the benchmark. Five openers, five closes — finish strong.",
      tasks: [
        { id: "a1",  type: "warmup",       label: "Approach" },
        { id: "a2",  type: "warmup",       label: "Approach" },
        { id: "a3",  type: "warmup",       label: "Approach" },
        { id: "a4",  type: "warmup",       label: "Approach" },
        { id: "a5",  type: "warmup",       label: "Approach" },
        { id: "nc1", type: "number_close", label: "Approach + close attempt" },
        { id: "nc2", type: "number_close", label: "Approach + close attempt" },
        { id: "nc3", type: "number_close", label: "Approach + close attempt" },
        { id: "nc4", type: "number_close", label: "Approach + close attempt" },
        { id: "nc5", type: "number_close", label: "Approach + close attempt" },
      ],
    },
  ],
};

export const PROGRAM_TRACKS: Record<TrackId, TrackDef> = {
  aggressive: AGGRESSIVE,
  chill:      CHILL,
};

