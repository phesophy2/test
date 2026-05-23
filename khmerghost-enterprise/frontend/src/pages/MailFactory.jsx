import React, { useState, useEffect } from 'react';

const MailFactory = () => {
  const [stats, setStats] = useState({ totalEmails: 0, activeDomains: 0, todayProduction: 0 });
  const [domains, setDomains] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [productionCount, setProductionCount] = useState(100);
  const [selectedDomain, setSelectedDomain] = useState('');

  useEffect(() => {
    loadStats();
    loadDomains();
    loadMailboxes();
  }, []);

  const loadStats = async () => {
    const res = await fetch('http://localhost:5001/api/mail/stats');
    setStats(await res.json());
  };

  const loadDomains = async () => {
    const res = await fetch('http://localhost:5001/api/mail/domains');
    setDomains(await res.json());
  };

  const loadMailboxes = async () => {
    const res = await fetch('http://localhost:5001/api/mail/mailboxes');
    setMailboxes(await res.json());
  };

  const addDomain = async () => {
    await fetch('http://localhost:5001/api/mail/domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: newDomain })
    });
    setNewDomain('');
    loadDomains();
  };

  const startProduction = async () => {
    await fetch('http://localhost:5001/api/mail/produce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: productionCount, domain: selectedDomain })
    });
    loadMailboxes();
    loadStats();
    alert('Production started!');
  };

  const exportEmails = () => {
    window.open('http://localhost:5001/api/mail/export/all');
  };

  return (
    <div>
      <h2>📧 Mail Production Factory</h2>
      
      <div className="stats-grid">
        <div className="stat-card"><div>Total Emails</div><div className="number">{stats.totalEmails}</div></div>
        <div className="stat-card"><div>Active Domains</div><div className="number">{stats.activeDomains}</div></div>
        <div className="stat-card"><div>Today's Production</div><div className="number">{stats.todayProduction}</div></div>
      </div>

      <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <h3>🌐 Domains</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input type="text" placeholder="New domain (e.g., mybrand.tk)" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} style={{ flex: 1, padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }} />
          <button className="btn-primary" onClick={addDomain}>+ Add Domain</button>
        </div>
        <table className="table-container" style={{ width: '100%' }}>
          <thead><tr><th>Domain</th><th>Status</th><th>Catch-all</th><th>Mailboxes</th></tr></thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.id}>
                <td>{d.domain}</td>
                <td>{d.status}</td>
                <td>{d.catch_all ? '✅' : '❌'}</td>
                <td>{d.mailbox_count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <h3>⚡ Start Production</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }}>
            <option value="">Select Domain</option>
            {domains.map(d => <option key={d.id} value={d.domain}>{d.domain}</option>)}
          </select>
          <input type="number" value={productionCount} onChange={(e) => setProductionCount(e.target.value)} style={{ width: 100, padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }} />
          <button className="btn-success" onClick={startProduction}>▶ Start Production</button>
          <button className="btn-primary" onClick={exportEmails}>📥 Export CSV</button>
        </div>
      </div>

      <div className="table-container">
        <h3 style={{ padding: 15 }}>📧 Email Inventory</h3>
        <table>
          <thead><tr><th>Email</th><th>Domain</th><th>Password</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {mailboxes.slice(0, 20).map(m => (
              <tr key={m.id}>
                <td>{m.email}</td>
                <td>{m.domain}</td>
                <td>••••••••</td>
                <td style={{ color: m.status === 'active' ? '#00aa55' : '#ff4444' }}>{m.status}</td>
                <td>{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MailFactory;
