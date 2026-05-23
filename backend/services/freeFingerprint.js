class FreeFingerprint {
  constructor() {
    this.userAgents = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'];
    this.viewports = [{ width: 1920, height: 1080 }];
    this.languages = [['en-US','en']];
    this.timezones = ['America/New_York'];
  }
  getRandomFingerprint() {
    return { userAgent: this.userAgents[0], viewport: this.viewports[0], language: this.languages[0], timezone: this.timezones[0], platform: 'Win32', hardwareConcurrency: 8, deviceMemory: 8 };
  }
  getPuppeteerArgs(fingerprint) {
    return [`--user-agent=${fingerprint.userAgent}`, `--window-size=${fingerprint.viewport.width},${fingerprint.viewport.height}`, `--lang=${fingerprint.language[0]}`, '--disable-blink-features=AutomationControlled'];
  }
}
module.exports = new FreeFingerprint();
