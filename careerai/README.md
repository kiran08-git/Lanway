# CareerAI — AI Career Guidance Platform (Hackathon Prototype)

A React + Vite frontend for an AI-powered career guidance platform aimed at Tier-2 and Tier-3 students.
This build uses **mock data only** — no backend, auth, or AI calls are wired up yet.

## User journey implemented

Landing → Login / Register → Profile → Assessment → (AI Analysis, simulated) → Career Recommendations
→ Career Details → Learning Roadmap → Opportunities → Dashboard

## Tech stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
src/
  components/
    layout/        Navbar, Footer, DashboardLayout (sidebar shell)
    ui/             Button, Card, Badge, Input, ProgressBar, StatCard
  data/
    mockData.js     All mock data — swap this for Supabase/AI calls later
  pages/
    Landing.jsx
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Profile.jsx
    Assessment.jsx
    CareerRecommendations.jsx
    CareerDetails.jsx
    LearningRoadmap.jsx
    Opportunities.jsx
  App.jsx           Routes
  main.jsx           Entry point
  index.css          Tailwind + design system utility classes
```

## Routes

| Path              | Page                    |
|--------------------|-------------------------|
| `/`                | Landing                |
| `/login`           | Login                  |
| `/register`        | Register                |
| `/dashboard`       | Dashboard               |
| `/profile`         | Profile                 |
| `/assessment`      | Assessment (3-part quiz)|
| `/careers`         | Career Recommendations  |
| `/careers/:id`     | Career Details          |
| `/roadmap/:careerId` | Learning Roadmap      |
| `/opportunities`   | Opportunities            |

## Next steps (not implemented yet, by design)

- Wire up **Supabase** for auth + storing profile/assessment data (package is already installed).
- Replace the "Analyzing…" step in Assessment with a real AI scoring call.
- Fetch `careerDetails` / `roadmapData` per career id instead of the current single mock entry (`c1`).
- Persist saved opportunities and profile edits.

## Design system notes

- Colors: `brand-blue` and `brand-purple` scales defined in `tailwind.config.js`.
- Fonts: Sora (display/headings) + Inter (body), loaded via Google Fonts in `index.html`.
- Reusable utility classes (`.btn-primary`, `.card`, `.input-field`, etc.) live in `src/index.css`.
