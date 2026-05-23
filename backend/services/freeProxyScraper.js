const axios = require('axios');
const cheerio = require('cheerio');
class FreeProxyScraper {
  async scrapeFromSSLProxies() {
    try {
      const response = await axios.get('https://www.sslproxies.org/');
      const $ = cheerio.load(response.data);
      const proxies = [];
      $('#proxylisttable tbody tr').each((i,el)=>{
        const ip = $(el).find('td:nth-child(1)').text();
        const port = $(el).find('td:nth-child(2)').text();
        if(ip && port) proxies.push(`http://${ip}:${port}`);
      });
      return proxies.slice(0,100);
    } catch(e){ return []; }
  }
  async scrapeFromFreeProxyList() {
    try {
      const response = await axios.get('https://free-proxy-list.net/');
      const $ = cheerio.load(response.data);
      const proxies = [];
      $('#proxylisttable tbody tr').each((i,el)=>{
        const ip = $(el).find('td:nth-child(1)').text();
        const port = $(el).find('td:nth-child(2)').text();
        const https = $(el).find('td:nth-child(7)').text();
        if(ip && port && https==='yes') proxies.push(`https://${ip}:${port}`);
        else if(ip && port) proxies.push(`http://${ip}:${port}`);
      });
      return proxies.slice(0,100);
    } catch(e){ return []; }
  }
  async getAllFreeProxies() {
    const [ssl, free] = await Promise.all([this.scrapeFromSSLProxies(), this.scrapeFromFreeProxyList()]);
    return [...new Set([...ssl, ...free])];
  }
  async testProxy(proxyUrl) {
    try {
      const start = Date.now();
      await axios.get('https://httpbin.org/ip', { proxy: { host: proxyUrl.split('//')[1].split(':')[0], port: parseInt(proxyUrl.split(':')[2]) }, timeout: 5000 });
      return { success: true, latency: Date.now()-start };
    } catch(e){ return { success: false }; }
  }
  async getWorkingProxies(limit=50) {
    const allProxies = await this.getAllFreeProxies();
    const working = [];
    for(const proxy of allProxies.slice(0,100)) {
      const test = await this.testProxy(proxy);
      if(test.success) {
        working.push({ url: proxy, latency: test.latency });
        if(working.length >= limit) break;
      }
    }
    return working.sort((a,b)=>a.latency-b.latency);
  }
}
module.exports = new FreeProxyScraper();
