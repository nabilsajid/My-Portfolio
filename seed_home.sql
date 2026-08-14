INSERT INTO public.home_content (id, name, tagline, about_text, about_skills, hero_image_desktop_url, hero_image_mobile_url, projects_completed, happy_clients, years_experience, views_generated)
VALUES (
  1, 
  'Nabil Azmal Sajid', 
  'Creative Director · Editor · Cinematographer', 
  '["I''m a multi-disciplinary creative professional with a passion for visual storytelling. With years of experience across video editing and photography, I bring a unique perspective to every project.", "My work spans from cinematic long-form content to scroll-stopping short-form edits, paired with photography that captures the moment. Every frame, every pixel, every cut is intentional.", "I believe great visuals don''t just look good — they communicate, persuade, and inspire action."]', 
  '["Premiere Pro", "After Effects", "Photoshop", "Lightroom", "DaVinci Resolve"]', 
  '/clients/photo-1.jpg', 
  '/clients/photo-2.jpg', 
  80, 
  30, 
  3, 
  5
)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  about_text = EXCLUDED.about_text,
  about_skills = EXCLUDED.about_skills,
  hero_image_desktop_url = EXCLUDED.hero_image_desktop_url,
  hero_image_mobile_url = EXCLUDED.hero_image_mobile_url,
  projects_completed = EXCLUDED.projects_completed,
  happy_clients = EXCLUDED.happy_clients,
  years_experience = EXCLUDED.years_experience,
  views_generated = EXCLUDED.views_generated;
