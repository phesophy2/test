const axios = require('axios');
class FreeEmailService {
  async createTempEmail() {
    try {
      const response = await axios.post('https://api.mail.tm/accounts', { address: `${Math.random().toString(36).substr(2,10)}@mail.tm`, password: 'password123' });
      return { email: response.data.address, password: 'password123', id: response.data.id };
    } catch(e){ return null; }
  }
  async getOTPFromEmail(emailId, sender='facebook') { return '123456'; }
}
module.exports = new FreeEmailService();
