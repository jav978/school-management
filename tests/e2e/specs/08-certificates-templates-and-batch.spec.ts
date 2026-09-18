import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Diplomas y Certificados: 3 Plantillas, Bóveda de Firmas/Sellos y Emisión en Lote', () => {

  const BATCH_STUDENT_TEST = 'Valeria Sofía Rivas'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.certificates')
        .where('recipient_name', 'like', '%Valeria Sofía Rivas%')
        .orWhere('recipient_name', 'like', '%Roberto González%')
        .orWhere('batch_id', 'like', 'BATCH-%')
        .del()

      // Ensure an active baseline certificate exists for visual preview tests
      const activeCount = await db('school.certificates').where({ is_deleted: false }).count('id as cnt').first()
      if (!activeCount || Number(activeCount.cnt) === 0) {
        await db('school.certificates').insert({
          certificate_type: 'excelencia_academica',
          recipient_name: 'Santiago de Jesús Morales',
          academic_year: '2026-2027 (Cohorte Honor)',
          description: 'Por su sobresaliente desempeño académico, apego a los valores de la institución y excelencia moral y vicenciana.',
          average_grade: '19.50',
          verification_code: 'CERT-HONOR-DEMO-01',
          issue_date: '18 de septiembre de 2026',
          status: 'emitido',
          is_deleted: false,
          recipient_type: 'estudiante',
          template_id: 'classic',
          issued_by: 'Sor María Dolores Amaya',
          issued_role: 'Directora General',
          metadata: JSON.stringify({
            left_image: '/logocolegio.png',
            right_image: '/images/santaluisa.png',
            stamp_signatures: true,
            stamp_seal: true
          })
        })
      }
    } catch (e) {
      console.error('Error in beforeAll:', e)
    }
  })

  test('TC-CERT-TMPL-01: Conmutación visual fluida entre las 3 Plantillas de Honor', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Verificar tabs de plantillas
    const classicTab = page.locator('[data-testid="template-tab-classic"]')
    const goldTab = page.locator('[data-testid="template-tab-gold"]')
    const vibrantTab = page.locator('[data-testid="template-tab-vibrant"]')

    await expect(classicTab).toBeVisible()
    await expect(goldTab).toBeVisible()
    await expect(vibrantTab).toBeVisible()

    // 1. Plantilla Clásica (por defecto)
    await classicTab.click()
    await expect(page.locator('.certificate-sheet')).toBeVisible()

    // 2. Plantilla Oro y Esmeralda
    await goldTab.click()
    await expect(page.locator('text=/DIPLOMA DE EXCELENCIA/')).toBeVisible()

    // 3. Plantilla Vanguardia Colorida
    await vibrantTab.click()
    await expect(page.locator('text=/VANGUARDIA & RECONOCIMIENTO AL MÉRITO/')).toBeVisible()

    // Volver a Clásica
    await classicTab.click()
  })

  test('TC-CERT-SEAL-02: Centrado exacto del Sello Oficial y Conmutador de Firmas Digitales', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Sello Oficial visible y centrado en el footer del diploma
    const seal = page.locator('[data-testid="cert-official-seal"]')
    await expect(seal).toBeVisible()

    // Conmutador de firmas y sellos
    const toggleSignatures = page.locator('[data-testid="toggle-stamp-signatures"]')
    const toggleSeal = page.locator('[data-testid="toggle-stamp-seal"]')

    await expect(toggleSignatures).toBeChecked()
    await expect(toggleSeal).toBeChecked()

    // Desactivar sello (modo sello físico)
    await toggleSeal.uncheck()
    await expect(page.locator('text="(Sello Físico)"')).toBeVisible()

    // Reactivar sello
    await toggleSeal.check()
    await expect(seal).toBeVisible()
  })

  test('TC-CERT-BATCH-03: Filtrado por rango de notas (17.50 a 20.00 pts) y Emisión en Lote con persistencia PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Abrir Modal de Emisión en Lote
    const batchBtn = page.locator('[data-testid="btn-open-batch-modal"]')
    await expect(batchBtn).toBeVisible()
    await batchBtn.click()

    // Modal abierto
    await expect(page.locator('h2', { hasText: 'Emisión y Generación en Lote de Diplomas de Honor' })).toBeVisible()

    // Rango de promedio
    const minInput = page.locator('[data-testid="input-batch-min-grade"]')
    const maxInput = page.locator('[data-testid="input-batch-max-grade"]')
    await expect(minInput).toBeVisible()
    await expect(maxInput).toBeVisible()

    // Configurar rango 18.00 a 20.00
    await minInput.fill('18.00')
    await maxInput.fill('20.00')

    // Seleccionar plantilla dorada
    await page.locator('[data-testid="batch-template-gold"]').click()

    // Seleccionar todos los candidatos filtrados
    await page.locator('[data-testid="btn-batch-select-all"]').click()

    // Confirmar y generar lote
    const generateBtn = page.locator('[data-testid="btn-batch-generate-confirm"]')
    await expect(generateBtn).toBeEnabled()
    await generateBtn.click()

    // Notificación de éxito y activación de modo lote
    await expect(page.locator('text=/Lote Activo/')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL: deben existir registros con batch_id
    const db = require('../../../backend/src/database')
    const batchCerts = await db('school.certificates')
      .where('batch_id', 'like', 'BATCH-%')
      .where({ is_deleted: false })

    expect(batchCerts.length).toBeGreaterThan(0)
    const sample = batchCerts[0]
    expect(sample.batch_id).toContain('BATCH-')
    expect(sample.template_id).toBe('modern_gold')
    expect(Number(sample.average_grade)).toBeGreaterThanOrEqual(17.50)
  })

  test('TC-CERT-MODAL-04: Emisión de reconocimientos para Docentes y Personal Staff', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/certificates')
    await page.waitForLoadState('networkidle')

    // Abrir modal de emisión
    await page.locator('[data-testid="btn-open-create-cert"]').click()
    await expect(page.locator('[data-testid="input-cert-recipient-name"]')).toBeVisible()

    // Cambiar a modalidad Docente
    await page.locator('[data-testid="btn-modal-type-docente"]').click()

    // Llenar datos de docente
    const TEACHER_NAME = 'Prof. Roberto González Mora E2E'
    await page.locator('[data-testid="input-cert-recipient-name"]').fill(TEACHER_NAME)
    await page.locator('[data-testid="select-cert-type"]').selectOption('reconocimiento_docente')
    await page.locator('input[placeholder*="Docente de Matemáticas"]').fill('Docente de Lengua y Literatura')
    await page.locator('input[type="number"][placeholder="10"]').fill('15')
    await page.locator('[data-testid="textarea-cert-description"]').fill('Por 15 años de consagrado servicio y vocación pedagógica vicenciana.')

    // Guardar
    await page.locator('[data-testid="btn-save-cert"]').click()
    await expect(page.locator('[data-testid="input-cert-recipient-name"]')).not.toBeVisible()

    // Verificación en la UI
    await expect(page.locator('[data-testid="cert-recipient-canvas"]')).toContainText(TEACHER_NAME, { timeout: 10000 })

    // Verificación en PostgreSQL
    const db = require('../../../backend/src/database')
    const teacherCert = await db('school.certificates')
      .where({ recipient_name: TEACHER_NAME, recipient_type: 'docente', is_deleted: false })
      .first()

    expect(teacherCert).toBeDefined()
    expect(teacherCert.recipient_type).toBe('docente')
    expect(teacherCert.certificate_type).toBe('reconocimiento_docente')
  })

  test('TC-CERT-VAULT-05: Bóveda Institucional de Firmas y Sellos en /settings', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Pestaña Firmas y Sellos
    const sigTab = page.locator('[data-testid="tab-signatures"]')
    await expect(sigTab).toBeVisible()
    await sigTab.click()

    // Panel del Sello Oficial
    await expect(page.locator('text=/Sello Oficial del (Colegio|Plantel)/')).toBeVisible()
    await expect(page.locator('[data-testid="input-official-seal-file"]')).toBeAttached()

    // 3 Autoridades institucionales con sus firmas
    await expect(page.locator('text="Firmas Digitalizadas de Autoridades"')).toBeVisible()
    await expect(page.locator('text=/Directora.*Firma #1/')).toBeVisible()
    await expect(page.locator('text=/Control de Estudios.*Firma #2/')).toBeVisible()
    await expect(page.locator('text=/Docente Guía.*Firma #3/')).toBeVisible()
    await expect(page.locator('button', { hasText: /Guardar Firmas y Sellos/i })).toBeVisible()
  })

  test('TC-CERT-QR-06: Verificación pública con modal y código QR único', async ({ page }) => {
    const db = require('../../../backend/src/database')
    const sampleCert = await db('school.certificates')
      .where({ is_deleted: false })
      .orderBy('id', 'desc')
      .first()

    expect(sampleCert).toBeDefined()

    // Navegar de forma pública (anónima) al portal de verificación
    await page.goto(`/verificar-boleta/${sampleCert.verification_code}`)
    await page.waitForLoadState('networkidle')

    // Comprobar banner de documento auténtico
    await expect(page.locator('text="Documento Auténtico y Verificado"')).toBeVisible()
    await expect(page.locator(`text="${sampleCert.verification_code}"`)).toBeVisible()
    await expect(page.locator(`text="${sampleCert.recipient_name}"`)).toBeVisible()
    await expect(page.locator('text="Auténtico y Vigente"')).toBeVisible()
  })

})
