import { requireAdmin } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAdmin(async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'DELETE':
      const success = db.users.delete(id);
      if (success) {
        res.status(200).json({ message: 'User berhasil dihapus' });
      } else {
        res.status(400).json({ message: 'User tidak dapat dihapus atau tidak ditemukan' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});