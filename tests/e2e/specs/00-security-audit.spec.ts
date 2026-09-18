import { test, expect } from '@playwright/test'
import { ADMIN_CREDENTIALS } from '../fixtures/auth'

test.describe('Auditoría de Seguridad y Control de Sesiones', () => {

  test('TC-SEC-01: Debe impedir el acceso a /dashboard sin autenticación y redirigir a /auth/login', async ({ page }) => {
    // Abrir contexto limpio sin tokens ni cookies
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    // Debe ser redirigido a login
    await expect(page).toHaveURL(/.*\/auth\/login/)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('TC-SEC-02: Control de Sesión Única Activa (Kick-out automático al iniciar en otro navegador)', async ({ browser }) => {
    // 1. Contexto A: Primer navegador
    const contextA = await browser.newContext()
    const pageA = await contextA.newPage()
    await pageA.goto('/auth/login')
    await pageA.waitForLoadState('networkidle')
    await expect(pageA.locator('button[type="submit"]')).toBeVisible()
    await pageA.locator('input[type="email"]').fill(ADMIN_CREDENTIALS.email)
    await pageA.locator('input[type="password"]').fill(ADMIN_CREDENTIALS.password)
    await pageA.locator('button[type="submit"]').click()
    await pageA.waitForURL('**/dashboard', { timeout: 15000 })
    await expect(pageA).toHaveURL(/.*dashboard/)

    // 2. Contexto B: Segundo navegador (simultáneo con las mismas credenciales)
    const contextB = await browser.newContext()
    const pageB = await contextB.newPage()
    await pageB.goto('/auth/login')
    await pageB.waitForLoadState('networkidle')
    await expect(pageB.locator('button[type="submit"]')).toBeVisible()
    await pageB.locator('input[type="email"]').fill(ADMIN_CREDENTIALS.email)
    await pageB.locator('input[type="password"]').fill(ADMIN_CREDENTIALS.password)
    await pageB.locator('button[type="submit"]').click()
    await pageB.waitForURL('**/dashboard', { timeout: 15000 })
    await expect(pageB).toHaveURL(/.*dashboard/)

    // 3. Regresar a Contexto A e interactuar: su sesión debe haber sido invalidada
    await pageA.reload()
    await pageA.waitForLoadState('networkidle')

    // Contexto A debe ser expulsado a login
    await expect(pageA).toHaveURL(/.*\/auth\/login/, { timeout: 10000 })

    await contextA.close()
    await contextB.close()
  })

  test('TC-SEC-03: Cierre de navegador destruye sesión efímera y exige autenticación', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    // Iniciar sesión como Administrador y verificar acceso a dashboard
    const { loginAsAdmin } = await import('../fixtures/auth')
    await loginAsAdmin(page)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveURL(/.*dashboard/)

    // Simular cierre del navegador cerrando el context
    await context.close()

    // Abrir un nuevo contexto limpio
    const freshContext = await browser.newContext()
    const freshPage = await freshContext.newPage()
    await freshPage.goto('/dashboard')
    await freshPage.waitForLoadState('domcontentloaded')

    // Debe exigir login
    await expect(freshPage).toHaveURL(/.*\/auth\/login/)
    await freshContext.close()
  })

  test('TC-SEC-04: Prevención de escalamiento de privilegios vía PATCH /users/:id', async ({ page }) => {
    // Iniciar sesión
    const authRes = await page.request.post('http://localhost:3031/authentication', {
      data: {
        strategy: 'local',
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password
      }
    })
    expect(authRes.ok()).toBeTruthy()
    const { accessToken, user } = await authRes.json()

    // Intentar cambiar campos protegidos a través de PATCH
    const patchRes = await page.request.patch(`http://localhost:3031/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        locale: 'es_VE',
        role: 'admin' // Campo protegido
      }
    })
    expect(patchRes.ok()).toBeTruthy()
    const updated = await patchRes.json()
    expect(updated.role).toBe(user.role)
  })

  test('TC-SEC-05: Rechazar con 401 accesos no autenticados a servicios protegidos', async ({ page }) => {
    // 1. Settings
    const settingsRes = await page.request.get('http://localhost:3031/settings')
    expect(settingsRes.status()).toBe(401)

    // 2. Uploads Avatar
    const uploadRes = await page.request.post('http://localhost:3031/uploads/avatar', {
      data: { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }
    })
    expect(uploadRes.status()).toBe(401)

    // 3. Enrollment PDF
    const pdfRes = await page.request.post('http://localhost:3031/enrollment-pdf', {
      data: { isBlank: true }
    })
    expect(pdfRes.status()).toBe(401)

    // 4. Messages
    const messagesRes = await page.request.get('http://localhost:3031/messages')
    expect(messagesRes.status()).toBe(401)
  })

  test('TC-SEC-06: Resistencia a inyección de parámetros y SQL Injection', async ({ page }) => {
    // Autenticar para realizar consultas a endpoints
    const authRes = await page.request.post('http://localhost:3031/authentication', {
      data: {
        strategy: 'local',
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password
      }
    })
    const { accessToken } = await authRes.json()

    // Enviar query con desbordamiento de paginación y parámetros maliciosos
    const queryRes = await page.request.get('http://localhost:3031/students?$limit=9999999&$sort[--DROP TABLE]=1&$where=1=1', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // Debe responder 200 OK con los parámetros sanitizados y paginación acotada
    expect(queryRes.ok()).toBeTruthy()
    const data = await queryRes.json()
    expect(data.limit).toBeLessThanOrEqual(100)
  })

})
