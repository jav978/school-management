import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth'

test.describe('Módulo de Calificaciones y Evaluaciones: Verificación Triple contra PostgreSQL', () => {

  const TEST_REMARKS = 'Desempeño sobresaliente en resolución de problemas E2E 2026'
  const UPDATED_REMARKS = 'Desempeño extraordinario con mención de honor E2E 2026'

  test.beforeAll(async () => {
    try {
      const db = require('../../../backend/src/database')
      await db('school.exam_results')
        .where('remarks', 'like', '%E2E 2026%')
        .del()
    } catch (_) {}
  })

  test('TC-GRD-01: Carga la vista de Calificaciones con métricas y controles de vista', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/grades')
    await page.waitForLoadState('networkidle')

    // Título institucional
    const heading = page.locator('h1', { hasText: 'Calificaciones y Evaluaciones' })
    await expect(heading).toBeVisible()

    // 4 Tarjetas KPI
    await expect(page.locator('p', { hasText: 'Promedio General' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Tasa Aprobación' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'En Recuperación' })).toBeVisible()
    await expect(page.locator('p', { hasText: 'Notas Registradas' })).toBeVisible()

    // Botón de nueva calificación
    await expect(page.locator('[data-testid="btn-new-grade"]')).toBeVisible()
  })

  test('TC-GRD-02: Registro (Create) de calificación con persistencia real en PostgreSQL', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/grades')
    await page.waitForLoadState('networkidle')

    // Abrir modal
    const newBtn = page.locator('[data-testid="btn-new-grade"]')
    await expect(newBtn).toBeVisible()
    await newBtn.click()

    // Explicitly select options
    await page.locator('[data-testid="select-grade-exam"]').selectOption({ index: 0 })
    await page.locator('[data-testid="select-grade-student"]').selectOption({ index: 0 })

    // Llenar formulario
    await page.locator('[data-testid="input-grade-marks"]').fill('19')
    await page.locator('[data-testid="input-grade-total"]').fill('20')
    await page.locator('[data-testid="input-grade-remarks"]').fill(TEST_REMARKS)

    // Guardar
    const submitBtn = page.locator('[data-testid="btn-submit-grade"]')
    await submitBtn.click()

    // Esperar mensaje toast de éxito
    await expect(page.locator('text=Calificación registrada exitosamente')).toBeVisible({ timeout: 10000 })

    // Verificación directa en base de datos PostgreSQL
    const db = require('../../../backend/src/database')
    const gradeInDb = await db('school.exam_results')
      .where({ remarks: TEST_REMARKS, is_deleted: false })
      .first()

    expect(gradeInDb).toBeDefined()
    expect(Number(gradeInDb.marks_obtained)).toBe(19)
    expect(Number(gradeInDb.total_marks)).toBe(20)
    expect(gradeInDb.grade_letter.trim()).toBe('A')
    expect(gradeInDb.is_passed).toBe(true)
  })

  test('TC-GRD-03: Modificación (Update) de calificación y verificación en PostgreSQL', async ({ page }) => {
    const db = require('../../../backend/src/database')
    const crypto = require('crypto')
    let grade = await db('school.exam_results')
      .where({ remarks: TEST_REMARKS, is_deleted: false })
      .first()
    if (!grade) {
      const exam = await db('school.exams').where('is_deleted', false).first()
      const student = await db('school.students').where('is_deleted', false).first()
      await db('school.exam_results').insert({
        uuid: crypto.randomUUID(),
        exam_id: exam.id,
        student_id: student.id,
        marks_obtained: 19,
        total_marks: 20,
        grade_letter: 'A',
        is_passed: true,
        attempt_number: 20,
        remarks: TEST_REMARKS,
        graded_by: 1,
        graded_at: new Date(),
        created_at: new Date(),
        is_deleted: false,
        version: 1
      })
    }

    await loginAsAdmin(page)
    await page.goto('/grades')
    await page.waitForLoadState('networkidle')

    // Encontrar botón de editar
    const editBtn = page.locator('[data-testid="btn-edit-grade"]').first()
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Cambiar nota y observaciones
    const marksInput = page.locator('[data-testid="input-grade-marks"]')
    await marksInput.fill('20')
    const remarksInput = page.locator('[data-testid="input-grade-remarks"]')
    await remarksInput.fill(UPDATED_REMARKS)

    // Guardar
    const submitBtn = page.locator('[data-testid="btn-submit-grade"]')
    await submitBtn.click()

    // Esperar mensaje toast de éxito
    await expect(page.locator('text=Calificación actualizada exitosamente')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const updatedInDb = await db('school.exam_results')
      .where({ remarks: UPDATED_REMARKS, is_deleted: false })
      .first()

    expect(updatedInDb).toBeDefined()
    expect(Number(updatedInDb.marks_obtained)).toBe(20)
  })

  test('TC-GRD-04: Eliminación (Soft Delete) de calificación y verificación en PostgreSQL', async ({ page }) => {
    const db = require('../../../backend/src/database')
    const crypto = require('crypto')
    let grade = await db('school.exam_results')
      .where({ is_deleted: false })
      .andWhere(q => q.where('remarks', UPDATED_REMARKS).orWhere('remarks', TEST_REMARKS))
      .first()
    if (!grade) {
      const exam = await db('school.exams').where('is_deleted', false).first()
      const student = await db('school.students').where('is_deleted', false).first()
      await db('school.exam_results').insert({
        uuid: crypto.randomUUID(),
        exam_id: exam.id,
        student_id: student.id,
        marks_obtained: 20,
        total_marks: 20,
        grade_letter: 'A',
        is_passed: true,
        attempt_number: 21,
        remarks: UPDATED_REMARKS,
        graded_by: 1,
        graded_at: new Date(),
        created_at: new Date(),
        is_deleted: false,
        version: 1
      })
    }

    await loginAsAdmin(page)
    await page.goto('/grades')
    await page.waitForLoadState('networkidle')

    // Botón de eliminar
    const deleteBtn = page.locator('[data-testid="btn-delete-grade"]').first()
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // Confirmar eliminación
    const confirmBtn = page.locator('[data-testid="btn-confirm-delete-grade"]')
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // Esperar toast
    await expect(page.locator('text=Calificación eliminada')).toBeVisible({ timeout: 10000 })

    // Verificación en PostgreSQL
    const deletedInDb = await db('school.exam_results')
      .where('is_deleted', true)
      .andWhere(q => q.where('remarks', UPDATED_REMARKS).orWhere('remarks', TEST_REMARKS))
      .first()

    expect(deletedInDb).toBeDefined()
    expect(deletedInDb.is_deleted).toBe(true)
  })
})
