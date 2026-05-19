import { query } from '../config/database.js';

export const getProfile = async (req, res, next) => {
  try {
    const [profile] = await query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    const interests = [
      'Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'AWS',
      'Backend Development', 'Developer Tools', 'Cybersecurity', 'Intelligent Systems',
    ];
    res.json({
      success: true,
      data: {
        ...profile,
        interests,
        roles: ['AI/ML Engineer', 'Vibe Coder', 'Tech Enthusiast'],
        education: 'Second-year CSE student',
      },
    });
  } catch (err) {
    next(err);
  }
};
