const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/home/jav1978/.gemini/antigravity-ide/brain/cc4fa441-dad6-4da2-b126-3e7c99b5ad6a';
const BASE_URL = 'http://localhost:3333';

async function run() {
  console.log('Starting Playwright visual audit with scoped selectors...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // -------------------------------------------------------------
    // 1. MOBILE TESTS (iPhone 14: 390 x 844)
    // -------------------------------------------------------------
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'dark'
    });
    const mobilePage = await mobileContext.newPage();

    console.log('1. Navigating to mobile login (dark mode)...');
    await mobilePage.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_login_dark.png'), fullPage: false });

    // Toggle theme to light mode
    console.log('2. Toggling theme to light mode on mobile login...');
    const themeBtn = await mobilePage.$('header button[type="button"]');
    if (themeBtn) {
      await themeBtn.click();
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_login_light.png'), fullPage: false });
      // Toggle back to dark
      await themeBtn.click();
      await mobilePage.waitForTimeout(600);
    }

    // Perform login
    console.log('3. Logging in as admin on mobile...');
    await mobilePage.fill('input[type="email"]', 'admin@santaluisa.edu.ve');
    await mobilePage.fill('input[type="password"]', 'admin123');
    await mobilePage.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await mobilePage.waitForURL('**/dashboard', { timeout: 15000 });
    await mobilePage.waitForTimeout(1500);
    console.log('4. Capturing mobile dashboard with BottomNav dock...');
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_dashboard_dock.png'), fullPage: false });

    // Test mobile schedules via BottomNav
    console.log('5. Navigating to mobile schedules via BottomNav...');
    await mobilePage.click('nav[aria-label*="Navegación"] a[href="/schedules"]');
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_schedules_agenda.png'), fullPage: false });

    // Switch day tab on mobile
    console.log('6. Switching day tab to Martes...');
    await mobilePage.click('button:has-text("MAR")');
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_schedules_tuesday.png'), fullPage: false });

    // Test mobile students page via bottom nav dock
    console.log('7. Navigating to mobile students page via bottom nav...');
    await mobilePage.click('nav[aria-label*="Navegación"] a[href="/students"]');
    await mobilePage.waitForTimeout(2000);
    console.log('Capturing mobile students cards...');
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_students_cards.png'), fullPage: false });

    // Open student drawer
    console.log('8. Opening student drawer on mobile...');
    await mobilePage.click('button:has-text("Inscribir Estudiante")');
    await mobilePage.waitForTimeout(1200);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_student_drawer.png'), fullPage: false });

    await mobileContext.close();

    // -------------------------------------------------------------
    // 2. TABLET TESTS (iPad / Medium screen: 820 x 1180)
    // -------------------------------------------------------------
    console.log('9. Starting tablet tests (820 x 1180)...');
    const tabletContext = await browser.newContext({
      viewport: { width: 820, height: 1180 },
      deviceScaleFactor: 2,
      colorScheme: 'dark'
    });
    const tabletPage = await tabletContext.newPage();

    // Log in on tablet
    await tabletPage.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    await tabletPage.fill('input[type="email"]', 'admin@santaluisa.edu.ve');
    await tabletPage.fill('input[type="password"]', 'admin123');
    await tabletPage.click('button[type="submit"]');
    await tabletPage.waitForURL('**/dashboard', { timeout: 15000 });
    await tabletPage.waitForTimeout(1500);

    console.log('10. Capturing tablet dashboard...');
    await tabletPage.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_dashboard.png'), fullPage: false });

    console.log('11. Capturing tablet schedules...');
    await tabletPage.click('nav[aria-label*="Navegación"] a[href="/schedules"]');
    await tabletPage.waitForTimeout(1500);
    await tabletPage.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_schedules_table.png'), fullPage: false });

    await tabletContext.close();

    // -------------------------------------------------------------
    // 3. DESKTOP TESTS (1440 x 900)
    // -------------------------------------------------------------
    console.log('12. Starting desktop tests (1440 x 900)...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
      colorScheme: 'dark'
    });
    const desktopPage = await desktopContext.newPage();

    // Log in on desktop
    await desktopPage.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    await desktopPage.fill('input[type="email"]', 'admin@santaluisa.edu.ve');
    await desktopPage.fill('input[type="password"]', 'admin123');
    await desktopPage.click('button[type="submit"]');
    await desktopPage.waitForURL('**/dashboard', { timeout: 15000 });
    await desktopPage.waitForTimeout(1500);

    console.log('13. Capturing desktop dashboard...');
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_dashboard.png'), fullPage: false });

    console.log('14. Capturing desktop schedules...');
    await desktopPage.click('aside a[href="/schedules"]');
    await desktopPage.waitForTimeout(1500);
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_schedules.png'), fullPage: false });

    console.log('15. Capturing desktop subjects...');
    await desktopPage.click('aside a[href="/subjects"]');
    await desktopPage.waitForTimeout(1500);
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_subjects.png'), fullPage: false });

    await desktopContext.close();

    console.log('🎉 Visual audit completed! All screenshots captured successfully.');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
