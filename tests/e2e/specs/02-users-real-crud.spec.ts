import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Usuarios: CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.users').where({ email: 'beatriz.valderrama@santaluisa.edu.ve' }).del()
    } catch (_) {}
  })

  test('TC-USR-01: Carga la lista real de usuarios desde PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.waitForLoadState('networkidle')

    // Título institucional visible
    const heading = page.locator('h1', { hasText: 'Gestión de Usuarios y Accesos' })
    await expect(heading).toBeVisible()

    // El usuario administrador real debe existir en la lista
    const adminUser = page.locator('text="admin@santaluisa.edu.ve"')
    await expect(adminUser).toBeVisible()

    // Las tarjetas KPI deben renderizar números reales
    const kpiTotal = page.locator('.glass-card', { hasText: 'TOTAL USUARIOS' })
    await expect(kpiTotal).toBeVisible()
  })

  test('TC-USR-02: Creación (Create) de nuevo usuario persistido en base de datos', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.waitForLoadState('networkidle')

    // Abrir modal de nuevo usuario
    const newUserBtn = page.locator('button:has-text("Nuevo Usuario")')
    await expect(newUserBtn).toBeVisible()
    await newUserBtn.click()

    // Modal debe aparecer
    const modal = page.locator('.animate-scale-up', { hasText: 'Nuevo Usuario' })
    await expect(modal).toBeVisible()

    // Llenar formulario dentro del modal
    await modal.locator('input[placeholder*="Carmen Rivas"]').fill('Prof. Beatriz Valderrama')
    await modal.locator('input[placeholder*="usuario@santaluisa.edu.ve"]').fill('beatriz.valderrama@santaluisa.edu.ve')
    await modal.locator('input[placeholder="••••••••"]').fill('segura12345')

    // Seleccionar rol Profesor dentro del formulario
    await modal.locator('select').first().selectOption('teacher')

    // Guardar usuario
    const submitBtn = modal.locator('button:has-text("Crear Usuario")')
    await submitBtn.click()

    // Modal se cierra y usuario aparece en la tabla
    await expect(modal).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="beatriz.valderrama@santaluisa.edu.ve"')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text="Prof. Beatriz Valderrama"')).toBeVisible()
  })

  test('TC-USR-03: Edición (Update) de usuario persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.waitForLoadState('networkidle')

    // Buscar fila de Beatriz Valderrama
    const userRow = page.locator('tr', { hasText: 'beatriz.valderrama@santaluisa.edu.ve' })
    await expect(userRow).toBeVisible()

    // Clic en editar
    const editBtn = userRow.locator('button[title="Editar Usuario"]')
    await editBtn.click()

    // Modal de edición
    const modalTitle = page.locator('h2:has-text("Editar Usuario")')
    await expect(modalTitle).toBeVisible()

    // Modificar nombre
    const nameInput = page.locator('input[placeholder*="Carmen Rivas"]')
    await nameInput.fill('Dra. Beatriz Valderrama PhD')

    // Guardar cambios
    const saveBtn = page.locator('button:has-text("Guardar Cambios")')
    await saveBtn.click()

    await expect(modalTitle).not.toBeVisible()

    // Recargar página para validar persistencia en PostgreSQL
    await page.reload()
    await page.waitForLoadState('networkidle')

    const updatedRow = page.locator('tr', { hasText: 'beatriz.valderrama@santaluisa.edu.ve' })
    await expect(updatedRow).toContainText('Dra. Beatriz Valderrama PhD')
  })

  test('TC-USR-04: Desactivación (Soft-delete / Inactivación) de cuenta', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.waitForLoadState('networkidle')

    const userRow = page.locator('tr', { hasText: 'beatriz.valderrama@santaluisa.edu.ve' })
    await expect(userRow).toBeVisible()

    // Clic en desactivar
    const deleteBtn = userRow.locator('button[title="Desactivar Usuario"]')
    await deleteBtn.click()

    // Modal de confirmación
    const confirmModal = page.locator('h3:has-text("¿Desactivar este usuario?")')
    await expect(confirmModal).toBeVisible()

    const confirmBtn = page.locator('button:has-text("Sí, Desactivar Usuario")')
    await confirmBtn.click()

    await expect(confirmModal).not.toBeVisible()

    // Verificar que el estado cambia a inactive
    await page.waitForTimeout(1000)
    const inactiveBadge = page.locator('tr', { hasText: 'beatriz.valderrama@santaluisa.edu.ve' }).locator('text="inactive"')
    await expect(inactiveBadge).toBeVisible()
  })

})
