import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function EmulatorControl() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [tapX, setTapX] = useState(360);
  const [tapY, setTapY] = useState(640);

  const addLog = (msg, type = 'info') => {
    setLog(prev => [...prev.slice(-19), { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/api/emulator/status`);
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setStatus({ connected: false, error: 'Backend unreachable' });
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const call = async (endpoint, method = 'POST', body = {}) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/emulator/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      addLog(`${endpoint}: ${JSON.stringify(data)}`, data.success !== false ? 'success' : 'error');
      return data;
    } catch (e) {
      addLog(`${endpoint}: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>📱 Android Emulator Control</h2>

      {/* Status Card */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#e94560', margin: '0 0 15px' }}>📊 Emulator Status</h3>
        {status ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#16213e', padding: '10px', borderRadius: '8px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Status</div>
              <div style={{ color: status.connected ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                {status.connected ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
            </div>
            <div style={{ background: '#16213e', padding: '10px', borderRadius: '8px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Device</div>
              <div style={{ color: '#fff' }}>{status.model || 'N/A'}</div>
            </div>
            <div style={{ background: '#16213e', padding: '10px', borderRadius: '8px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Android</div>
              <div style={{ color: '#fff' }}>{status.android || 'N/A'}</div>
            </div>
            <div style={{ background: '#16213e', padding: '10px', borderRadius: '8px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Screen</div>
              <div style={{ color: '#fff' }}>{status.screen || 'N/A'}</div>
            </div>
            <div style={{ background: '#16213e', padding: '10px', borderRadius: '8px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Timezone</div>
              <div style={{ color: '#fff' }}>{status.timezone || 'N/A'}</div>
            </div>
            <div style={{ background: '#16213e', padding: '10px', borderRadius: '8px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>VNC Viewer</div>
              <a href="http://localhost:6080" target="_blank" rel="noreferrer"
                style={{ color: '#e94560' }}>Open Browser</a>
            </div>
          </div>
        ) : (
          <div style={{ color: '#888' }}>Loading...</div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#e94560', margin: '0 0 15px' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: '🔌 Connect', action: () => call('connect') },
            { label: '📸 Screenshot', action: () => call('screenshot') },
            { label: '📘 Start Facebook', action: () => call('facebook/start') },
            { label: '🧹 Clear FB Data', action: () => call('facebook/clear') },
            { label: '📜 Scroll', action: () => call('scroll') },
            { label: '🔄 Refresh Status', action: fetchStatus },
          ].map(({ label, action }) => (
            <button key={label} onClick={action} disabled={loading}
              style={{
                background: '#e94560', color: '#fff', border: 'none',
                padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                opacity: loading ? 0.6 : 1
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Facebook Login */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#e94560', margin: '0 0 15px' }}>🔐 Facebook Login Simulation</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Email</div>
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              placeholder="email@example.com"
              style={{ background: '#16213e', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '6px', width: '220px' }} />
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Password</div>
            <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
              placeholder="password"
              style={{ background: '#16213e', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '6px', width: '180px' }} />
          </div>
          <button onClick={() => call('facebook/login', 'POST', { email: loginEmail, password: loginPass })}
            disabled={loading || !loginEmail || !loginPass}
            style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            🚀 Simulate Login
          </button>
        </div>
      </div>

      {/* Tap Control */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#e94560', margin: '0 0 15px' }}>👆 Tap Control</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>X</div>
            <input type="number" value={tapX} onChange={e => setTapX(Number(e.target.value))}
              style={{ background: '#16213e', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px', width: '80px' }} />
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Y</div>
            <input type="number" value={tapY} onChange={e => setTapY(Number(e.target.value))}
              style={{ background: '#16213e', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px', width: '80px' }} />
          </div>
          <button onClick={() => call('tap', 'POST', { x: tapX, y: tapY })} disabled={loading}
            style={{ background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            👆 Tap
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ color: '#e94560', margin: '0 0 15px' }}>📋 Activity Log</h3>
        <div style={{ background: '#0d0d1a', borderRadius: '8px', padding: '12px', height: '200px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px' }}>
          {log.length === 0 ? (
            <div style={{ color: '#555' }}>No activity yet...</div>
          ) : (
            log.map((entry, i) => (
              <div key={i} style={{ color: entry.type === 'error' ? '#f44336' : entry.type === 'success' ? '#4caf50' : '#888', marginBottom: '4px' }}>
                [{entry.time}] {entry.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EmulatorControl;
