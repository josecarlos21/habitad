# Habitad Conectado v1.0

Production-ready super-app for condominiums built with Next.js 15, React 18, Tailwind, and Radix primitives. Complete end-to-end resident experience (onboarding, dashboard, payments, maintenance, reservations, visitors, packages, profile, settings) ready for backend integration.

## Flujo principal

1. **Splash / Autenticación mock**  
   - `src/hooks/use-session.tsx` administra sesión local (OTP demo `123456`, registros pendientes).  
   - `/(public)/auth` ofrece login OTP, registro con validación y ayudas de soporte.
2. **Layout privado**  
   - `src/app/(private)/layout.tsx` monta `SidebarProvider`, protege rutas y muestra loaders.  
   - Dashboard (`/(private)/dashboard`) expone métricas, CTA y diálogos para pagos/tickets/pases.
3. **Módulos residentes**  
   - Pagos, Mantenimiento, Reservas, Visitantes, Paquetería, Avisos, Asambleas, Perfil y Ajustes comparten patrón `PageHeader + StatCard + filtros/diálogos`, con estados de carga y vacíos.
4. **Logout**  
   - El botón “Cerrar sesión” en el sidebar usa `useSession().logout()` y redirige a `/auth/login`, limpiando la sesión persistida.

## Scripts

| Comando            | Descripción                               |
|--------------------|-------------------------------------------|
| `npm run dev`      | Inicia Next.js en modo desarrollo.        |
| `npm run build`    | Compila con `next build`.                 |
| `npm run start`    | Sirve build productivo.                   |
| `npm run lint`     | Ejecuta `next lint`.                      |
| `npm run typecheck`| Verifica TypeScript (`tsc --noEmit`).     |
| `npm run storybook`| Lanza Storybook en `http://localhost:6006`. |

> **Nota**: Ejecuta `npm install` antes de correr cualquier script, ya que el repo sólo incluye package-lock.

## Design tokens, datos y servicios mock

- `tokens/design-tokens.json` concentra los valores base (color, tipografía, spacing, radios, sombras, motion, modos/densidades) en formato DTCG para reutilizarlos en otras plataformas.  
- `globals.css` consume esos tokens para exponer las CSS vars que Tailwind referencia (`--background`, `--primary`, etc.).  
- `src/lib/mocks.ts` contiene residentes, facturas, tickets, amenidades y visitantes demo; `src/lib/types.ts` tipa cada dominio.  
- `src/services/mock-api.ts` centraliza las llamadas simuladas (`fetchInvoices`, `fetchTickets`, etc.), lo que hace trivial cambiar a un backend real.
- `docs/a11y-cwv-checklist.md` lista el estado de cumplimiento WCAG 2.2 AA y objetivos CWV (LCP/INP/CLS) por pantalla.

## Patrones de UI

- `src/components/app/page-header.tsx`: cabecera contextual con acciones.  
- `src/components/app/stat-card.tsx`: tarjetas KPI responsivas.  
- Se usan componentes base de Shadcn (`ui/`) + Radix para Sheets/Dialogs.
- Storybook (`npm run storybook`) documenta PageHeader, StatCard y EmptyState con addon `@storybook/addon-a11y`.

## Roadmap inmediato

- Validar contraste/tokens AA/AAA y documentar equivalencias (web ↔ mobile).  
- Ejecutar checklist A11Y/CWV y pruebas automatizadas (Playwright/Vitest).  
- Integrar servicios reales (auth, pagos, soporte) cuando el backend defina contratos.

## Demo

1. Inicia `npm run dev`.  
2. Abre `http://localhost:3000`.  
3. Usa cualquier correo y el OTP `123456` para entrar al dashboard.  
4. Explora módulos; todas las acciones muestran toasts y mutaciones mock.
