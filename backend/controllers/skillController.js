import { query } from '../config/database.js';

export const getSkills = async (req, res, next) => {
  try {
    const skills = await query('SELECT * FROM skills ORDER BY sort_order ASC');
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
    res.json({ success: true, data: skills, grouped });
  } catch (err) {
    next(err);
  }
};
