import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../fixtures/auth';

test.describe('Módulo de Materias y Cátedras', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('a[href="/subjects"]').first().click();
    await page.waitForURL('**/subjects', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('06.1 - Debe renderizar el encabezado y las 4 tarjetas métricas de asignaturas', async ({ page }) => {
    await expect(page.locator('h1:has-text("Gestión de Materias y Cátedras")')).toBeVisible();

    await expect(page.locator('p:has-text("Total Materias")')).toBeVisible();
    await expect(page.locator('p:text-is("Departamentos")')).toBeVisible();
    await expect(page.locator('p:has-text("Profesores Asignados")')).toBeVisible();
    await expect(page.locator('p:has-text("Niveles Académicos")')).toBeVisible();
  });

  test('06.2 - Debe permitir filtrar y buscar asignaturas', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar materia"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Matemática');
    await expect(searchInput).toHaveValue('Matemática');
    await searchInput.fill('');
  });

  test('06.3 - Debe realizar el ciclo de vida completo de una materia (Crear -> Consultar -> Modificar -> Eliminar)', async ({ page }) => {
    const suffix = Date.now().toString().slice(-4);
    const testCode = `ROB-${suffix}`;
    const testName = `Robótica y Tecnología ${suffix}`;
    const updatedName = `Robótica y Domótica ${suffix}`;

    // 1. CREATE: Abrir modal y registrar materia
    await page.locator('button:has-text("Nueva Materia")').click();
    await expect(page.locator('h2:has-text("Nueva Materia Curricular")')).toBeVisible({ timeout: 5000 });

    // Código y Nombre
    await page.locator('input[placeholder*="MAT-M"]').fill(testCode);
    await page.locator('input[placeholder*="Matemática, Ciencias"]').fill(testName);

    // Departamento
    await page.locator('input[placeholder*="Ciencias Naturales"]').fill('Tecnología e Informática');

    // Guardar
    await page.locator('button:has-text("Crear Materia")').click();

    // Modal debe cerrarse
    await expect(page.locator('h2:has-text("Nueva Materia Curricular")')).not.toBeVisible({ timeout: 7000 });

    // 2. READ: Buscar en la barra de búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar materia"]');
    await searchInput.fill(testCode);
    await expect(page.locator('h3', { hasText: testName })).toBeVisible({ timeout: 5000 });

    // 3. UPDATE: Modificar la materia
    const card = page.locator('.glass-card').filter({ has: page.locator('h3', { hasText: testName }) });
    await card.locator('button[title*="Editar asignatura"]').click();

    await expect(page.locator('h2:has-text("Editar Materia Curricular")')).toBeVisible({ timeout: 5000 });
    const nameInput = page.locator('input[placeholder*="Matemática, Ciencias"]');
    await nameInput.fill(updatedName);
    await page.locator('button:has-text("Actualizar Materia")').click();

    await expect(page.locator('h2:has-text("Editar Materia Curricular")')).not.toBeVisible({ timeout: 7000 });
    await expect(page.locator('h3', { hasText: updatedName })).toBeVisible({ timeout: 5000 });

    // 4. DELETE: Eliminar la materia
    const updatedCard = page.locator('.glass-card').filter({ has: page.locator('h3', { hasText: updatedName }) });
    await updatedCard.locator('button[title*="Eliminar asignatura"]').click();

    await expect(page.locator('h3:has-text("¿Eliminar Materia?")')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Sí, Eliminar")').click();

    await expect(page.locator('h3:has-text("¿Eliminar Materia?")')).not.toBeVisible({ timeout: 7000 });
    await expect(page.locator('h3', { hasText: updatedName })).not.toBeVisible({ timeout: 5000 });
  });

});
