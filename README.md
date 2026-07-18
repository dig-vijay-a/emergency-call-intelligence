# Emergency Call Intelligence
**An AI dispatcher that understands emergency calls and prioritizes rescue within seconds.**

## The Problem
Emergency dispatchers face massive cognitive load. They must listen to panicked callers, type notes, and manually judge severity. This manual bottleneck costs critical minutes. 

## The AI Solution
This project uses an AI pipeline to instantly process calls:
1. **Speech-to-Text & Extraction (Gemini 1.5):** Transcribes audio and extracts structured data (Type, Location, Victims, Urgency).
2. **Severity Scoring (XGBoost):** Calculates a deterministic 1-10 priority score based on the extracted features.
3. **Dispatch Recommendation:** Automatically suggests the necessary responders.

## How to Run Locally

### 1. Backend (FastAPI + AI Pipeline)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set your Google Gemini API key:
   - On Windows: `set GEMINI_API_KEY="your_api_key_here"`
   - On Mac/Linux: `export GEMINI_API_KEY="your_api_key_here"`
3. Install dependencies and run:
   ```bash
   pip install fastapi uvicorn google-genai xgboost scikit-learn python-multipart
   python main.py
   ```
   *(The backend runs on `http://localhost:8000`)*

### 2. Frontend (React + Vite + Tailwind)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *(The frontend runs on `http://localhost:5173`)*

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Python, FastAPI
- **AI/ML:** Google Gemini API (for audio transcription & extraction), XGBoost (for custom severity scoring model)
