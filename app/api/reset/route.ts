import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { attorneyGeneralAssetsData } from '@/lib/data/scheduleAssets'

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Performing Clean Database Reset with Attorney-General Schedule (125 assets)...')

    // 1. Truncate test records in Neon DB
    await sql`DELETE FROM asset_files;`
    await sql`DELETE FROM relationships;`
    await sql`DELETE FROM approvals;`
    await sql`DELETE FROM rights_records;`
    await sql`DELETE FROM assets;`

    // 2. Insert all 125 Schedule Assets in parallel batches for high performance
    const BATCH_SIZE = 15
    for (let i = 0; i < attorneyGeneralAssetsData.length; i += BATCH_SIZE) {
      const batch = attorneyGeneralAssetsData.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (a) => {
          const tagsJson = JSON.stringify(a.tags)
          const contributorsJson = JSON.stringify(a.contributors)
          const attributesJson = JSON.stringify(a.attributes)

          await sql`
            INSERT INTO assets (
              id, ministry_id, name, type, category, category_group, subcategory,
              agency, unit, creator_name, creator_role, creator_skill, contributors,
              status, created_date, created_time, thumb_type, poster_url, rights_holder,
              description, tags, attributes, archive_status
            ) VALUES (
              ${a.id}, 'min-kmm', ${a.name}, ${a.type}, ${a.category}, ${a.categoryGroup}, ${a.subcategory},
              ${a.agency}, ${a.unit || a.agency}, ${a.creatorName || ''}, ${a.creatorRole || ''},
              ${a.creatorSkill || null}, ${contributorsJson}::jsonb,
              ${a.status}, ${a.createdDate}, ${a.createdTime}, ${a.thumbType || 'tv_series'},
              ${a.posterUrl || '/kmm-logo.png'}, ${a.rightsHolder},
              ${a.description}, ${tagsJson}::jsonb, ${attributesJson}::jsonb, 'active_production'
            )
          `

          // Seed companion rights record without contributors or documents
          const rightsStatus = a.status === 'In Production' ? 'Cleared' : (a.status === 'Yet to Launch' ? 'Pending Review' : 'Review')
          const score = a.status === 'In Production' ? 100 : (a.status === 'Yet to Launch' ? 50 : 30)

          await sql`
            INSERT INTO rights_records (
              id, ministry_id, asset_id, name, rights_type, territory,
              validity, exclusivity, status, governance_score, documents, governance_checks
            ) VALUES (
              ${`RG-${a.id}`}, 'min-kmm', ${a.id}, ${a.name},
              '', '', '',
              '', 'Pending', 0,
              '[]'::jsonb,
              '{}'::jsonb
            )
          `
        })
      )
    }

    console.log(`✅ Clean database reset completed: ${attorneyGeneralAssetsData.length} schedule assets seeded!`)

    return NextResponse.json({
      success: true,
      message: 'Database reset successfully to Attorney-General Official Intellectual Asset Schedule.',
      seededCount: attorneyGeneralAssetsData.length,
      assets: attorneyGeneralAssetsData,
    })
  } catch (error: any) {
    console.error('Error during database reset:', error)
    return NextResponse.json({ error: error?.message || 'Database reset failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
