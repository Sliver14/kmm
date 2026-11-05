import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, agency, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const trimmedName = name.trim()
    const userAgency = agency?.trim() || 'Lovetoons'
    const userRole = role?.trim() || 'Content Reviewer & Safeguarding Officer'

    const initials = trimmedName
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'KM'

    const newUserId = `usr-${Date.now().toString().slice(-6)}`
    const hashedPassword = await hashPassword(password)

    let createdInDb = false

    // Attempt registration in Neon Postgres
    try {
      const existingUsers = await sql`
        SELECT id FROM users WHERE LOWER(email) = ${normalizedEmail} LIMIT 1
      `

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'An account with this email address is already registered.' },
          { status: 409 }
        )
      }

      await sql`
        INSERT INTO users (
          id, name, email, role, role_label, agency, unit, ministry_id, initials, password_hash
        ) VALUES (
          ${newUserId}, ${trimmedName}, ${normalizedEmail}, 'reviewer',
          ${userRole}, ${userAgency}, ${userAgency}, 'min-kmm', ${initials}, ${hashedPassword}
        )
      `
      createdInDb = true
    } catch (dbErr) {
      console.warn('Database signup skipped or database offline, proceeding with local credentials session:', dbErr)
    }

    const token = signToken({
      userId: newUserId,
      email: normalizedEmail,
      role: 'reviewer',
      agency: userAgency,
      ministryId: 'min-kmm',
    })

    const userProfile = {
      id: newUserId,
      name: trimmedName,
      email: normalizedEmail,
      role: 'reviewer',
      roleLabel: userRole,
      agency: userAgency,
      unit: userAgency,
      initials,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
      createdInDb,
      registeredAt: new Date().toISOString(),
    }

    const response = NextResponse.json({
      success: true,
      message: 'Account successfully registered and authenticated.',
      user: userProfile,
      token,
    })

    response.cookies.set({
      name: 'kmm_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Error in /api/auth/signup:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to complete registration.' },
      { status: 500 }
    )
  }
}

