import React, { useState, useEffect } from 'react';
const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5001/api/subscription/plans').then(r=>r.json()).then(setPlans);
    const token = localStorage.getItem('token');
    if(token) fetch('http://localhost:5001/api/subscription/current', { headers: { 'Authorization': `Bearer ${token}` } }).then(r=>r.json()).then(setCurrentPlan);
  }, []);
  const upgrade = (plan) => { setSelectedPlan(plan); setShowPayment(true); };
  const processPayment = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5001/api/subscription/upgrade', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ tier: selectedPlan.tier, paymentMethod: 'wing' })
    });
    alert(`Upgraded to ${selectedPlan.tier}`);
    setShowPayment(false);
    window.location.reload();
  };
  return (
    <div className="subscription-page">
      <h2>Subscription Plans</h2>
      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.tier} className={`plan-card ${currentPlan?.tier === plan.tier ? 'current' : ''}`}>
            <h3>{plan.name}</h3>
            <div className="price">${plan.price}<span>/month</span></div>
            <ul>{Object.entries(plan.features || {}).map(([k,v])=><li key={k}>✓ {k}: {v}</li>)}</ul>
            {currentPlan?.tier !== plan.tier && <button onClick={()=>upgrade(plan)}>Upgrade</button>}
            {currentPlan?.tier === plan.tier && <span className="current-badge">Current Plan</span>}
          </div>
        ))}
      </div>
      {showPayment && selectedPlan && (
        <div className="payment-modal"><div className="payment-modal-content"><h3>Complete Payment</h3><p>Plan: {selectedPlan.name}</p><p>Amount: ${selectedPlan.price}</p><div className="payment-buttons"><button onClick={processPayment}>Pay Now</button><button onClick={()=>setShowPayment(false)}>Cancel</button></div></div></div>
      )}
    </div>
  );
};
export default Subscription;
