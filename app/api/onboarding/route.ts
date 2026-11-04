import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { initialOnboardingRequests } from '@/lib/data/initialData'
import type { MinistryOnboardingRequest, OnboardingStatus } from '@/types'

// In-memory fallback if Neon Postgres is offline or unreachable
let memoryRequests: MinistryOnboardingRequest[] = [...initialOnboardingRequests]

async function ensureTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ministry_onboarding_requests (
        id TEXT PRIMARY KEY,
        ministry_name TEXT NOT NULL,
        department_name TEXT,
        contact_person TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        zone_region TEXT,
        category_interest TEXT,
        estimated_assets_count TEXT,
        intended_usage TEXT,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        reviewed_by TEXT
      );
    `
  } catch (err) {
    console.warn('Neon DB table ensureTableExists warning (using fallback memory cache):', err)
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureTableExists()

    const rows = await sql`
      SELECT 
        id,
        ministry_name as "ministryName",
        department_name as "departmentName",
        contact_person as "contactPerson",
        email,
        phone,
        zone_region as "zoneRegion",
        category_interest as "categoryInterest",
        estimated_assets_count as "estimatedAssetsCount",
        intended_usage as "intendedUsage",
        notes,
        status,
        admin_notes as "adminNotes",
        submitted_at as "submittedAt",
        reviewed_at as "reviewedAt",
        reviewed_by as "reviewedBy"
      FROM ministry_onboarding_requests
      ORDER BY submitted_at DESC
    `

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({
        success: true,
        count: rows.length,
        requests: rows,
        source: 'database',
      })
    }

    // If database table is empty, seed or return memory cache
    return NextResponse.json({
      success: true,
      count: memoryRequests.length,
      requests: memoryRequests,
      source: 'memory',
    })
  } catch (error: any) {
    console.warn('GET /api/onboarding error, falling back to memoryRequests:', error?.message)
    return NextResponse.json({
      success: true,
      count: memoryRequests.length,
      requests: memoryRequests,
      source: 'fallback',
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      ministryName,
      departmentName = '',
      contactPerson,
      email,
      phone = '',
      zoneRegion = '',
      categoryInterest = 'General Ministry Media',
      estimatedAssetsCount = 'Preparing initial assets',
      intendedUsage = 'Asset Governance & Registration',
      notes = '',
    } = body

    if (!ministryName || !contactPerson || !email) {
      return NextResponse.json(
        { error: 'Ministry Name, Contact Person, and Email are required fields.' },
        { status: 400 }
      )
    }

    const id = `req-ob-${Date.now()}`
    const submittedAt = new Date().toISOString()
    const newRequest: MinistryOnboardingRequest = {
      id,
      ministryName: ministryName.trim(),
      departmentName: departmentName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      zoneRegion: zoneRegion.trim(),
      categoryInterest: categoryInterest.trim(),
      estimatedAssetsCount,
      intendedUsage,
      notes: notes.trim(),
      status: 'pending',
      submittedAt,
    }

    // Always update memory cache
    memoryRequests = [newRequest, ...memoryRequests]

    // Attempt to persist to Neon DB if available
    try {
      await ensureTableExists()
      await sql`
        INSERT INTO ministry_onboarding_requests (
          id, ministry_name, department_name, contact_person, email,
          phone, zone_region, category_interest, estimated_assets_count,
          intended_usage, notes, status, submitted_at
        )
        VALUES (
          ${id},
          ${newRequest.ministryName},
          ${newRequest.departmentName || null},
          ${newRequest.contactPerson},
          ${newRequest.email},
          ${newRequest.phone || null},
          ${newRequest.zoneRegion || null},
          ${newRequest.categoryInterest || null},
          ${newRequest.estimatedAssetsCount || null},
          ${newRequest.intendedUsage || null},
          ${newRequest.notes || null},
          'pending',
          ${submittedAt}
        )
        ON CONFLICT (id) DO NOTHING
      `
    } catch (dbErr) {
      console.warn('Neon DB insert warning (persisted in memory/state):', dbErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding request submitted successfully.',
      request: newRequest,
    })
  } catch (error: any) {
    console.error('Error submitting onboarding request:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to submit onboarding request' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, adminNotes, reviewedBy } = body

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const reviewedAt = new Date().toISOString()

    // Update memory cache
    memoryRequests = memoryRequests.map((r) =>
      r.id === id
        ? {
            ...r,
            ...(status ? { status: status as OnboardingStatus } : {}),
            ...(adminNotes !== undefined ? { adminNotes } : {}),
            reviewedAt,
            ...(reviewedBy ? { reviewedBy } : {}),
          }
        : r
    )

    try {
      await ensureTableExists()
      if (status && adminNotes !== undefined) {
        await sql`
          UPDATE ministry_onboarding_requests
          SET status = ${status}, admin_notes = ${adminNotes}, reviewed_at = ${reviewedAt}, reviewed_by = ${reviewedBy || null}
          WHERE id = ${id}
        `
      } else if (status) {
        await sql`
          UPDATE ministry_onboarding_requests
          SET status = ${status}, reviewed_at = ${reviewedAt}, reviewed_by = ${reviewedBy || null}
          WHERE id = ${id}
        `
      } else if (adminNotes !== undefined) {
        await sql`
          UPDATE ministry_onboarding_requests
          SET admin_notes = ${adminNotes}
          WHERE id = ${id}
        `
      }
    } catch (dbErr) {
      console.warn('Neon DB update warning:', dbErr)
    }

    const updated = memoryRequests.find((r) => r.id === id)

    return NextResponse.json({
      success: true,
      message: 'Request updated successfully',
      request: updated,
    })
  } catch (error: any) {
    console.error('Error updating onboarding request:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update request' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    memoryRequests = memoryRequests.filter((r) => r.id !== id)

    try {
      await sql`
        DELETE FROM ministry_onboarding_requests
        WHERE id = ${id}
      `
    } catch (dbErr) {
      console.warn('Neon DB delete warning:', dbErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding request removed',
      id,
    })
  } catch (error: any) {
    console.error('Error deleting onboarding request:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete request' },
      { status: 500 }
    )
  }
}

