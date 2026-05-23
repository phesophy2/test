import React, { useState } from 'react';
const SettingTab = () => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [files, setFiles] = useState([]);
  const handleFileDrop = (e) => { e.preventDefault(); const dropped = Array.from(e.dataTransfer.files); setFiles([...files, ...dropped]); };
  const handleDragOver = (e) => e.preventDefault();
  return (
    <div className="setting-tab">
      <div className="device-select"><h3>Select your device</h3><select value={selectedDevice} onChange={(e)=>setSelectedDevice(e.target.value)}><option>Select Device</option><option>MuMu_1</option><option>LDPlayer_1</option></select></div>
      <div className="drop-zone" onDrop={handleFileDrop} onDragOver={handleDragOver}><p>Drop files here</p>{files.length>0 && <ul>{files.map((f,i)=><li key={i}>{f.name}</li>)}</ul>}</div>
      <div className="info-panel"><p>F:\BACKUP\Tool fb\LDPlayer chinese\LDPlayer China</p><p>LDREEL4DIE98*****C2CC</p><p>F2H1BLGPGB158</p><button className="howto-btn">HOW TO</button></div>
    </div>
  );
};
export default SettingTab;
