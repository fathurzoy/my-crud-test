import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData(token);
    fetchFoods(token);
    fetchDrinks(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async (token) => {
    try {
      const response = await axios.get('/api/foods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const fetchDrinks = async (token) => {
    try {
      const response = await axios.get('/api/drinks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrinks(response.data);
    } catch (error) {
      console.error('Error fetching drinks:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Foods ({foods.length})</h2>
            {foods.length > 0 ? (
              <div className="space-y-3">
                {foods.slice(0, 5).map(food => (
                  <div key={food.id} className="border-b pb-2">
                    <h3 className="font-medium">{food.name}</h3>
                    <p className="text-green-600 font-semibold">Rp {food.price?.toLocaleString()}</p>
                  </div>
                ))}
                {foods.length > 5 && (
                  <p className="text-gray-500">Dan {foods.length - 5} makanan lainnya...</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Belum ada data makanan</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Drinks ({drinks.length})</h2>
            {drinks.length > 0 ? (
              <div className="space-y-3">
                {drinks.slice(0, 5).map(drink => (
                  <div key={drink.id} className="border-b pb-2">
                    <h3 className="font-medium">{drink.name}</h3>
                    <p className="text-green-600 font-semibold">Rp {drink.price?.toLocaleString()}</p>
                  </div>
                ))}
                {drinks.length > 5 && (
                  <p className="text-gray-500">Dan {drinks.length - 5} minuman lainnya...</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Belum ada data minuman</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}