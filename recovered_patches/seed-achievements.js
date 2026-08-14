import postgres from 'postgres';

const sql = postgres('postgresql://postgres.jtlhwaajrxghblrknozs:s%2F%2F94.supabase@aws-0-us-east-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function seed() {
  try {
    console.log("Creating table...");
    await sql`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        role TEXT,
        description TEXT,
        icon TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;

    console.log("Disabling RLS...");
    await sql`ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;`;
    
    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

seed();