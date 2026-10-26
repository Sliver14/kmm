import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function check() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT * FROM agencies`;
  console.log('Agencies table in DB:', rows);
}

check().catch(console.error);
