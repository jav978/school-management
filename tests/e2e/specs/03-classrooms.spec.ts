import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../fixtures/auth';

test.describe('Módulo de Aulas y Espacios Escolares', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('a[href="/classrooms"]').click();
    await page.waitForURL('**/classrooms', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('03.1 - Debe renderizar el encabezado y las 4 tarjetas de resumen KPI', async ({ page }) => {
    await expect(page.locator('h1:has-text("Aulas y Espacios Escolares")')).toBeVisible();

    // Comprobar tarjetas de KPI
    await expect(page.locator('p:has-text("Total Espacios")')).toBeVisible();
    await expect(page.locator('p:has-text("Disponibles")')).toBeVisible();
    await expect(page.locator('p:has-text("Capacidad Total")')).toBeVisible();
    await expect(page.locator('p:has-text("Mantenimiento")')).toBeVisible();
  });

  test('03.2 - Debe permitir filtrar y buscar aulas por texto', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar por código, nombre"]');
    await expect(searchInput).toBeVisible();

    // Escribir en el buscador
    await searchInput.fill('Laboratorio');
    await page.waitForTimeout(300); // Debounce visual
    await expect(searchInput).toHaveValue('Laboratorio');

    // Limpiar buscador
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  });

  test('03.3 - Debe abrir y cerrar el modal de Nueva Aula / Espacio', async ({ page }) => {
    const newRoomBtn = page.locator('button:has-text("Nueva Aula / Espacio")');
    await expect(newRoomBtn).toBeVisible();
    await newRoomBtn.click();

    // Verificar que el modal se muestre
    const modalHeading = page.locator('h2:has-text("Nueva Aula o Espacio Escolar")');
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Cancelar y cerrar modal
    const cancelBtn = page.locator('button:has-text("Cancelar")').first();
    await cancelBtn.click();

    // Verificar que el modal se haya cerrado
    await expect(modalHeading).not.toBeVisible({ timeout: 5000 });
  });

  test('03.4 - Debe realizar el ciclo de vida completo de un aula (Crear -> Consultar -> Modificar -> Eliminar)', async ({ page }) => {
    const testCode = `TEST-${Date.now().toString().slice(-4)}`;
    const testName = `Aula Robótica ${testCode}`;
    const updatedName = `Aula Robótica Avanzada ${testCode}`;

    // 1. CREATE: Abrir modal y registrar aula
    await page.locator('button:has-text("Nueva Aula / Espacio")').click();
    await expect(page.locator('h2:has-text("Nueva Aula o Espacio Escolar")')).toBeVisible();

    await page.locator('input[placeholder*="A-101"]').fill(testCode);
    await page.locator('input[placeholder*="Salón 1er Año"]').fill(testName);
    await page.locator('textarea').fill('Kits de robótica Arduino, 20 Laptops, Impresora 3D');

    // Guardar aula
    await page.locator('button:has-text("Guardar Aula")').click();

    // Esperar que el modal se cierre
    await expect(page.locator('h2:has-text("Nueva Aula o Espacio Escolar")')).not.toBeVisible({ timeout: 7000 });

    // 2. READ: Buscar el aula en el filtro
    const searchInput = page.locator('input[placeholder*="Buscar por código, nombre"]');
    await searchInput.fill(testCode);
    await expect(page.locator('h3', { hasText: testName })).toBeVisible({ timeout: 5000 });

    // 3. UPDATE: Modificar el aula
    // Click en botón de editar del aula creada
    const card = page.locator('.glass-card').filter({ has: page.locator('h3', { hasText: testName }) });
    await card.locator('button[title="Editar espacio escolar"]').click();

    // Esperar modal de edición
    await expect(page.locator('h2:has-text("Editar Aula o Espacio Escolar")')).toBeVisible({ timeout: 5000 });
    const nameInput = page.locator('input[placeholder*="Salón 1er Año"]');
    await nameInput.fill(updatedName);
    await page.locator('button:has-text("Actualizar Aula")').click();

    // Verificar que el modal se cierre y el nombre nuevo aparezca en la tarjeta
    await expect(page.locator('h2:has-text("Editar Aula o Espacio Escolar")')).not.toBeVisible({ timeout: 7000 });
    await expect(page.locator('h3', { hasText: updatedName })).toBeVisible({ timeout: 5000 });

    // 4. DELETE: Eliminar el aula
    const updatedCard = page.locator('.glass-card').filter({ has: page.locator('h3', { hasText: updatedName }) });
    await updatedCard.locator('button[title="Eliminar espacio escolar"]').click();

    // Confirmar en modal de baja
    await expect(page.locator('h3:has-text("¿Eliminar Espacio Escolar?")')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Confirmar Eliminación")').click();

    // Verificar que el modal de confirmación se cierra y ya no aparece el aula en la grilla
    await expect(page.locator('h3:has-text("¿Eliminar Espacio Escolar?")')).not.toBeVisible({ timeout: 7000 });
    await expect(page.locator('h3', { hasText: updatedName })).not.toBeVisible({ timeout: 5000 });
  });

});
