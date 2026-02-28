# CLAUDE.md - Clau Lessons Development Guide

## Project Overview

**Clau Lessons** is an educational web platform for primary school students (1º-3º Primaria / ages 6-8) to access learning materials, practice with exercises, and track their progress.

### Target Users
- Primary school students: 1º, 2º, and 3º Primaria (ages 6-8)
- Age-appropriate UI: simple, colorful, intuitive
- No teacher/parent dashboards (for now - student-focused)

### Core Features
1. **Student Profiles** - Local registration with name + grade level
2. **Subject Areas** - Multiple academic subjects (Math, Language, etc.)
3. **Learning Content** - Structured lessons/topics per subject
4. **Practice Exams** - Self-assessment exercises
5. **Progress Tracking** - localStorage persistence linked to student profile
6. **Subject Dashboard** - Landing page showing all available subjects/sections

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 6** - Build tool & dev server
- **Material UI 7** - Component library (@mui/material + @emotion)
- **React Router** (pending) - Client-side routing

### Data Persistence
- **localStorage** - Student profiles & progress data
- No backend/database (fully client-side for now)

### Deployment
- **Vercel** - Automatic deployment on push to main
- **URL:** https://clau-lessons.vercel.app
- **Repo:** https://github.com/ivncmp/clau-lessons

### Development Tools
- **ESLint 9** - Linting
- **Prettier 3** - Code formatting
- **Husky + lint-staged** - Pre-commit hooks
- **Vitest 3** - Testing framework (configured, no tests yet)

## Project Structure

```
clau-lessons/
├── src/
│   ├── components/         # Shared/reusable components
│   │   ├── LoginForm.tsx   # Student registration form
│   │   └── HomePage.tsx    # Authenticated landing (placeholder)
│   ├── types/              # TypeScript interfaces
│   │   └── profile.ts      # StudentProfile interface
│   ├── utils/              # Helper functions
│   │   └── storage.ts      # localStorage utilities
│   ├── App.tsx             # Root component (login/home router)
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── dist/                   # Build output (gitignored)
├── tsconfig.json           # TypeScript root config (references)
├── tsconfig.app.json       # App TypeScript config
├── tsconfig.node.json      # Vite config TypeScript
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies & scripts
```

### TypeScript Configuration
Multi-config structure (same as waveconomy):
- `tsconfig.json` - Root with references to app/node configs
- `tsconfig.app.json` - Main app source code (src/)
- `tsconfig.node.json` - Vite/build config files

## Data Models

### StudentProfile
```typescript
interface StudentProfile {
  nombre: string;        // Student name
  curso: string;         // Grade level (e.g., "1º Primaria")
  createdAt: string;     // ISO timestamp
}
```

**Storage key:** `clau_lessons_profile`

### Future Models (pending implementation)
```typescript
// Progress tracking per subject/topic
interface StudentProgress {
  studentId: string;           // Derived from nombre (for now)
  subjects: {
    [subjectId: string]: {
      completedTopics: string[];
      examScores: {
        examId: string;
        score: number;
        maxScore: number;
        completedAt: string;
      }[];
      lastAccessed: string;
    }
  };
}

// Subject/content structure
interface Subject {
  id: string;
  name: string;              // e.g., "Matemáticas"
  icon: string;              // Emoji or icon name
  color: string;             // MUI theme color
  topics: Topic[];
}

interface Topic {
  id: string;
  subjectId: string;
  title: string;
  content: string;           // HTML or Markdown
  order: number;
  exams?: Exam[];
}

interface Exam {
  id: string;
  topicId: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];        // For multiple-choice
  correctAnswer: string | number;
  explanation?: string;      // Shown after answering
}
```

## Current Implementation Status

### ✅ Completed
- [x] Project setup (React + Vite + TypeScript)
- [x] Material UI integration
- [x] Student login/registration flow
- [x] localStorage profile persistence
- [x] Basic authenticated/unauthenticated routing
- [x] Vercel deployment pipeline
- [x] TypeScript multi-config structure
- [x] ESLint + Prettier + Husky setup

### 🚧 In Progress
- [ ] Vanilla JS project migration (pending code share)

### 📋 Pending
- [ ] Feature-based folder structure (`features/`)
- [ ] Subject dashboard/landing page
- [ ] Subject content pages
- [ ] Exam/practice system
- [ ] Progress tracking implementation
- [ ] React Router integration
- [ ] Responsive design (mobile-first for tablets/iPads)
- [ ] Accessibility (WCAG AA for young students)

## Component Patterns

### Standard Component Template
```typescript
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}

export default function ComponentName({ 
  prop1, 
  prop2 = 10 
}: Readonly<ComponentNameProps>) {
  return (
    <Box>
      {prop1} - {prop2}
    </Box>
  );
}
```

**Rules:**
- Always `interface` (not `type`) for props
- Always `Readonly<Props>` wrapper
- Default exports only
- No arrow functions for components
- No `React.FC` type

### MUI Responsive Patterns
```typescript
// Responsive padding
<Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

// Responsive font-size
<Typography sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>

// Responsive layout
<Grid container spacing={{ xs: 2, md: 3 }}>
```

**Breakpoints:**
- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 960px (desktop)
- lg: 1280px (large desktop)

## Scripts

```bash
npm run dev              # Start dev server (port 5173)
npm run build            # Type-check + production build
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format
npm run format:check     # Prettier check only
npm run test             # Vitest watch mode
npm run test:ui          # Vitest UI
npm run test:run         # Vitest single run (CI)
npm run check            # Full pre-deploy check (lint+format+test+build)
```

## localStorage Utilities

### Storage API
```typescript
import { getProfile, saveProfile, clearProfile } from '@/utils/storage';

// Get current profile (returns null if not found)
const profile = getProfile();

// Save profile
saveProfile({ nombre: 'Ana', curso: '2º Primaria', createdAt: new Date().toISOString() });

// Clear profile (logout)
clearProfile();
```

## Development Workflow

### Creating New Features
1. Create feature folder: `src/features/{feature-name}/`
2. Add components: `src/features/{feature-name}/components/`
3. Add types: `src/features/{feature-name}/types/`
4. Add hooks: `src/features/{feature-name}/hooks/`
5. Export from index: `src/features/{feature-name}/index.ts`

### Git Workflow
- **Main branch:** Auto-deploys to Vercel production
- **Feature branches:** Create PR for review (manual for now)
- **Commit convention:** 
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `refactor:` - Code refactoring
  - `chore:` - Tooling/config changes
  - `docs:` - Documentation

### Pre-commit Hooks
Husky runs lint-staged automatically:
- ESLint --fix on `src/**/*.{ts,tsx}`
- Prettier --write on `src/**/*.{ts,tsx,css}`

## Design Principles

### Age-Appropriate UX
- **Large touch targets** - Buttons min 48px for small fingers
- **Simple navigation** - Max 2-3 levels deep
- **Visual feedback** - Clear success/error states
- **Colorful & fun** - Use MUI theme with bright colors
- **Icons + text** - Don't rely on text alone (some are learning to read)

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- High contrast text (WCAG AA minimum)
- Screen reader friendly

### Performance
- Code splitting by route (when React Router added)
- Lazy load heavy components
- Optimize images (WebP, responsive sizes)
- Keep bundle size < 500KB (currently 354KB)

## Migration Plan (Vanilla → React)

### Phase 1: Analysis
- [ ] Review Vanilla JS codebase
- [ ] Map subjects/topics/exams structure
- [ ] Identify reusable logic
- [ ] Document data models

### Phase 2: Architecture
- [ ] Design feature folder structure
- [ ] Define TypeScript interfaces
- [ ] Plan routing structure
- [ ] Design localStorage schema for progress

### Phase 3: Implementation
- [ ] Create subject dashboard
- [ ] Build subject detail pages
- [ ] Implement exam/question components
- [ ] Add progress tracking
- [ ] Migrate content data

### Phase 4: Polish
- [ ] Responsive design (mobile/tablet)
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] User testing with target age group

## Known Issues

### Resolved
- ✅ TypeScript build failing on Vercel (fixed with multi-config structure)
- ✅ Vercel not deploying latest changes (fixed with vercel.json + proper tsconfig)

### Active
- None

## Future Enhancements

### Near-term
- [ ] Add more grade levels (4º-6º Primaria)
- [ ] Multiple student profiles per device
- [ ] Print-friendly exam sheets
- [ ] Dark mode toggle

### Long-term
- [ ] Backend API (progress sync across devices)
- [ ] Teacher dashboard (create custom exams)
- [ ] Parent view (monitor progress)
- [ ] Gamification (badges, streaks)
- [ ] Audio support (read questions aloud for younger students)

## Resources

- **Project repo:** https://github.com/ivncmp/clau-lessons
- **Production URL:** https://clau-lessons.vercel.app
- **MUI docs:** https://mui.com/material-ui/
- **React docs:** https://react.dev
- **TypeScript handbook:** https://www.typescriptlang.org/docs/

## Notes for Claude

### Code Style Preferences
- Spanish for user-facing text (comments/docs can be English)
- Functional components only (no class components)
- Prefer composition over inheritance
- Keep components small and focused (< 200 lines)
- Extract repeated logic to custom hooks

### Deployment
- Push to `main` triggers auto-deploy
- Vercel build command: `npm run build`
- Vercel output directory: `dist`
- SPA rewrites configured in `vercel.json`

### Testing Strategy (future)
- Vitest + Testing Library for unit/component tests
- Playwright for E2E (when routing added)
- Focus on critical user flows (login, exam taking, progress saving)

---

**Last updated:** 2026-02-28  
**Project status:** Foundation complete, awaiting Vanilla JS migration  
**Next milestone:** Subject dashboard + content structure
