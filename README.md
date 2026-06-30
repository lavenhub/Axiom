<div align="center">
  <img src="./Screenshot%202026-06-30%20224233.png" alt="Axiom Interface" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  
  <br />
  <br />

  <h1>Axiom - AI Memory Engine for Cities</h1>
  
  <p>
    <b>A production-ready, AI-powered municipal infrastructure management system.</b><br />
    Transforming every repair and issue into permanent, searchable institutional memory to make cities infinitely smarter over time.
  </p>

  <p>
    <a href="#for-judges">For Judges</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

## For Judges

**Quick Overview & Testing Guide**

**Key Features to Evaluate:**
1. **AI Memory Engine:** Reports and issues are automatically embedded into a vector database (pgvector) for semantic similarity search.
2. **Predictive Analysis:** The system proactively assesses failure risks and recommends root causes.
3. **Interactive Dashboard:** Real-time metrics and historical incident correlation presented beautifully.

**How to Test It:**
1. Follow the **Getting Started** steps below to deploy the stack.
2. Navigate to the web interface and click **"Report Issue"**.
3. Submit a sample report (e.g., "Water leak on 5th Ave"). 
4. The system will automatically run an AI analysis and link it to past similar reports.
5. Explore the main dashboard to view the generated semantic links, predicted root causes, and recommended actions.

---

## Vision

Traditional municipal infrastructure management is reactive and fragmented. When an engineer fixes a pothole, a water main break, or a broken street light, the knowledge of *why* it broke and *how* it was fixed is often lost in endless paperwork.

**Axiom** solves this by acting as the city's **Memory Engine**. Every issue reported, and every repair completed, is analyzed by AI and stored securely using vector embeddings. This allows the system to semantically link related incidents, suggest root causes, and predict future infrastructure failures before they happen.

---

## Key Features

- **Memory Engine**: Stores every infrastructure issue and repair as an AI-augmented, context-rich memory.
- **Semantic Search**: Utilizes **AI embeddings** and **pgvector** to surface historically similar issues instantly.
- **Automated AI Analysis**: Intelligently categorizes problems, evaluates severity, and pinpoints exact root causes.
- **Failure Predictions**: Analyzes historical patterns and material degradation to forecast future failures.
- **Real-Time Analytics**: Offers powerful dashboards tracking city health, engineer performance, and repair efficacy.
- **Knowledge Graph**: Connects disparate memories, exposing hidden structural relationships across the municipal grid.

---

## Tech Stack

Built with absolute performance and modern standards in mind, Axiom leverages a cutting-edge stack:

### **Frontend**
- **React 19** + **TypeScript** - For robust, strongly-typed UI components.
- **TanStack Router** - State-of-the-art file-based routing.
- **Tailwind CSS 4** - Beautiful, utility-first styling with high customizability.
- **Framer Motion** - Fluid, eye-catching animations and transitions.

### **Backend**
- **Node.js** & **Express.js** + **TypeScript** - High-throughput API server.
- **Prisma ORM** - Type-safe database interactions.
- **PostgreSQL 15+** with **pgvector** - Scalable relational data & high-performance vector search.
- **Groq API** - Lightning-fast LLM inference and text analysis.
- **Redis** *(Optional)* - Ultra-fast caching layer.

---

## Project Architecture

```
axiom/
├── frontend/          # React 19 Frontend App
├── backend/           # Express.js REST API
│   ├── src/
│   │   ├── config/    # Environment, Groq, Prisma configurations
│   │   ├── routes/    # Modular API definitions
│   │   └── services/  # Core AI & Business logic
│   └── prisma/        # Database schema and seed scripts
└── packages/          # Shared type definitions
```

---

## Deploying to Vercel (End-to-End)

Axiom is split into two Vercel projects: **backend** and **frontend**. The database is **Vercel Postgres** — built directly into Vercel, no external service or separate account needed.

---

### Step 1 — Push to GitHub

Make sure your code is on GitHub (Vercel imports directly from it).

---

### Step 2 — Create the Database (Vercel Postgres, built-in)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** in the left sidebar → **Create Database** → choose **Postgres**
3. Name it `axiom-db` → click **Create**
4. Inside the database page, click the **`.env.local`** tab and copy all the values — you'll need `DATABASE_URL` and `POSTGRES_URL_NON_POOLING` (this is `DATABASE_URL_UNPOOLED`)

---

### Step 3 — Deploy the Backend

1. Go to [vercel.com/new](https://vercel.com/new) → import your GitHub repo → **Set Root Directory to `backend`**

2. In **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | paste `DATABASE_URL` from Step 2 |
   | `DATABASE_URL_UNPOOLED` | paste `POSTGRES_URL_NON_POOLING` from Step 2 |
   | `GROQ_API_KEY` | your Groq API key |
   | `ALLOWED_ORIGINS` | `*` *(update to your frontend URL after Step 4)* |

3. Click **Deploy** → note your backend URL (e.g. `https://axiom-backend-xyz.vercel.app`)

4. **Run migrations** (one-time, from your local machine):
   ```bash
   cd backend
   # Paste the DATABASE_URL and DATABASE_URL_UNPOOLED into your local backend/.env
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Verify**: Visit `https://axiom-backend-xyz.vercel.app/health` → should return `{ "status": "ok" }`

---

### Step 4 — Deploy the Frontend

1. Go to [vercel.com/new](https://vercel.com/new) → import your repo again → **Set Root Directory to `frontend`**

2. Add this **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://axiom-backend-xyz.vercel.app` *(your backend URL from Step 3)* |

3. Click **Deploy** → your app is live! 🎉

4. Go back to the **backend** project → Settings → Environment Variables → set `ALLOWED_ORIGINS` to your frontend URL → **Redeploy**

---

### Running Locally (Development)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev   # runs on http://localhost:3001

# Terminal 2 — Frontend  
cd frontend
npm install
npm run dev   # runs on http://localhost:8080
```

---

## How the Memory Engine Works

1. **Intake**: A citizen or city worker reports an issue (including text, location, and optional media).
2. **Analysis**: The AI processes the report, generating semantic vector embeddings.
3. **Retrieval**: The system queries `pgvector` to find historically similar incidents in the city's memory bank.
4. **Insight Generation**: Axiom suggests possible root causes, the best repair methods, and safety warnings.
5. **Action**: The engineering team completes the repair in the physical world.
6. **Consolidation**: The repair outcome is logged as a permanent memory, completing the feedback loop.
7. **Evolution**: Over time, the predictive models are retrained, making the city smarter with every single fix.

---

## 🛡️ License

This project is licensed under the **MIT License**.
