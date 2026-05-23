import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const KhmerGhostDashboard = () => {
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState(0);
  const [pendingAccounts, setPendingAccounts] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const accounts = await api.getAccounts();
    setTotalAccounts(accounts.length);
    setActiveAccounts(accounts.filter(a => a.state === 'running').length);
    setPendingAccounts(accounts.filter(a => a.state === 'idle').length);
  };

  const handleStart = () => {
    alert('Starting automation...');
  };

  const handleWatchTutorial = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="logo">KhmerGhost</h1>
          <h2 className="tagline">Professional Facebook Account Registration & Farming Dashboard</h2>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStart}>Start Automation</button>
            <button className="btn-secondary" onClick={handleWatchTutorial}>Watch Tutorial</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card total">
          <h3>Total Accounts</h3>
          <div className="stat-number">{totalAccounts}</div>
        </div>
        <div className="stats-row">
          <div className="stat-card active">
            <h3>Active</h3>
            <div className="stat-number">{activeAccounts}</div>
          </div>
          <div className="stat-card pending">
            <h3>Pending</h3>
            <div className="stat-number">{pendingAccounts}</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <h2 className="section-title">COMPREHENSIVE FEATURES</h2>
        <p className="section-subtitle">Powerful toolset designed for social media automation</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>INTUITIVE EXPERIENCE</h3>
            <p>Master KhmerGhost in minutes with user-friendly interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>DAILY INNOVATIONS</h3>
            <p>Stay ahead with daily feature updates and seamless integration</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>24/7 EXPERT SUPPORT</h3>
            <p>Instant assistance from dedicated support team</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>SECURE & RELIABLE</h3>
            <p>Your data stays on your local machine. Complete privacy</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🐳</div>
            <h3>DOCKER NATIVE</h3>
            <p>Lightweight containers instead of heavy emulators</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhmerGhostDashboard;
