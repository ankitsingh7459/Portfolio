import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getCertifications = async (req, res, next) => {
  try {
    const data = await query('SELECT * FROM certifications ORDER BY sort_order ASC, issue_date DESC');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createCertification = async (req, res, next) => {
  try {
    const { title, provider, issue_date, image_url, certificate_url, sort_order } = req.body;
    const result = await query(
      'INSERT INTO certifications (title, provider, issue_date, image_url, certificate_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, provider, issue_date, image_url, certificate_url, sort_order || 0]
    );
    const [cert] = await query('SELECT * FROM certifications WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: cert });
  } catch (err) {
    next(err);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM certifications WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) throw new AppError('Certification not found', 404);
    res.json({ success: true, message: 'Certification deleted' });
  } catch (err) {
    next(err);
  }
};
