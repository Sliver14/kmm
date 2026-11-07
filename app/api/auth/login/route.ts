import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    let user: any = null

    // 1. Try querying Neon Postgres database
    try {
      const users = await sql`
        SELECT id, name, email, role, role_label as "roleLabel", agency, unit, 
               ministry_id as "ministryId", initials, avatar, password_hash, created_at
        FROM users
        WHERE LOWER(email) = ${normalizedEmail}
        LIMIT 1
      `
      if (users && users.length > 0) {
        user = users[0]
      }
    } catch (dbErr) {
      console.warn('Database lookup offline or skipped:', dbErr)
    }

    // 2. Check fallback registered user with hashed password (from secure client store)
    if (!user && body.fallbackUser && body.fallbackUser.password_hash) {
      if (body.fallbackUser.email?.toLowerCase().trim() === normalizedEmail) {
        user = {
          ...body.fallbackUser,
          role: body.fallbackUser.role || (normalizedEmail.includes('admin') ? 'admin' : 'reviewer'),
          roleLabel: body.fallbackUser.roleLabel || body.fallbackUser.role || 'Officer',
        }
      }
    }

    if (!user || !user.password_hash) {
      return NextResponse.json(
        { error: 'Invalid credentials. Account not found. Please register first.' },
        { status: 401 }
      )
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials. Password incorrect.' },
        { status: 401 }
      )
    }

    // Sign JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      agency: user.agency,
      ministryId: user.ministryId || 'min-kmm',
    })

    // Fetch user ministry
    let ministry: any = { id: 'min-kmm', name: 'Kiddies Media Ministry', code: 'KMM' }
    try {
      const ministries = await sql`
        SELECT id, name, code, status FROM ministries WHERE id = ${user.ministryId || 'min-kmm'} LIMIT 1
      `
      if (ministries && ministries.length > 0) {
        ministry = ministries[0]
      }
    } catch {
      // offline fallback
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token,
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
        ministryId: user.ministryId || 'min-kmm',
        ministryName: ministry.name,
        ministryCode: ministry.code,
      },
    })

    // Set secure HTTP-only cookie
    response.cookies.set('kmm_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error)
    return NextResponse.json(
      { error: error?.message || 'Authentication failed' },
      { status: 500 }
    )
  }
}
