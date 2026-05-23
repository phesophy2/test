import React, { useState, useEffect } from 'react';
const MailProductionTab = () => {
  const [domains, setDomains] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [stats, setStats] = useState({ totalEmails: 0, activeDomains: 0, todayProduction: 0, monthlyRevenue: 0 });
  useEffect(() => { loadStats(); loadDomains(); loadMailboxes(); }, []);
  const loadStats = async () => { const res = await fetch('http://localhost:5001/api/mail/stats'); setStats(await res.json()); };
  const loadDomains = async () => { const res = await fetch('http://localhost:5001/api/mail/domains'); setDomains(await res.json()); };
  const loadMailboxes = async () => { const res = await fetch('http://localhost:5001/api/mail/mailboxes'); setMailboxes(await res.json()); };
  const createDomain = async () => { await fetch('http://localhost:5001/api/mail/domain', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({domain:newDomain}) }); setNewDomain(''); loadDomains(); };
  const startProduction = async () => { await fetch('http://localhost:5001/api/mail/produce', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({count:100, domain:domains[0]?.domain}) }); loadMailboxes(); loadStats(); };
  return (
    <div className="mail-production">
      <h2>🏭 Mail Production Factory</h2>
      <div className="stats-grid"><div className="stat-card"><h3>Total Emails</h3><div className="number">{stats.totalEmails}</div></div><div className="stat-card"><h3>Active Domains</h3><div className="number">{stats.activeDomains}</div></div><div className="stat-card"><h3>Today's Production</h3><div className="number">{stats.todayProduction}</div></div><div className="stat-card"><h3>Monthly Revenue</h3><div className="number">${stats.monthlyRevenue}</div></div></div>
      <div className="domain-section"><h3>🌐 Domains</h3><div className="domain-input"><input type="text" placeholder="New domain (e.g., mybrand.tk)" value={newDomain} onChange={(e)=>setNewDomain(e.target.value)} /><button onClick={createDomain}>+ Add Domain</button><button onClick={startProduction}>⚡ Start Production</button></div>
      <table className="domain-table"><thead><tr><th>Domain</th><th>Status</th><th>Catch-all</th><th>Mailboxes</th></tr></thead><tbody>{domains.map(d=><tr key={d.id}><td>{d.domain}</td><td>{d.status}</td><td>{d.catch_all?'✅ Enabled':'❌ Disabled'}</td><td>{d.mailbox_count||0}</td></tr>)}</tbody></table></div>
      <div className="inventory-section"><h3>📧 Email Inventory</h3><table className="inventory-table"><thead><tr><th>Email</th><th>Domain</th><th>Created</th><th>Status</th><th>Price</th></tr></thead><tbody>{mailboxes.map(m=><tr key={m.id}><td>{m.email}</td><td>{m.domain}</td><td>{new Date(m.created_at).toLocaleDateString()}</td><td>{m.status}</td><td>${(Math.random()*5+1).toFixed(2)}</td></tr>)}</tbody></table></div>
      <div className="export-section"><h3>📤 Export for Sale</h3><div className="export-options"><button onClick={()=>window.open('/api/mail/export/all')}>Export All (CSV)</button><button onClick={()=>window.open('/api/mail/export/active')}>Export Active Only</button></div></div>
    </div>
  );
};
export default MailProductionTab;
