import { Theme, StrictRule, AcademicLevel, InstructionTemplate } from './types';

export const INITIAL_MODULES = ['Grammar', 'Reading', 'Vocabulary'];

export const LANGUAGES = ['English', 'Khmer', 'Chinese', 'Korean', 'French'];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  'Kid' as any, 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 
  'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10', 'Level 11', 'TOEFL' as any, 'IELTS' as any
];

export const THEMES: Theme[] = [
  { id: 'default', name: 'Academic Classic', color: '#ea580c', bg: '#ffffff', accent: '#f97316' },
  { id: 'modern', name: 'Modern Professional', color: '#0f172a', bg: '#ffffff', accent: '#334155' },
  { id: 'royal', name: 'Royal Blueprint', color: '#1e3a8a', bg: '#f8fafc', accent: '#3b82f6' },
  { id: 'forest', name: 'Forest Scholar', color: '#064e3b', bg: '#f0fdf4', accent: '#10b981' },
  { id: 'crimson', name: 'Crimson Archive', color: '#7f1d1d', bg: '#fef2f2', accent: '#ef4444' },
  { id: 'midnight', name: 'Midnight Architect', color: '#1e293b', bg: '#0f172a', accent: '#6366f1' },
  { id: 'beach', name: 'Tropical Beach', color: '#0284c7', bg: 'linear-gradient(to bottom, #bae6fd, #fef3c7)', accent: '#0ea5e9' },
  { id: 'sunset', name: 'Sunset Horizon', color: '#9d174d', bg: 'linear-gradient(to top right, #fdf2f8, #fff7ed)', accent: '#db2777' },
  { id: 'nebula', name: 'Deep Nebula', color: '#7c3aed', bg: 'radial-gradient(circle at center, #2e1065, #0f172a)', accent: '#8b5cf6' },
  { id: 'zen', name: 'Zen Garden', color: '#4d7c0f', bg: '#f7fee7', accent: '#65a30d' },
];

export const SUBJECTS = [
  {
    id: 'cambodia',
    name: 'Cambodia',
    names: ['Tevi', 'Vuthy', 'Sreypov', 'Dara', 'Sokha', 'Chann', 'Bopha', 'Piseth', 'Rithy', 'Leakhena'],
    places: ['Angkor Wat', 'Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kep', 'Preah Vihear', 'Tonle Sap', 'Mekong River']
  },
  {
    id: 'usa',
    name: 'USA',
    names: ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'],
    places: ['New York City', 'Grand Canyon', 'Statue of Liberty', 'White House', 'Golden Gate Bridge', 'Yellowstone', 'Disney World', 'Las Vegas', 'Hollywood', 'Mount Rushmore']
  },
  {
    id: 'china',
    name: 'China',
    names: ['Lie Bui', 'Wei Chen', 'Li Wang', 'Zhang Min', 'Liu Yang', 'Chen Jing', 'Yang Bo', 'Zhao Lei', 'Huang Yan', 'Zhou Tao'],
    places: ['Great Wall', 'Forbidden City', 'Shanghai Bund', 'Terracotta Army', 'West Lake', 'Potala Palace', 'Li River', 'Yellow Mountains', 'Zhangjiajie', 'Jiuziaigou']
  }
];

export const FONTS = [
  { name: 'Garamond', family: "'EB Garamond', serif" },
  { name: 'Times New Roman', family: "'Times New Roman', serif" },
  { name: 'Georgia', family: "Georgia, serif" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Merriweather', family: "Merriweather, serif" },
  { name: 'Lora', family: "Lora, serif" },
  { name: 'Arial', family: "Arial, sans-serif" },
  { name: 'Helvetica', family: "Helvetica, sans-serif" },
  { name: 'Inter', family: "Inter, sans-serif" },
  { name: 'Roboto', family: "Roboto, sans-serif" },
  { name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { name: 'Montserrat', family: "Montserrat, sans-serif" },
  { name: 'Poppins', family: "Poppins, sans-serif" },
  { name: 'Oswald', family: "Oswald, sans-serif" },
  { name: 'Courier New', family: "'Courier New', Courier, monospace" },
  { name: 'JetBrains Mono', family: "'JetBrains Mono', monospace" },
  { name: 'Pacifico', family: "Pacifico, cursive" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Great Vibes', family: "'Great Vibes', cursive" },
  { name: 'Cinzel', family: "Cinzel, serif" },
];

export const PAPER_DESIGNS = [
  '', 'design-modern-blue', 'design-classic', 'design-minimalist', 'design-playful', 
  'design-professional', 'design-elegant', 'design-technical', 'design-eco', 
  'design-contrast', 'design-two-fold', 'design-projector', 'design-modern-round', 
  'design-bold-red', 'design-royal-gold', 'design-deep-ocean', 'design-sunset-vibrant', 
  'design-cyberpunk', 'design-academic-heavy', 'design-art-deco', 'design-futuristic', 
  'design-col-table-1', 'design-col-table-2', 'design-col-table-3', 'design-col-table-4', 
  'design-col-table-5', 'design-col-table-6', 'design-col-table-7', 'design-col-table-8', 
  'design-col-table-9', 'design-col-table-10'
];

export const GLOBAL_STRICT_COMMAND = `### DPSS NEURAL ARCHITECTURAL ENGINE: ELITE V4 ###
Objective: Destroy robotic patterns and enforce situational logic via renumbered Neural Laws.

--- 🧠 [LAW 1: COGNITIVE INTEGRITY & FIREWALL] ---
1. [MODULE FIREWALL - CRITICAL]: Vocabulary, Reading, and Grammar must NEVER leak. DO NOT test grammar in Vocabulary.
2. [SYSTEM ISOLATION]: All distractors MUST be from the same system. No fillers unless testing cross-system meaning.
3. [NO-FREE-VERB]: MCQ stems MUST NOT contain the auxiliary/modal OR the main verb. Put both in options to test full phrase: "She ____ a doctor." (A. must sees B. has to see).
4. [SITUATIONAL EVIDENCE]: Grammar must be inferred from context, NOT time markers like "yesterday".
5. [STRICT GROUNDING]: Use ONLY uploaded source. FORBIDDEN from inventing content.
6. [NEURAL CLARITY]: Ban "AI-speak" (tapestry/vibrant). Use natural school-life subjects.

--- 🌍 [LAW 2: SUBJECT & SITUATIONAL ENTROPY] ---
7. [GLOBAL MIX]: Mix Cambodia, China, USA, South Korea in EVERY section. Use diverse subjects (pronouns, gerunds, names like "Sophea", "Liam", "Chen").
8. [UNIVERSAL NUANCE]: Apply word-position rules and situational logic (must vs have to). Distractors must be secondary nuanced "near-misses".
9. [COHERENCE TRAP]: Include one irrelevant noisy sentence in reading passages.
10. [INFINITE VARIETY]: FORBIDDEN from repeating scenarios. Every test must be fresh.

--- ⚙️ [LAW 3: STRUCTURAL & KEY CONTROL] ---
11. [HORIZONTAL MCQ - ABSOLUTE]: The question stem MUST end with a line break. Options A-D MUST start on a NEW line.
    - LAYOUT: Exactly 7 &nbsp; before A. Exactly 15 &nbsp; between options.
    - Example:
      1. This is the question statement.
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A. Option 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B. Option 2...
12. [KEY ENTROPY]: Use BUCKET RANDOMIZATION (shuffle 10-item bucket). Every letter A-D must appear. Max streak 2. Key at TOP of scratchpad FIRST.
13. [LEVEL SCALE]: Complexity MUST scale with {{LEVEL}} (Kid vs IELTS).
14. [POSITION RULES]: Test word order ("as good a student as", "Of the two").
15. [NON-MCQ FORMATTING - MANDATORY]: 
    - REWRITE: Use a long line "_____________________________________________________".
    - COMPLETE: Use exactly 13 underscores "_____________ (verb)".
    - CORR/INC: Use exactly 5 underscores "1. _____" (5 underscores).
    - TRUE/FALSE: Use exactly 5 underscores in parentheses "1. (_____)".

--- 🎨 [LAW 4: WORKBOOK DENSITY] ---
16. [SPACE ENTROPY]: Minimal vertical waste. Text follows number on same line. 6 &nbsp; indentation for questions.
17. [STRUCTURAL PURITY]: HTML ONLY (<b>, <table>). No asterisks (*). No markdown.
18. [ZERO-MARGIN]: Use style="margin: 0;" on all elements. Use <div> for blocks.
19. [ISOLATION - CRITICAL]: The statement should NEVER be on the same line as answer choices. Options MUST be below.

--- 🎭 [LAW 5: HUMAN EXAMINER MODE] ---
20. [SUBJECT VARIETY]: You are FORBIDDEN from using generic subjects. Mix Sophea, Liam, Chen, "My stubborn cat", "The chef", "A lonely astronaut", Gerunds (Swimming), and complex subjects (The man in the blue suit).
21. [WORD FORM SHIFT]: Reading answers MUST paraphrase. NO keyword matching.
22. [LEXICAL TRAP]: Reading distractors use text words in different contexts.
23. [COGNITIVE LAYERING]: Mix gist, detail, and deep inference in reading. 

### PRIORITY: MCQ LAYOUT (7-15), 13-UNDERSCORE COMPLETE, AND SUBJECT VARIETY ARE ABSOLUTE. ###
`;

export const DEFAULT_STRICT_RULES: StrictRule[] = [
  { id: 'rule-precision', label: '1. CORE: PRECISION TRAP LOGIC', description: 'Forces Law 1/2.', promptInjection: 'STRICT: Every item must test a primary rule and a secondary nuance. Distractors must look 90% correct.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-density', label: '2. VISUAL: SPACE DENSITY', description: 'Law 4 workbook density.', promptInjection: 'STRICT DENSITY: No vertical waste. Text follows number on same line. Minimal margins.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-mcq-layout', label: '3. MCQ LAYOUT: 7-15 PROTOCOL', description: '7 spaces before A, 15 between options.', promptInjection: 'MCQ LAYOUT: Put all 4 short options on ONE line BELOW the question stem. 7 &nbsp; before A., exactly 15 &nbsp; between options. The question stem MUST end with a line break to prevent merging with options.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-purity', label: '4. SUPPORT: STRUCTURAL PURITY', description: 'Law 4 HTML standard.', promptInjection: 'STRICT HTML: Use <b> and <table>. FORBIDDEN from using markdown asterisks. Indent 6 spaces.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-neutrality', label: '5. GLOBAL NEUTRALITY', description: 'No biases in grammar/vocab.', promptInjection: 'Global Grammar/ Vocabulary/ Reading Neutrality: Removed biases towards specific grammar/ Vocabulary rules mentioned in examples, ensuring variety across all parts of the test.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-no-free-verb', label: '6. NO-FREE-VERB RULE', description: 'Grammar stem cleanup.', promptInjection: '[NO-FREE-VERB RULE]: In MCQ grammar, never place the main auxiliary or modal verb directly in the question stem. The options MUST include both the modal/auxiliary AND the main verb together to force students to decide on the full structure (e.g. "She ____ a doctor" instead of "She ____ see a doctor" if testing see). Distractors must test verb forms too (e.g. "must sees", "has to see", "had to see"). FOR F.I.B: provide base verb in parentheses: "He ____ (go) to school."', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-situational-logic', label: '7. UNIVERSAL SITUATIONAL LOGIC', description: 'Nuance vs grammar formulas.', promptInjection: '[UNIVERSAL SITUATIONAL & POSITIONAL LOGIC]: Apply situational nuance and word-position rules to ALL grammar types. Use distractors that are grammatically correct in isolation but situationally incorrect in context (e.g. have to vs must based on opinion/rule).', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-evidence', label: '8. SITUATIONAL EVIDENCE', description: 'Context vs time markers.', promptInjection: '[SITUATIONAL EVIDENCE REQUIREMENT]: Grammar must be inferred from context evidence (e.g. "Her notebook is closed"), NOT obvious time markers (yesterday, now, etc.). This develops student reasoning skills.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-item-entropy', label: '9. ITEM ENTROPY', description: 'Complexity and variety.', promptInjection: '[ITEM RANDOMIZATION & ENTROPY]: FORBIDDEN from using predictable sentence starters. Shuffle all structures, subjects, and contexts. POLARITY MIX: You MUST mix Positive (+), Negative (-), and Question (?) forms in every part.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-scaling', label: '10. ARCHITECTURAL SCALING', description: 'Level-based complexity.', promptInjection: '[LEVEL-BASED ARCHITECTURAL SCALING]: Complexity MUST scale with {{LEVEL}}. Kids: simple. Mid (4-7): compound. High (8+): relative clauses, passive voice, academic vocabulary.', active: true, priority: 'High', category: 'General' },
  { id: 'rule-position-logic', label: '11. POSITION & TRAP RULES', description: 'Word order and comparison traps.', promptInjection: '[POSITION RULES]: Test tricky word orders: "as good a student as", "Of the two... taller", "Of all... most", "Not only is he". Rotate between at least 4 different comparison structures if testing Adjectives.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-exhaustion', label: '12. GRAMMAR EXHAUSTION', description: 'Testing every sub-rule.', promptInjection: '[GRAMMAR RULE EXHAUSTION]: Identify and test EVERY specific sub-rule for the target {{TOPIC}}. If there are 5 sub-rules, all 5 MUST appear in the test. Every generation must feel unique.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'rule-pragmatic', label: '13. PRAGMATIC BOUNDARY', description: 'Communicative intention.', promptInjection: '[PRAGMATIC BOUNDARY TESTING]: Distinguish between types of obligation and meaning in context (e.g. external rule vs personal insistence). Students must understand intention, not just grammar labels.', active: true, priority: 'High', category: 'Grammar' }
];

export const DEFAULT_MASTER_PROTOCOLS: StrictRule[] = [
  { id: 'mp-isolation', label: '1. SYSTEM ISOLATION', description: 'Law 1: Target systems only.', promptInjection: 'STRICT ISOLATION: All distractors must be from the same grammar system family. No fillers like can/should unless testing meaning differences between systems.', active: true, priority: 'High', category: 'Grammar' },
  { id: 'mp-mix', label: '2. GLOBAL SUBJECT MIX', description: 'Law 2: Subjects and Countries.', promptInjection: 'SUBJECT MIX: Subjects should be mixed with Cambodia, China, USA, South Korea names/places. Mix subjects: pronouns, connectors like "And", Gerunds, places, things, great people, To-infinitive. Use ALL for level 5 up. Human test-like design.', active: true, priority: 'High', category: 'General' },
  { id: 'mp-grounding', label: '3. STRICT GROUNDING', description: 'Law 1: Source file dominance.', promptInjection: 'STRICT GROUNDING: Use uploaded source. FORBIDDEN from inventing definitions or study content.', active: true, priority: 'High', category: 'General' },
  { id: 'mp-key-entropy', label: '4. ANSWER KEY ENTROPY', description: 'Law 3: Bucket Randomization.', promptInjection: '[ANSWER KEY ENTROPY - BUCKET RANDOMIZATION]: FORBIDDEN from using cycles (A-B-C-D). Use BUCKET METHOD: for 10 items, pre-select a bucket (3As, 2Bs, 2Cs, 3Ds), shuffle it. Every letter MUST appear at least once. Max 2 identical answers in a row. Write Key at TOP of scratchpad FIRST.', active: true, priority: 'High', category: 'General' },
  { id: 'mp-vocab-enrichment', label: '5. VOCAB ENRICHMENT', description: 'Phrasal verbs and idioms.', promptInjection: 'VOCABULARY RULE: Add 1-3 phrasal verbs and one idiom for every 10 items even when using source. Ensure non-repetitive variety.', active: true, priority: 'High', category: 'Vocabulary' },
  { id: 'mp-coherence-trap', label: '6. COHERENCE TRAPS', description: 'Reading noise filtering.', promptInjection: '[COHERENCE TRAPS]: Include one "Distractor Sentence" in the reading passage that looks like it belongs to the topic but is irrelevant to the questions. Tests noise filtering.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-scenario-variety', label: '7. INFINITE VARIETY', description: 'Infinite Scenarios.', promptInjection: '[INFINITE SCENARIO VARIETY]: FORBIDDEN from repeating scenarios or sentence structures. Every test must be fresh: new characters, locations, situations. Randomize everything.', active: true, priority: 'High', category: 'General' },
  { id: 'mp-anti-robot', label: '8. ANTI-ROBOT STARTERS', description: 'Subject variety.', promptInjection: '[ANTI-ROBOT SENTENCE STARTERS]: FORBIDDEN from using repetitive sentence starters (Item 1 always "I think"). Shuffle all subjects (The chef, A lonely astronaut, etc.).', active: true, priority: 'High', category: 'General' },
  { id: 'mp-human-examiner', label: '9. HUMAN EXAMINER MODE', description: 'Reading design logic.', promptInjection: '[EXPERT HUMAN READING EXAMINER MODE]: Design like an expert: Blueprint first (gist, detail, inference), non-linear item order, cognitive layering. Use negative framing and reference-resolution traps.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-lexical-trap', label: '10. LEXICAL OVERLAP', description: 'Reading distractor logic.', promptInjection: '[LEXICAL OVERLAP TRAP]: At least one reading distractor MUST use words from the text but describing different situations to punish word-matching.', active: true, priority: 'High', category: 'Reading' },
  { id: 'mp-gist-balance', label: '11. GIST & DETAIL BALANCE', description: 'Reading question types.', promptInjection: '[THE GIST & DETAIL BALANCE]: Every reading test must include exactly one "Global" question (main purpose) and several "Local" questions (specific details).', active: true, priority: 'High', category: 'Reading' }
];

export const BORDER_FRAME_INSTRUCTION = `### STYLIST FRAME PROTOCOL ###
Wrap content in a double border: border: 4px double #ea580c; padding: 15px; border-radius: 12px;`;

export const PART_BACKGROUND_INSTRUCTION = `[PART BACKGROUND]: Every part (A, B, C) MUST be wrapped in a styling tag with a subtle background color and border to distinguish sections clearly.`;

export const INSTRUCTION_HEADER_BACKGROUND_INSTRUCTION = `[INSTRUCTION HEADER BACKGROUND]: Instruction headers MUST have a distinct background color.`;

export const PAGE_STYLES = [
  { name: 'Classic border', style: 'border: 1px solid #ccc; padding: 20px;' },
  { name: 'Modern frame', style: 'border: 2px solid #333; border-radius: 8px; padding: 25px;' }
];

export const INITIAL_TEMPLATES: InstructionTemplate[] = [
  { 
    id: 'v_study_table_elite', 
    category: 'VOCABULARY', 
    label: 'STUDY TABLE', 
    professionalLabel: '<b>STUDY THE FOLLOWING TERMS AND DEFINITIONS.</b>', 
    prompt: '2-column HTML table. GROUNDING: Use source. FILL all columns. NO underscores. NO answer key for this part.', 
    columnCount: 2 
  },
  { 
    id: 'v_matching_elite', 
    category: 'VOCABULARY', 
    label: 'MATCHING', 
    professionalLabel: '<b>MATCH THE TERMS WITH THE DEFINITIONS.</b>', 
    prompt: '2-column table. Column 1: Blank + Number + Term. Column 2: Letter + Definition. Scramble order. Mix subjects. ALL content must be strictly Vocabulary rules (NO grammar).', 
    columnCount: 1 
  },
  { 
    id: 'v_mcq_elite', 
    category: 'VOCABULARY', 
    label: 'MCQ', 
    professionalLabel: '<b>CHOOSE THE BEST WORD FOR EACH CONTEXT.</b>', 
    prompt: 'Vocab MCQ. ALL choices must be Vocabulary words, NOT grammar. All choices must be the same part of speech. [GLOBAL MIX] for names. Horizontal compression. Indent 6 spaces.', 
    columnCount: 1 
  },
  { 
    id: 'v_speaking_elite', 
    category: 'VOCABULARY', 
    label: 'SPEAKING', 
    professionalLabel: '<b>VOCABULARY SPEAKING & DISCUSSION.</b>', 
    prompt: '10 conversation questions using target vocab. Mix school scenarios like noisy motorbikes or rainy days (Law 5).', 
    columnCount: 1 
  },
  { 
    id: 'v_study_example_elite', 
    category: 'VOCABULARY', 
    label: 'STUDY EXAMPLE', 
    professionalLabel: '<b>STUDY THESE EXAMPLE SENTENCES.</b>', 
    prompt: 'Context sentences for study. NO underscores. Focus strictly on vocabulary words, not peoples names. Add 1-3 phrasal verbs and 1 idiom per 10 items. Burstiness in sentence length.', 
    columnCount: 1 
  },
  { 
    id: 'v_supply_terms_elite', 
    category: 'VOCABULARY', 
    label: 'SUPPLY KEY TERMS', 
    professionalLabel: '<b>READ THE DEFINITION AND SUPPLY THE CORRECT TERM.</b>', 
    prompt: '2-column table. Column 1: Definition. Column 2: Blank line for term. No MCQ.', 
    columnCount: 1 
  },
  { 
    id: 'v_syn_writing_elite', 
    category: 'VOCABULARY', 
    label: 'SYNONYM WRITING', 
    professionalLabel: '<b>REWRITE THE SENTENCES USING A SYNONYM FOR THE HIGHLIGHTED WORD.</b>', 
    prompt: 'Sentence rewrite using synonyms. Long underscores for answers. [GLOBAL MIX] subjects.', 
    columnCount: 1 
  },
  { 
    id: 'v_tf_vocab_elite', 
    category: 'VOCABULARY', 
    label: 'T/F', 
    professionalLabel: '<b>DECIDE IF THE STATEMENTS ARE TRUE OR FALSE.</b>', 
    prompt: 'Vocab focused T/F. Style: "1. (_____)" (5 underscores). No MCQ.', 
    columnCount: 1 
  },
  { 
    id: 'v_vocab_box_elite', 
    category: 'VOCABULARY', 
    label: 'VOCABULARY BOX', 
    professionalLabel: '<b>FILL IN THE BLANKS WITH WORDS FROM THE BOX.</b>', 
    prompt: 'Word bank fill-in. Include 3 extra distractors. Apply [GLOBAL MIX] to stems. Compact layout.', 
    columnCount: 1 
  },

  // READING ELITE
  { 
    id: 'r_tf_stmt_elite', 
    category: 'READING', 
    label: 'TRUE/FALSE', 
    professionalLabel: '<b>DETERMINE IF THE STATEMENTS ARE TRUE OR FALSE.</b>', 
    prompt: 'Reading passage. Mix subjects. Include [COHERENCE TRAP]. Follow with T/F: "1. (_____)".', 
    columnCount: 1 
  },
  { 
    id: 'r_mcq_elite', 
    category: 'READING', 
    label: 'MCQ', 
    professionalLabel: '<b>CHOOSE THE BEST RESPONSE BASED ON THE TEXT.</b>', 
    prompt: 'Reading MCQ. Apply [WORD FORM SHIFT]. Gist/Detail mix. No keyword matching.', 
    columnCount: 1 
  },
  { 
    id: 'r_short_answer_elite', 
    category: 'READING', 
    label: 'SHORT ANSWER', 
    professionalLabel: '<b>ANSWER THE QUESTIONS BRIEFLY BASED ON THE TEXT.</b>', 
    prompt: 'Reading passage. Short answer questions. Test paraphrase recognition.', 
    columnCount: 1 
  },
  { 
    id: 'r_inferential_elite', 
    category: 'READING', 
    label: 'INFERENTIAL', 
    professionalLabel: '<b>INFERENTIAL COMPREHENSION ANALYSIS.</b>', 
    prompt: 'Items testing deep inference. What is implied but not stated?', 
    columnCount: 1 
  },
  { 
    id: 'r_critical_thinking_elite', 
    category: 'READING', 
    label: 'CRITICAL THINKING', 
    professionalLabel: '<b>CRITICAL THINKING & ANALYSIS.</b>', 
    prompt: 'Analyze author purpose and provide evidence-based opinions.', 
    columnCount: 1 
  },

  // GRAMMAR ELITE
  { 
    id: 'g_mcq_elite', 
    category: 'GRAMMAR', 
    label: 'MCQ', 
    professionalLabel: '<b>CHOOSE THE BEST OPTION.</b>', 
    prompt: 'Precision MCQ. Apply [SYSTEM ISOLATION], [NO-FREE-VERB], and [GLOBAL MIX]. Horizontal compression. Indent 6 spaces.', 
    columnCount: 1 
  },
  { 
    id: 'g_correct_incorrect_elite', 
    category: 'GRAMMAR', 
    label: 'CORRECT/INCORRECT', 
    professionalLabel: '<b>WRITE C (CORRECT) OR I (INCORRECT).</b>', 
    prompt: 'C/I assessment. Style "1. _____" (5 underscores). No MCQ. Apply system isolation.', 
    columnCount: 2 
  },
  { 
    id: 'g_circle_elite', 
    category: 'GRAMMAR', 
    label: 'CIRCLE', 
    professionalLabel: '<b>CIRCLE THE CORRECT OPTION.</b>', 
    prompt: 'Circle correct word in context. Style: "1. She (is/are) happy." Apply [SYSTEM ISOLATION].', 
    columnCount: 1 
  },
  { 
    id: 'g_complete_sentences_elite', 
    category: 'GRAMMAR', 
    label: 'SENTENCE COMPLETE', 
    professionalLabel: '<b>COMPLETE THE SENTENCES WITH THE CORRECT FORM.</b>', 
    prompt: 'Fill-in with "1. She ____ (go) to school." 13 underscores.', 
    columnCount: 1 
  },
  { 
    id: 'g_double_mcq_elite', 
    category: 'GRAMMAR', 
    label: 'DOUBLE MCQ', 
    professionalLabel: '<b>CHOOSE THE TWO BEST OPTIONS.</b>', 
    prompt: 'Items with two blanks or two correct options. [SYSTEM ISOLATION] is mandatory.', 
    columnCount: 1 
  },
  { 
    id: 'g_write_correct_form_elite', 
    category: 'GRAMMAR', 
    label: 'WRITE CORRECT FORM', 
    professionalLabel: '<b>WRITE THE CORRECT FORM OF THE VERB.</b>', 
    prompt: 'Grammar practice for verb forms. Mixed subjects. Situational context.', 
    columnCount: 1 
  },
  { 
    id: 'g_rewrite_sentences_elite', 
    category: 'GRAMMAR', 
    label: 'REWRITE SENTENCES', 
    professionalLabel: '<b>REWRITE THE FOLLOWING SENTENCES WITHOUT CHANGING THE MEANING.</b>', 
    prompt: 'Sentence transformation. Long blank line. Test situational logic.', 
    columnCount: 1 
  },
  {
    id: 'g_spelling_rules_elite',
    category: 'GRAMMAR',
    label: 'SPELLING RULES',
    professionalLabel: '<b>APPLY SPELLING RULES CORRECTLY.</b>',
    prompt: 'Test spelling rules in context.',
    columnCount: 1
  },
  {
    id: 'g_word_box_elite',
    category: 'GRAMMAR',
    label: 'WORD BOX',
    professionalLabel: '<b>FILL IN THE BLANKS WITH WORDS FROM THE BOX.</b>',
    prompt: 'Word box grammar exercise.',
    columnCount: 1
  },
  {
    id: 'g_cloze_passage_elite',
    category: 'GRAMMAR',
    label: 'CLOZE PASSAGE',
    professionalLabel: '<b>COMPLETE THE TEXT WITH THE CORRECT WORDS.</b>',
    prompt: 'Paragraph with blanks testing grammar.',
    columnCount: 1
  },
  {
    id: 'g_odd_one_out_elite',
    category: 'GRAMMAR',
    label: 'ODD ONE OUT',
    professionalLabel: '<b>CHOOSE THE OPTION THAT DOES NOT BELONG.</b>',
    prompt: 'Odd one out grammar tasks.',
    columnCount: 1
  },
  {
    id: 'g_editing_elite',
    category: 'GRAMMAR',
    label: 'EDITING',
    professionalLabel: '<b>EDIT THE PASSAGE.</b>',
    prompt: 'Find and correct errors.',
    columnCount: 1
  },
  {
    id: 'g_reduce_elite',
    category: 'GRAMMAR',
    label: 'REDUCE',
    professionalLabel: '<b>REDUCE THE CLAUSES AS DIRECTED.</b>',
    prompt: 'Reduce relative/adverbial clauses.',
    columnCount: 1
  },
  {
    id: 'g_best_rewrite_elite',
    category: 'GRAMMAR',
    label: 'BEST REWRITE',
    professionalLabel: '<b>CHOOSE THE BEST REWRITE FOR THE SENTENCE.</b>',
    prompt: 'Select the best way to rewrite the sentence.',
    columnCount: 1
  },
  {
    id: 'g_copy_all_elite',
    category: 'GRAMMAR',
    label: 'COPY ALL',
    professionalLabel: '<b>COPY THE FOLLOWING EXACTLY.</b>',
    prompt: 'Transcribe the sentences or text verbatim.',
    columnCount: 1
  },
  {
    id: 'r_summary_elite',
    category: 'READING',
    label: 'SUMMARY',
    professionalLabel: '<b>COMPLETE THE SUMMARY OF THE TEXT.</b>',
    prompt: 'Complete a summary with the correct vocabulary or grammar form.',
    columnCount: 1
  },
  {
    id: 'r_reading_comp_elite',
    category: 'READING',
    label: 'READING COMPREHENSION',
    professionalLabel: '<b>READ THE PASSAGE AND ANSWER THE QUESTIONS.</b>',
    prompt: 'General reading comprehension questions.',
    columnCount: 1
  },
  {
    id: 'r_tf_ng_elite',
    category: 'READING',
    label: 'T/F/NG ANALYSIS',
    professionalLabel: '<b>TRUE / FALSE / NOT GIVEN.</b>',
    prompt: 'Assess statements as True, False or Not Given based on the text.',
    columnCount: 1
  },
  {
    id: 'r_expert_mcq_elite',
    category: 'READING',
    label: 'EXPERT MCQ',
    professionalLabel: '<b>CHOOSE THE BEST RESPONSE BASED ON THE TEXT.</b>',
    prompt: 'Complex multiple choice reading questions.',
    columnCount: 1
  },
  {
    id: 'r_referential_elite',
    category: 'READING',
    label: 'REFERENTIAL',
    professionalLabel: '<b>ANSWER THE FOLLOWING REFERENCE QUESTIONS.</b>',
    prompt: 'Identify what pronouns or reference words refer to in the text.',
    columnCount: 1
  }
];