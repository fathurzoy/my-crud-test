import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Selamat Datang di CRUD App</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Pengumuman</h2>
          {announcements.map(announcement => (
            <div key={announcement.id} className="border-b pb-4 mb-4 last:border-b-0">
              <h3 className="text-xl font-medium">{announcement.title}</h3>
              <p className="text-gray-600 mt-2">{announcement.content}</p>
              <span className="text-sm text-gray-400">
                {new Date(announcement.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}