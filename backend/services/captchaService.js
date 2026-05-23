class CaptchaService {
  constructor(apiKey, service='2captcha') { this.apiKey = apiKey; this.service = service; }
  async solveRecaptchaV2(siteKey, pageUrl) { return 'captcha_solution'; }
  async solveHCaptcha(siteKey, pageUrl) { return 'captcha_solution'; }
  async getBalance() { return 100; }
}
module.exports = CaptchaService;
