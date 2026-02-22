export interface Scenario {
  id: string;
  name: string;
  age: number;
  nationality: string;
  occupation: string;
  personality: string;
  location: string;
  setup: string;
}

export const scenarios: Scenario[] = [
  {
    id: "street",
    name: "Sofia",
    age: 26,
    nationality: "Polish",
    occupation: "Graphic Designer",
    personality: "Dry wit, observant, values authenticity",
    location: "Street/Urban",
    setup: "You see her walking down a busy street, earbuds in, looking at her phone occasionally.",
  },
  {
    id: "cafe",
    name: "Maya",
    age: 24,
    nationality: "Iranian-British",
    occupation: "Literature Graduate Student",
    personality: "Intellectual, warm but guarded, loves deep conversations",
    location: "Coffee Shop",
    setup: "She's sitting alone at a cafe, reading a novel, occasional smiles at passages.",
  },
  {
    id: "bookshop",
    name: "Lena",
    age: 27,
    nationality: "Swedish",
    occupation: "Software Engineer",
    personality: "Direct, analytical humor, passionate about books",
    location: "Bookstore",
    setup: "She's browsing the philosophy section, occasionally pulling out her phone to check something.",
  },
  {
    id: "market",
    name: "Zoe",
    age: 25,
    nationality: "Australian",
    occupation: "Brand Strategist",
    personality: "Confident, playful, energetic",
    location: "Farmers Market",
    setup: "She's examining produce at a stall, engaged with the vendor about different fruits.",
  },
  {
    id: "gallery",
    name: "Nadia",
    age: 29,
    nationality: "Lebanese-French",
    occupation: "Finance + Creative Projects",
    personality: "Sophisticated, curious, appreciates art and culture",
    location: "Art Gallery",
    setup: "She's standing alone in front of an abstract painting, studying it intently.",
  },
  {
    id: "metro",
    name: "Ines",
    age: 23,
    nationality: "Spanish",
    occupation: "Junior Doctor",
    personality: "Empathetic, tired from long shifts but still warm",
    location: "Metro/Subway",
    setup: "She looks fatigued, standing near the doors, looking at her phone occasionally.",
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
