import { test, expect, Page } from '@playwright/test';

export const PARENT_CREDENTIALS = {
  email: 'priscilla0607@gmail.com',
  password: 'admin123'
};

async function loginAsParent(page: Page) {
  const res = await page.request.post('http://localhost:3031/authentication', {
    data: {
      strategy: 'local',
      email: PARENT_CREDENTIALS.email,
      password: PARENT_CREDENTIALS.password
    }
  });

  if (!res.ok()) {
    throw new Error(`Error autenticando representante: ${res.status()} ${await res.text()}`);
  }

  const data = await res.json();
  const auth = {
    token: data.accessToken,
    session_id: data.session_id,
    user: data.user
  };

  await page.context().addCookies([
    { name: 'session_token', value: auth.token, url: 'http://localhost:3001' },
    { name: 'session_id', value: auth.session_id || '', url: 'http://localhost:3001' },
    { name: 'token', value: auth.token, url: 'http://localhost:3001' }
  ]);

  await page.addInitScript(({ token, user, session_id }) => {
    sessionStorage.setItem('token', token);
    if (session_id) sessionStorage.setItem('session_id', session_id);
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.removeItem('temp_2fa_token');
    sessionStorage.removeItem('temp_2fa_user');
  }, auth);
}

test.describe('Vista del Representante (Parent) - Identidad, Dashboard y Perfil', () => {

  test('18.1 - Header muestra nombre dinámico real, oculta Configuración y no muestra "Steven Jhon"', async ({ page }) => {
    await loginAsParent(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 1. Debe mostrar el nombre dinámico de Priscilla en el Header
    await expect(header).toContainText(/Priscilla Alejandra/i);

    // 2. JAMÁS debe mostrar el nombre quemado "Steven Jhon"
    await expect(header).not.toContainText('Steven Jhon');

    // 3. El placeholder de búsqueda debe ser limpio y no contener 'q null'
    const searchInput = header.locator('input[type="text"]').first();
    await expect(searchInput).toHaveAttribute('placeholder', /Buscar estudiantes, materias, cédulas\.\.\./i);

    // 4. Abrir el menú de usuario vía testid
    const userMenuBtn = header.locator('[data-testid="header-user-menu-btn"]');
    await expect(userMenuBtn).toBeVisible();
    await userMenuBtn.click();
    await page.waitForTimeout(500);

    // 5. Debe contener "Mi Perfil" con enlace a /profile
    const myProfileLink = page.locator('a[href="/profile"]');
    await expect(myProfileLink).toBeVisible();

    // 6. NO debe mostrar "Configuración" para representantes
    const configLink = page.locator('a[href="/settings"], button:has-text("Configuración")');
    await expect(configLink).toHaveCount(0);

    // 7. Debe mostrar "Cerrar Sesión"
    const logoutBtn = page.getByRole('button', { name: /Cerrar Sesión/i });
    await expect(logoutBtn).toBeVisible();
  });

  test('18.2 - Dashboard renderiza saludo personalizado y selector con estudiantes vinculados', async ({ page }) => {
    await loginAsParent(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // 1. Saludo dinámico de bienvenida
    const greeting = page.locator('h2').filter({ hasText: /Bienvenida/i });
    await expect(greeting).toBeVisible();
    await expect(greeting).toContainText(/Priscilla Alejandra/i);
    await expect(greeting).not.toContainText('Elena Rodríguez');

    // 2. Subtítulo con cantidad de estudiantes
    await expect(page.locator('text=Estudiantes Matriculados')).toBeVisible();

    // 3. Botones selectores de hijos dinámicos en el banner
    const banner = page.locator('.glass-card').first();
    const santigoBtn = banner.getByRole('button', { name: /Santigo/i });
    const mariaBtn = banner.getByRole('button', { name: /María/i });
    await expect(santigoBtn).toBeVisible();
    await expect(mariaBtn).toBeVisible();

    // 4. Al hacer clic en María, las tarjetas KPI deben actualizarse
    await mariaBtn.click();
    await page.waitForTimeout(500);

    // Verifica que refleje métricas de María (100% asistencia, 1er Grado)
    await expect(page.locator('text=100%')).toBeVisible();
    await expect(page.locator('text=Sin inasistencias')).toBeVisible();

    // 5. Al hacer clic en Santigo, regresa a las métricas de bachillerato
    await santigoBtn.click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=97.8%')).toBeVisible();
    await expect(page.locator('text=1 falta justificada')).toBeVisible();
  });

  test('18.3 - Página /profile carga los datos del representante y estudiantes vinculados', async ({ page }) => {
    await loginAsParent(page);
    await page.goto('/profile');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // 1. Cabecera y datos del perfil
    await expect(page.getByRole('heading', { name: 'Mi Perfil' })).toBeVisible();
    await expect(page.locator('text=Representante Legal').first()).toBeVisible();
    await expect(page.locator('text=priscilla0607@gmail.com').first()).toBeVisible();
    await expect(page.locator('text=04269217118').first()).toBeVisible();

    // 2. Estudiantes representados listados en la barra lateral
    await expect(page.locator('text=Santigo Vásquez Madrid')).toBeVisible();
    await expect(page.locator('text=María Alejandra Vásquez Madrid')).toBeVisible();
  });

});
