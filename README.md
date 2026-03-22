# 📚 Clau Lessons

> Proyecto educativo interactivo para Claudia construido con React 19, TypeScript 5.9, y Vite 6.

[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B)](https://vitest.dev/)

---

## 🎯 Propósito

**Clau Lessons** es una plataforma educativa web diseñada específicamente para que Claudia (8 años) pueda aprender de forma interactiva y divertida.

**Enfoque pedagógico:**
- ✅ Interfaz intuitiva y amigable para niños
- ✅ Lecciones gamificadas
- ✅ Progreso visual y retroalimentación positiva
- ✅ Contenido adaptado a su edad y nivel

---

## ⚡ Quick Start

### Prerrequisitos
- **Node.js** 22+ (LTS)
- **npm** 10+

### Instalación
```bash
# 1. Clonar repositorio
git clone https://github.com/ivncmp/clau-lessons.git
cd clau-lessons

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

**🎉 La app estará disponible en:** `http://localhost:5173`

---

## 🏗️ Stack Técnico

### Frontend
- **React 19** - UI library con concurrent features
- **TypeScript 5.9** - Type safety estricta
- **Vite 6** - Build tool ultra-rápido con HMR
- **Vitest 3** - Testing framework rápido
- **ESLint 9** + **Prettier** - Code quality
- **Husky** + **lint-staged** - Git hooks pre-commit

### DevOps
- **Vercel** - Deployment (auto-deploy desde `main`)

---

## 📁 Estructura del Proyecto

```
clau-lessons/
├── src/
│   ├── features/          # Features organizadas por dominio
│   │   ├── home/          # Página principal
│   │   └── [future]/      # Matemáticas, Lectura, Ciencias, etc.
│   │
│   ├── shared/            # Código compartido entre features
│   │   ├── config/        # Configuración global
│   │   ├── hooks/         # Custom hooks reutilizables
│   │   ├── layout/        # Componentes de layout (Header, Footer, etc.)
│   │   ├── types/         # TypeScript types compartidos
│   │   ├── ui/            # Componentes UI reutilizables (Button, Card, etc.)
│   │   └── utils/         # Funciones de utilidad
│   │
│   ├── test/              # Setup de testing (Vitest config, helpers)
│   │
│   ├── App.tsx            # Router + QueryClient setup
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
│
├── public/                # Archivos estáticos
├── package.json
├── vite.config.ts         # Vite config (path alias @/)
├── vitest.config.ts       # Test config
├── tsconfig.json          # TypeScript config
├── eslint.config.js       # ESLint config
├── .prettierrc            # Prettier config
└── README.md              # Este archivo
```

---

## 🎨 Arquitectura

### Feature-Based Structure

Cada **feature** es independiente y contiene todo lo necesario:

```
features/
└── matematicas/              # Ejemplo futuro
    ├── pages/                # Páginas de la feature
    │   └── MatematicasPage.tsx
    ├── components/           # Componentes específicos de la feature
    │   ├── SumaEjercicio.tsx
    │   └── RestaEjercicio.tsx
    ├── hooks/                # Custom hooks de la feature
    │   └── useEjercicios.ts
    ├── types.ts              # Types de la feature
    └── service.ts            # API calls o lógica de negocio (opcional)
```

**Regla de oro:**
- ✅ `features/X/` **puede** importar de `shared/`
- ❌ `features/X/` **NO puede** importar de `features/Y/`
- ✅ Las features son autocontenidas y reutilizables

---

### Path Alias

Usa `@/` para imports limpios:

```typescript
// ✅ Bueno
import Button from '@/shared/ui/Button';
import { useExample } from '@/features/home/hooks/useExample';

// ❌ Evitar
import Button from '../../../shared/ui/Button';
```

Configurado en:
- `vite.config.ts`
- `tsconfig.json`
- `vitest.config.ts`

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Vite dev server (port 5173)
npm run build            # Production build (con type-check)
npm run preview          # Preview production build

# Testing
npm run test             # Run tests (watch mode)
npm run test:run         # Run tests (CI mode, una sola vez)
npm run test:ui          # Open Vitest UI (visual test runner)

# Linting & Formatting
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format all files
npm run format:check     # Prettier check (sin cambiar archivos)

# Quality Check (pre-deploy)
npm run check            # Full check: lint + format + test + build
```

---

## 🧪 Testing

**Framework:** Vitest + Testing Library

### Ejecutar tests
```bash
npm run test           # Watch mode (re-run al cambiar código)
npm run test:run       # CI mode (una sola vez)
npm run test:ui        # Visual UI (browser-based)
```

### Ejemplo de test
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '@/shared/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 📝 Convenciones de Código

### Componentes
```typescript
// ✅ Patrón correcto (default export + interface Props + Readonly)
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export default function Button({ label, onClick }: Readonly<ButtonProps>) {
  return <button onClick={onClick}>{label}</button>;
}
```

**Reglas:**
- ✅ **Default export** siempre
- ✅ **Interface separada** para props
- ✅ **`Readonly<Props>`** wrapper
- ❌ **NO arrow functions** para componentes
- ❌ **NO `React.FC`**

---

### Nombres de archivos
- **Componentes:** PascalCase.tsx (`Button.tsx`, `HomePage.tsx`)
- **Hooks:** camelCase.ts con prefijo `use` (`useAuth.ts`, `useCounter.ts`)
- **Utils:** camelCase.ts (`formatDate.ts`, `apiClient.ts`)
- **Types:** camelCase.ts o PascalCase.ts (`types.ts`, `UserTypes.ts`)

---

### Custom Hooks
```typescript
import { useState, useEffect } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  
  return { count, increment, decrement };
}
```

---

## 🎯 Crear una Nueva Feature

### 1. Estructura base
```bash
mkdir -p src/features/nueva-leccion/{pages,components,hooks}
touch src/features/nueva-leccion/{types.ts,service.ts}
```

### 2. Crear página principal
```typescript
// src/features/nueva-leccion/pages/NuevaLeccionPage.tsx
export default function NuevaLeccionPage() {
  return (
    <div>
      <h1>Nueva Lección</h1>
      {/* Contenido de la lección */}
    </div>
  );
}
```

### 3. Registrar ruta en App.tsx
```typescript
import NuevaLeccionPage from '@/features/nueva-leccion/pages/NuevaLeccionPage';

// En el Router
<Route path="/nueva-leccion" element={<NuevaLeccionPage />} />
```

---

## 🚀 Deployment

### Vercel (Auto-deploy)

**Setup:**
1. Conectar repositorio GitHub a Vercel
2. Configurar proyecto:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Push a `main` → auto-deploy

**URL de producción:** TBD

---

## 🔧 Pre-commit Hooks

El proyecto usa **Husky** + **lint-staged** para ejecutar checks automáticos antes de cada commit:

**Qué se ejecuta:**
1. ESLint auto-fix en archivos staged (`.ts`, `.tsx`)
2. Prettier format en archivos staged

**Cómo funciona:**
```bash
git add .
git commit -m "feat: nueva lección"
# ⏳ Ejecuta ESLint + Prettier automáticamente
# ✅ Commit exitoso (si pasa checks)
# ❌ Commit rechazado (si hay errores)
```

---

## 🤝 Contribución

Este es un proyecto personal para Claudia. Contribuciones bienvenidas vía pull requests.

**Convención de commits:**
- `feat:` Nueva feature
- `fix:` Bug fix
- `docs:` Documentación
- `style:` Formateo
- `refactor:` Refactor de código
- `test:` Tests
- `chore:` Mantenimiento

**Ejemplo:**
```bash
git commit -m "feat: añadir lección de sumas"
git commit -m "fix: corregir validación en ejercicio"
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/...'"

**Solución:** Verificar que `vite.config.ts` y `tsconfig.json` tengan el alias configurado:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': '/src'
  }
}

// tsconfig.json
"paths": {
  "@/*": ["./src/*"]
}
```

---

### Tests no corren

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar Vitest config
npm run test:run
```

---

## 📖 Recursos

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 👨‍💻 Autor

**Iván Campillo**  
📧 ivncmp@gmail.com  
🔗 [GitHub](https://github.com/ivncmp)

---

## 💖 Dedicatoria

**Para Claudia** 👧  
_"Aprende, juega, crece. Este proyecto es para ti."_

---

**Última actualización:** 22/03/2026  
**Versión:** 1.0.0  
**Estado:** 🚧 En desarrollo
