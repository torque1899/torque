-- Migration: 0001_initial.sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('admin', 'author', 'reader')),
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id INTEGER NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  show_in_nav INTEGER NOT NULL DEFAULT 0,
  nav_order INTEGER NOT NULL DEFAULT 0,
  author_id INTEGER NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at INTEGER NOT NULL
);

-- Seed: default admin user (password: admin123 - change immediately!)
-- Password hash for 'admin123' - generated with bcryptjs
INSERT OR IGNORE INTO users (name, email, password_hash, role, created_at)
VALUES ('Admin', 'admin@torque.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhu', 'admin', unixepoch());

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('homepage', '{"alerts":["IGNOU June Term End Exam Assignment submission deadline extended","New Sarkari Job alerts: SBI PO and SSC CGL notifications out!"],"portals":[{"label":"IGNOU Official Website","href":"https://www.ignou.ac.in"},{"label":"IGNOU Student Samarth Portal","href":"https://ignou.samarth.edu.in"},{"label":"Online Exam Form Submission","href":"https://exam.ignou.ac.in"},{"label":"Revaluation Result Portal","href":"https://revaluation.ignou.ac.in"},{"label":"Sarkari Job Results Board","href":"https://www.sarkaripost.com"}],"checklist":[{"label":"June Term-End Assignments","status":"Active / Open","color":"#16a34a"},{"label":"June Term-End Examinations Form","status":"Extended / Open","color":"#16a34a"},{"label":"New Academic Cycle Admission","status":"Extended","color":"#b45309"},{"label":"Hall Ticket / Admit Card link","status":"Awaiting Link","color":"#d33"},{"label":"Grade Card Re-evaluation status","status":"Updated Daily","color":"#2563eb"}],"telegram":{"title":"Join Telegram Channel","description":"Get instant notifications on your mobile for IGNOU announcements, question sheets, syllabus releases, and Government Job Alerts.","channelUrl":"https://t.me/ignou_study_jobs"}}');
