export type UserRole = 'super_admin' | 'reviewer' | 'agency_admin' | 'unit_admin'

export type UserSkill =
  | 'video_editor'
  | 'animation'
  | 'developer'
  | 'admin'
  | 'audio_producer'
  | 'writer'
  | 'designer'
  | 'legal_counsel'

export type Agency =
  | 'Lovetoons'
  | 'Publishing Agency'
  | 'Digital Agency'
  | 'Academy Agency'
  | 'Educational Agency'

// Backward-compatibility alias
export type OperationalUnit = Agency

export interface AssetContributor {
  id: string
  name: string
  role: string // e.g. 'Lead Animator', 'Scriptwriter', 'Voice Actor', 'Illustrator', 'Sound Producer', 'Curriculum Specialist', 'Software Developer'
  agency: Agency
  email?: string
  avatar?: string
  skills?: UserSkill[]
  contributionType?: 'Lead Author' | 'Core Creative' | 'Technical Specialist' | 'Contributing Artist' | 'Reviewer'
  joinedDate?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
  role: UserRole
  roleLabel: string
  agency: Agency
  unit?: Agency // Backward-compatibility
  skills: UserSkill[]
  bio?: string
}

export type AssetStatus =
  | 'In Production'
  | 'Discontinued'
  | 'Yet to Launch'
  | 'Under Review'
  | 'Approved'
  | 'Pending'
  | 'Requires Attention'
  | 'In Review'

export type AssetThumbType =
  | 'tv_series'
  | 'brave_boy'
  | 'logo'
  | 'zobo'
  | 'book'
  | 'comics'
  | 'event'
  | 'character_tilly'
  | 'theme_song'
  | 'brand_guidelines'

export interface AssetEpisode {
  id: string
  episodeNumber: number
  title: string
  durationMinutes?: number
  synopsis?: string
  airDate?: string
  status?: 'In Production' | 'Mastered' | 'Approved' | 'Broadcast Ready'
  videoUrl?: string
  scriptRef?: string
}

export interface AssetDynamicAttributes {
  // TV & Animation
  episodesCount?: number
  episodes?: AssetEpisode[]
  durationMinutes?: number
  seasonNumber?: number
  aspectRatio?: '16:9' | '4:3' | '21:9'
  resolution?: '4K UHD' | '1080p Full HD' | '720p HD'
  audioMix?: 'Stereo 2.0' | 'Surround 5.1' | 'Dolby Atmos'
  targetAgeGroup?: '3-5 Years' | '6-9 Years' | '10-14 Years' | 'All Ages'
  videoMasterUrl?: string
  cloudStorageNotice?: string

  // Music & Audio
  audioFormat?: 'WAV (24-bit/48kHz)' | 'FLAC' | 'MP3 (320kbps)'
  bpm?: number
  keySignature?: string
  lyricsAuthor?: string
  producer?: string
  vocalist?: string
  isrcCode?: string
  audioMasterUrl?: string

  // Publishing / Books / Comics
  pageCount?: number
  isbn?: string
  formatType?: 'Illustrated Hardcover' | 'E-Book (EPUB/PDF)' | 'Comic Strip' | 'Audiobook'
  volumeNumber?: number
  illustrator?: string

  // Consumer Product / Merchandise
  sku?: string
  manufacturer?: string
  dimensions?: string
  safetyClearance?: boolean
  targetMarket?: string

  // Brand / Character
  trademarkClass?: string
  has3DRig?: boolean
  colorPalette?: string[]
  voiceActor?: string

  // Digital Platform / Games (URL, Git, Server as requested)
  liveUrl?: string
  gitRepoUrl?: string
  serverHost?: string
  techStack?: string
  stagingUrl?: string
  apiDocsUrl?: string
  platformTarget?: 'Web' | 'iOS' | 'Android' | 'Cross-Platform'
  engineVersion?: string
  repositoryUrl?: string

  // Event / Outreach
  eventDate?: string
  venueLocation?: string
  liveStreamUrl?: string

  // Official Schedule & Legal Filing Metadata
  scheduleNumber?: number
  officialStatus?: string
  attorneyGeneralSchedule?: string
  governanceClearance?: string
  archiveStorageNotice?: string
  [key: string]: any
}

export interface ArchiveFileItem {
  id: string
  name: string
  format: string
  size: string
  type: 'video' | 'audio' | 'document' | '3d' | 'design' | 'code' | 'package'
  updatedDate: string
  downloadUrl?: string
  description?: string
  checksum?: string
}

export interface AssetArchive {
  // Digital / Web / Code Repository Links
  websiteUrl?: string
  serverUrl?: string
  serverStatus?: 'Online' | 'Maintenance' | 'Degraded'
  serverRegion?: string
  repositoryUrl?: string
  repositoryBranch?: string
  cloneCommand?: string
  documentationUrl?: string
  apiEndpoint?: string
  streamUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  
  // Archival Master Files & Storage
  primaryMasterFile?: string
  primaryMasterSize?: string
  masterFormat?: string
  archiveStorageLocation?: string
  retentionPolicy?: string
  files: ArchiveFileItem[]
}

export interface AssetData {
  id: string
  name: string
  type: string
  category: string
  categoryGroup: string
  subcategory: string
  agency: Agency
  unit?: Agency // Backward-compatibility
  creatorName?: string
  creatorRole?: string
  creatorSkill?: UserSkill
  contributors: AssetContributor[]
  status: AssetStatus
  createdDate: string
  createdTime: string
  thumbType?: AssetThumbType
  posterUrl?: string
  rightsHolder: string
  description: string
  tags: string[]
  attributes?: AssetDynamicAttributes
  fileSize?: string
  version?: string
  archive?: AssetArchive
  scheduleNumber?: number | string
  officialStatus?: string
  attorneyGeneralSchedule?: string
  governanceClearance?: string
  archiveStorageNotice?: string
}

export interface CategoryItem {
  id: string
  name: string
  description: string
  subcategoriesCount: number
  assetsCount: number
  status: 'Active' | 'Inactive'
  iconType: 'tv' | 'bible' | 'music' | 'edu' | 'character' | 'game' | 'event' | 'other'
  color: string
}

export interface SubcategoryItem {
  id: string
  name: string
  parentCategory: string
  assetsCount: number
  status: 'Active' | 'Inactive'
  iconType: 'tv' | 'bible' | 'music' | 'edu' | 'character' | 'game' | 'event' | 'other'
  color: string
}

export interface RightsDocument {
  id: string
  name: string
  size: string
  date: string
  type: 'PDF' | 'DOCX' | 'CERT' | 'LICENSE' | 'TALENT_RELEASE' | 'DEED' | string
  url?: string
  assigneeName?: string
  assigneeRole?: string
  targetScope?: 'individual' | 'asset'
  notes?: string
}

export interface RightsRecord {
  id: string
  assetId?: string
  name: string
  category: string
  categoryGroup?: string
  subcategory: string
  agency?: Agency
  unit?: Agency // Backward-compatibility
  contributors?: AssetContributor[]
  rightsType: string
  owner: string
  validity: string
  status: 'Cleared' | 'Review' | 'Pending' | 'Expired'
  territory?: string
  term?: string
  exclusivity?: string
  licenceType?: string
  royaltyTerms?: string
  thumbType: AssetThumbType
  description?: string
  governanceScore?: number
  documents?: RightsDocument[]
  governanceChecks?: Record<string, boolean>
}

export interface RelationshipItem {
  id: string
  sourceAssetId?: string
  sourceAsset: string
  sourceId: string
  sourceIconType: string
  relationshipType:
    | 'Used In'
    | 'Used By'
    | 'Applied To'
    | 'Appears In'
    | 'Distributed On'
    | 'Contains'
    | 'Related To'
    | 'Parent Of'
    | 'Derived From'
    | 'Soundtrack For'
    | 'Featured At'
  targetAssetId?: string
  targetAsset: string
  targetId: string
  targetIconType: string
  details: string
  createdDate: string
  createdTime: string
  category: string
}

export type ApprovalStatus = 'Pending' | 'Approved' | 'Declined' | 'Needs Feedback'

export interface ApprovalHistoryItem {
  stage: string
  author: string
  authorRole: string
  date: string
  status: string
  notes?: string
}

export interface ApprovalRequest {
  id: string
  assetId: string
  assetName: string
  category: string
  subcategory: string
  agency: Agency
  unit?: Agency // Backward-compatibility
  contributors?: AssetContributor[]
  requesterName: string
  requesterRole: string
  requesterSkill: UserSkill
  reviewerName: string
  stage: string
  currentStep: number
  totalSteps: number
  status: ApprovalStatus
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  submittedDate: string
  submittedTime: string
  feedbackNotes?: string
  history: ApprovalHistoryItem[]
  documents?: RightsDocument[]
  rightsType?: string
  territory?: string
  term?: string
  exclusivity?: string
  licenceType?: string
  royaltyTerms?: string
  description?: string
  governanceScore?: number
  governanceChecks?: Record<string, boolean>
}

export interface ActivityLog {
  id: string
  title: string
  subtitle: string
  time: string
  user: string
  agency?: string
  unit?: string // Backward-compatibility
  iconType: 'shield' | 'file' | 'check' | 'alert' | 'link' | 'user'
  color: string
  timestamp: number
  assetId?: string
  assetName?: string
  actionType?: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVAL' | 'GOVERNANCE' | 'DOCUMENT' | 'STATUS_CHANGE' | 'RESET'
  details?: string
  meta?: {
    assetId?: string
    assetName?: string
    actionType?: string
    details?: string
  }
}

export type NotificationType = 'approval' | 'governance' | 'document' | 'asset' | 'activity'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  subtitle: string
  time: string
  timestamp: number
  read: boolean
  targetTab: string
  assetId?: string
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent'
  badge?: string
  badgeColor?: string
  agency?: string
}

export type RiskTier = 'Low' | 'Medium' | 'High' | 'Critical'

export interface AssetRiskAssessment {
  level: RiskTier
  score: number // 0-100 scale
  category: 'Operational' | 'Chain of Title' | 'Pre-Launch' | 'Cleared'
  primaryVector: string
  remediationAction: string
  riskBadgeColor: string
  riskTextColor: string
  exposureSummary: string
}
