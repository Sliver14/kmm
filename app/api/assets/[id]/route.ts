import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await sql`
      SELECT 
        id, name, ministry_id as "ministryId", agency, category, subcategory, 
        status, registration_date as "registrationDate", version, tags, 
        description, thumb_type as "thumbType", poster_url as "posterUrl",
        media_type as "mediaType", created_at as "createdAt", updated_at as "updatedAt"
      FROM assets
      WHERE id = ${id}
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const asset = rows[0]
    return NextResponse.json({
      success: true,
      asset: {
        ...asset,
        tags: Array.isArray(asset.tags) ? asset.tags : typeof asset.tags === 'string' ? JSON.parse(asset.tags) : [],
      },
    })
  } catch (error: any) {
    console.error('Error fetching asset by id:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch asset' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      name,
      status,
      agency,
      category,
      subcategory,
      version,
      description,
      tags,
      posterUrl,
      attributes,
      contributors,
      rightsHolder,
    } = body

    const existing = await sql`SELECT id FROM assets WHERE id = ${id} LIMIT 1`
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const tagsJson = tags !== undefined ? JSON.stringify(tags) : null
    const attributesJson = attributes !== undefined ? JSON.stringify(attributes) : null
    const contributorsJson = contributors !== undefined ? JSON.stringify(contributors) : null

    await sql`
      UPDATE assets
      SET 
        name = COALESCE(${name ?? null}, name),
        status = COALESCE(${status ?? null}, status),
        agency = COALESCE(${agency ?? null}, agency),
        unit = COALESCE(${agency ?? null}, unit),
        category = COALESCE(${category ?? null}, category),
        subcategory = COALESCE(${subcategory ?? null}, subcategory),
        version = COALESCE(${version ?? null}, version),
        description = COALESCE(${description ?? null}, description),
        poster_url = COALESCE(${posterUrl ?? null}, poster_url),
        rights_holder = COALESCE(${rightsHolder ?? null}, rights_holder),
        tags = CASE WHEN ${tagsJson} IS NOT NULL THEN ${tagsJson}::jsonb ELSE tags END,
        attributes = CASE WHEN ${attributesJson} IS NOT NULL THEN ${attributesJson}::jsonb ELSE attributes END,
        contributors = CASE WHEN ${contributorsJson} IS NOT NULL THEN ${contributorsJson}::jsonb ELSE contributors END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true, message: 'Asset updated successfully' })
  } catch (error: any) {
    console.error('Error updating asset:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update asset' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Delete dependent records first to satisfy FK constraints
    await sql`DELETE FROM approvals WHERE asset_id = ${id}`
    await sql`DELETE FROM rights_records WHERE asset_id = ${id}`
    await sql`DELETE FROM relationships WHERE source_id = ${id} OR target_id = ${id}`
    await sql`DELETE FROM asset_files WHERE asset_id = ${id}`
    await sql`DELETE FROM assets WHERE id = ${id}`
    return NextResponse.json({ success: true, message: 'Asset deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    return NextResponse.json({ error: error?.message || 'Failed to delete asset' }, { status: 500 })
  }
}
