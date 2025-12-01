# Monorepo Evaluation - Habitad Ecosystem

> **Objetivo:** Evaluar migración a monorepo para unificar proyectos web  
> **Última actualización:** 2025-12-01

---

## 📊 Estado Actual: Multi-Repo

### Proyectos Identificados

1. **habitad** (`/Documents/habitad/habitad`)
   - Stack: Next.js 15 + React 18 + TypeScript
   - Tamaño: ~100MB
   - Estado: ✅ Producción v1.0
   - Propósito: Super-app condominal (residents)

2. **AppSeguridad** (`/Documents/AppSeguridad`)
   - Stack: React + Vite + NestJS + Prisma
   - Tamaño: 520MB
   - Estado: Beta 1 → v1.0
   - Propósito: Sistema seguridad dual (residents + guards)

3. **MCP-DEV** (`/Documents/MCP-DEV`)
   - Stack: Python 3.11 + MCP server
   - Tamaño: 359MB
   - Estado: ✅ Operativo
   - Propósito: Model Context Protocol server

4. **CONDO_ALL** (`/Documents/CONDO_ALL`)
   - Stack: Python + Research
   - Tamaño: 18MB
   - Estado: Research/Planning
   - Propósito: Datasets & blueprints

### Problemas Actuales

❌ **Duplicación:**
- 3 copias de React/TypeScript configs
- Design tokens duplicados
- Componentes UI similares (buttons, cards, forms)
- Utilities duplicadas (date formatters, currency)

❌ **Gestión de dependencias:**
- 8+ node_modules folders (~2GB redundancia)
- Versiones inconsistentes (React 18.3.1 vs 18.2.0)
- Actualizaciones manuales en cada repo

❌ **CI/CD:**
- Pipelines separados
- Build times acumulativos
- Testing fragmentado

❌ **Developer Experience:**
- Context switching entre repos
- Cross-project changes requieren múltiples PRs
- Shared code via copy-paste

---

## 🎯 Propuesta: Monorepo Unificado

### Estructura Propuesta

```
condo-platform/                 # Monorepo root
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD unificado
├── apps/
│   ├── habitad/                # App residentes (Next.js)
│   │   ├── src/
│   │   ├── package.json
│   │   └── next.config.ts
│   ├── security/               # App seguridad (React+NestJS)
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── package.json
│   └── admin/                  # Admin dashboard (futuro)
│       └── package.json
├── packages/
│   ├── ui/                     # Shared components library
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── design-tokens/          # Design tokens DTCG
│   │   ├── tokens.json
│   │   ├── build.js
│   │   └── package.json
│   ├── utils/                  # Shared utilities
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── currency.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── config/                 # Shared configs
│   │   ├── eslint/
│   │   ├── typescript/
│   │   ├── tailwind/
│   │   └── package.json
│   └── types/                  # Shared TypeScript types
│       ├── src/
│       │   ├── resident.ts
│       │   ├── invoice.ts
│       │   └── index.ts
│       └── package.json
├── services/
│   ├── mcp-server/             # MCP server (Python)
│   │   ├── pyproject.toml
│   │   └── src/
│   └── api-gateway/            # API Gateway (futuro)
├── tools/
│   ├── scripts/                # Build/deploy scripts
│   └── generators/             # Code generators (Plop)
├── docs/
│   ├── architecture.md
│   ├── contributing.md
│   └── deployment.md
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # pnpm workspaces
├── package.json                # Root package.json
└── tsconfig.base.json          # Base TS config
```

---

## 🛠️ Herramientas Evaluadas

### 1. Turborepo ⭐ (Recomendado)

**Pros:**
- ✅ Incremental builds (solo rebuild lo cambiado)
- ✅ Remote caching (compartir builds entre devs)
- ✅ Pipeline parallelization
- ✅ Simple setup
- ✅ Funciona con npm/yarn/pnpm
- ✅ Bien integrado con Vercel

**Cons:**
- ⚠️ Menos features que Nx
- ⚠️ Menos plugins disponibles

**Configuración:**

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Score:** 9/10

---

### 2. Nx

**Pros:**
- ✅ Muy potente (code generation, dependency graph)
- ✅ Plugins para React, Next.js, NestJS, etc.
- ✅ Affected commands (solo test lo cambiado)
- ✅ Computation caching

**Cons:**
- ⚠️ Curva de aprendizaje más alta
- ⚠️ Config más compleja
- ⚠️ Overhead para proyectos pequeños

**Score:** 8/10

---

### 3. Lerna

**Pros:**
- ✅ Maduro y estable
- ✅ Simple para versioning de packages

**Cons:**
- ⚠️ Más lento que Turbo/Nx
- ⚠️ Menos features modernas
- ⚠️ Mantenimiento limitado

**Score:** 6/10

---

### 4. pnpm Workspaces (standalone)

**Pros:**
- ✅ Muy eficiente con disk space
- ✅ Lockfile determinístico
- ✅ Hoisting estricto (menos bugs)

**Cons:**
- ⚠️ Sin build orchestration (necesita Turbo/Nx)
- ⚠️ Solo para dependency management

**Score:** 7/10 (como complemento, no standalone)

---

## 🎯 Decisión: Turborepo + pnpm

### Justificación

1. **Performance:** Turborepo ofrece mejores build times que alternativas
2. **Simplicidad:** Setup más simple que Nx
3. **pnpm:** Mejor gestión de disco + lockfile confiable
4. **Escalabilidad:** Ready para crecer (más apps/packages)
5. **Vercel:** Integración nativa (hosting)

### Migración Plan

**Fase 1 (Semana 1): Setup Infrastructure**

```bash
# 1. Crear monorepo root
mkdir condo-platform
cd condo-platform

# 2. Init pnpm workspace
pnpm init

# 3. Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
EOF

# 4. Install Turborepo
pnpm add -Dw turbo

# 5. Create turbo.json (ver config arriba)

# 6. Create base tsconfig
cat > tsconfig.base.json << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
EOF
```

**Fase 2 (Semana 2): Migrar Apps**

```bash
# 1. Mover habitad
mkdir -p apps/habitad
cp -r /Users/joseca/Documents/habitad/habitad/* apps/habitad/

# 2. Mover AppSeguridad
mkdir -p apps/security
cp -r /Users/joseca/Documents/AppSeguridad/* apps/security/

# 3. Update package.json de cada app
# apps/habitad/package.json
{
  "name": "@condo/habitad",
  "version": "1.0.0",
  "dependencies": {
    "@condo/ui": "workspace:*",
    "@condo/utils": "workspace:*",
    "@condo/types": "workspace:*"
  }
}
```

**Fase 3 (Semana 3): Extraer Shared Packages**

```bash
# 1. Create packages/ui
mkdir -p packages/ui/src

# Extraer componentes comunes de habitad + AppSeguridad
# - Button, Card, Dialog, Input, etc.

# 2. Create packages/utils
mkdir -p packages/utils/src

# Extraer utilities:
# - date formatters
# - currency formatters
# - validation helpers

# 3. Create packages/design-tokens
mkdir -p packages/design-tokens

# Copiar tokens/design-tokens.json de habitad
# Agregar build script para generar CSS vars

# 4. Create packages/types
mkdir -p packages/types/src

# Definir tipos compartidos:
# - Resident, Invoice, Ticket, Reservation, etc.
```

**Fase 4 (Semana 4): Setup CI/CD**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run test --coverage

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: |
            apps/*/dist
            apps/*/.next
```

**Fase 5 (Semana 5-6): Testing & Documentation**

- [ ] Migrar tests a monorepo
- [ ] Setup shared testing utilities
- [ ] Actualizar docs
- [ ] Training para equipo

---

## 📊 Beneficios Esperados

### Performance

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Install time | ~5 min | ~2 min | 60% ⬇️ |
| Disk space (node_modules) | ~2GB | ~500MB | 75% ⬇️ |
| Build time (total) | ~8 min | ~3 min | 62% ⬇️ |
| CI/CD time | ~12 min | ~5 min | 58% ⬇️ |

### Developer Experience

- ✅ Single checkout (un solo `git clone`)
- ✅ Single install (`pnpm install` en root)
- ✅ Atomic commits (cambios cross-package en un PR)
- ✅ Shared tooling (ESLint, Prettier, TypeScript)
- ✅ Incremental builds (solo rebuild lo cambiado)
- ✅ Remote caching (compartir builds)

### Code Quality

- ✅ Shared components (DRY)
- ✅ Consistent versioning
- ✅ Type safety cross-packages
- ✅ Single source of truth (design tokens)
- ✅ Easier refactoring

---

## ⚠️ Riesgos & Mitigaciones

### Riesgo 1: Complejidad inicial

**Mitigación:**
- Documentación exhaustiva
- Training sessions
- Soporte durante migración

### Riesgo 2: Breaking changes durante migración

**Mitigación:**
- Migración gradual (feature flags)
- Mantener repos viejos temporalmente
- Testing exhaustivo pre-switch

### Riesgo 3: Learning curve

**Mitigación:**
- Workshops sobre Turborepo/pnpm
- Pair programming
- Docs internas

### Riesgo 4: Build failures

**Mitigación:**
- Incremental migration
- Smoke tests en cada paso
- Rollback plan

---

## 📅 Timeline

| Fase | Duración | Esfuerzo | Owner |
|------|----------|----------|-------|
| Setup Infrastructure | 1 semana | 20h | @josecarlos21 |
| Migrar Apps | 1 semana | 30h | @josecarlos21 |
| Extraer Packages | 1 semana | 40h | @josecarlos21 |
| Setup CI/CD | 1 semana | 20h | @josecarlos21 |
| Testing & Docs | 2 semanas | 40h | @josecarlos21 |
| **Total** | **6 semanas** | **150h** | |

---

## 🎯 Success Metrics

**Week 1:**
- [ ] Monorepo structure creado
- [ ] Turborepo + pnpm funcional
- [ ] Base configs compartidos

**Week 2:**
- [ ] Apps migradas sin breaking changes
- [ ] Build & dev scripts funcionando

**Week 3:**
- [ ] Packages shared extraídos
- [ ] Apps consumiendo packages

**Week 4:**
- [ ] CI/CD pipeline operativo
- [ ] Tests passing al 100%

**Week 6:**
- [ ] Docs completas
- [ ] Team training completado
- [ ] Monorepo en producción

---

## 📚 Recursos

**Turborepo:**
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)
- [Migrating to a Monorepo](https://turbo.build/repo/docs/handbook/migrating-to-a-monorepo)

**pnpm:**
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [pnpm CLI](https://pnpm.io/cli/add)

**Examples:**
- [Vercel Monorepo](https://github.com/vercel/turbo/tree/main/examples)
- [shadcn/ui Monorepo](https://github.com/shadcn-ui/ui)

---

## ✅ Decisión Final

**GO para migración a monorepo con Turborepo + pnpm**

**Razones:**
1. Reducción 75% en disk space
2. Build times 60% más rápidos
3. Mejor DX (developer experience)
4. Escalabilidad para futuros proyectos
5. ROI positivo en <2 meses

**Next Steps:**
1. Crear branch `monorepo-migration`
2. Ejecutar Fase 1 (setup)
3. Review con equipo
4. Continuar con Fases 2-5

---

**Última actualización:** 2025-12-01  
**Owner:** @josecarlos21  
**Status:** 📋 Aprobado - Ready to Start
