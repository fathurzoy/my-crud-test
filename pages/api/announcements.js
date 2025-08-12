import { db } from '../../utils/database';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const announcements = db.announcements.getAll();
  res.status(200).json(announcements);
}