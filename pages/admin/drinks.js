import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import axios from 'axios';

export default function AdminDrinks() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDrink, setEditingDrink] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        alert('Akses ditolak. Hanya admin yang bisa mengakses halaman ini.');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }

    fetchDrinks(token);
  }, []);

  const fetchDrinks = async (token) => {
    try {
      const response = await axios.get('/api/drinks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrinks(response.data);
    } catch (error) {
      console.error('Error fetching drinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingDrink) {
        // Update existing drink
        const response = await axios.put(`/api/drinks/${editingDrink.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDrinks(drinks.map(drink => 
          drink.id === editingDrink.id ? response.data : drink
        ));
        alert('Drink berhasil diupdate!');
      } else {
        // Create new drink
        const response = await axios.post('/api/drinks', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDrinks([...drinks, response.data]);
        alert('Drink berhasil ditambahkan!');
      }

      setFormData({ name: '', price: '', description: '' });
      setEditingDrink(null);
      setShowForm(false);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEdit = (drink) => {
    setEditingDrink(drink);
    setFormData({
      name: drink.name,
      price: drink.price.toString(),
      description: drink.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (drinkId, drinkName) => {
    if (!confirm(`Yakin ingin menghapus ${drinkName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/drinks/${drinkId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDrinks(drinks.filter(drink => drink.id !== drinkId));
      alert('Drink berhasil dihapus!');
    } catch (error) {
      alert('Error menghapus drink: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', price: '', description: '' });
    setEditingDrink(null);
    setShowForm(false);
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Drink Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {showForm ? 'Cancel' : 'Add New Drink'}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">
                {editingDrink ? 'Edit Drink' : 'Add New Drink'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {editingDrink ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drinks.map(drink => (
                  <tr key={drink.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{drink.id}</td>
                    <td className="px-4 py-2 font-medium">{drink.name}</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">
                      Rp {drink.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {drink.description || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(drink)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(drink.id, drink.name)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Total drinks: {drinks.length}
          </div>
        </div>
      </div>
    </Layout>
  );
}