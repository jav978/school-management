import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo 16: Finanzas y Conciliación de Pagos - Verificación Triple contra PostgreSQL', () => {

  const TEST_FIRST_NAME = 'Alejandro'
  const TEST_LAST_NAME = 'Montesinos E2E'
  const TEST_ID_CARD = 'V-20112233'
  const TEST_PHONE = '+58 412 9988776'
  const TEST_REF = `REF-E2E-${Date.now().toString().slice(-6)}`
  const TEST_AMOUNT = '85.50'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.payments')
        .where('payer_last_name', 'like', '%Montesinos E2E%')
        .del()
    } catch (_) {}
  })

  test.afterAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.payments')
        .where('payer_last_name', 'like', '%Montesinos E2E%')
        .del()
    } catch (_) {}
  })

  test('TC-FIN-01: Carga la vista de Finanzas y Tesorería con KPIs y botón Registrar Pago', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/finance')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Finanzas y Tesorería' })
    await expect(heading).toBeVisible()

    // Botón de registrar pago
    const createBtn = page.locator('[data-testid="create-payment-btn"]')
    await expect(createBtn).toBeVisible()
  })

  test('TC-FIN-02: Registro (Create) de nueva operación de pago persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/finance')
    await page.waitForLoadState('networkidle')

    // Abrir modal de pago
    await page.locator('[data-testid="create-payment-btn"]').click()
    await expect(page.locator('[data-testid="payment-payer-first-name"]')).toBeVisible()

    // Llenar formulario
    await page.locator('[data-testid="payment-payer-first-name"]').fill(TEST_FIRST_NAME)
    await page.locator('[data-testid="payment-payer-last-name"]').fill(TEST_LAST_NAME)
    await page.locator('[data-testid="payment-payer-id-card"]').fill(TEST_ID_CARD)
    await page.locator('[data-testid="payment-payer-phone"]').fill(TEST_PHONE)
    await page.locator('[data-testid="payment-type-select"]').selectOption('pago movil')
    await page.locator('[data-testid="payment-bank-select"]').selectOption('Banesco')
    await page.locator('[data-testid="payment-reference-input"]').fill(TEST_REF)
    await page.locator('[data-testid="payment-amount-input"]').fill(TEST_AMOUNT)
    await page.locator('[data-testid="payment-status-select"]').selectOption('pendiente')
    await page.locator('[data-testid="payment-notes-input"]').fill('Mensualidad E2E Octubre 2026')

    // Guardar
    await page.locator('[data-testid="submit-payment-btn"]').click()

    // Modal se cierra
    await expect(page.locator('[data-testid="payment-payer-first-name"]')).not.toBeVisible()

    // Verificación en la UI
    const row = page.locator('[data-testid="payment-row"]', { hasText: TEST_LAST_NAME })
    await expect(row).toBeVisible({ timeout: 10000 })
    await expect(row).toContainText(TEST_REF)
    await expect(row.locator('[data-testid="payment-status-badge"]')).toContainText('pendiente')

    // Verificación directa en PostgreSQL
    const db = require('../../../backend/src/database')
    const paymentInDb = await db('school.payments')
      .where({ reference_number: TEST_REF, is_deleted: false })
      .first()

    expect(paymentInDb).toBeDefined()
    expect(paymentInDb.payer_first_name).toBe(TEST_FIRST_NAME)
    expect(paymentInDb.payer_last_name).toBe(TEST_LAST_NAME)
    expect(Number(paymentInDb.amount)).toBeCloseTo(85.50, 2)
    expect(paymentInDb.bank_origin).toBe('Banesco')
    expect(paymentInDb.status).toBe('pendiente')
  })

  test('TC-FIN-03: Conciliación / Aprobación rápida (Update) de pago y reflejo en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/finance')
    await page.waitForLoadState('networkidle')

    const row = page.locator('[data-testid="payment-row"]', { hasText: TEST_LAST_NAME })
    await expect(row).toBeVisible()

    // Botón de aprobación rápida
    const approveBtn = row.locator('[data-testid="approve-payment-btn"]')
    await expect(approveBtn).toBeVisible()
    await approveBtn.click()

    // Verificar en UI cambio a verificado
    await expect(row.locator('[data-testid="payment-status-badge"]')).toContainText('verificado', { timeout: 10000 })

    // Verificación directa en PostgreSQL
    const db = require('../../../backend/src/database')
    const updatedPayment = await db('school.payments')
      .where({ reference_number: TEST_REF, is_deleted: false })
      .first()

    expect(updatedPayment).toBeDefined()
    expect(updatedPayment.status).toBe('verificado')
  })

  test('TC-FIN-04: Eliminación (Soft Delete) de registro de pago persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/finance')
    await page.waitForLoadState('networkidle')

    const row = page.locator('[data-testid="payment-row"]', { hasText: TEST_LAST_NAME })
    await expect(row).toBeVisible()

    // Abrir modal de confirmación de eliminación
    await row.locator('[data-testid="delete-payment-btn"]').click()
    await expect(page.locator('[data-testid="confirm-delete-payment-btn"]')).toBeVisible()

    // Confirmar eliminación
    await page.locator('[data-testid="confirm-delete-payment-btn"]').click()
    await expect(page.locator('[data-testid="confirm-delete-payment-btn"]')).not.toBeVisible()

    // En UI ya no debe estar visible
    await expect(page.locator('[data-testid="payment-row"]', { hasText: TEST_REF })).not.toBeVisible({ timeout: 10000 })

    // Verificación directa en PostgreSQL: is_deleted = true
    const db = require('../../../backend/src/database')
    const deletedPayment = await db('school.payments')
      .where({ reference_number: TEST_REF })
      .first()

    expect(deletedPayment).toBeDefined()
    expect(deletedPayment.is_deleted).toBe(true)
  })
})
