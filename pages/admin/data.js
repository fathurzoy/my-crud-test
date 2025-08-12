import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import axios from 'axios';

export default function AdminData() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    if (!confirm('Yakin ingin membuat backup data?')) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/data', 
        { action: 'backup' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Backup berhasil dibuat!\nPath: ' + response.data.backupPath);
      fetchStats(); // Refresh stats
    } catch (error) {
      alert('Error creating backup: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('PERINGATAN: Ini akan menghapus semua data dan reset ke default!\n\nYakin ingin melanjutkan?')) {
      return;
    }

    if (!confirm('Ini adalah tindakan yang tidak bisa dibatalkan!\n\nKlik OK untuk konfirmasi final.')) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/data', 
        { action: 'reset' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Data berhasil direset ke default!');
      fetchStats(); // Refresh stats
    } catch (error) {
      alert('Error resetting data: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">Data Management</h1>
          
          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Users</h3>
              <p className="text-2xl font-bold text-blue-600">{stats?.users || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Foods</h3>
              <p className="text-2xl font-bold text-green-600">{stats?.foods || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Drinks</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats?.drinks || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Announcements</h3>
              <p className="text-2xl font-bold text-purple-600">{stats?.announcements || 0}</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h2 className="font-bold text-lg mb-2">✅ Persistent Storage Aktif</h2>
            <p>Data sekarang tersimpan di file JSON dan tidak akan hilang saat refresh atau restart server!</p>
            <p className="text-sm mt-2">Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Unknown'}</p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Backup Data</h2>
              <p className="text-gray-600 mb-3">
                Buat backup semua data ke folder terpisah dengan timestamp.
              </p>
              <button
                onClick={handleBackup}
                disabled={actionLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {actionLoading ? 'Creating Backup...' : 'Create Backup'}
              </button>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-red-800">Reset Data</h2>
              <p className="text-gray-600 mb-3">
                <strong>PERINGATAN:</strong> Ini akan menghapus semua data dan mengembalikan ke data default.
                Tindakan ini tidak dapat dibatalkan!
              </p>
              <button
                onClick={handleReset}
                disabled={actionLoading}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {actionLoading ? 'Resetting...' : 'Reset to Default'}
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Storage Information</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Storage Location:</strong> /data/*.json files</p>
                <p><strong>Backup Location:</strong> /data/backups/</p>
                <p><strong>Data Files:</strong></p>
                <ul className="ml-4 list-disc">
                  <li>users.json - User accounts</li>
                  <li>foods.json - Food items</li>
                  <li>drinks.json - Drink items</li>
                  <li>announcements.json - System announcements</li>
                  <li>counters.json - Auto-increment counters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={fetchStats}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh Stats
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Users
            </button>
            <button
              onClick={() => router.push('/admin/foods')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Foods
            </button>
            <button
              onClick={() => router.push('/admin/drinks')}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Drinks
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}