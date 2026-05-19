import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const trackVisit = async (req, res, next) => {
  try {
    const { session_id, page_path, section } = req.body;
    const sid = session_id || uuidv4();
    const ip = req.ip || req.headers['x-forwarded-for'];
    const ua = req.headers['user-agent'];

    await query(
      'INSERT INTO visitors (session_id, page_path, section, user_agent, ip_address) VALUES (?, ?, ?, ?, ?)',
      [sid, page_path || '/', section, ua, ip]
    );

    const sessions = await query('SELECT COUNT(DISTINCT session_id) as count FROM visitors');
    const views = await query('SELECT COUNT(*) as count FROM visitors');
    await query('UPDATE page_views SET total_visitors = ?, total_page_views = ? WHERE id = 1', [
      sessions[0].count,
      views[0].count,
    ]);

    res.json({ success: true, session_id: sid });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [stats] = await query('SELECT * FROM page_views WHERE id = 1');
    const topSections = await query(
      `SELECT section, COUNT(*) as visits FROM visitors 
       WHERE section IS NOT NULL GROUP BY section ORDER BY visits DESC LIMIT 5`
    );
    const recentVisitors = await query(
      'SELECT COUNT(DISTINCT session_id) as count FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)'
    );

    res.json({
      success: true,
      data: {
        totalVisitors: stats?.total_visitors || 0,
        totalPageViews: stats?.total_page_views || 0,
        visitorsToday: recentVisitors[0]?.count || 0,
        topSections,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getGitHubActivity = async (req, res, next) => {
  try {
    const username = process.env.GITHUB_USERNAME || 'ankitsingh7459';
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
    ]);

    if (!userRes.ok) {
      return res.json({
        success: true,
        data: { username, repos: [], contributions: [], message: 'GitHub data unavailable' },
      });
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    res.json({
      success: true,
      data: {
        username: user.login,
        avatar: user.avatar_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        stats: {
          repos: user.public_repos,
          stars: repos.reduce((total, repo) => total + repo.stargazers_count, 0),
          forks: repos.reduce((total, repo) => total + repo.forks_count, 0),
        },
        repos: repos.map((r) => ({
          name: r.name,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          url: r.html_url,
          updated: r.updated_at,
        })),
        profileUrl: user.html_url,
      },
    });
  } catch (err) {
    next(err);
  }
};
