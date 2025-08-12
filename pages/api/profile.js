import { requireAuth } from '../../utils/auth';
import { db } from '../../utils/database';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const user = db.users.getById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});