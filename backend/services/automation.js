class FacebookAutomation {
  constructor() { this.browsers = new Map(); }
  async createBrowser(proxy) { return { close: async () => {} }; }
  async loginToFacebook(browser, email, password) { return []; }
  async postReel(accountId, browser, videoPath, hashtags, caption) { return { success: true }; }
  async postImage(accountId, browser, imagePath, hashtags, caption, checkMarketplace) { return { success: true }; }
  async postVideo(accountId, browser, videoPath, hashtags, caption, checkRecommendation, checkCopyright) { return { success: true }; }
  async closeBrowser(accountId) { this.browsers.delete(accountId); }
}
module.exports = new FacebookAutomation();
