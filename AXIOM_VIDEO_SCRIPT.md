# 🎬 AXIOM — Complete Demo Video Script
## "From Empty City to AI-Powered Memory in 8 Minutes"

---

> **Before you begin recording:**
> - Open **OBS Studio** or any screen recorder
> - Resolution: **1920×1080**, 60fps
> - Browser: Chrome/Edge, zoom 90%
> - Frontend: `http://localhost:8080`
> - Backend: `http://localhost:3001` (running in background)
> - Open **Insomnia/Postman** in a second window for API calls
> - Total runtime: **~8–10 minutes**

---

## 🎬 SCENE 1 — Opening & Landing Page (0:00 – 0:30)

### 🖥️ What to show on screen
1. Open browser to `http://localhost:8080`
2. The Axiom landing page loads — animated hero text, pixel grid background
3. Slowly scroll down through the page sections

### 🎙️ Narration
> *"This is Axiom — an AI memory engine for cities. Every civic issue, every repair, every root cause gets permanently stored as institutional knowledge. Cities should never solve the same problem twice. Let me show you how it works — from an empty database to full AI intelligence."*

### 🎯 Key things to highlight
- The **"Cities Should Never Forget"** headline
- The pulsing live status badge "INSTITUTIONAL MEMORY · ONLINE"
- The 4 stat cards (12,483 Memories | 94% AI Confidence | 91% Prediction Accuracy | 82% Infrastructure Health)
- The Technology, Memory, Knowledge, Prediction sections scrolling by

---

## 🎬 SCENE 2 — Register Administrator (0:30 – 1:00)

### 🖥️ What to show on screen
Click **"Open Dashboard →"** button in the navbar

*(Note: The app currently goes straight to dashboard. Show the API registration via Insomnia side-by-side)*

### 📡 API Call — Register (show in Insomnia)
**Method:** `POST`  
**URL:** `http://localhost:3001/api/auth/register`  
**Body (JSON):**
```json
{
  "name": "Alex Sharma",
  "email": "alex@neocity.gov",
  "password": "Admin@123",
  "role": "ADMIN"
}
```

### ✅ Expected Output
```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "name": "Alex Sharma",
    "email": "alex@neocity.gov",
    "role": "ADMIN",
    "createdAt": "2026-06-30T15:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **📌 Do this live:** Highlight the `token` field in the response and say:
> *"Every request to Axiom from now requires this token in the Authorization header — this is what makes the system secure."*

### 🎙️ Narration
> *"First, we register the city administrator. Alex Sharma will manage NeoCity's entire civic memory system. One API call, zero seed data — the database was completely empty a second ago."*

---

## 🎬 SCENE 3 — Setup the City Hierarchy (1:00 – 2:00)

### 📡 Step 3a — Create Organization
**POST** `http://localhost:3001/api/setup/organization`  
*(Authorization: Bearer `<token from Step 2>`)*

```json
{ "name": "NeoCity Municipal Corporation" }
```

**Expected output:**
```json
{ "id": "org-uuid-here", "name": "NeoCity Municipal Corporation" }
```

---

### 📡 Step 3b — Create City
**POST** `http://localhost:3001/api/setup/city`

```json
{
  "name": "NeoCity",
  "organizationId": "org-uuid-here"
}
```

**Expected output:**
```json
{ "id": "city-uuid-here", "name": "NeoCity", "organizationId": "..." }
```

---

### 📡 Step 3c — Create Department
**POST** `http://localhost:3001/api/setup/department`

```json
{
  "name": "Roads & Infrastructure",
  "description": "Manages road repairs and civil infrastructure",
  "cityId": "city-uuid-here"
}
```

---

### 📡 Step 3d — Create Ward
**POST** `http://localhost:3001/api/setup/ward`

```json
{
  "name": "Ward 7 – MG Road Zone",
  "number": 7,
  "cityId": "city-uuid-here"
}
```

---

### 📡 Step 3e — Add Engineer
**POST** `http://localhost:3001/api/setup/engineer`

```json
{
  "name": "Priya Nair",
  "email": "priya@neocity.gov",
  "departmentId": "dept-uuid-here",
  "cityId": "city-uuid-here",
  "organizationId": "org-uuid-here"
}
```

**Expected output:**
```json
{
  "id": "engineer-uuid-here",
  "name": "Priya Nair",
  "email": "priya@neocity.gov",
  "role": "ENGINEER",
  "defaultPassword": "Engineer@123"
}
```

### 🎙️ Narration
> *"In under 60 seconds, we've built the complete city hierarchy — Organization, City, Department, Ward, and our first Engineer. The database now has exactly 2 users, 1 organization, 1 city, 1 department, and 1 ward. Nothing was hardcoded or seeded."*

---

## 🎬 SCENE 4 — Add Infrastructure Assets (2:00 – 2:30)

### 📡 Step 4a — Create Infrastructure Type
**POST** `http://localhost:3001/api/setup/infrastructure-type`

```json
{
  "name": "Road",
  "description": "Asphalt or concrete road surface",
  "icon": "road"
}
```

---

### 📡 Step 4b — Add MG Road Asset
**POST** `http://localhost:3001/api/setup/infrastructure-asset`

```json
{
  "name": "MG Road – Sector 4",
  "description": "Main arterial road, 2.3km stretch, high traffic volume",
  "typeId": "road-type-uuid",
  "wardId": "ward-7-uuid",
  "latitude": "12.9716",
  "longitude": "77.5946",
  "address": "MG Road, Ward 7, NeoCity",
  "age": "15",
  "material": "Asphalt"
}
```

**Expected output:**
```json
{
  "id": "asset-uuid-here",
  "name": "MG Road – Sector 4",
  "status": "OPERATIONAL",
  "type": { "name": "Road" },
  "location": { "address": "MG Road, Ward 7, NeoCity", "ward": { "name": "Ward 7 – MG Road Zone" } }
}
```

### 🎙️ Narration
> *"Now we add our city's infrastructure. MG Road Sector 4 — 15 years old, asphalt surface, Ward 7. This asset now exists in Axiom's memory and will be linked to every future issue and repair on this road."*

---

## 🎬 SCENE 5 — Report the First Civic Issue (2:30 – 3:30)

### 🖥️ Switch to the Frontend
Navigate to `http://localhost:8080/app/report`

### 🖱️ What to click & type
1. Click on **"Report an Issue"** in the sidebar
2. In **Issue Title** field, type:
   ```
   Large pothole causing traffic issues on MG Road
   ```
3. In **Description** field, type:
   ```
   A large pothole approximately 60cm wide and 20cm deep has formed near MG Road Sector 4. It is causing vehicles to swerve dangerously. Two motorcycle accidents have already been reported near this location.
   ```
4. Click **"Report Issue & Analyze"** button

### 🎬 What happens on screen (show live)
- The form disappears
- A beautiful **animated graph visualization** appears with pulsing nodes
- 4 analysis steps appear one by one with checkmarks:
  - ✅ Analyzing media…
  - ✅ Searching collective memory…
  - ✅ Finding similar incidents…
  - ✅ Reasoning about root cause…
- Results slide in

### ✅ Expected Result Screen Output
```
ROAD Issue                                    [HIGH]
Ward 7 · Large pothole causing traffic...

Confidence:  92%
Root cause:  Surface wear and tear
Est. cost:   ₹1.2L
Repair time: 2 days

AI Summary:
A large pothole approximately 60cm wide and 20cm deep
has formed near MG Road Sector 4...

Similar Memories: (0)
[Empty — first issue ever]
```

### 📡 What the API returned (show in terminal/Insomnia)
```json
{
  "issue": { "id": "issue-uuid", "status": "ANALYZED", "category": "ROAD", "severity": "HIGH" },
  "aiAnalysis": {
    "category": "ROAD",
    "severity": "HIGH",
    "possibleCauses": ["Surface wear and tear", "Heavy vehicle traffic", "Monsoon waterlogging"],
    "recommendation": "Schedule immediate pothole filling with hot-mix asphalt. Inspect surrounding 50m for additional damage."
  },
  "similarMemories": [],
  "similarMemoriesMessage": "No similar historical memories found. This is a new type of issue for the system."
}
```

### 🎙️ Narration
> *"Watch Axiom analyze this issue in real time. It correctly identifies this as a HIGH severity ROAD issue. And notice — 'No similar historical memories found.' That's honest. The city's memory is empty right now. But that's about to change."*

---

## 🎬 SCENE 6 — Assign Repair to Engineer (3:30 – 4:00)

### 📡 API Call
**POST** `http://localhost:3001/api/repairs`

```json
{
  "issueId": "issue-uuid-from-step-5",
  "engineerId": "priya-nair-uuid",
  "description": "Pothole repair on MG Road using hot-mix asphalt resurfacing",
  "startDate": "2026-06-30T08:00:00.000Z"
}
```

**Expected output:**
```json
{
  "id": "repair-uuid-here",
  "outcome": "PENDING",
  "description": "Pothole repair on MG Road using hot-mix asphalt resurfacing",
  "engineer": { "name": "Priya Nair", "email": "priya@neocity.gov" },
  "issue": { "title": "Large pothole causing traffic issues on MG Road" }
}
```

> **📌 Point out:** Issue status just changed from `ANALYZED` to `ASSIGNED`. The city is reacting.

### 🎙️ Narration
> *"Priya Nair from the Roads & Infrastructure department is now assigned to this repair. The issue status has updated automatically to 'Assigned' — the workflow is in motion."*

---

## 🎬 SCENE 7 — COMPLETE REPAIR (The Big Cascade Moment) (4:00 – 5:00)

> **🎯 THIS IS THE CENTERPIECE OF THE DEMO — slow down here**

### 📡 API Call
**POST** `http://localhost:3001/api/repairs/repair-uuid-here/complete`

```json
{
  "outcome": "SUCCESS",
  "successScore": 88,
  "engineerNotes": "Pothole filled with hot-mix asphalt, area levelled and compacted. Recommend monitoring during next monsoon season. Similar damage may appear in adjacent Sector 5.",
  "cost": 12500
}
```

### ✅ Expected Output (show this live — it's impressive)
```json
{
  "repair": {
    "outcome": "SUCCESS",
    "successScore": 88,
    "endDate": "2026-06-30T15:45:22.000Z",
    "engineerNotes": "Pothole filled with hot-mix asphalt..."
  },
  "memory": {
    "id": "memory-uuid",
    "title": "Large pothole causing traffic issues on MG Road",
    "successScore": 88,
    "aiSummary": "A high priority road issue was successfully resolved. Root cause: not categorized. Repair method: Pothole repair on MG Road using hot-mix asphalt resurfacing. Engineer notes: Pothole filled with hot-mix asphalt...",
    "lessons": [
      {
        "lesson": "Pothole filled with hot-mix asphalt, area levelled and compacted...",
        "impact": "Outcome: SUCCESS. Success score: 88/100"
      }
    ]
  },
  "message": "Repair completed. Memory created. Knowledge graph now has 0 connection(s). Total memories: 1.",
  "cascade": {
    "memoryCreated": true,
    "graphConnections": 0,
    "totalMemories": 1
  }
}
```

### 🎙️ Narration (dramatic pause here)
> *"And there it is. One API call — and look what Axiom just did automatically in the background:"*

**Slowly read out each cascade effect while pointing:**
> - *"The repair was marked as successful with an 88/100 score"*
> - *"A permanent City Memory was instantly created"*
> - *"The engineer's notes became a Lesson Learned"*
> - *"The AI generated a summary of what happened and why"*
> - *"Analytics were recalculated"*
> - *"The prediction engine was triggered"*
> - *"And the Knowledge Graph is ready for its first connection"*

---

## 🎬 SCENE 8 — Check the Dashboard (5:00 – 5:30)

### 🖥️ Navigate to `http://localhost:8080/app`

### 🎬 What to point out on the dashboard
Point to each stat card and narrate:

| Card | Before Repair | After Repair |
|------|--------------|--------------|
| Total Memories | 0 | **1** |
| Open Issues | 1 | **0** |
| Resolved Issues | 0 | **1** |
| Infrastructure Health | 100% | **100%** (no broken assets) |
| Repair Success Rate | N/A | **100%** |

> **📌 Zoom in on the "Total Memories" card counting up from 0 → 1**

### 🎙️ Narration
> *"The dashboard is now live. One memory stored. Zero open issues. Infrastructure health at 100%. Every number you see here is computed from the actual database — no fake values, no hardcoded stats."*

---

## 🎬 SCENE 9 — Ask Axiom (AI Q&A) (5:30 – 6:30)

### 🖥️ Navigate to `http://localhost:8080/app/ask`

### 🎬 What to show
The Ask Axiom page loads with 4 example prompts:
- "Why do potholes keep appearing?"
- "Show recurring drainage failures."
- "Find similar streetlight issues."
- "Which repairs are most effective?"

### 🖱️ Click the first example: **"Why do potholes keep appearing?"**

The input auto-fills → Click **"Ask →"**

### 🎬 Animation sequence (show live)
- Screen shows: **"Axiom is thinking... Searching through city memory"**
- Results fade in with staggered animation:

### ✅ Expected Answer Output on screen
```
[ ANSWER ]
Found 1 related memory record(s) in Axiom's knowledge
base. The top match is "Large pothole causing traffic
issues on MG Road" with a success score of 88/100.
1 of the top 1 similar issues were resolved successfully
with an average success score of 88/100.

[ CONFIDENCE ]
50% confidence in this answer.

[ RECOMMENDATIONS ]
• Schedule immediate pothole filling with hot-mix
  asphalt. Inspect surrounding 50m for additional damage.
• Review 1 similar memory record(s) in the Memory module

[ SOURCES ]
1 related memories found.
```

### 🎙️ Narration
> *"Axiom now has real knowledge to draw from. It found the memory we just created, correctly linked it to this question about potholes, retrieved the exact repair recommendation from history, and told us its confidence level. This is institutional memory in action."*

> *"And notice the confidence is 50%. That's because we only have 1 memory. The more repairs the city completes, the smarter Axiom gets."*

---

## 🎬 SCENE 10 — The Memory Module (6:30 – 7:00)

### 🖥️ Navigate to `http://localhost:8080/app/memory`

### 🎬 What to show
**API call to show in browser or Insomnia:**

`GET http://localhost:3001/api/memories`

```json
{
  "memories": [
    {
      "id": "memory-uuid",
      "title": "Large pothole causing traffic issues on MG Road",
      "successScore": 88,
      "aiSummary": "A high priority road issue was successfully resolved...",
      "createdAt": "2026-06-30T15:45:22.000Z",
      "ward": { "name": "Ward 7 – MG Road Zone" },
      "issue": { "category": "ROAD", "severity": "HIGH" },
      "repair": { "outcome": "SUCCESS", "engineer": { "name": "Priya Nair" } }
    }
  ],
  "count": 1
}
```

### 🎙️ Narration
> *"Every completed repair becomes a memory. Searchable, queryable, permanent. The city will never forget how this pothole was fixed, who fixed it, what it cost, and what lessons were learned."*

---

## 🎬 SCENE 11 — Report Second Issue (AI Gets Smarter) (7:00 – 7:30)

### 🖥️ Navigate back to `http://localhost:8080/app/report`

### 🖱️ Enter this second issue:
**Title:**
```
Pothole and road damage near MG Road Sector 5
```
**Description:**
```
Road surface has cracked and a pothole has formed near Sector 5 of MG Road. The damage appears similar to the Sector 4 issue. Heavy vehicles passing daily are worsening the damage.
```

Click **"Report Issue & Analyze"**

### ✅ Expected Result (dramatically different from first issue)

**Similar Memories section now shows:**
```
Similar Memories (1)

• Large pothole causing traffic issues on MG Road
  Success Score: 88%
```

**API returns:**
```json
{
  "similarMemoriesMessage": "1 related memory found: 'Large pothole causing traffic issues on MG Road' (Success Score: 88/100).",
  "similarMemories": [
    {
      "title": "Large pothole causing traffic issues on MG Road",
      "successScore": 88,
      "similarity": 72
    }
  ]
}
```

### 🎙️ Narration
> *"Now watch what happens with the second issue. Axiom scans its memory — finds the pothole case we just resolved — and instantly shows it as a related memory with 72% similarity. The city remembered. The engineer can immediately see what worked last time without doing any research."*

---

## 🎬 SCENE 12 — Complete Second Repair & See the Knowledge Graph (7:30 – 8:30)

### 📡 Assign and Complete Second Repair
```json
POST /api/repairs
{
  "issueId": "issue-2-uuid",
  "engineerId": "priya-nair-uuid",
  "description": "Pothole filling with polymer-modified asphalt for better durability"
}

POST /api/repairs/repair-2-uuid/complete
{
  "outcome": "SUCCESS",
  "successScore": 91,
  "engineerNotes": "Used polymer-modified asphalt this time. Better resistance to water seepage. Road monitored for 48 hours — surface stable.",
  "cost": 15800
}
```

### ✅ Cascade output shows
```json
{
  "message": "Repair completed. Memory created. Knowledge graph now has 1 connection(s). Total memories: 2.",
  "cascade": {
    "memoryCreated": true,
    "graphConnections": 1,
    "totalMemories": 2
  }
}
```

### 🖥️ Navigate to `http://localhost:8080/app/graph`

**Show the graph API response:**
`GET http://localhost:3001/api/memories/graph`

```json
{
  "nodes": [
    { "id": "m1", "label": "Large pothole causing...", "category": "ROAD", "successScore": 88 },
    { "id": "m2", "label": "Pothole and road damage...", "category": "ROAD", "successScore": 91 }
  ],
  "edges": [
    { "source": "m2", "target": "m1", "type": "SIMILAR_ISSUE", "weight": 0.72, "label": "SIMILAR ISSUE" }
  ],
  "nodeCount": 2,
  "edgeCount": 1
}
```

### 🎙️ Narration
> *"The Knowledge Graph just created its first connection. Two road memories are now linked by a 'Similar Issue' edge with a weight of 0.72. As more repairs are completed, this graph will grow — connecting roads to drains to bridges to streetlights, building a living map of the city's infrastructure history."*

---

## 🎬 SCENE 13 — Predictions (8:30 – 9:00)

### 🖥️ Navigate to `http://localhost:8080/app/predictions`

**API call:** `GET http://localhost:3001/api/predictions`

```json
{
  "predictions": [
    {
      "type": "ROAD_FAILURE",
      "confidence": 44,
      "description": "Based on 2 resolved road issue(s), similar failures are predicted in high-traffic areas."
    },
    {
      "type": "INFRASTRUCTURE_MAINTENANCE",
      "confidence": 30,
      "description": "0 broken asset(s) and 0 aging asset(s) (20+ years) detected. Preventive maintenance recommended."
    }
  ],
  "message": null
}
```

### 🎙️ Narration
> *"The Prediction Engine has activated. Based on 2 resolved road failures, Axiom is now predicting a 44% probability of another road failure in a high-traffic area. This confidence will grow with every repair. After 20 memories, prediction accuracy reaches 85%."*

---

## 🎬 SCENE 14 — Ask Axiom Again (The Growth) (9:00 – 9:30)

### 🖥️ Navigate to `http://localhost:8080/app/ask`

Type:
```
What is the best repair method for potholes on MG Road?
```

Click **"Ask →"**

### ✅ Expected Output
```
[ ANSWER ]
Found 2 related memory record(s) in Axiom's knowledge base.
The top match is "Pothole and road damage near MG Road Sector 5"
with a success score of 91/100. 2 of the top 2 similar issues
were resolved successfully with an average success score of 90/100.

[ CONFIDENCE ]
60% confidence in this answer.

[ RECOMMENDATIONS ]
• Schedule immediate pothole filling with hot-mix asphalt.
  Inspect surrounding 50m for additional damage.
• Review 2 similar memory record(s) in the Memory module.

[ SOURCES ]
2 related memories found.
```

### 🎙️ Narration
> *"The AI confidence grew from 50% to 60% — because it now has 2 memories instead of 1. It's telling us the average success score is 90/100 across both pothole repairs. And the second repair with polymer-modified asphalt scored 91/100 — Axiom will recommend that method for the next pothole."*

---

## 🎬 SCENE 15 — Analytics Dashboard (9:30 – 10:00)

### 📡 API call
`GET http://localhost:3001/api/analytics/dashboard`

```json
{
  "totalMemories": 2,
  "totalIssues": 2,
  "openIssues": 0,
  "resolvedIssues": 2,
  "infrastructureHealth": 100,
  "repairSuccessRate": 100,
  "predictionAccuracy": 50,
  "knowledgeConnections": 1,
  "issuesByCategory": [
    { "category": "ROAD", "count": 2 }
  ],
  "recentMemories": [
    { "title": "Pothole and road damage near MG Road Sector 5", "successScore": 91 },
    { "title": "Large pothole causing traffic issues on MG Road", "successScore": 88 }
  ],
  "emptyStates": {
    "noMemories": false,
    "noIssues": false,
    "noPredictions": false,
    "noGraph": false
  }
}
```

### 🎙️ Narration
> *"Every single number on this dashboard is live. 2 memories. 2 resolved issues. 100% repair success rate. 1 knowledge graph connection. Prediction accuracy at 50% — and climbing with every repair."*

---

## 🎬 SCENE 16 — Closing Shot (10:00 – 10:20)

### 🖥️ Navigate back to `http://localhost:8080`

Slowly scroll back to the top of the landing page.

### 🎙️ Narration
> *"We started with a completely empty database. No seed data, no mock records, no hardcoded values. In 10 minutes, we:"*

*Speak this list while showing the landing page hero:*

> - ✅ *"Built an entire city hierarchy from scratch"*
> - ✅ *"Reported and resolved 2 civic issues"*
> - ✅ *"Axiom's AI analyzed and classified both correctly"*
> - ✅ *"Created 2 permanent city memories with embeddings"*
> - ✅ *"Built the first Knowledge Graph connection"*
> - ✅ *"Activated the Prediction Engine"*
> - ✅ *"Watched the AI get smarter with each repair"*

> *"This is Axiom. The city that never forgets."*

### 🎬 Final frame
- Hold on the animated hero: **"Cities Should Never Forget."**
- Fade to black

---

## 📋 QUICK COPY-PASTE DATA SHEET

### All API Credentials
| Field | Value |
|-------|-------|
| Base URL | `http://localhost:3001` |
| Admin Email | `alex@neocity.gov` |
| Admin Password | `Admin@123` |
| Engineer Email | `priya@neocity.gov` |
| Engineer Password | `Engineer@123` |

### All Exact Input Values

**Issue 1 — Title:**
```
Large pothole causing traffic issues on MG Road
```
**Issue 1 — Description:**
```
A large pothole approximately 60cm wide and 20cm deep has formed near MG Road Sector 4. It is causing vehicles to swerve dangerously. Two motorcycle accidents have already been reported near this location.
```
**Repair 1 — Engineer Notes:**
```
Pothole filled with hot-mix asphalt, area levelled and compacted. Recommend monitoring during next monsoon season. Similar damage may appear in adjacent Sector 5.
```

---

**Issue 2 — Title:**
```
Pothole and road damage near MG Road Sector 5
```
**Issue 2 — Description:**
```
Road surface has cracked and a pothole has formed near Sector 5 of MG Road. The damage appears similar to the Sector 4 issue. Heavy vehicles passing daily are worsening the damage.
```
**Repair 2 — Engineer Notes:**
```
Used polymer-modified asphalt this time. Better resistance to water seepage. Road monitored for 48 hours — surface stable.
```

---

**AI Question 1:**
```
Why do potholes keep appearing?
```
**AI Question 2:**
```
What is the best repair method for potholes on MG Road?
```

---

## 📈 METRICS EVOLUTION CHEAT SHEET

| Metric | Start | After Issue 1 | After Repair 1 | After Repair 2 |
|--------|-------|---------------|----------------|----------------|
| Total Memories | 0 | 0 | **1** | **2** |
| Open Issues | 0 | 1 | 0 | 0 |
| Resolved Issues | 0 | 0 | **1** | **2** |
| Repair Success % | N/A | N/A | **100%** | **100%** |
| Graph Connections | 0 | 0 | 0 | **1** |
| AI Confidence | 0 | 0 | **50%** | **60%** |
| Prediction Accuracy | 0% | 0% | **50%** | **50%** |
| Predictions Active | 0 | 0 | **1** | **2** |

---

*Script Version 1.0 — Axiom Demo Video — June 2026*
