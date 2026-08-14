import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jtlhwaajrxghblrknozs.supabase.co', 'sb_publishable_F-u7YDShNivnuHhK9nwsHA_TgqtGrLY');

async function test() {
  const { data, error } = await supabase.from('projects').insert([{ title: 'Test', category: 'photography', image_url: '/src/assets/photo-1.jpg', label: 'Test' }]).select();
  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Inserted:', data);
    await supabase.from('projects').delete().eq('id', data[0].id);
  }
}
test();