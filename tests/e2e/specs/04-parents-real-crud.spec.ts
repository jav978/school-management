import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Padres y Representantes: CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.parents').where({ national_id: 'V-18999888' }).del()
    } catch (_) {}
  })

  test('TC-PAR-01: Carga la lista real de representantes desde PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/parents')
    await page.waitForLoadState('networkidle')

    // Título institucional visible
    const heading = page.locator('h1', { hasText: 'Padres y Representantes Legales' })
    await expect(heading).toBeVisible()

    // 4 Tarjetas KPI visibles
    const kpiTotal = page.locator('.glass-card', { hasText: 'TOTAL REPRESENTANTES' })
    await expect(kpiTotal).toBeVisible()

    const kpiEmergency = page.locator('.glass-card', { hasText: 'CONTACTOS EMERGENCIA' })
    await expect(kpiEmergency).toBeVisible()

    // Botón de nuevo representante
    const newBtn = page.locator('[data-testid="create-parent-btn"]')
    await expect(newBtn).toBeVisible()
  })

  test('TC-PAR-02: Creación (Create) de nuevo representante persistido en base de datos', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/parents')
    await page.waitForLoadState('networkidle')

    // Abrir modal de nuevo representante
    const newBtn = page.locator('[data-testid="create-parent-btn"]')
    await expect(newBtn).toBeVisible()
    await newBtn.click()

    // Modal debe aparecer
    const modal = page.locator('.animate-scale-up', { hasText: 'Registro de Representante' })
    await expect(modal).toBeVisible()

    // Llenar campos requeridos
    await modal.locator('input[placeholder*="14645240"]').fill('18999888')
    await modal.locator('input[placeholder="Ej. Roberto Carlos"]').fill('Mariana')
    await modal.locator('input[placeholder="Ej. Pérez Silva"]').fill('Colmenares')
    await modal.locator('select').first().selectOption('Madre')
    await modal.locator('input[placeholder*="+58 414"]').fill('+58 412 111 2233')
    await modal.locator('input[placeholder*="representante@email.com"]').fill('mariana.colmenares@gmail.com')
    await modal.locator('input[placeholder*="Contador Público"]').fill('Arquitecta')

    // Guardar
    const submitBtn = modal.locator('[data-testid="submit-parent-btn"]')
    await submitBtn.click()

    // Modal se cierra y el representante aparece en el directorio
    await expect(modal).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="Mariana Colmenares"')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="V-18999888"')).toBeVisible()
  })

  test('TC-PAR-03: Edición (Update) de representante persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/parents')
    await page.waitForLoadState('networkidle')

    // Localizar tarjeta del representante
    const parentCard = page.locator('.glass-card', { hasText: 'V-18999888' })
    await expect(parentCard).toBeVisible()

    // Clic en editar
    const editBtn = parentCard.locator('[data-testid="edit-parent-btn"]')
    await editBtn.click()

    // Modal de edición
    const modal = page.locator('.animate-scale-up', { hasText: 'Editar Ficha del Representante' })
    await expect(modal).toBeVisible()

    // Actualizar ocupación
    const occInput = modal.locator('input[placeholder*="Contador Público"]')
    await occInput.fill('Directora de Proyectos Urbanos')

    // Guardar cambios
    const submitBtn = modal.locator('[data-testid="submit-parent-btn"]')
    await submitBtn.click()

    await expect(modal).not.toBeVisible({ timeout: 10000 })

    // Recargar página para validar persistencia real desde PostgreSQL
    await page.reload()
    await page.waitForLoadState('networkidle')

    const updatedCard = page.locator('.glass-card', { hasText: 'V-18999888' })
    await expect(updatedCard).toContainText('Directora de Proyectos Urbanos')
  })

  test('TC-PAR-04: Eliminación (Soft-delete / Remove) de representante', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/parents')
    await page.waitForLoadState('networkidle')

    const parentCard = page.locator('.glass-card', { hasText: 'V-18999888' })
    await expect(parentCard).toBeVisible()

    // Clic en eliminar
    const deleteBtn = parentCard.locator('[data-testid="delete-parent-btn"]')
    await deleteBtn.click()

    // Modal de confirmación
    const confirmModal = page.locator('.animate-scale-up', { hasText: '¿Eliminar a este representante?' })
    await expect(confirmModal).toBeVisible()

    const confirmBtn = page.locator('[data-testid="confirm-delete-parent-btn"]')
    await confirmBtn.click()

    await expect(confirmModal).not.toBeVisible()

    // El representante ya no debe aparecer en la lista activa
    await page.waitForTimeout(1000)
    await expect(page.locator('text="V-18999888"')).not.toBeVisible()
  })

})
