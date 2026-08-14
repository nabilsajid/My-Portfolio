-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.client_logos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access for client logos" 
ON public.client_logos 
FOR SELECT 
USING (true);

-- Allow authenticated admins to insert/update/delete
CREATE POLICY "Allow authenticated users to insert client logos" 
ON public.client_logos 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update client logos" 
ON public.client_logos 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete client logos" 
ON public.client_logos 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. (Optional) Seed some initial data so the page isn't empty
INSERT INTO public.client_logos (name, image_url, order_index)
VALUES 
('Zenetic Esports', '/clients/zenetic-typeface.png', 1),
('BYD', '/clients/byd.png', 2),
('Globe', '/clients/globe.png', 3),
('East West University', '/clients/ewu.png', 4),
('Artboard', '/clients/artboard-new.png', 5);