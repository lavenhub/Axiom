# 🎥 Axiom Full Demo Guide - Frontend + Backend Connected!

## ✅ What's Been Done:
- Frontend and backend connected via API!
- Report Issue page now uses real backend!
- Ask Axiom page now uses real backend!
- CORS configured!

---

## 🚀 Quick Start to Demo

### 1. Make sure services are running!
- Frontend: http://localhost:8080
- Backend: http://localhost:3001 (should be running from earlier)

### 2. Step-by-Step Demo Walkthrough

#### Step A: Show the Dashboard
- Open http://localhost:8080/app
- Show off the pixel-art UI!

#### Step B: Report an Issue! (Full Workflow!)
1. Go to http://localhost:8080/app/report
2. Fill in the mock data:
   - **Title**: "Large pothole near park entrance"
   - **Description**: "Deep pothole on Oak Ave near the city park - cars are getting damaged!"
   - **Your Name**: "Jane Citizen"
   - **Email**: "jane@citizen.com"
3. Click "Report Issue & Analyze"
4. Watch the analyzing animation!
5. See the results!
   - AI Analysis (category, severity, possible causes)
   - Similar historical memories!

#### Step C: Ask Axiom!
1. Go to http://localhost:8080/app/ask
2. Click one of the example questions OR type your own!
   - Try: "What are common causes of potholes?"
3. See Axiom's answer!
   - Answer with confidence score
   - Recommendations!

---

## 💾 Backend API Quick Test (if needed!)
If you want to show the backend working directly:
1. Open a terminal
2. Go to `/backend`
3. Run: `npm run interactive`

---

## 📊 Files Created/Updated:
- `/frontend/src/lib/api.ts`: API client for frontend
- `/frontend/src/routes/app.report.tsx`: Connected report page
- `/frontend/src/routes/app.ask.tsx`: Connected ask page

Enjoy your fully-connected Axiom demo! 🎉
