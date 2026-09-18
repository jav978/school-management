import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Configuración: Identidad Institucional, MPPE, RIF J-315628015 y DEA S0098D0101', () => {

  const db = require('../../../backend/src/database')

  test.beforeEach(async () => {
    // Asegurar que el registro ID 1 tenga los valores base institucionales
    await db('school.institutions').where({ id: 1 }).update({
      name: 'U.E Colegio "Santa Luisa"',
      tax_id: 'J-315628015',
      accreditation_no: 'S0098D0101',
      settings: JSON.stringify({
        dea_code: 'S0098D0101',
        system_subtitle: 'Gestión Escolar',
        statistical_code: '10845',
        educational_zone: 'DISTRITO CAPITAL',
        dependency: 'Privada Subvencionada por MPPE'
      })
    })
  })

  test.afterAll(async () => {
    // Restaurar valores estándar al culminar las pruebas
    await db('school.institutions').where({ id: 1 }).update({
      name: 'U.E Colegio "Santa Luisa"',
      tax_id: 'J-315628015',
      accreditation_no: 'S0098D0101',
      logo_url: null,
      settings: JSON.stringify({
        dea_code: 'S0098D0101',
        system_subtitle: 'Gestión Escolar',
        statistical_code: '10845',
        educational_zone: 'DISTRITO CAPITAL',
        dependency: 'Privada Subvencionada por MPPE'
      })
    })
  })

  test('TC-SET-01: Carga y visualización de datos institucionales oficiales (RIF J-315628015 y DEA S0098D0101)', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Título y encabezado
    await expect(page.locator('h1', { hasText: 'Configuración Institucional' })).toBeVisible()

    // Comprobar tarjetas de configuración
    await expect(page.locator('text=Identidad Institucional y Logotipo')).toBeVisible()
    await expect(page.locator('text=Registro Oficial MPPE y Datos Fiscales')).toBeVisible()
    await expect(page.locator('text=Canales de Contacto y Ubicación')).toBeVisible()

    // Verificar datos de formulario poblados desde PostgreSQL
    const rifInput = page.locator('[data-testid="settings-school-rif"]')
    await expect(rifInput).toBeVisible()
    await expect(rifInput).toHaveValue('J-315628015')

    const deaInput = page.locator('[data-testid="settings-school-dea"]')
    await expect(deaInput).toBeVisible()
    await expect(deaInput).toHaveValue('S0098D0101')

    const statsInput = page.locator('[data-testid="settings-school-stats-code"]')
    await expect(statsInput).toHaveValue('10845')

    const zoneInput = page.locator('[data-testid="settings-school-zone"]')
    await expect(zoneInput).toHaveValue('DISTRITO CAPITAL')

    const depInput = page.locator('[data-testid="settings-school-dependency"]')
    await expect(depInput).toHaveValue(/Privada Subvencionada por MPPE/)

    // Verificar branding en el Sidebar
    const sidebarSchoolName = page.locator('[data-testid="sidebar-school-name"]')
    await expect(sidebarSchoolName).toBeVisible()
    await expect(sidebarSchoolName).toContainText('Santa Luisa')

    // Capturar screenshot para el walkthrough de validación
    await page.setViewportSize({ width: 1440, height: 1800 })
    await page.screenshot({ 
      path: '/home/jav1978/.gemini/antigravity-ide/brain/cc4fa441-dad6-4da2-b126-3e7c99b5ad6a/settings_module_screenshot.png', 
      fullPage: true 
    })
  })

  test('TC-SET-02: Edición reactiva del Subtítulo y Nombre Institucional con reflejo en el Sidebar', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Modificar Nombre y Subtítulo
    const nameInput = page.locator('[data-testid="settings-school-name"]')
    await nameInput.fill('U.E Colegio "Santa Luisa" - Sede Caracas')

    const subtitleInput = page.locator('[data-testid="settings-system-subtitle"]')
    await subtitleInput.fill('Campus Virtual 2026')

    // Guardar cambios
    const saveBtn = page.locator('[data-testid="settings-save-button"]')
    await saveBtn.click()

    // Verificar actualización reactiva inmediata en la barra lateral (Sidebar)
    const sidebarSchoolName = page.locator('[data-testid="sidebar-school-name"]')
    await expect(sidebarSchoolName).toHaveText('U.E Colegio "Santa Luisa" - Sede Caracas', { timeout: 10000 })

    const sidebarSubtitle = page.locator('[data-testid="sidebar-system-subtitle"]')
    await expect(sidebarSubtitle).toHaveText('Campus Virtual 2026', { timeout: 10000 })

    // Verificar persistencia directa en la base de datos PostgreSQL
    const row = await db('school.institutions').where({ id: 1 }).first()
    expect(row.name).toBe('U.E Colegio "Santa Luisa" - Sede Caracas')
    const parsedSettings = typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings
    expect(parsedSettings.system_subtitle).toBe('Campus Virtual 2026')
  })

  test('TC-SET-03: Persistencia tras recarga completa de página (F5 / Reload)', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Modificar teléfono y dirección
    const phoneInput = page.locator('[data-testid="settings-school-phone"]')
    await phoneInput.fill('+58 212 999 8877')

    const addressInput = page.locator('[data-testid="settings-school-address"]')
    await addressInput.fill('Avenida Victoria con Calle Las Flores, Caracas')

    const saveBtn = page.locator('[data-testid="settings-save-button"]')
    await saveBtn.click()

    // Esperar notificación de guardado
    await page.waitForTimeout(1500)

    // Recargar la página
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verificar que los datos sigan presentes tras la recarga
    await expect(page.locator('[data-testid="settings-school-phone"]')).toHaveValue('+58 212 999 8877')
    await expect(page.locator('[data-testid="settings-school-address"]')).toHaveValue('Avenida Victoria con Calle Las Flores, Caracas')
    await expect(page.locator('[data-testid="settings-school-rif"]')).toHaveValue('J-315628015')
    await expect(page.locator('[data-testid="settings-school-dea"]')).toHaveValue('S0098D0101')
  })

  test('TC-SET-04: Restaurar logotipo institucional predeterminado', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Botón de restaurar logo
    const restoreBtn = page.locator('[data-testid="btn-restore-logo"]')
    await expect(restoreBtn).toBeVisible()
    await restoreBtn.click()

    // Guardar
    const saveBtn = page.locator('[data-testid="settings-save-button"]')
    await saveBtn.click()

    await page.waitForTimeout(1000)

    // Verificar en base de datos que logo_url sea null
    const inst = await db('school.institutions').where({ id: 1 }).first()
    expect(inst.logo_url).toBeNull()

    // El logo en el Sidebar debe tener como src el predeterminado /logocolegio.png
    const sidebarLogo = page.locator('[data-testid="sidebar-logo"]')
    await expect(sidebarLogo).toHaveAttribute('src', /\/logocolegio\.png/)
  })

})
