-- Ensure the video_url column exists
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Completely disable Row Level Security on the projects table
-- This allows the admin dashboard to update the projects without authentication blocks
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- If RLS must be enabled for some reason, ensure these policies exist:
DROP POLICY IF EXISTS "Enable update for all" ON public.projects;
CREATE POLICY "Enable update for all" ON public.projects FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for all" ON public.projects;
CREATE POLICY "Enable insert for all" ON public.projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for all" ON public.projects;
CREATE POLICY "Enable delete for all" ON public.projects FOR DELETE USING (true);
