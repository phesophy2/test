// Test Facebook Login with Created Account
const { chromium } = require('playwright');

async function testLogin(email, password) {
  console.log(`\n🔐 Testing login: ${email}`);
  
  const launchOpts = {
    headless: true,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', '--disable-gpu',
    ],
  };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  } else if (process.platform === 'linux') {
    launchOpts.executablePath = '/usr/bin/chromium-browser';
  }

  const browser = await chromium.launch(launchOpts);

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    // Go to Facebook login
    console.log('📱 Loading facebook.com...');
    await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Fill email
    console.log('✍️ Entering credentials...');
    await page.fill('input[name="email"]', email);
    await page.waitForTimeout(500);
    
    // Fill password
    await page.fill('input[name="pass"]', password);
    await page.waitForTimeout(500);

    // Click login - try multiple selectors
    console.log('🚀 Clicking login...');
    try {
      await Promise.all([
        page.waitForNavigation({ timeout: 20000, waitUntil: 'domcontentloaded' }).catch(() => {}),
        page.click('button[name="login"]', { timeout: 5000 }),
      ]);
    } catch (e) {
      // Try alternative: press Enter
      console.log('⚠️ Trying Enter key...');
      await Promise.all([
        page.waitForNavigation({ timeout: 20000, waitUntil: 'domcontentloaded' }).catch(() => {}),
        page.keyboard.press('Enter'),
      ]);
    }
    await page.waitForTimeout(3000);

    // Check result
    const finalUrl = page.url();
    const content = await page.content();
    
    console.log(`📍 Final URL: ${finalUrl}`);

    // Take screenshot
    await page.screenshot({ path: `/app/logs/login_test_${Date.now()}.png` });

    // Determine if login was successful
    const success = 
      finalUrl.includes('/home') ||
      finalUrl.includes('/feed') ||
      finalUrl.includes('checkpoint') ||
      finalUrl.includes('confirmemail') ||
      content.includes('What\'s on your mind') ||
      content.includes('Create Post') ||
      (!finalUrl.includes('/login') && !content.includes('Log into Facebook'));

    if (success) {
      console.log('✅ LOGIN SUCCESS! Account is REAL and working!');
      if (finalUrl.includes('checkpoint') || finalUrl.includes('confirmemail')) {
        console.log('⚠️ Needs verification (email/phone)');
      }
    } else {
      console.log('❌ LOGIN FAILED - Account may not exist or credentials wrong');
      console.log(`Content snippet: ${content.substring(0, 300)}`);
    }

    await browser.close();
    return success;

  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
    return false;
  }
}

// Get credentials from command line
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node test_login.js <email> <password>');
  process.exit(1);
}

testLogin(email, password).then(success => {
  process.exit(success ? 0 : 1);
});
