import {
  AssetData,
  RightsRecord,
  RightsDocument,
  AssetContributor,
  RiskTier,
  GovernanceGateStatus,
  GovernanceCheckValue,
  GovernanceChecksMap,
} from '@/types'

export type CategoryCluster =
  | 'Broadcast'
  | 'Audio'
  | 'Publishing'
  | 'ConsumerGoods'
  | 'Digital'
  | 'Event'
  | 'BrandIP'

export interface GovernanceGateDefinition {
  key: string
  title: string
  desc: string
  pillar: 'Doctrinal' | 'Legal' | 'ChildSafety' | 'Distribution'
  mandatory: boolean
}

export interface RequiredDocumentDefinition {
  type: string
  label: string
  desc: string
  mandatory: boolean
}

export interface CategoryComplianceProfile {
  cluster: CategoryCluster
  clusterLabel: string
  inherentLiability: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  gates: GovernanceGateDefinition[]
  requiredDocuments: RequiredDocumentDefinition[]
  standardsReference: string
}

/**
 * Resolves an asset category into its official KMM Category Compliance Cluster
 */
export function getCategoryCluster(category: string, assetName?: string): CategoryCluster {
  const cat = (category || '').toLowerCase()
  const name = (assetName || '').toLowerCase()

  if (
    cat.includes('consumer') ||
    cat.includes('merchandise') ||
    cat.includes('product') ||
    cat.includes('beverage') ||
    cat.includes('apparel') ||
    name.includes('drink') ||
    name.includes('zobo')
  ) {
    return 'ConsumerGoods'
  }

  if (
    cat.includes('animated') ||
    cat.includes('tv programme') ||
    cat.includes('film') ||
    cat.includes('movie') ||
    cat.includes('documentary')
  ) {
    return 'Broadcast'
  }

  if (cat.includes('music') || cat.includes('audio') || cat.includes('song')) {
    return 'Audio'
  }

  if (cat.includes('publishing') || cat.includes('book') || cat.includes('comic')) {
    return 'Publishing'
  }

  if (
    cat.includes('digital') ||
    cat.includes('interactive') ||
    cat.includes('platform') ||
    cat.includes('game') ||
    cat.includes('app')
  ) {
    return 'Digital'
  }

  if (cat.includes('outreach') || cat.includes('event')) {
    return 'Event'
  }

  if (cat.includes('character') || cat.includes('brand')) {
    return 'BrandIP'
  }

  return 'Broadcast'
}

/**
 * Compliance Standard Specifications for each of the 7 Category Clusters
 */
export const CATEGORY_COMPLIANCE_STANDARDS: Record<CategoryCluster, CategoryComplianceProfile> = {
  Broadcast: {
    cluster: 'Broadcast',
    clusterLabel: 'Screen & Broadcast Media',
    inherentLiability: 'High',
    description: 'Animated series, broadcast programmes, films, and video features distributed globally.',
    standardsReference: 'KMM Broadcast Clearance Code & Master Delivery Specs',
    gates: [
      {
        key: 'biblicalAlignment',
        title: 'Biblical & Spiritual Doctrine Alignment Validated',
        desc: 'Content conforms with ministry faith, scripture fidelity, and wholesome doctrine.',
        pillar: 'Doctrinal',
        mandatory: true,
      },
      {
        key: 'ageAppropriate',
        title: 'Age-Appropriate Psychological Rating & Child Safety Standards',
        desc: 'Child psychological safety verified for visual, sensory, and behavioral impact.',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'musicSync',
        title: 'Music & Soundtrack Synchronization License Filed',
        desc: 'Composer deeds, cue sheets, and publishing synchronization agreements signed.',
        pillar: 'Distribution',
        mandatory: true,
      },
      {
        key: 'voiceReleases',
        title: 'Voice Actor & Performer Likeness Release Deeds Executed',
        desc: 'All voice talent, cast members, and performers have executed talent release deeds.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'broadcastMasterDelivery',
        title: 'High-Definition Broadcast Master & Delivery Certified',
        desc: 'Broadcast-quality 4K/1080p master stems archived in accordance with technical specs.',
        pillar: 'Distribution',
        mandatory: false,
      },
    ],
    requiredDocuments: [
      {
        type: 'TALENT_RELEASE',
        label: 'Performer & Voice Cast Release Deed',
        desc: 'Executed talent release deed for voice actors and cast members.',
        mandatory: true,
      },
      {
        type: 'LICENSE',
        label: 'Music Synchronization License',
        desc: 'Clearance deed for soundtrack score and theme compositions.',
        mandatory: true,
      },
      {
        type: 'DEED',
        label: 'Work-for-Hire Assignment Deed',
        desc: 'Assignment of copyright from scriptwriters, animators, and directors.',
        mandatory: true,
      },
    ],
  },

  Audio: {
    cluster: 'Audio',
    clusterLabel: 'Audio & Music Productions',
    inherentLiability: 'Medium',
    description: 'Original theme songs, sing-alongs, audio dramas, podcasts, and soundtrack stems.',
    standardsReference: 'KMM Music Custody & Master Split Regulations',
    gates: [
      {
        key: 'lyricalTheology',
        title: 'Lyrical Theology & Faith Review Verified',
        desc: 'Song lyrics and spoken words conform with scripture doctrine and ministry truth.',
        pillar: 'Doctrinal',
        mandatory: true,
      },
      {
        key: 'soundMasterAssignment',
        title: 'Master Sound Recording Rights Fully Assigned to KMM',
        desc: 'Producer, audio engineer, and mixing studio have transferred master stems custody.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'vocalistReleases',
        title: 'Vocalist & Musician Performance Releases Executed',
        desc: 'Signed releases for lead vocalists, session musicians, and choir participants.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'mechanicalSplitAgreement',
        title: 'Mechanical Royalty & Publishing Split Sheets Signed',
        desc: 'Agreed percentage splits between composers, lyricists, and ministry publishing arm.',
        pillar: 'Distribution',
        mandatory: true,
      },
    ],
    requiredDocuments: [
      {
        type: 'DEED',
        label: 'Composer & Producer Master Assignment Deed',
        desc: 'Assignment of musical composition and master recording rights.',
        mandatory: true,
      },
      {
        type: 'TALENT_RELEASE',
        label: 'Vocalist & Musician Release Deed',
        desc: 'Release deed for all vocal and instrumental performances.',
        mandatory: true,
      },
      {
        type: 'CONTRACT',
        label: 'Mechanical Split & Publishing Agreement',
        desc: 'Executed royalty split sheet between contributors and ministry.',
        mandatory: false,
      },
    ],
  },

  Publishing: {
    cluster: 'Publishing',
    clusterLabel: 'Publishing, Books & Comics',
    inherentLiability: 'Medium',
    description: 'Devotionals, illustrated storybooks, curricula, graphic novels, and character comics.',
    standardsReference: 'KMM Literary Custody & ISBN Clearance Standard',
    gates: [
      {
        key: 'biblicalAlignment',
        title: 'Theological & Scripture Quotation Accuracy Validated',
        desc: 'Scripture citations, moral lessons, and faith narratives verified by editorial board.',
        pillar: 'Doctrinal',
        mandatory: true,
      },
      {
        key: 'illustratorAssignment',
        title: 'Illustrator Artwork & Character Design Rights Assigned',
        desc: 'Complete transfer of intellectual property rights for all visual illustrations and panels.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'editorialChildReadability',
        title: 'Age-Appropriate Readability & Vocabulary Cleared',
        desc: 'Text structure and comprehension levels tailored for target children age brackets.',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'statutoryCopyrightDeposit',
        title: 'Statutory Copyright Deposit & ISBN Cataloguing Completed',
        desc: 'Official library deposit, legal custody certificate, and ISBN registration recorded.',
        pillar: 'Legal',
        mandatory: false,
      },
    ],
    requiredDocuments: [
      {
        type: 'DEED',
        label: 'Author & Illustrator Work-for-Hire Assignment',
        desc: 'Complete copyright transfer for literary manuscripts and illustrated art.',
        mandatory: true,
      },
      {
        type: 'CERT',
        label: 'ISBN & Legal Deposit Certificate',
        desc: 'Official national library registration or publishing certificate.',
        mandatory: false,
      },
    ],
  },

  ConsumerGoods: {
    cluster: 'ConsumerGoods',
    clusterLabel: 'Consumer Merchandise, Apparel & Consumables',
    inherentLiability: 'Critical',
    description: 'School bags, toys, branded consumables, beverages (e.g. Zobo Drink), and apparel.',
    standardsReference: 'KMM Child Consumer Product Safety & Health Standard',
    gates: [
      {
        key: 'healthSafetyLabClearance',
        title: 'Product Health & Safety Laboratory Testing Certified',
        desc: 'Certified non-toxic, food-grade safe, child-hazard free by accredited testing facility.',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'trademarkClassRegistration',
        title: 'Statutory Trademark Class Registration Filed (Nice Classes 25/28/30/32)',
        desc: 'Registered trademark protection for goods, apparel, toys, or beverages.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'regulatoryAuthorityFiling',
        title: 'National Food & Drug Regulatory Compliance Verified',
        desc: 'Applicable statutory authority approval (e.g. NAFDAC / FDA certification on file).',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'manufacturerQualityDeed',
        title: 'Manufacturing Quality Warranty & Supply Deed Executed',
        desc: 'Contractual warranty from certified manufacturer ensuring quality control standards.',
        pillar: 'Distribution',
        mandatory: true,
      },
    ],
    requiredDocuments: [
      {
        type: 'CERT',
        label: 'Product Health / Safety Testing Certificate',
        desc: 'Accredited lab safety analysis certificate or food & drug regulatory approval.',
        mandatory: true,
      },
      {
        type: 'CERT',
        label: 'Statutory Trademark Certificate',
        desc: 'Trademark custody certificate under KMM intellectual property custody.',
        mandatory: true,
      },
      {
        type: 'CONTRACT',
        label: 'Manufacturer Production & Warranty Agreement',
        desc: 'Executed supplier contract with safety and quality warranties.',
        mandatory: true,
      },
    ],
  },

  Digital: {
    cluster: 'Digital',
    clusterLabel: 'Digital Platforms, Apps & Interactive Games',
    inherentLiability: 'High',
    description: 'Streaming portals, mobile games, reading apps, and web interactive tools.',
    standardsReference: 'KMM Child Online Privacy Protection & Software Standard',
    gates: [
      {
        key: 'coppaChildPrivacyClearance',
        title: 'COPPA & Child Data Privacy Protection Validated',
        desc: 'Strict compliance with COPPA/GDPR-K: zero unauthorized tracking or data collection.',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'safeAdsInAppPolicy',
        title: 'Commercial Child Protection: No Predatory In-App Purchases',
        desc: 'Clean environment free of third-party behavioral ads and unauthorized monetization.',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'softwareCodeAssignment',
        title: 'Software Source Code & Developer IP Assignment Executed',
        desc: 'Full transfer of code repository, UI assets, and architecture to ministry custody.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'securityEncryptionAudit',
        title: 'Cloud Infrastructure & Data Encryption Security Cleared',
        desc: 'SSL/TLS encryption, secure child authentication, and vulnerability assessment passed.',
        pillar: 'Distribution',
        mandatory: false,
      },
    ],
    requiredDocuments: [
      {
        type: 'LICENSE',
        label: 'COPPA Child Privacy Policy & Terms of Service',
        desc: 'Published legal policy guaranteeing child data protection and privacy.',
        mandatory: true,
      },
      {
        type: 'DEED',
        label: 'Software Developer IP Assignment Deed',
        desc: 'Executed assignment of proprietary source code and game engines to KMM.',
        mandatory: true,
      },
    ],
  },

  Event: {
    cluster: 'Event',
    clusterLabel: 'Outreach & Ministry Event Formats',
    inherentLiability: 'Medium',
    description: 'Bible reading fiestas, kids conferences, live rallies, and festival blueprints.',
    standardsReference: 'KMM Outreach Format & Crowd Clearance Code',
    gates: [
      {
        key: 'biblicalAlignment',
        title: 'Doctrinal Alignment & Event Curriculum Validated',
        desc: 'Outreach program, scripture recitations, and ministerial teachings approved.',
        pillar: 'Doctrinal',
        mandatory: true,
      },
      {
        key: 'crowdRecordingNotice',
        title: 'Crowd Broadcast Notice & Attendee Recording Release Posted',
        desc: 'Notice to parents authorizing live streaming and broadcast photography at event.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'venueChildSafetyProtocol',
        title: 'Venue Child Safety, Emergency & Lost-Child Protocol Verified',
        desc: 'Comprehensive safety measures, verified stewards, and emergency protocols in place.',
        pillar: 'ChildSafety',
        mandatory: true,
      },
      {
        key: 'publicPerformanceMusicSync',
        title: 'Public Performance Music Clearance Verified',
        desc: 'Clearances for all live and playback musical tracks performed during the rally.',
        pillar: 'Distribution',
        mandatory: false,
      },
    ],
    requiredDocuments: [
      {
        type: 'DEED',
        label: 'Master Event Format & Program Blueprint',
        desc: 'Proprietary format document detailing program structure and brand assets.',
        mandatory: true,
      },
      {
        type: 'LICENSE',
        label: 'Crowd Media Broadcast Notice & Waiver',
        desc: 'Standard legal terms and notices regarding photography and live broadcasts.',
        mandatory: true,
      },
    ],
  },

  BrandIP: {
    cluster: 'BrandIP',
    clusterLabel: 'Foundational IP, Characters & Brand Custody',
    inherentLiability: 'High',
    description: 'Proprietary character turnaround rigs, mascots, master logos, and visual brand bibles.',
    standardsReference: 'KMM Master Trademark & Character IP Custody Policy',
    gates: [
      {
        key: 'characterPersonaClearance',
        title: 'Master Character Persona, Origin & Lore Cleared',
        desc: 'Character personality, visual appearance, and moral values align with ministry mission.',
        pillar: 'Doctrinal',
        mandatory: true,
      },
      {
        key: 'statutoryTrademarkRegistration',
        title: 'Statutory Trademark Registration & Custody Declaration',
        desc: 'Master character name, logo, and distinctive design registered under KMM custody.',
        pillar: 'Legal',
        mandatory: true,
      },
      {
        key: 'brandGuidelinesApproved',
        title: 'Multi-Agency Brand & Style Guidelines Formally Approved',
        desc: 'Standardized color palette, turnaround angles, typography, and permissible usage bible.',
        pillar: 'Distribution',
        mandatory: true,
      },
      {
        key: 'licensingExclusivityTerms',
        title: 'Licensing & Cross-Agency Permissible Use Terms Configured',
        desc: 'Clear definitions of which operational units may utilize the character/brand asset.',
        pillar: 'Distribution',
        mandatory: false,
      },
    ],
    requiredDocuments: [
      {
        type: 'CERT',
        label: 'Master Trademark Registration Certificate',
        desc: 'Statutory trademark filing or certificate of registration.',
        mandatory: true,
      },
      {
        type: 'DEED',
        label: 'Character Model Sheet & Turnaround Bible Deed',
        desc: 'Executed deed assigning original character designs, 3D rigs, and visual lore.',
        mandatory: true,
      },
    ],
  },
}

/**
 * Returns whether a gate check is considered cleared or exempt
 */
export function isGatePassed(val: any): boolean {
  if (val === true) return true
  if (val === 'CLEARED' || val === 'EXEMPT') return true
  if (typeof val === 'object' && val !== null) {
    return val.status === 'CLEARED' || val.status === 'EXEMPT'
  }
  return false
}

/**
 * Normalizes any gate check value into a standard GovernanceGateStatus
 */
export function getGateStatus(val: any): GovernanceGateStatus {
  if (val === true) return 'CLEARED'
  if (val === false || val === undefined || val === null) return 'PENDING'
  if (typeof val === 'string') {
    if (['CLEARED', 'IN_REVIEW', 'PENDING', 'EXEMPT', 'FLAGGED'].includes(val)) {
      return val as GovernanceGateStatus
    }
    return 'PENDING'
  }
  if (typeof val === 'object' && val !== null && val.status) {
    return val.status as GovernanceGateStatus
  }
  return 'PENDING'
}

/**
 * Returns structured details for a gate check (status, notes, attached document)
 */
export function getGateCheckValue(val: any): GovernanceCheckValue {
  const status = getGateStatus(val)
  if (typeof val === 'object' && val !== null) {
    return {
      status,
      notes: val.notes || '',
      documentName: val.documentName || '',
      documentId: val.documentId,
      verifiedAt: val.verifiedAt,
      verifiedBy: val.verifiedBy,
    }
  }
  return { status }
}

/**
 * Returns the compliance profile for a given category
 */
export function getCategoryComplianceProfile(category: string, assetName?: string): CategoryComplianceProfile {
  const cluster = getCategoryCluster(category, assetName)
  return CATEGORY_COMPLIANCE_STANDARDS[cluster]
}

/**
 * Evaluates the full compliance status of an asset against its category standard
 */
export function evaluateComplianceReadiness(
  asset: AssetData,
  rightsRecord?: RightsRecord | null,
  attachedDocs: RightsDocument[] = []
): {
  profile: CategoryComplianceProfile
  isReadyForApproval: boolean
  isFullyCompliant: boolean
  complianceScore: number
  missingMandatoryDocs: RequiredDocumentDefinition[]
  missingMandatoryGates: GovernanceGateDefinition[]
  missingContributorReleases: Array<{ contributorName: string; role: string }>
  totalGatesCount: number
  passedGatesCount: number
  riskTier: RiskTier
  summaryRecommendation: string
} {
  const profile = getCategoryComplianceProfile(asset.category, asset.name)
  const documents = attachedDocs.length > 0 ? attachedDocs : (rightsRecord?.documents || [])
  const checks = rightsRecord?.governanceChecks || {}

  // 1. Evaluate Governance Gates
  const gates = profile.gates
  let passedCount = 0
  const missingMandatoryGates: GovernanceGateDefinition[] = []

  gates.forEach((gate) => {
    const isPassed = isGatePassed(checks[gate.key])
    if (isPassed) {
      passedCount++
    } else if (gate.mandatory) {
      missingMandatoryGates.push(gate)
    }
  })

  const complianceScore = Math.round((passedCount / Math.max(1, gates.length)) * 100)

  // 2. Evaluate Category Mandatory Documents
  const missingMandatoryDocs: RequiredDocumentDefinition[] = []
  profile.requiredDocuments.forEach((docDef) => {
    if (docDef.mandatory) {
      const hasDoc = documents.some(
        (d) =>
          d.type === docDef.type ||
          d.name.toLowerCase().includes(docDef.label.toLowerCase()) ||
          d.name.toLowerCase().includes(docDef.type.toLowerCase())
      )
      if (!hasDoc) {
        missingMandatoryDocs.push(docDef)
      }
    }
  })

  // 3. Evaluate Individual Contributor Releases
  const contributors = asset.contributors || rightsRecord?.contributors || []
  const missingContributorReleases: Array<{ contributorName: string; role: string }> = []

  contributors.forEach((c) => {
    const hasRelease = documents.some(
      (d) =>
        (d.type === 'TALENT_RELEASE' || d.type === 'DEED') &&
        (d.assigneeName?.toLowerCase() === c.name.toLowerCase() ||
          d.name.toLowerCase().includes(c.name.toLowerCase()))
    )
    if (!hasRelease) {
      missingContributorReleases.push({ contributorName: c.name, role: c.role })
    }
  })

  // 4. Overall Readiness
  // To schedule approval, must have at least 1 legal document, no critical missing mandatory documents
  const hasMinDocuments = documents.length > 0
  const isReadyForApproval = hasMinDocuments && missingMandatoryDocs.length === 0
  const isFullyCompliant = complianceScore === 100 && missingMandatoryDocs.length === 0 && missingContributorReleases.length === 0

  // 5. Risk Tier Determination
  let riskTier: RiskTier = 'Low'
  if (documents.length === 0 || profile.inherentLiability === 'Critical' && missingMandatoryDocs.length > 0) {
    riskTier = 'Critical'
  } else if (missingMandatoryDocs.length > 0 || missingMandatoryGates.length > 0 || missingContributorReleases.length > 0) {
    riskTier = 'High'
  } else if (complianceScore < 100) {
    riskTier = 'Medium'
  } else {
    riskTier = 'Low'
  }

  // 6. Summary recommendation
  let summaryRecommendation = 'All category compliance checks and legal documentation are in order.'
  if (documents.length === 0) {
    summaryRecommendation = `Zero legal deeds attached. Upload category mandatory deeds (${profile.requiredDocuments[0]?.label}) before executive review.`
  } else if (missingMandatoryDocs.length > 0) {
    summaryRecommendation = `Missing category-mandatory document: "${missingMandatoryDocs[0].label}". Upload to unlock reviewer queue.`
  } else if (missingContributorReleases.length > 0) {
    summaryRecommendation = `${missingContributorReleases.length} individual contributor release(s) pending (${missingContributorReleases[0].contributorName}).`
  } else if (missingMandatoryGates.length > 0) {
    summaryRecommendation = `${missingMandatoryGates.length} mandatory governance check(s) pending verification.`
  }

  return {
    profile,
    isReadyForApproval,
    isFullyCompliant,
    complianceScore,
    missingMandatoryDocs,
    missingMandatoryGates,
    missingContributorReleases,
    totalGatesCount: gates.length,
    passedGatesCount: passedCount,
    riskTier,
    summaryRecommendation,
  }
}
