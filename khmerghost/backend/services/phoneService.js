// phoneService.js — សេវាបង្កើតលេខទូរស័ព្ទឥតគិតថ្លៃ
const axios = require('axios');
const cheerio = require('cheerio');

class PhoneService {
  constructor() {
    this.sites = {
      receiveSmss: 'https://receive-smss.com',
      smsOnline: 'https://sms-online.co',
      freePhoneNum: 'https://www.freephonenum.com'
    };
  }
  
  async getFreeNumbers(country = 'US') {
    try {
      const res = await axios.get(
        `${this.sites.receiveSmss}/country/${country}`,
        { 
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        }
      );
      
      const $ = cheerio.load(res.data);
      const numbers = [];
      
      $('.number-box').each((i, elem) => {
        const numText = $(elem).find('h4').text().trim();
        const numMatch = numText.match(/\+?[\d\s\-\(\)]+/);
        const link = $(elem).find('a').attr('href');
        
        if (numMatch && link) {
          numbers.push({
            number: numMatch[0].replace(/\s/g, '').replace(/-/g, ''),
            display: numMatch[0],
            country,
            url: `${this.sites.receiveSmss}${link}`,
            provider: 'receive-smss'
          });
        }
      });
      
      return { success: true, numbers, count: numbers.length };
    } catch (error) {
      console.error('❌ Failed to fetch free numbers:', error.message);
      return { success: false, error: error.message, numbers: [] };
    }
  }
  
  async getMessages(numberUrl) {
    try {
      const res = await axios.get(numberUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(res.data);
      const messages = [];
      
      $('.sms-message').each((i, elem) => {
        const from = $(elem).find('.from').text().trim();
        const text = $(elem).find('.text').text().trim();
        const time = $(elem).find('.time').text().trim();
        
        messages.push({ from, text, time });
      });
      
      // Extract OTPs
      const otps = [];
      messages.forEach(msg => {
        const otpMatch = msg.text.match(/\b\d{4,8}\b/);
        if (otpMatch) {
          otps.push({
            otp: otpMatch[0],
            from: msg.from,
            time: msg.time,
            fullText: msg.text
          });
        }
      });
      
      return { success: true, messages, otps, count: messages.length };
    } catch (error) {
      return { success: false, error: error.message, messages: [], otps: [] };
    }
  }
  
  async getOTP(numberUrl, timeout = 120000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const result = await this.getMessages(numberUrl);
      
      if (result.otps && result.otps.length > 0) {
        return {
          success: true,
          otp: result.otps[0].otp,
          from: result.otps[0].from,
          waitTime: Date.now() - startTime
        };
      }
      
      // Wait 5 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    return { success: false, error: 'OTP timeout', otp: null };
  }
  
  // For TextNow integration (requires app)
  async getTextNowNumber() {
    // This requires the TextNow app or API
    // Implementation would use their internal API
    return { 
      success: false,
      error: 'TextNow requires manual setup via app',
      note: 'Install TextNow app, create account, use number'
    };
  }
}

module.exports = new PhoneService();
