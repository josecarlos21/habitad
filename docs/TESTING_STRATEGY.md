# Testing Strategy - Habitad v1.0

> **Objetivo:** Alcanzar >80% coverage y garantizar calidad en producción  
> **Última actualización:** 2025-12-01

---

## 📊 Estado Actual

### Quality Gates Implementados

✅ **Linting (ESLint 9)**
- Config: `eslint.config.mjs`
- Rules: Next.js, import order, accessibility, Storybook
- Ejecutar: `npm run lint`

✅ **Type Checking (TypeScript 5.x)**
- Config: `tsconfig.json`
- Modo strict activado
- Ejecutar: `npm run typecheck`

✅ **Storybook Stories**
- 10+ stories documentadas
- A11y addon integrado
- Ejecutar: `npm run storybook`

### Gaps Identificados

🔴 **Unit Tests:** 0% coverage
🔴 **Integration Tests:** No implementados
🔴 **E2E Tests:** No implementados
🔴 **Visual Regression:** No implementado
🔴 **Performance Testing:** No implementado

---

## 🎯 Testing Pyramid

```
         /\
        /  \
       /E2E \         10% - Playwright (User flows)
      /------\
     /  Int.  \       30% - Testing Library (Feature integration)
    /----------\
   /   Unit     \     60% - Vitest (Functions, hooks, utils)
  /--------------\
```

---

## 🧪 Fase 1: Unit Testing (Semana 1-2)

### Stack Recomendado

- **Vitest** (test runner, compatible con Vite/Next.js)
- **React Testing Library** (component testing)
- **@testing-library/jest-dom** (matchers)
- **@testing-library/user-event** (user interactions)

### Instalación

```bash
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @vitest/ui @vitest/coverage-v8
```

### Configuración

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        'dist/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**src/test/setup.ts:**

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

**package.json scripts:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Prioridades de Testing

**Alta prioridad (60% effort):**

1. **Hooks:**
   - `src/hooks/use-session.tsx` ✅
   - Custom hooks de formularios

2. **Utilities:**
   - `src/lib/utils.ts` ✅
   - Date formatters
   - Currency formatters

3. **Services:**
   - `src/services/mock-api.ts` ✅
   - Error handling

4. **Components críticos:**
   - `src/components/app/page-header.tsx`
   - `src/components/app/stat-card.tsx`
   - `src/components/app/empty-state.tsx`

**Media prioridad (30% effort):**

5. **UI primitives:**
   - Buttons, Inputs, Dialogs
   - Form components

6. **Feature modules:**
   - Payments logic
   - Reservations logic

**Baja prioridad (10% effort):**

7. **Layout components**
8. **Static pages**

### Ejemplo: Test de `use-session` Hook

**src/hooks/use-session.test.tsx:**

```typescript
import { renderHook, act } from '@testing-library/react'
import { useSession } from './use-session'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useSession', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe iniciar sin usuario autenticado', () => {
    const { result } = renderHook(() => useSession())
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('debe autenticar con OTP correcto', () => {
    const { result } = renderHook(() => useSession())
    
    act(() => {
      result.current.login('test@example.com', '123456')
    })

    expect(result.current.user).toBeDefined()
    expect(result.current.user?.email).toBe('test@example.com')
  })

  it('debe fallar con OTP incorrecto', () => {
    const { result } = renderHook(() => useSession())
    
    act(() => {
      result.current.login('test@example.com', '000000')
    })

    expect(result.current.user).toBeNull()
  })

  it('debe cerrar sesión correctamente', () => {
    const { result } = renderHook(() => useSession())
    
    act(() => {
      result.current.login('test@example.com', '123456')
    })

    expect(result.current.user).toBeDefined()

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('debe persistir sesión en localStorage', () => {
    const { result } = renderHook(() => useSession())
    
    act(() => {
      result.current.login('test@example.com', '123456')
    })

    const stored = localStorage.getItem('session')
    expect(stored).toBeDefined()
    
    const session = JSON.parse(stored!)
    expect(session.email).toBe('test@example.com')
  })
})
```

### Ejemplo: Test de Component

**src/components/app/stat-card.test.tsx:**

```typescript
import { render, screen } from '@testing-library/react'
import { StatCard } from './stat-card'
import { describe, it, expect } from 'vitest'

describe('StatCard', () => {
  it('debe renderizar título y valor', () => {
    render(
      <StatCard 
        title="Total Pagos" 
        value="$1,234.56" 
        icon={<div>Icon</div>}
      />
    )
    
    expect(screen.getByText('Total Pagos')).toBeInTheDocument()
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('debe mostrar cambio positivo', () => {
    render(
      <StatCard 
        title="Total Pagos" 
        value="$1,234.56" 
        change="+12.5%"
        trend="up"
      />
    )
    
    expect(screen.getByText('+12.5%')).toBeInTheDocument()
    expect(screen.getByText('+12.5%')).toHaveClass('text-green-600')
  })

  it('debe mostrar cambio negativo', () => {
    render(
      <StatCard 
        title="Total Pagos" 
        value="$1,234.56" 
        change="-5.2%"
        trend="down"
      />
    )
    
    expect(screen.getByText('-5.2%')).toBeInTheDocument()
    expect(screen.getByText('-5.2%')).toHaveClass('text-red-600')
  })
})
```

---

## 🔗 Fase 2: Integration Testing (Semana 3-4)

### Objetivos

- Testar flujos completos de features
- Interacción entre múltiples components
- API mocks integration

### Herramientas

- React Testing Library (user flows)
- MSW (Mock Service Worker) para API mocks

### Instalación MSW

```bash
npm install -D msw
```

### Setup MSW

**src/test/mocks/handlers.ts:**

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/invoices', () => {
    return HttpResponse.json([
      { id: 1, amount: 1000, status: 'paid' },
      { id: 2, amount: 2000, status: 'pending' },
    ])
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, otp } = await request.json()
    
    if (otp === '123456') {
      return HttpResponse.json({
        user: { email, name: 'Test User' },
        token: 'mock-token-123',
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid OTP' },
      { status: 401 }
    )
  }),
]
```

**src/test/mocks/server.ts:**

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**src/test/setup.ts (update):**

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
```

### Ejemplo: Integration Test

**src/app/(public)/auth/login.test.tsx:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './page'
import { describe, it, expect } from 'vitest'

describe('Login Page Integration', () => {
  it('debe completar flujo de login exitoso', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    // Ingresar email
    const emailInput = screen.getByLabelText(/correo/i)
    await user.type(emailInput, 'test@example.com')
    
    // Click en "Enviar OTP"
    const submitBtn = screen.getByRole('button', { name: /enviar/i })
    await user.click(submitBtn)
    
    // Esperar vista OTP
    await waitFor(() => {
      expect(screen.getByText(/ingresa.*código/i)).toBeInTheDocument()
    })
    
    // Ingresar OTP
    const otpInput = screen.getByLabelText(/código/i)
    await user.type(otpInput, '123456')
    
    // Submit OTP
    const verifyBtn = screen.getByRole('button', { name: /verificar/i })
    await user.click(verifyBtn)
    
    // Verificar redirección a dashboard
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })

  it('debe mostrar error con OTP inválido', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/correo/i)
    await user.type(emailInput, 'test@example.com')
    
    const submitBtn = screen.getByRole('button', { name: /enviar/i })
    await user.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByText(/ingresa.*código/i)).toBeInTheDocument()
    })
    
    const otpInput = screen.getByLabelText(/código/i)
    await user.type(otpInput, '000000')
    
    const verifyBtn = screen.getByRole('button', { name: /verificar/i })
    await user.click(verifyBtn)
    
    await waitFor(() => {
      expect(screen.getByText(/código inválido/i)).toBeInTheDocument()
    })
  })
})
```

---

## 🎭 Fase 3: E2E Testing (Semana 5-6)

### Stack

- **Playwright** (cross-browser E2E)
- **@playwright/test** (test runner)

### Instalación

```bash
npm install -D @playwright/test
npx playwright install
```

### Configuración

**playwright.config.ts:**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**package.json scripts:**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### Ejemplo: E2E Test

**e2e/auth-flow.spec.ts:**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('debe completar registro y login', async ({ page }) => {
    await page.goto('/auth/register')
    
    // Registro
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phone"]', '5512345678')
    await page.selectOption('select[name="unit"]', '101')
    
    await page.click('button[type="submit"]')
    
    // Esperar confirmación
    await expect(page.getByText(/registro exitoso/i)).toBeVisible()
    
    // Login
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Enviar código")')
    
    // OTP
    await expect(page.getByText(/ingresa.*código/i)).toBeVisible()
    await page.fill('input[name="otp"]', '123456')
    await page.click('button:has-text("Verificar")')
    
    // Verificar dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/bienvenido/i)).toBeVisible()
  })

  test('debe navegar por todos los módulos', async ({ page }) => {
    // Login primero
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Enviar código")')
    await page.fill('input[name="otp"]', '123456')
    await page.click('button:has-text("Verificar")')
    
    // Dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Pagos
    await page.click('a[href="/payments"]')
    await expect(page).toHaveURL('/payments')
    await expect(page.getByText(/historial de pagos/i)).toBeVisible()
    
    // Mantenimiento
    await page.click('a[href="/maintenance"]')
    await expect(page).toHaveURL('/maintenance')
    await expect(page.getByText(/tickets/i)).toBeVisible()
    
    // Reservas
    await page.click('a[href="/reservations"]')
    await expect(page).toHaveURL('/reservations')
    await expect(page.getByText(/amenidades/i)).toBeVisible()
    
    // Visitantes
    await page.click('a[href="/visitors"]')
    await expect(page).toHaveURL('/visitors')
    await expect(page.getByText(/pases/i)).toBeVisible()
    
    // Paquetería
    await page.click('a[href="/packages"]')
    await expect(page).toHaveURL('/packages')
    
    // Logout
    await page.click('button:has-text("Cerrar sesión")')
    await expect(page).toHaveURL('/auth/login')
  })
})
```

**e2e/payments.spec.ts:**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Payments Module', () => {
  test.beforeEach(async ({ page }) => {
    // Login helper
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Enviar código")')
    await page.fill('input[name="otp"]', '123456')
    await page.click('button:has-text("Verificar")')
  })

  test('debe mostrar historial de pagos', async ({ page }) => {
    await page.goto('/payments')
    
    await expect(page.getByText(/historial de pagos/i)).toBeVisible()
    
    // Verificar tabla
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(5) // 5 facturas mock
  })

  test('debe filtrar por estado', async ({ page }) => {
    await page.goto('/payments')
    
    // Filtrar por "Pagadas"
    await page.selectOption('select[name="status"]', 'paid')
    
    await expect(page.locator('tbody tr')).toHaveCount(3)
    
    // Filtrar por "Pendientes"
    await page.selectOption('select[name="status"]', 'pending')
    
    await expect(page.locator('tbody tr')).toHaveCount(2)
  })

  test('debe abrir modal de pago', async ({ page }) => {
    await page.goto('/payments')
    
    await page.click('button:has-text("Pagar ahora")')
    
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.getByText(/método de pago/i)).toBeVisible()
  })

  test('debe descargar factura PDF', async ({ page }) => {
    await page.goto('/payments')
    
    const downloadPromise = page.waitForEvent('download')
    await page.click('button[aria-label="Descargar factura"]')
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/factura.*\.pdf/i)
  })
})
```

---

## 📸 Fase 4: Visual Regression (Opcional)

### Stack

- **Chromatic** (Storybook visual testing)
- **Percy** (alternativa)
- **Playwright screenshots** (manual)

### Chromatic Setup

```bash
npm install -D chromatic
```

**package.json:**

```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<PROJECT_TOKEN>"
  }
}
```

**.github/workflows/ci.yml (update):**

```yaml
- name: Publish to Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    buildScriptName: build-storybook
```

---

## ⚡ Fase 5: Performance Testing

### Lighthouse CI

**Installation:**

```bash
npm install -D @lhci/cli
```

**lighthouserc.js:**

```javascript
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/payments',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

**CI Integration:**

```yaml
- name: Run Lighthouse CI
  run: npx @lhci/cli autorun
```

---

## 📊 Coverage Goals

| Tipo | Target | Timeline |
|------|--------|----------|
| Unit Tests | >80% | Semana 2 |
| Integration Tests | >60% | Semana 4 |
| E2E Critical Paths | 100% | Semana 6 |
| Accessibility | WCAG 2.2 AA | Semana 4 |
| Performance | LCP <2.5s, INP <200ms | Semana 6 |

---

## 🔄 CI/CD Integration

**Updated .github/workflows/ci.yml:**

```yaml
test:
  name: Run Tests
  runs-on: ubuntu-latest
  needs: lint-and-typecheck
  steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload Playwright report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## 📝 Checklist de Implementación

### Semana 1-2: Unit Tests

- [ ] Instalar Vitest + RTL
- [ ] Configurar vitest.config.ts
- [ ] Setup test helpers (src/test/setup.ts)
- [ ] Testar hooks (use-session)
- [ ] Testar utilities (utils.ts)
- [ ] Testar services (mock-api.ts)
- [ ] Testar components críticos (PageHeader, StatCard)
- [ ] Alcanzar >80% coverage

### Semana 3-4: Integration Tests

- [ ] Instalar MSW
- [ ] Configurar API mocks (handlers.ts)
- [ ] Testar flujo de autenticación
- [ ] Testar módulos (Payments, Maintenance)
- [ ] Alcanzar >60% coverage

### Semana 5-6: E2E Tests

- [ ] Instalar Playwright
- [ ] Configurar playwright.config.ts
- [ ] Testar auth flow completo
- [ ] Testar navegación entre módulos
- [ ] Testar critical paths (payments, reservations)
- [ ] Cubrir 100% de flujos críticos

### Opcional: Visual & Performance

- [ ] Setup Chromatic
- [ ] Integrar Lighthouse CI
- [ ] Configurar thresholds de performance
- [ ] Monitorear en CI/CD

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
- [MSW Docs](https://mswjs.io/)
- [Chromatic Docs](https://www.chromatic.com/docs/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Última actualización:** 2025-12-01  
**Owner:** @josecarlos21  
**Status:** 📋 Plan Aprobado - Pending Implementation
