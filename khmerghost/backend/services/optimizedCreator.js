const { chromium } = require('playwright');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

class OptimizedCreator {
  async createAccount() {
    const browser = await chromium.launch({
      headless: false, // CRITICAL: non-headless = higher success
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=390,844' // Mobile size
      ]
    });

    try {
      // 1. MOBILE CONTEXT (Lower ban rate)
      const context = await browser.newContext({
        userAgent: this.getMobileUserAgent(),
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
        locale: 'km-KH',
        timezoneId: 'Asia/Phnom_Penh',
        permissions: ['geolocation'],
        geolocation: { latitude: 11.5564, longitude: 104.9282 }
      });

      // 2. STEALTH SCRIPT (Hide automation)
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        Object.defineProperty(navigator, 'languages', { get: () => ['km', 'en-US', 'en'] });
        window.chrome = { runtime: {} };
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function (x, y, w, h) {
          const imageData = originalGetImageData.call(this, x, y, w, h);
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] += Math.random() * 10;
          }
          return imageData;
        };
      });

      const page = await context.newPage();

      // 3. USE MOBILE FACEBOOK (m.facebook.com)
      await page.goto('https://m.facebook.com/r.php', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Random initial wait (2-5 seconds)
      await this.sleep(2000 + Math.random() * 3000);

      // 4. GENERATE REAL KHMER PROFILE
      const profile = this.generateKhmerProfile();

      // 5. HUMAN TYPING (No paste, random delays)
      await this.humanType(page, 'input[name="firstname"]', profile.firstName);
      await this.humanType(page, 'input[name="lastname"]', profile.lastName);

      // 6. BIRTHDAY (18-35 years old)
      await page.selectOption('select[name="birthday_day"]', profile.birthday.day);
      await this.sleep(200 + Math.random() * 300);
      await page.selectOption('select[name="birthday_month"]', profile.birthday.month);
      await this.sleep(200 + Math.random() * 300);
      await page.selectOption('select[name="birthday_year"]', profile.birthday.year);

      // 7. GENDER
      await this.sleep(300 + Math.random() * 500);
      await page.click(`input[name="sex"][value="${profile.gender}"]`);

      // 8. HIGH QUALITY EMAIL (Mail.tm - best free option)
      const email = await this.getMailTmEmail();
      await this.humanType(page, 'input[name="reg_email__"]', email);

      // 9. STRONG PASSWORD
      const password = this.generateStrongPassword();
      await this.humanType(page, 'input[name="reg_passwd__"]', password);

      // 10. RANDOM MOUSE MOVEMENT before submit
      await this.randomMouseMove(page);

      // 11. SUBMIT
      await page.click('button[name="websubmit"]');

      // 12. WAIT FOR OTP (up to 90 seconds)
      const otp = await this.waitForMailTmOtp(email, 90000);

      let finalStatus = 'registered';
      let otpCode = null;

      if (otp) {
        otpCode = otp;
        await this.humanType(page, '#confirmation_code_input', otp);
        await this.sleep(500);
        await page.click('button[type="submit"]');
        await this.sleep(3000);
        finalStatus = 'verified';
      }

      // 13. ADD PROFILE PICTURE (Increases survival rate dramatically)
      await this.addRandomProfilePicture(page);

      // 14. QUICK LOGOUT (Don't stay logged in)
      await page.goto('https://m.facebook.com/logout.php');

      await browser.close();

      return {
        success: true,
        account: {
          email,
          password,
          firstName: profile.firstName,
          lastName: profile.lastName,
          otpCode,
          status: finalStatus,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Creation error:', error.message);
      await browser.close();
      return { success: false, error: error.message };
    }
  }

  // ============ HELPER METHODS ============
  getMobileUserAgent() {
    const agents = [
      'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/121.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }

  generateKhmerProfile() {
    const firstNames = ['Sokha', 'Dara', 'Rithy', 'Srey', 'Vannak', 'Borey', 'Chanthou', 'Malis', 'Piseth', 'Srey Nich', 'Sokun', 'Theara', 'Visal', 'Ratanak'];
    const lastNames = ['Sok', 'Chea', 'Prak', 'Khiev', 'Heng', 'Lim', 'Meas', 'Sin', 'Chan', 'Nhem', 'Soeung', 'Lay', 'Kong', 'Pen', 'Ear'];
    const year = Math.floor(Math.random() * (2005 - 1990 + 1) + 1990);
    const month = Math.floor(Math.random() * 12) + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    return {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      birthday: {
        day: day.toString(),
        month: month.toString(),
        year: year.toString()
      },
      gender: Math.random() > 0.5 ? '2' : '1' // 1=Male, 2=Female
    };
  }

  async humanType(page, selector, text) {
    await page.focus(selector);
    for (let i = 0; i < text.length; i++) {
      const delay = 80 + Math.random() * 120;
      await page.type(selector, text[i], { delay });
      if (i % 5 === 0 && i > 0) {
        await this.sleep(100 + Math.random() * 200);
      }
    }
    await this.sleep(150 + Math.random() * 250);
  }

  async randomMouseMove(page) {
    const x = Math.random() * 300;
    const y = Math.random() * 600;
    await page.mouse.move(x, y, { steps: 10 + Math.floor(Math.random() * 10) });
    await this.sleep(200 + Math.random() * 500);
  }

  async getMailTmEmail() {
    const domain = '@mail.tm';
    const localPart = Math.random().toString(36).substring(2, 12);
    const email = localPart + domain;
    this.currentEmail = email;
    this.emailPrefix = localPart;
    return email;
  }

  async waitForMailTmOtp(email, timeout = 90000) {
    const startTime = Date.now();
    const prefix = email.split('@')[0];
    while (Date.now() - startTime < timeout) {
      try {
        const response = await axios.get(`https://api.mail.tm/messages/${prefix}`, { timeout: 5000 });
        const messages = response.data['hydra:member'] || [];
        for (const msg of messages) {
          if (msg.subject && msg.subject.includes('Facebook')) {
            const body = msg.text || msg.html || '';
            const otpMatch = body.match(/\b\d{5,6}\b/);
            if (otpMatch) return otpMatch[0];
          }
        }
      } catch (e) {
        // ignore
      }
      await this.sleep(3000);
    }
    return null;
  }

  generateStrongPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 14; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password + 'Aa1!';
  }

  async addRandomProfilePicture(page) {
    const randomId = Math.floor(Math.random() * 100);
    const gender = Math.random() > 0.5 ? 'women' : 'men';
    const photoUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;
    try {
      const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      await page.goto('https://m.facebook.com/profile.php');
      await this.sleep(2000);
      const addPhotoBtn = await page.$('[aria-label="Add photo"]');
      if (addPhotoBtn) {
        await addPhotoBtn.click();
        await this.sleep(1000);
        await page.setInputFiles('input[type="file"]', {
          name: 'profile.jpg',
          buffer: buffer
        });
        await this.sleep(2000);
        await page.click('button[type="submit"]');
        await this.sleep(3000);
      }
    } catch (e) {
      console.log('Profile picture upload skipped:', e.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new OptimizedCreator();
