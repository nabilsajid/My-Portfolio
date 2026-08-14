import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jtlhwaajrxghblrknozs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

async function test() {
  const { data, error } = await supabase.from('skills').select('*').limit(1);
  console.log("Skills:", data, error);
}
test();