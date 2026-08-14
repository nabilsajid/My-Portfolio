-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    end_value INTEGER NOT NULL,
    suffix TEXT,
    label TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
ON public.stats FOR SELECT
USING (true);

-- Allow authenticated users (admin) to insert/update/delete
CREATE POLICY "Users can insert their own stats."
ON public.stats FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own stats."
ON public.stats FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own stats."
ON public.stats FOR DELETE
USING (auth.role() = 'authenticated');

-- 4. Insert initial data (only if table is empty to prevent duplicates)
INSERT INTO public.stats (end_value, suffix, label, order_index)
SELECT * FROM (
    VALUES
    (80, '+', 'Projects Completed', 0),
    (30, '+', 'Happy Clients', 1),
    (3, '+', 'Years Experience', 2),
    (5, 'M+', 'Views Generated', 3)
) AS v(end_value, suffix, label, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.stats);