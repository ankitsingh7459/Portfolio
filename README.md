<<<<<<< HEAD
# Portfolio
Know Ankit Singh
=======
# Ankit Singh — Premium Portfolio Platform

Production-grade full-stack personal portfolio with AI chatbot, interactive skill galaxy, terminal mode, visitor analytics, and dynamic content management.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Framer Motion, React Three Fiber, Axios |
| Backend | Node.js, Express, MySQL, JWT, Appwrite (optional) |
| Deploy | Vercel (frontend), Render (backend) |

## Project Structure

```
Portfolio/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/   # UI sections & effects
│   │   ├── pages/        # Home, Admin
│   │   ├── hooks/        # Scroll, keyboard, easter egg
│   │   ├── services/     # API client
│   │   ├── context/      # Theme + access mode
│   │   └── utils/        # Chatbot & terminal data
│   └── public/           # SEO, resume, assets
├── backend/
│   ├── controllers/      # Route handlers
│   ├── routes/           # REST endpoints
│   ├── middleware/       # Auth, validation, rate limit
│   ├── config/           # MySQL, Appwrite
│   └── database/         # schema.sql
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+
- (Optional) Appwrite account for file storage

### 1. Database Setup

```bash
mysql -u root -p < backend/database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `FRONTEND_URL` | CORS origin |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `JWT_SECRET` | JWT signing key |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin login credentials |
| `APPWRITE_*` | Optional file storage |
| `GITHUB_USERNAME` | GitHub activity widget |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/profile` | No | Profile data |
| GET | `/api/skills` | No | Skills list |
| GET | `/api/projects` | No | Projects list |
| POST | `/api/projects` | JWT | Create project |
| PUT | `/api/projects/:id` | JWT | Update project |
| DELETE | `/api/projects/:id` | JWT | Delete project |
| GET | `/api/certifications` | No | Certifications |
| POST | `/api/certifications` | JWT | Add certification |
| POST | `/api/contact` | No | Submit contact form |
| POST | `/api/analytics/track` | No | Track visitor |
| GET | `/api/analytics/stats` | No | Visitor dashboard |
| GET | `/api/analytics/github` | No | GitHub activity |
| POST | `/api/auth/login` | No | Admin login |

## Appwrite Setup (Optional)

1. Create project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a Storage bucket named `portfolio_assets`
3. Add API key with storage read/write permissions
4. Set `APPWRITE_*` variables in backend `.env`

Use Appwrite for resume uploads, project images, and certificate files.

## Deployment

### Frontend — Vercel

1. Push repo to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Environment: `VITE_API_URL=https://your-api.onrender.com/api`
5. Deploy

### Backend — Render

1. Create Web Service at [render.com](https://render.com)
2. Connect repo, set root to `backend`
3. Build: `npm install` | Start: `npm start`
4. Add all environment variables from `.env.example`
5. Use Render's MySQL or external database host

### Resume

Place your resume at `frontend/public/resume.pdf` for the download button.

## Features

- **Hero** — Animated intro, profile photo, CTA buttons
- **Skill Galaxy** — Orbital interactive skill visualization
- **Dynamic Projects** — CRUD via admin panel at `/admin`
- **AI Chatbot** — "Ask Ankit" with contextual responses
- **Terminal Mode** — `Ctrl+`` ` for developer terminal
- **Easter Egg** — Konami code → ACCESS GRANTED mode
- **Visitor Analytics** — Live visitor and section stats
- **GitHub Activity** — Repos and profile stats
- **Dark/Light Theme** — `Ctrl+D` toggle
- **Keyboard Shortcuts** — `/` chat, `` Ctrl+` `` terminal

## Admin Panel

Visit `/admin` to login and manage projects. Uses JWT from `POST /api/auth/login`.

## Security

- JWT authentication for write operations
- Rate limiting (API, contact, auth)
- Input validation via express-validator
- Helmet security headers
- Environment-based secrets

## Future Scalability

- Add Redis caching for analytics and GitHub data
- WebSocket for real-time visitor count
- CMS integration for blog posts
- CI/CD with GitHub Actions
- CDN for static assets via CloudFront
- Multi-language i18n support
- AI chatbot powered by OpenAI API

## Author

**Ankit Singh** — AI/ML Engineer | Vibe Coder | Tech Enthusiast
>>>>>>> 8a1bf2b (Initial commit)
