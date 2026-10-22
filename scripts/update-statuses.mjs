import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
dotenv.config()

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
  console.error('DATABASE_URL not found')
  process.exit(1)
}

const sql = neon(databaseUrl)

async function run() {
  console.log('🔄 Setting all assets and approvals to "Pending" per governance requirement...')

  // 1. Update all assets to Pending
  await sql`
    UPDATE assets
    SET status = 'Pending', updated_at = CURRENT_TIMESTAMP
  `
  console.log('✅ All assets updated to "Pending" (None approved yet).')

  // 2. Ensure all 4 core assets have an approval record in the queue with status 'Pending'
  const assets = await sql`SELECT id, name, category, subcategory, agency, unit, creator_name, creator_role, creator_skill FROM assets`

  for (const a of assets) {
    const existing = await sql`SELECT id FROM approvals WHERE asset_id = ${a.id} LIMIT 1`
    if (existing.length === 0) {
      const appId = `APP-${Date.now().toString().slice(-4)}-${a.id.slice(-3)}`
      await sql`
        INSERT INTO approvals (
          id, asset_id, ministry_id, asset_name, category, subcategory, agency, unit,
          requester_name, requester_role, requester_skill, reviewer_name, stage,
          current_step, total_steps, status, priority, submitted_date, submitted_time,
          rights_type, territory, term, exclusivity, licence_type, royalty_terms,
          governance_score, description
        ) VALUES (
          ${appId}, ${a.id}, 'min-kmm', ${a.name}, ${a.category}, ${a.subcategory || 'Standard'},
          ${a.agency}, ${a.unit || a.agency}, ${a.creator_name || 'Creative Team'},
          ${a.creator_role || 'Creator'}, ${a.creator_skill || 'video_editor'},
          'Faith Daniel', 'Awaiting Representative Clearance & Documentation',
          1, 3, 'Pending', 'High', 'Sep 24, 2025', '10:00 AM',
          'Worldwide Master Broadcast & Educational Rights', 'Worldwide', '10 Years',
          'Exclusive Ministry Retained', 'Proprietary Broadcast License', '100% Retained',
          0, 'Initial submission awaiting representative document upload and reviewer clearance.'
        )
      `
      console.log(`✅ Created pending approval record for ${a.id}`)
    } else {
      await sql`
        UPDATE approvals
        SET 
          status = 'Pending',
          current_step = 1,
          stage = 'Awaiting Representative Clearance & Documentation',
          governance_score = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE asset_id = ${a.id}
      `
    }
  }

  // 3. Update all rights records to 'Pending Representative Review' and governance_score = 0
  await sql`
    UPDATE rights_records
    SET 
      status = 'Pending Representative Review',
      governance_score = 0,
      documents = '[]'::jsonb,
      governance_checks = '{}'::jsonb,
      updated_at = CURRENT_TIMESTAMP
  `
  console.log('✅ All rights records reset to "Pending Representative Review" with blank documents.')
  console.log('🎉 Status update completed successfully!')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
