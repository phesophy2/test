import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function FarmDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchCount, setBatchCount] = useState(5);
  const [batchVerifyOtp, setBatchVerifyOtp] = useState(true);
  const [batchStatus, setBatchStatus] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [formData, setFormData] = useState({
    useMail: true,
    usePhone: false,
    warmUp: false,
    verifyOtp: true,
    proxy: ''
  });

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/farm/create`, {
        useMail: formData.useMail,
        usePhone: formData.usePhone,
        warmUp: formData.warmUp,
        verifyOtp: formData.verifyOtp,
        proxy: formData.proxy || null
      });
      
      if (response.data.success) {
        alert(`Account created!\nEmail: ${response.data.email}\nName: ${response.data.name}\nOTP: ${response.data.otp || 'Pending / None'}`);
        loadAccounts();
      } else {
        alert(`Failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async () => {
    if (batchCount < 1 || batchCount > 50) {
      alert('Batch count must be between 1 and 50');
      return;
    }
    
    setBatchLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/farm/batch`, {
        count: batchCount,
        verifyOtp: batchVerifyOtp
      });
      
      if (response.data.success) {
        alert(`Batch started! ${response.data.queued} accounts queued.`);
        loadBatchStatus();
      } else {
        alert(`Failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Failed to create batch');
    } finally {
      setBatchLoading(false);
    }
  };

  const loadBatchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/farm/batch/status`);
      if (response.data.success) {
        setBatchStatus(response.data.status);
      }
    } catch (error) {
      console.error('Error loading batch status:', error);
    }
  };

  const loadBatchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/farm/batch/results`);
      if (response.data.success) {
        setBatchResults(response.data.results);
      }
    } catch (error) {
      console.error('Error loading batch results:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/farm/accounts`);
      if (response.data.success) {
        setAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/farm/status`);
      if (response.data.success) {
        const statsData = response.data.stats;
        setStats([
          { status: 'Total', count: statsData.total || 0 },
          { status: 'Active', count: statsData.active || 0 },
          { status: 'Banned', count: statsData.banned || 0 }
        ]);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const farmAccount = async (accountId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/farm/account/${accountId}/farm`);
      if (response.data.success) {
        alert(`Farming activity: ${response.data.activity}`);
        loadAccounts();
      }
    } catch (error) {
      console.error('Error farming account:', error);
      alert('Failed to farm account');
    } finally {
      setLoading(false);
    }
  };

  const generateFingerprint = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/farm/fingerprint`);
      if (response.data.success) {
        console.log('Fingerprint:', response.data.fingerprint);
        alert(`Fingerprint generated!\nDevice: ${response.data.fingerprint.profile}\nLocation: ${response.data.fingerprint.location}\nCheck console for details.`);
      }
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      alert('Failed to generate fingerprint');
    }
  };

  useEffect(() => {
    loadAccounts();
    loadStats();
    loadBatchStatus();
    loadBatchResults();
    
    // Poll batch status every 5 seconds
    const interval = setInterval(() => {
      if (batchStatus?.isProcessing) {
        loadBatchStatus();
        loadBatchResults();
      }
    }, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchStatus?.isProcessing]);

  return (
    <div className="component-container">
      <h2>🌾 Farm Dashboard</h2>
      
      <div className="action-section">
        <button onClick={generateFingerprint}>
          🔐 Generate Fingerprint
        </button>
        <button onClick={loadStats} style={{ marginLeft: '0.5rem' }}>
          📊 Refresh Stats
        </button>
        <button onClick={loadBatchStatus} style={{ marginLeft: '0.5rem' }}>
          🔄 Refresh Batch Status
        </button>
      </div>

      {stats && (
        <div className="result-section">
          <h3>Statistics:</h3>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem' }}>
              <strong>{stat.status}:</strong> {stat.count} accounts 
              {stat.farm_ready > 0 && ` (${stat.farm_ready} farm ready)`}
            </div>
          ))}
        </div>
      )}

      <div className="batch-section">
        <h3>Batch Creation</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number"
            min="1"
            max="50"
            value={batchCount}
            onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
            style={{ width: '80px', padding: '0.5rem' }}
          />
          <select
            value={batchVerifyOtp ? 'true' : 'false'}
            onChange={(e) => setBatchVerifyOtp(e.target.value === 'true')}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', background: '#fff', cursor: 'pointer' }}
          >
            <option value="true">With OTP Confirm (Auto)</option>
            <option value="false">Simple (No OTP Confirm)</option>
          </select>
          <button onClick={createBatch} disabled={batchLoading}>
            {batchLoading ? 'Creating...' : `🚀 Create ${batchCount} Accounts`}
          </button>
        </div>
        
        {batchStatus && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Batch Status</h4>
            <p>Queue: {batchStatus.queueLength} accounts</p>
            <p>Processing: {batchStatus.isProcessing ? 'Yes' : 'No'}</p>
            <p>Completed: {batchStatus.completedCount}</p>
            <p>Failed: {batchStatus.failedCount}</p>
          </div>
        )}
        
        {batchResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Recent Batch Results</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {batchResults.slice(0, 10).map((result, idx) => (
                <div key={idx} style={{ 
                  padding: '0.5rem', 
                  marginBottom: '0.5rem', 
                  background: result.status === 'completed' ? '#d4edda' : '#f8d7da',
                  borderRadius: '4px'
                }}>
                  <strong>Task {result.id}:</strong> {result.status} 
                  {result.status === 'completed' && ` - ${result.result?.email}`}
                  {result.status === 'completed' && result.result?.otp && (
                    <span style={{ marginLeft: '1rem', padding: '0.2rem 0.5rem', background: '#e2e3e5', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold' }}>
                      🔑 Code: {result.result.otp}
                    </span>
                  )}
                  {result.status === 'failed' && ` - ${result.error}`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={createAccount} className="account-form">
        <h3>Create Single Account</h3>
        
        <label>
          <input
            type="checkbox"
            name="useMail"
            checked={formData.useMail}
            onChange={handleInputChange}
          />
          {' '}Use Email (Mail.tm)
        </label>
        
        <label>
          <input
            type="checkbox"
            name="usePhone"
            checked={formData.usePhone}
            onChange={handleInputChange}
          />
          {' '}Use Phone (Free SMS)
        </label>
        
        <label>
          <input
            type="checkbox"
            name="warmUp"
            checked={formData.warmUp}
            onChange={handleInputChange}
          />
          {' '}Enable Warm-up (14 days)
        </label>
        
        <div style={{ margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontWeight: '600', fontSize: '0.9em', color: '#495057' }}>Registration OTP Mode:</span>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.95em' }}>
              <input
                type="radio"
                name="verifyOtp"
                checked={formData.verifyOtp === true}
                onChange={() => setFormData({ ...formData, verifyOtp: true })}
                style={{ marginRight: '0.4rem' }}
              />
              With OTP Confirm (Auto)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.95em' }}>
              <input
                type="radio"
                name="verifyOtp"
                checked={formData.verifyOtp === false}
                onChange={() => setFormData({ ...formData, verifyOtp: false })}
                style={{ marginRight: '0.4rem' }}
              />
              Simple (No OTP Confirm)
            </label>
          </div>
        </div>

        <input
          type="text"
          name="proxy"
          placeholder="Proxy (optional): ip:port"
          value={formData.proxy}
          onChange={handleInputChange}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : '🚀 Create Account'}
        </button>
      </form>

      <div className="accounts-list">
        <h3>Accounts ({accounts.length})</h3>
        {accounts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d' }}>No accounts yet. Create one above!</p>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="account-item">
              <div className="account-info">
                <strong>#{account.id}</strong>
                <span>{account.email}</span>
                <span>Status: {account.status} {account.farm_ready ? '✅' : '⏳'}</span>
                {account.otp && (
                  <span style={{ fontSize: '0.9em', color: '#155724', backgroundColor: '#d4edda', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    🔑 Code: {account.otp}
                  </span>
                )}
                <small>Created: {new Date(account.created_at).toLocaleString()}</small>
              </div>
              <button onClick={() => farmAccount(account.id)} disabled={loading}>
                🌾 Farm
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FarmDashboard;
