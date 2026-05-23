import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Accounts from './Accounts';
import Social from './Social';
import MailFactory from './MailFactory';
import Shop from './Shop';
import Settings from './Settings';

const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({ total: 0, active: 0, cpu: 0, ram: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if(userData) setUser(JSON.parse(userData));
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/farm/stats');
      const data = await res.json();
      setStats(data);
    } catch(e) { console.log(e); }
  };

  const navItems = [
    { path: '/dashboard/accounts', name: '👥 Accounts', icon: '👥' },
    { path: '/dashboard/social', name: '📱 Social Media', icon: '📱' },
    { path: '/dashboard/mail', name: '📧 Mail Factory', icon: '📧' },
    { path: '/dashboard/shop', name: '🛒 Shop', icon: '🛒' },
    { path: '/dashboard/settings', name: '⚙️ Settings', icon: '⚙️' }
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo">
          <h2>🏆 KhmerGhost</h2>
          <span className="version">Enterprise 4.0</span>
        </div>
        <nav className="nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="user-info">
          <div className="user-name">{user?.fullName || user?.email}</div>
          <div className="user-tier">{user?.tier || 'Free'}</div>
        </div>
      </div>
      <div className="main">
        <div className="header">
          <div className="stats-bar">
            <div className="stat">📊 Total: {stats.total}</div>
            <div className="stat">✅ Active: {stats.active}</div>
            <div className="stat">💻 CPU: {stats.cpu}%</div>
            <div className="stat">🧠 RAM: {stats.ram}%</div>
          </div>
        </div>
        <div className="content">
          <Routes>
            <Route path="accounts" element={<Accounts />} />
            <Route path="social" element={<Social />} />
            <Route path="mail" element={<MailFactory />} />
            <Route path="shop" element={<Shop />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/" element={<Accounts />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
