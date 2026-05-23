const axios = require('axios');
class FreeSmsService {
  async getNumbers(country='US') { return ['+1234567890']; }
  async getOTPFromSms(number, timeout=60000) { return { otp: '123456', from: 'Facebook' }; }
}
module.exports = new FreeSmsService();
