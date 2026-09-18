import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Control de Asistencias: Verificación Triple contra PostgreSQL', () => {

  const TEST_DATE = '2026-10-15'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.attendance')
        .where('attendance_date', TEST_DATE)
        .del()
    } catch (_) {}
  })

  test('TC-ATT-01: Carga la vista de Asistencias con métricas institucionales y controles', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/attendance')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Control de Asistencia' })
    await expect(heading).toBeVisible()

    // Selector de clase y fecha
    await expect(page.locator('[data-testid="select-attendance-class"]')).toBeVisible()
    await expect(page.locator('[data-testid="input-attendance-date"]')).toBeVisible()

    // Botones de acción
    await expect(page.locator('[data-testid="btn-mark-all-present"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-save-attendance"]')).toBeVisible()
  })

  test('TC-ATT-02: Registro (Create) de asistencia masiva persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/attendance')
    await page.waitForLoadState('networkidle')

    // Seleccionar fecha de prueba
    const dateInput = page.locator('[data-testid="input-attendance-date"]')
    await dateInput.fill(TEST_DATE)
    await dateInput.dispatchEvent('change')
    await page.waitForTimeout(500)

    // Clic en "Todos Presentes"
    const markAllBtn = page.locator('[data-testid="btn-mark-all-present"]')
    await markAllBtn.click()

    // Clic en "Guardar Asistencia"
    const saveBtn = page.locator('[data-testid="btn-save-attendance"]')
    await saveBtn.click()

    // Toast de éxito
    await expect(page.locator('text=Asistencia guardada')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const records = await db('school.attendance')
      .where('attendance_date', TEST_DATE)
      .where('is_deleted', false)

    expect(records.length).toBeGreaterThan(0)
    for (const r of records) {
      expect(r.status).toBe('present')
    }
  })

  test('TC-ATT-03: Modificación (Update) de asistencia individual a Tardanza en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/attendance')
    await page.waitForLoadState('networkidle')

    // Cambiar a fecha de prueba
    const dateInput = page.locator('[data-testid="input-attendance-date"]')
    await dateInput.fill(TEST_DATE)
    await dateInput.dispatchEvent('change')
    await page.waitForTimeout(500)

    // Cambiar primer estudiante a "Tarde"
    const lateBtn = page.locator('[data-testid="status-late"]').first()
    await expect(lateBtn).toBeVisible()
    await lateBtn.click()

    // Guardar
    const saveBtn = page.locator('[data-testid="btn-save-attendance"]')
    await saveBtn.click()

    await expect(page.locator('text=Asistencia guardada')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const lateRecord = await db('school.attendance')
      .where({ attendance_date: TEST_DATE, status: 'late', is_deleted: false })
      .first()

    expect(lateRecord).toBeDefined()
    expect(lateRecord.minutes_late).toBeGreaterThanOrEqual(15)
  })

  test('TC-ATT-04: Modificación de asistencia a Inasistencia (Absent) en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/attendance')
    await page.waitForLoadState('networkidle')

    // Cambiar a fecha de prueba
    const dateInput = page.locator('[data-testid="input-attendance-date"]')
    await dateInput.fill(TEST_DATE)
    await dateInput.dispatchEvent('change')
    await page.waitForTimeout(500)

    // Cambiar segundo estudiante a "Ausente"
    const absentBtn = page.locator('[data-testid="status-absent"]').nth(1)
    await expect(absentBtn).toBeVisible()
    await absentBtn.click()

    // Guardar
    const saveBtn = page.locator('[data-testid="btn-save-attendance"]')
    await saveBtn.click()

    await expect(page.locator('text=Asistencia guardada')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const absentRecord = await db('school.attendance')
      .where({ attendance_date: TEST_DATE, status: 'absent', is_deleted: false })
      .first()

    expect(absentRecord).toBeDefined()
  })
})
