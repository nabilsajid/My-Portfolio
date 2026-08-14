INSERT INTO public.pricing_packets (id, name, tagline, base_price, base_videos, base_reels, video_max_min, video_style, reel_style, extra_video_price, extra_reel_price, extra_minute_price, max_reels, exclusive, best_for, reference_url, featured, delivery, sort_order)
VALUES 
('starter', 'Starter', 'For standard edits', 3500, 1, 0, 3, '["Standard editing", "Color grading", "Copyright free music"]', 'Basic social media edit', 3000, 3000, 1000, 0, false, 'Small businesses & personal brands', 'https://youtube.com', false, '3 working days', 1),
('promotional', 'Promotional', 'For serious content', 8000, 1, 2, 8, '["Semi advance editing", "Copyright free music", "Motion graphics", "Sound design", "Color grading"]', 'high quality reel', 5000, 2000, 3000, 0, false, 'Brands & serious creators', 'https://youtube.com', true, '7 working days', 2),
('podcast', 'Master Cut', 'For standard podcasts', 7000, 1, 0, 60, '["25-30s intro", "Motion graphics", "Sound design", "Color correction"]', 'high quality reel', 8000, 2000, 0, 0, false, 'Podcasters & interviewers', 'https://youtube.com', false, '8 working days', 3),
('fullhouse', 'Full House', 'Total production', null, 1, 0, 3, '["Custom production"]', '', 0, 0, 0, 0, false, 'Agencies & large campaigns', 'https://youtube.com', false, 'Custom timeline', 4)
ON CONFLICT (id) DO NOTHING;
