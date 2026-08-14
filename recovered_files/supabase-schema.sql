-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  label VARCHAR(255)
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL,
  details TEXT NOT NULL
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT NOT NULL
);

-- Create home_content table
CREATE TABLE IF NOT EXISTS home_content (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  about_text JSONB NOT NULL,
  about_skills JSONB NOT NULL,
  hero_image_desktop_url TEXT NOT NULL,
  hero_image_mobile_url TEXT NOT NULL,
  projects_completed INTEGER DEFAULT 80,
  happy_clients INTEGER DEFAULT 30,
  years_experience INTEGER DEFAULT 3,
  views_generated INTEGER DEFAULT 5
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Create pricing_packets table
CREATE TABLE IF NOT EXISTS pricing_packets (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  base_price INTEGER,
  base_videos INTEGER NOT NULL,
  base_reels INTEGER NOT NULL,
  video_max_min INTEGER NOT NULL,
  video_style VARCHAR(255) NOT NULL,
  reel_style VARCHAR(255) NOT NULL,
  extra_video_price INTEGER NOT NULL,
  extra_reel_price INTEGER NOT NULL,
  extra_minute_price INTEGER NOT NULL,
  max_reels INTEGER,
  exclusive BOOLEAN DEFAULT FALSE,
  best_for VARCHAR(255) NOT NULL,
  reference_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  delivery VARCHAR(255),
  sort_order INTEGER DEFAULT 0
);

-- Seed Data

INSERT INTO home_content (name, tagline, about_text, about_skills, hero_image_desktop_url, hero_image_mobile_url)
VALUES (
  'Nabil Azmal Sajid',
  'Designer · Editor · Cinematographer · Photographer',
  '["I''m a multi-disciplinary creative professional with a passion for visual storytelling. With years of experience across video editing and photography, I bring a unique perspective to every project.", "My work spans from cinematic long-form content to scroll-stopping short-form edits, paired with photography that captures the moment. Every frame, every pixel, every cut is intentional.", "I believe great visuals don''t just look good — they communicate, persuade, and inspire action."]',
  '["Video Editing", "Photography"]',
  '/src/assets/hero-desktop.png',
  '/src/assets/hero-mobile.png'
);

INSERT INTO projects (title, category, image_url, label) VALUES 
('Brand Documentary', 'long-form', '/src/assets/longform-1.jpg', NULL),
('Travel Film', 'long-form', '/src/assets/longform-2.jpg', NULL),
('Music Video', 'long-form', '/src/assets/longform-3.jpg', NULL),
('Commercial Edit', 'long-form', '/src/assets/longform-2.jpg', NULL),
('Product Reel', 'short-form', '/src/assets/shortform-1.jpg', NULL),
('Event Highlights', 'short-form', '/src/assets/shortform-2.jpg', NULL),
('Event Poster', 'poster', '/src/assets/poster-1.jpg', NULL),
('Brand Campaign', 'poster', '/src/assets/poster-2.jpg', NULL),
('Corporate Event', 'photography', '/src/assets/photo-1.jpg', 'Corporate Event'),
('Product Photography', 'photography', '/src/assets/photo-2.jpg', 'Product Photography');

INSERT INTO skills (name, level, details) VALUES 
('Adobe Premiere Pro', 95, 'Expert in multicam editing, color grading, and advanced effects workflows for commercial and cinematic projects.'),
('After Effects', 85, 'Motion graphics, compositing, and visual effects for branded content and social media.'),
('Photoshop', 92, 'Advanced retouching, compositing, poster design, and digital art creation.'),
('Illustrator', 85, 'Vector illustration, logo design, brand identity systems, and print-ready artwork.');

INSERT INTO experience (role, company, period, description) VALUES 
('Co-Founder & COO', '365 Frames', 'Jun 2025 – Present', 'Co-founded a creative production company, overseeing operations and creative direction.'),
('Lead Video Editor', 'TarTar Digital', 'Dec 2024 – Present', 'Leading video editing projects for digital campaigns and branded content.');

INSERT INTO faqs (question, answer, sort_order) VALUES 
('What services do you offer?', 'I offer graphic design, video editing (long and short form), cinematography, photography, and poster design. From concept to final delivery.', 1),
('What''s your turnaround time?', 'Depending on the project scope, typical turnaround is 3–7 business days. Rush orders can be accommodated with prior discussion.', 2),
('Do you work with international clients?', 'Absolutely. I''ve collaborated with clients worldwide and can work across time zones seamlessly.', 3),
('What''s your pricing structure?', 'Pricing is project-based and depends on scope, complexity, and deliverables. Reach out for a custom quote.', 4);

INSERT INTO pricing_packets (
  id, name, tagline, base_price, base_videos, base_reels, video_max_min, 
  video_style, reel_style, extra_video_price, extra_reel_price, extra_minute_price, 
  max_reels, exclusive, best_for, reference_url, featured, delivery, sort_order
) VALUES 
('starter', 'Starter Packet', 'Lean, clean, and ready to roll', 3500, 1, 0, 5, 'Basic cut', 'Basic caption style', 3000, 400, 500, 3, true, 'Best for basic event promo / aftermovie.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', false, 'Delivery within 3 working days', 1),
('promotional', 'Promotional Packet', 'Built for creators who need more punch', 6000, 1, 2, 8, 'Semi-Advance', 'Basic caption style', 5000, 500, 800, null, false, 'Best for YouTube videos and content creators.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', true, 'Delivery within 7 working days', 2),
('fullhouse', 'Full House', 'Full production shoot + editing', null, 1, 0, 8, 'Full Production shoot + editing', '', 0, 0, 0, null, false, 'Best for full-scale brand productions.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', false, null, 3);
