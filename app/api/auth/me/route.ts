import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    let token = req.cookies.get('kmm_session')?.value
    if (!token) {
      const authHeader = req.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 })
    }

    const users = await sql`
      SELECT u.id, u.name, u.email, u.role, u.role_label as "roleLabel", u.agency, u.unit,
             u.ministry_id as "ministryId", u.initials, u.avatar,
             m.name as ministry_name, m.code as ministry_code
      FROM users u
      LEFT JOIN ministries m ON u.ministry_id = m.id
      WHERE u.id = ${payload.userId}
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 })
    }

    const user = users[0]
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleLabel: user.roleLabel,
        agency: user.agency,
        unit: user.unit,
        initials: user.initials,
        avatar: user.avatar,
        ministryId: user.ministryId,
        ministryName: user.ministry_name || 'Kiddies Media Ministry',
        ministryCode: user.ministry_code || 'KMM',
      },
    })
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error)
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 })
  }
}
