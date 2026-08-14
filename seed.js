import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding pricing packets...");
  const pricingData = [
    {
      id: "starter",
      name: "Starter",
      tagline: "For standard edits",
      base_price: 3500,
      base_videos: 1,
      base_reels: 0,
      video_max_min: 3,
      video_style: '["Standard editing", "Color grading", "Copyright free music"]',
      reel_style: "Basic social media edit",
      extra_video_price: 3000,
      extra_reel_price: 3000,
      extra_minute_price: 1000,
      best_for: "Small businesses & personal brands",
      reference_url: "https://youtube.com",
      delivery: "3 working days",
      sort_order: 1
    },
    {
      id: "promotional",
      name: "Promotional",
      tagline: "For serious content",
      base_price: 8000,
      base_videos: 1,
      base_reels: 2,
      video_max_min: 8,
      video_style: '["Semi advance editing", "Copyright free music", "Motion graphics", "Sound design", "Color grading"]',
      reel_style: "high quality reel",
      extra_video_price: 5000,
      extra_reel_price: 2000,
      extra_minute_price: 3000,
      featured: true,
      best_for: "Brands & serious creators",
      reference_url: "https://youtube.com",
      delivery: "7 working days",
      sort_order: 2
    },
    {
      id: "podcast",
      name: "Master Cut",
      tagline: "For standard podcasts",
      base_price: 7000,
      base_videos: 1,
      base_reels: 0,
      video_max_min: 60,
      video_style: '["25-30s intro", "Motion graphics", "Sound design", "Color correction"]',
      reel_style: "high quality reel",
      extra_video_price: 8000,
      extra_reel_price: 2000,
      extra_minute_price: 0,
      best_for: "Podcasters & interviewers",
      reference_url: "https://youtube.com",
      delivery: "8 working days",
      sort_order: 3
    },
    {
      id: "fullhouse",
      name: "Full House",
      tagline: "Total production",
      base_price: null,
      base_videos: 1,
      base_reels: 0,
      video_max_min: 3,
      video_style: '["Custom production"]',
      reel_style: "",
      extra_video_price: 0,
      extra_reel_price: 0,
      extra_minute_price: 0,
      best_for: "Agencies & large campaigns",
      reference_url: "https://youtube.com",
      delivery: "Custom timeline",
      sort_order: 4
    }
  ];

  for (const p of pricingData) {
    await supabase.from('pricing_packets').upsert(p);
  }

  console.log("Seeding experience...");
  const experienceData = [
    {
      role: "Creative Director",
      company: "Zenetic Esports",
      period: "2021 - Present",
      description: "Directing creative campaigns, overseeing video production, and leading the creative team to build engaging esports content."
    },
    {
      role: "Lead Cinematographer",
      company: "Level 7 Interactive",
      period: "2019 - 2021",
      description: "Shot and directed multiple commercial campaigns and music videos. Managed lighting and camera crews."
    },
    {
      role: "Video Editor",
      company: "Freelance",
      period: "2017 - 2019",
      description: "Edited diverse projects ranging from short films to promotional material using Premiere Pro and DaVinci Resolve."
    }
  ];

  for (const e of experienceData) {
    // Only insert if table is empty to avoid dupes
    const { data } = await supabase.from('experience').select('id').limit(1);
    if (!data || data.length === 0) {
      await supabase.from('experience').insert(e);
    }
  }

  console.log("Updating Home Content...");
  await supabase.from('home_content').upsert({
    id: 1,
    name: 'Nabil Azmal Sajid',
    tagline: 'Creative Director · Editor · Cinematographer',
    about_text: '["Passionate about telling stories through visual media. I specialize in cinematic videography, creative editing, and striking photography that captures the essence of the moment."]',
    about_skills: '["Premiere Pro", "After Effects", "DaVinci Resolve"]',
    hero_image_desktop_url: '/photo-1.jpg',
    hero_image_mobile_url: '/photo-2.jpg',
    projects_completed: '50+',
    happy_clients: '30+',
    years_experience: '5+',
    views_generated: '1M+'
  });

  console.log("Seed complete!");
}

seed().catch(console.error);
