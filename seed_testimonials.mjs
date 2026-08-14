import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kerxkunmielphunanhmz.supabase.co',
  'sb_publishable_cwhmlJ6XRJNrG36vJZ_oJw_7chuMixI'
);

const demoImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
];

async function seed() {
  const records = demoImages.map(url => ({ image_url: url }));
  
  const { data, error } = await supabase
    .from('testimonials')
    .insert(records);
    
  if (error) {
    console.error("Failed to seed:", error);
  } else {
    console.log("Successfully seeded demo testimonials!");
  }
}

seed();
