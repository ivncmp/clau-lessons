# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Clau Lessons** is a generic lesson engine for primary school students (1º-6º Primaria). Supports any subject via structured JSON data files. Fully client-side React app with multi-user localStorage persistence, no backend. Deployed to Vercel at https://clau-lessons.vercel.app.

## Commands

```bash
npm run dev          # Dev server (port 5173)
npm run build        # Type-check (tsc -b) + Vite production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run
npm run check        # Full check: lint + format + test + build
```

## Architecture

- **React 18 + TypeScript 5.9 + Vite 6** with **Material UI 7** (@mui/material + @emotion + @mui/icons-material)
- **React Router** — `createBrowserRouter` in `src/routes/index.tsx`
- **Path alias:** `@/` maps to `src/` (configured in vite.config.ts and tsconfig.app.json)
- **TypeScript:** Multi-config — `tsconfig.json` references `tsconfig.app.json` (src/) and `tsconfig.node.json` (Vite config)
- **MUI theme:** Extracted to `src/theme/index.ts`

### Data Flow

- **Content data:** Static JSONs in `public/data/`, loaded at runtime via `fetch()` (see `src/utils/dataLoader.ts`)
- **User data:** Multi-user localStorage under key `clau_lessons_store` (see `src/utils/storage.ts`)
- **Curriculum source material:** In `./material/` (gitignored), used to generate the JSONs in `public/data/`

### Data Schema (`public/data/`)

Hierarchy: **curso → subject → topic**. A curso determines which subjects are available (e.g. chemistry might exist in ESO but not Primaria).

```
public/data/
  cursos.json                              # Index of available cursos
  {cursoSlug}/                             # e.g. "2-primaria"
    curso.json                             # Curso metadata + subject list
    {subjectId}/
      subject.json                         # Subject metadata + topic list
      {topicId}/
        topic.json                         # Topic metadata + reading texts + SVG images
        exam.json                          # Exam questions
```

The user's curso (from their profile) is converted to a slug via `cursoToSlug()` in `src/utils/cursoSlug.ts` ("2º Primaria" → "2-primaria") and used to resolve the data path. Curso is NOT in the URL — it's implicit from the logged-in user.

### Question Types (discriminated union in `src/types/data.ts`)

| Type | Key Properties |
|---|---|
| `choice` | `options: string[]`, `answer: number` |
| `true-false` | `answer: boolean` |
| `matching` | `pairs: {left, right}[]` |
| `word-bank-classify` | `words: string[]`, `slots: {label, accepts[]}[]` |
| `word-bank-fill` | `sentence` (with `_____`), `blanks: string[]`, `wordBank: string[]` |
| `word-bank-order` | `words: string[]`, `answer: string` |

All extend `QuestionBase`: `id, emoji, question, refText?, image?, explanation?`

### Routing

```
/login                                          → LoginPage (user selection/creation)
/dashboard                                      → DashboardPage (subject grid)
/subject/:subjectId                             → SubjectPage (topic list)
/subject/:subjectId/topic/:topicId/lesson       → TopicPage (reading + exam CTA)
/subject/:subjectId/topic/:topicId/exam         → ExamPage (full-screen, no nav)
/progress                                       → ProgressPage (stats + export/import)
```

### Feature Structure (`src/features/`)

```
src/features/
  auth/          # useAuth context, LoginPage, AuthGuard
  dashboard/     # DashboardPage, SubjectCard
  subject/       # SubjectPage, TopicCard
  topic/         # TopicPage, ReadingTextModal
  exam/          # ExamPage, useExam reducer, question components
  progress/      # ProgressPage, ExportImport
```

### Multi-user Storage

```typescript
AppStore { version: 1, activeUserId, users: Record<id, { profile, progress }> }
```

- N users per device, each with independent progress
- Export/import progress as JSON file
- Auto-migration from legacy single-user schema (`clau_lessons_profile`)

## Code Conventions

- **Props:** Always `interface` (not `type`), always wrapped with `Readonly<Props>`
- **Components:** Function declarations with `export default` (no arrow functions, no `React.FC`)
- **Language:** Spanish for all user-facing text; English for code comments and docs
- **File naming:** PascalCase for components, camelCase for utils/hooks
- **Feature structure:** `src/features/{name}/` with `components/`, `hooks/`

## Pre-commit Hooks

Husky + lint-staged runs automatically on commit:
- ESLint --fix on `src/**/*.{ts,tsx}`
- Prettier --write on `src/**/*.{ts,tsx,css}`

## Deployment

Push to `main` triggers auto-deploy to Vercel. SPA rewrites configured in vercel.json.
