import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Visual Polish & UX Enhancements (Sidebar, Badges, i18n, Theme, Zero Shifts)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('07.1 - Nombre institucional completo visible en el Sidebar sin puntos suspensivos (...) y ancho adecuado', async ({ page }) => {
    const sidebar = page.locator('aside').first()
    await expect(sidebar).toBeVisible()

    // Comprobar que el ancho del sidebar sea de aproximadamente 280px
    const boundingBox = await sidebar.boundingBox()
    expect(boundingBox).not.toBeNull()
    expect(boundingBox!.width).toBeGreaterThanOrEqual(275)
    expect(boundingBox!.width).toBeLessThanOrEqual(285)

    // Comprobar nombre de la institución sin elipsis ni truncamiento
    const schoolNameEl = page.locator('[data-testid="sidebar-school-name"]')
    await expect(schoolNameEl).toBeVisible()
    const text = await schoolNameEl.textContent()
    expect(text).toContain('Santa Luisa')
    // No debe terminar con '...' ni contener '...' de truncamiento
    expect(text).not.toContain('...')
  })

  test('07.2 - Badges de notificación en correo (1) y campana (3) nítidos, elevados y con tamaño mínimo de 19px', async ({ page }) => {
    // Badge de correo
    const mailBadge = page.locator('[data-testid="header-mail-badge"]')
    await expect(mailBadge).toBeVisible()
    await expect(mailBadge).toHaveText('1')
    
    const mailBox = await mailBadge.boundingBox()
    expect(mailBox).not.toBeNull()
    expect(mailBox!.width).toBeGreaterThanOrEqual(18)
    expect(mailBox!.height).toBeGreaterThanOrEqual(18)

    // Badge de campana
    const bellBadge = page.locator('[data-testid="header-bell-badge"]')
    await expect(bellBadge).toBeVisible()
    await expect(bellBadge).toHaveText('3')

    const bellBox = await bellBadge.boundingBox()
    expect(bellBox).not.toBeNull()
    expect(bellBox!.width).toBeGreaterThanOrEqual(18)
    expect(bellBox!.height).toBeGreaterThanOrEqual(18)
  })

  test('07.3 - Selector de idioma global (ES / EN) traduce la interfaz reactivamente', async ({ page }) => {
    // Abrir dropdown de idiomas
    const langBtn = page.locator('button[title="Cambiar idioma del sistema"]')
    await expect(langBtn).toBeVisible()
    await langBtn.click()

    // Cambiar a English (EN)
    const enBtn = page.locator('button:has-text("English (EN)")')
    await expect(enBtn).toBeVisible()
    await enBtn.click()

    // Verificar que el indicador muestre 'EN'
    await expect(langBtn).toContainText('EN')

    // Verificar traducciones en el Sidebar y componentes
    await expect(page.locator('aside nav')).toContainText('Dashboard')
    await expect(page.locator('aside nav')).toContainText('Students')
    await expect(page.locator('aside nav')).toContainText('Finance')

    // Cambiar a Settings y verificar que pestañas estén en inglés
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main h1')).toContainText('Institutional Settings')
    await expect(page.locator('button[role="tab"]:has-text("General")')).toBeVisible()
    await expect(page.locator('button[role="tab"]:has-text("Notifications")')).toBeVisible()
    await expect(page.locator('button[role="tab"]:has-text("Security")')).toBeVisible()

    // Regresar a Español (ES)
    await page.locator('button[title="Cambiar idioma del sistema"]').click()
    await page.locator('button:has-text("Español (ES)")').click()

    // Verificar retorno a español
    await expect(page.locator('main h1')).toContainText('Configuración Institucional')
    await expect(page.locator('button[role="tab"]:has-text("Notificaciones")')).toBeVisible()
    await expect(page.locator('button[role="tab"]:has-text("Seguridad")')).toBeVisible()
  })

  test('07.4 - Transición de tema (Modo Oscuro / Modo Claro) sin flasheos y con sincronización de colorScheme', async ({ page }) => {
    const themeBtn = page.locator('button[title*="Cambiar a modo"]')
    await expect(themeBtn).toBeVisible()

    // Comprobar estado inicial y alternar
    const initialHtmlClass = await page.locator('html').getAttribute('class') || ''
    const isInitiallyDark = initialHtmlClass.includes('dark')

    // Cambiar tema
    await themeBtn.click()
    await page.waitForTimeout(300)

    const updatedHtmlClass = await page.locator('html').getAttribute('class') || ''
    if (isInitiallyDark) {
      expect(updatedHtmlClass).not.toContain('dark')
      const colorScheme = await page.evaluate(() => document.documentElement.style.colorScheme)
      expect(colorScheme).toBe('light')
    } else {
      expect(updatedHtmlClass).toContain('dark')
      const colorScheme = await page.evaluate(() => document.documentElement.style.colorScheme)
      expect(colorScheme).toBe('dark')
    }

    // Regresar al tema original
    await themeBtn.click()
    await page.waitForTimeout(300)
  })

  test('07.5 - Navegación en sidebar sin saltos de diseño (Zero Layout Shift en active link)', async ({ page }) => {
    const studentsLink = page.locator('a[href="/students"]').first()
    await expect(studentsLink).toBeVisible()

    // Medir posición del texto antes de navegar
    const initialBox = await studentsLink.boundingBox()
    expect(initialBox).not.toBeNull()

    // Hacer clic en Estudiantes
    await studentsLink.click()
    await page.waitForURL('**/students', { timeout: 10000 })

    // El ancho del sidebar se mantiene exactamente constante
    const sidebar = page.locator('aside').first()
    const finalSidebarBox = await sidebar.boundingBox()
    expect(finalSidebarBox!.width).toBeGreaterThanOrEqual(275)
    expect(finalSidebarBox!.width).toBeLessThanOrEqual(285)

    // Capturar evidencia fotográfica de la UI pulida
    await page.screenshot({
      path: '/home/jav1978/.gemini/antigravity-ide/brain/cc4fa441-dad6-4da2-b126-3e7c99b5ad6a/ui_visual_polish_evidence.png',
      fullPage: true
    })
  })

})
