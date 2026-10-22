import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'

    const rows = await sql`
      SELECT 
        id, ministry_id as "ministryId", source_id as "sourceId", source_asset as "sourceAsset",
        source_icon_type as "sourceIconType", target_id as "targetId", target_asset as "targetAsset",
        target_icon_type as "targetIconType", relationship_type as "relationshipType",
        details, category, created_at as "createdAt"
      FROM relationships
      WHERE ministry_id = ${ministryId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ success: true, count: rows.length, relationships: rows })
  } catch (error: any) {
    console.error('Error fetching relationships:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch relationships' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      sourceId,
      sourceAsset,
      sourceIconType = 'tv_series',
      targetId,
      targetAsset,
      targetIconType = 'tv_series',
      relationshipType = 'Used In',
      details = '',
      category = 'General',
      ministryId = 'min-kmm',
    } = body

    if (!sourceId || !targetId || !sourceAsset || !targetAsset) {
      return NextResponse.json(
        { error: 'Source and target asset information are required' },
        { status: 400 }
      )
    }

    const id = `rel-${Date.now().toString().slice(-6)}`

    await sql`
      INSERT INTO relationships (
        id, ministry_id, source_id, source_asset, source_icon_type,
        target_id, target_asset, target_icon_type, relationship_type,
        details, category
      ) VALUES (
        ${id}, ${ministryId}, ${sourceId}, ${sourceAsset}, ${sourceIconType},
        ${targetId}, ${targetAsset}, ${targetIconType}, ${relationshipType},
        ${details}, ${category}
      )
    `

    return NextResponse.json({ success: true, message: 'Relationship connected', id })
  } catch (error: any) {
    console.error('Error creating relationship:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create relationship' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Relationship ID is required' }, { status: 400 })
    }

    await sql`DELETE FROM relationships WHERE id = ${id}`
    return NextResponse.json({ success: true, message: 'Relationship removed' })
  } catch (error: any) {
    console.error('Error deleting relationship:', error)
    return NextResponse.json({ error: error?.message || 'Failed to delete relationship' }, { status: 500 })
  }
}
