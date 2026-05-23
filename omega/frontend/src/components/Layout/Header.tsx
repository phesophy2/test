import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">
        Logout
      </button>
    </header>
  );
}
