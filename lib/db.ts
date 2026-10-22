import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
  console.warn('DATABASE_URL or POSTGRES_URL is not defined in environment variables')
}

// Neon serverless SQL client
export const sql = neon(databaseUrl || '')
