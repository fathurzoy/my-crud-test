import bcrypt from 'bcryptjs';
import { db } from '../../../utils/database';
import { generateToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }

  const user = db.users.getByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  // Untuk superuser, password langsung 'superuser'
  const isValid = username === 'superuser' 
    ? password === 'superuser'
    : await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  const token = generateToken(user);
  
  res.status(200).json({
    message: 'Login berhasil',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }
  });
}