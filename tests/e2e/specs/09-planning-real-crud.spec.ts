import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Planificación Curricular: Verificación Triple contra PostgreSQL', () => {

  const TEST_THEME = 'DEFENSA DE LA BIODIVERSIDAD NACIONAL 2026'
  const UPDATED_THEME = 'DEFENSA Y PRESERVACIÓN DEL AMBIENTE Y ECOSISTEMA'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.academic_plannings')
        .where('indispensable_theme', 'like', '%DEFENSA DE LA BIODIVERSIDAD%')
        .orWhere('indispensable_theme', 'like', '%PRESERVACIÓN DEL AMBIENTE%')
        .del()
    } catch (_) {}
  })

  test('TC-PLN-01: Carga la vista de Planificación Curricular con métricas KPI institucionales', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/planning')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Planificación Académica' })
    await expect(heading).toBeVisible()

    // 4 Tarjetas KPI
    await expect(page.locator('p', { hasText: 'Total Planes' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Aprobadas' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Finalizadas' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'En Borrador' })).toBeVisible()

    // Botón de nueva planificación y campo de búsqueda
    await expect(page.locator('[data-testid="create-planning-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="planning-search-input"]')).toBeVisible()
  })

  test('TC-PLN-02: Creación (Create) de planificación pedagógica persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/planning')
    await page.waitForLoadState('networkidle')

    // Abrir modal
    const createBtn = page.locator('[data-testid="create-planning-btn"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()

    // Modal visible
    const modal = page.locator('[data-testid="planning-modal"]')
    await expect(modal).toBeVisible()

    // Llenar campos requeridos en la pestaña General
    await page.locator('[data-testid="planning-academic-year-input"]').fill('2025-2026')
    await page.locator('[data-testid="planning-period-select"]').selectOption('1er lapso')
    await page.locator('[data-testid="planning-grade-select"]').selectOption('4to Año')
    await page.locator('[data-testid="planning-section-select"]').selectOption('U')
    await page.locator('[data-testid="planning-indispensable-theme-input"]').fill(TEST_THEME)
    await page.locator('[data-testid="planning-project-theme-input"]').fill('PROYECTO AMBIENTAL SANTA LUISA')

    // Guardar
    const submitBtn = page.locator('[data-testid="planning-submit-btn"]')
    await submitBtn.click()

    // Esperar a que el modal se cierre
    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Verificación directa en base de datos PostgreSQL
    const db = require('../../../backend/src/database')
    const planInDb = await db('school.academic_plannings')
      .where({ indispensable_theme: TEST_THEME })
      .first()

    expect(planInDb).toBeDefined()
    expect(planInDb.grade).toBe('4to Año')
    expect(planInDb.academic_year).toBe('2025-2026')
    expect(planInDb.is_deleted).toBeFalsy()
  })

  test('TC-PLN-03: Edición (Update) de planificación académica y reflejo en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/planning')
    await page.waitForLoadState('networkidle')

    // Filtrar para encontrar la planificación creada
    const searchInput = page.locator('[data-testid="planning-search-input"]')
    await searchInput.fill(TEST_THEME)
    await page.waitForTimeout(500)

    // Clic en botón editar
    const editBtn = page.locator('[data-testid="edit-planning-btn"]').first()
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Modal abierto en modo edición
    const modal = page.locator('[data-testid="planning-modal"]')
    await expect(modal).toBeVisible()

    // Actualizar tema indispensable
    const themeInput = page.locator('[data-testid="planning-indispensable-theme-input"]')
    await themeInput.fill(UPDATED_THEME)

    // Guardar actualización
    const submitBtn = page.locator('[data-testid="planning-submit-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Verificar en PostgreSQL que el campo fue actualizado
    const db = require('../../../backend/src/database')
    const updatedInDb = await db('school.academic_plannings')
      .where({ indispensable_theme: UPDATED_THEME })
      .first()

    expect(updatedInDb).toBeDefined()
    expect(updatedInDb.indispensable_theme).toBe(UPDATED_THEME)
  })

  test('TC-PLN-04: Eliminación lógica (Delete/Inactivate) con soft-delete en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/planning')
    await page.waitForLoadState('networkidle')

    // Filtrar la planificación actualizada
    const searchInput = page.locator('[data-testid="planning-search-input"]')
    await searchInput.fill(UPDATED_THEME)
    await page.waitForTimeout(500)

    // Clic en botón eliminar de la tarjeta
    const deleteBtn = page.locator('[data-testid="delete-planning-btn"]').first()
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // Modal de confirmación
    const deleteModal = page.locator('[data-testid="planning-delete-modal"]')
    await expect(deleteModal).toBeVisible()

    // Confirmar eliminación
    const confirmBtn = page.locator('[data-testid="confirm-delete-planning-btn"]')
    await confirmBtn.click()

    await expect(deleteModal).not.toBeVisible({ timeout: 10000 })

    // Verificar en PostgreSQL que is_deleted = true
    const db = require('../../../backend/src/database')
    const planInDb = await db('school.academic_plannings')
      .where({ indispensable_theme: UPDATED_THEME })
      .first()

    expect(planInDb).toBeDefined()
    expect(planInDb.is_deleted).toBe(true)
  })

})
