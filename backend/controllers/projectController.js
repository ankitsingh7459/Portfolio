import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value !== 'string') return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseProject = (project) => {
  const techStack = parseJsonArray(project.tech_stack);

  return {
    ...project,
    _id: project.id,
    tech_stack: techStack,
    techStack,
    imageUrl: project.image_url,
    videoUrl: project.video_url,
    githubUrl: project.github_url,
    liveUrl: project.live_url,
    sortOrder: project.sort_order,
    featured: Boolean(project.featured),
  };
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
    res.json({ success: true, data: projects.map(parseProject) });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const techStack = req.body.tech_stack ?? req.body.techStack ?? [];
    const imageUrl = req.body.image_url ?? req.body.imageUrl;
    const videoUrl = req.body.video_url ?? req.body.videoUrl;
    const githubUrl = req.body.github_url ?? req.body.githubUrl;
    const liveUrl = req.body.live_url ?? req.body.liveUrl;
    const sortOrder = req.body.sort_order ?? req.body.sortOrder ?? 0;
    const { title, description, featured } = req.body;
    const result = await query(
      `INSERT INTO projects (title, description, tech_stack, image_url, video_url, github_url, live_url, featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, JSON.stringify(techStack), imageUrl, videoUrl, githubUrl, liveUrl, featured || false, sortOrder]
    );
    const [project] = await query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: parseProject(project) });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing.length) throw new AppError('Project not found', 404);

    const fieldMap = {
      title: 'title',
      description: 'description',
      tech_stack: 'tech_stack',
      techStack: 'tech_stack',
      image_url: 'image_url',
      imageUrl: 'image_url',
      video_url: 'video_url',
      videoUrl: 'video_url',
      github_url: 'github_url',
      githubUrl: 'github_url',
      live_url: 'live_url',
      liveUrl: 'live_url',
      featured: 'featured',
      sort_order: 'sort_order',
      sortOrder: 'sort_order',
    };
    const updatesByColumn = new Map();

    Object.entries(fieldMap).forEach(([bodyField, column]) => {
      if (req.body[bodyField] !== undefined) {
        const value = column === 'tech_stack' ? JSON.stringify(req.body[bodyField]) : req.body[bodyField];
        updatesByColumn.set(column, value);
      }
    });

    const updates = [...updatesByColumn.keys()].map((column) => `${column} = ?`);
    const values = [...updatesByColumn.values()];

    if (!updates.length) throw new AppError('No fields to update', 400);
    values.push(id);
    await query(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, values);

    const [project] = await query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json({ success: true, data: parseProject(project) });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM projects WHERE id = ?', [id]);
    if (!result.affectedRows) throw new AppError('Project not found', 404);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
