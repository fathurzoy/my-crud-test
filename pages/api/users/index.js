import { requireAdmin } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAdmin(async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const users = db.users.getAll().map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role
      }));
      res.status(200).json(users);
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});