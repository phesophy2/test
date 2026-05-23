import React, { useState } from 'react';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message || 'Reset link sent to your email');
    } catch (error) { setMessage('Error sending reset link'); }
    setLoading(false);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Send Reset Link'}</button>
        </form>
        <p><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
};
export default ForgotPassword;
