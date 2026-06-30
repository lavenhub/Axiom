# Axiom Video Shoot Quick Cheat Sheet! 🎥

## ✅ Before You Start Recording
- [ ] Both services are running!
  - Frontend: http://localhost:8080
  - Backend: http://localhost:3001
- [ ] Have all mock data ready to copy/paste!
- [ ] Know the order of pages to visit!

---

## 🎯 Step-by-Step Cheat Sheet

### Part 1: Intro & Services
- Open both services in separate browser tabs
- Show the 2 terminal windows running

### Part 2: Dashboard
- URL: http://localhost:8080
- Page: `/app`
- Show all stats!

### Part 3: Report an Issue
- URL: http://localhost:8080/app/report
- **Mock Data to Enter**:
  - Title: "Large Pothole on Oak Avenue"
  - Description: "Dangerous pothole near the park entrance, damaging cars. It rained heavily last night!"
  - GPS Coordinates: Lat 40.7135, Lng -74.0065
  - Your Name: Jane Citizen
  - Email: jane@citizen.com

### Part 4: Demo the AI Analysis (Backend!)
Open a terminal window:
```bash
cd backend
npm run interactive
```
Choose option 1 to create a new issue!
This will show you the AI's analysis and similar memories!

### Part 5: Demo Memory Creation
From `interactive-test.ts`, also show how memories are created!

### Part 6: Ask Axiom
- URL: http://localhost:8080/app/ask
- Question: "What are common causes of potholes and how to fix them?"

### Part 7: Predictions & Analytics
- Predictions URL: http://localhost:8080/app/predictions
- Analytics URL: http://localhost:8080/app/analytics

---

## 💬 If You Need Any Help...
Check `FINAL-SUMMARY.md` or `COMPLETE-WORKFLOW-TEST.md`!

That's all you need! 🎉 Have fun making the video!
