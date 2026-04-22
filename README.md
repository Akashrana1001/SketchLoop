# Collaborative Whiteboard Monorepo

A full-stack starter for a collaborative whiteboard application with a professional project layout:

- React + Vite frontend (`client`)
- Node.js + Express backend (`server`)
- Workspace-level scripts and standards for linting/formatting

## Tech Stack

- Frontend: React 18, React Router, Tailwind CSS, Vite
- Backend: Express, Helmet, CORS, Compression, Morgan
- Tooling: ESLint (flat config), Prettier, npm workspaces, concurrently

## Project Structure

```
.
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ lib/
│  │  ├─ pages/
│  │  └─ routes/
│  ├─ eslint.config.js
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ data/
│  │  ├─ middleware/
│  │  ├─ routes/
│  │  └─ services/
│  └─ eslint.config.js
├─ .editorconfig
├─ .prettierrc.json
└─ package.json
```

## Environment Variables

1. Copy and adjust these files:
   - `client/.env.example` -> `client/.env`
   - `server/.env.example` -> `server/.env`
2. Default values are ready for local development:
   - Frontend runs on `http://localhost:5173`
   - Backend runs on `http://localhost:5000`

## Install

```bash
npm install
```

## Scripts (Root)

- `npm run dev`: run frontend and backend concurrently
- `npm run build`: build client and run server build step
- `npm run start`: start backend in production mode
- `npm run lint`: lint client and server
- `npm run lint:fix`: auto-fix lint issues in both apps
- `npm run format`: format all files with Prettier
- `npm run format:check`: check formatting without changing files

## API Endpoints

- `GET /api/health`
- `GET /api/boards`
- `GET /api/boards/:roomId`
- `POST /api/boards/:roomId/snapshot`

## Scalability Notes

- Backend follows route -> controller -> service -> data boundaries.
- Frontend uses route-level pages + reusable component primitives.
- API client access is centralized for easier retries, auth, and telemetry.
- Alias-based imports (`@`) reduce fragile relative path chains.
