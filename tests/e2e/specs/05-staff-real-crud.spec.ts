import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Personal y Colaboradores (Staff): CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.staff').where({ national_id: 'V-22333444' }).del()
    } catch (_) {}
  })

  test('TC-STF-01: Carga la lista real de personal desde PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/staff')
    await page.waitForLoadState('networkidle')

    // Título institucional visible
    const heading = page.locator('h1', { hasText: 'Personal y Colaboradores (Staff)' })
    await expect(heading).toBeVisible()

    // 4 Tarjetas KPI visibles
    const kpiTotal = page.locator('.glass-card', { hasText: 'TOTAL PERSONAL' })
    await expect(kpiTotal).toBeVisible()

    const kpiAdmin = page.locator('.glass-card', { hasText: 'ADMINISTRATIVOS' })
    await expect(kpiAdmin).toBeVisible()

    // Botón de nuevo miembro de personal
    const newBtn = page.locator('[data-testid="create-staff-btn"]')
    await expect(newBtn).toBeVisible()

    // Comprobar que el registro existente de PostgreSQL está renderizado (Rosalba García)
    await expect(page.locator('text="Rosalba García"')).toBeVisible()
    await expect(page.locator('text="Coordinadora de Evaluación"')).toBeVisible()
  })

  test('TC-STF-02: Creación (Create) de nuevo colaborador persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/staff')
    await page.waitForLoadState('networkidle')

    // Abrir modal
    const newBtn = page.locator('[data-testid="create-staff-btn"]')
    await expect(newBtn).toBeVisible()
    await newBtn.click()

    // Modal de registro
    const modal = page.locator('[data-testid="staff-modal"]')
    await expect(modal).toBeVisible()

    // Llenar campos requeridos con data-testid
    await page.locator('[data-testid="staff-id-input"]').fill('PERS-8811')
    await page.locator('[data-testid="staff-id-card-input"]').fill('V-22333444')
    await page.locator('[data-testid="staff-type-select"]').selectOption('profesional')
    await page.locator('[data-testid="staff-firstname-input"]').fill('Héctor')
    await page.locator('[data-testid="staff-lastname-input"]').fill('Bermúdez')
    await page.locator('[data-testid="staff-position-input"]').fill('Especialista en Psicopedagogía')
    await page.locator('[data-testid="staff-department-input"]').fill('Bienestar Estudiantil')
    await page.locator('[data-testid="staff-email-input"]').fill('hector.bermudez@santaluisa.edu.ve')
    await page.locator('[data-testid="staff-phone-input"]').fill('+58 414 999 8877')

    // Guardar
    const submitBtn = page.locator('[data-testid="submit-staff-btn"]')
    await submitBtn.click()

    // Modal se cierra y el colaborador aparece en la lista
    await expect(modal).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="Héctor Bermúdez"')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="Especialista en Psicopedagogía"')).toBeVisible()
  })

  test('TC-STF-03: Edición (Update) de colaborador persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/staff')
    await page.waitForLoadState('networkidle')

    // Localizar tarjeta del colaborador
    const staffCard = page.locator('[data-testid="staff-card"]', { hasText: 'Héctor Bermúdez' })
    await expect(staffCard).toBeVisible()

    // Clic en botón de editar
    const editBtn = staffCard.locator('[data-testid="edit-staff-btn"]')
    await editBtn.click()

    // Modal de edición
    const modal = page.locator('[data-testid="staff-modal"]')
    await expect(modal).toBeVisible()

    // Modificar cargo
    const posInput = page.locator('[data-testid="staff-position-input"]')
    await posInput.fill('Coordinador General de Orientación y Bienestar')

    // Guardar cambios
    const submitBtn = page.locator('[data-testid="submit-staff-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Recargar la página para verificar que la mutación persistió en PostgreSQL
    await page.reload()
    await page.waitForLoadState('networkidle')

    const updatedCard = page.locator('[data-testid="staff-card"]', { hasText: 'Héctor Bermúdez' })
    await expect(updatedCard).toContainText('Coordinador General de Orientación y Bienestar')
  })

  test('TC-STF-04: Inhabilitación (Inactivate / Soft-delete) de colaborador', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/staff')
    await page.waitForLoadState('networkidle')

    const staffCard = page.locator('[data-testid="staff-card"]', { hasText: 'Héctor Bermúdez' })
    await expect(staffCard).toBeVisible()

    // Clic en inhabilitar
    const deleteBtn = staffCard.locator('[data-testid="delete-staff-btn"]')
    await deleteBtn.click()

    // Modal de confirmación
    const confirmModal = page.locator('[data-testid="staff-delete-modal"]')
    await expect(confirmModal).toBeVisible()

    const confirmBtn = page.locator('[data-testid="confirm-delete-staff-btn"]')
    await confirmBtn.click()

    await expect(confirmModal).not.toBeVisible({ timeout: 10000 })

    // Validar que el badge del colaborador cambia a "Inactivo"
    await page.waitForTimeout(1000)
    const inactiveCard = page.locator('[data-testid="staff-card"]', { hasText: 'Héctor Bermúdez' })
    await expect(inactiveCard).toContainText('Inactivo')

    // Probar reactivación
    const reactivateBtn = inactiveCard.locator('[data-testid="reactivate-staff-btn"]')
    await expect(reactivateBtn).toBeVisible()
    await reactivateBtn.click()

    await page.waitForTimeout(1000)
    await expect(inactiveCard).toContainText('Activo')
  })

})
