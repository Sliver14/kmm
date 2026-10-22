import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'
    const agency = searchParams.get('agency')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('q')

    let rows
    if (search) {
      const term = `%${search.toLowerCase()}%`
      rows = await sql`
        SELECT 
          id, ministry_id as "ministryId", name, type, category, 
          category_group as "categoryGroup", subcategory, agency, unit,
          creator_name as "creatorName", creator_role as "creatorRole",
          creator_skill as "creatorSkill", contributors, status, 
          created_date as "createdDate", created_time as "createdTime",
          thumb_type as "thumbType", poster_url as "posterUrl",
          rights_holder as "rightsHolder", description, tags, attributes,
          archive_status as "archiveStatus", created_at as "createdAt", updated_at as "updatedAt"
        FROM assets
        WHERE ministry_id = ${ministryId}
          AND (LOWER(name) LIKE ${term} OR LOWER(id) LIKE ${term} OR LOWER(description) LIKE ${term})
        ORDER BY created_at DESC
      `
    } else {
      rows = await sql`
        SELECT 
          id, ministry_id as "ministryId", name, type, category, 
          category_group as "categoryGroup", subcategory, agency, unit,
          creator_name as "creatorName", creator_role as "creatorRole",
          creator_skill as "creatorSkill", contributors, status, 
          created_date as "createdDate", created_time as "createdTime",
          thumb_type as "thumbType", poster_url as "posterUrl",
          rights_holder as "rightsHolder", description, tags, attributes,
          archive_status as "archiveStatus", created_at as "createdAt", updated_at as "updatedAt"
        FROM assets
        WHERE ministry_id = ${ministryId}
        ORDER BY created_at DESC
      `
    }

    const assets = rows.map((r: any) => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : (typeof r.tags === 'string' ? JSON.parse(r.tags) : []),
      contributors: Array.isArray(r.contributors) ? r.contributors : (typeof r.contributors === 'string' ? JSON.parse(r.contributors) : []),
      attributes: typeof r.attributes === 'object' && r.attributes !== null ? r.attributes : (typeof r.attributes === 'string' ? JSON.parse(r.attributes) : {}),
    }))

    return NextResponse.json({ success: true, count: assets.length, assets })
  } catch (error: any) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      name,
      type = 'video',
      category = 'Animated TV Series',
      categoryGroup = 'Screen Production',
      subcategory = 'Pre-school Scriptural Series',
      agency = 'Lovetoons',
      unit = 'Lovetoons',
      creatorName = 'Lovetoons Animation Studio',
      creatorRole = 'Executive Creative Director',
      creatorSkill = 'animation',
      contributors = [],
      status = 'Draft',
      createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      thumbType = body.thumbType || null,
      posterUrl = body.posterUrl || null,
      rightsHolder = body.rightsHolder || '',
      description = '',
      tags = [],
      attributes = {},
      ministryId = 'min-kmm',
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Asset name is required' }, { status: 400 })
    }

    const assetId = id || `LT-${Date.now().toString().slice(-6)}`
    const tagsJson = JSON.stringify(tags)
    const contributorsJson = JSON.stringify(contributors)
    const attributesJson = JSON.stringify(attributes)

    await sql`
      INSERT INTO assets (
        id, ministry_id, name, type, category, category_group, subcategory,
        agency, unit, creator_name, creator_role, creator_skill, contributors,
        status, created_date, created_time, thumb_type, poster_url,
        rights_holder, description, tags, attributes, archive_status
      ) VALUES (
        ${assetId}, ${ministryId}, ${name}, ${type}, ${category}, ${categoryGroup}, ${subcategory},
        ${agency}, ${unit}, ${creatorName}, ${creatorRole}, ${creatorSkill}, ${contributorsJson}::jsonb,
        ${status}, ${createdDate}, ${createdTime}, ${thumbType}, ${posterUrl},
        ${rightsHolder}, ${description}, ${tagsJson}::jsonb, ${attributesJson}::jsonb, 'pending_cloud_storage'
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        category = EXCLUDED.category,
        category_group = EXCLUDED.category_group,
        subcategory = EXCLUDED.subcategory,
        agency = EXCLUDED.agency,
        unit = EXCLUDED.unit,
        status = EXCLUDED.status,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        attributes = EXCLUDED.attributes,
        poster_url = EXCLUDED.poster_url,
        updated_at = CURRENT_TIMESTAMP
    `

    // Seed unconfigured rights record for representative to configure subsequently
    await sql`
      INSERT INTO rights_records (
        id, ministry_id, asset_id, name, rights_type, territory,
        validity, exclusivity, licence_type, royalty_terms, status, governance_score, documents, governance_checks
      ) VALUES (
        ${`rr-${assetId}`}, ${ministryId}, ${assetId}, ${name},
        NULL, NULL, NULL, NULL, NULL, NULL, 'Pending Review', 0,
        '[]'::jsonb,
        '{}'::jsonb
      )
      ON CONFLICT (id) DO NOTHING
    `

    return NextResponse.json({
      success: true,
      message: 'Asset registered in database with blank legal docs. Awaiting document upload before approval request can be scheduled.',
      assetId,
    })
  } catch (error: any) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create asset' }, { status: 500 })
  }
}
