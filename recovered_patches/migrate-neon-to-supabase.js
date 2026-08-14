import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const neonSql = postgres('postgresql://neondb_owner:npg_seudYjy94BwH@ep-soft-sound-atlt8mur.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require');
const supabase = createClient('https://jtlhwaajrxghblrknozs.supabase.co', 'sb_publishable_F-u7YDShNivnuHhK9nwsHA_TgqtGrLY');

async function migrate() {
  const tables = ['projects', 'skills', 'experience', 'home_content', 'faqs', 'pricing_packets'];
  
  for (const table of tables) {
    try {
      const rows = await neonSql`SELECT * FROM ${neonSql(table)}`;
      if (rows.length === 0) continue;
      
      // Remove created_at to avoid schema cache errors
      for (const row of rows) {
        delete row.created_at;
      }
      
      // Delete existing data in Supabase first
      if (table === 'pricing_packets') {
         await supabase.from(table).delete().neq('id', 'dummy'); 
      } else {
         await supabase.from(table).delete().neq('id', -1);
      }
      
      // Insert into Supabase
      const { data, error } = await supabase.from(table).insert(rows);
      if (error) {
        console.error(`Error inserting into ${table}:`, error.message);
      } else {
        console.log(`Successfully migrated ${rows.length} rows for ${table} to Supabase`);
      }
    } catch (err) {
      console.error(`Failed to migrate ${table}:`, err);
    }
  }
  process.exit(0);
}

migrate();