import postgres from 'postgres';

const sql = postgres('postgresql://postgres.jtlhwaajrxghblrknozs:s%2F%2F94.supabase@aws-0-us-west-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function fixSequences() {
  const tables = ['projects', 'skills', 'experience', 'home_content', 'faqs'];
  
  for (const table of tables) {
    try {
      const res = await sql`
        SELECT setval(
          pg_get_serial_sequence(${table}, 'id'),
          COALESCE((SELECT MAX(id) FROM ${sql(table)}), 0) + 1,
          false
        );
      `;
      console.log(`Sequence for ${table} updated.`);
    } catch (err) {
      console.error(`Failed for ${table}:`, err.message);
    }
  }
  process.exit(0);
}
fixSequences();