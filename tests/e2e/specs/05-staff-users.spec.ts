import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../fixtures/auth';

test.describe('Módulo de Usuarios y Personal (Staff)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('05.1 - Debe renderizar la gestión de Usuarios y Accesos (/users)', async ({ page }) => {
    // Navegación vía sidebar a usuarios
    await page.locator('a[href="/users"]').first().click();
    await page.waitForURL('**/users', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("Gestión de Usuarios y Accesos")')).toBeVisible();
    await expect(page.locator('p:has-text("Total Usuarios")')).toBeVisible();

    // Botón Nuevo Usuario
    const newUserBtn = page.locator('button:has-text("Nuevo Usuario")');
    await expect(newUserBtn).toBeVisible();

    // Abrir modal institucional
    await newUserBtn.click();
    const modalHeading = page.locator('h2:has-text("Nuevo Usuario")');
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Cancelar y cerrar modal
    const cancelBtn = page.locator('button:has-text("Cancelar"), button:has-text("✕")').first();
    await cancelBtn.click();

    await expect(modalHeading).not.toBeVisible({ timeout: 5000 });
  });

  test('05.2 - Debe renderizar la gestión de Personal y Colaboradores (/staff)', async ({ page }) => {
    // Navegación vía sidebar a personal
    await page.locator('a[href="/staff"]').first().click();
    await page.waitForURL('**/staff', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("Personal y Colaboradores")')).toBeVisible();
    await expect(page.locator('p:has-text("Total Personal")')).toBeVisible();

    // Botón Nuevo Miembro de Personal
    const newStaffBtn = page.locator('button:has-text("Nuevo Miembro de Personal")');
    await expect(newStaffBtn).toBeVisible();

    // Abrir modal institucional
    await newStaffBtn.click();
    const modalHeading = page.locator('h2:has-text("Nuevo Miembro de Personal")');
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Cancelar y cerrar modal
    const cancelBtn = page.locator('button:has-text("Cancelar"), button:has-text("✕")').first();
    await cancelBtn.click();

    await expect(modalHeading).not.toBeVisible({ timeout: 5000 });
  });

});
