import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { GovernancePillarKey, GovernancePillarUpdatePayload } from '@/types'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      pillar,
      payload,
      updatedBy = 'Esteemed Representative',
      notes = '',
    }: {
      pillar: GovernancePillarKey
      payload: GovernancePillarUpdatePayload
      updatedBy?: string
      notes?: string
    } = body

    if (!pillar || !payload) {
      return NextResponse.json({ error: 'Pillar key and payload are required' }, { status: 400 })
    }

    const existingRows = await sql`
      SELECT id, name, category, subcategory, agency, unit, attributes, rights_holder
      FROM assets 
      WHERE id = ${id} 
      LIMIT 1
    `

    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const asset = existingRows[0]
    let currentAttributes = {}
    try {
      currentAttributes = typeof asset.attributes === 'object' && asset.attributes !== null
        ? asset.attributes
        : (typeof asset.attributes === 'string' ? JSON.parse(asset.attributes) : {})
    } catch {
      currentAttributes = {}
    }

    // Merge pillar payload into attributes and dedicated fields
    const updatedAttributes = {
      ...currentAttributes,
      ...payload,
      lastGovernancePillarUpdated: pillar,
      governanceApprovalRequired: true,
      updatedAt: new Date().toISOString(),
    }

    const attributesJson = JSON.stringify(updatedAttributes)
    const rightsHolderUpdate = payload.owner || (payload as any).rightsHolder || asset.rights_holder

    // Update asset in database
    await sql`
      UPDATE assets
      SET 
        status = 'Pending',
        rights_holder = COALESCE(${rightsHolderUpdate ?? null}, rights_holder),
        attributes = ${attributesJson}::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // Update or insert rights_records
    const territoryUpdate = payload.territory ?? null
    const rightsTypeUpdate = payload.distributionLicense ?? null
    const statusUpdate = 'Pending Review'

    await sql`
      UPDATE rights_records
      SET
        territory = COALESCE(${territoryUpdate}, territory),
        rights_type = COALESCE(${rightsTypeUpdate}, rights_type),
        status = ${statusUpdate},
        updated_at = CURRENT_TIMESTAMP
      WHERE asset_id = ${id} OR id = ${id}
    `

    // Create or append to Approvals queue
    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const approvalId = `APP-GOV-${Date.now().toString().slice(-6)}`

    const pillarTitles: Record<GovernancePillarKey, string> = {
      legal_owner: 'Legal Ownership & Title Deed',
      trademark_license: 'Trademark & Distribution Licensing',
      territory: 'Territory Scope & International Clearance',
      production_rights: 'Authorized Production & Broadcast Rights',
      ai_provenance: 'AI Content Classification & Songwriter Provenance',
    }

    const feedbackNotes = `Governance Pillar [${pillarTitles[pillar] || pillar}] updated by ${updatedBy}. ${notes || payload.justification || 'Submitted for ministerial governance clearance.'}`

    const historyItem = {
      id: `h-gov-${Date.now()}`,
      step: 1,
      title: `Pillar Updated: ${pillarTitles[pillar] || pillar}`,
      author: updatedBy,
      date: dateStr,
      time: timeStr,
      status: 'Pending Clearance',
      feedback: feedbackNotes,
    }

    const historyJson = JSON.stringify([historyItem])

    // Try upserting approval request for this asset
    await sql`
      INSERT INTO approvals (
        id, ministry_id, asset_id, asset_name, category, subcategory,
        agency, unit, requester_name, requester_role, requester_skill,
        reviewer_name, stage, current_step, total_steps, status, priority,
        submitted_date, submitted_time, feedback_notes, history, documents,
        rights_type, territory, term, exclusivity, licence_type,
        royalty_terms, description, governance_score
      ) VALUES (
        ${approvalId}, 'min-kmm', ${id}, ${asset.name}, ${asset.category}, ${asset.subcategory || 'General'},
        ${asset.agency}, ${asset.unit || asset.agency}, ${updatedBy}, 'Governance Representative', 'admin',
        'Faith Daniel', 'Awaiting Pillar Clearance & Ministerial Verification', 1, 3, 'Pending', 'High',
        ${dateStr}, ${timeStr}, ${feedbackNotes}, ${historyJson}::jsonb, '[]'::jsonb,
        ${payload.distributionLicense || 'Ministry Standard Scope'}, ${payload.territory || 'Global'},
        '2026–2036', 'Ministry Retained', 'Proprietary', '100% Ministry Owned',
        ${feedbackNotes}, 0
      )
      ON CONFLICT (id) DO NOTHING
    `

    return NextResponse.json({
      success: true,
      message: `Pillar [${pillarTitles[pillar] || pillar}] updated successfully and scheduled for ministerial approval.`,
      assetId: id,
      pillar,
      approvalId,
    })
  } catch (error: any) {
    console.error('Error updating governance pillar:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update governance pillar' }, { status: 500 })
  }
}
