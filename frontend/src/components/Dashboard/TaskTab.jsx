import React, { useState } from 'react';
import MuMuManager from '../DeviceManager/MuMuManager';
import LDPlayerManager from '../DeviceManager/LDPlayerManager';
const TaskTab = () => {
  const [apiKey, setApiKey] = useState('');
  const [balance, setBalance] = useState(null);
  const checkBalance = async () => {
    const res = await fetch('http://localhost:5001/api/balance', { headers: { 'X-API-Key': apiKey } });
    const data = await res.json();
    setBalance(data.balance);
  };
  return (
    <div className="task-tab">
      <div className="device-section"><MuMuManager /><LDPlayerManager /></div>
      <div className="api-section">
        <h3>API Key: Top Up</h3>
        <input type="text" placeholder="Enter API Key" value={apiKey} onChange={(e)=>setApiKey(e.target.value)} />
        <button onClick={checkBalance}>Check balance</button>
        {balance !== null && <span>Balance: ${balance}</span>}
      </div>
    </div>
  );
};
export default TaskTab;
