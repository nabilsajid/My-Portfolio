import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jtlhwaajrxghblrknozs.supabase.co', 'sb_publishable_F-u7YDShNivnuHhK9nwsHA_TgqtGrLY');

async function test() {
  const { data, error } = await supabase.from('projects').select('id').order('id', { ascending: false }).limit(5);
  console.log('Max IDs:', data);
}
test();