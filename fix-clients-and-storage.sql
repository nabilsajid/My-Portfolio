-- 1. Disable RLS for client_logos table (to match your other tables for Demo Mode)
ALTER TABLE public.client_logos DISABLE ROW LEVEL SECURITY;

-- 2. Allow public uploads to the portfolio-media bucket
CREATE POLICY "Allow public uploads" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Allow public update" 
ON storage.objects 
FOR UPDATE 
TO public 
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Allow public delete" 
ON storage.objects 
FOR DELETE 
TO public 
USING (bucket_id = 'portfolio-media');
