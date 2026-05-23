import React from 'react';
const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = ['HOME', 'INTERACT', 'TASK', 'SETTING', 'MAIL'];
  return (
    <div className="sidebar">
      <div className="logo"><h2>FARM REEL</h2><span className="version">3.2.1.0</span></div>
      <nav className="tabs">
        {tabs.map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;
