# Repository Guidelines

## Project Structure & Module Organization
Habitad is a Next.js 15 + TypeScript app rooted in `src`. `src/app` handles route segments and server components, while `src/components/{app,ui}`, `src/hooks`, `src/lib`, and `src/services` host shared UI, hooks, utilities, and integrations. AI workflows live in `src/ai`, Storybook demos in `src/stories`, documentation in `docs`, static assets in `public`, and theme tokens in `tokens`; co-locate feature assets with their component folders.

## Build, Test, and Development Commands
- `npm run dev` – Next.js dev server (Turbopack HMR).  
- `npm run genkit:dev` / `npm run genkit:watch` – Genkit debugger for `src/ai/dev.ts`.  
- `npm run build` – Production `.next/` output (`NODE_ENV=production`).  
- `npm run start` – Serves the build; smoke-test deploy artifacts here.  
- `npm run lint` / `npm run typecheck` – ESLint 9 + `tsc --noEmit` quality gates.  
- `npm run storybook` / `npm run build-storybook` – UI gallery plus the static bundle used for visual reviews.

## Coding Style & Naming Conventions
Favor React Server Components with 2-space indentation, TypeScript types, and named exports. Components stay in PascalCase files (`PaymentCard.tsx`), hooks in camelCase starting with `use`, and utilities in descriptive kebab-case (`date-range.ts`). Tailwind handles layout; use `clsx` or `class-variance-authority` for conditional variants and avoid inline styles. Fetch data server-side inside route segments, wrap browser-only code in `'use client'` files, and run `npm run lint` so `eslint.config.mjs` keeps import order, accessibility, and Storybook rules tight.

## Testing Guidelines
Linting, type checking, and Storybook stories currently provide regression coverage. Update a `*.stories.tsx` for every UI change, including loading/empty/error states. Note manual verification steps in the PR template until Jest/Vitest lands; when that happens, mirror the source tree via `Component.test.tsx` and re-use fixtures from `src/stories/assets`.

## Commit & Pull Request Guidelines
Recent commits use short Spanish imperative subjects (for example, `mejora flujo splash`); keep that format, stay under 65 characters, and describe one logical change. Rebase or squash experiments before opening a PR. In the PR description link the issue, list `npm run lint && npm run typecheck && npm run build` results, attach screenshots or Storybook URLs for UI changes, and flag new env vars or migrations. Request review only after local gates pass.

## Security & Configuration Tips
Secrets belong only in `.env.local` or the hosting provider—never in Git. Variables load through `dotenv`, so validate each `process.env.*` with tooling like `zod`, sanitize user input server-side, and avoid persisting tokens in client components.
