import { Page, expect } from '@playwright/test';

export const ADMIN_CREDENTIALS = {
  email: 'admin@santaluisa.edu.ve',
  password: 'admin123',
};

let cachedAuth: { token: string; user: any } | null = null;

export async function getAdminAuth(page: Page) {
  const res = await page.request.post('http://localhost:3031/authentication', {
    data: {
      strategy: 'local',
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password
    }
  });

  if (!res.ok()) {
    throw new Error(`Error obteniendo token de autenticación: ${res.status()} ${await res.text()}`);
  }

  const data = await res.json();
  return {
    token: data.accessToken,
    session_id: data.session_id,
    user: data.user
  };
}

/**
 * Inyecta la sesión autenticada del Administrador tanto en cookies
 * como en sessionStorage para compatibilidad total con SSR y SPA.
 */
export async function loginAsAdmin(page: Page) {
  const auth = await getAdminAuth(page);

  // Cookies para que Nuxt reconozca la sesión en cargas directas
  await page.context().addCookies([
    { name: 'session_token', value: auth.token, url: 'http://localhost:3001' },
    { name: 'session_id', value: auth.session_id || '', url: 'http://localhost:3001' },
    { name: 'token', value: auth.token, url: 'http://localhost:3001' }
  ]);

  // sessionStorage para el store Pinia de cliente
  await page.addInitScript(({ token, user, session_id }) => {
    sessionStorage.setItem('token', token);
    if (session_id) sessionStorage.setItem('session_id', session_id);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.removeItem('temp_2fa_token');
    sessionStorage.removeItem('temp_2fa_user');
  }, auth);
}
