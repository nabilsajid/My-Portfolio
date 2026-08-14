-- Add gallery_images column to projects table
-- We use TEXT[] (array of strings) to hold multiple image URLs
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';