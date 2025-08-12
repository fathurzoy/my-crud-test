import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import axios from 'axios';

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
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

    fetchFoods(token);
  }, []);

  const fetchFoods = async (token) => {
    try {
      const response = await axios.get('/api/foods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingFood) {
        // Update existing food
        const response = await axios.put(`/api/foods/${editingFood.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFoods(foods.map(food => 
          food.id === editingFood.id ? response.data : food
        ));
        alert('Food berhasil diupdate!');
      } else {
        // Create new food
        const response = await axios.post('/api/foods', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFoods([...foods, response.data]);
        alert('Food berhasil ditambahkan!');
      }

      setFormData({ name: '', price: '', description: '' });
      setEditingFood(null);
      setShowForm(false);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      price: food.price.toString(),
      description: food.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (foodId, foodName) => {
    if (!confirm(`Yakin ingin menghapus ${foodName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/foods/${foodId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFoods(foods.filter(food => food.id !== foodId));
      alert('Food berhasil dihapus!');
    } catch (error) {
      alert('Error menghapus food: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', price: '', description: '' });
    setEditingFood(null);
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
            <h1 className="text-3xl font-bold">Food Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {showForm ? 'Cancel' : 'Add New Food'}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">
                {editingFood ? 'Edit Food' : 'Add New Food'}
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
                    {editingFood ? 'Update' : 'Create'}
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
                {foods.map(food => (
                  <tr key={food.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{food.id}</td>
                    <td className="px-4 py-2 font-medium">{food.name}</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">
                      Rp {food.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {food.description || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(food)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(food.id, food.name)}
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
            Total foods: {foods.length}
          </div>
        </div>
      </div>
    </Layout>
  );
}