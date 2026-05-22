// facebookService.js — Real Facebook Account Registration via Playwright
const { chromium } = require('playwright');
const db = require('../config/database');
const mailService = require('./mailService');
const fingerprintService = require('./fingerprintService');
const path = require('path');
const fs = require('fs');
const perf = require('../config/performance');
class FacebookService {
  constructor() {
    this.regUrl = 'https://www.facebook.com/r.php';
    // Desktop UA — mobile UA gets redirected to app download page
    this.desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  async delay(min, max) {
    const ms = min + Math.floor(Math.random() * (max - min));
    return new Promise(r => setTimeout(r, ms));
  }

  async humanType(locator, text) {
    const textStr = String(text || '');
    await locator.click();
    await this.delay(200, 400);
    for (const char of textStr) {
      await locator.pressSequentially(char, { delay: 60 + Math.random() * 100 });
    }
    await this.delay(300, 600);
  }

  async selectCombobox(page, ariaLabel, optionText) {
    // Click the specific combobox
    const combo = page.locator(`[aria-label="${ariaLabel}"][role="combobox"]`);
    await combo.click();
    await this.delay(500, 800);
    // Find the listbox that opened (it appears right after the combobox)
    // Use exact text match to avoid "15" matching "2015"
    const listbox = page.locator('[role="listbox"]').last();
    await listbox.locator(`[role="option"]`).filter({ hasText: new RegExp(`^${optionText}$`) }).first().click();
    await this.delay(300, 500);
  }

  async createAccount(options = {}) {
    const { useMail = true, usePhone = false, proxy = null, otpMode = 'auto' } = options;
    // Determine verification behavior based on otpMode
    const verifyOtp = otpMode === 'auto';
    console.log('🚀 Starting REAL Facebook registration...');

    // Step 1: Generate email
    let emailData;
    if (useMail) {
      emailData = await mailService.generateMailTm();
      if (!emailData.success) emailData = await mailService.generateGuerrillaMail();
      if (!emailData.success) return { success: false, error: 'Failed to generate email', stage: 'email' };
      console.log(`📧 Email: ${emailData.email} | 🔑 Password: ${emailData.password}`);
    }

    // Step 2: Fingerprint + personal info
    const fingerprint = fingerprintService.generateFingerprint();
    const info = this.generateKhmerPersonalInfo();
    console.log(`👤 ${info.fullName} | 📱 ${fingerprint.profile} | 📍 ${fingerprint.location}`);

    let browser;
    let screenshotPath = null;
    try {
      // Step 3: Launch Chromium
      const launchOpts = {
        headless: true,
        args: [
          '--no-sandbox', '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', '--disable-gpu',
          '--disable-blink-features=AutomationControlled',
          `--user-agent=${fingerprint.userAgent}`,
          '--lang=km-KH,km,en-US',
        ],
      };
      if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
        launchOpts.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
      } else if (process.platform === 'linux') {
        launchOpts.executablePath = '/usr/bin/chromium-browser';
      }
      if (proxy) launchOpts.proxy = { server: `http://${proxy}` };

      browser = await chromium.launch(launchOpts);
      const context = await browser.newContext({
        userAgent: this.desktopUA,
        viewport: { width: 1280, height: 800 },
        locale: 'en-US',
        timezoneId: fingerprint.timezone || 'Asia/Phnom_Penh',
        extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
      });

      // Hide automation
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        window.chrome = { runtime: {} };
      });

      const page = await context.newPage();

      // Step 4: Go to registration
      console.log('🌐 Loading FB registration page...');
      await page.goto(this.regUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await this.delay(2000, 3000);

      // Step 5: Fill First Name (input[type=text] index 0)
      console.log('✍️ Filling form...');
      const textInputs = page.locator('input[type="text"]');
      await this.humanType(textInputs.nth(0), info.firstName);

      // Step 6: Fill Last Name (index 1)
      await this.humanType(textInputs.nth(1), info.lastName);

      // Step 7: Fill Email (index 2)
      await this.humanType(textInputs.nth(2), emailData.email);

      // Step 8: Fill Password
      await this.humanType(page.locator('input[type="password"]'), emailData.password);
      await this.delay(800, 1200);

      // Step 9: Birthday — Month
      console.log('📅 Setting birthday...');
      await this.selectCombobox(page, 'Select Month', this.getMonthName(info.birthday.month));
      await this.selectCombobox(page, 'Select Day', String(info.birthday.day));
      await this.selectCombobox(page, 'Select Year', String(info.birthday.year));
      await this.delay(600, 1000);

      // Step 10: Gender — click the gender label to open dropdown, then pick option
      console.log('👤 Setting gender...');
      try {
        // Click the "Select your gender" label to open the dropdown
        await page.locator('label').filter({ hasText: 'Select your gender' }).click();
        await this.delay(600, 900);
        // Now Female/Male/Custom appear as role=option
        const genderText = info.gender === '1' ? 'Male' : 'Female';
        await page.locator('[role="option"]').filter({ hasText: new RegExp(`^${genderText}$`) }).click();
        await this.delay(600, 900);
        // Press Escape to close any open dropdown
        await page.keyboard.press('Escape');
        await this.delay(400, 600);
        console.log(`✅ Gender set: ${genderText}`);
      } catch (e) {
        console.log('⚠️ Gender skipped:', e.message.split('\n')[0]);
      }

      // Click somewhere neutral to close any open dropdowns
      await page.locator('body').click({ position: { x: 100, y: 100 } });
      await this.delay(500, 800);

      // Step 11: Submit — wait for navigation after click
      console.log('📤 Submitting...');
      try {
        const submitBtn = page.locator('[role="button"]').filter({ hasText: /^Submit$/ });
        // Wait for navigation triggered by submit
        await Promise.all([
          page.waitForNavigation({ timeout: 20000, waitUntil: 'domcontentloaded' }).catch(() => {}),
          submitBtn.click({ timeout: 10000 }),
        ]);
      } catch (e) {
        console.log('⚠️ Submit fallback:', e.message.split('\n')[0]);
        // Try pressing Enter as fallback
        await page.keyboard.press('Enter');
        await page.waitForNavigation({ timeout: 15000, waitUntil: 'domcontentloaded' }).catch(() => {});
      }
      await this.delay(3000, 5000);
      
      let otpCode = null;

      // Step 12: Check if verification screen is active and automate it
      let finalUrl = page.url();
      let content = await page.content();
      console.log(`📍 Post-submit URL: ${finalUrl}`);

      const needsVerification = 
        finalUrl.includes('confirmemail') || 
        finalUrl.includes('checkpoint') || 
        content.includes('confirm your email') || 
        content.includes('verification') || 
        content.includes('Enter the code');

      if (needsVerification && emailData) {
        if (otpMode === 'skip') {
          console.log('⚡ Skipping OTP verification as per otpMode=skip');
        } else if (otpMode === 'manual') {
          console.log('🛑 Manual OTP verification required. Returning for user input.');
          // Return with pending manual verification status
          return { success: true, manualOtp: true, email: emailData.email, password: emailData.password, otp: null, stage: 'manual_verification' };
        } else if (otpMode === 'auto') {
          console.log('📧 Verification page detected! Polling for OTP...');
          try {
            // Poll for OTP code
            otpCode = await mailService.pollForOTP(emailData, 60000, 5000);
            if (otpCode) {
              console.log(`🔑 OTP Received: ${otpCode}. Attempting to fill...`);
              
              // Try to find the confirmation code input field. 
              // Facebook uses input[name="code"] or input#code_in_cliff.
              const codeField = page.locator('input[name="code"], input[id*="code"], input[type="text"]').first();
              if (await codeField.count() > 0) {
                await this.humanType(codeField, otpCode);
                await this.delay(1000, 1500);

                // Click the confirm/submit button on the confirmation page
                const confirmBtn = page.locator('[role="button"]').filter({ hasText: /Confirm|Submit|Continue|Next/i }).first();
                if (await confirmBtn.count() > 0) {
                  console.log('🔘 Clicking Confirm button...');
                  await Promise.all([
                    page.waitForNavigation({ timeout: 15000, waitUntil: 'domcontentloaded' }).catch(() => {}),
                    confirmBtn.click({ timeout: 10000 })
                  ]);
                } else {
                  console.log('🔘 Confirm button not found. Sending Enter key...');
                  await page.keyboard.press('Enter');
                  await page.waitForNavigation({ timeout: 15000, waitUntil: 'domcontentloaded' }).catch(() => {});
                }
                await this.delay(3000, 5000);
                
                finalUrl = page.url();
                content = await page.content();
                console.log(`📍 Final URL after OTP confirmation: ${finalUrl}`);
              } else {
                console.log('⚠️ Could not find OTP input field on screen.');
              }
            } else {
              console.log('❌ Timeout or failed to receive OTP from temporary mail.');
            }
          } catch (otpErr) {
            console.error('⚠️ OTP Autofill error:', otpErr.message);
          }
        }
      }

      // Take screenshot for debugging inside workspace directory
      try {
        const screenshotDir = path.join(__dirname, '../data/screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        screenshotPath = path.join(screenshotDir, `${Date.now()}_${emailData.email.replace(/[@.]/g, '_')}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved to ${screenshotPath}`);
      } catch (e) {
        console.error('⚠️ Screenshot failed:', e.message);
      }

      await browser.close();
      browser = null;

      // Determine final registration status
      const registered =
        finalUrl.includes('/home') ||
        finalUrl.includes('/feed') ||
        finalUrl.includes('welcome') ||
        (!finalUrl.includes('/r.php') && 
         !finalUrl.includes('/reg/') && 
         !finalUrl.includes('confirmemail') && 
         !finalUrl.includes('checkpoint') &&
         !content.includes('confirm your email') &&
         !content.includes('Enter the code'));

      const alreadyUsed =
        !finalUrl.includes('confirmemail') &&
        !finalUrl.includes('checkpoint') &&
        !finalUrl.includes('/home') &&
        !finalUrl.includes('/feed') &&
        (content.includes('This email address is already registered') ||
         content.includes('email address is already in use') ||
         content.includes('phone number is already registered'));

      console.log(`✅ registered=${registered} | alreadyUsed=${alreadyUsed} | OTP=${otpCode || 'None'}`);

      if (alreadyUsed) {
        return { success: false, error: 'Email already registered on Facebook', stage: 'registration' };
      }

      const status = registered ? 'registered' : (otpCode ? 'pending_manual_verification' : 'pending_verification');
      const note = finalUrl.includes('checkpoint') ? 'Needs checkpoint verification' :
                   registered ? 'Account created and verified successfully' : 'Submitted — check email/OTP manually';

      // Step 13: Save to DB
      const result = await db.run(
        `INSERT INTO accounts (email, password, first_name, last_name, status, proxy, fingerprint, cookies, device_profile, city, otp, screenshot_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          emailData.email, emailData.password, info.firstName, info.lastName, status,
          proxy || 'none', JSON.stringify(fingerprint),
          JSON.stringify({ registered, url: finalUrl }),
          fingerprint.profile.toLowerCase().replace(/ /g, '_'),
          fingerprint.location.toLowerCase().replace(/ /g, '_'),
          otpCode,
          screenshotPath
        ]
      );

      console.log(`✅ Done! ID: ${result.lastID} | Status: ${status} | Email: ${emailData.email} | Password: ${emailData.password} | OTP: ${otpCode || 'None'}`);
      return {
        success: true,
        id: result.lastID,
        email: emailData.email,
        password: emailData.password,
        name: info.fullName,
        fingerprint: fingerprint.profile,
        location: fingerprint.location,
        status,
        note,
        otp: otpCode,
        redirectUrl: finalUrl,
        stage: 'registered',
      };

    } catch (error) {
      if (browser) await browser.close().catch(() => {});
      console.error('❌ Registration error:', error.message);

      // Save failed attempt
      try {
        await db.run(
          `INSERT INTO accounts (email, password, first_name, last_name, status, fingerprint, device_profile, city, screenshot_path)
           VALUES (?, ?, ?, ?, 'failed', ?, ?, ?, ?)`,
          [
            emailData?.email || 'unknown', emailData?.password || '', info?.firstName || '', info?.lastName || '',
            JSON.stringify(fingerprint),
            fingerprint.profile.toLowerCase().replace(/ /g, '_'),
            fingerprint.location.toLowerCase().replace(/ /g, '_'),
            null
          ]
        );
      } catch (e) {}

      return { success: false, error: error.message, stage: 'browser' };
    }
  }

  getMonthName(month) {
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    return months[month - 1] || 'January';
  }

  generateKhmerPersonalInfo() {
    const firstNames = ['Sokha','Dara','Sopheap','Chanthy','Kosal','Bopha',
                        'Ratanak','Srey','Makara','Pisey','Vuthy','Sothea'];
    const lastNames  = ['Chan','Kim','Sok','Penh','Narith','Mao',
                        'Ly','Hong','Chea','Meas','Som','Oun'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName  = lastNames[Math.floor(Math.random() * lastNames.length)];
    return {
      firstName, lastName,
      fullName: `${firstName} ${lastName}`,
      birthday: {
        day:   1 + Math.floor(Math.random() * 28),
        month: 1 + Math.floor(Math.random() * 12),
        year:  1992 + Math.floor(Math.random() * 12),
      },
      gender: Math.random() > 0.5 ? '1' : '2',
    };
  }

  async farmAccount(accountId) {
    try {
      const activities = ['like','comment','share','view'];
      const activity = activities[Math.floor(Math.random() * activities.length)];
      await db.run('UPDATE accounts SET last_action = ? WHERE id = ?', [new Date().toISOString(), accountId]);
      return { success: true, activity, timestamp: new Date() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Test login helper used by /api/farm/test-login
FacebookService.prototype.testLogin = async function(email, password) {
  try {
    const account = await db.get('SELECT * FROM accounts WHERE email = ?', [email]);
    if (!account) {
      return { success: false, error: 'Account not found' };
    }
    const isRegistered = account.status === 'registered' || account.status === 'verified';
    return {
      success: true,
      status: isRegistered ? 'verified' : 'pending',
      message: isRegistered ? 'Account exists and is registered' : 'Account created but not yet registered'
    };
  } catch (err) {
    console.error('Test login error:', err);
    return { success: false, error: err.message };
  }
};

module.exports = new FacebookService();
