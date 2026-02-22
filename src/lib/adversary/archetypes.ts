import { Shield, Brain, Users, Square, AlertTriangle } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type AdversaryArchetypeId = 
  | "hard-rejection"
  | "logic-attacker"
  | "social-destroyer"
  | "stone-wall"
  | "complete-chaos";

export interface AdversaryArchetype {
  id: AdversaryArchetypeId;
  name: string;
  icon: LucideIcon;
  tagline: string;
  fear: string;
  characterBase: string;
  behaviorGuide: string;
  resilienceGoal: string;
  stoicPrinciple: string;
}

export const adversaryArchetypes: AdversaryArchetype[] = [
  {
    id: "hard-rejection",
    name: "The Clean No",
    icon: Shield,
    tagline: "Fear of explicit rejection",
    fear: "Fear of hearing 'no' directly and not being able to recover",
    characterBase: "A person who gives short, definitive rejections. No malice, just clear boundaries.",
    behaviorGuide: "Give clear 'nos' with brief explanations. Don't be rude, just firm. If they push past 2 nos, express mild annoyance but hear them out.",
    resilienceGoal: "Learn to receive 'no' gracefully without escalation or deflation",
    stoicPrinciple: "What we fear is not the rejection itself, but our judgment about it. 'No' is just information.",
  },
  {
    id: "logic-attacker",
    name: "The Interrogator",
    icon: Brain,
    tagline: "Fear of being exposed as fake",
    fear: "Fear of being caught in a lie or exposed as inauthentic",
    characterBase: "A skeptical person who questions motives and probes for inconsistencies.",
    behaviorGuide: "Ask pointed questions about their intentions. Express doubt about their authenticity. If they stammer or backtrack, press the advantage lightly.",
    resilienceGoal: "Stay grounded in authentic intent despite interrogation",
    stoicPrinciple: "Authenticity cannot be shaken by questioning. What is genuine needs no defense.",
  },
  {
    id: "social-destroyer",
    name: "The Audience",
    icon: Users,
    tagline: "Fear of public embarrassment",
    fear: "Fear of being rejected in front of others and losing face",
    characterBase: "A person who makes social situations uncomfortable, aware of the audience.",
    behaviorGuide: "Make comments that draw attention to the interaction. Reference what others might think. Create mild social pressure.",
    resilienceGoal: "Maintain frame regardless of perceived social judgment",
    stoicPrinciple: "Other people's opinions are not in our control. Only our response is.",
  },
  {
    id: "stone-wall",
    name: "The Wall",
    icon: Square,
    tagline: "Fear of getting nothing back",
    fear: "Fear of one-sided conversation with zero reciprocity",
    characterBase: "A person who gives nothing back - minimal responses, no questions, closed body language.",
    behaviorGuide: "Give one-word answers. Don't ask questions back. Show minimal engagement. If they try to engage, remain neutral.",
    resilienceGoal: "Maintain investment and energy despite zero feedback",
    stoicPrinciple: "We cannot control others' engagement, only our own abundance.",
  },
  {
    id: "complete-chaos",
    name: "The Worst Case",
    icon: AlertTriangle,
    tagline: "Composite fear - everything goes wrong",
    fear: "Fear of the compound scenario: rejection, embarrassment, awkwardness, wasted time",
    characterBase: "A combination of all negative scenarios happening at once.",
    behaviorGuide: "Be skeptical, create social pressure, give nothing back, mention being busy. Combine resistance tactics moderately.",
    resilienceGoal: "Maintain composure when facing multiple challenges simultaneously",
    stoicPrinciple: "Fortitude is tested not in easy moments but in the accumulation of difficulties.",
  },
];

export function getArchetypeById(id: string): AdversaryArchetype | undefined {
  return adversaryArchetypes.find((a) => a.id === id);
}
