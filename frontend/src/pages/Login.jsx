import React, { useState } from 'react';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else { setError(data.error || 'Login failed'); }
    } catch (error) { setError('Network error'); }
    setLoading(false);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to KhmerGhost</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
        </form>
        <p><a href="/register">Don't have an account?</a></p>
        <p><a href="/forgot-password">Forgot Password?</a></p>
      </div>
    </div>
  );
};
export default Login;
