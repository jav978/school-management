import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Boletas y Certificación: Verificación Triple contra PostgreSQL', () => {

  const TEST_OBS = 'Estudiante con excelente rendimiento evaluado en E2E 2026'
  const UPDATED_OBS = 'Estudiante con rendimiento sobresaliente y mención de honor E2E 2026'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.report_cards')
        .where('teacher_observations', 'like', '%E2E 2026%')
        .del()
    } catch (_) {}
  })

  test('TC-BOL-01: Carga la vista de Boletas y los 3 modelos de diseño oficiales', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/boletas')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Boletas de Calificaciones' })
    await expect(heading).toBeVisible()

    // Modelos de diseño
    await expect(page.locator('button', { hasText: 'Moderna' })).toBeVisible()
    await expect(page.locator('button', { hasText: 'Clásica Institucional' })).toBeVisible()
    await expect(page.locator('button', { hasText: 'Compacta' })).toBeVisible()

    // Botones de acción
    await expect(page.locator('[data-testid="btn-new-report-card"]')).toBeVisible()
  })

  test('TC-BOL-02: Emisión (Create) de boleta con persistencia real en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/boletas')
    await page.waitForLoadState('networkidle')

    // Abrir modal de emisión
    const newBtn = page.locator('[data-testid="btn-new-report-card"]')
    await expect(newBtn).toBeVisible()
    await newBtn.click()

    // Llenar formulario
    await page.locator('[data-testid="modal-final-average"]').fill('19.5')
    await page.locator('[data-testid="modal-teacher-observations"]').fill(TEST_OBS)

    // Guardar y emitir
    const submitBtn = page.locator('[data-testid="btn-submit-report-card"]')
    await submitBtn.click()

    // Toast de confirmación
    await expect(page.locator('text=Boleta Emitida')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const cardInDb = await db('school.report_cards')
      .where({ teacher_observations: TEST_OBS, is_deleted: false })
      .first()

    expect(cardInDb).toBeDefined()
    expect(Number(cardInDb.final_average)).toBe(19.5)
    expect(cardInDb.status).toBe('emitida')
    expect(cardInDb.verification_code).toContain('SL-BOL-2026')
  })

  test('TC-BOL-03: Modificación (Update) de boleta y verificación en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/boletas')
    await page.waitForLoadState('networkidle')

    // Abrir modal de edición
    const editBtn = page.locator('[data-testid="btn-edit-report-card"]').first()
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Cambiar observaciones
    const obsInput = page.locator('[data-testid="modal-teacher-observations"]')
    await obsInput.fill(UPDATED_OBS)

    // Guardar cambios
    const submitBtn = page.locator('[data-testid="btn-submit-report-card"]')
    await submitBtn.click()

    // Toast de confirmación
    await expect(page.locator('text=Boleta Actualizada')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const updatedInDb = await db('school.report_cards')
      .where({ teacher_observations: UPDATED_OBS, is_deleted: false })
      .first()

    expect(updatedInDb).toBeDefined()
  })

  test('TC-BOL-04: Anulación (Soft Delete) de boleta y verificación en PostgreSQL', async ({ page }) => {
    const db = require('../../../backend/src/database')
    const targetCard = await db('school.report_cards')
      .where({ teacher_observations: UPDATED_OBS })
      .first()

    await loginAsAdmin(page)
    await page.goto('/boletas')
    await page.waitForLoadState('networkidle')

    if (targetCard) {
      await page.locator('[data-testid="select-student-report-card"]').selectOption(String(targetCard.id))
    }

    // Botón de anular
    const deleteBtn = page.locator('[data-testid="btn-delete-report-card"]').first()
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // Confirmar en el modal
    const confirmBtn = page.locator('[data-testid="btn-confirm-delete-report-card"]')
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // Toast de anulación
    await expect(page.locator('text=Boleta Anulada')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const deletedInDb = await db('school.report_cards')
      .where({ teacher_observations: UPDATED_OBS })
      .first()

    expect(deletedInDb).toBeDefined()
    expect(deletedInDb.is_deleted === true || deletedInDb.status === 'anulada').toBe(true)
  })

  test('TC-BOL-05: Validación pública de boleta en /verificar-boleta con sello digital', async ({ page }) => {
    const db = require('../../../backend/src/database')
    const card = await db('school.report_cards').where('is_deleted', false).first()

    if (card && card.verification_code) {
      await page.goto(`/verificar-boleta/${card.verification_code}`)
      await page.waitForLoadState('networkidle')

      // Verificar que reconoció el documento
      await expect(page.locator('text=Documento Auténtico y Verificado')).toBeVisible()
      await expect(page.locator(`text=${card.verification_code}`)).toBeVisible()
    }
  })
})
