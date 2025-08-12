import { requireAuth } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAuth(async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const drinks = db.drinks.getAll();
      res.status(200).json(drinks);
      break;
    
    case 'POST':
      const { name, price, description } = req.body;
      if (!name || !price) {
        return res.status(400).json({ message: 'Name dan price harus diisi' });
      }
      
      const newDrink = db.drinks.create({
        name,
        price: parseFloat(price),
        description: description || ''
      });
      
      res.status(201).json(newDrink);
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});