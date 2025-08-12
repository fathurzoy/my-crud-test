import { requireAuth } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAuth(async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const drink = db.drinks.getById(id);
      if (!drink) {
        return res.status(404).json({ message: 'Drink tidak ditemukan' });
      }
      res.status(200).json(drink);
      break;
    
    case 'PUT':
      const { name, price, description } = req.body;
      const updatedDrink = db.drinks.update(id, { name, price: parseFloat(price), description });
      if (!updatedDrink) {
        return res.status(404).json({ message: 'Drink tidak ditemukan' });
      }
      res.status(200).json(updatedDrink);
      break;
    
    case 'DELETE':
      const success = db.drinks.delete(id);
      if (success) {
        res.status(200).json({ message: 'Drink berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'Drink tidak ditemukan' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});