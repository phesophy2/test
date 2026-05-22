const axios = require('axios');

class AdsPowerService {
  constructor() {
    this.apiUrl = 'http://localhost:50325';
    this.enabled = false;
  }
  
  async checkConnection() {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v1/user/query`);
      this.enabled = response.data.code === 0;
      return this.enabled;
    } catch (error) {
      console.log('AdsPower not running, using fallback');
      this.enabled = false;
      return false;
    }
  }
  
  async createProfile(options = {}) {
    if (!this.enabled) {
      return { success: false, error: 'AdsPower not available' };
    }
    
    try {
      const response = await axios.post(`${this.apiUrl}/api/v1/user/create`, {
        name: `KhmerGhost_${Date.now()}`,
        group_name: 'KhmerGhost',
        domain_name: 'facebook.com',
        user_proxy_config: {
          proxy_soft: 'other',
          proxy_type: 'http',
          proxy_host: options.proxyHost || 'localhost',
          proxy_port: options.proxyPort || 8080,
          proxy_user: options.proxyUser || '',
          proxy_password: options.proxyPassword || ''
        },
        fingerprint_config: {
          automatic_timezone: 1,
          webrtc: 'disabled',
          canvas: 'real',
          webgl_image: 'noise',
          audio: 'noise'
        }
      });
      
      return { success: true, profileId: response.data.data.id };
    } catch (error) {
      console.error('AdsPower create profile failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  async openProfile(profileId) {
    if (!this.enabled) return { success: false };
    
    try {
      await axios.get(`${this.apiUrl}/api/v1/browser/start`, {
        params: { user_id: profileId }
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

module.exports = new AdsPowerService();