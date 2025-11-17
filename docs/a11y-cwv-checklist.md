# Checklist A11Y · CWV (Habitat Conectado)

### Alcance
Pantallas: Splash/Auth, Dashboard, Pagos, Mantenimiento (lista y detalle), Reservas, Visitantes, Paquetería, Avisos, Asambleas, Perfil, Ajustes.

## Accesibilidad (WCAG 2.2 AA)

| Pantalla / Patrón | Teclado Tab/Shift+Tab | Focus visible | Roles/aria | Contraste | Estados vacíos | Observaciones |
|-------------------|----------------------|---------------|------------|-----------|----------------|---------------|
| Splash/Auth       | ✅ Links/Buttons | ✅ Buttons, falta focus en switch OTP | Añadir `aria-live` al mensaje OTP | Textos > 4.5:1 | ✅ | `prefers-reduced-motion` para animaciones. |
| Dashboard         | ✅ (CTA, dialog buttons) | ✅, revisar `Button variant="ghost"` | Tarjetas puramente visuales (ok) | contrast ok | ✅ | `PageHeader` debería tener `aria-labelledby`. |
| Pagos             | ✅ tabs/table | ✅ | Tabla necesita `scope=col` (pendiente) | ok | ✅ | Dialogs requieren `aria-live` para confirmaciones. |
| Mantenimiento list | ✅ filtros/cards | ✅ | Switch sheet ok | ok | ✅ | Añadir `aria-describedby` al search input. |
| Mantenimiento detalle | ✅ formulario comentario | ✅ | Timeline sólo visual (ok) | ok | ✅ | `Paperclip` button requiere `aria-label`. |
| Reservas          | ✅ | ✅ | Sheet calendar ok | ok | ✅ | Calendar debe respetar `aria-label` en selects. |
| Visitantes        | ✅ | ✅ | Dialog QR: añadir `aria-live` y `role="status"` | ok | ✅ | Botón compartir requiere descripción contextual. |
| Paquetería        | ✅ | ✅ | Dialog confirm entrega ok | ok | ✅ | Confirmar `aria-label` en search input. |
| Avisos            | ✅ | ✅ | Cards semánticas, headings ok | ok | ✅ | Ninguna. |
| Asambleas         | ✅ | ✅ | VotingCard usa RadioGroup/Label (ok) | ok | ✅ | Añadir `aria-live` en confirmación de voto. |
| Perfil            | ✅ | ✅ | Switch preferencia requiere `aria-labelledby` | ok | ✅ | Botón “Actualizar foto” sin input (futuro). |
| Ajustes           | ✅ | ✅ | Tabs Radix gestionan roles | ok | ✅ | Añadir `aria-describedby` a toggles de alertas. |

**Acciones pendientes**  
- Añadir `aria-live="polite"` a toasts críticos (OTP, votación, pagos).  
- Revisar `prefers-reduced-motion` para animations (splash, skeleton).  
- Documentar per-pantalla en Storybook (accesibilidad addon habilitado).

## Core Web Vitals (objetivos lab)

| Métrica | Objetivo | Consideraciones |
|---------|----------|-----------------|
| LCP     | < 2.5s   | Imágenes hero (`/splash`, amenidades) deben usar `next/image` con `priority` o `loading="lazy"`. Evitar loaders innecesarios. |
| INP     | < 200ms  | Batches de setState + mocks; al migrar a API reales usar `React.useTransition` o spinners no bloqueantes. |
| CLS     | < 0.1    | Reservas/Visitantes tienen cards de altura fija; asegurar `aspect-ratio` en imágenes y `min-h` en empty states. |

**Medición recomendada**  
- Lighthouse (Chrome) en Dashboard, Pagos, Perfil (desktop/mobile).  
- `next dev` con `NEXT_TELEMETRY_DISABLED=1` + `next build && next start` para lab tests.  
- Web Vitals plugin (Next) + logging a consola para detectar regressiones.

## Próximos pasos
1. Incorporar esta checklist en PR template.  
2. Añadir pruebas Playwright que cubran teclado/foco y midan CWV (via Lighthouse CI).  
3. Documentar tokens/Componentes en Storybook con addon `@storybook/addon-a11y` activado (ya agregado).  
4. Automatizar reporte CWV (Lighthouse CI o PageSpeed API) en CI.***
