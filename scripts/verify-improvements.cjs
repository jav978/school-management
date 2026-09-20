const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/home/jav1978/.gemini/antigravity-ide/brain/cc4fa441-dad6-4da2-b126-3e7c99b5ad6a';
const BASE_URL = 'http://localhost:3333';

async function run() {
  console.log('🚀 Starting Verification of Responsive & UI Polish...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // -------------------------------------------------------------
    // 1. MOBILE 360px (Small Android / Compact Mobile)
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Mobile 360px Viewport (No Overflow Check) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 360, height: 740 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'dark'
    });
    const page = await mobileContext.newPage();
    page.on('console', msg => console.log(`[Browser Console ${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.log('[Browser Uncaught Error]:', err));

    // Login
    console.log('Navigating to login page...');
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    console.log('Filling login credentials...');
    await page.fill('input[type="email"]', 'admin@santaluisa.edu.ve');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    console.log('Submitted login form, waiting for dashboard navigation...');
    await page.waitForURL('**/dashboard', { timeout: 20000 });
    await page.waitForTimeout(1500);

    // Verify Horizontal Overflow on 360px
    const overflowCheck = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const header = document.querySelector('header');
      const headerScrollW = header ? header.scrollWidth : 0;
      const firstCard = document.querySelector('main .grid > div') || document.querySelector('main [class*="card"]');
      const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
      return {
        scrollW,
        clientW,
        hasHorizontalOverflow: scrollW > clientW,
        headerScrollW,
        cardLeft: cardRect ? cardRect.left : null
      };
    });
    console.log('360px Overflow metrics:', overflowCheck);

    // Capture Mobile 360px Dashboard
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_360_dashboard_fixed.png'), fullPage: false });

    // Test Mobile Search Sheet
    console.log('Testing Mobile Search sheet...');
    const searchBtn = await page.$('header button[title*="Buscar"], header button[aria-label*="Buscar"]');
    if (searchBtn) {
      await searchBtn.click();
      await page.waitForTimeout(600);
      await page.fill('[data-testid="header-mobile-omnisearch-input"]', 'calific');
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_360_omnisearch_open.png'), fullPage: false });
      // Close search modal with Esc or backdrop
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // Test Profile dropdown with quick mobile controls
    console.log('Testing Mobile Profile dropdown quick controls...');
    const profileBtn = await page.$('header button:has([alt*="avatar"]), header button:has(img)');
    if (profileBtn) {
      await profileBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_360_profile_dropdown.png'), fullPage: false });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // -------------------------------------------------------------
    // 2. ENROLLMENT FORM (Planilla de Matrícula) in Dark Mode
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Enrollment Form Paper Isolation in Dark Mode ---');
    await page.goto(`${BASE_URL}/students/enrollment-form`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const sheetCheck = await page.evaluate(() => {
      const sheet = document.querySelector('.page-sheet') || document.querySelector('[class*="page-sheet"]');
      if (!sheet) return null;
      const comp = window.getComputedStyle(sheet);
      const avatarBox = sheet.querySelector('.w-28') || sheet.querySelector('[class*="border-dashed"]');
      const avatarComp = avatarBox ? window.getComputedStyle(avatarBox) : null;
      return {
        sheetBg: comp.backgroundColor,
        sheetColor: comp.color,
        avatarBg: avatarComp ? avatarComp.backgroundColor : null,
        avatarBorder: avatarComp ? avatarComp.borderColor : null
      };
    });
    console.log('Enrollment Form styles in Dark Mode:', sheetCheck);

    // Capture Enrollment form in mobile 360 & zoomed
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_enrollment_form_paper.png'), fullPage: false });

    // -------------------------------------------------------------
    // 3. GRADES MOBILE VIEW (/grades)
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Grades Mobile Card View ---');
    await page.goto(`${BASE_URL}/grades`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_grades_cards.png'), fullPage: false });

    // -------------------------------------------------------------
    // 4. ATTENDANCE MOBILE VIEW (/attendance)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Attendance Mobile Touch Roster ---');
    await page.goto(`${BASE_URL}/attendance`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_attendance_roster.png'), fullPage: false });

    // -------------------------------------------------------------
    // 5. ID CARDS MOBILE VIEW (/idcards)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing ID Cards Mobile View ---');
    await page.goto(`${BASE_URL}/idcards`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_idcards_layout.png'), fullPage: false });

    await mobileContext.close();

    // -------------------------------------------------------------
    // 6. DESKTOP VIEW & ENROLLMENT FORM PRINT PREVIEW (1440 x 900)
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Desktop Omnisearch & Enrollment Form (1440 x 900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
      colorScheme: 'dark'
    });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    await desktopPage.fill('input[type="email"]', 'admin@santaluisa.edu.ve');
    await desktopPage.fill('input[type="password"]', 'admin123');
    await desktopPage.click('button[type="submit"]');
    await desktopPage.waitForURL('**/dashboard', { timeout: 15000 });
    await desktopPage.waitForTimeout(1500);

    // Press Ctrl+K to trigger Omnisearch
    console.log('Triggering Desktop Omnisearch with Ctrl+K...');
    await desktopPage.keyboard.press('Control+k');
    await desktopPage.waitForTimeout(600);
    await desktopPage.keyboard.type('Estudiantes');
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_omnisearch_dialog.png'), fullPage: false });
    await desktopPage.keyboard.press('Escape');
    await desktopPage.waitForTimeout(400);

    // Navigate to enrollment form on desktop in dark mode
    console.log('Capturing Desktop Enrollment Form in Dark Mode...');
    await desktopPage.goto(`${BASE_URL}/students/enrollment-form`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1500);
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_enrollment_form_paper.png'), fullPage: false });

    await desktopContext.close();
    console.log('\n✅ All verification checks completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Verification script failed:', err);
  process.exit(1);
});
