import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jtlhwaajrxghblrknozs.supabase.co', 'sb_publishable_F-u7YDShNivnuHhK9nwsHA_TgqtGrLY');

async function test() {
  const { data, error } = await supabase.from('projects').select('category, title');
  if (error) console.error(error);
  else {
    const counts = {};
    for (const row of data) {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }
    console.log(counts);
  }
}
test();