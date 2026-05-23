import React, { useState } from 'react';
import { api } from '../../services/api';
const Header = ({ onRefresh }) => {
  const [search, setSearch] = useState('');
  const handleStart = async () => {
    const selected = JSON.parse(localStorage.getItem('selectedAccounts') || '[]');
    if(!selected.length) return alert('Select accounts first');
    await api.startFarm(selected);
    alert('Started!');
    onRefresh();
  };
  const handleStop = async () => {
    const selected = JSON.parse(localStorage.getItem('selectedAccounts') || '[]');
    await api.stopFarm(selected);
    alert('Stopped!');
    onRefresh();
  };
  return (
    <div className="header">
      <div className="header-left"><button className="update-btn">update 3.2.9.4</button><span className="expiry">Expire: 24 Day</span></div>
      <div className="header-right">
        <button className="start-btn" onClick={handleStart}>START</button>
        <button className="stop-btn" onClick={handleStop}>STOP</button>
        <select className="network-select"><option>4G</option><option>WiFi</option></select>
        <input type="text" placeholder="Search..." className="search-input" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <button className="load-btn">LOAD ACCOUNT</button>
        <button className="add-btn">ADD FILE</button>
      </div>
    </div>
  );
};
export default Header;
