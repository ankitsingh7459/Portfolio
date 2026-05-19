import { query } from '../config/database.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'];
    await query(
      'INSERT INTO contact_messages (name, email, message, ip_address) VALUES (?, ?, ?, ?)',
      [name, email, message, ip]
    );
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    next(err);
  }
};
