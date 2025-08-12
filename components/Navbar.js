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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            CRUD App
          </Link>
          
          <div className="flex space-x-4">
            {user ? (
              <>
                <span>Hello, {user.username}</span>
                <Link href="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link href="/admin/users" className="hover:text-blue-200">
                      Users
                    </Link>
                    <Link href="/admin/foods" className="hover:text-blue-200">
                      Foods
                    </Link>
                    <Link href="/admin/drinks" className="hover:text-blue-200">
                      Drinks
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="hover:text-blue-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link href="/register" className="hover:text-blue-200">
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