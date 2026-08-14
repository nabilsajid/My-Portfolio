import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jtlhwaajrxghblrknozs.supabase.co', 'sb_publishable_F-u7YDShNivnuHhK9nwsHA_TgqtGrLY');

async function test() {
  const { data, error } = await supabase.from('projects').select('*').eq('category', 'photography');
  if (error) console.error(error);
  else console.log(data);
}
test();