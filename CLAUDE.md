# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

## Architecture

EV Cost Tracker — a React SPA for tracking electric vehicle charging costs. Users log meter readings per car, calculate costs, and view history/analytics.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase (auth + PostgreSQL)

**Routing:** React Router v6 with `basename="/evcosttracker"` (deployed to GitHub Pages subdirectory). Three routes: `/` (dashboard), `/login`, `/settings`. `ProtectedRoute` wraps authenticated pages.

**Backend:** Supabase direct client queries (no API layer). Tables: `profiles`, `cars`, `charging_history`, `additional_charges`. Row Level Security enabled. Auth via email/password with auto-profile creation on signup.

**i18n:** Custom Context-based system (`src/i18n/`). Hebrew (default, RTL) and English. Use `useLanguage()` hook → `t("key")` for translations. Keys defined in `translations.ts`.

**Key component trees:**
- `Calculator` → `CarSelector`, `MeterReadings`, `AdditionalCharges`, `CalculationResultDialog`
- `History` → `HistoryTable`, `EditHistoryDialog`, `ExportButtons`, `YearlyChart`

**UI patterns:** Dark theme with glassmorphic styling. Custom CSS utilities in `src/index.css`: `.glass-card`, `.neo-blur`, `.text-gradient`, `.futuristic-gradient`. Purple primary (#9b87f5).

## Conventions

- Import paths use `@/` alias (maps to `src/`)
- Components: PascalCase files. Hooks/utils: camelCase
- shadcn/ui components live in `src/components/ui/` — 60+ pre-built
- Toast notifications via Sonner for user feedback
- Data flow: handler → `supabase.from().select/insert/update/delete()` → toast → state update
- TypeScript is configured with loose checking (no strict mode in tsconfig.app.json)

## Deployment

GitHub Actions workflow (`.github/workflows/static.yml`) builds and deploys to GitHub Pages on push to `main`. SPA routing handled by copying `index.html` to `404.html`. Secrets needed: `GEMINI_API_KEY`, `VITE_FORMSPREE_FORM_ID`, `VITE_TURNSTILE_SITE_KEY`.
