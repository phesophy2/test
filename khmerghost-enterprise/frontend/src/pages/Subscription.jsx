import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPlans();
    const userData = localStorage.getItem('user');
    if(userData) setUser(JSON.parse(userData));
  }, []);

  const fetchPlans = async () => {
    const res = await fetch('http://localhost:5001/api/subscription/plans');
    setPlans(await res.json());
  };

  const upgrade = async (plan) => {
    const res = await fetch('http://localhost:5001/api/subscription/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id, tier: plan.tier, amount: plan.price })
    });
    const data = await res.json();
    if(data.success) {
      alert(`Upgraded to ${plan.name}!`);
      navigate('/dashboard/settings');
    }
  };

  return (
    <div className="dashboard" style={{ padding: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>Choose Your Plan</h2>
        <div className="stats-grid">
          {plans.map(plan => (
            <div key={plan.tier} className="stat-card">
              <h3>{plan.name}</h3>
              <div className="number">${plan.price}<span style={{ fontSize: 14 }}>/month</span></div>
              <ul style={{ marginTop: 20, listStyle: 'none', textAlign: 'left' }}>
                {Object.entries(plan.features).map(([k,v]) => (
                  <li key={k} style={{ padding: 5 }}>✓ {k}: {v}</li>
                ))}
              </ul>
              {plan.price > 0 && (
                <button className="btn-primary" onClick={() => upgrade(plan)} style={{ marginTop: 20, width: '100%' }}>
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
