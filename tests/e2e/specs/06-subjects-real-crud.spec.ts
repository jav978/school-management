import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Materias y Cátedras: CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.subjects').where({ code: 'FIS-101' }).del()
    } catch (_) {}
  })

  test('TC-SUB-01: Carga la lista real de materias curriculares desde PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/subjects')
    await page.waitForLoadState('networkidle')

    // Título institucional visible
    const heading = page.locator('h1', { hasText: 'Gestión de Materias y Cátedras' })
    await expect(heading).toBeVisible()

    // 4 Tarjetas KPI visibles
    await expect(page.getByText('Total Materias', { exact: true })).toBeVisible()
    await expect(page.getByText('Departamentos', { exact: true })).toBeVisible()

    // Botón de nueva materia
    const newBtn = page.locator('[data-testid="create-subject-btn"]')
    await expect(newBtn).toBeVisible()

    // Filtros de búsqueda
    await expect(page.locator('[data-testid="subject-search-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="subject-department-filter"]')).toBeVisible()
    await expect(page.locator('[data-testid="subject-level-filter"]')).toBeVisible()

    // Verificar materias base de PostgreSQL
    await expect(page.locator('text="Matemáticas y Razonamiento Lógico"')).toBeVisible()
    await expect(page.locator('text="MAT-101"')).toBeVisible()
    await expect(page.locator('text="Castellano y Literatura"')).toBeVisible()
  })

  test('TC-SUB-02: Creación (Create) de nueva materia persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/subjects')
    await page.waitForLoadState('networkidle')

    // Abrir modal
    const newBtn = page.locator('[data-testid="create-subject-btn"]')
    await expect(newBtn).toBeVisible()
    await newBtn.click()

    // Modal de registro
    const modal = page.locator('[data-testid="subject-modal"]')
    await expect(modal).toBeVisible()

    // Llenar campos del formulario
    await page.locator('[data-testid="subject-code-input"]').fill('FIS-101')
    await page.locator('[data-testid="subject-name-input"]').fill('Física Cuántica y Ondas')
    await page.locator('[data-testid="subject-level-select"]').selectOption('media')
    await page.locator('[data-testid="subject-category-input"]').fill('Ciencias Naturales y Exactas')
    await page.locator('[data-testid="subject-hours-input"]').fill('5')
    await page.locator('[data-testid="subject-credits-input"]').fill('4')
    await page.locator('[data-testid="subject-description-input"]').fill('Estudio curricular de oscilaciones, ondas y termodinámica moderna.')

    // Guardar
    const submitBtn = page.locator('[data-testid="submit-subject-btn"]')
    await submitBtn.click()

    // Modal se cierra y aparece en la lista
    await expect(modal).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="Física Cuántica y Ondas"')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="FIS-101"')).toBeVisible()
  })

  test('TC-SUB-03: Edición (Update) de materia persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/subjects')
    await page.waitForLoadState('networkidle')

    // Localizar tarjeta de la materia
    const card = page.locator('[data-testid="subject-card"]', { hasText: 'FIS-101' })
    await expect(card).toBeVisible()

    // Clic en editar
    const editBtn = card.locator('[data-testid="edit-subject-btn"]')
    await editBtn.click()

    // Modal de edición
    const modal = page.locator('[data-testid="subject-modal"]')
    await expect(modal).toBeVisible()

    // Modificar nombre y descripción
    const nameInput = page.locator('[data-testid="subject-name-input"]')
    await nameInput.fill('Física Cuántica Avanzada y Óptica')

    const descInput = page.locator('[data-testid="subject-description-input"]')
    await descInput.fill('Estudio profundo de mecánica analítica, óptica cuántica y relatividad.')

    // Guardar
    const submitBtn = page.locator('[data-testid="submit-subject-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    await page.waitForTimeout(1000)

    // Recargar página para verificar persistencia real en PostgreSQL
    await page.reload()
    await page.waitForLoadState('networkidle')

    const updatedCard = page.locator('[data-testid="subject-card"]', { hasText: 'FIS-101' })
    await expect(updatedCard).toBeVisible()
    await expect(updatedCard).toContainText('Física Cuántica Avanzada y Óptica')
  })

  test('TC-SUB-04: Eliminación (Soft-delete) de materia y retiro de lista activa', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/subjects')
    await page.waitForLoadState('networkidle')

    const card = page.locator('[data-testid="subject-card"]', { hasText: 'FIS-101' })
    await expect(card).toBeVisible()

    // Clic en eliminar
    const deleteBtn = card.locator('[data-testid="delete-subject-btn"]')
    await deleteBtn.click()

    // Modal de confirmación
    const confirmModal = page.locator('[data-testid="subject-delete-modal"]')
    await expect(confirmModal).toBeVisible()
    await expect(confirmModal).toContainText('FIS-101')

    // Confirmar eliminación
    const confirmBtn = page.locator('[data-testid="confirm-delete-subject-btn"]')
    await confirmBtn.click()

    await expect(confirmModal).not.toBeVisible({ timeout: 10000 })

    // Validar que la tarjeta desaparece de la vista
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="subject-card"]', { hasText: 'FIS-101' })).not.toBeVisible({ timeout: 10000 })

    // Recargar página para comprobar persistencia en PostgreSQL
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="subject-card"]', { hasText: 'FIS-101' })).not.toBeVisible()
  })

})
