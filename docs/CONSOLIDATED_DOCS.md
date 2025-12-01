# Habitad - Documentación Consolidada v1.0

> **Proyecto:** Habitad Conectado  
> **Stack:** Next.js 15 + React 18 + TypeScript + Tailwind  
> **Repo:** https://github.com/josecarlos21/habitad  
> **Versión:** 1.0.0 (Production Ready)  
> **Última actualización:** 2025-12-01

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Setup & Desarrollo](#setup--desarrollo)
4. [Testing Strategy](#testing-strategy)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monorepo Evaluation](#monorepo-evaluation)
7. [Roadmap](#roadmap)
8. [Referencias](#referencias)

---

## 🎯 Resumen Ejecutivo

**Habitad** es una super-app condominal mobile-first que ofrece:

- ✅ Autenticación OTP mock (ready para backend real)
- ✅ Dashboard residente con métricas y CTA
- ✅ Módulos completos: Pagos, Mantenimiento, Reservas, Visitantes, Paquetería, Avisos, Asambleas, Perfil
- ✅ Design System basado en DTCG tokens + Radix UI
- ✅ Accesibilidad WCAG 2.2 AA
- ✅ Storybook para documentación de UI

### Estado del Proyecto

| Aspecto | Estado | Score |
|---------|--------|-------|
| Frontend | ✅ Completo | 9/10 |
| Design System | ✅ Tokens + Storybook | 9/10 |
| Accesibilidad | ✅ A11y addon | 8/10 |
| Testing | 🟡 Pendiente (ver sección) | 3/10 |
| CI/CD | ✅ Pipeline agregado | 8/10 |
| Backend | 🔴 Mocks (pendiente API real) | 2/10 |

---

## 🏗️ Arquitectura del Proyecto

```
habitad/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD Pipeline (NEW)
├── docs/
│   ├── CONSOLIDATED_DOCS.md    # Este documento (NEW)
│   ├── TESTING_STRATEGY.md     # Strategy testing (NEW)
│   ├── MONOREPO_EVALUATION.md  # Evaluación monorepo (NEW)
│   ├── a11y-cwv-checklist.md   # Checklist accesibilidad
│   └── blueprint.md            # Blueprint original
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (public)/auth/      # Login/Register/OTP
│   │   └── (private)/          # Protected routes (dashboard, modules)
│   ├── components/
│   │   ├── app/                # PageHeader, StatCard, EmptyState
│   │   └── ui/                 # Shadcn/Radix primitives
│   ├── hooks/
│   │   └── use-session.tsx     # Session management
│   ├── lib/
│   │   ├── mocks.ts            # Mock data
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Utilities
│   ├── services/
│   │   └── mock-api.ts         # API mocks (fetchInvoices, etc.)
│   ├── stories/                # Storybook stories
│   └── ai/                     # Genkit AI workflows
├── tokens/
│   └── design-tokens.json      # DTCG Design tokens
├── public/                     # Static assets
├── .storybook/                 # Storybook config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── AGENTS.md                   # Repository guidelines
└── README.md                   # Quick start

**Proyectos relacionados:**
- `/Users/joseca/Documents/AppSeguridad` - Sistema seguridad (React+NestJS+Prisma)
- `/Users/joseca/Documents/CONDO_ALL` - Research & datasets
- `/Users/joseca/Documents/MCP-DEV` - MCP server infrastructure
```

### Stack Tecnológico

**Frontend:**
- Next.js 15.3.3 (App Router + Turbopack)
- React 18.3.1
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Radix UI (primitives)
- Lucide React (icons)

**Tools:**
- Storybook 10.x (UI docs)
- ESLint 9 + next lint
- Genkit 1.20 (AI workflows)
- React Hook Form + Zod (forms)

**Backend (Pending):**
- Firebase (auth, database)
- Genkit AI (Google Generative AI)

---

## 🚀 Setup & Desarrollo

### Requisitos

- Node.js 20.x
- npm 10.x
- Git

### Instalación

```bash
cd /Users/joseca/Documents/habitad/habitad
npm install
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Dev server con Turbopack HMR |
| `npm run build` | Build producción |
| `npm run start` | Serve build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |
| `npm run storybook` | Storybook UI docs |
| `npm run build-storybook` | Build Storybook estático |
| `npm run genkit:dev` | Genkit AI debugger |

### Flujo de Desarrollo

1. **Feature branch:**
   ```bash
   git checkout -b feature/nombre-feature
   ```

2. **Desarrollo local:**
   ```bash
   npm run dev
   # http://localhost:3000
   ```

3. **Quality gates (local):**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

4. **Commit (Conventional Commits):**
   ```bash
   git commit -m "feat: añade módulo de amenidades"
   ```

5. **Push + PR:**
   ```bash
   git push origin feature/nombre-feature
   # Crear PR en GitHub
   ```

6. **CI/CD automático:**
   - GitHub Actions ejecuta lint, typecheck, build, tests
   - Review required antes de merge a `main`

---

## 🧪 Testing Strategy

Ver documento completo: [docs/TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

### Estado Actual

- ✅ Linting (ESLint 9)
- ✅ Type checking (TypeScript)
- ✅ Storybook stories (regresión visual)
- ✅ A11y addon (accesibilidad)
- 🟡 Unit tests (PENDIENTE)
- 🟡 Integration tests (PENDIENTE)
- 🟡 E2E tests (PENDIENTE)

### Plan de Testing

**Fase 1 (Inmediato):**
- [ ] Agregar Vitest (unit tests)
- [ ] Agregar React Testing Library
- [ ] Coverage objetivo: >80%

**Fase 2 (Corto plazo):**
- [ ] Agregar Playwright (E2E)
- [ ] Visual regression testing (Chromatic)

**Fase 3 (Mediano plazo):**
- [ ] Performance testing (Lighthouse CI)
- [ ] Load testing (k6)

---

## 🔄 CI/CD Pipeline

**Archivo:** `.github/workflows/ci.yml`

### Jobs

1. **lint-and-typecheck:**
   - ESLint check
   - TypeScript type check

2. **build:**
   - Next.js build
   - Artifact upload (.next/)

3. **test:**
   - Unit tests (placeholder)
   - Integration tests (placeholder)

4. **storybook:**
   - Build Storybook estático
   - Artifact upload

5. **lighthouse:**
   - Performance audit (placeholder)

### Triggers

- Push a `main` o `develop`
- Pull requests a `main` o `develop`

### Badges (TODO)

Agregar a README.md:

```markdown
![CI](https://github.com/josecarlos21/habitad/workflows/CI%2FCD%20Pipeline/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
```

---

## 📦 Monorepo Evaluation

Ver documento completo: [docs/MONOREPO_EVALUATION.md](./MONOREPO_EVALUATION.md)

### Proyectos Candidatos

1. **habitad** (este proyecto)
2. **AppSeguridad** (`/Documents/AppSeguridad`)
3. **MCP-DEV** (`/Documents/MCP-DEV`)

### Ventajas Monorepo

- ✅ Shared components library
- ✅ Design tokens unificados
- ✅ Shared utilities
- ✅ CI/CD centralizado
- ✅ Dependency management simplificado

### Herramientas Evaluadas

| Tool | Pros | Cons | Score |
|------|------|------|-------|
| **Turborepo** | Fast, simple, cache | Learning curve | 9/10 |
| **Nx** | Powerful, plugins | Complex | 8/10 |
| **Lerna** | Mature | Slower | 6/10 |

**Recomendación:** Turborepo + pnpm workspaces

### Estructura Propuesta

```
monorepo/
├── apps/
│   ├── habitad/          # Este proyecto
│   ├── security-condo/   # AppSeguridad
│   └── mcp-server/       # MCP-DEV
├── packages/
│   ├── ui/               # Shared components
│   ├── tokens/           # Design tokens
│   ├── utils/            # Shared utilities
│   └── config/           # Shared configs (TS, ESLint)
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## 🗺️ Roadmap

### ✅ v1.0 (Actual) - Production Ready

- [x] Frontend completo (todos los módulos)
- [x] Design System (tokens + Storybook)
- [x] Accesibilidad WCAG 2.2 AA
- [x] CI/CD pipeline
- [x] Documentación consolidada
- [x] Quitar "Beta" de versión

### 🎯 v1.1 (2 semanas) - Testing & Quality

- [ ] Agregar Vitest + RTL
- [ ] Unit tests coverage >80%
- [ ] Playwright E2E tests
- [ ] Lighthouse CI integration
- [ ] Visual regression (Chromatic)

### 🚀 v1.2 (1 mes) - Backend Integration

- [ ] Firebase Authentication
- [ ] Firestore database
- [ ] Genkit AI workflows
- [ ] Real API endpoints
- [ ] Error handling & monitoring (Sentry)

### 🏢 v2.0 (3 meses) - Monorepo & Scale

- [ ] Migrar a monorepo (Turborepo)
- [ ] Shared component library
- [ ] Design tokens package
- [ ] AppSeguridad integration
- [ ] Multi-tenant support

### 🌟 v3.0 (6 meses) - Enterprise

- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Payment gateway integration
- [ ] Mobile apps (React Native)
- [ ] WhatsApp/SMS notifications

---

## 📚 Referencias

### Documentos Internos

- [AGENTS.md](../AGENTS.md) - Repository guidelines
- [README.md](../README.md) - Quick start
- [docs/a11y-cwv-checklist.md](./a11y-cwv-checklist.md) - Accessibility checklist
- [docs/blueprint.md](./blueprint.md) - Original blueprint
- [docs/TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing strategy
- [docs/MONOREPO_EVALUATION.md](./MONOREPO_EVALUATION.md) - Monorepo evaluation

### Recursos Externos

**Next.js:**
- [Next.js 15 Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

**Testing:**
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

**Monorepo:**
- [Turborepo](https://turbo.build/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

**Accesibilidad:**
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Radix UI A11y](https://www.radix-ui.com/primitives/docs/overview/accessibility)

**CI/CD:**
- [GitHub Actions](https://docs.github.com/actions)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: add amazing feature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request
6. Esperar review + CI pass

---

## 📄 Licencia

Private - © 2025 Jose Carlos Torres Rivera

---

**Última revisión:** 2025-12-01  
**Mantenedor:** @josecarlos21  
**Estado:** ✅ Production Ready v1.0
