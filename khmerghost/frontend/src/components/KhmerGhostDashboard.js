// frontend/src/components/KhmerGhostDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './KhmerGhostDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5001');

const KhmerGhostDashboard = () => {
  // ========== STATE ==========
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, banned: 0, pending: 0 });
  const [batchQueue, setBatchQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mailStock, setMailStock] = useState([]);
  const [containers, setContainers] = useState([]);
  
  // Batch configuration
  const [batchConfig, setBatchConfig] = useState({
    quantity: 10,
    delay: 5000,
    proxyMode: 'random',
    otpMode: 'auto',
    tempMail: true,
    warmupDays: 0
  });

  // ========== API CALLS ==========
  const loadAccounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/farm/accounts`);
      setAccounts(res.data.accounts || []);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/farm/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadMailStock = async () => {
    try {
      const res = await axios.get(`${API_URL}/mail/stock`);
      setMailStock(res.data.stock || []);
    } catch (error) {
      console.error('Failed to load mail stock:', error);
    }
  };

  const loadContainers = async () => {
    try {
      const res = await axios.get(`${API_URL}/system/containers`);
      setContainers(res.data.containers || []);
    } catch (error) {
      console.error('Failed to load containers:', error);
    }
  };

  // ========== BATCH OPERATIONS ==========
  const startBatch = async () => {
    setLoading(true);
    setBatchQueue([]);
    try {
      const res = await axios.post(`${API_URL}/farm/batch`, batchConfig);
      console.log('Batch started:', res.data);
    } catch (error) {
      console.error('Failed to start batch:', error);
      setLoading(false);
    }
  };

  const stopBatch = async () => {
    try {
      await axios.post(`${API_URL}/farm/batch/stop`);
      setLoading(false);
    } catch (error) {
      console.error('Failed to stop batch:', error);
    }
  };

  // ========== WEBSOCKET ==========
  useEffect(() => {
    loadAccounts();
    loadStats();
    loadMailStock();
    loadContainers();

    socket.on('registration-progress', (data) => {
      setBatchQueue(prev => [...prev, data]);
      if (data.completed) {
        loadAccounts();
        loadStats();
        setLoading(false);
      }
    });

    socket.on('batch-completed', () => {
      setLoading(false);
      loadStats();
    });

    return () => {
      socket.off('registration-progress');
      socket.off('batch-completed');
    };
  }, []);

  // Refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
      if (activeTab === 'mail') loadMailStock();
      if (activeTab === 'containers') loadContainers();
    }, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // ========== RENDER COMPONENTS ==========
  const renderDashboard = () => (
    <>
      {/* Hero Section — cloned from sdfarm.cc */}
      <div className="hero-card">
        <div className="hero-icon">🌾</div>
        <h1>KhmerGhost Automation Platform</h1>
        <p>Professional Facebook Account Registration & Farming Dashboard</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => setActiveTab('batch')}>
            🚀 Start Automation
          </button>
          <button className="btn-secondary" onClick={() => window.open('https://youtube.com', '_blank')}>
            🎥 Watch Tutorial
          </button>
        </div>
        <div className="function-list">
          <span className="func-badge">✅ Real Device Simulation</span>
          <span className="func-badge">✅ Anti-Fingerprinting</span>
          <span className="func-badge">✅ Auto OTP Retrieval</span>
          <span className="func-badge">✅ Batch Queue Processing</span>
          <span className="func-badge">✅ Docker Container Support</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Accounts</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active</h3>
            <div className="stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">🚫</div>
          <div className="stat-info">
            <h3>Banned</h3>
            <div className="stat-value">{stats.banned}</div>
          </div>
        </div>
      </div>

      {/* Features Section — cloned from farmreel.me */}
      <div className="features-section">
        <h2>COMPREHENSIVE FEATURES</h2>
        <p className="section-subtitle">Powerful toolset designed for social media automation</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>INTUITIVE EXPERIENCE</h3>
            <p>Master KhmerGhost in minutes with user-friendly interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>DAILY INNOVATIONS</h3>
            <p>Stay ahead with daily feature updates and seamless integration</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
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
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>SCALABLE</h3>
            <p>Run 100+ concurrent automation tasks</p>
          </div>
        </div>
      </div>
    </>
  );

  const renderBatchPanel = () => (
    <div className="batch-panel">
      <div className="panel-header">
        <h2>🌾 Automated Account Registration</h2>
        <p>Configure your batch registration settings</p>
      </div>

      <div className="batch-config">
        <div className="config-group">
          <label>Quantity</label>
          <input 
            type="number" 
            value={batchConfig.quantity}
            onChange={e => setBatchConfig({...batchConfig, quantity: parseInt(e.target.value) || 1})}
            min="1" 
            max="500"
          />
          <span className="hint">Max 500 per batch</span>
        </div>

        <div className="config-group">
          <label>Delay (ms)</label>
          <input 
            type="number" 
            value={batchConfig.delay}
            onChange={e => setBatchConfig({...batchConfig, delay: parseInt(e.target.value) || 1000})}
            step="1000"
          />
          <span className="hint">Between accounts to avoid rate limits</span>
        </div>

        <div className="config-group">
          <label>Proxy Mode</label>
          <select 
            value={batchConfig.proxyMode}
            onChange={e => setBatchConfig({...batchConfig, proxyMode: e.target.value})}
          >
            <option value="random">Random Proxy</option>
            <option value="sticky">Sticky (same IP per account)</option>
            <option value="country">Country-based (Cambodia)</option>
            <option value="none">No Proxy</option>
          </select>
        </div>

        <div className="config-group">
          <label>OTP Mode</label>
          <select 
            value={batchConfig.otpMode}
            onChange={e => setBatchConfig({...batchConfig, otpMode: e.target.value})}
          >
            <option value="auto">🤖 Auto OTP (Recommended)</option>
            <option value="manual">✋ Manual OTP</option>
            <option value="skip">⏭️ Skip OTP</option>
          </select>
        </div>

        <div className="config-group checkbox">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={batchConfig.tempMail}
              onChange={e => setBatchConfig({...batchConfig, tempMail: e.target.checked})}
              style={{ marginRight: '0.4rem' }}
            />
            Use Temporary Email (Mail.tm)
          </label>
        </div>

        <div className="config-group">
          <label>Warm-up Days</label>
          <input 
            type="number" 
            value={batchConfig.warmupDays}
            onChange={e => setBatchConfig({...batchConfig, warmupDays: parseInt(e.target.value) || 0})}
            min="0" 
            max="30"
          />
          <span className="hint">0 = no warmup, >0 = auto farming</span>
        </div>
      </div>

      <div className="batch-actions">
        <button 
          className="btn-primary large" 
          onClick={startBatch}
          disabled={loading}
        >
          {loading ? 'Processing...' : '🚀 Start Batch Registration'}
        </button>
        {loading && (
          <button className="btn-danger" onClick={stopBatch} style={{ marginLeft: '1rem' }}>
            ⏹️ Stop Batch
          </button>
        )}
      </div>

      {/* Live Queue Logs */}
      <div className="queue-logs">
        <h3>📡 Live Registration Queue</h3>
        <div className="logs-container">
          {batchQueue.length === 0 && (
            <div className="log-empty" style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>Waiting for batch to start...</div>
          )}
          {batchQueue.map((log, idx) => (
            <div key={idx} className={`log-entry ${log.success ? 'success' : 'error'}`}>
              <span className="time">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="message">{log.message}</span>
              {log.otpCode && <span className="otp-badge">🔑 OTP: {log.otpCode}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountsTable = () => (
    <div className="accounts-panel">
      <div className="panel-header">
        <h2>👥 Created Accounts</h2>
        <button className="btn-refresh" onClick={loadAccounts} style={{ padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>🔄 Refresh</button>
      </div>
      
      <div className="table-wrapper">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Status</th>
              <th>OTP Code</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-state">No accounts yet. Start a batch!</td>
              </tr>
            )}
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td className="email-cell" style={{ fontWeight: '600' }}>{acc.email}</td>
                <td><code className="password">{acc.password}</code></td>
                <td>{acc.first_name}</td>
                <td>{acc.last_name}</td>
                <td>
                  <span className={`status-badge status-${acc.status}`}>
                    {acc.status === 'verified' ? '✅ Verified' : 
                     acc.status === 'pending' ? '⏳ Pending' : 
                     acc.status === 'banned' ? '🚫 Banned' : '📝 Registered'}
                  </span>
                </td>
                <td style={{ fontWeight: 'bold', color: '#155724' }}>{acc.otp_code || '-'}</td>
                <td>{new Date(acc.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMailStock = () => (
    <div className="mail-panel">
      <div className="panel-header">
        <h2>📧 Available Mail Stock</h2>
        <p>Browse our current inventory of temp-mail services</p>
      </div>
      
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Mail Type</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mailStock.map(item => (
              <tr key={item.type} className={item.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}>
                <td><strong>{item.type}</strong></td>
                <td>{item.duration}</td>
                <td>${item.price.toFixed(2)}/mail</td>
                <td>
                  {item.status === 'In Stock' ? '✅' : '❌'} {item.status}
                  {item.stock > 0 && <span className="stock-count"> ({item.stock} units)</span>}
                </td>
                <td>
                  {item.status === 'In Stock' && (
                    <button className="btn-small" onClick={() => alert(`Purchase ${item.type}`)} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', background: '#28a745', color: '#fff', border: 'none' }}>
                      Buy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContainers = () => (
    <div className="containers-panel">
      <div className="panel-header">
        <h2>🐳 Docker Containers</h2>
        <button className="btn-refresh" onClick={loadContainers} style={{ padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>🔄 Refresh</button>
      </div>
      
      <div className="containers-grid">
        {containers.map(container => (
          <div key={container.id} className="container-card">
            <div className="container-icon">🐳</div>
            <div className="container-info">
              <h4>{container.name}</h4>
              <p>Status: <span className={`status-${container.status}`}>{container.status}</span></p>
              <p>ID: <code>{container.id.substring(0, 12)}</code></p>
            </div>
          </div>
        ))}
        {containers.length === 0 && (
          <div className="empty-state">No containers running. Start automation to spawn containers.</div>
        )}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="pricing-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Choose Your Perfect Plan</h2>
      <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Select the ideal package that fits your automation needs</p>
      
      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>1 Month</h3>
          <div className="price">$15.99<span>/month</span></div>
          <ul>
            <li>✅ 2 Time Change Key</li>
            <li>✅ Bulk Upload Features</li>
            <li>✅ Function Schedule</li>
            <li>✅ Unlimited Docker Containers</li>
            <li>✅ Unlimited Facebook Accounts</li>
          </ul>
          <button className="btn-plan">Activate License</button>
        </div>

        <div className="pricing-card popular">
          <div className="badge">🔥 Most Popular</div>
          <h3>3 Months</h3>
          <div className="price">$47.99<span>/3 months</span></div>
          <div className="bonus" style={{ textAlign: 'center', padding: '0.4rem', marginTop: '0.5rem' }}>🎁 +15 Days Free</div>
          <ul>
            <li>✅ 10 Time Change Key</li>
            <li>✅ Bulk Upload Features</li>
            <li>✅ Unlimited Docker Containers</li>
            <li>✅ Unlimited Facebook Accounts</li>
            <li>✅ Priority Support</li>
          </ul>
          <button className="btn-plan">Activate License</button>
        </div>

        <div className="pricing-card">
          <h3>12 Months</h3>
          <div className="price">$179.99<span>/year</span></div>
          <div className="bonus" style={{ textAlign: 'center', padding: '0.4rem', marginTop: '0.5rem' }}>🎁 +30 Days Free</div>
          <ul>
            <li>✅ 100 Time Change Key</li>
            <li>✅ Everything in 3 Months</li>
            <li>✅ Register Accounts</li>
            <li>✅ Verify Account Novery</li>
            <li>✅ Custom Features</li>
          </ul>
          <button className="btn-plan">Activate License</button>
        </div>
      </div>
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="khmerghost-dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🌾</span>
          <span className="logo-text">KhmerGhost</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`nav-btn ${activeTab === 'batch' ? 'active' : ''}`} onClick={() => setActiveTab('batch')}>
            🚀 Batch Creator
          </button>
          <button className={`nav-btn ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
            👥 Accounts
          </button>
          <button className={`nav-btn ${activeTab === 'mail' ? 'active' : ''}`} onClick={() => setActiveTab('mail')}>
            📧 Mail Stock
          </button>
          <button className={`nav-btn ${activeTab === 'containers' ? 'active' : ''}`} onClick={() => setActiveTab('containers')}>
            🐳 Containers
          </button>
          <button className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
            💎 Pricing
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator"></div>
          <span>Docker: Running</span>
          <div className="version">v2.0.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'batch' && renderBatchPanel()}
        {activeTab === 'accounts' && renderAccountsTable()}
        {activeTab === 'mail' && renderMailStock()}
        {activeTab === 'containers' && renderContainers()}
        {activeTab === 'pricing' && renderPricing()}
      </main>
    </div>
  );
};

export default KhmerGhostDashboard;
