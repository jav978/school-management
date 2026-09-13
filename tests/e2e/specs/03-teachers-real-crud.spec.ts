import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Profesores: CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.teachers').where({ employee_id: 'PROF-TEST-99' }).del()
      await db('school.users').where({ email: 'prof.e2e.test@santaluisa.edu.ve' }).del()
    } catch (_) {}
  })

  test('TC-TEA-01: Carga la lista real de profesores desde PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/teachers')
    await page.waitForLoadState('networkidle')

    // Título institucional visible
    const heading = page.locator('h1', { hasText: 'Cuerpo Docente' })
    await expect(heading).toBeVisible()

    // El profesor real de la base de datos (Marcos Paredes / PROF-008) debe existir
    const existingTeacher = page.locator('text="Marcos Paredes"')
    await expect(existingTeacher).toBeVisible()

    // Las tarjetas KPI deben renderizar
    const kpiTotal = page.locator('.glass-card', { hasText: 'TOTAL PROFESORES' })
    await expect(kpiTotal).toBeVisible()
  })

  test('TC-TEA-02: Creación (Create) de nuevo docente persistido en base de datos', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/teachers')
    await page.waitForLoadState('networkidle')

    // Abrir modal de nuevo profesor
    const newBtn = page.locator('[data-testid="create-teacher-btn"]')
    await expect(newBtn).toBeVisible()
    await newBtn.click()

    // Modal debe aparecer
    const modal = page.locator('.animate-scale-up', { hasText: 'Registro de Profesor' })
    await expect(modal).toBeVisible()

    // Llenar campos requeridos
    await modal.locator('input[placeholder="Ej. PROF-001"]').fill('PROF-TEST-99')
    await modal.locator('input[placeholder="Ej. Roberto José"]').fill('Gabriela')
    await modal.locator('input[placeholder="Ej. Sánchez Mora"]').fill('Mendoza')
    await modal.locator('input[placeholder="Ej. Matemáticas y Física"]').fill('Física Cuántica')
    await modal.locator('input[placeholder="profesor@santaluisa.edu.ve"]').fill('prof.e2e.test@santaluisa.edu.ve')
    await modal.locator('input[placeholder="+58 412 555 0000"]').fill('+58 414 999 8888')

    // Guardar
    const submitBtn = modal.locator('[data-testid="submit-teacher-btn"]')
    await submitBtn.click()

    // Modal se cierra y el docente aparece en la cuadrícula
    await expect(modal).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="Gabriela Mendoza"')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="PROF-TEST-99"')).toBeVisible()
  })

  test('TC-TEA-03: Edición (Update) de docente con persistencia en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/teachers')
    await page.waitForLoadState('networkidle')

    // Localizar tarjeta del profesor creado
    const teacherCard = page.locator('.glass-card', { hasText: 'PROF-TEST-99' })
    await expect(teacherCard).toBeVisible()

    // Clic en botón editar
    const editBtn = teacherCard.locator('[data-testid="edit-teacher-btn"]')
    await editBtn.click()

    // Modal de edición
    const modal = page.locator('.animate-scale-up', { hasText: 'Editar Registro de Profesor' })
    await expect(modal).toBeVisible()

    // Actualizar especialidad
    const specInput = modal.locator('input[placeholder="Ej. Matemáticas y Física"]')
    await specInput.fill('Astrofísica Aplicada y Robótica')

    // Guardar cambios
    const submitBtn = modal.locator('[data-testid="submit-teacher-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Recargar página para validar persistencia real desde PostgreSQL
    await page.reload()
    await page.waitForLoadState('networkidle')

    const updatedCard = page.locator('.glass-card', { hasText: 'PROF-TEST-99' })
    await expect(updatedCard).toContainText('Astrofísica Aplicada y Robótica')
  })

  test('TC-TEA-04: Eliminación (Soft-delete / Remove) de docente de la plantilla', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/teachers')
    await page.waitForLoadState('networkidle')

    const teacherCard = page.locator('.glass-card', { hasText: 'PROF-TEST-99' })
    await expect(teacherCard).toBeVisible()

    // Clic en eliminar
    const deleteBtn = teacherCard.locator('[data-testid="delete-teacher-btn"]')
    await deleteBtn.click()

    // Modal de confirmación
    const confirmModal = page.locator('.animate-scale-up', { hasText: '¿Inhabilitar Profesor?' })
      .or(page.locator('.animate-scale-up', { hasText: '¿Eliminar' }))
    await expect(confirmModal).toBeVisible()

    const confirmBtn = page.locator('[data-testid="confirm-delete-teacher-btn"]')
    await confirmBtn.click()

    await expect(confirmModal).not.toBeVisible()

    // El profesor ya no debe aparecer en la lista activa
    await page.waitForTimeout(1000)
    await expect(page.locator('text="PROF-TEST-99"')).not.toBeVisible()
  })

})
