'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSubdomain, setTenantSubdomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantSubdomain }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">KhmerGhost</h1>
          <p className="text-gray-400 mt-2">OMEGA Platform</p>
        </div>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Workspace (e.g., mycompany)"
            value={tenantSubdomain}
            onChange={e => setTenantSubdomain(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
