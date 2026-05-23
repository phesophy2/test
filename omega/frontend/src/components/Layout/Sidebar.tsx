import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: '📊' },
  { path: '/dashboard/accounts', name: 'Accounts', icon: '👥' },
  { path: '/dashboard/posts', name: 'Posts', icon: '📝' },
  { path: '/dashboard/analytics', name: 'Analytics', icon: '📈' },
  { path: '/dashboard/marketplace', name: 'Marketplace', icon: '🛒' },
  { path: '/dashboard/gamification', name: 'Gamification', icon: '🏆' },
  { path: '/dashboard/settings', name: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-cyan-400">KhmerGhost</h1>
        <p className="text-xs text-gray-500">OMEGA Platform</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.path ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
