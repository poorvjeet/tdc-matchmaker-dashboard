// Run this once to enrich matchPool.json with all required fields.
// Usage: node src/data/enrichMatchPool.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, 'matchPool.json');
const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const PROFESSION_MAP = {
  'Engineer':   { designation: 'Software Engineer', company: 'Tech Corp', degree: 'B.Tech' },
  'Developer':  { designation: 'Senior Developer',  company: 'IT Services', degree: 'B.Tech' },
  'Doctor':     { designation: 'Doctor',             company: 'Apollo Hospital', degree: 'MBBS' },
  'CA':         { designation: 'Chartered Accountant', company: 'Deloitte',     degree: 'B.Com' },
  'MBA':        { designation: 'Manager',             company: 'Hindustan Unilever', degree: 'MBA' },
  'Designer':   { designation: 'UI/UX Designer',      company: 'Design Studio', degree: 'B.Des' },
  'Entrepreneur':{ designation: 'Founder',            company: 'Startup',        degree: 'B.Tech' },
  'Business':   { designation: 'Business Owner',      company: 'Family Business', degree: 'BBA' },
  'Lawyer':     { designation: 'Advocate',            company: 'Law Firm',       degree: 'LLB' },
  'Scientist':  { designation: 'Research Scientist',  company: 'Research Lab',   degree: 'PhD' },
  'Teacher':    { designation: 'School Teacher',      company: 'Delhi Public School', degree: 'B.Ed' },
  'Student':    { designation: 'Student',             company: '-',              degree: 'B.Tech' },
  'Director':   { designation: 'Director',            company: 'Corporate',      degree: 'MBA' },
  'VP':         { designation: 'Vice President',      company: 'MNC',            degree: 'MBA' },
  'Product Manager': { designation: 'Product Manager', company: 'Tech MNC',    degree: 'B.Tech' },
  'Tech Lead':  { designation: 'Tech Lead',           company: 'Tech MNC',       degree: 'B.Tech' },
  'Investments':{ designation: 'Investor',            company: 'VC Fund',        degree: 'MBA' },
  'HR':         { designation: 'HR Executive',        company: 'Corporate',      degree: 'MBA' },
  'HR Manager': { designation: 'HR Manager',          company: 'Corporate',      degree: 'MBA' },
  'Analyst':    { designation: 'Analyst',             company: 'Consulting',     degree: 'B.Tech' }
};

const WANT_KIDS = ['Yes', 'Yes', 'Yes', 'Maybe', 'Maybe', 'No', 'Yes', 'Yes', 'Maybe', 'No'];
const RELOCATE = ['Yes', 'Yes', 'Maybe', 'No', 'Yes', 'Maybe', 'Yes', 'No', 'Maybe', 'Yes'];
const PETS = ['Yes', 'Maybe', 'No', 'Yes', 'No', 'Maybe', 'Yes', 'No', 'Maybe', 'No'];
const HOROSCOPE = ['Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'No', 'Yes', 'No'];
const MARITAL = ['Single', 'Single', 'Single', 'Single', 'Single', 'Divorced', 'Single', 'Single', 'Widowed', 'Single'];
const SIBLINGS = ['1 brother', '1 sister', '2 brothers', '1 brother 1 sister', 'No siblings', '2 sisters', '1 sister', 'No siblings', '1 brother', '2 brothers'];
const LANGUAGES_MAP = {
  'Hindi': ['Hindi', 'English'],
  'English': ['English', 'Hindi'],
  'Punjabi': ['Punjabi', 'Hindi', 'English'],
  'Marathi': ['Marathi', 'Hindi', 'English'],
  'Bengali': ['Bengali', 'Hindi', 'English'],
  'Tamil': ['Tamil', 'English'],
  'Telugu': ['Telugu', 'Hindi', 'English'],
  'Kannada': ['Kannada', 'English'],
  'Gujarati': ['Gujarati', 'Hindi', 'English'],
  'Malayalam': ['Malayalam', 'English'],
  'Odia': ['Odia', 'Hindi', 'English'],
  'Bhojpuri': ['Bhojpuri', 'Hindi'],
  'Assamese': ['Assamese', 'Hindi', 'English'],
  'Urdu': ['Urdu', 'Hindi', 'English']
};

const BIOS = [
  'Passionate about my career and equally committed to building a warm, loving home. I value honesty, curiosity, and shared laughter.',
  'A reader, traveller, and foodie. Looking for a partner who is kind, ambitious, and enjoys the small joys of everyday life.',
  'Family-oriented and grounded. I believe in balancing modern ambitions with traditional values and respectful communication.',
  'Creative soul with a love for music, movies, and long conversations. I want a partner who is my best friend first.',
  'Entrepreneur at heart, learning new things every day. Looking for a thoughtful partner who supports growth and dreams.',
  'Doctor by profession, painter by passion. I want a partner who values both intellect and emotional depth.',
  'Old soul, modern mind. I treasure simple moments — chai, rain, and good company. Hoping to find my person.',
  'I love the outdoors, weekend treks, and a strong filter coffee. Looking for an honest, family-oriented partner.',
  'Educator, reader, and a forever student of life. I want a partner with a generous heart and curious mind.',
  'Engineer by training, designer by calling. I appreciate kindness, ambition, and a great sense of humour.'
];

const APPEARANCES_M = [
  'Tall, athletic build, fair complexion',
  'Average build, sharp features, well-groomed',
  'Tall, slim, friendly smile, clean-shaven',
  'Medium build, glasses, classic Indian features',
  'Wheatish complexion, broad shoulders, neat hair',
  'Athletic, broad smile, traditional yet modern look',
  'Tall, slim, light eyes, polished appearance',
  'Medium build, dark complexion, expressive face'
];
const APPEARANCES_F = [
  'Wheatish complexion, long dark hair, graceful',
  'Medium height, fair skin, expressive eyes, warm smile',
  'Petite, fair, soft-spoken appearance, elegant',
  'Tall, slim, light complexion, modern style',
  'Wheatish skin, shoulder-length hair, traditional charm',
  'Average build, dark complexion, sharp features, confident posture',
  'Fair, curly hair, petite, classical features',
  'Tall, dusky, athletic, contemporary look'
];

const rand = (arr, seed) => arr[Math.abs(seed) % arr.length];
const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};

// Compute approximate DOB from age, fixed to today = 2026-06-07
const computeDob = (age) => {
  const y = 2026 - age;
  return `${y}-06-15`;
};

const parseLPA = (s) => {
  const n = parseFloat(String(s || '').replace(/[^\d.]/g, '')) || 0;
  return n;
};

const enriched = raw.profiles.map((p, i) => {
  const seed = hash(p.id || `m${i}`);
  const prof = PROFESSION_MAP[p.profession] || PROFESSION_MAP['Engineer'];
  const inc = parseLPA(p.income);
  // Family income 1.8x - 3x individual
  const famMultiplier = 1.8 + (Math.abs(seed >> 3) % 12) / 10; // 1.8 - 3.0
  const famInc = Math.round(inc * famMultiplier);

  return {
    ...p,
    dob: computeDob(p.age),
    country: 'India',
    email: `${String(p.firstName).toLowerCase()}.${String(p.lastName).toLowerCase()}@email.com`,
    phone: `+91 9${String(100000000 + Math.abs(seed * 7) % 899999999).padStart(9, '0')}`,
    degree: p.degree || prof.degree,
    company: p.company || prof.company,
    designation: p.designation || prof.designation,
    annualIncome: p.income,
    annualFamilyIncome: `${famInc}LPA`,
    maritalStatus: p.maritalStatus || rand(MARITAL, seed),
    languages: p.languages || LANGUAGES_MAP[p.motherTongue] || ['Hindi', 'English'],
    siblings: p.siblings || rand(SIBLINGS, seed >> 2),
    wantKids: p.wantKids || rand(WANT_KIDS, seed >> 4),
    openToRelocate: p.openToRelocate || rand(RELOCATE, seed >> 5),
    openToPets: p.openToPets || rand(PETS, seed >> 6),
    horoscopeMatchRequired: p.horoscopeMatchRequired || rand(HOROSCOPE, seed >> 7),
    appearanceNotes: p.appearanceNotes || (p.gender === 'female' ? rand(APPEARANCES_F, seed) : rand(APPEARANCES_M, seed)),
    aboutMe: p.aboutMe || rand(BIOS, seed >> 8)
  };
});

const out = { profiles: enriched };
fs.writeFileSync(inputPath, JSON.stringify(out, null, 2));
console.log(`Enriched ${enriched.length} profiles. Saved to ${inputPath}`);
