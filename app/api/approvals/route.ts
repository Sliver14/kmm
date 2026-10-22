import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'

    const rows = await sql`
      SELECT 
        id, ministry_id as "ministryId", asset_id as "assetId", asset_name as "assetName",
        category, subcategory, agency, unit, requester_name as "requesterName",
        requester_role as "requesterRole", requester_skill as "requesterSkill",
        reviewer_name as "reviewerName", stage, current_step as "currentStep",
        total_steps as "totalSteps", status, priority, submitted_date as "submittedDate",
        submitted_time as "submittedTime", feedback_notes as "feedbackNotes",
        history, documents, rights_type as "rightsType", territory, term,
        exclusivity, licence_type as "licenceType", royalty_terms as "royaltyTerms",
        description, governance_score as "governanceScore",
        governance_checks as "governanceChecks",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM approvals
      WHERE ministry_id = ${ministryId}
      ORDER BY created_at DESC
    `

    const approvals = rows.map((r: any) => ({
      ...r,
      documents: Array.isArray(r.documents) ? r.documents : (typeof r.documents === 'string' ? JSON.parse(r.documents) : []),
      history: Array.isArray(r.history) ? r.history : (typeof r.history === 'string' ? JSON.parse(r.history) : []),
      governanceChecks: typeof r.governanceChecks === 'object' && r.governanceChecks !== null ? r.governanceChecks : (typeof r.governanceChecks === 'string' ? JSON.parse(r.governanceChecks) : {}),
    }))

    return NextResponse.json({ success: true, count: approvals.length, approvals })
  } catch (error: any) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch approvals' }, { status: 500 })
  }
}

// Update approval status, feedback, stage, reviewer, or documents
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      status,
      feedbackNotes,
      stage,
      reviewerName,
      currentStep,
      documents,
      history,
      governanceScore,
      governanceChecks,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Approval ID is required' }, { status: 400 })
    }

    const docsJson = documents !== undefined ? JSON.stringify(documents) : null
    const historyJson = history !== undefined ? JSON.stringify(history) : null
    const checksJson = governanceChecks !== undefined ? JSON.stringify(governanceChecks) : null

    await sql`
      UPDATE approvals
      SET
        status = COALESCE(${status ?? null}, status),
        feedback_notes = COALESCE(${feedbackNotes ?? null}, feedback_notes),
        stage = COALESCE(${stage ?? null}, stage),
        reviewer_name = COALESCE(${reviewerName ?? null}, reviewer_name),
        current_step = COALESCE(${currentStep ?? null}, current_step),
        governance_score = COALESCE(${governanceScore ?? null}, governance_score),
        documents = CASE WHEN ${docsJson}::jsonb IS NOT NULL THEN ${docsJson}::jsonb ELSE documents END,
        history = CASE WHEN ${historyJson}::jsonb IS NOT NULL THEN ${historyJson}::jsonb ELSE history END,
        governance_checks = CASE WHEN ${checksJson}::jsonb IS NOT NULL THEN ${checksJson}::jsonb ELSE governance_checks END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // If status became 'Approved', update corresponding asset
    if (status === 'Approved') {
      const appRows = await sql`SELECT asset_id FROM approvals WHERE id = ${id} LIMIT 1`
      if (appRows.length > 0 && appRows[0].asset_id) {
        await sql`
          UPDATE assets
          SET status = 'Approved', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${appRows[0].asset_id}
        `
      }
    }

    return NextResponse.json({ success: true, message: 'Approval record updated successfully' })
  } catch (error: any) {
    console.error('Error updating approval:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update approval' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      assetId,
      assetName,
      category = 'Animated TV Series',
      subcategory = 'Pre-school Scriptural Series',
      agency = 'Lovetoons',
      unit = 'Lovetoons',
      requesterName = 'Lovetoons Creative Team',
      requesterRole = 'Lead Producer',
      requesterSkill = 'video_editor',
      reviewerName = 'Faith Daniel',
      stage = 'Awaiting Representative Clearance & Documentation',
      currentStep = 1,
      totalSteps = 3,
      priority = 'High',
      feedbackNotes = 'Submitted for review',
      ministryId = 'min-kmm',
      documents = [],
      rightsType = 'Worldwide Master Copyright',
      territory = 'Worldwide',
      term = '2026–2036',
      exclusivity = '100% Exclusive Ministry Ownership',
      licenceType = 'Proprietary Ministry License',
      royaltyTerms = '100% Ministry Retained',
      description = '',
      governanceScore = 0,
    } = body

    if (!assetId || !assetName) {
      return NextResponse.json({ error: 'Asset ID and Asset Name are required' }, { status: 400 })
    }

    const id = `app-${Date.now().toString().slice(-6)}`
    const submittedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const submittedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const docsJson = JSON.stringify(documents)
    const historyJson = JSON.stringify([
      {
        id: `h-${Date.now()}`,
        step: 1,
        title: 'Initial Submission',
        author: requesterName,
        date: submittedDate,
        time: submittedTime,
        status: 'Pending',
        feedback: feedbackNotes,
      },
    ])

    await sql`
      INSERT INTO approvals (
        id, ministry_id, asset_id, asset_name, category, subcategory,
        agency, unit, requester_name, requester_role, requester_skill,
        reviewer_name, stage, current_step, total_steps, status, priority,
        submitted_date, submitted_time, feedback_notes, history, documents,
        rights_type, territory, term, exclusivity, licence_type,
        royalty_terms, description, governance_score
      ) VALUES (
        ${id}, ${ministryId}, ${assetId}, ${assetName}, ${category}, ${subcategory},
        ${agency}, ${unit}, ${requesterName}, ${requesterRole}, ${requesterSkill},
        ${reviewerName}, ${stage}, ${currentStep}, ${totalSteps}, 'Pending', ${priority},
        ${submittedDate}, ${submittedTime}, ${feedbackNotes}, ${historyJson}::jsonb, ${docsJson}::jsonb,
        ${rightsType}, ${territory}, ${term}, ${exclusivity}, ${licenceType},
        ${royaltyTerms}, ${description}, ${governanceScore}
      )
    `

    return NextResponse.json({ success: true, message: 'Approval request submitted', id })
  } catch (error: any) {
    console.error('Error creating approval:', error)
    return NextResponse.json({ error: error?.message || 'Failed to submit approval' }, { status: 500 })
  }
}
