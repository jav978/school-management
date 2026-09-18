import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Carnets de Identificación Escolar: Verificación Triple contra PostgreSQL', () => {

  const TEST_RECIPIENT_NAME = 'Sofía Valentina Morales E2E'
  const TEST_ID_CARD = 'V-32987654'
  const TEST_POSITION = '4to Año Sección B'
  const TEST_POSITION_UPDATED = '5to Año Sección A - Graduando'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.id_cards')
        .where('recipient_name', 'like', '%Morales E2E%')
        .del()
    } catch (_) {}
  })

  test('TC-CRD-01: Carga la vista de Carnets con interfaz estándar, filtros y acciones', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // Título y encabezado institucional
    const heading = page.locator('h1', { hasText: 'Carnets de Identificación Escolar' })
    await expect(heading).toBeVisible()

    // Botones de emisión e impresión
    await expect(page.locator('[data-testid="btn-open-create-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="select-filter-card-type"]')).toBeVisible()
  })

  test('TC-CRD-02: Emisión (Create) de nuevo carnet escolar persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // Abrir modal de emisión
    await page.locator('[data-testid="btn-open-create-card"]').click()
    await expect(page.locator('[data-testid="input-card-recipient-name"]')).toBeVisible()

    // Llenar campos requeridos
    await page.locator('[data-testid="input-card-recipient-name"]').fill(TEST_RECIPIENT_NAME)
    await page.locator('[data-testid="input-card-recipient-id"]').fill(TEST_ID_CARD)
    await page.locator('[data-testid="select-card-recipient-type"]').selectOption('estudiante')
    await page.locator('[data-testid="input-card-position"]').fill(TEST_POSITION)

    // Enviar formulario
    await page.locator('[data-testid="btn-save-card"]').click()

    // Toast o modal cerrado
    await expect(page.locator('[data-testid="input-card-recipient-name"]')).not.toBeVisible()

    // Verificación en la UI
    await expect(page.locator(`text=${TEST_RECIPIENT_NAME}`).first()).toBeVisible({ timeout: 10000 })

    // Verificación directa en PostgreSQL
    const db = require('../../../backend/src/database')
    const cardInDb = await db('school.id_cards')
      .where({ recipient_id_card: TEST_ID_CARD, is_deleted: false })
      .first()

    expect(cardInDb).toBeDefined()
    expect(cardInDb.recipient_name).toBe(TEST_RECIPIENT_NAME)
    expect(cardInDb.position).toBe(TEST_POSITION)
    expect(cardInDb.card_code).toContain('CRD-')
  })

  test('TC-CRD-03: Modificación (Update) de datos del carnet escolar persistido en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // Localizar la tarjeta del carnet de prueba y hacer clic en Editar
    const cardContainer = page.locator('[data-testid="id-card-item"]', { hasText: TEST_RECIPIENT_NAME }).first()
    await expect(cardContainer).toBeVisible()

    const editBtn = cardContainer.locator('[data-testid="btn-edit-card"]')
    await editBtn.click()

    // Cambiar cargo/grado
    const positionInput = page.locator('[data-testid="input-card-position"]')
    await expect(positionInput).toBeVisible()
    await positionInput.fill(TEST_POSITION_UPDATED)

    // Guardar cambios
    await page.locator('[data-testid="btn-save-card"]').click()
    await expect(positionInput).not.toBeVisible()

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const updatedCard = await db('school.id_cards')
      .where({ recipient_id_card: TEST_ID_CARD, is_deleted: false })
      .first()

    expect(updatedCard).toBeDefined()
    expect(updatedCard.position).toBe(TEST_POSITION_UPDATED)
  })

  test('TC-CRD-04: Verificación pública del carnet institucional por código QR/URL', async ({ page }) => {
    // Obtener código de carnet desde la base de datos
    const db = require('../../../backend/src/database')
    const card = await db('school.id_cards')
      .where({ recipient_id_card: TEST_ID_CARD, is_deleted: false })
      .first()

    expect(card).toBeDefined()

    // Navegar sin login previo a la ruta de verificación
    await page.goto(`/verificar-boleta/${card.card_code}`)
    await page.waitForLoadState('networkidle')

    // Debe mostrar la vista de verificación sin error 401
    await expect(page.locator('h1, h2, h3', { hasText: /Verificación|Documento|U.E Santa Luisa/i }).first()).toBeVisible()
  })

  test('TC-CRD-05: Revocación / Eliminación (Soft Delete) del carnet escolar', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // Localizar tarjeta y pulsar Revocar
    const cardContainer = page.locator('[data-testid="id-card-item"]', { hasText: TEST_RECIPIENT_NAME }).first()
    await expect(cardContainer).toBeVisible()

    const revokeBtn = cardContainer.locator('[data-testid="btn-revoke-card"]')
    await revokeBtn.click()

    // Confirmar en el modal
    const confirmBtn = page.locator('[data-testid="btn-confirm-revoke"]')
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // Modal de confirmación desaparece y la tarjeta se oculta
    await expect(confirmBtn).not.toBeVisible()
    await expect(page.locator(`text=${TEST_RECIPIENT_NAME}`)).not.toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const revokedCard = await db('school.id_cards')
      .where({ recipient_id_card: TEST_ID_CARD })
      .first()

    expect(revokedCard).toBeDefined()
    expect(revokedCard.is_deleted).toBe(true)
  })

  test('TC-CRD-06: Selección de estudiante autocompleta documento válido sin dejar "V-" aislado', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // Abrir modal de creación
    await page.locator('[data-testid="btn-open-create-card"]').click()
    await expect(page.locator('[data-testid="input-card-recipient-name"]')).toBeVisible()

    // Si hay un selector de estudiantes registrados, probar la selección
    const studentSelect = page.locator('select', { hasText: /Ingresar datos manualmente/i })
    if (await studentSelect.isVisible()) {
      const options = await studentSelect.locator('option').allInnerTexts()
      if (options.length > 1) {
        // Seleccionar la segunda opción (primer estudiante real)
        await studentSelect.selectOption({ index: 1 })
        
        // Verificar que el campo cédula no sea exactamente 'V-'
        const idVal = await page.locator('[data-testid="input-card-recipient-id"]').inputValue()
        expect(idVal).not.toBe('V-')
        expect(idVal.length).toBeGreaterThan(2)
      }
    }

    // Cerrar modal
    await page.locator('button', { hasText: 'Cancelar' }).click()
  })

  test('TC-CRD-07: Asistente de Lote por Sección y Vista de Impresión Dúplex en Hoja Carta', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // Abrir asistente de lote
    const batchBtn = page.locator('[data-testid="btn-open-batch-modal"]')
    await expect(batchBtn).toBeVisible()
    await batchBtn.click()

    // Modal de lote debe ser visible
    await expect(page.locator('h3', { hasText: /Emisión e Impresión por Lote de Sección/i })).toBeVisible()

    // Botón para previsualizar hoja carta dúplex
    const previewDuplexBtn = page.locator('button', { hasText: /Previsualizar Hoja Carta Dúplex/i })
    await expect(previewDuplexBtn).toBeVisible()
    await previewDuplexBtn.click()

    // Vista Dúplex debe desplegarse
    await expect(page.locator('h2', { hasText: /Impresión Dúplex en Hoja Carta/i })).toBeVisible()
    await expect(page.locator('text=ANVERSO (FRENTES)').first()).toBeVisible()
    await expect(page.locator('text=REVERSO (DORSOS EN ESPEJO DÚPLEX)').first()).toBeVisible()

    // Botón de imprimir debe estar disponible
    await expect(page.locator('button', { hasText: /Imprimir Hojas Dúplex/i })).toBeVisible()

    // Cerrar vista dúplex
    await page.locator('[data-testid="btn-close-duplex"]').click()
    await expect(page.locator('h2', { hasText: /Impresión Dúplex en Hoja Carta/i })).not.toBeVisible()
  })

  test('TC-CRD-08: Renderizado de Plantillas Duales (Estudiante vs Personal Trabajador)', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/idcards')
    await page.waitForLoadState('networkidle')

    // 1. Emitir un carnet de Personal Trabajador (Docente)
    const STAFF_NAME = 'Prof. Carlos Mendoza ' + Date.now().toString().slice(-4)
    const STAFF_ID = 'V-18' + Math.floor(100000 + Math.random() * 900000)

    await page.locator('[data-testid="btn-open-create-card"]').click()
    await expect(page.locator('[data-testid="input-card-recipient-name"]')).toBeVisible()

    await page.locator('[data-testid="input-card-recipient-name"]').fill(STAFF_NAME)
    await page.locator('[data-testid="input-card-recipient-id"]').fill(STAFF_ID)
    await page.locator('[data-testid="select-card-recipient-type"]').selectOption('profesor')
    await page.locator('[data-testid="input-card-position"]').fill('Docente de Ciencias')

    await page.locator('[data-testid="btn-save-card"]').click()
    await expect(page.locator('[data-testid="input-card-recipient-name"]')).not.toBeVisible()

    // 2. Verificar que en la tarjeta individual de Personal se renderice la plantilla ejecutiva (Modelo 2)
    const staffCardContainer = page.locator('[data-testid="id-card-item"]', { hasText: STAFF_NAME }).first()
    await expect(staffCardContainer).toBeVisible({ timeout: 10000 })
    
    // Elementos exclusivos de la plantilla de Personal Trabajador
    await expect(staffCardContainer.locator('text=Credencial de Personal').first()).toBeVisible()
    await expect(staffCardContainer.locator('text=Credencial Laboral Institucional').first()).toBeVisible()
    await expect(staffCardContainer.locator('text=CONTROL LABORAL Y ACCESO QR').first()).toBeVisible()
    await expect(staffCardContainer.locator('text=Sor Yolanda Zambrano • Directora').first()).toBeVisible()

    // 3. Limpieza: Revocar el carnet de prueba para mantener idempotencia
    const revokeBtn = staffCardContainer.locator('[data-testid="btn-revoke-card"]')
    await revokeBtn.click()
    const confirmModal = page.locator('[data-testid="btn-confirm-revoke"]')
    await expect(confirmModal).toBeVisible()
    await confirmModal.click()
    await expect(confirmModal).not.toBeVisible()
  })
})

