# PrepAI — AI-Powered Interview Preparation Platform

A full-stack MERN project that helps users prepare for technical interviews using **Groq AI** for real-time answer evaluation and resume review.

## 🔗 Live Links

- **Frontend:** https://prep-ai-4sb5.vercel.app
- **Backend:** https://prepai-backend-4lx6.onrender.com

---

## 🚀 Features

### Mock Interview
- Theory and Coding interview modes
- 9 topics: Python, SQL, ML, Statistics, DBMS, OOPs, OS, Computer Networks, HR
- 4 coding languages: Python, Java, C++, JavaScript
- **AI evaluates every answer** using Groq AI (llama-3.1-8b-instant)
- Real-time feedback: Score, Feedback, Strength, Improvement
- **Model Answer** shown after each question so users can learn
- Timer per question (60s theory, 120s coding)
- Progress bar and final score summary
- Falls back to local scoring if AI is unavailable

### Resume Review
- Upload resume (PDF, DOC, DOCX) for basic score
- **Paste resume text for full AI review**
- AI returns: Score, Overall Feedback, Strengths, Suggestions, Missing Skills, ATS Score

### Analytics & Dashboard
- Interview history saved in localStorage
- Score tracking over time

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI | Groq API (llama-3.1-8b-instant) |
| Database | MongoDB |
| File Upload | Multer |
| Deployment | Vercel (frontend) + Render (backend) |

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/ritika312006/PrepAI.git
cd PrepAI
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Create `.env` file in backend folder
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/prepai
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Get free Groq API key
- Go to https://console.groq.com
- Sign up and create an API key
- Paste it in `.env`

### 6. Run backend
```bash
cd backend
node server.js
```

### 7. Run frontend
```bash
npm run dev
```

---

## 🤖 AI Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/ai-evaluate` | POST | Evaluate interview answer using Groq AI |
| `/ai-resume-review` | POST | Review resume text using Groq AI |

---

## 📦 Key Dependencies

```json
{
  "groq-sdk": "^1.2.1",
  "express": "^5.2.1",
  "multer": "^2.1.1",
  "mongoose": "^9.3.1",
  "dotenv": "^17.4.2",
  "cors": "^2.8.6"
}
```

---

## 🐛 Issues Faced & Fixed

- **Gemini API quota issue** → Switched to Groq (free, no expiry)
- **Groq model decommissioned** → Updated from `llama3-8b-8192` to `llama-3.1-8b-instant`
- **Git push rejected** → Fixed with `git pull origin main --rebase`
- **Vercel multi-service detection** → Deployed frontend only, backend on Render separately

---

## 📁 Project Structure

```
PrepAI/
├── backend/
│   ├── server.js         ← Express server + AI routes
│   ├── .env              ← API keys (not in git)
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── MockInterview.jsx   ← AI interview evaluation
│   │   ├── ResumeReview.jsx    ← AI resume review
│   │   ├── Dashboard.jsx
│   │   └── Analytics.jsx
│   ├── components/
│   └── layout/
├── index.html
└── package.json
```

---

## 👩‍💻 Developer

Built by **Ritika** — MERN Stack + AI Integration Project
