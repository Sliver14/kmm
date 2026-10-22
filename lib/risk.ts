import { AssetData, RiskTier, AssetRiskAssessment } from '@/types'

export function getAssetRiskAssessment(asset: AssetData): AssetRiskAssessment {
  const isDiscontinued =
    asset.status === 'Discontinued' ||
    asset.status === 'Requires Attention' ||
    (asset.tags || []).some((t) => t.toLowerCase().includes('discontinued')) ||
    (asset.description || '').toLowerCase().includes('discontinued')

  const isUnderReview =
    asset.status === 'Under Review' ||
    asset.status === 'In Review' ||
    (asset.tags || []).some((t) => t.toLowerCase().includes('under review')) ||
    (asset.description || '').toLowerCase().includes('under review')

  const isPotential =
    asset.status === 'Yet to Launch' ||
    asset.status === 'Pending' ||
    (asset.tags || []).some((t) => t.toLowerCase().includes('yet to launch')) ||
    (asset.description || '').toLowerCase().includes('yet to launch')

  if (isDiscontinued) {
    const isBroadcastFlagship =
      asset.category === 'Animated Programme' ||
      asset.category === 'TV Programme' ||
      asset.category === 'Educational Video Series'

    if (isBroadcastFlagship) {
      return {
        level: 'Critical',
        score: 88,
        category: 'Chain of Title',
        primaryVector: 'Discontinued Broadcast IP — Residual Copyright & Unarchived Source Masters',
        remediationAction: 'Execute Formal Deprecation Audit, Deposit Masters in Archive & Seal Chain of Title',
        riskBadgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        riskTextColor: 'text-rose-600',
        exposureSummary: 'High-value television/animation format ceased production. Underlying assets remain legally active with exposure to unmonitored copyright, trademark lapse, or uncollected residual documentation.',
      }
    }

    return {
      level: 'High',
      score: 72,
      category: 'Operational',
      primaryVector: 'Dormant Asset Format — Inactive Rights Registry & Outdated Talent Release Deeds',
      remediationAction: 'Conduct Trademark Clearance Audit & Formally Retire Inactive Brand Collateral',
      riskBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      riskTextColor: 'text-amber-600',
      exposureSummary: 'Discontinued event, product, or auxiliary media. Requires formal contract closure and trademark preservation.',
    }
  }

  if (isUnderReview) {
    return {
      level: 'Medium',
      score: 52,
      category: 'Operational',
      primaryVector: 'Active Governance & Content Compliance Audit Incomplete',
      remediationAction: 'Complete Reviewer Governance Checklist & Execute Formal Clearance Deed',
      riskBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      riskTextColor: 'text-blue-600',
      exposureSummary: 'Asset under active ministerial or legal compliance evaluation. Broadcast clearance deed pending final sign-off.',
    }
  }

  if (isPotential) {
    return {
      level: 'Medium',
      score: 44,
      category: 'Pre-Launch',
      primaryVector: 'Pre-Market Title — Unverified Prior Art Clearance & Ministry Trademark Filing',
      remediationAction: 'Finalize Pre-Launch Registration, Complete Trademark Filing & Verify Prior Art',
      riskBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      riskTextColor: 'text-indigo-600',
      exposureSummary: 'Pre-launch concept. Pending trademark filing and final intellectual property chain of title verification.',
    }
  }

  return {
    level: 'Low',
    score: 12,
    category: 'Cleared',
    primaryVector: 'Active Broadcast — Verified 100% Exclusive Ministry Ownership',
    remediationAction: 'Maintain Periodic Annual Governance Audit Schedule',
    riskBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    riskTextColor: 'text-emerald-600',
    exposureSummary: 'Full chain of title verified. Exclusive ministry rights recorded in worldwide media registry with active broadcast protection.',
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

export function getPortfolioRiskMetrics(assets: AssetData[]): PortfolioRiskMetrics {
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
    const assessment = getAssetRiskAssessment(asset)
    totalScore += assessment.score
    if (assessment.level === 'Critical') critical++
    else if (assessment.level === 'High') high++
    else if (assessment.level === 'Medium') medium++
    else low++

    if (
      asset.status === 'Discontinued' ||
      asset.status === 'Requires Attention' ||
      (asset.tags || []).some((t) => t.toLowerCase().includes('discontinued'))
    ) {
      discontinued++
    } else if (
      asset.status === 'Under Review' ||
      asset.status === 'In Review' ||
      (asset.tags || []).some((t) => t.toLowerCase().includes('under review'))
    ) {
      underReview++
    } else if (
      asset.status === 'Yet to Launch' ||
      asset.status === 'Pending' ||
      (asset.tags || []).some((t) => t.toLowerCase().includes('yet to launch'))
    ) {
      potential++
    } else {
      cleared++
    }
  }

  const averageScore = Math.round(totalScore / total)
  let overallTier: RiskTier = 'Low'
  if (averageScore >= 65) overallTier = 'Critical'
  else if (averageScore >= 45) overallTier = 'High'
  else if (averageScore >= 25) overallTier = 'Medium'

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
