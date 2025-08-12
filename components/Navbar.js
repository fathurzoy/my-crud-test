import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token untuk mendapatkan user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [router.asPath]); // Re-run when route changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold hover:text-blue-200">
            CRUD App
          </Link>
          
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <span className="text-blue-200">
                  Hello, <span className="font-semibold">{user.username}</span>
                  {user.role === 'admin' && (
                    <span className="ml-1 px-2 py-1 bg-red-500 text-white text-xs rounded">
                      ADMIN
                    </span>
                  )}
                </span>
                <Link href="/dashboard" className="hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <div className="flex space-x-4">
                    <Link href="/admin/data" className="hover:text-blue-200 transition-colors">
                      Data
                    </Link>
                    <Link href="/admin/users" className="hover:text-blue-200 transition-colors">
                      Users
                    </Link>
                    <Link href="/admin/foods" className="hover:text-blue-200 transition-colors">
                      Foods
                    </Link>
                    <Link href="/admin/drinks" className="hover:text-blue-200 transition-colors">
                      Drinks
                    </Link>
                  </div>
                )}
                <button 
                  onClick={handleLogout} 
                  className="hover:text-blue-200 transition-colors bg-blue-500 px-3 py-1 rounded hover:bg-blue-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="hover:text-blue-200 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}