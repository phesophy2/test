import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if(userData) setUser(JSON.parse(userData));
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    if(user?.id) {
      const res = await fetch(`http://localhost:5001/api/subscription/current/${user.id}`);
      setSubscription(await res.json());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h2>⚙️ Settings</h2>
      
      <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <h3>Profile</h3>
        <p>Name: {user?.fullName || user?.email}</p>
        <p>Email: {user?.email}</p>
        <p>Plan: <strong style={{ color: '#00d4ff' }}>{subscription?.tier || 'Free'}</strong></p>
        {subscription?.expires && <p>Expires: {new Date(subscription.expires).toLocaleDateString()}</p>}
        <button className="btn-primary" onClick={() => navigate('/subscription')}>Upgrade Plan</button>
      </div>

      <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <h3>API Keys</h3>
        <p>Generate API keys for external access</p>
        <button className="btn-primary">Generate API Key</button>
      </div>

      <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12 }}>
        <h3>Danger Zone</h3>
        <button className="btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Settings;
