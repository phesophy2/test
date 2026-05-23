import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
const MuMuManager = () => {
  const [devices, setDevices] = useState([]);
  const [path, setPath] = useState('');
  const [delay, setDelay] = useState(5);
  useEffect(() => { api.getMuMuDevices().then(setDevices); }, []);
  return (
    <div className="device-manager">
      <h3>Path Folder MuMu Player</h3>
      <input type="text" placeholder="C:\Program Files\MuMu Player" value={path} onChange={(e)=>setPath(e.target.value)} />
      <div className="delay-setting"><label>MuMuMultiPlayer</label><input type="number" value={delay} onChange={(e)=>setDelay(e.target.value)} /><span>[Delay Launch (s)]</span></div>
      <table className="device-table"><thead><tr><th>No</th><th>NAME</th><th>STATUS</th></tr></thead>
      <tbody>{devices.map((d,i)=><tr key={d.id}><td>{i+1}</td><td>{d.name}</td><td className={`status-${d.status}`}>{d.status}</td></tr>)}</tbody></table>
    </div>
  );
};
export default MuMuManager;
