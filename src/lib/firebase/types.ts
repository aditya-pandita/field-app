export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type LocationType = "street" | "mall" | "cafe" | "park" | "transit" | "market" | "university" | "other";
export type WeatherType = "sunny" | "cloudy" | "overcast" | "cold" | "hot" | "rainy";
export type TimeOfDay = "morning" | "midday" | "afternoon" | "evening";
export type PhaseReached = "opener" | "stack" | "hook" | "rapport" | "close";
export type Outcome = "number" | "instant_date" | "social_media" | "declined" | "walked_away" | "interrupted";
export type OpenerType = "direct" | "situational" | "indirect" | "indirect_direct";
export type Difficulty = "warm" | "neutral" | "cold" | "resistant";
export type TrainerDifficulty = "easy" | "medium" | "hard";
export type SelfRating = "smooth" | "awkward" | "blank";
export type FlashcardCategory = "opener" | "stack" | "rapport" | "close" | "recovery" | "frame";
export type AdversaryArchetype = "hard-rejection" | "logic-attacker" | "social-destroyer" | "stone-wall" | "complete-chaos";
export type AdversaryIntensity = "controlled" | "full";

export interface Profile {
  userId: string;
  displayName: string;
  email: string;
  username: string;
  city: string;
  skillLevel: SkillLevel;
  totalApproaches: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  sessionId: string;
  userId: string;
  sessionDate: Date;
  locationType: LocationType;
  locationName: string;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  moodBefore: string;
  moodAfter: string | null;
  totalApproaches: number;
  notes: string;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Approach {
  approachId: string;
  userId: string;
  sessionId: string;
  phaseReached: PhaseReached;
  outcome: Outcome;
  openerType: OpenerType;
  scoreExecution: number;
  scoreTonality: number;
  scoreInvestment: number;
  scoreClose: number;
  scoreRecovery: number;
  scoreOverall: number;
  whatWentWell: string;
  whatToImprove: string;
  notableMoment: string;
  tags: string[];
  loggedAt: Date;
  createdAt: Date;
}

export interface ScenarioSession {
  sessionId: string;
  userId: string;
  scenarioId: string;
  scenarioLabel: string;
  difficulty: Difficulty;
  startedAt: Date;
  endedAt: Date | null;
  messageCount: number;
  isComplete: boolean;
}

export interface ScenarioMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ScenarioFeedback {
  overallScore: number;
  phaseReached: PhaseReached;
  strengths: string[];
  improvements: string[];
  bestLine: string;
  missedOpportunity: string;
  coachNote: string;
  verdict: string;
}

export interface TopicCard {
  id: string;
  topic: string;
  category: string;
  subtopics: string[];
  difficulty: number;
}

export interface TransitionPhrase {
  id: string;
  phrase: string;
  style: string;
  exampleUsage: string;
  difficulty: number;
}

export interface TrainerSession {
  sessionId: string;
  userId: string;
  difficulty: TrainerDifficulty;
  startedAt: Date;
  completedAt: Date | null;
  totalPivots: number;
  isComplete: boolean;
}

export interface TrainerPivot {
  pivotId: string;
  topicId: string;
  phraseId: string;
  rating: SelfRating;
  timestamp: number;
}

export interface CoachStyle {
  slug: string;
  name: string;
  styleTag: string;
  bestFor: SkillLevel;
  philosophy: string;
  approachMethod: string;
  signatureTechniques: string[];
  exampleOpener: string;
}

export interface FlashcardTemplate {
  id: string;
  category: FlashcardCategory;
  coachStyleId: string;
  prompt: string;
  response: string;
  exampleLine: string;
  tags: string[];
  difficulty: number;
}

export interface UserFlashcardProgress {
  userId: string;
  flashcardId: string;
  easeCount: number;
  hardCount: number;
  blankCount: number;
  masteryLevel: number;
  lastSeenAt: Date;
  nextReviewAt: Date;
}

export interface AdversarySession {
  sessionId: string;
  userId: string;
  archetype: AdversaryArchetype;
  intensity: AdversaryIntensity;
  startedAt: Date;
  endedAt: Date | null;
  messageCount: number;
  isComplete: boolean;
}

export interface AdversaryDebrief {
  debriefId: string;
  resilienceScore: number;
  stayedIn: boolean;
  composureRating: number;
  gracefulExit: boolean;
  keyMoment: string;
  stoicInsight: string;
  stoicQuote: string;
  coachNote: string;
  nextChallenge: string;
}

export interface UserStats {
  totalApproaches: number;
  avgScore: number;
  avgExecution: number;
  avgTonality: number;
  avgInvestment: number;
  avgClose: number;
  avgRecovery: number;
  hookRatePct: number;
  numberCloses: number;
  instantDates: number;
  closeRatePct: number;
}

export interface WeeklyApproach {
  weekStart: string;
  approaches: number;
  avgScore: number;
}

export interface PhaseFunnelRow {
  phaseReached: PhaseReached;
  count: number;
  pct: number;
}

export type NewSession = Omit<Session, "sessionId" | "userId" | "createdAt" | "updatedAt" | "totalApproaches" | "moodAfter" | "isComplete">;
export type NewApproach = Omit<Approach, "approachId" | "createdAt" | "scoreOverall">;
export type FeedbackResult = Omit<ScenarioFeedback, never>;
export type DebriefResult = Omit<AdversaryDebrief, "debriefId">;
