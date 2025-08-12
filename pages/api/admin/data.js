import { requireAdmin } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAdmin(async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { action } = req.body;
      
      if (action === 'backup') {
        try {
          const backupPath = db.backup();
          res.status(200).json({ 
            message: 'Backup berhasil dibuat', 
            backupPath: backupPath.replace(process.cwd(), '') 
          });
        } catch (error) {
          res.status(500).json({ message: 'Error creating backup: ' + error.message });
        }
      } 
      else if (action === 'reset') {
        try {
          db.resetData();
          res.status(200).json({ message: 'Data berhasil direset ke default' });
        } catch (error) {
          res.status(500).json({ message: 'Error resetting data: ' + error.message });
        }
      }
      else {
        res.status(400).json({ message: 'Action tidak valid' });
      }
      break;
    
    case 'GET':
      // Get data statistics
      try {
        const stats = {
          users: db.users.getAll().length,
          foods: db.foods.getAll().length,
          drinks: db.drinks.getAll().length,
          announcements: db.announcements.getAll().length,
          lastUpdated: new Date().toISOString()
        };
        res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ message: 'Error getting stats: ' + error.message });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});