<div align="center">

# 💞 TDC Matchmaker Dashboard

### *An internal tool for premium, human-first Indian matchmaking*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-tdc--matchmaker.vercel.app-burgundy?style=for-the-badge)](https://tdc-matchmaker-dashboard.vercel.app)
[![GitHub](https://img.shields.io/badge/⭐_Star_This_Repo-black?style=for-the-badge&logo=github)](https://github.com/poorvjeet/tdc-matchmaker-dashboard)
[![Made With](https://img.shields.io/badge/⚛️_React_+_Vite_+_Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![AI Powered](https://img.shields.io/badge/✨_Gemini_2.0_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)]()

<br/>

> *"Bringing together thoughtful humans, one match at a time."*

**A premium, AI-assisted dashboard that helps TDC matchmakers manage clients, score compatibility, and send warm personalized introductions — all in a warm, emotionally-aligned interface.*

</div>

---

## ✨ What's Inside

<table>
<tr>
<td width="50%" valign="top">

### 🔐 **Secure Login**
Beautiful ivory-and-burgundy login with password show/hide, localStorage auth, and graceful error states.

### 📋 **Customer Directory**
Search, filter, and browse all assigned clients. See name, age, city, marital status, and live status tag at a glance.

### 👤 **Deep Biodata View**
Every field an Indian matchmaker needs — 30+ fields per profile, including manglik, mother tongue, family type, diet, lifestyle, and appearance notes.

### 📝 **Quick Notes**
Per-customer matchmaker notes, saved automatically to localStorage. Edit, save, never lose a thought.

</td>
<td width="50%" valign="top">

### 🎯 **Smart Matching**
Gender-specific algorithm scoring **0–100** across 5 dimensions: core compatibility, lifestyle, values, culture, and profession.

### 🤖 **AI Match Insights**
Click ✨ on any match to get a warm, 2-3 sentence Gemini-powered explanation of *why* they're compatible.

### 💌 **One-Click Intros**
Send Match opens a modal with an auto-generated, ~100-word personalized intro email. Edit, regenerate, then send.

### 📊 **Compatibility Breakdown**
See the score in detail — bars for core, lifestyle, values, culture, profession. No black box.

</td>
</tr>
</table>

---

## 🎨 The Aesthetic

This isn't generic SaaS. Every pixel is designed to feel **warm, premium, and emotionally aligned** with the work of matchmaking.

| | |
|---|---|
| 🎨 **Palette** | Ivory `#FFFAF0` · Burgundy `#800020` · Saffron · Forest Emerald |
| 🔤 **Headings** | [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (serif, elegant) |
| 🔤 **Body** | [Inter](https://fonts.google.com/specimen/Inter) (clean, modern) |
| 🟢 **Status Tags** | New · In Progress · Matched · On Hold — color-coded pills |
| 🏷️ **Match Labels** | High Potential (80+) · Good Match (60-79) · Possible Fit (40-59) |
| 📱 **Responsive** | Mobile + tablet + desktop, smooth transitions throughout |

---

## 🚀 Quick Start

### 1️⃣ Clone & install
```bash
git clone https://github.com/poorvjeet/tdc-matchmaker-dashboard.git
cd tdc-matchmaker-dashboard
npm install
```

### 2️⃣ Get a free Gemini API key (for AI features)
> 🤖 **No key?** The app still works perfectly — AI features fall back to warm hand-written intros.

1. Visit **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**
2. Click **"Create API key"** (free tier — no credit card, no billing)
3. Copy the key

### 3️⃣ Add the key
```bash
cp .env.example .env
# Edit .env and paste your key:
# VITE_GEMINI_API_KEY=AIzaSy...
```

> 💡 **Deploying to Vercel?** Add the same env var in *Project Settings → Environment Variables* instead.

### 4️⃣ Run
```bash
npm run dev      # → http://localhost:5173
```

### 5️⃣ Login
```
📧  matchmaker@tdc.com
🔑  tdc@2025
```

---

## 🧠 The Matching Algorithm

**100 points total**, distributed across 5 buckets — built gender-specific from the ground up.

| Bucket | Points | What it measures |
|---|:-:|---|
| 🧬 **Core Compatibility** | 30 | Age, height, income (gender-specific rules) |
| 🥗 **Lifestyle Match** | 20 | Diet, drinking, smoking |
| 💞 **Values Match** | 25 | Kids, relocation, pets |
| 🪔 **Cultural Match** | 15 | Religion, caste, family type |
| 💼 **Professional Compatibility** | 10 | Profession stability + college tier |

### Gender-specific core rules

**For male customers** → match women who are:
- 📉 1–5 years younger
- 📏 Shorter in height
- 💰 Earn less or equal income

**For female customers** → match men who are:
- 📈 0–7 years older
- 📏 Taller in height
- 💰 Earn equal or higher income

Plus: shared views on kids · compatible religion/caste · compatible family type · lifestyle alignment · profession stability tier match · a soft horoscope-manglik gate.

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── Login.jsx              ← Premium login screen
│   ├── Dashboard.jsx          ← Customer list + search/filter
│   ├── CustomerCard.jsx       ← Single customer tile
│   ├── CustomerDetailView.jsx ← Full biodata + match pool
│   ├── MatchCard.jsx          ← Single match with score + AI
│   ├── MatchModal.jsx         ← Send Match + AI intro
│   ├── NotesPanel.jsx         ← Auto-save notes
│   └── SettingsModal.jsx      ← Runtime API key entry
├── data/
│   ├── customers.json         ← 10 matchmaker clients
│   └── matchPool.json         ← 100 opposite-gender profiles
├── utils/
│   ├── matchingLogic.js       ← 100-pt scoring engine
│   └── geminiApi.js           ← Gemini 2.0 Flash integration
├── App.jsx
└── main.jsx
```

**Zero backend.** Everything is a static bundle — `localStorage` for persistence, `@google/generative-ai` for AI.

---

## 🤖 How AI Is Used

Gemini 2.0 Flash powers **two** features, both triggered by the matchmaker (never auto-fired on a timer):

### 1. Match Explanation
> *"Priya and Arjun both prioritize family and share similar values around children and relocation. Her background in finance complements his entrepreneurial path."*

Clicked on demand from any match card. 2-3 sentences, warm, specific.

### 2. Personalized Intro Email
> *"Dear Priya and Arjun, I hope this note finds you both well..."*

Auto-generated the moment the Send Match modal opens. The matchmaker can **edit** it, **regenerate** it, or send it as-is. ~100 words.

**System prompt** is tuned to keep Gemini in the voice of a thoughtful human Indian matchmaker — never robotic, never generic.

---

## 🌍 Deploy (Free, 1 minute)

Both configs are pre-included. Pick your favorite:

### ⚡ Vercel (recommended)
```bash
npm i -g vercel
vercel login
vercel                    # first deploy
vercel env add VITE_GEMINI_API_KEY production
# paste your key
vercel --prod             # redeploy with env var
```

### 🌿 Netlify
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
# Add VITE_GEMINI_API_KEY in Netlify dashboard → Site settings → Environment
```

---

## 📦 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| ⚛️ **Frontend** | React 18 + Vite | Fast HMR, instant builds, modern DX |
| 🎨 **Styling** | Tailwind CSS | Premium palette via `theme.extend.colors` |
| 🧭 **Routing** | React Router v6 | Clean SPA navigation |
| 🤖 **AI** | Gemini 2.0 Flash (free tier) | Fastest LLM with generous free quota |
| 🍞 **Toasts** | react-hot-toast | Lightweight, premium feel |
| 💾 **State** | localStorage | Zero-backend MVP, no DB to manage |
| 🚀 **Hosting** | Vercel / Netlify | Both configs pre-included |

---

## 📊 Project Stats

- 📁 **27** source files
- 📝 **30+** biodata fields per profile
- 🧮 **100-pt** scoring algorithm (5 buckets)
- 👥 **10** matchmaker clients + **100** match pool profiles
- 🤖 **2** AI features (explanation + intro email)
- 🪶 **~87 KB gzipped** bundle

---

## 📜 License & Credits

Built with care for **TDC — The Date Crew** 💞

*Demo credentials are for evaluation only. Replace before any production use.*

---

<div align="center">

**[⭐ Star this repo](https://github.com/poorvjeet/tdc-matchmaker-dashboard)** if you find it useful!

</div>
