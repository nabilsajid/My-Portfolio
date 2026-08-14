import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kerxkunmielphunanhmz.supabase.co',
  'sb_publishable_cwhmlJ6XRJNrG36vJZ_oJw_7chuMixI'
);

async function test() {
  const { data, error } = await supabase.from('projects').select('*');
  console.log("Error:", error);
  console.log("Data count:", data?.length);
}

test();
