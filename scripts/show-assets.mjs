import { neon } from '@neondatabase/serverless'
import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
const match = envContent.match(/DATABASE_URL="?([^"\n\r]+)"?/)
const sql = neon(match[1])

async function main() {
  const rows = await sql`SELECT id, name FROM assets LIMIT 10`
  console.log(rows)
}

main().catch(console.error)
