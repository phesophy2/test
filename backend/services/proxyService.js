class ProxyService {
  constructor() { this.proxyPool = ['http://proxy1:8080','http://proxy2:8080']; this.currentIndex = 0; }
  getNextProxy() { const p = this.proxyPool[this.currentIndex]; this.currentIndex = (this.currentIndex+1)%this.proxyPool.length; return p; }
  getRandomProxy() { return this.proxyPool[Math.floor(Math.random()*this.proxyPool.length)]; }
  async testProxy(proxyUrl) { return { success: true, ip: '1.2.3.4' }; }
}
module.exports = new ProxyService();
