import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admins = await query('SELECT * FROM admins WHERE email = ?', [email]);
    let admin = admins[0];

    if (!admin && email === process.env.ADMIN_EMAIL) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      const result = await query('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [email, hash]);
      admin = { id: result.insertId, email, password_hash: hash };
    }

    if (!admin) throw new AppError('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({ success: true, token, user: { email: admin.email } });
  } catch (err) {
    next(err);
  }
};
