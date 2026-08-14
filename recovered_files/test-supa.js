import postgres from 'postgres';

const sql = postgres('postgresql://postgres:s%2F%2F94.supabase@db.jtlhwaajrxghblrknozs.supabase.co:5432/postgres', { ssl: 'require' });

async function test() {
  try {
    const res = await sql`SELECT NOW()`;
    console.log("Connected!", res);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

test();