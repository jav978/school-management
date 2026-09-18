import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo 17: Comunicación y Cartelera de Avisos - Verificación Triple contra PostgreSQL', () => {

  const TEST_TITLE = 'Asamblea General Extraordinaria E2E'
  const TEST_BODY = 'Convocatoria formal para padres, representantes y docentes sobre el cronograma evaluativo.'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.announcements')
        .where('title', 'like', '%Extraordinaria E2E%')
        .del()
    } catch (_) {}
  })

  test.afterAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.announcements')
        .where('title', 'like', '%Extraordinaria E2E%')
        .del()
    } catch (_) {}
  })

  test('TC-COMM-01: Carga la vista de Avisos y Comunicados con KPIs y botón Nuevo Comunicado', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/communication')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Avisos y Comunicados' })
    await expect(heading).toBeVisible()

    // Botón de nuevo comunicado
    const createBtn = page.locator('[data-testid="create-announcement-btn"]')
    await expect(createBtn).toBeVisible()
  })

  test('TC-COMM-02: Publicación (Create) de nuevo comunicado persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/communication')
    await page.waitForLoadState('networkidle')

    // Abrir modal de nuevo comunicado
    await page.locator('[data-testid="create-announcement-btn"]').click()
    await expect(page.locator('[data-testid="announcement-title-input"]')).toBeVisible()

    // Llenar datos
    await page.locator('[data-testid="announcement-title-input"]').fill(TEST_TITLE)
    await page.locator('[data-testid="announcement-priority-select"]').selectOption('urgent')
    await page.locator('[data-testid="announcement-pinned-checkbox"]').check()
    await page.locator('[data-testid="announcement-body-input"]').fill(TEST_BODY)

    // Publicar
    await page.locator('[data-testid="submit-announcement-btn"]').click()

    // Modal se cierra
    await expect(page.locator('[data-testid="announcement-title-input"]')).not.toBeVisible()

    // Verificación en la UI (tarjeta visible)
    const card = page.locator('[data-testid="announcement-card"]', { hasText: TEST_TITLE })
    await expect(card).toBeVisible({ timeout: 10000 })
    await expect(card.locator('[data-testid="announcement-priority-badge"]')).toContainText('Urgente')
    await expect(card).toContainText('Destacado')

    // Verificación directa en PostgreSQL
    const db = require('../../../backend/src/database')
    const announcementInDb = await db('school.announcements')
      .where({ title: TEST_TITLE, is_deleted: false })
      .first()

    expect(announcementInDb).toBeDefined()
    expect(announcementInDb.body).toBe(TEST_BODY)
    expect(announcementInDb.priority).toBe('urgent')
    expect(announcementInDb.is_pinned).toBe(true)
  })

  test('TC-COMM-03: Modificación (Update) de comunicado persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/communication')
    await page.waitForLoadState('networkidle')

    const card = page.locator('[data-testid="announcement-card"]', { hasText: TEST_TITLE })
    await expect(card).toBeVisible()

    // Abrir modal de edición
    await card.locator('[data-testid="edit-announcement-btn"]').click()
    await expect(page.locator('[data-testid="announcement-title-input"]')).toBeVisible()

    // Cambiar prioridad a alta
    await page.locator('[data-testid="announcement-priority-select"]').selectOption('high')

    // Guardar cambios
    await page.locator('[data-testid="submit-announcement-btn"]').click()
    await expect(page.locator('[data-testid="announcement-title-input"]')).not.toBeVisible()

    // Verificación en UI
    await expect(card.locator('[data-testid="announcement-priority-badge"]')).toContainText('Alta', { timeout: 10000 })

    // Verificación directa en PostgreSQL
    const db = require('../../../backend/src/database')
    const updatedAnnouncement = await db('school.announcements')
      .where({ title: TEST_TITLE, is_deleted: false })
      .first()

    expect(updatedAnnouncement).toBeDefined()
    expect(updatedAnnouncement.priority).toBe('high')
  })

  test('TC-COMM-04: Retiro / Eliminación (Soft Delete) de comunicado persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/communication')
    await page.waitForLoadState('networkidle')

    const card = page.locator('[data-testid="announcement-card"]', { hasText: TEST_TITLE })
    await expect(card).toBeVisible()

    // Abrir modal de eliminación
    await card.locator('[data-testid="delete-announcement-btn"]').click()
    await expect(page.locator('[data-testid="confirm-delete-announcement-btn"]')).toBeVisible()

    // Confirmar eliminación
    await page.locator('[data-testid="confirm-delete-announcement-btn"]').click()
    await expect(page.locator('[data-testid="confirm-delete-announcement-btn"]')).not.toBeVisible()

    // En UI ya no debe estar visible
    await expect(page.locator('[data-testid="announcement-card"]', { hasText: TEST_TITLE })).not.toBeVisible({ timeout: 10000 })

    // Verificación directa en PostgreSQL: is_deleted = true
    const db = require('../../../backend/src/database')
    const deletedAnnouncement = await db('school.announcements')
      .where({ title: TEST_TITLE })
      .first()

    expect(deletedAnnouncement).toBeDefined()
    expect(deletedAnnouncement.is_deleted).toBe(true)
  })
})
