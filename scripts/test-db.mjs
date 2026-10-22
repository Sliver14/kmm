import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/DATABASE_URL="?([^"\n\r]+)"?/);
const dbUrl = match ? match[1] : null;

if (!dbUrl) {
  console.error('No DATABASE_URL found in .env');
  process.exit(1);
}

const sql = neon(dbUrl);

try {
  const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version()`;
  console.log('Successfully connected to Neon DB!');
  console.log('Database:', result[0].db_name);
  console.log('Server Time:', result[0].current_time);
} catch (err) {
  console.error('Error connecting to Neon DB:', err);
  process.exit(1);
}
