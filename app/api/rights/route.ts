import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'
    const assetId = searchParams.get('assetId')

    let rows
    if (assetId) {
      rows = await sql`
        SELECT 
          id, ministry_id as "ministryId", asset_id as "assetId", name, 
          rights_type as "rightsType", territory, validity, exclusivity, 
          licence_type as "licenceType", royalty_terms as "royaltyTerms",
          description, status, governance_score as "governanceScore", 
          documents, governance_checks as "governanceChecks", 
          created_at as "createdAt", updated_at as "updatedAt"
        FROM rights_records
        WHERE ministry_id = ${ministryId} AND (asset_id = ${assetId} OR id = ${assetId})
        ORDER BY created_at DESC
      `
    } else {
      rows = await sql`
        SELECT 
          id, ministry_id as "ministryId", asset_id as "assetId", name, 
          rights_type as "rightsType", territory, validity, exclusivity, 
          licence_type as "licenceType", royalty_terms as "royaltyTerms",
          description, status, governance_score as "governanceScore", 
          documents, governance_checks as "governanceChecks", 
          created_at as "createdAt", updated_at as "updatedAt"
        FROM rights_records
        WHERE ministry_id = ${ministryId}
        ORDER BY created_at DESC
      `
    }

    const records = rows.map((r: any) => ({
      ...r,
      documents: Array.isArray(r.documents) ? r.documents : (typeof r.documents === 'string' ? JSON.parse(r.documents) : []),
      governanceChecks: typeof r.governanceChecks === 'object' && r.governanceChecks !== null ? r.governanceChecks : (typeof r.governanceChecks === 'string' ? JSON.parse(r.governanceChecks) : {}),
    }))

    return NextResponse.json({ success: true, count: records.length, records })
  } catch (error: any) {
    console.error('Error in /api/rights:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch rights records' }, { status: 500 })
  }
}

// Representative update endpoint: upload legal doc or verify governance checks
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      assetId,
      rightsType,
      territory,
      validity,
      exclusivity,
      licenceType,
      royaltyTerms,
      description,
      status,
      governanceScore,
      documents,        // Array of representative uploaded documents
      governanceChecks, // Object or checklist of representative governance verifications
    } = body

    if (!id && !assetId) {
      return NextResponse.json({ error: 'Record ID or Asset ID is required' }, { status: 400 })
    }

    const docsJson = documents !== undefined ? JSON.stringify(documents) : null
    const checksJson = governanceChecks !== undefined ? JSON.stringify(governanceChecks) : null

    await sql`
      UPDATE rights_records
      SET
        rights_type = COALESCE(${rightsType ?? null}, rights_type),
        territory = COALESCE(${territory ?? null}, territory),
        validity = COALESCE(${validity ?? null}, validity),
        exclusivity = COALESCE(${exclusivity ?? null}, exclusivity),
        licence_type = COALESCE(${licenceType ?? null}, licence_type),
        royalty_terms = COALESCE(${royaltyTerms ?? null}, royalty_terms),
        description = COALESCE(${description ?? null}, description),
        status = COALESCE(${status ?? null}, status),
        governance_score = COALESCE(${governanceScore ?? null}, governance_score),
        documents = CASE WHEN ${docsJson}::jsonb IS NOT NULL THEN ${docsJson}::jsonb ELSE documents END,
        governance_checks = CASE WHEN ${checksJson}::jsonb IS NOT NULL THEN ${checksJson}::jsonb ELSE governance_checks END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} OR asset_id = ${assetId}
    `

    return NextResponse.json({
      success: true,
      message: 'Rights & Representative Governance record updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating rights record:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update rights record' }, { status: 500 })
  }
}
