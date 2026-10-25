import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { AssetContributor, Agency, UserSkill } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const rows = await sql`
      SELECT id, name, contributors, agency, unit
      FROM assets
      WHERE id = ${id}
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const asset = rows[0]
    let contributors: AssetContributor[] = []
    try {
      if (Array.isArray(asset.contributors)) {
        contributors = asset.contributors
      } else if (typeof asset.contributors === 'string') {
        contributors = JSON.parse(asset.contributors)
      }
    } catch {
      contributors = []
    }

    return NextResponse.json({
      success: true,
      assetId: id,
      assetName: asset.name,
      contributors,
    })
  } catch (error: any) {
    console.error('Error fetching asset contributors:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch contributors' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const {
      name,
      role,
      agency,
      email,
      contributionType = 'Core Creative',
      skills = [],
      joinedDate,
    }: {
      name: string
      role: string
      agency?: Agency
      email?: string
      contributionType?: AssetContributor['contributionType']
      skills?: UserSkill[]
      joinedDate?: string
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Contributor name is required' }, { status: 400 })
    }

    if (!role || !role.trim()) {
      return NextResponse.json({ error: 'Contributor role is required' }, { status: 400 })
    }

    // Fetch existing asset
    const existing = await sql`
      SELECT id, name, contributors, agency, unit
      FROM assets
      WHERE id = ${id}
      LIMIT 1
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const asset = existing[0]
    let currentContributors: AssetContributor[] = []
    try {
      if (Array.isArray(asset.contributors)) {
        currentContributors = asset.contributors
      } else if (typeof asset.contributors === 'string') {
        currentContributors = JSON.parse(asset.contributors)
      }
    } catch {
      currentContributors = []
    }

    const assignedAgency = agency || asset.agency || asset.unit || 'Lovetoons'
    const newContributor: AssetContributor = {
      id: body.id || `contrib-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      role: role.trim(),
      agency: assignedAgency,
      email: email?.trim() || undefined,
      contributionType,
      skills: Array.isArray(skills) ? skills : [],
      joinedDate: joinedDate || new Date().toISOString().split('T')[0],
    }

    // Append without duplicating by ID
    const updatedContributors = [
      ...currentContributors.filter((c) => c.id !== newContributor.id),
      newContributor,
    ]

    const contributorsJson = JSON.stringify(updatedContributors)

    await sql`
      UPDATE assets
      SET 
        contributors = ${contributorsJson}::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: `Contributor "${newContributor.name}" added successfully.`,
      contributor: newContributor,
      contributors: updatedContributors,
    })
  } catch (error: any) {
    console.error('Error adding contributor to asset:', error)
    return NextResponse.json({ error: error?.message || 'Failed to add contributor' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const contributorId = searchParams.get('contributorId')

    if (!contributorId) {
      return NextResponse.json({ error: 'contributorId query parameter is required' }, { status: 400 })
    }

    const existing = await sql`
      SELECT id, name, contributors
      FROM assets
      WHERE id = ${id}
      LIMIT 1
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const asset = existing[0]
    let currentContributors: AssetContributor[] = []
    try {
      if (Array.isArray(asset.contributors)) {
        currentContributors = asset.contributors
      } else if (typeof asset.contributors === 'string') {
        currentContributors = JSON.parse(asset.contributors)
      }
    } catch {
      currentContributors = []
    }

    const updatedContributors = currentContributors.filter((c) => c.id !== contributorId)
    const contributorsJson = JSON.stringify(updatedContributors)

    await sql`
      UPDATE assets
      SET 
        contributors = ${contributorsJson}::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: 'Contributor removed successfully',
      contributors: updatedContributors,
    })
  } catch (error: any) {
    console.error('Error removing contributor from asset:', error)
    return NextResponse.json({ error: error?.message || 'Failed to remove contributor' }, { status: 500 })
  }
}
