import React from 'react';
const Footer = ({ stats, totalAccounts, selectedCount }) => {
  return (
    <div className="footer">
      <div className="stats"><span>Selected: {selectedCount}</span><span>All: {totalAccounts}</span><span>Device Running: {stats.active || 0}</span></div>
      <div className="system-info"><span>CPU: {stats.cpu}%</span><span>RAM: {stats.ram}%</span></div>
    </div>
  );
};
export default Footer;
