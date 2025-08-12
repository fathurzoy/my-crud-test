import { requireAuth } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAuth(async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const food = db.foods.getById(id);
      if (!food) {
        return res.status(404).json({ message: 'Food tidak ditemukan' });
      }
      res.status(200).json(food);
      break;
    
    case 'PUT':
      const { name, price, description } = req.body;
      const updatedFood = db.foods.update(id, { name, price: parseFloat(price), description });
      if (!updatedFood) {
        return res.status(404).json({ message: 'Food tidak ditemukan' });
      }
      res.status(200).json(updatedFood);
      break;
    
    case 'DELETE':
      const success = db.foods.delete(id);
      if (success) {
        res.status(200).json({ message: 'Food berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'Food tidak ditemukan' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});