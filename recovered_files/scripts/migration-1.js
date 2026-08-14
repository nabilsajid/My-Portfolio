import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.VITE_NEON_DB_URL);

async function runMigration() {
  console.log("Running migration...");

  // 1. Add stats columns to home_content
  console.log("Adding stats to home_content...");
  await sql`
    ALTER TABLE home_content
    ADD COLUMN IF NOT EXISTS projects_completed INTEGER DEFAULT 80,
    ADD COLUMN IF NOT EXISTS happy_clients INTEGER DEFAULT 30,
    ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 3,
    ADD COLUMN IF NOT EXISTS views_generated INTEGER DEFAULT 5;
  `;

  // 2. Create faqs table
  console.log("Creating faqs table...");
  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
  `;

  // 3. Create pricing_packets table
  console.log("Creating pricing_packets table...");
  await sql`
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
  `;

  // Seed FAQs if empty
  const faqCount = await sql`SELECT COUNT(*) FROM faqs`;
  if (parseInt(faqCount[0].count) === 0) {
    console.log("Seeding FAQs...");
    const faqs = [
      { q: "What services do you offer?", a: "I offer graphic design, video editing (long and short form), cinematography, photography, and poster design. From concept to final delivery." },
      { q: "What's your turnaround time?", a: "Depending on the project scope, typical turnaround is 3–7 business days. Rush orders can be accommodated with prior discussion." },
      { q: "Do you work with international clients?", a: "Absolutely. I've collaborated with clients worldwide and can work across time zones seamlessly." },
      { q: "What's your pricing structure?", a: "Pricing is project-based and depends on scope, complexity, and deliverables. Reach out for a custom quote." },
      { q: "Can I see more of your work?", a: "Yes! Browse the sections above or reach out via my social links — I'm happy to share relevant samples." },
    ];
    let order = 1;
    for (const f of faqs) {
      await sql`INSERT INTO faqs (question, answer, sort_order) VALUES (${f.q}, ${f.a}, ${order++})`;
    }
  }

  // Seed Pricing Packets if empty
  const pricingCount = await sql`SELECT COUNT(*) FROM pricing_packets`;
  if (parseInt(pricingCount[0].count) === 0) {
    console.log("Seeding Pricing...");
    const packets = [
      {
        id: "starter",
        name: "Starter Packet",
        tagline: "Lean, clean, and ready to roll",
        base_price: 3500,
        base_videos: 1,
        base_reels: 0,
        video_max_min: 5,
        video_style: "Basic cut",
        reel_style: "Basic caption style",
        extra_video_price: 3000,
        extra_reel_price: 400,
        extra_minute_price: 500,
        max_reels: 3,
        exclusive: true,
        best_for: "Best for basic event promo / aftermovie.",
        reference_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        delivery: "Delivery within 3 working days",
        sort_order: 1
      },
      {
        id: "promotional",
        name: "Promotional Packet",
        tagline: "Built for creators who need more punch",
        base_price: 6000,
        base_videos: 1,
        base_reels: 2,
        video_max_min: 8,
        video_style: "Semi-Advance",
        reel_style: "Basic caption style",
        extra_video_price: 5000,
        extra_reel_price: 500,
        extra_minute_price: 800,
        max_reels: null,
        exclusive: false,
        best_for: "Best for YouTube videos and content creators.",
        reference_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        featured: true,
        delivery: "Delivery within 7 working days",
        sort_order: 2
      },
      {
        id: "fullhouse",
        name: "Full House",
        tagline: "Full production shoot + editing",
        base_price: null,
        base_videos: 1,
        base_reels: 0,
        video_max_min: 8,
        video_style: "Full Production shoot + editing",
        reel_style: "",
        extra_video_price: 0,
        extra_reel_price: 0,
        extra_minute_price: 0,
        max_reels: null,
        exclusive: false,
        best_for: "Best for full-scale brand productions.",
        reference_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        featured: false,
        delivery: null,
        sort_order: 3
      },
    ];
    for (const p of packets) {
      await sql`
        INSERT INTO pricing_packets (
          id, name, tagline, base_price, base_videos, base_reels, video_max_min, 
          video_style, reel_style, extra_video_price, extra_reel_price, extra_minute_price, 
          max_reels, exclusive, best_for, reference_url, featured, delivery, sort_order
        ) VALUES (
          ${p.id}, ${p.name}, ${p.tagline}, ${p.base_price}, ${p.base_videos}, ${p.base_reels}, ${p.video_max_min},
          ${p.video_style}, ${p.reel_style}, ${p.extra_video_price}, ${p.extra_reel_price}, ${p.extra_minute_price},
          ${p.max_reels}, ${p.exclusive}, ${p.best_for}, ${p.reference_url}, ${p.featured}, ${p.delivery}, ${p.sort_order}
        )
      `;
    }
  }

  console.log("Migration complete!");
}

runMigration().catch(console.error);