import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kerxkunmielphunanhmz.supabase.co',
  'sb_publishable_cwhmlJ6XRJNrG36vJZ_oJw_7chuMixI'
);

async function check() {
  const { data, error } = await supabase.from('client_logos').insert([
    { name: 'Test', image_url: 'https://test.com/img.png' }
  ]);
  console.log("Insert Error:", error);

  // Try to list buckets
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets?.map(b => b.name));
  console.log("Bucket Error:", bucketError);
}

check();
