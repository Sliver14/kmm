import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const ministries = await sql`
      SELECT id, name, code, description, status, created_at as "createdAt"
      FROM ministries
      ORDER BY name ASC
    `

    const agencies = await sql`
      SELECT id, ministry_id as "ministryId", name, unit, code, description, created_at as "createdAt"
      FROM agencies
      ORDER BY name ASC
    `

    return NextResponse.json({
      success: true,
      ministries,
      agencies,
    })
  } catch (error: any) {
    console.error('Error in /api/ministries:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch ministries' }, { status: 500 })
  }
}

// Support creating new ministries in the multi-ministry architecture
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, code, description = '' } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'Ministry name and code are required' }, { status: 400 })
    }

    const id = `min-${code.toLowerCase().trim()}`

    await sql`
      INSERT INTO ministries (id, name, code, description, status)
      VALUES (${id}, ${name}, ${code.toUpperCase()}, ${description}, 'active')
      ON CONFLICT (id) DO NOTHING
    `

    return NextResponse.json({
      success: true,
      message: `Ministry ${name} registered in architecture structure.`,
      ministryId: id,
    })
  } catch (error: any) {
    console.error('Error creating ministry:', error)
    return NextResponse.json({ error: error?.message || 'Failed to onboard ministry' }, { status: 500 })
  }
}
