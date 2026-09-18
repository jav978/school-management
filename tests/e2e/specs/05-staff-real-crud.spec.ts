import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Personal y Colaboradores (Staff): CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.staff').where({ national_id: 'V-22333444' }).del()
      await db('school.staff').where({ national_id: 'V-33444555' }).del()
      await db('school.users').where({ email: 'mariana.perez@santaluisa.edu.ve' }).del()
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

    // Llenar campos requeridos y nuevos campos institucionales con data-testid
    await page.locator('[data-testid="staff-id-input"]').fill('PERS-8811')
    await page.locator('[data-testid="staff-id-card-input"]').fill('V-22333444')
    await page.locator('[data-testid="staff-type-select"]').selectOption('profesional')
    await page.locator('[data-testid="staff-hire-date-input"]').fill('2022-03-15')
    await page.locator('[data-testid="staff-firstname-input"]').fill('Héctor')
    await page.locator('[data-testid="staff-lastname-input"]').fill('Bermúdez')
    await page.locator('[data-testid="staff-dob-input"]').fill('1988-07-20')
    await page.locator('[data-testid="staff-gender-select"]').selectOption('masculino')
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
    await expect(page.locator('text="2022-03-15"')).toBeVisible()
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

  test('TC-STF-05: Aprovisionamiento 1-Click de Cuenta de Usuario y Enlace con Carnetización', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/staff')
    await page.waitForLoadState('networkidle')

    // Abrir modal
    const newBtn = page.locator('[data-testid="create-staff-btn"]')
    await newBtn.click()

    const modal = page.locator('[data-testid="staff-modal"]')
    await expect(modal).toBeVisible()

    // Llenar datos del colaborador
    await page.locator('[data-testid="staff-id-input"]').fill('PERS-9922')
    await page.locator('[data-testid="staff-id-card-input"]').fill('V-33444555')
    await page.locator('[data-testid="staff-type-select"]').selectOption('administrativo')
    await page.locator('[data-testid="staff-firstname-input"]').fill('Mariana')
    await page.locator('[data-testid="staff-lastname-input"]').fill('Pérez')
    await page.locator('[data-testid="staff-position-input"]').fill('Analista de Control de Estudios')
    await page.locator('[data-testid="staff-department-input"]').fill('Control de Estudios y Evaluación')
    await page.locator('[data-testid="staff-email-input"]').fill('mariana.perez@santaluisa.edu.ve')
    await page.locator('[data-testid="staff-phone-input"]').fill('+58 412 111 2233')

    // Activar aprovisionamiento 1-Click de cuenta de usuario
    const userToggle = page.locator('[data-testid="staff-create-user-toggle"]')
    await userToggle.check({ force: true })

    // Llenar contraseña
    const passInput = page.locator('[data-testid="staff-user-password-input"]')
    await expect(passInput).toBeVisible()
    await passInput.fill('SantaLuisa.2026!*')

    // Guardar
    const submitBtn = page.locator('[data-testid="submit-staff-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Verificar en la tarjeta que aparece "Mariana Pérez" con el badge de cuenta activa
    const staffCard = page.locator('[data-testid="staff-card"]', { hasText: 'Mariana Pérez' })
    await expect(staffCard).toBeVisible({ timeout: 10000 })

    const accountBadge = staffCard.locator('[data-testid="staff-account-badge"]')
    await expect(accountBadge).toContainText('Cuenta Activa')

    const carnetBadge = staffCard.locator('[data-testid="staff-carnet-badge"]')
    await expect(carnetBadge).toBeVisible()

    // Validar enlace directo a Carnet
    const carnetLink = staffCard.locator('[data-testid="staff-carnet-link"]')
    await expect(carnetLink).toBeVisible()
    await expect(carnetLink).toHaveAttribute('href', /idcards/)

    // Validar persistencia real en PostgreSQL para school.users
    const db = require('../../../backend/src/database')
    const user = await db('school.users').where({ email: 'mariana.perez@santaluisa.edu.ve' }).first()
    expect(user).toBeDefined()
    expect(user.role).toBe('staff')
    expect(user.is_active).toBe(true)
  })

})
