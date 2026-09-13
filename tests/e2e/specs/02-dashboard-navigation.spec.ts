import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../fixtures/auth';

test.describe('Módulo de Dashboard y Navegación', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('02.1 - Debe renderizar el Dashboard con el banner institucional y KPIs principales', async ({ page }) => {
    // Verificar que estamos en dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Verificar encabezado o saludo institucional
    const bannerHeading = page.locator('h2:has-text("Panel Institucional"), h2:has-text("Santa Luisa")').first();
    await expect(bannerHeading).toBeVisible();

    // Verificar tarjetas de métricas o KPIs visibles en la vista de administrador
    const kpiCards = page.locator('.glass-card, [class*="rounded-3xl"]');
    await expect(kpiCards.first()).toBeVisible();

    // Comprobar que existan enlaces directos en el layout
    await expect(page.locator('a[href*="/students"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/classrooms"]').first()).toBeVisible();
  });

  test('02.2 - Debe navegar correctamente a la sección de Aulas (/classrooms)', async ({ page }) => {
    const classroomsLink = page.locator('a[href="/classrooms"]').first();
    await classroomsLink.click();

    await page.waitForURL('**/classrooms', { timeout: 10000 });
    await expect(page).toHaveURL(/.*classrooms/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('02.3 - Debe navegar correctamente a la sección de Estudiantes (/students)', async ({ page }) => {
    const studentsLink = page.locator('a[href="/students"]').first();
    await studentsLink.click();

    await page.waitForURL('**/students', { timeout: 10000 });
    await expect(page).toHaveURL(/.*students/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('02.4 - Debe navegar a la sección de Personal (/staff) y Usuarios (/users)', async ({ page }) => {
    // Navegación a /staff vía sidebar
    const staffLink = page.locator('a[href="/staff"]').first();
    await staffLink.click();
    await page.waitForURL('**/staff', { timeout: 10000 });
    await expect(page).toHaveURL(/.*staff/);
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Navegación a /users vía sidebar
    const usersLink = page.locator('a[href="/users"]').first();
    await usersLink.click();
    await page.waitForURL('**/users', { timeout: 10000 });
    await expect(page).toHaveURL(/.*users/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

});
