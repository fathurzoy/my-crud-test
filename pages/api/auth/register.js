import bcrypt from 'bcryptjs';
import { db } from '../../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  // Cek apakah username sudah ada
  const existingUser = db.users.getByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username sudah digunakan' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user baru
  const newUser = db.users.create({
    username,
    password: hashedPassword,
    email
  });

  res.status(201).json({
    message: 'Registrasi berhasil',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }
  });
}