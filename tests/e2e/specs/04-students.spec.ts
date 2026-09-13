import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../fixtures/auth';

test.describe('Módulo de Gestión de Estudiantes', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('a[href="/students"]').first().click();
    await page.waitForURL('**/students', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('04.1 - Debe renderizar la cabecera y tarjetas métricas de estudiantes', async ({ page }) => {
    await expect(page.locator('h1:has-text("Gestión de Estudiantes")')).toBeVisible();

    // Comprobar tarjetas KPI
    await expect(page.locator('p:has-text("Total Estudiantes")')).toBeVisible();
    await expect(page.locator('p:has-text("Estudiantes Activos")')).toBeVisible();
    await expect(page.locator('p:has-text("Grados Cubiertos")')).toBeVisible();
  });

  test('04.2 - Debe contar con botones de acción principales (Nuevo Estudiante y Planilla)', async ({ page }) => {
    const newStudentBtn = page.locator('button:has-text("Nuevo Estudiante")');
    await expect(newStudentBtn).toBeVisible();

    const enrollmentFormBtn = page.locator('button:has-text("Planilla de Matrícula")');
    await expect(enrollmentFormBtn).toBeVisible();
  });

  test('04.3 - Debe abrir y cerrar el modal para registrar un Nuevo Estudiante', async ({ page }) => {
    const newStudentBtn = page.locator('button:has-text("Nuevo Estudiante")');
    await newStudentBtn.click();

    // Verificar apertura del modal institucional
    const modalTitle = page.locator('h3:has-text("Nuevo Registro de Estudiante")');
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    // Cancelar / Cerrar modal
    const closeBtn = page.locator('button[title="Cerrar modal"], button:has-text("Cancelar")').first();
    await closeBtn.click();

    await expect(modalTitle).not.toBeVisible({ timeout: 5000 });
  });

  test('04.4 - Debe permitir navegar a la planilla de matrícula imprimible', async ({ page }) => {
    const enrollmentBtn = page.locator('button:has-text("Planilla de Matrícula")');
    await enrollmentBtn.click();

    await page.waitForURL('**/students/enrollment-form', { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/students\/enrollment-form/);
  });

  test('04.5 - Debe realizar el ciclo de vida completo de un estudiante (Crear -> Consultar -> Modificar -> Ficha -> Deshabilitar -> Reactivar)', async ({ page }) => {
    const idSuffix = Date.now().toString().slice(-4);
    const testStudentId = `EST-${idSuffix}`;
    const testFirstName = `Estudiante${idSuffix}`;
    const testLastName = `PruebaE2E`;
    const fullName = `${testFirstName} ${testLastName}`;
    const updatedLastName = `PruebaE2E Modificado`;
    const updatedFullName = `${testFirstName} ${updatedLastName}`;

    // 1. CREATE: Abrir modal y registrar estudiante
    await page.locator('button:has-text("Nuevo Estudiante")').click();
    await expect(page.locator('h3:has-text("Nuevo Registro de Estudiante")')).toBeVisible({ timeout: 5000 });

    // Llenar datos de matrícula
    await page.locator('input[placeholder*="EST004"]').fill(testStudentId);
    
    // Seleccionar grado
    const gradeSelect = page.locator('form select').first();
    await gradeSelect.selectOption({ index: 1 }); // Seleccionar el primer grado disponible

    // Llenar nombres y apellidos
    await page.locator('input[placeholder*="Carlos Eduardo"]').fill(testFirstName);
    await page.locator('input[placeholder*="Rodríguez Pérez"]').fill(testLastName);

    // Guardar
    await page.locator('button:has-text("Registrar Estudiante")').click();

    // Modal debe cerrarse
    await expect(page.locator('h3:has-text("Nuevo Registro de Estudiante")')).not.toBeVisible({ timeout: 7000 });

    // 2. READ: Buscar en la barra de búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar estudiantes"]');
    await searchInput.fill(testStudentId);
    await expect(page.locator('h3', { hasText: fullName })).toBeVisible({ timeout: 5000 });

    // 3. UPDATE: Editar el estudiante
    const studentCard = page.locator('.glass-card').filter({ has: page.locator('h3', { hasText: fullName }) });
    await studentCard.locator('button[title="Editar expediente del estudiante"]').click();

    await expect(page.locator('h3:has-text("Editar Expediente de Estudiante")')).toBeVisible({ timeout: 5000 });
    const lastNameInput = page.locator('input[placeholder*="Rodríguez Pérez"]');
    await lastNameInput.fill(updatedLastName);
    await page.locator('button:has-text("Guardar Cambios")').click();

    await expect(page.locator('h3:has-text("Editar Expediente de Estudiante")')).not.toBeVisible({ timeout: 7000 });
    await expect(page.locator('h3', { hasText: updatedFullName })).toBeVisible({ timeout: 5000 });

    // 4. FICHA: Comprobar acceso a ficha de inscripción del estudiante
    const updatedCard = page.locator('.glass-card').filter({ has: page.locator('h3', { hasText: updatedFullName }) });
    const fichaBtn = updatedCard.locator('button[title*="Ficha Oficial de Inscripción"]');
    await expect(fichaBtn).toBeVisible();

    // 5. SOFT DELETE / DESHABILITAR: Deshabilitar estudiante
    await updatedCard.locator('button[title*="Deshabilitar estudiante"]').click();
    await expect(page.locator('h3:has-text("¿Deshabilitar Estudiante?")')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Sí, Deshabilitar Alumno")').click();

    await expect(page.locator('h3:has-text("¿Deshabilitar Estudiante?")')).not.toBeVisible({ timeout: 7000 });

    // Verificar que la tarjeta ahora muestra la etiqueta "Inactivo"
    await expect(updatedCard.locator('span:has-text("Inactivo")')).toBeVisible({ timeout: 5000 });

    // 6. REACTIVAR: Reactivar estudiante
    const reactivateBtn = updatedCard.locator('button[title*="Reactivar estudiante"]');
    await expect(reactivateBtn).toBeVisible();
    await reactivateBtn.click();

    // Verificar que ya no tenga el badge de Inactivo
    await expect(updatedCard.locator('span:has-text("Inactivo")')).not.toBeVisible({ timeout: 5000 });
  });

});
