import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.VITE_NEON_DB_URL);

async function setupDatabase() {
  console.log("Creating tables...");

  // Create projects table
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      image_url TEXT NOT NULL,
      label VARCHAR(255)
    );
  `;

  // Create skills table
  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      level INTEGER NOT NULL,
      details TEXT NOT NULL
    );
  `;

  // Create experience table
  await sql`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      period VARCHAR(100) NOT NULL,
      description TEXT NOT NULL
    );
  `;

  // Create home_content table
  await sql`
    CREATE TABLE IF NOT EXISTS home_content (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      tagline VARCHAR(255) NOT NULL,
      about_text JSONB NOT NULL,
      about_skills JSONB NOT NULL,
      hero_image_desktop_url TEXT NOT NULL,
      hero_image_mobile_url TEXT NOT NULL
    );
  `;

  console.log("Tables created successfully.");

  console.log("Checking for existing data...");
  const existingHomeContent = await sql`SELECT COUNT(*) FROM home_content`;
  if (parseInt(existingHomeContent[0].count) === 0) {
    console.log("Seeding data...");

    // Seed home_content
    await sql`
      INSERT INTO home_content (name, tagline, about_text, about_skills, hero_image_desktop_url, hero_image_mobile_url)
      VALUES (
        'Nabil Azmal Sajid',
        'Designer · Editor · Cinematographer · Photographer',
        '["I''m a multi-disciplinary creative professional with a passion for visual storytelling. With years of experience across video editing and photography, I bring a unique perspective to every project.", "My work spans from cinematic long-form content to scroll-stopping short-form edits, paired with photography that captures the moment. Every frame, every pixel, every cut is intentional.", "I believe great visuals don''t just look good — they communicate, persuade, and inspire action."]',
        '["Video Editing", "Photography"]',
        '/src/assets/hero-desktop.png',
        '/src/assets/hero-mobile.png'
      )
    `;

    // Seed projects
    const projects = [
      { title: "Brand Documentary", category: "long-form", image_url: "/src/assets/longform-1.jpg" },
      { title: "Travel Film", category: "long-form", image_url: "/src/assets/longform-2.jpg" },
      { title: "Music Video", category: "long-form", image_url: "/src/assets/longform-3.jpg" },
      { title: "Commercial Edit", category: "long-form", image_url: "/src/assets/longform-2.jpg" },
      { title: "Event Film", category: "long-form", image_url: "/src/assets/longform-1.jpg" },
      { title: "Cinematic Reel", category: "long-form", image_url: "/src/assets/longform-3.jpg" },
      { title: "Product Reel", category: "short-form", image_url: "/src/assets/shortform-1.jpg" },
      { title: "Event Highlights", category: "short-form", image_url: "/src/assets/shortform-2.jpg" },
      { title: "Behind The Scenes", category: "short-form", image_url: "/src/assets/longform-1.jpg" },
      { title: "Social Edit", category: "short-form", image_url: "/src/assets/shortform-1.jpg" },
      { title: "Brand Story", category: "short-form", image_url: "/src/assets/shortform-2.jpg" },
      { title: "Tutorial Clip", category: "short-form", image_url: "/src/assets/longform-2.jpg" },
      { title: "Promo Video", category: "short-form", image_url: "/src/assets/shortform-1.jpg" },
      { title: "Event Poster", category: "poster", image_url: "/src/assets/poster-1.jpg" },
      { title: "Brand Campaign", category: "poster", image_url: "/src/assets/poster-2.jpg" },
      { title: "Concert Visual", category: "poster", image_url: "/src/assets/poster-1.jpg" },
      { title: "Album Art", category: "poster", image_url: "/src/assets/poster-2.jpg" },
      { title: "Festival Design", category: "poster", image_url: "/src/assets/poster-1.jpg" },
      { title: "Promo Poster", category: "poster", image_url: "/src/assets/poster-2.jpg" },
      { title: "Corporate Event", category: "photography", image_url: "/src/assets/photo-1.jpg", label: "Corporate Event" },
      { title: "Product Photography", category: "photography", image_url: "/src/assets/photo-2.jpg", label: "Product Photography" },
      { title: "Fashion Shoot", category: "photography", image_url: "/src/assets/photo-3.jpg", label: "Fashion Shoot" },
      { title: "Portrait", category: "photography", image_url: "/src/assets/photo-2.jpg", label: "Portrait" },
      { title: "Nature", category: "photography", image_url: "/src/assets/photo-1.jpg", label: "Nature" },
      { title: "Lifestyle", category: "photography", image_url: "/src/assets/photo-3.jpg", label: "Lifestyle" },
    ];

    for (const p of projects) {
      await sql`
        INSERT INTO projects (title, category, image_url, label)
        VALUES (${p.title}, ${p.category}, ${p.image_url}, ${p.label || null})
      `;
    }

    // Seed skills
    const skills = [
      { name: "Adobe Premiere Pro", level: 95, details: "Expert in multicam editing, color grading, and advanced effects workflows for commercial and cinematic projects." },
      { name: "After Effects", level: 85, details: "Motion graphics, compositing, and visual effects for branded content and social media." },
      { name: "Photoshop", level: 92, details: "Advanced retouching, compositing, poster design, and digital art creation." },
      { name: "Illustrator", level: 85, details: "Vector illustration, logo design, brand identity systems, and print-ready artwork." },
      { name: "Lightroom", level: 90, details: "Professional photo editing, batch processing, and consistent color grading across shoots." },
      { name: "Figma", level: 80, details: "UI/UX design, prototyping, design systems, and collaborative design workflows." },
    ];

    for (const s of skills) {
      await sql`
        INSERT INTO skills (name, level, details)
        VALUES (${s.name}, ${s.level}, ${s.details})
      `;
    }

    // Seed experience
    const experience = [
      { role: "Co-Founder & COO", company: "365 Frames", period: "Jun 2025 – Present", description: "Co-founded a creative production company, overseeing operations and creative direction." },
      { role: "Lead Video Editor", company: "TarTar Digital", period: "Dec 2024 – Present", description: "Leading video editing projects for digital campaigns and branded content." },
      { role: "Video Editor", company: "Zenetic Esports", period: "Feb 2024 – Present", description: "Editing competitive gaming content, highlight reels, and branded esports videos." },
      { role: "Production Manager", company: "One Studio Interactive", period: "May 2024 – Oct 2025", description: "Managing end-to-end production workflows for commercial and branded content." },
    ];

    for (const e of experience) {
      await sql`
        INSERT INTO experience (role, company, period, description)
        VALUES (${e.role}, ${e.company}, ${e.period}, ${e.description})
      `;
    }

    console.log("Database seeded successfully.");
  } else {
    console.log("Data already exists, skipping seed.");
  }
}

setupDatabase().catch(console.error);