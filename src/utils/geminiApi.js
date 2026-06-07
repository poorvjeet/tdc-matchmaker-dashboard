// TDC Matchmaker — Google Gemini AI Integration (free tier)
// Uses @google/generative-ai SDK. Get a free key at https://aistudio.google.com/apikey

import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a warm, professional matchmaker at TDC — The Date Crew, a premium Indian matchmaking service. You write personalized, emotionally intelligent match explanations and introductions. You never sound robotic. You always sound like a thoughtful human matchmaker who understands Indian family values, modern ambitions, and the importance of compatibility across culture, lifestyle, and goals. Keep responses concise, warm, and specific to the two people being described.`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let _genAI = null;
let _model = null;

const getModel = () => {
  if (_model) return _model;
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.');
  }
  _genAI = new GoogleGenerativeAI(API_KEY);
  // gemini-2.0-flash is fast + free tier. Fallback to 1.5-flash if needed.
  _model = _genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT
  });
  return _model;
};

// Helper to format a profile into a compact prompt snippet.
const profileToText = (p) => `
Name: ${p.firstName} ${p.lastName} (${p.gender}, ${p.age}, ${p.height}cm)
City: ${p.city} | Religion: ${p.religion} | Caste: ${p.caste}
Education: ${p.degree || ''} ${p.college ? 'from ' + p.college : ''}
Profession: ${p.designation || ''} ${p.company ? 'at ' + p.company : ''} | Income: ${p.income}
Diet: ${p.diet} | Drinks: ${p.drinking} | Smoking: ${p.smoking}
Family: ${p.familyType} | Mother Tongue: ${p.motherTongue}
Want Kids: ${p.wantKids} | Open to Relocate: ${p.openToRelocate} | Pets: ${p.openToPets}
Manglik: ${p.manglik} | Horoscope: ${p.horoscopeMatchRequired}
About: ${p.aboutMe || 'N/A'}
`.trim();

// ---------------------------------------------------------------------------
//  A) Match Score Explanation (2-3 sentences)
// ---------------------------------------------------------------------------
export const getMatchExplanation = async (customer, target, score, category) => {
  try {
    const model = getModel();
    const prompt = `Explain why these two people are a good match. The compatibility score is ${score}/100 (${category}). Be specific, warm, and reference their actual backgrounds. 2-3 sentences only.

Person 1:
${profileToText(customer)}

Person 2:
${profileToText(target)}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini explanation error:', err);
    return `Based on shared values around family, lifestyle, and life goals, ${customer.firstName} and ${target.firstName} show strong compatibility (${score}/100). Their backgrounds complement each other well, making this a ${category.toLowerCase()} worth exploring further.`;
  }
};

// ---------------------------------------------------------------------------
//  B) Personalized Intro Email (~100 words)
// ---------------------------------------------------------------------------
export const generateIntroEmail = async (customer, target) => {
  try {
    const model = getModel();
    const prompt = `Write a warm, personalized introduction email (~100 words) from a TDC matchmaker introducing ${customer.firstName} to ${target.firstName}. The email will be sent to BOTH parties. Make it emotionally intelligent, reference specific things from their profiles, and end with a soft suggestion to connect. Sign off as "Your Matchmaker at TDC — The Date Crew". Do not use placeholders. Plain text, no markdown.

Person 1:
${profileToText(customer)}

Person 2:
${profileToText(target)}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini intro email error:', err);
    return `Dear ${customer.firstName} and ${target.firstName},

I hope this note finds you both well. After spending time with each of you, I felt a quiet confidence that you two should meet. ${customer.firstName}'s warmth and ${target.firstName}'s grounded nature create a balance I often see in lasting partnerships. Your shared values around family, lifestyle, and life goals stood out to me — and I think a conversation would be meaningful.

I'll share a few timing options shortly. Looking forward to hearing from you both.

Warmly,
Your Matchmaker at TDC — The Date Crew`;
  }
};

export const isGeminiConfigured = () => {
  return Boolean(API_KEY) && API_KEY !== 'your_gemini_api_key_here';
};

export default {
  getMatchExplanation,
  generateIntroEmail,
  isGeminiConfigured
};
