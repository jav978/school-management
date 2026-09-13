import { test, expect } from '@playwright/test';
import { loginAsAdmin, ADMIN_CREDENTIALS } from '../fixtures/auth';

test.describe('Módulo de Autenticación', () => {

  test('01.1 - Debe renderizar correctamente la pantalla de inicio de sesión', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('domcontentloaded');

    // Verificar presencia de elementos visuales clave
    await expect(page.getByRole('heading', { name: /¡Bienvenido de nuevo!/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('01.2 - Debe rechazar credenciales inválidas y mostrar alerta de error', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForFunction(() => (window as any).__NUXT__ !== undefined);
    await page.waitForTimeout(600);

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('usuario_inexistente@santaluisa.edu.ve');
    await passwordInput.fill('clave_erronea_999');

    await page.locator('button[type="submit"]').click();

    // Debe mostrar contenedor de error
    const errorAlert = page.locator('.bg-rose-50, [class*="rose-"]').first();
    await expect(errorAlert).toBeVisible({ timeout: 8000 });
  });

  test('01.3 - Debe autenticarse exitosamente con credenciales válidas y redirigir al Dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForFunction(() => (window as any).__NUXT__ !== undefined);
    await page.waitForTimeout(600);

    await page.locator('input[type="email"]').fill(ADMIN_CREDENTIALS.email);
    await page.locator('input[type="password"]').fill(ADMIN_CREDENTIALS.password);
    await page.locator('button[type="submit"]').click();

    // Debe redirigir al Dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('header, nav, aside, .glass-card').first()).toBeVisible();
  });

  test('01.4 - Debe redirigir a /auth/login si se accede a una ruta protegida sin sesión', async ({ page }) => {
    // Intentar entrar directo al dashboard sin cookies ni sessionStorage
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Debe terminar en la pantalla de login
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test('01.5 - Debe permitir cerrar sesión correctamente y limpiar la sesión activa', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Abrir menú de usuario en el Header
    const userButton = page.locator('[data-testid="header-user-menu-btn"]').first();
    await expect(userButton).toBeVisible({ timeout: 10000 });
    await userButton.click();

    // Clic en Cerrar sesión
    const logoutBtn = page.locator('[data-testid="header-logout-btn"]').first();
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await logoutBtn.click();

    // Debe regresar a login
    await page.waitForURL('**/auth/login', { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

});
