import React, { useState, useEffect } from 'react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/farm/accounts');
      const data = await res.json();
      setAccounts(data);
    } catch(e) { console.log(e); }
    setLoading(false);
  };

  const handleStart = async () => {
    if(selected.length === 0) return alert('Select accounts first');
    await fetch('http://localhost:5001/api/farm/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountIds: selected })
    });
    fetchAccounts();
    alert('Started!');
  };

  const handleStop = async () => {
    await fetch('http://localhost:5001/api/farm/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountIds: selected })
    });
    fetchAccounts();
    alert('Stopped!');
  };

  const toggleSelect = (id) => {
    if(selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleSelectAll = () => {
    if(selected.length === accounts.length) {
      setSelected([]);
    } else {
      setSelected(accounts.map(a => a.id));
    }
  };

  if(loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="actions" style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button className="btn-success" onClick={handleStart}>▶ Start Farming</button>
        <button className="btn-danger" onClick={handleStop}>⏹ Stop Farming</button>
        <button className="btn-primary" onClick={() => alert('Add account feature')}>+ Add Account</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" onChange={toggleSelectAll} checked={selected.length === accounts.length && accounts.length > 0} /></th>
              <th>ID</th>
              <th>Platform</th>
              <th>Name</th>
              <th>Email</th>
              <th>Proxy</th>
              <th>Status</th>
              <th>Actions</th>
             </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td><input type="checkbox" checked={selected.includes(acc.id)} onChange={() => toggleSelect(acc.id)} /></td>
                <td>{acc.id}</td>
                <td>{acc.platform || 'Facebook'}</td>
                <td>{acc.name}</td>
                <td>{acc.email}</td>
                <td>{acc.proxy || '-'}</td>
                <td style={{ color: acc.status === 'running' ? '#00aa55' : '#888' }}>{acc.status || 'idle'}</td>
                <td><button className="btn-danger" style={{ padding: '4px 8px', fontSize: 12 }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 20 }}>Selected: {selected.length} accounts</div>
    </div>
  );
};

export default Accounts;
