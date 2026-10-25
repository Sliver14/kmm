/**
 * Kiddies Media Ministries (KMM) - Intellectual Asset Categories & Governance Register
 * 
 * Normalized category governance framework based on official document:
 * "INTELLECTUAL ASSET CATEGORIES & GOVERNANCE REGISTER"
 * Prepared by: Head of Digital Transformation and Innovations Office
 * 
 * Rules:
 * 1. Asset category and operational status are separate fields.
 * 2. Parent assets and sub-assets are identifiable according to approved category hierarchy:
 *    - Animated Programme and TV Programme use Product → Episodes
 *    - Publishing / Book and Publishing / Comics use Product → Volumes
 *    - Digital / Interactive Platform uses Product → Releases / Versions
 *    - Outreach / Event Format uses Product → Event Editions / Instances
 *    - Brand uses Versions
 *    - Categories marked "nil" have no defined sub-asset hierarchy
 */

export type SubAssetHierarchy =
  | 'Product → Episodes'
  | 'Product → Volumes'
  | 'Product → Releases / Versions'
  | 'Product → Event Editions / Instances'
  | 'Versions'
  | 'nil'

export type SubAssetType =
  | 'episodes'
  | 'volumes'
  | 'releases'
  | 'event_instances'
  | 'versions'
  | 'none'

export interface CategoryGovernanceRule {
  /** Canonical category name */
  category: string
  /** Approved sub-asset hierarchy */
  subAssetStructure: SubAssetHierarchy
  /** Whether this category supports production episodes */
  supportsEpisodes: boolean
  /** Machine-readable sub-asset type */
  subAssetType: SubAssetType
  /** Display label for sub-assets */
  subAssetLabel: string
  /** Whether category has a defined sub-asset hierarchy */
  hasHierarchy: boolean
  /** Description of hierarchy governance purpose */
  hierarchyGovernanceNote: string
  /** Core rights & governance to track (Section 2) */
  coreRightsToTrack: string[]
  /** Typical approval & control points (Section 2) */
  approvalControlPoints: string[]
  /** Primary asset relations (Section 3 & 4) */
  primaryAssetRelations: string[]
}

export const CATEGORY_GOVERNANCE_FRAMEWORK: Record<string, CategoryGovernanceRule> = {
  'Animated Programme': {
    category: 'Animated Programme',
    subAssetStructure: 'Product → Episodes',
    supportsEpisodes: true,
    subAssetType: 'episodes',
    subAssetLabel: 'Episodes',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Parent-Child. An Episode is a defined sub-asset of the parent Product and tracks rights, approvals, and files separately.',
    coreRightsToTrack: [
      'Product title/concept and programme bible',
      'Scripts and story materials',
      'Character and visual assets',
      'Animation production files and masters',
      'Voice/performer releases',
      'Music and sound',
      'Copyright ownership/assignments',
      'Episode-level rights and materials',
      'Broadcast/streaming/digital distribution',
      'Translation/dubbing/subtitle rights',
      'Adaptation and merchandising rights',
      'Archive/master custody',
    ],
    approvalControlPoints: [
      'Product/concept approval',
      'Chain-of-title verification',
      'Creator/contributor clearance',
      'Character/art approval',
      'Voice/talent releases',
      'Music/third-party clearance',
      'Episode approval',
      'Final episode master/version approval',
      'Licensing/distribution approval',
    ],
    primaryAssetRelations: [
      'Uses / contains → Characters',
      'May incorporate → Music / Audio',
      'May be distributed via → Digital Platforms',
      'May use → Brand assets',
    ],
  },

  'TV Programme': {
    category: 'TV Programme',
    subAssetStructure: 'Product → Episodes',
    supportsEpisodes: true,
    subAssetType: 'episodes',
    subAssetLabel: 'Episodes',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Parent-Child. An Episode is a defined sub-asset of the parent Product and tracks rights, approvals, and files separately.',
    coreRightsToTrack: [
      'Product title/format',
      'Programme materials',
      'Scripts',
      'Episode masters',
      'Contributor/talent releases',
      'Presenter/performer rights',
      'Music and footage clearances',
      'Copyright chain of title',
      'Broadcast/streaming/digital distribution rights',
      'Clip/promotional use',
      'Territory, term and exclusivity',
      'Archive/master files',
    ],
    approvalControlPoints: [
      'Product/format approval',
      'Ownership/chain-of-title verification',
      'Contributor/talent clearance',
      'Editorial/content approval',
      'Music/footage clearance',
      'Territory/term/exclusivity approval',
      'Episode approval',
      'Final episode/master approval',
      'Licensing/distribution approval',
    ],
    primaryAssetRelations: [
      'Uses / displays → Brand assets',
      'May contain → Characters and Music / Audio',
      'May reference/adapt → Publications',
      'May be distributed via → Digital Platforms',
    ],
  },

  'Documentary / Video': {
    category: 'Documentary / Video',
    subAssetStructure: 'nil',
    supportsEpisodes: false,
    subAssetType: 'none',
    subAssetLabel: 'Single Master Work',
    hasHierarchy: false,
    hierarchyGovernanceNote: 'Standalone single master asset. No defined sub-asset hierarchy in this register.',
    coreRightsToTrack: [
      'Documentary/video concept',
      'Final master',
      'Source footage',
      'Interviews and releases',
      'Archive/photos',
      'Music',
      'Graphics',
      'Narration',
      'Location permissions',
      'Third-party clearances',
      'Copyright chain of title',
      'Broadcast/streaming/digital rights',
      'Clip/promotional use',
      'Territory and term',
      'Archive/master custody',
    ],
    approvalControlPoints: [
      'Concept/commissioning approval',
      'Chain-of-title verification',
      'Interview/location/archive clearance',
      'Music/third-party clearance',
      'Editorial approval',
      'Final cut/master approval',
      'Distribution/licensing approval',
    ],
    primaryAssetRelations: [
      'May incorporate → Music / Audio, third-party footage and contributor materials',
      'May use → Brand assets',
      'May be distributed via → Digital Platforms / TV',
    ],
  },

  'Film / Short Movie': {
    category: 'Film / Short Movie',
    subAssetStructure: 'nil',
    supportsEpisodes: false,
    subAssetType: 'none',
    subAssetLabel: 'Single Film Master',
    hasHierarchy: false,
    hierarchyGovernanceNote: 'Standalone single master theatrical or festival asset. No sub-asset hierarchy.',
    coreRightsToTrack: [
      'Screenplay/story',
      'Production agreements',
      'Cast/performer releases',
      'Final film master',
      'Music',
      'Artwork',
      'Footage',
      'Location permissions',
      'Copyright ownership',
      'Distribution/streaming/broadcast rights',
      'Promotional/clip rights',
      'Territory, term and exclusivity',
      'Archive/master custody',
    ],
    approvalControlPoints: [
      'Script/production approval',
      'Ownership/chain-of-title verification',
      'Cast/crew releases',
      'Music/footage/location clearance',
      'Final cut approval',
      'Master/version approval',
      'Distribution/licensing approval',
    ],
    primaryAssetRelations: [
      'May use → Characters, Music / Audio and Brand assets',
      'May be distributed via → Digital Platforms / TV',
    ],
  },

  'Consumer Product / Merchandise': {
    category: 'Consumer Product / Merchandise',
    subAssetStructure: 'nil',
    supportsEpisodes: false,
    subAssetType: 'none',
    subAssetLabel: 'Product / SKU',
    hasHierarchy: false,
    hierarchyGovernanceNote: 'Single product line/SKU. Merchandising licence derived from underlying character, brand, or programme IP.',
    coreRightsToTrack: [
      'Underlying IP/character/brand licence',
      'Product design/artwork',
      'Trademark/brand use',
      'Manufacturing rights',
      'Territory',
      'Product categories',
      'Exclusivity',
      'Quality control',
      'Packaging/marketing approval',
      'Royalty/revenue terms',
      'Term and termination',
      'Supplier/manufacturer agreements',
    ],
    approvalControlPoints: [
      'Underlying IP clearance',
      'Trademark/brand-use approval',
      'Product design approval',
      'Licence/manufacturing approval',
      'Packaging and marketing approval',
      'Quality-control approval',
      'Territory/term/exclusivity approval',
      'Royalty/commercial approval',
    ],
    primaryAssetRelations: [
      'Derived from / uses → Characters, Brand, Programme or other underlying IP',
      'May be sold through → Digital Platforms / Events',
    ],
  },

  'Publishing / Book': {
    category: 'Publishing / Book',
    subAssetStructure: 'Product → Volumes',
    supportsEpisodes: false,
    subAssetType: 'volumes',
    subAssetLabel: 'Volumes',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Parent-Child. A Volume is a defined sub-asset of the parent Book Product with distinct Asset ID, approvals, and publication evidence.',
    coreRightsToTrack: [
      'Product title/concept',
      'Manuscript/content',
      'Volume manuscripts',
      'Illustrations/artwork',
      'Cover',
      'Editorial/master files',
      'Copyright ownership',
      'Publication/reproduction/distribution rights',
      'Print and digital rights',
      'Translation/adaptation',
      'Territory, term and volume control',
      'Contributor agreements',
    ],
    approvalControlPoints: [
      'Product/publication approval',
      'Manuscript/editorial approval',
      'Author/contributor clearance',
      'Artwork/cover approval',
      'Chain-of-title verification',
      'Print/digital publication approval',
      'Translation/adaptation approval',
      'Volume approval',
      'Final volume/version approval',
    ],
    primaryAssetRelations: [
      'May use → Brand and Characters',
      'May be adapted into / referenced by → TV Programmes, Animation or Digital Content',
    ],
  },

  'Publishing / Comics': {
    category: 'Publishing / Comics',
    subAssetStructure: 'Product → Volumes',
    supportsEpisodes: false,
    subAssetType: 'volumes',
    subAssetLabel: 'Volumes',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Parent-Child. A Volume is a defined sub-asset of the parent Comics Product with distinct Asset ID and publication evidence.',
    coreRightsToTrack: [
      'Product title/concept',
      'Story/script',
      'Illustrations',
      'Characters',
      'Cover',
      'Volume masters',
      'Copyright chain of title',
      'Creator/contributor rights',
      'Print/digital publication',
      'Reproduction/distribution',
      'Translation/adaptation',
      'Merchandising and audiovisual adaptation permissions',
      'Editorial files',
    ],
    approvalControlPoints: [
      'Product/series concept approval',
      'Character approval',
      'Creator/contributor clearance',
      'Artwork/editorial approval',
      'Chain-of-title verification',
      'Volume approval',
      'Print/digital publication approval',
      'Adaptation/merchandising approval',
    ],
    primaryAssetRelations: [
      'Uses / depicts → Characters and Brand assets',
      'May be adapted into → TV Programmes / Series, Animation or Merchandise',
    ],
  },

  'Digital / Interactive Platform': {
    category: 'Digital / Interactive Platform',
    subAssetStructure: 'Product → Releases / Versions',
    supportsEpisodes: false,
    subAssetType: 'releases',
    subAssetLabel: 'Releases / Versions',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Parent-Child. Releases and versions track code commits, deployment channels, and app-store approvals separately.',
    coreRightsToTrack: [
      'Platform/product identity',
      'Software/code',
      'UI/UX',
      'Platform brand',
      'Content library',
      'Domain/app-store accounts',
      'Source-code ownership',
      'Third-party software/assets',
      'Data/privacy governance',
      'Distribution/platform rights',
      'Release/version records',
      'Licensing',
      'Security and access control',
    ],
    approvalControlPoints: [
      'Platform/product ownership verification',
      'Source-code and third-party licence review',
      'Brand/domain/account control',
      'Privacy/security approval',
      'Release/version approval',
      'Content-rights clearance',
      'App-store/domain publication approval',
    ],
    primaryAssetRelations: [
      'Hosts / distributes → TV Programmes, Animation, Publications, Music / Audio and other content',
      'Uses → Brand assets',
    ],
  },

  'Outreach / Event Format': {
    category: 'Outreach / Event Format',
    subAssetStructure: 'Product → Event Editions / Instances',
    supportsEpisodes: false,
    subAssetType: 'event_instances',
    subAssetLabel: 'Event Editions / Instances',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Parent-Child. An Event Edition / Instance is a defined sub-asset of the parent format with distinct date, venue, and recording rights.',
    coreRightsToTrack: [
      'Product/event format',
      'Event name/brand',
      'Programme materials',
      'Scripts/content',
      'Venue and event agreements',
      'Presenter/performer releases',
      'Recording/photo rights',
      'Sponsorship',
      'Merchandising',
      'Broadcast/streaming',
      'Territory/date',
      'Promotional assets',
      'Rights and approvals for each event edition/instance',
    ],
    approvalControlPoints: [
      'Format/product approval',
      'Brand/event-name approval',
      'Venue/sponsor agreements',
      'Presenter/performer releases',
      'Recording/photo consent',
      'Content approval',
      'Merchandising/broadcast approval',
      'Event edition/instance approval',
    ],
    primaryAssetRelations: [
      'Uses → Brand, Characters, Programmes and Music / Audio',
      'May generate → Recordings / Promotional Assets; may feature Merchandise',
    ],
  },

  'Character / Named IP': {
    category: 'Character / Named IP',
    subAssetStructure: 'nil',
    supportsEpisodes: false,
    subAssetType: 'none',
    subAssetLabel: 'Character IP Master',
    hasHierarchy: false,
    hierarchyGovernanceNote: 'Proprietary character design and bible. Underlying IP embodied across programmes, merchandise, and books.',
    coreRightsToTrack: [
      'Character name',
      'Visual designs',
      'Descriptions/bible',
      'Copyright evidence',
      'Trademark status where applicable',
      'Creator/commissioning records',
      'Approved depictions',
      'Adaptation rights',
      'Merchandising/licensing',
      'Publicity/performer issues where applicable',
      'Approved-use rules',
    ],
    approvalControlPoints: [
      'Character creation/ownership verification',
      'Design/depiction approval',
      'Trademark clearance where applicable',
      'Approved-use approval',
      'Adaptation/licensing approval',
      'Merchandising approval',
      'Controlled character asset release',
    ],
    primaryAssetRelations: [
      'Used by / depicted in → TV Programmes, Animation, Comics, Merchandise, Digital Platforms and Events',
    ],
  },

  'Music / Audio': {
    category: 'Music / Audio',
    subAssetStructure: 'nil',
    supportsEpisodes: false,
    subAssetType: 'none',
    subAssetLabel: 'Master Audio Track',
    hasHierarchy: false,
    hierarchyGovernanceNote: 'Single musical composition and sound recording master. Synchronized across video and broadcast formats.',
    coreRightsToTrack: [
      'Composition/lyrics',
      'Sound recording/master',
      'Performers',
      'Producers',
      'Songwriter/publisher records',
      'Copyright/related-rights chain',
      'Reproduction/streaming/broadcast/public-performance permissions',
      'Synchronization',
      'Adaptation',
      'Territory/term',
      'Metadata and release records',
    ],
    approvalControlPoints: [
      'Composition ownership verification',
      'Performer/producer clearance',
      'Master ownership verification',
      'Sync/public-performance clearance',
      'Release/version approval',
      'Licensing approval',
      'Territory/term approval',
    ],
    primaryAssetRelations: [
      'May be synchronized / used in → TV Programmes, Animation, Film, Events and Digital Content',
    ],
  },

  'Brand': {
    category: 'Brand',
    subAssetStructure: 'Versions',
    supportsEpisodes: false,
    subAssetType: 'versions',
    subAssetLabel: 'Brand Versions',
    hasHierarchy: true,
    hierarchyGovernanceNote: 'Master identity suite. Tracks wordmarks, logo applications, brand bibles, and versioned brand guidelines.',
    coreRightsToTrack: [
      'Brand name',
      'Wordmark',
      'Logo/device marks',
      'Tagline/slogan where applicable',
      'Trademark searches/applications/registrations',
      'Domain names and relevant channel/account identifiers',
      'Brand guidelines',
      'Approved colour/typography/artwork assets',
      'Goodwill/use history',
      'Licensing and permitted brand uses',
      'Co-branding/sponsorship rules',
      'Territory, classes/categories and term where applicable',
      'Brand version records',
    ],
    approvalControlPoints: [
      'Brand creation and ownership verification',
      'Trademark clearance/registration decision',
      'Wordmark/logo approval',
      'Brand-guideline approval',
      'Brand version approval',
      'Approval for use on TV programmes, digital platforms, publications, merchandise, events and promotional materials',
      'Licensing/co-branding approval',
      'Controlled use of official brand assets',
    ],
    primaryAssetRelations: [
      'Applied to / identifies → TV Programmes, Digital Platforms, Publications, Merchandise, Events and promotional materials',
      'Logo/Wordmark → relates to each approved brand application',
    ],
  },
}

// Alias for "Brand & Guidelines" in portal UI
CATEGORY_GOVERNANCE_FRAMEWORK['Brand & Guidelines'] = {
  ...CATEGORY_GOVERNANCE_FRAMEWORK['Brand'],
  category: 'Brand & Guidelines',
}

/**
 * Normalizes any category string or synonym to match the official category governance rule.
 */
export function normalizeCategoryName(rawCategory: string = ''): string {
  const cat = rawCategory.trim().toLowerCase()

  if (cat.includes('animated') || cat === 'animation') {
    return 'Animated Programme'
  }
  if (cat.includes('tv programme') || cat.includes('tv series') || cat.includes('audiovisual programme')) {
    return 'TV Programme'
  }
  if (cat.includes('documentary')) {
    return 'Documentary / Video'
  }
  if (cat.includes('short movie') || cat.includes('film')) {
    return 'Film / Short Movie'
  }
  if (cat.includes('consumer') || cat.includes('merchandise')) {
    return 'Consumer Product / Merchandise'
  }
  if (cat.includes('comics')) {
    return 'Publishing / Comics'
  }
  if (cat.includes('publishing') || cat.includes('book') || cat.includes('publication')) {
    return 'Publishing / Book'
  }
  if (cat.includes('digital') || cat.includes('interactive') || cat.includes('platform')) {
    return 'Digital / Interactive Platform'
  }
  if (cat.includes('outreach') || cat.includes('event')) {
    return 'Outreach / Event Format'
  }
  if (cat.includes('character') || cat.includes('named ip')) {
    return 'Character / Named IP'
  }
  if (cat.includes('music') || cat.includes('audio') || cat.includes('song')) {
    return 'Music / Audio'
  }
  if (cat.includes('brand')) {
    return 'Brand'
  }

  return rawCategory.trim()
}

/**
 * Resolves the governance rule for a given category name.
 */
export function getCategoryGovernance(rawCategory: string = ''): CategoryGovernanceRule {
  const canonical = normalizeCategoryName(rawCategory)
  if (CATEGORY_GOVERNANCE_FRAMEWORK[canonical]) {
    return CATEGORY_GOVERNANCE_FRAMEWORK[canonical]
  }

  // Fallback for unknown categories
  return {
    category: rawCategory || 'General Asset',
    subAssetStructure: 'nil',
    supportsEpisodes: false,
    subAssetType: 'none',
    subAssetLabel: 'Single Asset',
    hasHierarchy: false,
    hierarchyGovernanceNote: 'No defined sub-asset hierarchy in this register.',
    coreRightsToTrack: ['Copyright ownership', 'Title clearance', 'Distribution rights'],
    approvalControlPoints: ['Concept approval', 'Final asset sign-off'],
    primaryAssetRelations: [],
  }
}

/**
 * Determines whether a given category supports production episodes.
 * Strictly according to Section 1 & Section 2:
 * ONLY "Animated Programme" and "TV Programme" (Product → Episodes) support episodes.
 */
export function isEpisodeCategory(rawCategory: string = ''): boolean {
  const rule = getCategoryGovernance(rawCategory)
  return rule.supportsEpisodes === true && rule.subAssetStructure === 'Product → Episodes'
}

/**
 * Convenience helper to check if an asset object belongs to an episode-enabled category.
 */
export function assetSupportsEpisodes(asset: { category?: string } | null | undefined): boolean {
  if (!asset?.category) return false
  return isEpisodeCategory(asset.category)
}

/**
 * Returns the approved sub-asset structure label (e.g. 'Product → Episodes') for an asset.
 */
export function getAssetSubAssetStructure(asset: { category?: string } | null | undefined): SubAssetHierarchy {
  if (!asset?.category) return 'nil'
  return getCategoryGovernance(asset.category).subAssetStructure
}

/**
 * List of all official categories that support episodes.
 */
export const EPISODE_ENABLED_CATEGORIES = ['Animated Programme', 'TV Programme'] as const
