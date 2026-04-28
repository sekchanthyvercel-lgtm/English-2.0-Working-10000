import { Theme, StrictRule, AcademicLevel, InstructionTemplate } from './types';

export const INITIAL_MODULES = ['Grammar', 'Reading', 'Vocabulary'];

export const LANGUAGES = ['English', 'Khmer', 'Chinese', 'Korean', 'French'];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  'Kid', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 
  'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10', 'Level 11', 'TOEFL', 'IELTS'
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
  '', // 0: Standard
  'design-modern-blue', // 1
  'design-classic', // 2
  'design-minimalist', // 3
  'design-playful', // 4
  'design-professional', // 5
  'design-elegant', // 6
  'design-technical', // 7
  'design-eco', // 8
  'design-contrast', // 9
  'design-two-fold', // 10
  'design-projector', // 11
  'design-modern-round', // 12
  'design-bold-red', // 13
  'design-royal-gold', // 14
  'design-deep-ocean', // 15
  'design-sunset-vibrant', // 16
  'design-cyberpunk', // 17
  'design-academic-heavy', // 18
  'design-art-deco', // 19
  'design-futuristic', // 20
  'design-col-table-1', // 21
  'design-col-table-2', // 22
  'design-col-table-3', // 23
  'design-col-table-4', // 24
  'design-col-table-5', // 25
  'design-col-table-6', // 26
  'design-col-table-7', // 27
  'design-col-table-8', // 28
  'design-col-table-9', // 29
  'design-col-table-10', // 30
];

export const SUBJECTS = [
  {
    id: 'grammar_nodes',
    name: 'Advanced Grammar',
    names: ['Compound Subject (He and I)', 'The Manager', 'A group of students', 'Gerund (Swimming)', 'Nobody', 'Each applicant', 'Neither of them', 'The CEO', 'Possessive Pronoun (Hers)', 'Relative Clause'],
    places: ['The Boardroom', 'The Research Lab', 'The Conference Centre', 'The Digital Hub', 'The University Hall', 'The Library Loft', 'The Innovation Park', 'The Global Summit', 'The Academic Plaza', 'The Strategy Room']
  },
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
    places: ['Great Wall', 'Forbidden City', 'Shanghai Bund', 'Terracotta Army', 'West Lake', 'Potala Palace', 'Li River', 'Yellow Mountains', 'Zhangjiajie', 'Jiuzhaigou']
  },
  {
    id: 'korea',
    name: 'South Korea',
    names: ['Kim Min-jun', 'Lee Seo-yeon', 'Park Ji-hoon', 'Choi Ha-eun', 'Jung Do-yoon', 'Kang Ji-woo', 'Jo Hyun-woo', 'Yoon Seo-ah', 'Jang Min-ho', 'Lim Da-in'],
    places: ['Gyeongbokgung Palace', 'N Seoul Tower', 'Jeju Island', 'Bukchon Hanok Village', 'Haeundae Beach', 'Seoraksan National Park', 'DMZ', 'Bulguksa Temple', 'Lotte World', 'Dongdaemun Design Plaza']
  },
  {
    id: 'japan',
    name: 'Japan',
    names: ['Haruto', 'Yua', 'Itsuki', 'Akari', 'Minato', 'Koharu', 'Ren', 'Himari', 'Yuma', 'Mei'],
    places: ['Mount Fuji', 'Kyoto Temples', 'Tokyo Tower', 'Osaka Castle', 'Nara Park', 'Hiroshima Memorial', 'Hokkaido', 'Shibuya Crossing', 'Itsukushima Shrine', 'Okinawa']
  },
  {
    id: 'france',
    name: 'France',
    names: ['Lucas', 'Emma', 'Gabriel', 'Jade', 'Louis', 'Louise', 'Raphaël', 'Alice', 'Arthur', 'Chloé'],
    places: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame', 'Versailles', 'Mont Saint-Michel', 'French Riviera', 'Loire Valley', 'Provence', 'Bordeaux', 'Chamonix']
  },
  {
    id: 'uk',
    name: 'UK',
    names: ['Oliver', 'Olivia', 'George', 'Amelia', 'Harry', 'Isla', 'Noah', 'Ava', 'Jack', 'Mia'],
    places: ['Big Ben', 'Stonehenge', 'London Eye', 'Buckingham Palace', 'Edinburgh Castle', 'Giant\'s Causeway', 'Lake District', 'Oxford University', 'Cambridge', 'Bath']
  },
  {
    id: 'australia',
    name: 'Australia',
    names: ['Oliver', 'Charlotte', 'William', 'Olivia', 'Jack', 'Amelia', 'Noah', 'Isla', 'Thomas', 'Mia'],
    places: ['Sydney Opera House', 'Great Barrier Reef', 'Uluru', 'Bondi Beach', 'Great Ocean Road', 'Blue Mountains', 'Kakadu', 'Whitsundays', 'Daintree Rainforest', 'Twelve Apostles']
  },
  {
    id: 'canada',
    name: 'Canada',
    names: ['Liam', 'Olivia', 'Noah', 'Emma', 'Lucas', 'Charlotte', 'Oliver', 'Amelia', 'Benjamin', 'Sophia'],
    places: ['Niagara Falls', 'Banff', 'CN Tower', 'Old Quebec', 'Whistler', 'Stanley Park', 'Peggy\'s Cove', 'Jasper', 'Butchart Gardens', 'Bay of Fundy']
  },
  {
    id: 'germany',
    name: 'Germany',
    names: ['Noah', 'Mia', 'Leon', 'Emma', 'Paul', 'Sophia', 'Lukas', 'Hannah', 'Jonas', 'Emilia'],
    places: ['Neuschwanstein Castle', 'Brandenburg Gate', 'Cologne Cathedral', 'Black Forest', 'Zugspitze', 'Heidelberg', 'Rhine Valley', 'Rothenburg', 'Sanssouci', 'Saxon Switzerland']
  },
  {
    id: 'brazil',
    name: 'Brazil',
    names: ['Miguel', 'Alice', 'Arthur', 'Laura', 'Heitor', 'Valentina', 'Bernardo', 'Helena', 'Davi', 'Sophia'],
    places: ['Christ the Redeemer', 'Amazon Rainforest', 'Iguazu Falls', 'Copacabana', 'Sugarloaf Mountain', 'Pelourinho', 'Lençóis Maranhenses', 'Pantanal', 'Fernando de Noronha', 'Ibirapuera Park']
  },
  {
    id: 'india',
    name: 'India',
    names: ['Aarav', 'Aditi', 'Vihaan', 'Diya', 'Arjun', 'Ananya', 'Sai', 'Kavya', 'Krishna', 'Neha'],
    places: ['Taj Mahal', 'Jaipur', 'Varanasi', 'Kerala Backwaters', 'Goa Beaches', 'Golden Temple', 'Hampi', 'Mysore Palace', 'Red Fort', 'Gateway of India']
  },
  {
    id: 'italy',
    name: 'Italy',
    names: ['Leonardo', 'Sofia', 'Francesco', 'Giulia', 'Alessandro', 'Aurora', 'Lorenzo', 'Ginevra', 'Mattia', 'Alice'],
    places: ['Colosseum', 'Venice Canals', 'Leaning Tower of Pisa', 'Vatican City', 'Pompeii', 'Amalfi Coast', 'Cinque Terre', 'Florence Duomo', 'Lake Como', 'Pantheon']
  },
  {
    id: 'mexico',
    name: 'Mexico',
    names: ['Santiago', 'Sofía', 'Mateo', 'María José', 'Sebastián', 'Valentina', 'Leonardo', 'Ximena', 'Matías', 'Camila'],
    places: ['Chichén Itzá', 'Teotihuacan', 'Cancún', 'Tulum', 'Palenque', 'Copper Canyon', 'Oaxaca', 'Cabo San Lucas', 'Guanajuato', 'Zócalo']
  },
  {
    id: 'spain',
    name: 'Spain',
    names: ['Hugo', 'Lucía', 'Martín', 'Sofía', 'Lucas', 'Martina', 'Mateo', 'María', 'Leo', 'Julia'],
    places: ['Sagrada Familia', 'Alhambra', 'Park Güell', 'Prado Museum', 'Ibiza', 'Plaza Mayor', 'Mosque of Córdoba', 'Casa Batlló', 'Mount Teide', 'Guggenheim Bilbao']
  }
];

export const GLOBAL_STRICT_COMMAND = `### DPSS ULTIMATE TEST BUILDER: ELITE PROTOCOL ###
Enforce situational logic via prioritized rules.

--- 🧠 COGNITIVE INTEGRITY (MANDATORY) ---
1. [NEAR-MISS & HALLUCINATION PREVENTION]: 
    - EVERY MCQ/Correct & Incorrect/Circle question MUST have 1 contextually inferior "Near-Miss" distractor.
    - Accuracy is the #1 priority. Do not invent details outside the source text.
2. [PROFESSIONAL SENTENCE VARIETY & INVERSION]:
    - You MUST randomize sentence structures so they do not look identical.
    - Rotate between simple, compound, and complex sentences.
    - [SYNTACTIC SHUFFLE]: Vary the position of time markers and clauses.
    - [MULTI-SENTENCE CONTEXT]: For higher levels (Level 5+), use 2 or 3 sentences for a single item to provide rich context/evidence. This is CRITICAL for Level 7+. Do NOT always use just one sentence.
    - Example A: "At night, I go to sleep at 10. I love to read books before I sleep." (Fronted position + 2 sentences)
    - Example B: "I go to sleep at 10 at night." (Standard position)
    - Example C: "If you don't visit her, she is unhappy." (Conditional first)
    - Example D: "She is unhappy if you don't visit her." (Main clause first)
    - Apply this variety across ALL types of items to mimic human-designed tests.
3. [READING PASSAGE PROTOCOL]:
    - ALL reading passages MUST be in normal sentence case. NEVER generate a reading text in all-caps.
    - Reading passages MUST follow the instruction header of the section they belong to.
4. [NO DUPLICATE HEADERS]: 
    - NEVER duplicate instruction headers. A single part must only have ONE instruction header.
5. [12 UNDERSCORE RULE]: 
    - For ALL fill-in-the-blank or sentence completion items, you MUST use exactly 12 non-breaking underscores: ____________
6. [VOCABULARY 1-4-5 BOOSTER]:
    - For every 10 vocabulary items, you MUST include: 1 Idiom, 4 Useful Phrases, and 5 Target Words.
    - All must be DIRECTLY RELATED to {{TOPIC}}.
    - [LEAST REPETITION]: Ensure the idiom and phrases are new every single time.
7. [NO-FREE-VERB & SITUATIONAL EVIDENCE]:
    - [STRICT MCQ]: NEVER place the main auxiliary or modal verb directly in the question stem.
    - The main verb MUST be bundled into the answer options (e.g., A. must wear, B. have to wear).
    - [SITUATIONAL DESIGN]: Use context/evidence to force grammar choices.
    - Weak: "She ____ her homework yesterday."
    - Strong: "Her notebook is closed and she looks relieved. She ____ her homework." (Infer completion).
    - [SITUATIONAL-EVIDENCE]: Grammar must be inferred from context/evidence, not obvious time markers (yesterday, now). But sometimes, we use obvious time markers (yesterday, now), especially for lower levels.
    - [NUANCE TRAP]: Use distractors that are grammatically correct in isolation but situationally wrong.
8. [PURE VOCABULARY CONTROL]:
    - In vocabulary sections, all options must be the same part of speech and form.
    - Focus 100% on semantics. Grammar Blackout: No tense or agreement clues allowed.
9. [PRAGMATIC-BOUNDARY]: Distinguish between types of obligation and meaning in context (e.g., Must vs Have To).
10. [TRUE/FALSE & C/I FORMAT]:
    - FORBIDDEN from generating A, B, C, D options.
    - Format MUST be exactly: "1. ______ [Statement]".
    - The answer key MUST be T, F, C, or I.

--- ⚙️ STRUCTURAL & POSITIONAL CONTROL ---
11. [ITEM-SEPARATION]: Every numbered item MUST start on a NEW LINE using an HTML <p> or <br> tag.
12. [HORIZONTAL MCQ COMPRESSION]:
    - For short options (less than 5 words): Print all four options on a SINGLE horizontal line.
    - Use exactly 10 non-breaking spaces between options: A. [text]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B. [text]...
13. [ANSWER KEY ENTROPY]:
    - Use "Bucket Randomization" for MCQs. Max 2 identical answers in a row.
    - Every letter (A, B, C, D) must appear at least once per 10 items.
14. [SYNTACTIC-DISTANCE]: (Level 5+) Separate subject from verb using relative clauses or prepositional phrases.
15. [ADVANCED-COMP]: Test precision structures: "as good a student as", "of the two", "the more..., the more...".
16. [SVA & TENSE INTEGRITY]:
    - [SUBJECT-VERB AGREEMENT]: Implement "Interference Clauses" (e.g., "The box of old cookies ____ (be)").
    - [TENSE ANCHOR]: In multi-sentence items, do NOT shift tenses unless the shift is the target.
    - Ensure logical timeline consistency throughout the context.

--- 🎨 LAYOUT & VISUALS ---
17. [SEPARATE-TABLES]: Use a separate HTML <table> for each PART.
18. [NO EMPTY SPACING]: Zero blank lines between header/ruler and the first item.
19. [NO BOLD CHOICES]: You MUST NOT use bold styling for MCQ options or choices.
20. [MCQ-FORMAT]: Options MUST start on a new line below the query. Indent "A." with 6 spaces (&nbsp;).

--- 🎭 SCENARIO & CONTENT ---
21. [ANTI-ROBOT SUBJECTS]: Forbidden from repetitive sentence starters. Randomize all subjects (e.g., "The chef", "A stray cat", "The researchers").
22. [TOPIC-SPECIFIC VOCABULARY & IDIOMS]: Phrasal verbs and idioms MUST relate specifically to {{TOPIC}}.
23. [LEVEL-BASED ARCHITECTURAL SCALING]:
    - [KIDS/BEGINNER]: Max 7-10 words. No clauses.
    - [LEVEL 4-6]: Compound sentences. Intro to relative clauses. 15-20 words.
    - [LEVEL 7-9]: Academic tone. Mixed complex structures (although, despite, whereas). 25+ words. Multi-sentence contexts are required.
24. [GRAMMAR RULE EXHAUSTION]: You are MANDATED to test EVERY specific sub-rule for {{TOPIC}}. No rule left behind.

### PRIORITY: COGNITIVE INTEGRITY RULES ARE ABSOLUTE. ###
`;

export const PART_BACKGROUND_INSTRUCTION = `### PART BACKGROUND PROTOCOL ###
For each PART (A, B, C, etc.), apply a unique background style.
- If the part is in a <table>, apply the style to the <table> tag.
- If the part is a list, you MUST wrap the entire part (header + items) in a <div style="...">.
- MANDATORY: The background MUST be applied to a container that includes the instruction header.
- Ensure the background is clearly visible by using padding (e.g. padding: 15pt;).
Rotate between these styles:
1. Light Blue: background-color: #f0f9ff;
2. Soft Green: background-color: #f0fdf4;
3. Pale Yellow: background-color: #fffbeb;
4. Lavender: background-color: #f5f3ff;
5. Rose: background-color: #fff1f2;
6. NO BACKGROUND: background-color: transparent;
7. Forest Mist: background-image: linear-gradient(to bottom right, #f0fdf4, #dcfce7);
8. Ocean Calm: background-image: linear-gradient(to bottom right, #f0f9ff, #e0f2fe);
9. Mountain Air: background-image: linear-gradient(to bottom right, #f8fafc, #f1f5f9);

STRICT: Ensure text remains highly legible against these backgrounds.`;

export const INSTRUCTION_HEADER_BACKGROUND_INSTRUCTION = `### INSTRUCTION HEADER BACKGROUND PROTOCOL ###
For each PART (A, B, C, etc.), apply a unique background style ONLY to the instruction header row (the first row of the table).
Rotate between these styles for the header row:
1. Light Blue: background-color: #e0f2fe; color: #0369a1;
2. Soft Green: background-color: #dcfce7; color: #15803d;
3. Pale Yellow: background-color: #fef9c3; color: #a16207;
4. Lavender: background-color: #f3e8ff; color: #7e22ce;
5. Rose: background-color: #ffe4e6; color: #be123c;
6. Forest Mist: background-image: linear-gradient(to right, #dcfce7, #f0fdf4); color: #166534;
7. Ocean Calm: background-image: linear-gradient(to right, #e0f2fe, #f0f9ff); color: #075985;
8. Mountain Air: background-image: linear-gradient(to right, #f1f5f9, #f8fafc); color: #334155;

STRICT: When this protocol is active, the header row MUST NOT use the default dark background. Use dark text for high contrast.`;

export const PAGE_STYLES = [
  { id: 'p1', name: 'Elegant Gold', style: 'border: 15px solid transparent; border-image: url("https://www.transparenttextures.com/patterns/gold-scale.png") 30 round; padding: 25px; box-shadow: inset 0 0 10px rgba(0,0,0,0.1);' },
  { id: 'p2', name: 'Classic Scroll', style: 'border: 2px solid #8b4513; padding: 30px; background-color: #fdf5e6; border-radius: 5px; box-shadow: 5px 5px 15px rgba(0,0,0,0.2);' },
  { id: 'p3', name: 'Modern Blueprint', style: 'border: 1px solid #3b82f6; padding: 20px; background-image: radial-gradient(#3b82f6 0.5px, transparent 0.5px); background-size: 20px 20px; border-radius: 8px;' },
  { id: 'p4', name: 'Nature Leaf', style: 'border: 10px solid #10b981; border-style: double; padding: 20px; border-radius: 50px 5px 50px 5px;' },
  { id: 'p5', name: 'Royal Velvet', style: 'border: 8px solid #7f1d1d; outline: 2px solid #facc15; outline-offset: -5px; padding: 25px;' },
  { id: 'p6', name: 'Tech Grid', style: 'border: 2px solid #6366f1; padding: 20px; background: linear-gradient(90deg, #f8fafc 20px, transparent 1%) center, linear-gradient(#f8fafc 20px, transparent 1%) center, #cbd5e1; background-size: 22px 22px;' },
  { id: 'p7', name: 'Art Deco', style: 'border: 5px solid #1e293b; padding: 25px; background: linear-gradient(135deg, #f1f5f9 25%, transparent 25%) -50px 0, linear-gradient(225deg, #f1f5f9 25%, transparent 25%) -50px 0, linear-gradient(315deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, #f1f5f9 25%, transparent 25%); background-size: 100px 100px; background-color: #ffffff;' },
  { id: 'p8', name: 'Minimalist Zen', style: 'border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 40px 20px; text-align: justify;' },
  { id: 'p9', name: 'Vintage Typewriter', style: 'border: 1px solid #475569; padding: 30px; background-color: #f1f5f9; font-family: "Courier New", Courier, monospace;' },
  { id: 'p10', name: 'Ocean Breeze', style: 'border-left: 15px solid #0ea5e9; padding: 20px; background: linear-gradient(to right, #f0f9ff, #ffffff);' },
  { id: 'p11', name: 'Sunset Glow', style: 'border: 3px solid #f43f5e; padding: 20px; border-radius: 20px; box-shadow: 0 0 20px rgba(244, 63, 94, 0.1);' },
  { id: 'p12', name: 'Geometric Bold', style: 'border: 10px solid #0f172a; clip-path: polygon(0% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%); padding: 25px;' },
  { id: 'p13', name: 'Soft Pastel', style: 'border: 5px solid #fdf2f8; padding: 20px; background-color: #fff1f2; border-radius: 30px;' },
  { id: 'p14', name: 'Industrial Steel', style: 'border: 4px solid #64748b; padding: 20px; background: repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #f1f5f9 10px, #f1f5f9 20px);' },
  { id: 'p15', name: 'Midnight Neon', style: 'border: 2px solid #818cf8; padding: 20px; box-shadow: 0 0 10px #818cf8, inset 0 0 5px #818cf8; border-radius: 10px;' },
  { id: 'p16', name: 'Classic Library', style: 'border-left: 10px solid #451a03; border-right: 1px solid #451a03; padding: 20px; background-color: #fffaf3;' },
  { id: 'p17', name: 'Modern Gallery', style: 'border: 1px solid #000; padding: 50px; background-color: #fff; box-shadow: 20px 20px 0px #e2e8f0;' },
  { id: 'p18', name: 'Botanical Garden', style: 'border: 2px solid #166534; padding: 20px; background-image: url("https://www.transparenttextures.com/patterns/leaf.png");' },
  { id: 'p19', name: 'Cosmic Star', style: 'border: 1px solid #4c1d95; padding: 20px; background: radial-gradient(circle, #ffffff 0%, #f5f3ff 100%);' },
  { id: 'p20', name: 'Urban Concrete', style: 'border: 6px solid #334155; padding: 20px; background-color: #f1f5f9; border-style: inset;' },
];

export const BORDER_FRAME_INSTRUCTION = `### STYLIST FRAME PROTOCOL ###
Wrap content in a beautiful randomized frame. Choose ONE style from this list for each generation:
1. Double Border: border: 4px double #ea580c; padding: 15px; border-radius: 12px;
2. Modern Shadow: border: 1px solid #e2e8f0; padding: 20px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
3. Royal Accent: border-left: 8px solid #1e3a8a; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 15px; border-radius: 4px;
4. Minimalist Dot: border: 2px dotted #94a3b8; padding: 15px; border-radius: 8px;
5. Gradient Glow: border: 1px solid #f97316; padding: 15px; border-radius: 20px; box-shadow: 0 0 15px rgba(249, 115, 22, 0.2);
6. Hand-Drawn Border: If 'isHandDrawnBorderEnabled' is true, prioritize this style: border: none; padding: 25px; (the app will provide the hand-drawn effect via CSS).`;

export const DEFAULT_STRICT_RULES: StrictRule[] = [
  {
    id: 'rule-precision-1',
    label: 'CORE: EXTREME PRECISION TRAP LOGIC',
    description: 'Forces secondary grammar nuances and extreme near-miss distractors.',
    promptInjection: 'STRICT CORE: Every item must test a primary rule and a secondary nuance. Apply EXTREME PROTOCOLS for ALL grammar. Distractors must look 90% correct but fail on situational logic or subtle grammar rules (e.g., "She is as good a student as my father is").',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'rule-logic-1',
    label: 'CORE: PATTERN DESTRUCTION',
    description: 'Rotate sentence structures to prevent predictable patterns.',
    promptInjection: 'STRICT CORE: Rotate sentence structures (Pos/Neg/Int). Max 2 identical structures in a row.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'rule-no-ai-speak',
    label: 'SUPPORT: NO AI-SPEAK',
    description: 'Ban robotic phrases like "views print" or "understands text".',
    promptInjection: 'STRICT SUPPORT: Ban "AI-speak" like "He knows lines" or "He views print". Use natural child-level actions.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'rule-no-markdown',
    label: 'SUPPORT: NO MARKDOWN',
    description: 'Ban asterisks. Use HTML tags only.',
    promptInjection: 'STRICT SUPPORT: HTML tags ONLY (<b>, <table>, <p>, <br>). No asterisks. DO NOT use <u> tags.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'rule-contextual-clues-advanced',
    label: 'Contextual Clues - Advanced',
    description: 'Prioritize context-based clues for all questions, especially vocabulary and grammar.',
    promptInjection: 'Prioritize context-based clues for all questions, especially vocabulary and grammar.',
    active: true,
    priority: 'Average',
    category: 'Vocabulary'
  },
  {
    id: 'rule-ci-no-answers',
    label: 'STRICT: C/I NO ANSWERS',
    description: 'Ensure Correct/Incorrect exercises never show answers in student view.',
    promptInjection: 'STRICT: For all Correct/Incorrect (C/I) exercises, NEVER include the answer (C or I) in the student worksheet. Only provide the blank (____) and the sentence. The answers MUST only appear in the final Answer Key section.',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'rule-no-repetition',
    label: 'STRICT: NO REPETITION',
    description: 'Ensure vocabulary and grammar structures are not repeated across questions.',
    promptInjection: 'STRICT: Do not repeat the same vocabulary words or exact grammar structures across different questions in the same exercise. Every item must be unique.',
    active: true,
    priority: 'High',
    category: 'General'
  }
];

export const DEFAULT_MASTER_PROTOCOLS: StrictRule[] = [
  {
    id: 'mp-test-blueprint',
    label: 'TEST BLUEPRINT ARCHITECTURE',
    description: 'Forces planning before generation.',
    promptInjection: 'BLUEPRINT PHASE: Before generating, silently design a blueprint: 1. Skill Targets, 2. Difficulty Distribution (30% Easy, 40% Mid, 30% Hard), 3. Distractor Types, 4. Micro-themes. Apply expert human pedagogy intuitively through machine-level control.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-post-audit',
    label: 'POST-GENERATION QUALITY AUDIT',
    description: 'Simulates human proofreading and error checking.',
    promptInjection: 'POST-AUDIT: Verify no unintended answer patterns (e.g., C-C-C) or information leaks between items. Rewrite if violations are found.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-distractor-psychology',
    label: 'DISTRACTOR PSYCHOLOGY & PLAUSIBILITY',
    description: 'Enforces professional-grade, plausible trap design.',
    promptInjection: 'DISTRACTOR DESIGN: Keep all options plausible (90% correct). NO "stupid wrong" answers. Every question must include 1 NEAR-MISS distractor (almost correct but slightly wrong in meaning). Intuitively mix semantic confusion, contextual misfits, and real ESL learner errors.',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'mp-human-imperfection',
    label: 'HUMAN IMPERFECTION LAYER',
    description: 'Breaks AI perfection patterns to feel more human.',
    promptInjection: 'HUMAN IMPERFECTION: Do not make every item perfectly balanced. Humans sometimes repeat patterns and sometimes make easier distractors. Allow controlled imperfection (uneven sentence lengths, occasional "confidence-builder" items). Too intelligent = AI; Too structured = robotic. Be an expert human.',
    active: true,
    priority: 'Medium',
    category: 'General'
  },
  {
    id: 'mp-corpus-realism',
    label: 'CORPUS REALISM & MICRO-CONTEXT',
    description: 'Ensures natural textbook phrasing and scenarios.',
    promptInjection: 'CORPUS REALISM: Use high-frequency "textbook" English. Avoid overly descriptive "AI adjectives." Use 2-sentence micro-scenarios frequently to provide context. STRICT: DO NOT use any inline CSS (styles, background colors, or font colors) in the content.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-skill-tagging',
    label: 'COGNITIVE SKILL ROTATION',
    description: 'Forces varied thinking levels.',
    promptInjection: 'SKILL ROTATION: Rotate items intuitively between Recall, Application, Inference, and Error Detection.',
    active: true,
    priority: 'Medium',
    category: 'General'
  },
  {
    id: 'mp-reading-paraphrase', 
    label: 'READING: PARAPHRASE & INFERENCE LOGIC', 
    description: 'Controls paraphrasing, keyword matching, and inference.', 
    promptInjection: 'READING LOGIC: 1. ZERO-KEYWORD MATCHING: Never use the exact nouns/adjectives from the text in the correct answer. 2. PARAPHRASE: Shift word forms and use synonyms (simple structural swaps for low levels, complex shifts for high levels). 3. INFERENCE: Test what is implied, not just stated. 4. TFNG: "False" is opposite, "Not Given" is related but unconfirmed.', 
    active: true, 
    priority: 'High', 
    category: 'Reading' 
  },
  { 
    id: 'mp-human-test', 
    label: 'HUMAN-TEST ARCHITECTURE', 
    description: 'Enforces exam-writer logic: simple vocab, high thinking.', 
    promptInjection: 'HUMAN-TEST PROTOCOL: Keep vocabulary simple (A2-B1 max) but raise thinking depth. Use natural phrasing and light idioms. Follow standard exam structures (e.g., KET 3-part structure for lower levels). Scale difficulty by critical thinking, not just obscure vocabulary.', 
    active: true, 
    priority: 'High', 
    category: 'Reading' 
  },
  { 
    id: 'mp-vocab-pure', 
    label: 'PURE VOCABULARY CONTROL', 
    description: 'Enforces same part of speech for all options.', 
    promptInjection: 'In vocabulary sections, all answer choices must be the same part of speech and grammatical form. Students must rely on meaning only, not grammar clues.', 
    active: true, 
    priority: 'High', 
    category: 'Vocabulary' 
  },
  { 
    id: 'mp-answer-key', 
    label: 'ANSWER KEY & LAYOUT LOGIC', 
    description: 'Controls answer distribution and visual formatting.', 
    promptInjection: 'LAYOUT & KEYS: 1. Use the pre-assigned answer keys provided for each part. 2. Distribute items evenly in 2-column layouts. 3. MCQ Layout: Short options on one line (10 spaces between), long options on double lines. DO NOT use vertical lists.', 
    active: true, 
    priority: 'High', 
    category: 'General' 
  },
  {
    id: 'mp-grammar-exhaustion',
    label: 'GRAMMAR RULE EXHAUSTION',
    description: 'Forces the AI to test every single sub-rule of a grammar topic.',
    promptInjection: 'GRAMMAR EXHAUSTION: Intuitively identify and test all specific sub-rules for the target topic, including structural inversions and advanced nodes (Subjunctive, Causatives) where applicable.',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'mp-scenario-chaos',
    label: 'SCENARIO & SYNTACTIC VARIETY',
    description: 'Forces unique themes and varied sentence structures.',
    promptInjection: 'VARIETY: Use unique, vivid scenarios. Vary sentence starters and the position of key grammar signals (Floating Marker Principle) so students cannot scan mechanically.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-pragmatic-boundary',
    label: 'PRAGMATIC BOUNDARY & SITUATIONAL TESTING',
    description: 'Tests situations and meaning, not just grammatical forms.',
    promptInjection: 'SITUATIONAL TESTING: Test situations and meaning, not just forms. Example: "You have to visit the dentist if your tooth hurts." -> INCORRECT (opinion/advice requires "must"). Example 2: "You must try the cake!" -> CORRECT (personal insistence). Inject cross-topic errors naturally.',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'mp-correct-incorrect-logic',
    label: 'CORRECT/INCORRECT SITUATIONAL LOGIC',
    description: 'Enforces situational distractors for C/I items.',
    promptInjection: 'C/I LOGIC: NO MCQs. Use "1. _____" (5 underscores). Test situations! A sentence can be grammatically correct but SITUATIONALLY INCORRECT.',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'mp-pedagogical-notes',
    label: 'PEDAGOGICAL VOICE',
    description: 'Adds human-like "Teacher Tips" or reminders.',
    promptInjection: 'Randomly insert one small <b>Tip:</b> or <b>Remember!</b> box at the start of one section to simulate a teacher-made worksheet.',
    active: true,
    priority: 'Medium',
    category: 'General'
  },
  {
    id: 'mp-no-free-verb',
    label: 'EXTREME STRICT: NO FREE-MAIN VERB',
    description: 'Prevents giving away the main verb in the question stem.',
    promptInjection: 'NO FREE-MAIN VERB: Never place the main verb in the question stem if it reveals the structure. The main verb MUST be bundled into the answer options. Example: "You ____ the steps exactly." Options: A. has to follow B. have to follow C. must follow D. must to follow.',
    active: true,
    priority: 'High',
    category: 'Grammar'
  },
  {
    id: 'mp-level-calibration',
    label: 'EXTREME STRICT: LEVEL CALIBRATION',
    description: 'Strictly scales vocabulary, sentence length, and text complexity according to the target academic level.',
    promptInjection: 'LEVEL CALIBRATION IS MANDATORY. You must strictly adapt text length, vocabulary, and grammar to the selected level. KIDS/BEGINNER: Max 50-80 words. Super easy vocabulary (A1). Short, simple sentences (Subject-Verb-Object). NO words like "established", "vital", "irrigation". NO inferential or critical thinking questions. Keep it literal. ELEMENTARY/PRE-INT: 100-150 words. Basic compound sentences. INTERMEDIATE: 200-300 words. ADVANCED: 400+ words, complex academic vocabulary. If the level is Kids, the text MUST look like a children\'s book.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-no-inline-keys',
    label: 'NO INLINE ANSWER KEYS',
    description: 'Prevents answer keys from being printed next to the questions.',
    promptInjection: 'NO INLINE KEYS: NEVER show the answers (True), (False), or (A) inside the test questions or sentences. All answer keys MUST be placed completely separate at the very end of the entire test output, under a "Teacher Answer Key" section.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-contextual-clues',
    label: 'Contextual Clues Focus',
    description: 'Prioritize context-based clues for all questions, especially vocabulary and grammar.',
    promptInjection: 'Prioritize context-based clues for all questions, especially vocabulary and grammar.',
    active: true,
    priority: 'Medium',
    category: 'General'
  },
  {
    id: 'mp-custom-exercise-logic',
    label: 'CUSTOM EXERCISE ADAPTATION',
    description: 'Ensures AI can handle user-defined exercise types.',
    promptInjection: 'CUSTOM EXERCISES: If an exercise type is not standard (e.g., user-added), analyze its label and professional label to determine the best pedagogical format. Apply standard formatting (nested tables for MCQs, long blanks for writing) where appropriate.',
    active: true,
    priority: 'High',
    category: 'General'
  },
  {
    id: 'mp-reading-uniqueness',
    label: 'READING: ABSOLUTE PASSAGE UNIQUENESS',
    description: 'Forces unique reading passages for every reading exercise.',
    promptInjection: 'STRICT UNIQUENESS: Every single reading exercise MUST have its own unique reading passage. NEVER reuse the same text for multiple exercises in the same test. Each passage must be distinct in content and theme.',
    active: true,
    priority: 'High',
    category: 'Reading'
  },
  {
    id: 'mp-reading-answer-keys',
    label: 'READING: DIVERSE ANSWER KEYS',
    description: 'Ensures answer keys for reading are content-specific, not just MCQ letters.',
    promptInjection: 'READING ANSWER KEYS: You are STRICTLY FORBIDDEN from generating generic "A, B, C" answer keys for non-MCQ reading tasks. For T/F/NG, use "T, F, or NG". For Short Answer, provide exact text strings. For Inferential, provide a concise logical summary of the correct interpretation.',
    active: true,
    priority: 'High',
    category: 'Reading'
  },
  {
    id: 'mp-topic-vocabulary-boost',
    label: 'VOCABULARY: TOPIC-SPECIFIC BOOST',
    description: 'Enforces topic-relevant idioms and phrasal verbs to boost student speaking.',
    promptInjection: 'VOCABULARY BOOST: 1. You are strictly forbidden from using generic "AI idioms". 2. Every idiom and phrasal verb MUST be strictly relevant to {{TOPIC}}. 3. VARIETY: Never use the same term twice. 4. EXTRACTION: If a reading passage exists, prioritize extracting high-utility phrases/verbs from it for the vocabulary sections.',
    active: true,
    priority: 'High',
    category: 'Vocabulary'
  }
];


// Removed LISTENING_LOGIC_FIREWALL
export const INITIAL_TEMPLATES: InstructionTemplate[] = [
  // --- GRAMMAR MASTERY (REORDERED & UPDATED) ---
  // --- GRAMMAR / MCQ ---
  { id: 'mcq_standard', category: 'GRAMMAR', label: 'MCQ Standard', professionalLabel: '<b>CHOOSE THE BEST OPTION.</b>', prompt: 'Choose the best option A, B, C, or D. Use a standard layout.', columnCount: 1, typeId: 'mcq', styleName: 'Standard' },
  { id: 'mcq_columns_grid', category: 'GRAMMAR', label: 'MCQ Columns (4-Col)', professionalLabel: '<b>CHOOSE THE BEST OPTION.</b>', prompt: 'Choose the best option A, B, C, or D for {{TOPIC}}. FORMAT: Place options on a new line below the sentence. Use a perfectly aligned 4-column layout for A, B, C, and D.', columnCount: 1, styleName: 'Grid' },
  { id: 'mcq_inline_paren', category: 'GRAMMAR', label: 'MCQ Inline (Paren)', professionalLabel: '<b>CHOOSE THE BEST OPTION.</b>', prompt: 'Choose the best option A, B, C, or D for {{TOPIC}}. FORMAT: Place the options inline at the end of each sentence in parentheses, separated by slashes. Example: "She _____ happy. (A. is / B. are / C. am / D. be)".', columnCount: 1, styleName: 'Inline' },
  { id: 'mcq_boxed', category: 'GRAMMAR', label: 'MCQ Boxed', professionalLabel: '<b>CHOOSE THE BEST OPTION.</b>', prompt: 'Choose the best option A, B, C, or D. Use a boxed layout with clear separation.', columnCount: 2, typeId: 'mcq', styleName: 'Boxed' },
  { id: 'mcq_minimal', category: 'GRAMMAR', label: 'MCQ Minimal', professionalLabel: '<b>CHOOSE THE BEST OPTION.</b>', prompt: 'Choose the best option A, B, C, or D. Use a minimal, clean layout with no borders.', columnCount: 1, typeId: 'mcq', styleName: 'Minimal' },
  { id: 'g_correct_incorrect', category: 'GRAMMAR', label: 'Correct/Incorrect', professionalLabel: '<b>WRITE C (CORRECT) OR I (INCORRECT).</b>', prompt: 'Write C (correct) or I (incorrect) for {{TOPIC}}. Apply PRAGMATIC BOUNDARY logic. STRICT: DO NOT include the answer (C or I) in the student worksheet. The answer MUST ONLY appear in the Answer Key section at the end. NEVER put the actual answer next to the sentence in the student view.', columnCount: 2, typeId: 'tf', styleName: 'C/I Standard' },
  { id: 'g_circle', category: 'GRAMMAR', label: 'Circle', professionalLabel: '<b>CIRCLE THE CORRECT ANSWERS.</b>', prompt: 'Circle the correct answers for {{TOPIC}}. STRICT: No MCQ options.', columnCount: 2, typeId: 'circle', styleName: 'Standard' },
  { id: 'g_circle_slash', category: 'GRAMMAR', label: 'Circle (Slash Style)', professionalLabel: '<b>CIRCLE THE CORRECT OPTION.</b>', prompt: 'Circle the correct option for {{TOPIC}}. FORMAT: Present choices within the sentence separated by a slash. Example: "She [is / are] happy." STRICT: No A, B, C, D options.', columnCount: 1, styleName: 'Slash' },
  { id: 'g_circle_boxed', category: 'GRAMMAR', label: 'Circle Boxed', professionalLabel: '<b>CIRCLE THE CORRECT ANSWERS WITHIN THE BOX.</b>', prompt: 'Circle the correct answers for {{TOPIC}}. Wrap the exercise in a prominent border.', columnCount: 1, typeId: 'circle', styleName: 'Boxed' },
  { id: 'g_complete_sentences', category: 'GRAMMAR', label: 'Sentence Completion', professionalLabel: '<b>COMPLETE THE FOLLOWING SENTENCES.</b>', prompt: 'Complete the following sentences for {{TOPIC}}. Note: Use {{BLANK}} and provide the base verb in parentheses at the end of the blank.', columnCount: 1, typeId: 'sentenceCompletion', styleName: 'Standard' },
  { id: 'g_complete_minimal', category: 'GRAMMAR', label: 'Completion Minimal', professionalLabel: '<b>COMPLETE THE FOLLOWING SENTENCES.</b>', prompt: 'Complete the following sentences for {{TOPIC}}. Use a clean, minimal layout with no clutter.', columnCount: 1, typeId: 'sentenceCompletion', styleName: 'Minimal' },
  { id: 'g_complete_story', category: 'GRAMMAR', label: 'Story Completion', professionalLabel: '<b>COMPLETE THE FOLLOWING STORY BY FILLING IN THE BLANKS WITH THE APPROPRIATE GRAMMATICAL FORMS.</b>', prompt: 'Complete the following story by filling in the blanks with the appropriate grammatical forms for {{TOPIC}}. Generate a coherent story/paragraph with numbered blanks. Provide context clues and situational evidence to guide the student.', columnCount: 1, typeId: 'cloze', styleName: 'Story' },
  { id: 'g_pair', category: 'GRAMMAR', label: 'Double MCQ', professionalLabel: '<b>DOUBLE-GAP MCQ TESTING TWO DIFFERENT ASPECTS OF {{TOPIC}}.</b>', prompt: 'Double-gap MCQ testing two different aspects of {{TOPIC}}. Select the correct pair of words to complete each item. MANDATORY FORMAT: Place options on a new line below the item using a perfectly aligned 4-column HTML table (A, B, C, D). Bold the options (e.g., <b>A. visits / likes</b>). Apply PRAGMATIC BOUNDARY logic.', columnCount: 1, typeId: 'doubleMcq', styleName: 'Standard' },
  { id: 'g_plural_rules', category: 'GRAMMAR', label: 'Plural / s-es Rules', professionalLabel: '<b>CHANGE THE FOLLOWING NOUNS TO PLURAL NOUNS OR ADD S/ES ACCORDING TO THE RULES.</b>', prompt: 'Change the following nouns to Plural nouns or add s/es according to the rules. Format: Use a 2-column layout. Column 1: Number + Singular word. Column 2: Dash + Long blank (e.g. 1. Box - ________).', columnCount: 2, typeId: 'table', styleName: 'Standard' },
  
  // --- SPEAKING ---
  { id: 'speak_standard', category: 'VOCABULARY', label: 'Speaking Standard', professionalLabel: '<b>DISCUSS IN PAIRS.</b>', prompt: 'Discuss the following questions with a partner. Use standard formatting.', columnCount: 1, typeId: 'speaking', styleName: 'Standard' },
  { id: 'speak_numbered', category: 'VOCABULARY', label: 'Speaking Numbered', professionalLabel: '<b>DISCUSS IN PAIRS.</b>', prompt: 'Discuss the following questions with a partner. Use numbered list with extra spacing.', columnCount: 1, typeId: 'speaking', styleName: 'Numbered' },
  { id: 'speak_bulleted', category: 'VOCABULARY', label: 'Speaking Bulleted', professionalLabel: '<b>DISCUSS IN PAIRS.</b>', prompt: 'Discuss the following questions with a partner. Use bullet points.', columnCount: 1, typeId: 'speaking', styleName: 'Bulleted' },
  
  // --- ADDITIONAL GRAMMAR ---
  { id: 'g_write_correct_form', category: 'GRAMMAR', label: 'Correct Form', professionalLabel: '<b>WRITE THE CORRECT FORM OF ….</b>', prompt: 'Write the correct form of ….. for {{TOPIC}}. Note: Use {{BLANK}}.', columnCount: 1, typeId: 'sentenceCompletion', styleName: 'Form 1' },
  { id: 'g_rewrite_sentences', category: 'GRAMMAR', label: 'Rewrite', professionalLabel: '<b>REWRITE THE FOLLOWING SENTENCES.</b>', prompt: 'Rewrite the following sentences about {{TOPIC}}. I need a line for students to write. Provide a long blank line ({{BLANK}}{{BLANK}}{{BLANK}}) for each item.', columnCount: 1, typeId: 'rewrite', styleName: 'Standard' },
  { id: 'g_box', category: 'GRAMMAR', label: 'Word Box', professionalLabel: '<b>COMPLETE THE FOLLOWING SENTENCES USING THE WORDS/ PHRASES IN THE BOX. CHECK THE CORRECT FORMS OF GRAMMAR.</b>', prompt: 'Complete the following sentences using the words/ phrases in the box. Check the correct forms of grammar for {{TOPIC}}. MANDATORY: Use a <div> with class="word-bank-box-alt" for the word bank.', columnCount: 1, typeId: 'wordBox', styleName: 'Standard' },
  { id: 'g_cloze_paragraph', category: 'GRAMMAR', label: 'Cloze', professionalLabel: '<b>CLOZE PASSAGE (FULL PARAGRAPH): FILL IN THE BLANKS.</b>', prompt: 'Cloze Passage (Full Paragraph): Fill in the blanks with appropriate words for {{TOPIC}}.', columnCount: 1, typeId: 'cloze', styleName: 'Paragraph' },

  // --- REQUESTED ADVANCED MIXED TEST ---
  { 
    id: 'advanced_mixed_test', 
    category: 'GENERALS' as any, 
    label: 'Advanced Mixed Template', 
    professionalLabel: '<b>COMPREHENSIVE MIXED ASSESSMENT (GRAMMAR, READING, VOCABULARY, SPEAKING)</b>',
    prompt: `Advanced Mixed Assessment.
    
    SECTION 1: GRAMMAR
    A. MCQ on {{TOPIC}}: Choose the best options A, B, C or D. (10 items, 1 column). Apply [NO-FREE-VERB].
    B. Mark sentences C (Correct) or I (Incorrect) for {{TOPIC}}. (20 items, 2 columns).
    C. Circle the correct answers for {{TOPIC}}. (20 items, 2 columns).
    
    SECTION 2: READING
    A. Reading Passage: Generate an engaging text related to {{TOPIC}}. (At least 150 words).
    B. Reading Assessment: MCQ (3 items), True/False (4 items), and Critical Thinking (3 items) with a thought-provoking Ending. Total 10 items.
    
    SECTION 3: VOCABULARY & SPEAKING
    A. Vocabulary Identification: Provide 15 challenging definitions related to {{TOPIC}} and require students to write the correct key term. (MANDATORY: 15 items). Ensure the answer key contains the ACTUAL WORDS, not MCQ letters.
    B. Vocabulary MCQ: Choose the correct word to complete the sentence. (10 items). Apply [GRAMMAR BLACKOUT].
    C. Discussion: 10 speaking questions for classroom discussion related to {{TOPIC}}. (MANDATORY: 10 items).`,
    columnCount: 0,
    typeId: 'mixed_test'
  },

  // --- FULL TEST COMBINATIONS ---
  { 
    id: 'g_full_test', 
    category: 'GENERALS' as any, 
    label: 'Standard Mastery Test', 
    professionalLabel: '<b>COMPLETE THE COMPREHENSIVE GRAMMAR ASSESSMENT.</b>',
    prompt: `Mastery Grammar Test. 
Section I: Targeted Skills
A. MCQ: Choose the best option A, B, C, or D (15 items, 1 column).
B. Error Correction: Rewrite the sentence correctly (10 items).
C. Sentence Completion: Provide correct verb forms (10 items).
D. Rewrite: Combine or transform sentences (5 items).

Section II: Integrated Usage
A. Grammar In Context: Fill in the blanks in a coherent paragraph (10 items).
B. Circle the correct option in a dialogue (10 items).
C. Double-gap MCQ (10 items).`,
    columnCount: 0,
    typeId: 'mixed_test'
  },
  { id: 'r_full_mastery', category: 'READING', label: 'Reading Comprehension', professionalLabel: '<b>COMPLETE THE COMPREHENSIVE READING ASSESSMENT TO EVALUATE COMPREHENSION AND INFERENCE SKILLS.</b>', prompt: 'FULL READING TEST. Generate a 5-part test. ITEM COUNT: Generate exactly 10 items for EACH part (Total 50 items). NUMBERING: Number every single item in each part starting from 1. COLUMN: 1 column layout. PARTS: 1. Critical thinking, 2. Inferential, 3. MCQ (MANDATORY: 4-column layout for answer choices), 4. True/False, 5. Summary. Length and level of thinking strictly based on {{LEVEL}}. Apply Reading Logic Firewall.', columnCount: 1, typeId: 'mixed_test' },
  { id: 'v_full_mastery', category: 'VOCABULARY', label: 'VOCABULARY ASSESSMENT', professionalLabel: '<b>COMPLETE THE COMPREHENSIVE VOCABULARY ASSESSMENT.</b>', prompt: 'FULL VOCABULARY TEST. Generate a 6-part test. ITEM COUNT: Generate exactly 15 items for parts A-E (Total 75 items), and 10 items for part F (Total 10 items). COLUMN: 1 column layout for all parts. PARTS: A: Vocabulary Study (Table with definitions), B: Example Study (Sentences illustrating usage of idioms/phrases/words), C: MCQ (Multiple choice questions), D: Matching (Match terms to meanings), E: Word in a box (Fill in the blanks using the provided word bank), F: Speaking (Discussion questions related to the topic). Apply Vocabulary Boost [mp-topic-vocabulary-boost].', columnCount: 1, typeId: 'mixed_test' },
  { id: 'g_copy', category: 'GRAMMAR', label: 'Copy', professionalLabel: '<b>TRANSCRIBE THE FOLLOWING VOCABULARY EXERCISES ACCURATELY INTO YOUR NOTEBOOK.</b>', prompt: 'Transcribe the following vocabulary exercises accurately into your notebook for {{TOPIC}}, but randomize the exercise numbers and order. STRICT: No MCQ options.', columnCount: 0, typeId: 'copy' },
  { id: 'g_odd_one_out', category: 'GRAMMAR', label: 'Odd One', professionalLabel: '<b>IDENTIFY THE GRAMMATICALLY INCORRECT SENTENCE FROM THE OPTIONS PROVIDED.</b>', prompt: 'Identify the incorrect sentence from the options provided.', columnCount: 0, typeId: 'circle' },
  { id: 'g_editing', category: 'GRAMMAR', label: 'Editing', professionalLabel: '<b>IDENTIFY AND CORRECT THE GRAMMATICAL ERRORS IN THE FOLLOWING PARAGRAPH.</b>', prompt: 'Identify and correct the grammatical errors in the following paragraph. This is the mixed grammar test. The answer can be any types of grammar lessons. Correct all the mistakes.', columnCount: 0, typeId: 'editing' },
  { id: 'g_reduce', category: 'GRAMMAR', label: 'Reduce', professionalLabel: '<b>REWRITE THE FOLLOWING SENTENCES BY REDUCING THEM TO FEWER WORDS WHILE MAINTAINING THE ORIGINAL MEANING.</b>', prompt: 'Rewrite the following sentences by reducing them to fewer words.', columnCount: 0, typeId: 'rewrite' },
  { id: 'g_best_rewrite', category: 'GRAMMAR', label: 'Best Rewrite', professionalLabel: '<b>CHOOSE THE MOST APPROPRIATE REWRITE FOR EACH OF THE FOLLOWING SENTENCES.</b>', prompt: 'Choose the most appropriate rewrite for each sentence.', columnCount: 0, typeId: 'rewrite' },
  { id: 'g_cloze_passage_short', category: 'GRAMMAR', label: 'Cloze', professionalLabel: '<b>COMPLETE THE CLOZE PASSAGE BY FILLING IN THE BLANKS WITH APPROPRIATE GRAMMATICAL FORMS.</b>', prompt: 'Complete the cloze passage by filling in the blanks with appropriate words for {{TOPIC}}. Generate a coherent paragraph with 5-10 numbered blanks (e.g., (1) ________). Provide a word bank in a box at the top if appropriate, or let students use their own knowledge.', columnCount: 0, typeId: 'cloze' },
  
  // READING
  { id: 'r_tf_stmt', category: 'READING', label: 'True/False', professionalLabel: '<b>READ THE FOLLOWING STATEMENTS AND DETERMINE IF THEY ARE TRUE OR FALSE BASED ON THE TEXT.</b>', prompt: 'ITEM COUNT: 10 items. Column: 1 column layout. Read the following statements and determine if they are True or False based on the text about {{TOPIC}}. DO NOT GENERATE A, B, C, D OPTIONS.', columnCount: 1, typeId: 'tf', styleName: 'Standard' },
  { id: 'r_mcq', category: 'READING', label: 'Reading MCQ', professionalLabel: '<b>CHOOSE THE APPROPRIATE OPTIONS A, B, C OR D BASED ON THE DETAILED READING PASSAGE.</b>', prompt: 'ITEM COUNT: 10 items. Column: 1 column layout for numbering. Choose options A, B, C or D based on the text. MANDATORY: Use a nested 4-column table for answer choices to ensure they are perfectly aligned. Apply [LEXICAL OVERLAP TRAP].', columnCount: 1, typeId: 'mcq', styleName: 'Standard' },
  { id: 'r_short_answer', category: 'READING', label: 'Summary', professionalLabel: '<b>COMPLETE THE SUMMARY USING NO MORE THAN TWO WORDS OR A NUMBER FROM THE TEXT.</b>', prompt: 'ITEM COUNT: 10 items. Column: 1 column layout. Complete the summary using no more than two words or a number from the text about {{TOPIC}}. Use exact word-form from the text.', columnCount: 1, typeId: 'short_answer', styleName: 'Standard' },
  { id: 'r_inferential', category: 'READING', label: 'Inferential', professionalLabel: '<b>ANSWER THE FOLLOWING INFERENTIAL QUESTIONS BASED ON THE AUTHOR\'S PERSPECTIVE.</b>', prompt: 'ITEM COUNT: 10 items. Column: 1 column layout. Answer the following inferential questions based on the author\'s perspective about {{TOPIC}}. Focus on implications and attitude.', columnCount: 1, typeId: 'inferential', styleName: 'Standard' },
  { id: 'r_critical_thinking', category: 'READING', label: 'Critical Thinking', professionalLabel: '<b>APPLY CRITICAL THINKING TO ANSWER THE FOLLOWING QUESTIONS BASED ON THE ANALYTICAL READING OF THE TEXT.</b>', prompt: 'ITEM COUNT: 10 items. Column: 1 column layout. Apply critical thinking to answer the following questions based on the text about {{TOPIC}}.', columnCount: 1, typeId: 'critical_thinking', styleName: 'Standard' },
  { id: 'r_tfng', category: 'READING', label: 'T/F/NG Analysis', professionalLabel: '<b>READ THE TEXT AND INDICATE WHETHER THE STATEMENTS ARE TRUE (T), FALSE (F), OR NOT GIVEN (NG).</b>', prompt: 'Read the text and indicate whether the statements are True (T), False (F), or Not Given (NG) about {{TOPIC}}. DO NOT GENERATE A, B, C, D OPTIONS. DO NOT USE MULTIPLE CHOICE FORMAT. The answer key MUST be T, F, or NG. MANDATORY: Use a wide variety of subjects (e.g., "The dog", "Sarah", "The weather", "They"). DO NOT start every sentence with "I" or the same character\'s name.', columnCount: 0, typeId: 'tfng', styleName: 'Standard' },
  { 
    id: 'r_mcq_expert', 
    category: 'READING', 
    label: 'Expert MCQ', 
    professionalLabel: '<b>CHOOSE THE CORRECT OPTION A, B, C OR D BASED ON AN EXPERT-LEVEL ANALYSIS OF THE TEXT.</b>', 
    prompt: 'Choose the correct option A, B, C or D based on an expert-level analysis of the text. Apply [LEXICAL OVERLAP TRAP]. Distractors must include: 1. A "Partial Truth" (mentioned in the text but incomplete), 2. An "Opposite," and 3. A "Contextual Misfit." Apply Zero-Keyword Matching.', 
    columnCount: 0,
    typeId: 'mcq_expert',
    styleName: 'Expert'
  },
  { 
    id: 'r_referential_qs', 
    category: 'READING', 
    label: 'Referential', 
    professionalLabel: 'Determine the referential resolution for the specified pronouns in the passage.', 
    prompt: 'Determine the referential resolution for the specified pronouns in the passage. This tests structural understanding.', 
    columnCount: 0,
    typeId: 'referential',
    styleName: 'Standard'
  },
  { 
    id: 'r_summary_cloze', 
    category: 'READING', 
    label: 'Summary', 
    professionalLabel: '<b>COMPLETE THE SUMMARY OF THE PASSAGE BY FILLING IN THE BLANKS WITH WORDS FROM THE TEXT.</b>', 
    prompt: 'ITEM COUNT: 10 items. Column: 1 column layout. Complete the summary of the passage by filling in the blanks with words from the text about {{TOPIC}}. Students must find the correct words from the text to fill the blanks. Use exact word-form from the text.', 
    columnCount: 1,
    typeId: 'cloze',
    styleName: 'Summary'
  },
  { id: 'v_study_table_v2', 
    category: 'VOCABULARY', 
    label: 'A: Vocabulary Study', 
    professionalLabel: '<b>A. STUDY THE FOLLOWING VOCABULARY TERMS (WORDS, IDIOMS, AND PHRASES) AND THEIR DEFINITIONS.</b>', 
    prompt: 'ITEM COUNT: 15 items. Style: Use 1 table with exactly 2 columns. Column 1 (width 40%): Target Term (Idiom, Phrase, or Word). Column 2 (width 60%): Definition. Add a solid thick vertical rule line (border-left: 2.5pt solid #10b981) between Column 1 and Column 2. No exercises, JUST STUDY MATERIAL.', 
    columnCount: 1, 
    typeId: 'study', 
    styleName: 'Vertical Divider' 
  },
  { id: 'v_sentence_study', category: 'VOCABULARY', label: 'B: Example Study', professionalLabel: '<b>B. STUDY THE USAGE OF THE FOLLOWING TARGET TERMS IN THE PROVIDED SENTENCES.</b>', prompt: 'ITEM COUNT: 15 items. Style: STUDY THE USAGE OF THE FOLLOWING TARGET TERMS IN THE PROVIDED SENTENCES. Use a 1-column list. each item clearly show the target idiom, phrase, or word, and an example sentence.', columnCount: 1, typeId: 'study', styleName: 'Sentences' },
  { id: 'v_mcq_standard', category: 'VOCABULARY', label: 'C: MCQ', professionalLabel: '<b>C. CHOOSE THE APPROPRIATE OPTIONS A, B, C OR D TO COMPLETE EACH SENTENCE.</b>', prompt: 'ITEM COUNT: 15 items. Style: Choose options A, B, C or D to complete each sentence. 1 column. Apply Grammar Blackout.', columnCount: 1, typeId: 'mcq', styleName: 'Standard' },
  { id: 'v_matching_pro', category: 'VOCABULARY', label: 'D: Matching', professionalLabel: '<b>D. MATCH THE TERMS ON THE LEFT WITH THE DEFINITIONS ON THE RIGHT.</b>', prompt: 'ITEM COUNT: 15 items. Style: Use a 2-column HTML table. Column 1 (Terms): Terminology/Words with a blank line for the matching letter (e.g., ______ 1. Word). Column 2 (Definitions): A jumbled list of definitions labeled alphabetically (e.g., A. Definition...). MANDATORY: The definitions in Column 2 MUST be scrambled and NOT in the same row as their corresponding terms in Column 1 to create an effective matching exercise. DO NOT list the answer next to the term. GROUNDING: If source material is provided, ALL terms and definitions MUST be extracted directly and accurately from that source material. IF NO source is provided, generate high-quality, level-appropriate content related to {{TOPIC}}. Ensure definitions are complete sentences or accurate phrases. Use a 2-column HTML table.', columnCount: 1, typeId: 'matching', styleName: 'Pro Match' },
  { id: 'v_box', category: 'VOCABULARY', label: 'E: Word Box', professionalLabel: '<b>E. COMPLETE THE FOLLOWING SENTENCES USING THE CORRECT WORDS FROM THE BOX.</b>', prompt: 'ITEM COUNT: 15 items. Style: Complete sentences using the word bank. MANDATORY: Use a <div> with class="word-bank-box-alt" for the word bank.', columnCount: 1, typeId: 'wordBox', styleName: 'Standard' },
  { id: 'v_speaking_std', category: 'VOCABULARY', label: 'F: Speaking', professionalLabel: '<b>F. DISCUSS THE FOLLOWING QUESTIONS WITH A PARTNER.</b>', prompt: 'ITEM COUNT: 10 items. Generate discussion questions related to {{TOPIC}}. STRICT: 1 column only.', columnCount: 1, typeId: 'speaking', styleName: 'Standard' },
  { 
    id: 'v_supply_terms', 
    category: 'VOCABULARY', 
    label: 'Key Term', 
    professionalLabel: '<b>READ THE DEFINITIONS AND PROVIDE THE CORRECT KEY TERMS (TABLE STYLE).</b>', 
    prompt: 'Style: Use a 2-column HTML table. Header 1: Definition/Answers. Header 2: Vocabulary/Questions. Column 1: Easy Definition. Column 2: Blank line for Vocabulary Word. Add a vertical rule line (border-left) to separate the columns. Apply a professional border style. STRICT: 2 column layout.', 
    columnCount: 1, 
    typeId: 'key_term', 
    styleName: 'Table' 
  },
  { 
    id: 'v_key_term_divider', 
    category: 'VOCABULARY', 
    label: 'Key Term', 
    professionalLabel: '<b>READ THE DEFINITIONS AND PROVIDE THE CORRECT KEY TERMS (DIVIDER STYLE).</b>', 
    prompt: 'Style: Use a 2-column HTML table. Column 1 (70%): Definition. Column 2 (30%): Long blank line for the answer (________). Add a solid vertical divider (border-left: 2.5pt solid black) to separate columns.', 
    columnCount: 1, 
    typeId: 'key_term', 
    styleName: 'Divider' 
  },
  { 
    id: 'v_key_term_clean', 
    category: 'VOCABULARY', 
    label: 'Key Term', 
    professionalLabel: '<b>READ THE DEFINITIONS AND PROVIDE THE CORRECT KEY TERMS (CLEAN STYLE).</b>', 
    prompt: 'Style: Use a 2-column HTML table. Column 1 (70%): Number + Definition. Column 2 (30%): Long blank line (________) for the answer. Clean layout with no divider.', 
    columnCount: 1, 
    typeId: 'key_term', 
    styleName: 'Clean' 
  },
  { id: 'v_synonym_swap', category: 'VOCABULARY', label: 'Synonym Swap', professionalLabel: '<b>Rewrite each sentence by replacing the underlined word with an appropriate synonym.</b>', prompt: 'Style: Rewrite each sentence by replacing the underlined word with an appropriate synonym. Use a long blank line. STRICT: No MCQ options.', columnCount: 1, typeId: 'rewrite', styleName: 'Synonym' },
  { id: 'v_tf_v2', category: 'VOCABULARY', label: 'True/False', professionalLabel: '<b>Read the statements and indicate whether they are True (T) or False (F).</b>', prompt: 'Style: Read the statements and indicate whether they are True (T) or False (F). FORMAT STRICTLY AS: "1. ______ [Statement]". DO NOT GENERATE A, B, C, D OPTIONS. DO NOT USE MULTIPLE CHOICE FORMAT.', columnCount: 1, typeId: 'tf', styleName: 'Standard' },
  { 
    id: 'v_matching_zebra', 
    category: 'VOCABULARY', 
    label: 'Matching', 
    professionalLabel: '<b>MATCH THE TERMS (ZEBRA STYLE).</b>', 
    prompt: 'Style: Match the terms with definitions in a 2-column table. Apply alternating background colors (Zebra Striped) to rows. Add a vibrant divider line between columns.', 
    columnCount: 1, 
    typeId: 'matching', 
    styleName: 'Zebra' 
  },
  { 
    id: 'v_matching_classic', 
    category: 'VOCABULARY', 
    label: 'Matching', 
    professionalLabel: '<b>MATCH THE TERMS (CLASSIC STYLE).</b>', 
    prompt: 'Style: Match terms on the left (with blanks) with definitions on the right. Use a clean 2-column table with a thin divider line.', 
    columnCount: 1, 
    typeId: 'matching', 
    styleName: 'Classic' 
  },
  
  { id: 'v_copy_no_answers', category: 'VOCABULARY', label: 'Copy Practice', professionalLabel: '<b>COPY THE EXERCISES FROM THE SOURCE. NO ANSWERS.</b>', prompt: 'Copy the exercises from the source related to {{TOPIC}}. Provide the items without answers or options. Focus on transcription accuracy.', columnCount: 0, typeId: 'copy' },
  { id: 'v_synonyms_exercises', category: 'VOCABULARY', label: 'Synonym Exercises', professionalLabel: '<b>WRITE THE FOLLOWING SYNONYMS OR VOCABULARY FROM THE SOURCES AND MAKE THEM AS EXERCISES.</b>', prompt: 'Write the following synonyms or vocabulary from the sources and make them as exercises for {{TOPIC}}. Format: Word + Three long blanks (e.g. 1. Crucial _______________, ____________________, ____________________).', columnCount: 1, typeId: 'table' },
  
  // GENERALS
  { id: 'gen_tf', category: 'GENERALS' as any, label: 'True/False (Mixed)', professionalLabel: '<b>READ THE MIXED CONTENT AND DETERMINE IF THE STATEMENTS ARE TRUE OR FALSE.</b>', prompt: 'Read the mixed content (Grammar, Vocabulary, and Reading) and determine if the statements are True or False about {{TOPIC}}. Apply logic across all domains.', columnCount: 1, typeId: 'tf', styleName: 'Mixed' },
  { id: 'gen_correct_incorrect', category: 'GENERALS' as any, label: 'Correct/Incorrect (Mixed)', professionalLabel: '<b>IDENTIFY IF THE MIXED USAGE IS CORRECT OR INCORRECT.</b>', prompt: 'Identify if the mixed usage (Grammar, Vocabulary, and Reading) is Correct (C) or Incorrect (I) for {{TOPIC}}. STRICT: DO NOT include the answer (C or I) in the student worksheet. The answer MUST ONLY appear in the Answer Key section at the end. NEVER put the actual answer next to the sentence in the student view.', columnCount: 2, typeId: 'tf', styleName: 'Mixed C/I' },
  { id: 'gen_full_mixed', category: 'GENERALS' as any, label: 'FULL GENERAL TEST', professionalLabel: '<b>COMPLETE THE COMPREHENSIVE MIXED ASSESSMENT COVERING GRAMMAR, VOCABULARY, AND READING.</b>', prompt: 'FULL GENERAL TEST. Generate a 3-part test mixing Grammar, Vocabulary, and Reading. Part 1: True/False, Part 2: Correct/Incorrect, Part 3: MCQ. Apply situational logic across all domains.', columnCount: 0, typeId: 'mixed_test', styleName: 'Full' },
  {
    id: 'gen_matching_classic',
    category: 'GENERALS' as any,
    label: 'Matching',
    professionalLabel: '<b>Classic Matching Exercise</b>',
    prompt: 'Generate a matching exercise with words on the left (1-8) and definitions on the right (A-H). MANDATORY: Use a 2-column HTML table. Header 1: Vocabulary/Questions. Header 2: Definition/Answers. Col 1: Number + Word + Blank (____). Col 2: Letter + Definition. Add a solid vertical line (rule line) in the center using border-left style with a vibrant orange color.',
    columnCount: 2,
    typeId: 'matching',
    styleName: 'Classic'
  },
  {
    id: 'gen_matching_boxed',
    category: 'GENERALS' as any,
    label: 'Matching',
    professionalLabel: 'Boxed Matching Exercise',
    prompt: 'Generate a matching exercise where definitions are on the right and answers are written in boxes on the left. Include a word bank at the bottom.',
    columnCount: 2,
    typeId: 'matching',
    styleName: 'Boxed'
  },
  {
    id: 'gen_matching_column',
    category: 'GENERALS' as any,
    label: 'Matching',
    professionalLabel: 'Column A & B Comparison',
    prompt: 'Generate a matching exercise with Column A and Column B. Use boxes for answers on the far left. Separate columns with a vertical line in a vibrant orange color.',
    columnCount: 2,
    typeId: 'matching',
    styleName: 'Column A/B'
  },
  {
    id: 'mixed_full_test',
    category: 'Mixed' as any,
    label: 'Mixed Subject Test',
    professionalLabel: 'Comprehensive Mixed Assessment (Grammar, Reading, Vocabulary)',
    prompt: `Mixed Subject Test. 
Generate a multi-section test covering:
1. Grammar: MCQ and Correct/Incorrect.
2. Reading: A short passage followed by True/False, MCQ, and Inferential Reading.
3. Vocabulary: MCQ and True/False.
Apply all relevant Master Protocols for each section.`,
    columnCount: 1,
    typeId: 'mixed_test',
    styleName: 'Subject Test'
  },
  { id: 'g_error_correction_list', category: 'GRAMMAR', label: 'Error Fix', professionalLabel: '<b>IDENTIFY AND CORRECT THE MISTAKE IN EACH SENTENCE.</b>', prompt: 'Identify and correct the grammatical error in each sentence related to {{TOPIC}}. Provide a blank line for the correction.', columnCount: 1, typeId: 'editing', styleName: 'List Fix' },
  { id: 'g_sentence_join', category: 'GRAMMAR', label: 'Sentence Join', professionalLabel: '<b>COMBINE THE TWO SENTENCES INTO ONE USING THE WORD PROVIDED.</b>', prompt: 'Combine the two sentences into one using the word provided in parentheses for {{TOPIC}}.', columnCount: 1, typeId: 'rewrite', styleName: 'Joiner' },
  { id: 'g_tense_shift', category: 'GRAMMAR', label: 'Tense Shift', professionalLabel: '<b>REWRITE THE ENTIRE PARAGRAPH IN THE SPECIFIED TENSE.</b>', prompt: 'Rewrite the entire paragraph in the specified tense (e.g., Change Past Simple to Present Perfect) for {{TOPIC}}.', columnCount: 1, typeId: 'rewrite', styleName: 'Tense Shift' },

  // READING (Added 3)
  { id: 'r_fact_opinion', category: 'READING', label: 'Fact/Opinion', professionalLabel: '<b>DECIDE IF EACH STATEMENT IS A FACT (F) OR AN OPINION (O).</b>', prompt: 'Decide if each statement is a Fact (F) or an Opinion (O) based on the text. Format: "1. ______ [Statement]".', columnCount: 1, typeId: 'tf', styleName: 'Fact-Opinion' },
  { id: 'r_gist_select', category: 'READING', label: 'Gist Selection', professionalLabel: '<b>CHOOSE THE BEST TITLE OR SUMMARY FOR THE PASSAGE.</b>', prompt: 'Choose the best title or summary for the passage about {{TOPIC}}. Use MCQ format with 4 plausible options.', columnCount: 1, typeId: 'mcq', styleName: 'Gist' },
  { id: 'r_detail_search', category: 'READING', label: 'Detail Search', professionalLabel: '<b>SCAN THE TEXT AND FIND THE SPECIFIC INFORMATION ASKED.</b>', prompt: 'Find specific details in the text about {{TOPIC}}. Provide short, direct answers.', columnCount: 1, typeId: 'short_answer', styleName: 'Scavenger' },

  // VOCABULARY (Added 3)
  { id: 'v_idiom_match', category: 'VOCABULARY', label: 'Idiom Match', professionalLabel: '<b>MATCH THE IDIOM WITH ITS REAL-WORLD MEANING.</b>', prompt: 'Match the idiom with its real-world meaning. Use a 2-column HTML table. Header 1: Idiom. Header 2: Meaning. STRICT: 2 column layout.', columnCount: 1, typeId: 'matching', styleName: 'Idiom' },
  { id: 'v_collocation_box', category: 'VOCABULARY', label: 'Collocation', professionalLabel: '<b>COMPLETE THE PHRASES WITH THE CORRECT WORDS FROM THE BOX.</b>', prompt: 'Complete the phrases with the correct common collocations for {{TOPIC}} using the word box.', columnCount: 1, typeId: 'word_box', styleName: 'Collocation' },
  { id: 'v_odd_term', category: 'VOCABULARY', label: 'Odd Term', professionalLabel: '<b>IDENTIFY THE WORD THAT DOES NOT BELONG IN THE GROUP.</b>', prompt: 'Identify the word that does not belong in the group related to {{TOPIC}}. Explain why if possible.', columnCount: 1, typeId: 'circle', styleName: 'Odd One Out' },
  
  // GENERALS (Added 3)
  { id: 'gen_mixed_level', category: 'GENERALS' as any, label: 'Mixed Level', professionalLabel: '<b>ASSESSMENT WITH INCREASING DIFFICULTY.</b>', prompt: 'Generate an assessment for {{TOPIC}} that starts with very easy items and gradually increases in complexity. Mix MCQ, T/F and Completion.', columnCount: 0, typeId: 'mixed_test', styleName: 'Ladder' },
  { id: 'gen_quick_quiz', category: 'GENERALS' as any, label: 'Quick Quiz', professionalLabel: '<b>SHORT, HIGH-INTENSITY EVALUATION.</b>', prompt: 'Generate a short 5-item quiz covering the core points of {{TOPIC}}. Keep it concise.', columnCount: 1, typeId: 'mixed_test', styleName: 'Blitz' },
  { id: 'gen_quick_quiz_v2', category: 'GENERALS' as any, label: 'Standard Quiz', professionalLabel: '<b>STANDARD EVALUATION.</b>', prompt: 'Generate a 10-item quiz for {{TOPIC}}.', columnCount: 1, typeId: 'mixed_test', styleName: 'Standard Quiz' },
  { id: 'gen_logic_grid', category: 'GENERALS' as any, label: 'Logic Grid', professionalLabel: '<b>Solve the puzzle using the clues provided.</b>', prompt: 'Generate a logic puzzle exercise related to {{TOPIC}}. Provide clues and a small grid for students to fill in.', columnCount: 0, typeId: 'table', styleName: 'Puzzle' },

  { id: 'custom_subject_test',
    category: 'CUSTOM' as any,
    label: 'Custom Subject Test',
    professionalLabel: '<b>SUBJECT-SPECIFIC ASSESSMENT</b>',
    prompt: 'Generate a custom test for the subject {{TOPIC}}. Mix relevant exercise types (MCQ, T/F, Matching) specific to this subject.',
    columnCount: 1,
    typeId: 'mixed_test',
    styleName: 'Custom'
  },
];
