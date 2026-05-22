const axios = require('axios');

class MailService {
  constructor() {
    this.providers = [
      this.generateMailTm,
      this.generateGuerrillaMail,
      this.generateTempMail
    ];
    this.currentProvider = 0;
  }
  
  async generateMailTm() {
    const password = 'KhmerGhost2025!';
    try {
      const response = await axios.post('https://api.mail.tm/accounts', {
        address: `khmer${Math.floor(Math.random() * 10000)}@mail.tm`,
        password: password
      });
      return { email: response.data.address, password: password, provider: 'mail.tm', success: true };
    } catch (error) {
      console.error('Mail.tm failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  async generateGuerrillaMail() {
    const password = `KhmerGhost${Math.floor(1000 + Math.random() * 9000)}!`;
    try {
      const response = await axios.get('https://api.guerrillamail.com/ajax.php', {
        params: { f: 'get_email_address', ip: '127.0.0.1', agent: 'KhmerGhost' }
      });
      return { 
        email: response.data.email_addr, 
        password: password, 
        sidToken: response.data.sid_token,
        provider: 'guerrillamail', 
        success: true 
      };
    } catch (error) {
      console.error('Guerrilla Mail failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  async generateTempMail() {
    const password = `KhmerGhost${Math.floor(1000 + Math.random() * 9000)}!`;
    try {
      const response = await axios.post('https://api.temp-mail.org/request/domains/format/json');
      const domain = response.data[0];
      const username = `khmer${Math.floor(Math.random() * 100000)}`;
      return { email: `${username}@${domain}`, password: password, provider: 'temp-mail', success: true };
    } catch (error) {
      console.error('Temp Mail failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  async generateEmail() {
    for (let i = 0; i < this.providers.length; i++) {
      const result = await this.providers[this.currentProvider]();
      this.currentProvider = (this.currentProvider + 1) % this.providers.length;
      
      if (result.success) {
        return result;
      }
    }
    
    throw new Error('All email providers failed');
  }

  // Retrieve token/authenticate for Mail.tm
  async getMailTmToken(email, password) {
    try {
      const response = await axios.post('https://api.mail.tm/token', {
        address: email,
        password: password
      });
      return response.data.token;
    } catch (error) {
      console.error('Failed to get Mail.tm token:', error.message);
      return null;
    }
  }

  // General inbox check method returning all messages
  async getInbox(emailData) {
    const { provider, email, password, sidToken } = emailData;
    try {
      if (provider === 'mail.tm') {
        const token = await this.getMailTmToken(email, password);
        if (!token) return [];
        const response = await axios.get('https://api.mail.tm/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const members = response.data['hydra:member'] || [];
        return members.map(msg => ({
          id: msg.id,
          from: msg.from?.address || '',
          subject: msg.subject || '',
          intro: msg.intro || '',
          text: msg.intro || ''
        }));
      } 
      
      if (provider === 'guerrillamail') {
        const response = await axios.get('https://api.guerrillamail.com/ajax.php', {
          params: { f: 'check_email', sid_token: sidToken, seq: 1, ip: '127.0.0.1', agent: 'KhmerGhost' }
        });
        const list = response.data.list || [];
        return list.map(msg => ({
          id: msg.mail_id,
          from: msg.mail_from || '',
          subject: msg.mail_subject || '',
          intro: msg.mail_excerpt || '',
          text: msg.mail_excerpt || ''
        }));
      }
    } catch (error) {
      console.error(`Error getting inbox for ${provider}:`, error.message);
    }
    return [];
  }

  // Extract OTP from standard text using regex
  extractOTP(text) {
    if (!text) return null;
    // Look for 5 digit confirmation code (Facebook uses 5 digits)
    // Common formats: "FB-12345", "12345 is your confirmation code", etc.
    const match = text.match(/\b\d{5}\b/);
    return match ? match[0] : null;
  }

  // Poll for OTP code
  async pollForOTP(emailData, timeoutMs = 60000, intervalMs = 5000) {
    const startTime = Date.now();
    console.log(`⏳ Polling inbox for Facebook OTP (${emailData.email})...`);

    while (Date.now() - startTime < timeoutMs) {
      const messages = await this.getInbox(emailData);
      for (const msg of messages) {
        // Facebook confirmation emails usually come from security@facebookmail.com or contain Facebook in the sender/subject
        const isFromFacebook = msg.from.toLowerCase().includes('facebook') || 
                               msg.subject.toLowerCase().includes('facebook') ||
                               msg.intro.toLowerCase().includes('facebook');
        
        if (isFromFacebook) {
          const otp = this.extractOTP(msg.subject) || this.extractOTP(msg.intro);
          if (otp) {
            console.log(`🔑 Found Facebook OTP: ${otp}`);
            return otp;
          }
        }
      }
      await new Promise(r => setTimeout(r, intervalMs));
    }
    console.log('❌ Timeout polling for Facebook OTP.');
    return null;
  }
}

module.exports = new MailService();