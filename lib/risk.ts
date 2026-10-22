import { AssetData, RiskTier, AssetRiskAssessment, RightsRecord, ApprovalRequest, RightsDocument } from '@/types'

export interface RiskEvaluationContext {
  rightsRecords?: RightsRecord[]
  approvals?: ApprovalRequest[]
  documents?: RightsDocument[]
}

/**
 * Functional Multi-Factor Intellectual Property Risk Engine
 * 
 * Evaluates asset exposure independently based on:
 * 1. Legal Documentation & Chain of Title Evidence (deeds, talent releases, licenses)
 * 2. Inherent Category Liability Surface (consumer product safety vs broadcast vs liturgy)
 * 3. Operational Distribution Reach (active broadcast vs internal vs dormant archive)
 * 4. Governance & Doctrinal Checklist Completion
 * 5. Approvals Workflow & Legal Objection State
 * 
 * Core Design Principles:
 * - NO demo hardcoding or static status assumptions
 * - Assets with NO documents are not falsely assumed to be "Cleared" or "Risk-Free"
 * - Discontinued assets are NOT assumed to be high risk (their live broadcast liability is 0)
 * - Each asset's risk is calculated independently from its own attributes and clearance state
 */
export function getAssetRiskAssessment(
  asset: AssetData,
  contextOrRights?: RightsRecord[] | RiskEvaluationContext,
  maybeApprovals?: ApprovalRequest[]
): AssetRiskAssessment {
  // 1. Resolve Context (Linked Rights, Approvals, Documents)
  let rightsRecords: RightsRecord[] | undefined
  let approvals: ApprovalRequest[] | undefined
  let attachedDocs: RightsDocument[] = []

  if (Array.isArray(contextOrRights)) {
    rightsRecords = contextOrRights
    approvals = maybeApprovals
  } else if (contextOrRights && typeof contextOrRights === 'object') {
    rightsRecords = contextOrRights.rightsRecords
    approvals = contextOrRights.approvals
    if (contextOrRights.documents) {
      attachedDocs = contextOrRights.documents
    }
  }

  // Find linked rights record
  const linkedRights = rightsRecords?.find(
    (r) => r.assetId === asset.id || r.id === 'RG-' + asset.id || r.name?.toLowerCase() === asset.name?.toLowerCase()
  )

  // Find linked approval
  const linkedApproval = approvals?.find(
    (a) => a.assetId === asset.id || a.id === asset.id || a.assetName?.toLowerCase() === asset.name?.toLowerCase()
  )

  // Document Count & Governance Score
  const docCount =
    attachedDocs.length ||
    linkedRights?.documents?.length ||
    linkedApproval?.documents?.length ||
    (Array.isArray(asset.attributes?.documents) ? asset.attributes.documents.length : 0)

  const governanceScore = linkedRights?.governanceScore ?? (docCount > 0 ? 50 : 0)
  const isApproved = asset.status === 'Approved' || linkedApproval?.status === 'Approved'
  const isDeclined = linkedApproval?.status === 'Declined'
  const isRevisionRequested = linkedApproval?.status === 'Needs Feedback'

  // 2. Classify Category Liability Profile
  const cat = (asset.category || '').toLowerCase()
  const name = (asset.name || '').toLowerCase()

  let categoryType: 'Commercial' | 'Broadcast' | 'Digital' | 'Music' | 'Publishing' | 'Film' | 'Event' | 'Scripture' | 'Brand' = 'Broadcast'
  let categoryWeight = 16

  if (
    cat.includes('consumer') ||
    cat.includes('product') ||
    cat.includes('beverage') ||
    cat.includes('merchandise') ||
    cat.includes('apparel') ||
    name.includes('zobo') ||
    name.includes('drink')
  ) {
    categoryType = 'Commercial'
    categoryWeight = 28 // High product liability, trademark classes, food safety standards
  } else if (
    cat.includes('animation') ||
    cat.includes('animated') ||
    cat.includes('tv programme') ||
    cat.includes('tv series')
  ) {
    categoryType = 'Broadcast'
    categoryWeight = 24 // Multi-contributor IP, voice actors, animators, script adaptation, global broadcast
  } else if (
    cat.includes('game') ||
    cat.includes('app') ||
    cat.includes('digital') ||
    cat.includes('interactive')
  ) {
    categoryType = 'Digital'
    categoryWeight = 22 // COPPA, app store policies, third-party libraries, cloud data privacy
  } else if (cat.includes('music') || cat.includes('audio') || cat.includes('song')) {
    categoryType = 'Music'
    categoryWeight = 18 // Split sheets, composition, master vocal recordings
  } else if (cat.includes('publishing') || cat.includes('book') || cat.includes('comic')) {
    categoryType = 'Publishing'
    categoryWeight = 16 // Illustrator contracts, translation, ISBN
  } else if (cat.includes('documentary') || cat.includes('short movie') || cat.includes('movie')) {
    categoryType = 'Film'
    categoryWeight = 16 // Participant appearance releases, archival footage
  } else if (cat.includes('outreach') || cat.includes('event')) {
    categoryType = 'Event'
    categoryWeight = 12 // Venue and speaker waivers
  } else if (
    cat.includes('quiz') ||
    cat.includes('recital') ||
    cat.includes('sunday school') ||
    name.includes('quiz') ||
    name.includes('unscrambled') ||
    name.includes('bible facts') ||
    name.includes('memory verse')
  ) {
    categoryType = 'Scripture'
    categoryWeight = 8 // Pure scripture/liturgical quiz, low commercial contestation
  } else if (cat.includes('brand') || cat.includes('guidelines') || name.includes('logo')) {
    categoryType = 'Brand'
    categoryWeight = 6 // Core ministry brand identity
  }

  // 3. Documentation & Chain of Title Evidence
  let documentationRisk = 0
  if (docCount === 0) {
    if (categoryType === 'Commercial') {
      documentationRisk = 32 // Zero trademark filings or lab certificates
    } else if (categoryType === 'Broadcast') {
      documentationRisk = 28 // Zero script clearance or voice talent releases on file
    } else if (categoryType === 'Digital') {
      documentationRisk = 26 // Zero store terms, privacy policy or third-party code licenses
    } else if (categoryType === 'Music' || categoryType === 'Publishing' || categoryType === 'Film') {
      documentationRisk = 20 // Missing author/contributor work-for-hire assignment deeds
    } else {
      documentationRisk = 12 // Internal scripture/brand awaiting formal central catalog filing
    }
  } else if (docCount === 1) {
    documentationRisk = categoryType === 'Commercial' || categoryType === 'Broadcast' ? 10 : 6
  } else if (docCount >= 2 && docCount < 4) {
    documentationRisk = -12 // Substantial chain of title attached
  } else {
    documentationRisk = -20 // Comprehensive multi-document clearance
  }

  // 4. Operational & Broadcast Distribution Channel Effect
  const isDiscontinued =
    asset.status === 'Discontinued' ||
    (asset.officialStatus || '').toLowerCase().includes('discontinued') ||
    (asset.tags || []).some((t) => t.toLowerCase().includes('discontinued'))

  const isUnderReview =
    asset.status === 'Under Review' ||
    asset.status === 'In Review' ||
    (asset.officialStatus || '').toLowerCase().includes('under review')

  const isYetToLaunch =
    asset.status === 'Yet to Launch' ||
    asset.status === 'Pending' ||
    (asset.officialStatus || '').toLowerCase().includes('yet to launch') ||
    (asset.officialStatus || '').toLowerCase().includes('potential')

  const isActiveProduction = !isDiscontinued && !isUnderReview && !isYetToLaunch

  let operationalRisk = 0
  if (isDiscontinued) {
    // Key rule: Discontinued assets are NOT high risk!
    // Live broadcast infringement liability is zero because they are not broadcasting.
    if (categoryType === 'Broadcast') {
      operationalRisk = 2 // Needs digital master archiving
    } else if (categoryType === 'Commercial') {
      operationalRisk = 4 // Trademark maintenance
    } else {
      operationalRisk = -12 // Inactive scripture/quiz/audio: Dormant with negligible liability
    }
  } else if (isUnderReview) {
    operationalRisk = 4 // Gated by review process
  } else if (isYetToLaunch) {
    operationalRisk = 3 // Pre-launch concept, not yet exposed to broadcast public
  } else if (isActiveProduction) {
    // Active broadcast / live distribution
    if (docCount === 0) {
      if (categoryType === 'Commercial') operationalRisk = 16
      else if (categoryType === 'Broadcast') operationalRisk = 14
      else if (categoryType === 'Digital') operationalRisk = 12
      else if (categoryType === 'Music' || categoryType === 'Publishing' || categoryType === 'Film') operationalRisk = 8
      else operationalRisk = 2
    } else {
      operationalRisk = -6
    }
  }

  // 5. Governance Checklist & Approval State Factor
  let governanceRisk = 0
  if (governanceScore === 0) {
    governanceRisk += 5
  } else if (governanceScore >= 80) {
    governanceRisk -= 12
  } else if (governanceScore >= 50) {
    governanceRisk -= 6
  }

  if (isApproved) {
    governanceRisk -= 10
  } else if (isDeclined) {
    governanceRisk += 14 // Formally declined by counsel
  } else if (isRevisionRequested) {
    governanceRisk += 8 // Revisions requested due to compliance/doctrine gaps
  }

  // Non-exclusive or third-party license penalty
  if (
    asset.rightsHolder &&
    !asset.rightsHolder.toLowerCase().includes('exclusive') &&
    !asset.rightsHolder.toLowerCase().includes('lovetoons')
  ) {
    governanceRisk += 6
  }

  // 6. Compute Raw Score (clamped between 8 and 95)
  const rawScore = categoryWeight + documentationRisk + operationalRisk + governanceRisk
  const score = Math.max(8, Math.min(95, Math.round(rawScore)))

  // 7. Determine Risk Tier
  let level: RiskTier = 'Low'
  if (score >= 70) level = 'Critical'
  else if (score >= 55) level = 'High'
  else if (score >= 32) level = 'Medium'
  else level = 'Low'

  // 8. Dynamic Exposure Category, Primary Vector & Remediation
  let category: string = 'Operational'
  let primaryVector = ''
  let remediationAction = ''
  let exposureSummary = ''

  if (isDiscontinued) {
    category = 'Archival & Dormancy'
    if (categoryType === 'Broadcast') {
      primaryVector = 'Retired Broadcast Title — Awaiting Source Master Archival & Contract Closure'
      remediationAction = 'Deposit Broadcast Source Masters in Ministry Vault & Formally Seal Archive File'
      exposureSummary = 'Former television/animation format retired from active broadcast. Minimal live exposure; requires archival master deposit and trademark cataloguing.'
    } else if (categoryType === 'Commercial') {
      primaryVector = 'Discontinued Commercial Item — Residual Inventory & Trademark Maintenance'
      remediationAction = 'Archive Manufacturing Spec Sheets & Confirm Market Deprecation Status'
      exposureSummary = 'Discontinued commercial physical product. Verify no active unauthorized distributor stock remains in circulation.'
    } else {
      primaryVector = 'Dormant In-House Asset — Retired Liturgical / Educational Media'
      remediationAction = 'Catalog in Permanent Ministry Archive for Historic Record'
      exposureSummary = 'Cleanly retired devotional or liturgical content. Zero active broadcast liability with minimal ongoing governance overhead.'
    }
  } else if (docCount === 0) {
    if (categoryType === 'Commercial') {
      category = 'Commercial & Product'
      primaryVector = 'Physical Consumer Product — Zero Laboratory Safety Certificates & Unfiled Trademark Class'
      remediationAction = 'Upload Food Safety / Product Lab Certificates, Register Class 32 Trademark & Attach Franchise Deed'
      exposureSummary = 'Commercial physical product without filed chain of title, product safety compliance certificates, or manufacturing warranties.'
    } else if (categoryType === 'Broadcast') {
      category = 'Chain of Title'
      primaryVector = 'Active Broadcast IP — Zero Chain of Title, Missing Script Clearance & Voice Talent Releases'
      remediationAction = 'Attach Master Chain of Title Deed, Script Adaptation Clearance & Voice Actor Work-for-Hire Releases'
      exposureSummary = 'Active broadcast television or animation format broadcasting without uploaded legal deed of assignment, script clearances, or talent release forms.'
    } else if (categoryType === 'Digital') {
      category = 'Commercial & Product'
      primaryVector = 'Digital Platform — Missing App Store Terms, COPPA Privacy Policy & Third-Party Code Licenses'
      remediationAction = 'Upload Children Privacy (COPPA) Certificate, App Store License Terms & Software Library Audit'
      exposureSummary = 'Digital app or interactive game currently lacking filed privacy disclosures, app store distribution clearances, or third-party asset licenses.'
    } else if (categoryType === 'Music') {
      category = 'Chain of Title'
      primaryVector = 'Audio Master — Unregistered Mechanical Royalties & Missing Vocalist Performance Release'
      remediationAction = 'Upload Composition Split Sheet, Producer Agreement & Vocalist Release Deed'
      exposureSummary = 'Active musical asset lacking verified split sheets or vocalist work-for-hire documentation.'
    } else if (categoryType === 'Publishing' || categoryType === 'Film') {
      category = 'Chain of Title'
      primaryVector = 'Publication / Film — Unattached Illustrator Copyright Assignment & Participant Waivers'
      remediationAction = 'Attach Illustrator Work-for-Hire Agreement, Script Release & Participant Consents'
      exposureSummary = 'Creative print or video media awaiting uploaded contributor assignment deeds and distribution rights.'
    } else {
      category = 'Operational'
      primaryVector = 'In-House Scripture Format — Standard Liturgical Content Awaiting Central Registry Filing'
      remediationAction = 'Complete Central Production Registry Notice & Confirm Ministry Authorship'
      exposureSummary = 'Internal scripture reading, recital, or devotional format. Very low external contestation liability; awaiting routine administrative filing.'
    }
  } else if (docCount >= 2 && (governanceScore >= 80 || isApproved)) {
    category = 'Cleared'
    primaryVector = 'Verified Intellectual Property — Documented Exclusive Ministry Chain of Title'
    remediationAction = 'Maintain Periodic Annual Governance Schedule & Monitor Trademark Renewals'
    exposureSummary = 'Full chain of title verified with supporting legal documentation and approved governance clearance.'
  } else {
    category = isYetToLaunch ? 'Pre-Launch' : 'Operational'
    primaryVector = isYetToLaunch
      ? 'Pre-Market Title — Prior Art Clearance & Ministry Trademark Filing In Progress'
      : 'Active Governance — Partial Documentation Attached, Awaiting Final Legal Seal'
    remediationAction = isYetToLaunch
      ? 'Finalize Pre-Launch Registration, Complete Trademark Filing & Verify Prior Art'
      : 'Complete Reviewer Governance Checklist & Execute Formal Clearance Seal'
    exposureSummary = isYetToLaunch
      ? 'Pre-launch concept undergoing trademark and prior-art clearance before official public broadcast.'
      : 'Asset has initial documentation on file; awaiting final reviewer sign-off and complete deed verification.'
  }

  // 9. Style Badges
  let riskBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
  let riskTextColor = 'text-emerald-600 dark:text-emerald-400'

  if (level === 'Critical') {
    riskBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40'
    riskTextColor = 'text-rose-600 dark:text-rose-400'
  } else if (level === 'High') {
    riskBadgeColor = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
    riskTextColor = 'text-amber-600 dark:text-amber-400'
  } else if (level === 'Medium') {
    riskBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40'
    riskTextColor = 'text-blue-600 dark:text-blue-400'
  }

  return {
    level,
    score,
    category,
    primaryVector,
    remediationAction,
    riskBadgeColor,
    riskTextColor,
    exposureSummary,
    docCount,
    governanceScore,
  }
}

export interface PortfolioRiskMetrics {
  totalAssets: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  criticalPct: number
  highPct: number
  mediumPct: number
  lowPct: number
  averageScore: number
  overallTier: RiskTier
  discontinuedCount: number
  underReviewCount: number
  potentialCount: number
  clearedCount: number
}

export function getPortfolioRiskMetrics(
  assets: AssetData[],
  contextOrRights?: RightsRecord[] | RiskEvaluationContext,
  maybeApprovals?: ApprovalRequest[]
): PortfolioRiskMetrics {
  const total = assets.length || 1
  let critical = 0
  let high = 0
  let medium = 0
  let low = 0
  let totalScore = 0
  let discontinued = 0
  let underReview = 0
  let potential = 0
  let cleared = 0

  for (const asset of assets) {
    const assessment = getAssetRiskAssessment(asset, contextOrRights, maybeApprovals)
    totalScore += assessment.score
    if (assessment.level === 'Critical') critical++
    else if (assessment.level === 'High') high++
    else if (assessment.level === 'Medium') medium++
    else low++

    if (
      asset.status === 'Discontinued' ||
      (asset.officialStatus || '').toLowerCase().includes('discontinued') ||
      (asset.tags || []).some((t) => t.toLowerCase().includes('discontinued'))
    ) {
      discontinued++
    } else if (
      asset.status === 'Under Review' ||
      asset.status === 'In Review' ||
      (asset.officialStatus || '').toLowerCase().includes('under review')
    ) {
      underReview++
    } else if (
      asset.status === 'Yet to Launch' ||
      asset.status === 'Pending' ||
      (asset.officialStatus || '').toLowerCase().includes('yet to launch') ||
      (asset.officialStatus || '').toLowerCase().includes('potential')
    ) {
      potential++
    } else {
      cleared++
    }
  }

  const averageScore = Math.round(totalScore / total)
  let overallTier: RiskTier = 'Low'
  if (averageScore >= 65) overallTier = 'Critical'
  else if (averageScore >= 50) overallTier = 'High'
  else if (averageScore >= 32) overallTier = 'Medium'

  return {
    totalAssets: assets.length,
    criticalCount: critical,
    highCount: high,
    mediumCount: medium,
    lowCount: low,
    criticalPct: Math.round((critical / total) * 100),
    highPct: Math.round((high / total) * 100),
    mediumPct: Math.round((medium / total) * 100),
    lowPct: Math.round((low / total) * 100),
    averageScore,
    overallTier,
    discontinuedCount: discontinued,
    underReviewCount: underReview,
    potentialCount: potential,
    clearedCount: cleared,
  }
}

/**
 * Checks whether an asset is discontinued based on status, officialStatus, or tags.
 */
export function isAssetDiscontinued(asset?: { status?: string; officialStatus?: string; tags?: string[] } | null): boolean {
  if (!asset) return false
  return (
    asset.status === 'Discontinued' ||
    (asset.officialStatus || '').toLowerCase().includes('discontinued') ||
    (asset.tags || []).some((t) => t.toLowerCase().includes('discontinued'))
  )
}

/**
 * Sorts an array of assets or asset-like objects placing all discontinued items at the bottom of the list.
 * Preserves the relative order of active assets and discontinued assets (stable sort).
 */
export function sortDiscontinuedToBottom<T extends { status?: string; officialStatus?: string; tags?: string[] }>(list: T[]): T[] {
  return list.slice().sort((a, b) => {
    const aDis = isAssetDiscontinued(a)
    const bDis = isAssetDiscontinued(b)
    if (aDis && !bDis) return 1
    if (!aDis && bDis) return -1
    return 0
  })
}
