import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Diplomas y Certificados de Honor: Verificación Triple contra PostgreSQL', () => {

  const TEST_RECIPIENT = 'Alejandro Rafael Silva E2E'
  const TEST_YEAR = '2026-2027'
  const TEST_YEAR_UPDATED = '2026-2027 (Cohorte Honor)'
  const TEST_GRADE = '19.85'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.certificates')
        .where('recipient_name', 'like', '%Silva E2E%')
        .del()
    } catch (_) {}
  })

  test('TC-CERT-01: Carga la vista de Diplomas con marco ceremonial, toolbar y selector', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Certificados y Diplomas de Honor' })
    await expect(heading).toBeVisible()

    // Botón de emisión
    await expect(page.locator('[data-testid="btn-open-create-cert"]')).toBeVisible()
  })

  test('TC-CERT-02: Emisión (Create) de nuevo diploma ceremonial persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Abrir modal de emisión
    await page.locator('[data-testid="btn-open-create-cert"]').click()
    await expect(page.locator('[data-testid="input-cert-recipient-name"]')).toBeVisible()

    // Llenar datos requeridos
    await page.locator('[data-testid="input-cert-recipient-name"]').fill(TEST_RECIPIENT)
    await page.locator('[data-testid="select-cert-type"]').selectOption('excelencia_academica')
    await page.locator('[data-testid="input-cert-academic-year"]').fill(TEST_YEAR)
    await page.locator('[data-testid="input-cert-average"]').fill(TEST_GRADE)
    await page.locator('[data-testid="textarea-cert-description"]').fill('Por excelencia académica y méritos demostrados en el período.')

    // Guardar
    await page.locator('[data-testid="btn-save-cert"]').click()

    // Modal debe cerrarse
    await expect(page.locator('[data-testid="input-cert-recipient-name"]')).not.toBeVisible()

    // Verificación en la UI (en el lienzo ceremonial)
    await expect(page.locator('[data-testid="cert-recipient-canvas"]')).toContainText(TEST_RECIPIENT, { timeout: 10000 })

    // Verificación directa en PostgreSQL
    const db = require('../../../backend/src/database')
    const certInDb = await db('school.certificates')
      .where({ recipient_name: TEST_RECIPIENT, is_deleted: false })
      .first()

    expect(certInDb).toBeDefined()
    expect(certInDb.academic_year).toBe(TEST_YEAR)
    expect(Number(certInDb.average_grade)).toBeCloseTo(19.85, 2)
    expect(certInDb.verification_code).toContain('CERT-')
  })

  test('TC-CERT-03: Modificación (Update) de diploma ceremonial persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Pulsar botón Editar
    const editBtn = page.locator('[data-testid="btn-edit-cert"]')
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Modificar año académico
    const yearInput = page.locator('[data-testid="input-cert-academic-year"]')
    await expect(yearInput).toBeVisible()
    await yearInput.fill(TEST_YEAR_UPDATED)

    // Guardar
    await page.locator('[data-testid="btn-save-cert"]').click()
    await expect(yearInput).not.toBeVisible()

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const updatedCert = await db('school.certificates')
      .where({ recipient_name: TEST_RECIPIENT, is_deleted: false })
      .first()

    expect(updatedCert).toBeDefined()
    expect(updatedCert.academic_year).toBe(TEST_YEAR_UPDATED)
  })

  test('TC-CERT-04: Verificación pública del diploma ceremonial por código QR / URL', async ({ page }) => {
    const db = require('../../../backend/src/database')
    const cert = await db('school.certificates')
      .where({ recipient_name: TEST_RECIPIENT, is_deleted: false })
      .first()

    expect(cert).toBeDefined()

    // Navegación anónima a la URL de validación QR
    await page.goto(`/verificar-boleta/${cert.verification_code}`)
    await page.waitForLoadState('networkidle')

    // Vista de verificación pública activa sin 401
    await expect(page.locator('h1, h2, h3', { hasText: /Verificación|Documento|U.E Santa Luisa/i }).first()).toBeVisible()
  })

  test('TC-CERT-05: Anulación / Eliminación (Soft Delete) del diploma ceremonial', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Pulsar botón Anular
    const deleteBtn = page.locator('[data-testid="btn-delete-cert"]')
    await expect(deleteBtn).toBeVisible({ timeout: 10000 })
    await deleteBtn.click()

    // Confirmar en modal
    const confirmBtn = page.locator('[data-testid="btn-confirm-delete-cert"]')
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // Modal se cierra
    await expect(confirmBtn).not.toBeVisible()

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const deletedCert = await db('school.certificates')
      .where({ recipient_name: TEST_RECIPIENT })
      .first()

    expect(deletedCert).toBeDefined()
    expect(deletedCert.is_deleted).toBe(true)
  })
})
