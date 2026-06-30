<div align="center">
  <img src="./Screenshot%202026-06-30%20224233.png" alt="Axiom Interface" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  
  <br />
  <br />

  <h1>🚀 Axiom - AI Memory Engine for Cities</h1>
  
  <p>
    <b>A production-ready, AI-powered municipal infrastructure management system.</b><br />
    Transforming every repair and issue into permanent, searchable institutional memory to make cities infinitely smarter over time.
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

## 🌟 Vision

Traditional municipal infrastructure management is reactive and fragmented. When an engineer fixes a pothole, a water main break, or a broken street light, the knowledge of *why* it broke and *how* it was fixed is often lost in endless paperwork.

**Axiom** solves this by acting as the city's **Memory Engine**. Every issue reported, and every repair completed, is analyzed by AI and stored securely using vector embeddings. This allows the system to semantically link related incidents, suggest root causes, and predict future infrastructure failures before they happen.

---

## ✨ Key Features

- 🧠 **Memory Engine**: Stores every infrastructure issue and repair as an AI-augmented, context-rich memory.
- 🔍 **Semantic Search**: Utilizes **OpenAI embeddings** and **pgvector** to surface historically similar issues instantly.
- 🤖 **Automated AI Analysis**: Intelligently categorizes problems, evaluates severity, and pinpoints exact root causes.
- 📊 **Failure Predictions**: Analyzes historical patterns and material degradation to forecast future failures.
- 📈 **Real-Time Analytics**: Offers powerful dashboards tracking city health, engineer performance, and repair efficacy.
- 🗺️ **Knowledge Graph**: Connects disparate memories, exposing hidden structural relationships across the municipal grid.

---

## 🛠️ Tech Stack

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
- **OpenAI API** - Advanced embeddings and language completions.
- **Redis** *(Optional)* - Ultra-fast caching layer.

---

## 🏗️ Project Architecture

```
axiom/
├── frontend/          # React 19 Frontend App
├── backend/           # Express.js REST API
│   ├── src/
│   │   ├── config/    # Environment, OpenAI, Prisma configurations
│   │   ├── routes/    # Modular API definitions
│   │   └── services/  # Core AI & Business logic
│   └── prisma/        # Database schema and seed scripts
└── packages/          # Shared type definitions
```

---

## 🚀 Getting Started

Follow these steps to deploy Axiom locally for development and testing.

### Prerequisites
- **Node.js** (v20 or higher)
- **PostgreSQL** (v15 or higher) with the **pgvector** extension installed
- **OpenAI API Key**

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

**Configure the environment:**
Rename `.env.example` to `.env` (or create one) and configure your variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/axiom"
OPENAI_API_KEY="your_openai_api_key_here"
```

**Initialize the Database:**
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

**Start the API Server:**
```bash
npm run dev
```
> The backend will now be running on `http://localhost:3001`

### 2. Frontend Setup

In a new terminal window, initialize the frontend client:

```bash
cd frontend
npm install
npm run dev
```
> The beautiful web interface is now accessible at `http://localhost:8080`

---

## 🧠 How the Memory Engine Works

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
