CREATE DATABASE IF NOT EXISTS ankit_portfolio;
USE ankit_portfolio;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Ankit Singh',
  tagline VARCHAR(500) NOT NULL,
  bio TEXT,
  email VARCHAR(255),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  resume_url VARCHAR(500),
  profile_photo_url VARCHAR(500),
  location VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category ENUM('languages', 'web', 'database', 'cloud', 'tools', 'extra') NOT NULL,
  proficiency INT DEFAULT 80,
  description TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tech_stack JSON,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  issue_date DATE,
  image_url VARCHAR(500),
  certificate_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  page_path VARCHAR(255),
  section VARCHAR(100),
  user_agent TEXT,
  ip_address VARCHAR(45),
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id),
  INDEX idx_section (section),
  INDEX idx_visited (visited_at)
);

CREATE TABLE IF NOT EXISTS page_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_visitors INT DEFAULT 0,
  total_page_views INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed profile
INSERT INTO profile (name, tagline, bio, email, github_url, linkedin_url) VALUES (
  'Ankit Singh',
  'AI/ML Engineer | Vibe Coder | Tech Enthusiast',
  'A second-year CSE student passionate about Artificial Intelligence, cloud technologies, problem solving, and building innovative solutions.',
  'ankitenterprises0001@gmail.com',
  'https://github.com/ankitsingh7459',
  'https://www.linkedin.com/in/ankit-singh-tech'
) ON DUPLICATE KEY UPDATE name = name;

-- Seed skills
INSERT INTO skills (name, category, proficiency, description, sort_order) VALUES
('Java', 'languages', 85, 'Object-oriented programming, data structures, and enterprise patterns', 1),
('Python', 'languages', 90, 'AI/ML development, scripting, and backend APIs', 2),
('C', 'languages', 75, 'Systems programming and low-level fundamentals', 3),
('HTML', 'web', 90, 'Semantic markup and accessibility', 4),
('CSS', 'web', 85, 'Modern layouts, animations, and responsive design', 5),
('Basic Frontend', 'web', 80, 'React, component architecture, and UI/UX', 6),
('MySQL', 'database', 85, 'Relational database design and optimization', 7),
('Appwrite', 'database', 80, 'BaaS integration, authentication, and storage', 8),
('AWS', 'cloud', 75, 'EC2, S3, Lambda, and cloud architecture fundamentals', 9),
('Git', 'tools', 90, 'Version control, branching strategies, and collaboration', 10);

-- Seed projects
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, sort_order) VALUES
(
  'Portfolio',
  'Personal portfolio website and API for showcasing projects, certifications, GitHub activity, and contact workflows.',
  '["React", "Vite", "Node.js", "Express", "MySQL"]',
  'https://github.com/ankitsingh7459/Portfolio',
  NULL,
  TRUE,
  1
),
(
  'CoSupport',
  'Collaborative AI support project where I handled backend development and helped implement RAG-powered knowledge retrieval.',
  '["Backend", "RAG", "API", "AI"]',
  'https://github.com/Saadkhan10412/Cosupport',
  NULL,
  TRUE,
  2
),
(
  'Bank Management System',
  'A comprehensive banking application with secure transaction processing, account management, and role-based access control for administrators and customers.',
  '["Java", "MySQL", "Swing", "JDBC"]',
  'https://github.com/ankitsingh7459/Bank-Management-System',
  NULL,
  TRUE,
  3
);

-- Seed certifications
INSERT INTO certifications (title, provider, issue_date, certificate_url, sort_order) VALUES
('AWS Cloud Practitioner', 'Amazon Web Services', '2025-06-01', 'https://aws.amazon.com/certification/', 1),
('Machine Learning Foundations', 'Coursera', '2025-03-15', NULL, 2);

INSERT INTO page_views (total_visitors, total_page_views) VALUES (0, 0);
