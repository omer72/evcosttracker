# EV Cost Tracker

A web app for tracking electric vehicle charging costs. Log meter readings per car, calculate electricity costs, and view history with analytics.

**Live:** https://omer72.github.io/evcosttracker/

## Features

- Calculate charging costs from meter readings and price per kWh
- Track multiple vehicles
- Charging history with edit, CSV import/export, and PDF reports
- Yearly analytics chart
- Hebrew (RTL) and English language support
- Dark glassmorphic UI

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (auth + PostgreSQL database)
- Recharts (analytics), jsPDF (PDF export), Framer Motion (animations)

## Getting Started

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
git clone https://github.com/omer72/evcosttracker.git
cd evcosttracker
npm install
npm run dev
```

Dev server runs at `http://localhost:8080`.

### Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main`. The workflow builds the app and deploys the `dist/` folder. SPA routing is handled by a `404.html` copy of `index.html`.
