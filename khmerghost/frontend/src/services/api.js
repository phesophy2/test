const API_BASE = 'http://localhost:5001/api';

export const api = {
  async getAccounts() {
    try {
      const res = await fetch(`${API_BASE}/accounts`);
      return res.json();
    } catch (error) {
      return [];
    }
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      return res.json();
    } catch (error) {
      return { cpu: 0, ram: 0, running: 0 };
    }
  },

  async startFarm(accountIds) {
    const res = await fetch(`${API_BASE}/farm/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountIds })
    });
    return res.json();
  },

  async stopFarm(accountIds) {
    const res = await fetch(`${API_BASE}/farm/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountIds })
    });
    return res.json();
  }
};
