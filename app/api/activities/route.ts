import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'

    const rows = await sql`
      SELECT 
        id, 
        title, 
        subtitle, 
        time, 
        user_name as "user", 
        agency, 
        unit, 
        type, 
        color, 
        icon_type as "iconType", 
        timestamp,
        created_at as "createdAt"
      FROM activities
      WHERE ministry_id = ${ministryId}
      ORDER BY created_at DESC
      LIMIT 100
    `

    return NextResponse.json({
      success: true,
      count: rows.length,
      activities: rows,
    })
  } catch (error: any) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      subtitle = '',
      time = 'Just now',
      user = 'Super Admin',
      agency = 'Lovetoons',
      unit = 'Lovetoons',
      type = 'file',
      color = 'bg-blue-100 text-blue-700',
      iconType = 'file',
      timestamp = Date.now(),
      ministryId = 'min-kmm',
    } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Activity title is required' }, { status: 400 })
    }

    const id = `act-${Date.now().toString().slice(-6)}`

    await sql`
      INSERT INTO activities (
        id, ministry_id, title, subtitle, time,
        user_name, agency, unit, type, color, icon_type, timestamp
      ) VALUES (
        ${id}, ${ministryId}, ${title}, ${subtitle}, ${time},
        ${user}, ${agency}, ${unit}, ${type}, ${color}, ${iconType}, ${timestamp}
      )
    `

    return NextResponse.json({ success: true, message: 'Activity logged', id })
  } catch (error: any) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create activity' }, { status: 500 })
  }
}
