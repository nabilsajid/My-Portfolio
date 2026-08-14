-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    details TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
ON public.skills FOR SELECT
USING (true);

-- Allow authenticated users (admin) to insert/update/delete
CREATE POLICY "Users can insert their own skills."
ON public.skills FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own skills."
ON public.skills FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own skills."
ON public.skills FOR DELETE
USING (auth.role() = 'authenticated');

-- 4. Insert initial data (only if table is empty to prevent duplicates on re-runs)
INSERT INTO public.skills (name, level, details, order_index)
SELECT * FROM (
    VALUES
    ('Adobe Premiere Pro', 90, 'Advanced video editing, color grading, and multi-cam workflows.', 0),
    ('Adobe After Effects', 85, 'Motion graphics, visual effects, and compositing.', 1),
    ('Adobe Photoshop', 95, 'Advanced photo retouching, compositing, and graphic design.', 2),
    ('Adobe Lightroom', 90, 'Color correction, batch processing, and photo enhancement.', 3),
    ('Cinematography', 85, 'Camera operation, lighting setups, and visual storytelling.', 4)
) AS v(name, level, details, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.skills);
