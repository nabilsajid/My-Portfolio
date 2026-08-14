-- Add showreel_url column to site_content table
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS showreel_url TEXT;