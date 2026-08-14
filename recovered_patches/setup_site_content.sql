-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    hero_image_desktop TEXT,
    hero_image_mobile TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
ON public.site_content FOR SELECT
USING (true);

-- Allow authenticated users (admin) to insert/update/delete
CREATE POLICY "Users can insert their own site content."
ON public.site_content FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own site content."
ON public.site_content FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own site content."
ON public.site_content FOR DELETE
USING (auth.role() = 'authenticated');

-- 4. Insert initial data (only if table is empty)
INSERT INTO public.site_content (id, title, tagline, description, hero_image_desktop, hero_image_mobile)
SELECT 'hero', 'Nabil Azmal Sajid', 'Creative Director · Editor · Cinematographer · Photographer', 'Passionate about telling stories through visual media. I specialize in cinematic videography, creative editing, and striking photography that captures the essence of the moment.', '', ''
WHERE NOT EXISTS (SELECT 1 FROM public.site_content WHERE id = 'hero');