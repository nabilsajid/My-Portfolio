import postgres from 'postgres';
const neonSql = postgres('postgresql://neondb_owner:npg_seudYjy94BwH@ep-soft-sound-atlt8mur.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require');
async function test() {
  const rows = await neonSql`SELECT * FROM projects LIMIT 1`;
  console.log(rows[0]);
  process.exit(0);
}
test();