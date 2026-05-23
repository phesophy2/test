const API_BASE = 'http://localhost:5001/api';
export const api = {
  async getAccounts() { const res = await fetch(`${API_BASE}/accounts`); return res.json(); },
  async getStats() { const res = await fetch(`${API_BASE}/stats`); return res.json(); },
  async startFarm(accountIds) { const res = await fetch(`${API_BASE}/farm/start`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({accountIds}) }); return res.json(); },
  async stopFarm(accountIds) { const res = await fetch(`${API_BASE}/farm/stop`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({accountIds}) }); return res.json(); },
  async getMuMuDevices() { const res = await fetch(`${API_BASE}/mumu/devices`); return res.json(); },
  async getLDPlayerDevices() { const res = await fetch(`${API_BASE}/ldplayer/devices`); return res.json(); },
  async getMailStats() { const res = await fetch(`${API_BASE}/mail/stats`); return res.json(); },
  async getMailboxes() { const res = await fetch(`${API_BASE}/mail/mailboxes`); return res.json(); },
  async getDomains() { const res = await fetch(`${API_BASE}/mail/domains`); return res.json(); },
  async createDomain(domain) { const res = await fetch(`${API_BASE}/mail/domain`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({domain}) }); return res.json(); },
  async startProduction(count, domain) { const res = await fetch(`${API_BASE}/mail/produce`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({count,domain}) }); return res.json(); }
};
