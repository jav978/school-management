import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Exámenes y Evaluaciones: Verificación Triple contra PostgreSQL', () => {

  const TEST_TITLE = 'Examen Parcial de Física y Ondas 2026'
  const UPDATED_TITLE = 'Examen Final de Física General y Mecánica Cuántica'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.exams')
        .where('title', 'like', '%Examen Parcial de Física%')
        .orWhere('title', 'like', '%Examen Final de Física%')
        .del()
    } catch (_) {}
  })

  test('TC-EXM-01: Carga la vista de Exámenes con métricas institucionales y lista', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/exams')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Exámenes y Constructor de Preguntas' })
    await expect(heading).toBeVisible()

    // 4 Tarjetas KPI
    await expect(page.locator('p', { hasText: 'Total Exámenes' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Programados' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Preguntas en Banco' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Escala Máxima' })).toBeVisible()

    // Botón de nuevo examen
    await expect(page.locator('[data-testid="create-exam-btn"]')).toBeVisible()
  })

  test('TC-EXM-02: Creación (Create) de examen evaluativo persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/exams')
    await page.waitForLoadState('networkidle')

    // Abrir modal de creación
    const createBtn = page.locator('[data-testid="create-exam-btn"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()

    // Modal visible
    const modal = page.locator('[data-testid="exam-modal"]')
    await expect(modal).toBeVisible()

    // Llenar formulario
    await page.locator('[data-testid="exam-title-input"]').fill(TEST_TITLE)

    // Guardar examen
    const submitBtn = page.locator('[data-testid="exam-submit-btn"]')
    await submitBtn.click()

    // Esperar a que el modal se cierre
    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Verificación directa en base de datos PostgreSQL
    const db = require('../../../backend/src/database')
    const examInDb = await db('school.exams')
      .where({ title: TEST_TITLE })
      .first()

    expect(examInDb).toBeDefined()
    expect(examInDb.title).toBe(TEST_TITLE)
    expect(examInDb.is_deleted).toBeFalsy()
  })

  test('TC-EXM-03: Edición (Update) de evaluación y reflejo en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/exams')
    await page.waitForLoadState('networkidle')

    // Localizar la tarjeta del examen creado
    const examCard = page.locator('div', { hasText: TEST_TITLE }).first()
    await expect(examCard).toBeVisible()

    // Botón editar del examen
    const editBtn = page.locator('[data-testid="edit-exam-btn"]').first()
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Modal en modo edición
    const modal = page.locator('[data-testid="exam-modal"]')
    await expect(modal).toBeVisible()

    // Actualizar título
    const titleInput = page.locator('[data-testid="exam-title-input"]')
    await titleInput.fill(UPDATED_TITLE)

    // Guardar cambios
    const submitBtn = page.locator('[data-testid="exam-submit-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Verificar en PostgreSQL
    const db = require('../../../backend/src/database')
    const updatedInDb = await db('school.exams')
      .where({ title: UPDATED_TITLE })
      .first()

    expect(updatedInDb).toBeDefined()
    expect(updatedInDb.title).toBe(UPDATED_TITLE)
  })

  test('TC-EXM-04: Eliminación lógica (Delete) de examen con confirmación en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/exams')
    await page.waitForLoadState('networkidle')

    // Localizar botón eliminar
    const deleteBtn = page.locator('[data-testid="delete-exam-btn"]').first()
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // Modal de confirmación
    const deleteModal = page.locator('[data-testid="delete-exam-modal"]')
    await expect(deleteModal).toBeVisible()

    // Confirmar eliminación
    const confirmBtn = page.locator('[data-testid="confirm-delete-exam-btn"]')
    await confirmBtn.click()

    await expect(deleteModal).not.toBeVisible({ timeout: 10000 })

    // Verificar en PostgreSQL que is_deleted = true
    const db = require('../../../backend/src/database')
    const examInDb = await db('school.exams')
      .where({ title: UPDATED_TITLE })
      .first()

    expect(examInDb).toBeDefined()
    expect(examInDb.is_deleted).toBe(true)
  })

})
