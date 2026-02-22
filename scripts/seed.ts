// scripts/seed.ts
// Run: npx ts-node scripts/seed.ts
// Populates coaches, topicBank, transitionPhrases, flashcardTemplates

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Init Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

// ── COACHES ───────────────────────────────────────────────────────────────────

const coaches = [
  {
    slug: 'structured-direct',
    name: 'The Structured Model',
    styleTag: 'Direct + Systematic',
    bestFor: 'intermediate',
    philosophy: 'Attraction is a skill. Every interaction follows identifiable patterns that can be learned and refined.',
    approachMethod: 'Position ahead → direct compliment as observation → cold read → push for investment within 60s',
    signatureTechniques: ['Cold reads', 'Investment elicitation', 'Push-pull escalation', 'Sexual framing threads'],
    exampleOpener: 'I just had to stop you — you have this very deliberate energy, like you know exactly where you are going.',
  },
  {
    slug: 'natural-presence',
    name: 'The Natural Model',
    styleTag: 'Presence-based / Emotional',
    bestFor: 'beginner',
    philosophy: 'Presence precedes words. Genuine emotional expression beats any technique.',
    approachMethod: 'Build stillness first → eye contact on approach → soft genuine compliment → rapport first, then deepen',
    signatureTechniques: ['Presence cultivation', 'Emotional honesty', 'Slow rapport build', 'Outcome independence'],
    exampleOpener: 'Hey — I just wanted to say, you caught my attention. I think you are beautiful and I wanted to say hi.',
  },
  {
    slug: 'london-pipeline',
    name: 'The London Pipeline',
    styleTag: 'Structured Pipeline / LDM',
    bestFor: 'beginner',
    philosophy: 'Day game has a repeatable structure. Master the pipeline, then make it your own.',
    approachMethod: 'Spot → follow 3–5 paces → cut in front → direct opener → observation stack → vibe → close',
    signatureTechniques: ['The Stop', 'The Stack', 'The Vibe phase', 'Direct opener formula'],
    exampleOpener: 'Excuse me — I know this is random, but I was walking behind you and I just thought you looked really elegant.',
  },
  {
    slug: 'situational',
    name: 'The Situational Model',
    styleTag: 'Indirect / Soft Direct',
    bestFor: 'beginner',
    philosophy: 'The lowest resistance entry creates space for real connection.',
    approachMethod: 'Use environment as hook → walk alongside → pivot to lifestyle framing → create curiosity before asking',
    signatureTechniques: ['Situational hooks', 'Lifestyle framing', 'Anti-interview positioning', 'Soft direct pivot'],
    exampleOpener: 'Do you know if that place is any good? You look like someone with opinions on these things.',
  },
  {
    slug: 'dominant-energy',
    name: 'The High Energy Model',
    styleTag: 'Dominant Frame / Tonality',
    bestFor: 'advanced',
    philosophy: 'Confidence through vocal commitment and space ownership creates attraction before words land.',
    approachMethod: 'High energy stop. Open as if mid-conversation. Lead with tonality. Push-pull cycling.',
    signatureTechniques: ['Dominant frame entry', 'Tonality as primary tool', 'Push-pull cycling', 'Enthusiasm spikes'],
    exampleOpener: 'Hey — okay wait. You are kind of incredible. I feel like I need to know you.',
  },
  {
    slug: 'minimalist',
    name: 'The Minimalist Model',
    styleTag: 'Ultra-Minimal / Whisper Game',
    bestFor: 'intermediate',
    philosophy: 'The softer you speak, the more powerful the stop. First five seconds set the entire frame.',
    approachMethod: 'Plant in her path. Speak quietly enough she must slow down. Say almost nothing. Let silence work.',
    signatureTechniques: ['The soft stop', 'Whisper tonality', 'Frame through stillness', 'Minimalist stack'],
    exampleOpener: 'Hey... sorry. I just saw you walk past and thought — I need to say hi. Hi.',
  },
]

// ── TOPIC BANK ────────────────────────────────────────────────────────────────

const topics = [
  { topic: 'Travel & Places',      category: 'lifestyle',    difficulty: 1, subtopics: ['Where are you actually from?', 'Best trip you have taken', 'Place you keep meaning to go', 'Worst travel disaster'] },
  { topic: 'Creative Life',        category: 'lifestyle',    difficulty: 1, subtopics: ['What do you make or create?', 'Last time you felt genuinely creative', 'The creative thing you do not tell most people'] },
  { topic: 'Childhood & Roots',    category: 'experiences',  difficulty: 2, subtopics: ['Where did you grow up?', 'Weird family traditions', 'What you wanted to be as a kid', 'How you have changed'] },
  { topic: 'Ambitions & Drive',    category: 'ambitions',    difficulty: 2, subtopics: ['What are you working toward?', 'What would make you feel you had succeeded?', 'Something you are afraid to try'] },
  { topic: 'Food & Pleasure',      category: 'lifestyle',    difficulty: 1, subtopics: ['A meal you still think about', 'Something you discovered recently', 'A food you refuse to eat'] },
  { topic: 'Opinions & Worldview', category: 'personality',  difficulty: 3, subtopics: ['Something you believe most people do not', 'A hot take you would defend', 'Something you changed your mind on'] },
  { topic: 'Humor & Absurdity',    category: 'humor',        difficulty: 2, subtopics: ['Funniest thing that happened recently', 'Something you find funny that you should not', 'A running joke with your friends'] },
  { topic: 'Right Now',            category: 'observation',  difficulty: 1, subtopics: ['What were you about to do?', 'What brought you here today?', 'What are you noticing about this place?'] },
  { topic: 'Personality & Quirks', category: 'personality',  difficulty: 2, subtopics: ['Something that makes you weird in a good way', 'Your actual worst habit', 'What your friends would say about you'] },
  { topic: 'Future & Dreams',      category: 'ambitions',    difficulty: 3, subtopics: ['Ideal life in five years?', 'Something you would do if not afraid', 'A dream too big to say out loud'] },
  { topic: 'Values',               category: 'emotions',     difficulty: 3, subtopics: ['Something you would never compromise on', 'What you respect most in others', 'A belief that surprises people'] },
  { topic: 'Culture & Taste',      category: 'culture',      difficulty: 2, subtopics: ['A book or film that changed something for you', 'Music you are embarrassed to love', 'Something overrated everyone loves'] },
]

// ── TRANSITION PHRASES ────────────────────────────────────────────────────────

const phrases = [
  { phrase: 'That actually reminds me of something completely different —',  style: 'soft',     exampleUsage: 'Pivot from any topic to any other',              difficulty: 1 },
  { phrase: 'Okay totally random pivot, but —',                              style: 'playful',  exampleUsage: 'Hard topic break to reset energy',               difficulty: 1 },
  { phrase: 'You know what that makes me think of?',                         style: 'curious',  exampleUsage: 'Pull her in before revealing the new direction',  difficulty: 1 },
  { phrase: 'Hold on — I want to come back to that, but first —',            style: 'callback', exampleUsage: 'Plant a return anchor while pivoting',            difficulty: 2 },
  { phrase: 'That is interesting because it is basically the opposite of —', style: 'direct',   exampleUsage: 'Contrast pivot that creates intellectual tension', difficulty: 2 },
  { phrase: 'Most people I meet think X but actually —',                     style: 'direct',   exampleUsage: 'Social proof reframe into opinion topic',          difficulty: 2 },
  { phrase: 'I feel like there is something you are not telling me —',       style: 'playful',  exampleUsage: 'Tease her into revealing more personality',       difficulty: 2 },
  { phrase: 'Wait — before you answer that, I have to know —',               style: 'curious',  exampleUsage: 'Interrupt and spike curiosity before pivot',       difficulty: 3 },
  { phrase: 'You are giving me [X] energy, which makes me wonder —',         style: 'soft',     exampleUsage: 'Cold read used as a topic bridge',                difficulty: 2 },
  { phrase: 'Forget that for a second —',                                    style: 'playful',  exampleUsage: 'Hard cut pivot, high energy environments',        difficulty: 3 },
]

// ── FLASHCARD TEMPLATES ───────────────────────────────────────────────────────

const flashcards = [
  {
    category: 'opener',
    coachStyleId: 'london-pipeline',
    prompt: 'She is walking fast with headphones in. How do you open?',
    response: 'Get ahead of her, plant yourself, speak first without waiting for eye contact. Calm and specific.',
    exampleLine: '"Hey — sorry, I know you are in a rush but I just had to say something. I love your look."',
    tags: ['stop', 'direct', 'headphones'],
    difficulty: 1,
  },
  {
    category: 'recovery',
    coachStyleId: 'structured-direct',
    prompt: 'She says "I have a boyfriend" right after your opener.',
    response: 'Do not acknowledge as rejection. Stay in frame. Treat it as a comfort statement. Continue your cold read — she is testing if you will break.',
    exampleLine: '"That is cool — I am just saying hi. You have this creative energy, I was curious about you."',
    tags: ['boyfriend-line', 'recovery', 'frame-hold'],
    difficulty: 2,
  },
  {
    category: 'rapport',
    coachStyleId: 'natural-presence',
    prompt: 'Conversation has gone surface level. How do you go deeper?',
    response: 'Share something real about yourself first. Do not ask for depth — model it. Emotional honesty from you invites it from her.',
    exampleLine: '"Honestly, I went through a phase where I just needed to figure out what I actually wanted. Are you someone who thinks about that stuff?"',
    tags: ['rapport', 'depth', 'emotional-honesty'],
    difficulty: 2,
  },
  {
    category: 'stack',
    coachStyleId: 'london-pipeline',
    prompt: 'She responds to your opener with a one-word answer.',
    response: 'Do not pause for her to lead. Bridge immediately into a cold read. A question demands response; an observation creates intrigue.',
    exampleLine: '"You look Eastern European actually — no wait. The way you dress is very Paris. Am I close?"',
    tags: ['stack', 'cold-read', 'one-word'],
    difficulty: 2,
  },
  {
    category: 'close',
    coachStyleId: 'structured-direct',
    prompt: 'Conversation going well but you feel it about to end. How do you close?',
    response: 'Close before the energy dips, not after. Lead into it from a high point. Invite, do not ask.',
    exampleLine: '"Look — I want to hear that story properly. Give me your number and let us continue this over coffee."',
    tags: ['close', 'number', 'timing'],
    difficulty: 2,
  },
  {
    category: 'recovery',
    coachStyleId: 'natural-presence',
    prompt: 'You opened well but she seems distracted and about to leave.',
    response: 'Release the pressure first. Acknowledge her reality without neediness. One final curiosity spike, then let go completely.',
    exampleLine: '"I can see you are in a rush — I will let you go. But you seem like you have an interesting story."',
    tags: ['release', 'recovery', 'pressure'],
    difficulty: 3,
  },
  {
    category: 'frame',
    coachStyleId: 'minimalist',
    prompt: 'She asks "Why did you stop me?" with a slightly suspicious tone.',
    response: 'Do not explain or justify. Frame is: this is natural and confident. Answer without apology and move forward.',
    exampleLine: '"Because you looked interesting. And I was right — now I am curious about you."',
    tags: ['frame', 'direct', 'suspicious'],
    difficulty: 2,
  },
  {
    category: 'opener',
    coachStyleId: 'situational',
    prompt: 'You are in a coffee shop. She is alone at a table with a book.',
    response: 'Do not stop her — wrong move indoors. Make eye contact, pause naturally, open from nearby. Let environment do the work.',
    exampleLine: '"Sorry — good book or are you just hiding from the world?"',
    tags: ['cafe', 'situational', 'indirect'],
    difficulty: 1,
  },
]

// ── SEED FUNCTION ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting seed...\n')

  // Coaches
  console.log('📚 Seeding coaches...')
  for (const coach of coaches) {
    await db.collection('coaches').doc(coach.slug).set(coach)
    console.log(`   ✓ ${coach.name}`)
  }

  // Topic bank
  console.log('\n🗣️  Seeding topic bank...')
  for (const topic of topics) {
    await db.collection('topicBank').add(topic)
    console.log(`   ✓ ${topic.topic}`)
  }

  // Transition phrases
  console.log('\n💬 Seeding transition phrases...')
  for (const phrase of phrases) {
    await db.collection('transitionPhrases').add(phrase)
    console.log(`   ✓ "${phrase.phrase.substring(0, 40)}..."`)
  }

  // Flashcard templates
  console.log('\n🃏 Seeding flashcard templates...')
  for (const card of flashcards) {
    await db.collection('flashcardTemplates').add(card)
    console.log(`   ✓ [${card.category}] ${card.prompt.substring(0, 50)}...`)
  }

  console.log('\n✅ Seed complete!')
  console.log(`   ${coaches.length} coaches`)
  console.log(`   ${topics.length} topics`)
  console.log(`   ${phrases.length} transition phrases`)
  console.log(`   ${flashcards.length} flashcard templates`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
