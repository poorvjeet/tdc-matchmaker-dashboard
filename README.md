# TDC Matchmaker Dashboard — Setup

## 1. Install
```bash
npm install
```

## 2. Get a free Gemini API key
- Go to https://aistudio.google.com/apikey
- Click "Create API key" (free tier — no billing needed)
- Copy the key

## 3. Configure environment
```bash
cp .env.example .env
# Then edit .env and paste your key:
# VITE_GEMINI_API_KEY=AIzaSy...
```

## 4. Run
```bash
npm run dev      # local dev
npm run build    # production build
```

## 5. Login
- Username: `matchmaker@tdc.com`
- Password: `tdc@2025`

## 6. Deploy
- **Vercel**: `vercel deploy` (or import repo)
- **Netlify**: `netlify deploy` (or drag `dist/` folder)

Both configs (`vercel.json` and `netlify.toml`) are pre-included.
