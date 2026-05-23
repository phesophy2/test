class AdsPowerService {
  async checkConnection() { return true; }
  async createProfile(profileData) { return { success: true, profileId: 'profile_123' }; }
  async startProfile(profileId) { return { success: true, wsUrl: 'ws://localhost:1234' }; }
  async stopProfile(profileId) { return true; }
  async getProfiles() { return [{ id: 'p1', name: 'Profile1', status: 'running' }]; }
  async createFacebookAccount(config) { return { success: true, email: config.email, profileId: 'fb_456' }; }
}
module.exports = new AdsPowerService();
