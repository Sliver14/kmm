import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'
    const agency = searchParams.get('agency')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('q')

    let rows
    if (search) {
      const term = `%${search.toLowerCase()}%`
      rows = await sql`
        SELECT 
          id, ministry_id as "ministryId", name, type, category, 
          category_group as "categoryGroup", subcategory, agency, unit,
          creator_name as "creatorName", creator_role as "creatorRole",
          creator_skill as "creatorSkill", contributors, status, 
          created_date as "createdDate", created_time as "createdTime",
          thumb_type as "thumbType", poster_url as "posterUrl",
          rights_holder as "rightsHolder", description, tags, attributes,
          archive_status as "archiveStatus", created_at as "createdAt", updated_at as "updatedAt"
        FROM assets
        WHERE ministry_id = ${ministryId}
          AND (LOWER(name) LIKE ${term} OR LOWER(id) LIKE ${term} OR LOWER(description) LIKE ${term})
        ORDER BY created_at DESC
      `
    } else {
      rows = await sql`
        SELECT 
          id, ministry_id as "ministryId", name, type, category, 
          category_group as "categoryGroup", subcategory, agency, unit,
          creator_name as "creatorName", creator_role as "creatorRole",
          creator_skill as "creatorSkill", contributors, status, 
          created_date as "createdDate", created_time as "createdTime",
          thumb_type as "thumbType", poster_url as "posterUrl",
          rights_holder as "rightsHolder", description, tags, attributes,
          archive_status as "archiveStatus", created_at as "createdAt", updated_at as "updatedAt"
        FROM assets
        WHERE ministry_id = ${ministryId}
        ORDER BY created_at DESC
      `
    }

    const assets = rows.map((r: any) => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : (typeof r.tags === 'string' ? JSON.parse(r.tags) : []),
      contributors: Array.isArray(r.contributors) ? r.contributors : (typeof r.contributors === 'string' ? JSON.parse(r.contributors) : []),
      attributes: typeof r.attributes === 'object' && r.attributes !== null ? r.attributes : (typeof r.attributes === 'string' ? JSON.parse(r.attributes) : {}),
    }))

    return NextResponse.json({ success: true, count: assets.length, assets })
  } catch (error: any) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      name,
      type = 'video',
      category = 'Animated TV Series',
      categoryGroup = 'Screen Production',
      subcategory = 'Pre-school Scriptural Series',
      agency = 'Lovetoons',
      unit = 'Lovetoons',
      creatorName = 'Lovetoons Animation Studio',
      creatorRole = 'Executive Creative Director',
      creatorSkill = 'animation',
      contributors = [],
      status = 'Draft',
      createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      thumbType = body.thumbType || null,
      posterUrl = body.posterUrl || null,
      rightsHolder = body.rightsHolder || body.owner || '',
      owner = body.owner || body.rightsHolder || '',
      ownerCertificateRef = body.ownerCertificateRef || '',
      trademarkStatus = body.trademarkStatus || 'Unregistered',
      distributionLicense = body.distributionLicense || 'None',
      productionLicensees = body.productionLicensees || 'None',
      territory = body.territory || 'None',
      territoryClearanceStatus = body.territoryClearanceStatus || 'None',
      contentProvenance = body.contentProvenance || 'Fully Custom',
      songWriter = body.songWriter || '',
      songWriterProvenance = body.songWriterProvenance || 'Fully Custom',
      description = '',
      tags = [],
      attributes = {},
      ministryId = 'min-kmm',
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Asset name is required' }, { status: 400 })
    }

    const hasGovernanceInput = 
      Boolean(owner && owner !== 'Unassigned' && owner.trim() !== '') ||
      Boolean(trademarkStatus && trademarkStatus !== 'Unregistered') ||
      Boolean(distributionLicense && distributionLicense !== 'None') ||
      Boolean(productionLicensees && productionLicensees !== 'None') ||
      Boolean(territory && territory !== 'None') ||
      Boolean(contentProvenance && contentProvenance !== 'Fully Custom') ||
      Boolean(songWriter && songWriter.trim() !== '')

    const resolvedStatus = hasGovernanceInput ? 'Pending' : status
    const resolvedClearanceStatus = hasGovernanceInput ? (territoryClearanceStatus === 'None' ? 'Pending Clearance' : territoryClearanceStatus) : territoryClearanceStatus

    const assetId = id || `LT-${Date.now().toString().slice(-6)}`
    const tagsJson = JSON.stringify(tags)
    const contributorsJson = JSON.stringify(contributors)
    const mergedAttributes = {
      ...attributes,
      owner,
      ownerCertificateRef,
      trademarkStatus,
      distributionLicense,
      productionLicensees,
      territory,
      territoryClearanceStatus: resolvedClearanceStatus,
      contentProvenance,
      songWriter,
      songWriterProvenance,
      requiresGovernanceApproval: hasGovernanceInput,
    }
    const attributesJson = JSON.stringify(mergedAttributes)

    await sql`
      INSERT INTO assets (
        id, ministry_id, name, type, category, category_group, subcategory,
        agency, unit, creator_name, creator_role, creator_skill, contributors,
        status, created_date, created_time, thumb_type, poster_url,
        rights_holder, description, tags, attributes, archive_status
      ) VALUES (
        ${assetId}, ${ministryId}, ${name}, ${type}, ${category}, ${categoryGroup}, ${subcategory},
        ${agency}, ${unit}, ${creatorName}, ${creatorRole}, ${creatorSkill}, ${contributorsJson}::jsonb,
        ${resolvedStatus}, ${createdDate}, ${createdTime}, ${thumbType}, ${posterUrl},
        ${owner || rightsHolder}, ${description}, ${tagsJson}::jsonb, ${attributesJson}::jsonb, 'pending_cloud_storage'
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        category = EXCLUDED.category,
        category_group = EXCLUDED.category_group,
        subcategory = EXCLUDED.subcategory,
        agency = EXCLUDED.agency,
        unit = EXCLUDED.unit,
        status = EXCLUDED.status,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        attributes = EXCLUDED.attributes,
        poster_url = EXCLUDED.poster_url,
        updated_at = CURRENT_TIMESTAMP
    `

    // Seed companion rights record with governance details
    await sql`
      INSERT INTO rights_records (
        id, ministry_id, asset_id, name, rights_type, territory,
        validity, exclusivity, licence_type, royalty_terms, status, governance_score, documents, governance_checks
      ) VALUES (
        ${`rr-${assetId}`}, ${ministryId}, ${assetId}, ${name},
        ${distributionLicense}, ${territory}, 'Perpetual', 'Exclusive', 'Ministerial Title', 'Retained',
        ${hasGovernanceInput ? 'Pending Review' : 'Draft'}, 0,
        '[]'::jsonb,
        '{}'::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        rights_type = EXCLUDED.rights_type,
        territory = EXCLUDED.territory,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
    `

    // If governance input was provided, queue an initial Approval Request
    if (hasGovernanceInput) {
      const approvalId = `APP-${assetId}-${Date.now().toString().slice(-4)}`
      const feedbackNotes = `Initial intake governance review requested: Owner: ${owner || 'Unassigned'}, Trademark: ${trademarkStatus}, License: ${distributionLicense}, Territory: ${territory}`
      const historyJson = JSON.stringify([
        {
          id: `h-${Date.now()}`,
          step: 1,
          title: 'Intake Governance Submission',
          author: creatorName,
          date: createdDate,
          time: createdTime,
          status: 'Pending Clearance',
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
          ${approvalId}, ${ministryId}, ${assetId}, ${name}, ${category}, ${subcategory},
          ${agency}, ${unit}, ${creatorName}, ${creatorRole}, ${creatorSkill},
          'Faith Daniel', 'Awaiting Representative Clearance & Documentation', 1, 3, 'Pending', 'High',
          ${createdDate}, ${createdTime}, ${feedbackNotes}, ${historyJson}::jsonb, '[]'::jsonb,
          ${distributionLicense}, ${territory}, '2026–2036', 'Ministry Retained', 'Proprietary',
          '100% Ministry Owned', ${description}, 0
        )
        ON CONFLICT (id) DO NOTHING
      `
    }

    return NextResponse.json({
      success: true,
      message: hasGovernanceInput 
        ? 'Asset registered and queued for ministerial governance approval.'
        : 'Asset registered as draft with unregistered defaults.',
      assetId,
      status: resolvedStatus,
      approvalRequired: hasGovernanceInput,
    })
  } catch (error: any) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create asset' }, { status: 500 })
  }
}
