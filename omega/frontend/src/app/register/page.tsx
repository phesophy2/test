'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [tenant, setTenant] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, tenantSubdomain: tenant || 'default' }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.replace('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const perks = [
    { icon: '🚀', title: 'Get started in seconds', desc: 'No credit card required' },
    { icon: '✨', title: 'Premium UI experience', desc: 'Claude AI-inspired design' },
    { icon: '🔒', title: 'Industry-grade security', desc: 'End-to-end encrypted' },
  ];

  if (!mounted) return null;

  return (
    <div className="page-split">
      {/* ── Left Brand ── */}
      <div className="side-brand">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="logo-block">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="logo-text">KhmerGhost</span>
          </div>

          <h1 className="brand-headline">
            Create your<br />
            <span className="brand-gradient-text">Free Account</span>
          </h1>
          <p className="brand-subtext">
            Join the KhmerGhost OMEGA platform and start automating your social media growth today. No credit card needed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {perks.map((p, i) => (
              <div key={i} className="feature-item">
                <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                <div>
                  <p className="feature-title">{p.title}</p>
                  <p className="feature-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trust-row" style={{ position: 'relative', zIndex: 10 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            🎉 Over <strong style={{ color: '#fff' }}>10,000+</strong> businesses already onboard
          </p>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="side-form">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <div className="animate-in" style={{ width: '100%', maxWidth: 440 }}>
          <div className="mobile-logo">
            <div className="mobile-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="gradient-text">KhmerGhost</span>
          </div>

          <div className="card">
            <div className="form-header">
              <h2 className="form-title">Create account ✨</h2>
              <p className="form-subtitle">Start your free journey today</p>
            </div>

            {error && (
              <div className="alert-error">
                <div className="alert-dot" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} className="form-input no-icon" required />
              </div>

              <div className="form-group">
                <label className="form-label">Workspace</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <input type="text" placeholder="your-workspace" value={tenant} onChange={e => setTenant(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" placeholder="hello@example.com" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} className="form-input" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <div className="spinner" /> : <>Create Account ✨</>}
              </button>
            </form>

            <div className="divider" />
            <p style={{ textAlign:'center', fontSize:'0.875rem', color:'var(--fg-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" className="link">Sign in →</Link>
            </p>
          </div>

          <div className="trust-badges">
            {['SSL Encrypted', 'GDPR Compliant', 'Free Forever'].map(b => (
              <div key={b} className="trust-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
