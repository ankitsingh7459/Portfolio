# Ankit Singh — Portfolio Platform

Personal portfolio and developer platform for Ankit Singh, [FILL: title]. Built with the "Warm Terminal" aesthetic (amber on charcoal, monospace prompt styling, and high-signal proof of work).

## Architecture & Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Framer Motion, React Router. Deployed on [Vercel](https://vercel.com).
- **Backend:** Node.js, Express, MySQL, JWT. Deployed on [Render](https://render.com).
- **Documentation:** Complete architectural specifications, design tokens, and decision records are maintained in [`docs/`](./docs/).

## Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8+

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
npm install
npm run dev
```
API runs locally at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```
Frontend runs locally at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `FRONTEND_URL` | CORS allowed origin |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL database connection |
| `JWT_SECRET` | Signing key for admin authentication |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin login credentials |
| `APPWRITE_*` | Optional storage configuration |
| `GITHUB_USERNAME` | GitHub activity stats integration |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | Service health check |
| GET | `/api/profile` | Public | Profile data |
| GET | `/api/skills` | Public | Skills data |
| GET | `/api/projects` | Public | Project listings |
| POST | `/api/projects` | JWT | Create new project |
| PUT | `/api/projects/:id` | JWT | Update existing project |
| DELETE | `/api/projects/:id` | JWT | Remove project |
| GET | `/api/certifications` | Public | Certifications list |
| POST | `/api/certifications` | JWT | Add certification |
| POST | `/api/contact` | Public | Submit message via contact form |
| POST | `/api/analytics/track` | Public | Log visit event |
| GET | `/api/analytics/stats` | Public | Analytics dashboard summary |
| GET | `/api/analytics/github` | Public | Cached GitHub activity data |
| POST | `/api/auth/login` | Public | Admin authentication |

## Scripts

### Frontend (`frontend/`)
- `npm run dev`: Start Vite development server
- `npm run build`: Build production bundle
- `npm run lint`: Run ESLint checks
- `npm run preview`: Preview production build locally
- `npm test`: Unit test suite (Vitest, configured in Phase 7)
- `npm run test:e2e`: Playwright E2E suite (configured in Phase 9)

### Backend (`backend/`)
- `npm run dev`: Start Express API with nodemon
- `npm start`: Start production server

## Deployment

- **Frontend (Vercel):** Connect repository, set root directory to `frontend/`, configure `VITE_API_URL`, deploy.
- **Backend (Render):** Web service connected to repository root `backend/`, build command `npm install`, start command `npm start`, configure environment variables.

## Project Documentation
Detailed specifications and implementation guides are available in the [`docs/`](./docs/) directory:
- [Product Requirements (PRD)](./docs/PRD.md)
- [Architecture & Boundaries](./docs/ARCHITECTURE.md)
- [Design System & Tokens](./docs/DESIGN.md)
- [Architecture Decisions (ADRs)](./docs/DECISIONS.md)
- [Test Plan](./docs/TEST_PLAN.md)
- [Security Requirements](./docs/SECURITY.md)
- [Development Rules](./RULES.md)
- [Task Tracking](./TASKS.md)
- [Project Memory & Baselines](./docs/MEMORY.md)
