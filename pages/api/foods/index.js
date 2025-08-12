import { requireAuth } from '../../../utils/auth';
import { db } from '../../../utils/database';

export default requireAuth(async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const foods = db.foods.getAll();
      res.status(200).json(foods);
      break;
    
    case 'POST':
      const { name, price, description } = req.body;
      if (!name || !price) {
        return res.status(400).json({ message: 'Name dan price harus diisi' });
      }
      
      const newFood = db.foods.create({
        name,
        price: parseFloat(price),
        description: description || ''
      });
      
      res.status(201).json(newFood);
      break;
    
    default:
      res.status(405).json({ message: 'Method tidak diizinkan' });
  }
});