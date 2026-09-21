const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/home/jav1978/.gemini/antigravity-ide/brain/cc4fa441-dad6-4da2-b126-3e7c99b5ad6a';
const BASE_URL = 'http://localhost:3003';

async function run() {
  console.log('🚀 Starting Verification of Phase 3 Improvements...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Authenticate via direct API to ensure clean tokens
    console.log('1. Authenticating admin user via API...');
    const authRes = await fetch(`${BASE_URL}/api/authentication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strategy: 'local',
        email: 'admin@santaluisa.edu.ve',
        password: 'admin123'
      })
    });

    if (!authRes.ok) {
      throw new Error(`Auth failed with status ${authRes.status}: ${await authRes.text()}`);
    }

    const authData = await authRes.json();
    console.log('Authenticated successfully as:', authData.user?.email);

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      colorScheme: 'dark'
    });

    // Set cookies in context
    await context.addCookies([
      {
        name: 'session_token',
        value: authData.accessToken,
        domain: 'localhost',
        path: '/'
      },
      {
        name: 'session_id',
        value: authData.session_id || '',
        domain: 'localhost',
        path: '/'
      }
    ]);

    const page = await context.newPage();

    // Populate sessionStorage
    await page.goto(`${BASE_URL}/`, { waitUntil: 'commit' });
    await page.evaluate((data) => {
      sessionStorage.setItem('token', data.accessToken);
      sessionStorage.setItem('session_id', data.session_id || '');
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }, authData);

    // 2. Navigate to Dashboard
    console.log('2. Navigating to Dashboard...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForSelector('header', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // 3. Measure Header Button Symmetry
    console.log('3. Measuring Header Button Dimensions & Symmetry...');
    const headerMetrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return null;
      const buttons = Array.from(header.querySelectorAll('button'));
      return buttons.map(b => {
        const rect = b.getBoundingClientRect();
        return {
          title: b.getAttribute('title') || b.innerText.trim() || b.getAttribute('aria-label'),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          classes: b.className
        };
      });
    });
    console.log('Header buttons detected:\n', JSON.stringify(headerMetrics, null, 2));

    // Capture Header Close-up
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'header_symmetry_dark.png'),
      clip: { x: 0, y: 0, width: 1280, height: 90 }
    });

    // 4. Navigate to Students view (ES)
    console.log('4. Capturing Students view (Spanish)...');
    await page.goto(`${BASE_URL}/students`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'students_es_view.png') });

    // 5. Switch to English
    console.log('5. Switching language to English...');
    const langBtn = page.locator('button[title*="idioma"], button[title*="language"]');
    if (await langBtn.count() > 0) {
      await langBtn.first().click();
      await page.waitForTimeout(400);
      const enOption = page.locator('button').filter({ hasText: 'English' });
      if (await enOption.count() > 0) {
        await enOption.first().click();
        await page.waitForTimeout(600);
      }
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'students_en_view.png') });

    // 6. Reports View
    console.log('6. Capturing Reports view (PDF Download + MPPE ribbon)...');
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reports_preview_pdf.png') });

    // 7. Boletas View
    console.log('7. Capturing Boletas view...');
    await page.goto(`${BASE_URL}/boletas`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'boletas_preview_pdf.png') });

    // 8. Supplies View
    console.log('8. Capturing Supplies view...');
    await page.goto(`${BASE_URL}/supplies`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'supplies_preview_pdf.png') });

    console.log('🎉 Verification completed successfully!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await browser.close();
  }
}

run();
