# Clau Lessons

Proyecto educativo para Claudia construido con React + TypeScript + Vite.

## Stack Técnico

- **React 18** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 6** - Build tool
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality
- **Husky + lint-staged** - Git hooks

## Estructura del Proyecto

```
src/
├── features/          # Features organizadas por dominio
│   └── home/         # Feature: Home
├── shared/           # Código compartido
│   ├── config/      # Configuración
│   ├── hooks/       # Custom hooks
│   ├── layout/      # Componentes de layout
│   ├── types/       # Types compartidos
│   ├── ui/          # Componentes UI reutilizables
│   └── utils/       # Utilidades
└── test/            # Setup de testing
```

## Setup

```bash
npm install
npm run dev
```

## Scripts Disponibles

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting
npm run test          # Run tests (watch mode)
npm run test:run      # Run tests (CI mode)
npm run test:ui       # Open Vitest UI
npm run check         # Full check (lint + format + test + build)
```

## Desarrollo

- **Patrón de features:** Cada feature es independiente y contiene sus propios componentes, hooks, types, etc.
- **Path alias:** `@/` apunta a `src/`
- **Testing:** Vitest + Testing Library
- **Pre-commit hooks:** ESLint + Prettier automático via Husky

## Convenciones

- Componentes: PascalCase, default export
- Archivos: kebab-case.tsx
- Types: PascalCase interfaces
- Hooks: camelCase starting with `use`
- Utils: camelCase functions

---

**Autor:** Iván Campillo  
**Para:** Claudia
