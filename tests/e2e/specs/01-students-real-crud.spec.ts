import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Estudiantes: CRUD 100% Real contra PostgreSQL', () => {

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.students').where({ first_name: 'Santiago' }).del()
    } catch (_) {}
  })

  test('TC-STU-01: Carga la lista real de la base de datos sin datos falsos o mock', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/students')
    await page.waitForLoadState('networkidle')

    // El encabezado institucional debe estar visible
    const pageHeading = page.locator('h1', { hasText: 'Gestión de Estudiantes' })
    await expect(pageHeading).toBeVisible()

    // Verificar que los datos mock quemados (Carlos Rodríguez, Sofía Martínez) NO existen
    const mockCarlos = page.locator('text="Carlos Rodríguez"')
    await expect(mockCarlos).not.toBeVisible()

    const mockSofia = page.locator('text="Sofía Martínez"')
    await expect(mockSofia).not.toBeVisible()

    // El botón de datos demo no debe existir
    const demoBtn = page.locator('button:has-text("Cargar Alumnos Demo")')
    await expect(demoBtn).not.toBeVisible()

    // Verificar que el estudiante real de la base de datos (Valentina Mendoza) sí se renderiza
    const realStudent = page.locator('text="Valentina Mendoza"')
    await expect(realStudent).toBeVisible()
  })

  test('TC-STU-02: Flujo completo de registro (Create) vía Slide-over Drawer', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/students')
    await page.waitForLoadState('networkidle')

    // Abrir el Slide-over Drawer
    const newStudentBtn = page.locator('button:has-text("Inscribir Estudiante")')
    await expect(newStudentBtn).toBeVisible()
    await newStudentBtn.click()

    // El Drawer debe aparecer
    const drawerTitle = page.locator('h3:has-text("Inscripción de Estudiante")')
    await expect(drawerTitle).toBeVisible()

    // Pestaña Académico (visible por defecto)
    await page.locator('input[placeholder*="EST-"]').fill('EST-2026-7733')
    await page.locator('select').filter({ hasText: '1er grado' }).first().selectOption('3er año')

    // Cambiar a pestaña Personal
    await page.locator('button:has-text("Personal")').click()
    await page.locator('input[placeholder*="Alejandro"]').fill('Santiago')
    await page.locator('input[placeholder*="Paredes Mendoza"]').fill('Valero')
    await page.locator('input[placeholder*="0414-1234567"]').fill('0414-7733221')

    // Cambiar a pestaña Salud
    await page.locator('button:has-text("Salud")').click()
    await page.locator('input[placeholder*="Penicilina"]').fill('Ninguna')

    // Cambiar a pestaña Emergencia
    await page.locator('button:has-text("Emergencia")').click()
    await page.locator('input[placeholder*="María Mendoza"]').fill('Carmen Valero')
    await page.locator('input[placeholder*="0424-9876543"]').fill('0412-9988776')

    // Enviar el formulario
    const submitBtn = page.locator('button:has-text("Guardar en Matrícula")')
    await submitBtn.click()

    // Verificar que el estudiante aparece en la vista
    await expect(page.locator('text="Santiago Valero"')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('EST-2026-7733')).toBeVisible()
  })

  test('TC-STU-03: Edición (Update) de expediente persistida en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/students')
    await page.waitForLoadState('networkidle')

    // Ubicar a Santiago Valero y presionar editar
    const studentCard = page.locator('.glass-card', { hasText: 'Santiago Valero' })
    await expect(studentCard).toBeVisible()

    const editBtn = studentCard.locator('button[title="Editar Expediente"]')
    await editBtn.click()

    // Verificar que abre el Drawer en modo edición
    await expect(page.locator('h3:has-text("Expediente del Estudiante")')).toBeVisible()

    // Cambiar teléfono en pestaña Personal
    await page.locator('button:has-text("Personal")').click()
    const phoneInput = page.locator('input[placeholder*="0414-1234567"]')
    await phoneInput.fill('0414-9998888')

    // Guardar cambios
    const updateBtn = page.locator('button:has-text("Actualizar Expediente")')
    await updateBtn.click()

    // Verificar notificación o persistencia
    await page.waitForTimeout(1000)
    await page.reload()
    await page.waitForLoadState('networkidle')

    const updatedCard = page.locator('.glass-card', { hasText: 'Santiago Valero' })
    await expect(updatedCard).toContainText('0414-9998888')
  })

  test('TC-STU-04: Deshabilitación (Soft Delete) e inactivación en base de datos', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/students')
    await page.waitForLoadState('networkidle')

    const studentCard = page.locator('.glass-card', { hasText: 'Santiago Valero' })
    const disableBtn = studentCard.locator('button[title="Deshabilitar estudiante"]')
    await disableBtn.click()

    // Modal de confirmación
    const confirmModal = page.locator('h3:has-text("¿Deshabilitar Estudiante?")')
    await expect(confirmModal).toBeVisible()

    const confirmBtn = page.locator('button:has-text("Sí, Inactivar Alumno")')
    await confirmBtn.click()

    // Debe mostrar la etiqueta de Inactivo
    await page.waitForTimeout(1000)
    const inactiveBadge = studentCard.locator('text="Inactivo"')
    await expect(inactiveBadge).toBeVisible()
  })

})
