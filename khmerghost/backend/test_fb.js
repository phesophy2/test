const { chromium } = require('playwright');
(async () => {
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const launchOpts = {
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  } else if (process.platform === 'linux') {
    launchOpts.executablePath = '/usr/bin/chromium-browser';
  }
  const b = await chromium.launch(launchOpts);
  const ctx = await b.newContext({ userAgent: UA, viewport: { width: 1280, height: 800 }, locale: 'en-US' });
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
  });
  const p = await ctx.newPage();
  await p.goto('https://www.facebook.com/r.php', { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const ti = await p.locator('input[type=text]').all();
  await ti[0].fill('Sokha');
  await ti[1].fill('Chan');
  await ti[2].fill('sokha_test_final@wshu.net');
  await p.locator('input[type=password]').fill('TestPass123!');
  await new Promise(r => setTimeout(r, 800));
  await p.locator('[aria-label="Select Month"][role=combobox]').click();
  await new Promise(r => setTimeout(r, 500));
  await p.locator('[role=listbox]').last().locator('[role=option]').filter({ hasText: /^March$/ }).first().click();
  await new Promise(r => setTimeout(r, 400));
  await p.locator('[aria-label="Select Day"][role=combobox]').click();
  await new Promise(r => setTimeout(r, 500));
  await p.locator('[role=listbox]').last().locator('[role=option]').filter({ hasText: /^15$/ }).first().click();
  await new Promise(r => setTimeout(r, 400));
  await p.locator('[aria-label="Select Year"][role=combobox]').click();
  await new Promise(r => setTimeout(r, 500));
  await p.locator('[role=listbox]').last().locator('[role=option]').filter({ hasText: /^1995$/ }).first().click();
  await new Promise(r => setTimeout(r, 800));
  await p.locator('label').filter({ hasText: 'Select your gender' }).click();
  await new Promise(r => setTimeout(r, 600));
  await p.locator('[role=option]').filter({ hasText: /^Female$/ }).click();
  await new Promise(r => setTimeout(r, 600));
  await p.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));
  await p.locator('body').click({ position: { x: 100, y: 100 } });
  await new Promise(r => setTimeout(r, 500));

  // Check form state
  const state = await p.evaluate(() => {
    const submitBtn = [...document.querySelectorAll('[role=button]')].find(b => b.innerText.trim() === 'Submit');
    const inputs = [...document.querySelectorAll('input')].map(i => ({ type: i.type, value: i.value.substring(0, 20) }));
    const bodySnip = document.body.innerText.substring(0, 400);
    return {
      submitFound: !!submitBtn,
      submitDisabled: submitBtn ? submitBtn.getAttribute('aria-disabled') : 'N/A',
      inputs,
      bodySnip
    };
  });
  console.log('STATE:', JSON.stringify(state, null, 2));

  // Click submit
  console.log('Clicking Submit...');
  const submitBtn = p.locator('[role=button]').filter({ hasText: /^Submit$/ });
  await submitBtn.click({ timeout: 10000 });
  await new Promise(r => setTimeout(r, 8000));

  const afterUrl = p.url();
  const afterBody = await p.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('After URL:', afterUrl);
  console.log('After body:', afterBody);
  await b.close();
})().catch(e => console.log('ERR:', e.message));
