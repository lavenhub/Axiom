# Axiom - AI Memory Engine for Cities

Axiom is a production-ready AI-powered municipal infrastructure management system. Every repair becomes permanent institutional memory, making cities smarter over time.

## Features

- 🧠 **Memory Engine**: Stores every issue and repair as searchable, AI-augmented memory
- 🔍 **Semantic Search**: Uses OpenAI embeddings and pgvector to find similar historical issues
- 🤖 **AI Analysis**: Automatically categorizes issues, determines severity, and identifies root causes
- 📊 **Predictions**: Predicts infrastructure failures based on historical data
- 📈 **Analytics**: Real-time dashboards showing infrastructure health, repair success, and more
- 🗺️ **Knowledge Graph**: Connects related memories for deeper insights

## Tech Stack

### Frontend
- React 19 + TypeScript
- TanStack Router (file-based routing)
- Tailwind CSS 4
- Framer Motion

### Backend
- Express.js + TypeScript
- Prisma ORM
- PostgreSQL with pgvector
- OpenAI API (embeddings + completions)
- Redis (optional, for caching)

## Project Structure

```
axiom/
├── frontend/          # React frontend (existing)
├── backend/           # Express API backend
│   ├── src/
│   │   ├── config/    # Prisma, OpenAI, logger config
│   │   ├── routes/    # API routes
│   │   └── services/  # Core business logic
│   └── prisma/        # Prisma schema + seed
└── packages/          # Shared types (coming soon)
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (with pgvector extension)
- OpenAI API key

### Backend Setup

1. **Navigate to backend**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
Edit `backend/.env` and set your database URL and OpenAI API key.

4. **Set up database**:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. **Start backend server**:
```bash
npm run dev
```
Backend runs on http://localhost:3001

### Frontend Setup

1. **Navigate to frontend**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start frontend server**:
```bash
npm run dev
```
Frontend runs on http://localhost:8080

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | /api/health | Health check |
| GET    | /api/issues | Get all issues |
| POST   | /api/issues | Create new issue |
| GET    | /api/issues/:id | Get issue by ID |
| GET    | /api/memories | Get all memories |
| GET    | /api/memories/:id | Get memory by ID |
| POST   | /api/ai/ask | Ask Axiom a question |
| GET    | /api/predictions | Get predictions |
| GET    | /api/analytics/dashboard | Dashboard stats |
| POST   | /api/repairs | Create repair |
| PUT    | /api/repairs/:id | Update repair |

## Core Concepts

### Memory Engine Flow
1. Citizen reports issue (text + optional media)
2. AI analyzes issue and generates embedding
3. System searches for similar historical memories
4. AI suggests root causes and best repair methods
5. Engineer performs repair
6. Outcome stored as permanent memory
7. System retrains prediction models

## License

MIT
