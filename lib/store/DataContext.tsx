'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import {
  UserProfile,
  AssetData,
  CategoryItem,
  SubcategoryItem,
  RightsRecord,
  RelationshipItem,
  ApprovalRequest,
  ActivityLog,
  AssetContributor,
  Agency,
  NotificationItem,
  ContentProvenance,
} from '@/types'
import {
  initialUsers,
  initialCategories,
  initialSubcategories,
  initialAssetsData,
  initialRightsRecords,
  initialRelationships,
  initialApprovals,
  initialActivityLogs,
} from '@/lib/data/initialData'
import { sortDiscontinuedToBottom } from '@/lib/risk'

export interface PlatformStats {
  totalAssets: number
  approvedAssets: number
  pendingAssets: number
  attentionAssets: number
  inReviewAssets: number
  totalRelationships: number
  connectedAssetsCount: number
  totalRights: number
  clearedRightsCount: number
  pendingApprovalsCount: number
}

interface DataContextType {
  // Initialization
  isInitialized: boolean

  // Users & Role & Auth
  currentUser: UserProfile
  setCurrentUser: (user: UserProfile) => void
  availableUsers: UserProfile[]
  isAuthenticated: boolean
  login: (emailOrUser: string | UserProfile, password?: string) => Promise<boolean> | boolean
  logout: () => void
  canApprove: boolean
  isSuperAdmin: boolean
  isReviewer: boolean
  isAgencyAdmin: boolean
  isUnitAdmin: boolean // backward-compatibility alias
  isGlobalViewer: boolean
  userAgency: Agency

  // Assets (Role-scoped: Global for Super Admin & Reviewer, Agency-scoped for Agency Reps)
  assets: AssetData[]
  allAssets: AssetData[]
  addAsset: (asset: Omit<AssetData, 'id' | 'createdDate' | 'createdTime'> & { id?: string }) => AssetData
  updateAsset: (asset: AssetData) => void
  deleteAsset: (id: string) => void
  bulkApproveAssets: (ids: string[]) => void
  bulkDeleteAssets: (ids: string[]) => void

  // Categories & Subcategories
  categories: CategoryItem[]
  subcategories: SubcategoryItem[]
  addCategory: (cat: Omit<CategoryItem, 'id' | 'subcategoriesCount' | 'assetsCount'>) => CategoryItem
  updateCategory: (cat: CategoryItem) => void
  deleteCategory: (id: string) => void
  addSubcategory: (sub: Omit<SubcategoryItem, 'id' | 'assetsCount'>) => SubcategoryItem
  updateSubcategory: (sub: SubcategoryItem) => void
  deleteSubcategory: (id: string) => void

  // Rights & Governance (Role-scoped)
  rightsRecords: RightsRecord[]
  allRightsRecords: RightsRecord[]
  addRightsRecord: (record: Omit<RightsRecord, 'id'> & { id?: string }) => RightsRecord
  updateRightsRecord: (record: RightsRecord) => void
  deleteRightsRecord: (id: string) => void

  // Relationships (Role-scoped)
  relationships: RelationshipItem[]
  allRelationships: RelationshipItem[]
  addRelationship: (rel: Omit<RelationshipItem, 'id' | 'createdDate' | 'createdTime'>) => RelationshipItem
  deleteRelationship: (id: string) => void

  // Approvals (Role-scoped)
  approvals: ApprovalRequest[]
  allApprovals: ApprovalRequest[]
  approveRequest: (approvalId: string, reviewerNotes?: string) => void
  declineRequest: (approvalId: string, reason: string) => void
  requestFeedback: (approvalId: string, feedbackNotes: string) => void
  createApprovalRequest: (assetId: string, priority?: ApprovalRequest['priority']) => ApprovalRequest

  // Activity Logs (Role-scoped)
  activities: ActivityLog[]
  allActivities: ActivityLog[]
  addActivity: (
    title: string,
    subtitle: string,
    iconType?: ActivityLog['iconType'],
    color?: string,
    agency?: Agency,
    meta?: {
      assetId?: string
      assetName?: string
      actionType?: ActivityLog['actionType']
      details?: string
    }
  ) => void

  // Notifications (Interactive & Persistent)
  notifications: NotificationItem[]
  allNotifications: NotificationItem[]
  unreadNotificationsCount: number
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'time'> & { id?: string }) => NotificationItem
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  toggleNotificationRead: (id: string) => void
  dismissNotification: (id: string) => void
  clearAllNotifications: () => void

  // Stats & Utilities
  stats: PlatformStats
  globalStats: PlatformStats
  resetToDefaultData: () => void
  toastMessage: string | null
  showToast: (msg: string) => void
  dismissToast: () => void
}

const STORAGE_KEY = 'kmp_platform_data_v10'
const USER_KEY = 'kmp_current_user_v9'
const AUTH_KEY = 'kmp_auth_state_v9'
const NOTIF_KEY = 'kmp_notifications_v3'

const defaultInitialNotifications: NotificationItem[] = [
  {
    id: 'notif-init-1',
    type: 'approval',
    title: 'Approval Scheduled: Super Book Adventures',
    subtitle: 'Submitted for Review with legal deeds & talent release attached',
    time: 'Today, 10:45 AM',
    timestamp: Date.now() - 3600000,
    read: false,
    targetTab: 'Approvals',
    assetId: 'KMP-TV-001',
    priority: 'High',
    badge: 'High Priority',
    badgeColor: 'bg-amber-100 text-amber-800',
    agency: 'Lovetoons',
  },
  {
    id: 'notif-init-2',
    type: 'governance',
    title: 'Governance Cleared: Pastor Chris Animated Sermons',
    subtitle: '100% Governance checklist completed with chain of title deeds',
    time: 'Yesterday, 4:20 PM',
    timestamp: Date.now() - 86400000,
    read: false,
    targetTab: 'Rights & Governance',
    assetId: 'KMP-TV-002',
    priority: 'Medium',
    badge: 'Governance 100%',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    agency: 'Lovetoons',
  },
  {
    id: 'notif-init-3',
    type: 'document',
    title: 'Document Uploaded: Talent Release Form - Master',
    subtitle: 'Document verified and attached to asset rights registry',
    time: '2 days ago',
    timestamp: Date.now() - 172800000,
    read: true,
    targetTab: 'Rights & Governance',
    assetId: 'KMP-TV-001',
    priority: 'Low',
    badge: 'Document Added',
    badgeColor: 'bg-blue-100 text-blue-800',
    agency: 'Lovetoons',
  },
  {
    id: 'notif-init-4',
    type: 'asset',
    title: 'Asset Registered: Little David Storybook Vol 1',
    subtitle: 'Registered by Publishing Agency with 3 contributors',
    time: '3 days ago',
    timestamp: Date.now() - 259200000,
    read: true,
    targetTab: 'Assets',
    assetId: 'KMP-PU-001',
    priority: 'Medium',
    badge: 'New Asset',
    badgeColor: 'bg-purple-100 text-purple-800',
    agency: 'Publishing Agency',
  },
]

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Loaded state
  const [isInitialized, setIsInitialized] = useState(false)

  // Current User & Auth
  const [currentUser, setCurrentUserState] = useState<UserProfile>(initialUsers[0])
  const [availableUsers] = useState<UserProfile[]>(initialUsers)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)

  // Core Data Stores (Master Global Collections)
  const [masterAssets, setMasterAssets] = useState<AssetData[]>(initialAssetsData)
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>(initialSubcategories)
  const [masterRightsRecords, setMasterRightsRecords] = useState<RightsRecord[]>(initialRightsRecords)
  const [masterRelationships, setMasterRelationships] = useState<RelationshipItem[]>(initialRelationships)
  const [masterApprovals, setMasterApprovals] = useState<ApprovalRequest[]>(initialApprovals)
  const [masterActivities, setMasterActivities] = useState<ActivityLog[]>(initialActivityLogs)
  const [masterNotifications, setMasterNotifications] = useState<NotificationItem[]>(defaultInitialNotifications)

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const dismissToast = useCallback(() => {
    setToastMessage(null)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 4000)
  }, [])

  // Load from LocalStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const parsed = JSON.parse(storedData)
          if (parsed.assets && Array.isArray(parsed.assets)) {
            // Preserve official status from Schedule / DB
            const migrated = parsed.assets.map((a: any) => ({
              ...a,
              status: a.status || 'In Production',
              agency: a.agency || a.unit || 'Lovetoons',
              unit: a.agency || a.unit || 'Lovetoons',
              contributors: a.contributors || [],
              rightsHolder: a.rightsHolder || 'Lovetoons / KMM Network',
            }))
            // If stored assets is missing newly catalogued items, fallback to full initialAssetsData
            if (migrated.length < initialAssetsData.length) {
              setMasterAssets(initialAssetsData)
            } else {
              setMasterAssets(migrated)
            }
          }
          if (parsed.categories) setCategories(parsed.categories)
          if (parsed.subcategories) setSubcategories(parsed.subcategories)
            // Sanitize rights records: strip legacy demo placeholders if unfiled
            setMasterRightsRecords(
              parsed.rightsRecords.map((r: any) => {
                const docs = Array.isArray(r.documents) ? r.documents : []
                const hasDocs = docs.length > 0
                const isAudio = r.category?.toLowerCase().includes('audio') || r.category?.toLowerCase().includes('music')

                return {
                  ...r,
                  agency: r.agency || r.unit || 'Lovetoons',
                  unit: r.agency || r.unit || 'Lovetoons',
                  documents: docs,
                  status: r.status || 'Cleared',
                  governanceScore: r.governanceScore ?? (hasDocs ? 92 : 80),
                  owner: 'Esteemed Executive Minister (Pastor Chelsea Kalu)',
                  ownerCertificateRef: r.ownerCertificateRef || 'CERT-EXEC-MIN-2026-HQ',
                  trademarkStatus: r.trademarkStatus || 'Registered',
                  distributionLicense: r.distributionLicense || 'Exclusive Ministry Global Distribution',
                  productionLicensees: r.productionLicensees || 'Lovetoons Animation Studio, KMM Publishing, LoveWorld Media',
                  territory: r.territory || 'Worldwide / Global',
                  territoryClearanceStatus: r.territoryClearanceStatus || 'Cleared Global',
                  contentProvenance: r.contentProvenance || (isAudio ? 'Fully Custom' : 'AI Assisted'),
                  songWriter: r.songWriter || (isAudio ? 'KMM Music Ministry (Staff Composer)' : undefined),
                  songWriterProvenance: r.songWriterProvenance || (isAudio ? 'Fully Custom' : undefined),
                  governanceChecks: r.governanceChecks || {},
                }
              })
            )
          if (parsed.relationships) setMasterRelationships(parsed.relationships)
          if (parsed.approvals) {
            setMasterApprovals(
              parsed.approvals.map((app: any) => ({
                ...app,
                agency: app.agency || app.unit || 'Lovetoons',
                unit: app.agency || app.unit || 'Lovetoons',
                documents: app.documents || [],
              }))
            )
          }
          if (parsed.activities) setMasterActivities(parsed.activities)
        }

        const storedNotifs = localStorage.getItem(NOTIF_KEY)
        if (storedNotifs) {
          try {
            const parsedNotifs = JSON.parse(storedNotifs)
            if (Array.isArray(parsedNotifs)) {
              setMasterNotifications(parsedNotifs)
            }
          } catch (e) {
            console.error('Failed to parse stored notifications', e)
          }
        }

        const storedUserId = localStorage.getItem(USER_KEY)
        if (storedUserId) {
          const foundUser = initialUsers.find((u) => u.id === storedUserId)
          if (foundUser) setCurrentUserState(foundUser)
        }

        const storedAuth = localStorage.getItem(AUTH_KEY)
        if (storedAuth === 'false') {
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(true)
        }
      }
    } catch (e) {
      console.error('Failed to load storage data', e)
    } finally {
      setIsInitialized(true)
    }

    // Connect to live Neon DB APIs
    const syncWithBackend = async () => {
      try {
        const [assetsRes, rightsRes, approvalsRes, relsRes] = await Promise.all([
          fetch('/api/assets').then((r) => r.json()).catch(() => null),
          fetch('/api/rights').then((r) => r.json()).catch(() => null),
          fetch('/api/approvals').then((r) => r.json()).catch(() => null),
          fetch('/api/relationships').then((r) => r.json()).catch(() => null),
        ])

        if (assetsRes?.success && Array.isArray(assetsRes.assets) && assetsRes.assets.length > 0) {
          const cleanAssets = assetsRes.assets.map((a: any) => ({
            ...a,
            status: a.status || 'Pending',
          }))
          setMasterAssets(cleanAssets)
        }
        if (rightsRes?.success && Array.isArray(rightsRes.records) && rightsRes.records.length > 0) {
          const sanitizedRecords = rightsRes.records.map((r: any) => {
            const docs = Array.isArray(r.documents) ? r.documents : []
            const hasDocs = docs.length > 0
            const isAudio = r.category?.toLowerCase().includes('audio') || r.category?.toLowerCase().includes('music')

            return {
              ...r,
              documents: docs,
              status: r.status || 'Cleared',
              governanceScore: r.governanceScore ?? (hasDocs ? 92 : 80),
              owner: 'Esteemed Executive Minister (Pastor Chelsea Kalu)',
              ownerCertificateRef: r.ownerCertificateRef || 'CERT-EXEC-MIN-2026-HQ',
              trademarkStatus: r.trademarkStatus || 'Registered',
              distributionLicense: r.distributionLicense || 'Exclusive Ministry Global Distribution',
              productionLicensees: r.productionLicensees || 'Lovetoons Animation Studio, KMM Publishing, LoveWorld Media',
              territory: r.territory || 'Worldwide / Global',
              territoryClearanceStatus: r.territoryClearanceStatus || 'Cleared Global',
              contentProvenance: r.contentProvenance || (isAudio ? 'Fully Custom' : 'AI Assisted'),
              songWriter: r.songWriter || (isAudio ? 'KMM Music Ministry (Staff Composer)' : undefined),
              songWriterProvenance: r.songWriterProvenance || (isAudio ? 'Fully Custom' : undefined),
              governanceChecks: r.governanceChecks || {},
            }
          })
          setMasterRightsRecords(sanitizedRecords)
        }
        if (approvalsRes?.success && Array.isArray(approvalsRes.approvals) && approvalsRes.approvals.length > 0) {
          setMasterApprovals(approvalsRes.approvals)
        }
        if (relsRes?.success && Array.isArray(relsRes.relationships) && relsRes.relationships.length > 0) {
          setMasterRelationships(relsRes.relationships)
        }
      } catch (err) {
        console.warn('Backend live sync warning:', err)
      }
    }

    syncWithBackend()
  }, [])

  // Save to LocalStorage
  useEffect(() => {
    if (!isInitialized) return
    try {
      if (typeof window !== 'undefined') {
        const payload = {
          assets: masterAssets,
          categories,
          subcategories,
          rightsRecords: masterRightsRecords,
          relationships: masterRelationships,
          approvals: masterApprovals,
          activities: masterActivities,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        localStorage.setItem(NOTIF_KEY, JSON.stringify(masterNotifications))
      }
    } catch (e) {
      console.error('Failed to persist storage data', e)
    }
  }, [masterAssets, categories, subcategories, masterRightsRecords, masterRelationships, masterApprovals, masterActivities, masterNotifications, isInitialized])

  // Change User
  const setCurrentUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user)
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, user.id)
    }
    showToast(`Switched active profile to ${user.name} (${user.roleLabel} • ${user.agency})`)
  }, [showToast])

  // Login handler with Neon bcrypt verification
  const login = useCallback(
    async (emailOrUser: string | UserProfile, password?: string): Promise<boolean> => {
      let targetUser: UserProfile | undefined
      if (typeof emailOrUser === 'string') {
        const email = emailOrUser.trim()

        // If password is provided, verify against Neon DB bcrypt API
        if (password) {
          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (res.ok && data.success && data.user) {
              const loggedInUser: UserProfile = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                initials: data.user.initials || data.user.name.slice(0, 2).toUpperCase(),
                role: data.user.role as any,
                roleLabel: data.user.roleLabel || data.user.role,
                agency: (data.user.agency as Agency) || 'Lovetoons',
                unit: (data.user.unit as Agency) || (data.user.agency as Agency) || 'Lovetoons',
                skills: ['admin'],
              }

              setCurrentUserState(loggedInUser)
              setIsAuthenticated(true)
              if (typeof window !== 'undefined') {
                localStorage.setItem(USER_KEY, loggedInUser.id)
                localStorage.setItem(AUTH_KEY, 'true')
              }
              showToast(`Welcome back, ${loggedInUser.name}! Secure authentication verified.`)
              return true
            } else {
              showToast(data.error || 'Authentication failed. Please check credentials.')
              return false
            }
          } catch (err) {
            console.warn('API login error, checking local profiles:', err)
          }
        }

        targetUser = availableUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()
        )
      } else {
        targetUser = emailOrUser
      }

      if (!targetUser) {
        showToast('User not found. Please try another account.')
        return false
      }

      setCurrentUserState(targetUser)
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, targetUser.id)
        localStorage.setItem(AUTH_KEY, 'true')
      }
      showToast(`Welcome back, ${targetUser.name}! Logged in as ${targetUser.roleLabel}.`)
      return true
    },
    [availableUsers, showToast]
  )

  // Logout handler
  const logout = useCallback(() => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'false')
    }
    showToast('Signed out of Kiddies Media Ministries platform.')
  }, [showToast])

  // Role helper flags
  const isSuperAdmin = currentUser.role === 'super_admin'
  const isReviewer = currentUser.role === 'reviewer'
  const isAgencyAdmin = currentUser.role === 'agency_admin' || (currentUser.role as any) === 'unit_admin'
  const isUnitAdmin = isAgencyAdmin
  const canApprove = isReviewer || isSuperAdmin
  const isGlobalViewer = isSuperAdmin || isReviewer
  const userAgency: Agency = currentUser.agency || (currentUser.unit as Agency) || 'Lovetoons'

  // Activity & Audit Trail logger
  const addActivity = useCallback(
    (
      title: string,
      subtitle: string,
      iconType: ActivityLog['iconType'] = 'file',
      color = 'bg-blue-100 text-blue-700',
      agency?: Agency,
      meta?: {
        assetId?: string
        assetName?: string
        actionType?: ActivityLog['actionType']
        details?: string
      }
    ) => {
      const targetAgency = agency || currentUser.agency || 'Lovetoons'
      const newAct: ActivityLog = {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        subtitle,
        time: 'Just now',
        user: currentUser.name,
        agency: targetAgency,
        unit: targetAgency,
        iconType,
        color,
        timestamp: Date.now(),
        assetId: meta?.assetId,
        assetName: meta?.assetName,
        actionType: meta?.actionType,
        details: meta?.details,
      }
      setMasterActivities((prev) => [newAct, ...prev.slice(0, 499)])
    },
    [currentUser]
  )

  // Notification methods
  const addNotification = useCallback(
    (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'time'> & { id?: string }): NotificationItem => {
      const newNotif: NotificationItem = {
        ...notif,
        id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        read: false,
        time: 'Just now',
      }
      setMasterNotifications((prev) => [newNotif, ...prev.slice(0, 49)])
      return newNotif
    },
    []
  )

  const markNotificationAsRead = useCallback((id: string) => {
    setMasterNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setMasterNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    showToast('All ministry notifications marked as read.')
  }, [showToast])

  const toggleNotificationRead = useCallback((id: string) => {
    setMasterNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setMasterNotifications((prev) => prev.filter((n) => n.id !== id))
    showToast('Notification dismissed.')
  }, [showToast])

  const clearAllNotifications = useCallback(() => {
    setMasterNotifications([])
    showToast('All notifications cleared.')
  }, [showToast])

  // -------------------------------------------------------------
  // ROLE SCOPING LOGIC:
  // Super Admin & Reviewer -> Cover ALL agencies' details
  // Agency Reps -> View details for JUST their agency
  // -------------------------------------------------------------
  const assets = useMemo(() => {
    const list = isGlobalViewer ? masterAssets : masterAssets.filter((a) => (a.agency || a.unit) === userAgency)
    return sortDiscontinuedToBottom(list)
  }, [masterAssets, isGlobalViewer, userAgency])

  const rightsRecords = useMemo(() => {
    if (isGlobalViewer) return masterRightsRecords
    return masterRightsRecords.filter((r) => (r.agency || r.unit) === userAgency)
  }, [masterRightsRecords, isGlobalViewer, userAgency])

  const approvals = useMemo(() => {
    if (isGlobalViewer) return masterApprovals
    return masterApprovals.filter((app) => (app.agency || app.unit) === userAgency)
  }, [masterApprovals, isGlobalViewer, userAgency])

  const relationships = useMemo(() => {
    if (isGlobalViewer) return masterRelationships
    return masterRelationships.filter((rel) => {
      const src = masterAssets.find((a) => a.id === rel.sourceId || a.id === rel.sourceAssetId)
      const tgt = masterAssets.find((a) => a.id === rel.targetId || a.id === rel.targetAssetId)
      const srcAgency = src?.agency || src?.unit
      const tgtAgency = tgt?.agency || tgt?.unit
      return srcAgency === userAgency || tgtAgency === userAgency
    })
  }, [masterRelationships, masterAssets, isGlobalViewer, userAgency])

  const activities = useMemo(() => {
    if (isGlobalViewer) return masterActivities
    return masterActivities.filter((act) => !act.agency || act.agency === userAgency || act.unit === userAgency)
  }, [masterActivities, isGlobalViewer, userAgency])

  const notifications = useMemo(() => {
    if (isGlobalViewer) return masterNotifications
    return masterNotifications.filter((n) => !n.agency || n.agency === userAgency)
  }, [masterNotifications, isGlobalViewer, userAgency])

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  // Real-time Platform Stats (Computed from the scoped views)
  const stats: PlatformStats = useMemo(() => {
    const totalAssets = assets.length
    const approvedAssets = assets.filter((a) => a.status === 'In Production' || a.status === 'Approved').length
    const pendingAssets = assets.filter((a) => a.status === 'Yet to Launch' || a.status === 'Pending').length
    const attentionAssets = assets.filter((a) => a.status === 'Discontinued' || a.status === 'Requires Attention').length
    const inReviewAssets = assets.filter((a) => a.status === 'Under Review' || a.status === 'In Review').length

    const connectedAssetIds = new Set<string>()
    relationships.forEach((r) => {
      connectedAssetIds.add(r.sourceId)
      connectedAssetIds.add(r.targetId)
    })

    const clearedRightsCount = rightsRecords.filter((r) => r.status === 'Cleared').length
    const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length

    return {
      totalAssets,
      approvedAssets,
      pendingAssets,
      attentionAssets,
      inReviewAssets,
      totalRelationships: relationships.length,
      connectedAssetsCount: connectedAssetIds.size,
      totalRights: rightsRecords.length,
      clearedRightsCount,
      pendingApprovalsCount,
    }
  }, [assets, relationships, rightsRecords, approvals])

  // Global Platform Stats (Always covers the entire network across all agencies)
  const globalStats: PlatformStats = useMemo(() => {
    const totalAssets = masterAssets.length
    const approvedAssets = masterAssets.filter((a) => a.status === 'In Production' || a.status === 'Approved').length
    const pendingAssets = masterAssets.filter((a) => a.status === 'Yet to Launch' || a.status === 'Pending').length
    const attentionAssets = masterAssets.filter((a) => a.status === 'Discontinued' || a.status === 'Requires Attention').length
    const inReviewAssets = masterAssets.filter((a) => a.status === 'Under Review' || a.status === 'In Review').length

    const connectedAssetIds = new Set<string>()
    masterRelationships.forEach((r) => {
      connectedAssetIds.add(r.sourceId)
      connectedAssetIds.add(r.targetId)
    })

    const clearedRightsCount = masterRightsRecords.filter((r) => r.status === 'Cleared').length
    const pendingApprovalsCount = masterApprovals.filter((a) => a.status === 'Pending').length

    return {
      totalAssets,
      approvedAssets,
      pendingAssets,
      attentionAssets,
      inReviewAssets,
      totalRelationships: masterRelationships.length,
      connectedAssetsCount: connectedAssetIds.size,
      totalRights: masterRightsRecords.length,
      clearedRightsCount,
      pendingApprovalsCount,
    }
  }, [masterAssets, masterRelationships, masterRightsRecords, masterApprovals])

  // -------------------------------------------------------------
  // Asset CRUD
  // -------------------------------------------------------------
  const addAsset = useCallback(
    (data: Omit<AssetData, 'id' | 'createdDate' | 'createdTime'> & { id?: string }): AssetData => {
      const now = new Date()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const categoryPrefix = (data.category || 'AS').slice(0, 2).toUpperCase()
      const autoId = data.id || `KMP-${categoryPrefix}-${String(masterAssets.length + 1).padStart(3, '0')}`

      // Restrict agency for Agency Admins; Super Admin and Reviewer can assign any agency
      const assignedAgency: Agency = isGlobalViewer
        ? data.agency || userAgency
        : userAgency

      const contributors: AssetContributor[] = data.contributors || []
      const assignedRightsHolder = data.rightsHolder?.trim() || 'Esteemed Executive Minister (Pastor Chelsea Kalu)'
      const isAudio = data.category?.toLowerCase().includes('audio') || data.category?.toLowerCase().includes('music')
      const defaultProvenance: ContentProvenance = isAudio ? 'Fully Custom' : 'AI Assisted'

      const newAssetItem: AssetData = {
        ...data,
        id: autoId,
        createdDate: dateStr,
        createdTime: timeStr,
        status: data.status || 'Pending',
        agency: assignedAgency,
        unit: assignedAgency,
        creatorName: data.creatorName || (contributors[0]?.name) || 'KMM Creative Team',
        creatorRole: data.creatorRole || (contributors[0]?.role) || 'Contributing Staff',
        creatorSkill: data.creatorSkill || 'admin',
        contributors,
        rightsHolder: assignedRightsHolder,
        ownerCertificateRef: data.ownerCertificateRef || 'CERT-EXEC-MIN-2026-HQ',
        trademarkStatus: data.trademarkStatus || 'Registered',
        distributionLicense: data.distributionLicense || 'Exclusive Ministry Global Distribution',
        productionLicensees: data.productionLicensees || 'Lovetoons Animation Studio, KMM Publishing, LoveWorld Media',
        territoryClearanceStatus: data.territoryClearanceStatus || 'Cleared Global',
        contentProvenance: data.contentProvenance || defaultProvenance,
        songWriter: data.songWriter || (isAudio ? 'KMM Music Ministry (Staff Composer)' : undefined),
        songWriterProvenance: data.songWriterProvenance || (isAudio ? 'Fully Custom' : undefined),
        tags: data.tags && data.tags.length > 0 ? data.tags : ['New Asset'],
      }

      setMasterAssets((prev) => [newAssetItem, ...prev])

      // Update Category asset counts
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === newAssetItem.category ? { ...cat, assetsCount: cat.assetsCount + 1 } : cat
        )
      )

      // Update Subcategory asset counts
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub.name === newAssetItem.subcategory ? { ...sub, assetsCount: sub.assetsCount + 1 } : sub
        )
      )

      // Automatically create companion unconfigured Rights Record
      const newRightsRecord: RightsRecord = {
        id: `RG-${autoId}`,
        assetId: newAssetItem.id,
        name: newAssetItem.name,
        category: newAssetItem.category,
        subcategory: newAssetItem.subcategory,
        agency: newAssetItem.agency,
        unit: newAssetItem.agency,
        contributors: newAssetItem.contributors,
        owner: assignedRightsHolder,
        ownerCertificateRef: newAssetItem.ownerCertificateRef || 'CERT-EXEC-MIN-2026-HQ',
        trademarkStatus: newAssetItem.trademarkStatus || 'Registered',
        distributionLicense: newAssetItem.distributionLicense || 'Exclusive Ministry Global Distribution',
        productionLicensees: newAssetItem.productionLicensees || 'Lovetoons Animation Studio, KMM Publishing, LoveWorld Media',
        territory: 'Worldwide / Global',
        territoryClearanceStatus: newAssetItem.territoryClearanceStatus || 'Cleared Global',
        contentProvenance: newAssetItem.contentProvenance || defaultProvenance,
        songWriter: newAssetItem.songWriter,
        songWriterProvenance: newAssetItem.songWriterProvenance,
        status: 'Pending',
        thumbType: newAssetItem.thumbType || 'tv_series',
        description: '',
        documents: [],
        governanceChecks: {},
        governanceScore: 0,
      }
      setMasterRightsRecords((prev) => [newRightsRecord, ...prev])

      // Asynchronously persist new asset to Neon DB
      fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: autoId,
          name: newAssetItem.name,
          category: newAssetItem.category,
          categoryGroup: newAssetItem.categoryGroup,
          subcategory: newAssetItem.subcategory,
          agency: newAssetItem.agency,
          unit: newAssetItem.unit,
          creatorName: newAssetItem.creatorName,
          creatorRole: newAssetItem.creatorRole,
          creatorSkill: newAssetItem.creatorSkill,
          contributors: newAssetItem.contributors,
          status: newAssetItem.status,
          description: newAssetItem.description,
          tags: newAssetItem.tags,
          attributes: newAssetItem.attributes,
          posterUrl: newAssetItem.posterUrl,
          ministryId: 'min-kmm',
        }),
      }).catch(console.error)

      addActivity(
        `Registered intellectual asset: ${newAssetItem.name}`,
        `Intake logged for ${newAssetItem.agency} • ID ${newAssetItem.id} • ${newAssetItem.contributors.length} contributors • Owner: ${assignedRightsHolder}`,
        'file',
        'bg-blue-100 text-blue-700',
        newAssetItem.agency,
        {
          assetId: newAssetItem.id,
          assetName: newAssetItem.name,
          actionType: 'CREATE',
          details: `Registered new asset "${newAssetItem.name}" (${newAssetItem.category}). Assigned owner: ${assignedRightsHolder}`,
        }
      )

      addNotification({
        type: 'asset',
        title: `Asset Registered: ${newAssetItem.name}`,
        subtitle: `Registered for ${newAssetItem.agency} • Owner: ${assignedRightsHolder}`,
        targetTab: 'Assets',
        assetId: newAssetItem.id,
        priority: 'Medium',
        badge: 'New Asset',
        badgeColor: 'bg-blue-100 text-blue-800',
        agency: newAssetItem.agency,
      })

      showToast(`Asset "${newAssetItem.name}" registered successfully for ${newAssetItem.agency}!`)
      return newAssetItem
    },
    [masterAssets.length, masterApprovals.length, isGlobalViewer, userAgency, currentUser, addActivity, addNotification, showToast]
  )

  const updateAsset = useCallback(
    (asset: AssetData) => {
      setMasterAssets((prev) =>
        prev.map((a) => (a.id === asset.id ? { ...asset, agency: asset.agency || a.agency, unit: asset.agency || a.agency } : a))
      )
      fetch(`/api/assets/${asset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset),
      }).catch(console.error)

      addActivity(
        `Updated asset specifications: ${asset.name}`,
        `Modified by ${currentUser.name} (${asset.agency || currentUser.agency})`,
        'link',
        'bg-slate-100 text-slate-700',
        asset.agency || currentUser.agency,
        {
          assetId: asset.id,
          assetName: asset.name,
          actionType: 'UPDATE',
          details: `Asset details, metadata, or status updated for ${asset.name} (${asset.id}).`,
        }
      )
      showToast(`Asset "${asset.name}" updated.`)
    },
    [currentUser, addActivity, showToast]
  )

  const deleteAsset = useCallback(
    (id: string) => {
      const target = masterAssets.find((a) => a.id === id)
      if (!target) return

      setMasterAssets((prev) => prev.filter((a) => a.id !== id))
      setMasterRightsRecords((prev) => prev.filter((r) => r.assetId !== id))
      setMasterApprovals((prev) => prev.filter((app) => app.assetId !== id))
      setMasterRelationships((prev) => prev.filter((rel) => rel.sourceId !== id && rel.targetId !== id))

      fetch(`/api/assets/${id}`, {
        method: 'DELETE',
      }).catch(console.error)

      addActivity(
        `Deleted asset from catalog: ${target.name}`,
        `Removed by ${currentUser.name} (${target.agency})`,
        'alert',
        'bg-rose-100 text-rose-700',
        target.agency,
        {
          assetId: target.id,
          assetName: target.name,
          actionType: 'DELETE',
          details: `Deleted asset "${target.name}" (${target.id}) and all linked records.`,
        }
      )
      showToast(`Asset "${target.name}" removed from registry.`)
    },
    [masterAssets, currentUser, addActivity, showToast]
  )

  const bulkApproveAssets = useCallback(
    (ids: string[]) => {
      setMasterAssets((prev) =>
        prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'Approved' } : a))
      )
      setMasterApprovals((prev) =>
        prev.map((app) => (ids.includes(app.assetId) ? { ...app, status: 'Approved', currentStep: app.totalSteps } : app))
      )
      addActivity(
        `Batch approved ${ids.length} assets`,
        `Authorised by ${currentUser.name} (${currentUser.roleLabel})`,
        'check',
        'bg-emerald-100 text-emerald-700',
        undefined,
        {
          actionType: 'APPROVAL',
          details: `Bulk marked status to Approved for asset IDs: ${ids.join(', ')}`,
        }
      )
      showToast(`Bulk approved ${ids.length} assets!`)
    },
    [currentUser, addActivity, showToast]
  )

  const bulkDeleteAssets = useCallback(
    (ids: string[]) => {
      setMasterAssets((prev) => prev.filter((a) => !ids.includes(a.id)))
      setMasterRightsRecords((prev) => prev.filter((r) => !r.assetId || !ids.includes(r.assetId)))
      setMasterApprovals((prev) => prev.filter((app) => !ids.includes(app.assetId)))
      addActivity(
        `Bulk deleted ${ids.length} assets`,
        `Action taken by ${currentUser.name}`,
        'alert',
        'bg-rose-100 text-rose-700',
        undefined,
        {
          actionType: 'DELETE',
          details: `Bulk deleted assets and associated rights records for IDs: ${ids.join(', ')}`,
        }
      )
      showToast(`Removed ${ids.length} assets.`)
    },
    [currentUser, addActivity, showToast]
  )

  // -------------------------------------------------------------
  // Categories & Subcategories
  // -------------------------------------------------------------
  const addCategory = useCallback(
    (cat: Omit<CategoryItem, 'id' | 'subcategoriesCount' | 'assetsCount'>): CategoryItem => {
      const newCat: CategoryItem = {
        ...cat,
        id: `cat-${Date.now()}`,
        subcategoriesCount: 0,
        assetsCount: 0,
      }
      setCategories((prev) => [newCat, ...prev])
      addActivity(`Created category: ${newCat.name}`, `Added by ${currentUser.name}`)
      showToast(`Category "${newCat.name}" created.`)
      return newCat
    },
    [currentUser, addActivity, showToast]
  )

  const updateCategory = useCallback(
    (cat: CategoryItem) => {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)))
      showToast(`Category "${cat.name}" updated.`)
    },
    [showToast]
  )

  const deleteCategory = useCallback(
    (id: string) => {
      const target = categories.find((c) => c.id === id)
      if (!target) return
      setCategories((prev) => prev.filter((c) => c.id !== id))
      showToast(`Category "${target.name}" removed.`)
    },
    [categories, showToast]
  )

  const addSubcategory = useCallback(
    (sub: Omit<SubcategoryItem, 'id' | 'assetsCount'>): SubcategoryItem => {
      const newSub: SubcategoryItem = {
        ...sub,
        id: `sub-${Date.now()}`,
        assetsCount: 0,
      }
      setSubcategories((prev) => [newSub, ...prev])
      setCategories((prev) =>
        prev.map((c) => (c.name === sub.parentCategory ? { ...c, subcategoriesCount: c.subcategoriesCount + 1 } : c))
      )
      showToast(`Subcategory "${newSub.name}" added.`)
      return newSub
    },
    [showToast]
  )

  const updateSubcategory = useCallback(
    (sub: SubcategoryItem) => {
      setSubcategories((prev) => prev.map((s) => (s.id === sub.id ? sub : s)))
      showToast(`Subcategory "${sub.name}" updated.`)
    },
    [showToast]
  )

  const deleteSubcategory = useCallback(
    (id: string) => {
      const target = subcategories.find((s) => s.id === id)
      if (!target) return
      setSubcategories((prev) => prev.filter((s) => s.id !== id))
      setCategories((prev) =>
        prev.map((c) =>
          c.name === target.parentCategory
            ? { ...c, subcategoriesCount: Math.max(0, c.subcategoriesCount - 1) }
            : c
        )
      )
      showToast(`Subcategory "${target.name}" deleted.`)
    },
    [subcategories, showToast]
  )

  // -------------------------------------------------------------
  // Rights Records CRUD
  // -------------------------------------------------------------
  const addRightsRecord = useCallback(
    (record: Omit<RightsRecord, 'id'> & { id?: string }): RightsRecord => {
      const now = new Date()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const autoId = record.id || `RG-${Date.now().toString().slice(-6)}`
      const assignedAgency = record.agency || currentUser.agency || 'Lovetoons'

      const newRecord: RightsRecord = {
        ...record,
        id: autoId,
        agency: assignedAgency,
        unit: assignedAgency,
        governanceScore: record.governanceScore ?? (record.documents?.length ? 50 : 0),
      }
      setMasterRightsRecords((prev) => [newRecord, ...prev])

      if (newRecord.status === 'Review' || newRecord.status === 'Pending') {
        const newApproval: ApprovalRequest = {
          id: `APP-${now.getFullYear()}-${String(masterApprovals.length + 1).padStart(3, '0')}`,
          assetId: newRecord.assetId || newRecord.id,
          assetName: `${newRecord.name} (Rights Scope Clearance)`,
          category: newRecord.category,
          subcategory: newRecord.subcategory,
          agency: assignedAgency,
          unit: assignedAgency,
          contributors: newRecord.contributors,
          requesterName: currentUser.name,
          requesterRole: currentUser.roleLabel,
          requesterSkill: currentUser.skills[0] || 'admin',
          reviewerName: 'Faith Daniel',
          stage: 'Rights Clearance & Territorial Governance Review',
          currentStep: 1,
          totalSteps: 2,
          status: 'Pending',
          priority: 'High',
          submittedDate: dateStr,
          submittedTime: timeStr,
          history: [
            {
              stage: 'Rights Clearance Submission',
              author: currentUser.name,
              authorRole: currentUser.roleLabel,
              date: `${dateStr} ${timeStr}`,
              status: 'Submitted',
              notes: `Submitted scope: ${newRecord.rightsType} (${newRecord.territory || 'Worldwide'}, ${newRecord.term || '10 Years'}) for ${assignedAgency}`,
            },
          ],
        }
        setMasterApprovals((prev) => [newApproval, ...prev])
      }

      addActivity(
        `Rights scope submitted: ${newRecord.name}`,
        `Submitted by ${currentUser.name} (${newRecord.rightsType}) • Agency: ${assignedAgency}`,
        'shield',
        'bg-purple-100 text-purple-700',
        assignedAgency,
        {
          assetId: newRecord.assetId || newRecord.id,
          assetName: newRecord.name,
          actionType: 'APPROVAL',
          details: `Submitted scope: ${newRecord.rightsType} (${newRecord.territory || 'Worldwide'}, ${newRecord.term || '10 Years'}) for ${assignedAgency}.`,
        }
      )
      showToast(`Rights record for "${newRecord.name}" submitted!`)
      return newRecord
    },
    [currentUser, masterApprovals.length, addActivity, showToast]
  )

  const updateRightsRecord = useCallback(
    (record: RightsRecord) => {
      setMasterRightsRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...record, agency: record.agency || r.agency, unit: record.agency || r.agency } : r))
      )
      addActivity(
        `Governance rights updated: ${record.name}`,
        `Updated by ${currentUser.name} • Status: ${record.status}`,
        'shield',
        'bg-indigo-100 text-indigo-700',
        record.agency || currentUser.agency,
        {
          assetId: record.assetId || record.id,
          assetName: record.name,
          actionType: 'GOVERNANCE',
          details: `Governance clearance updated. Score: ${record.governanceScore || 0}%, Status: ${record.status}, Documents: ${record.documents?.length || 0}.`,
        }
      )

      addNotification({
        type: 'governance',
        title: `Governance Updated: ${record.name}`,
        subtitle: `Score: ${record.governanceScore || 0}% • Documents: ${record.documents?.length || 0} attached`,
        targetTab: 'Rights & Governance',
        assetId: record.assetId || record.id,
        priority: 'Medium',
        badge: `${record.governanceScore || 0}% Score`,
        badgeColor: (record.governanceScore || 0) >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
        agency: record.agency,
      })

      // Asynchronously sync update to Neon database
      fetch('/api/rights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          assetId: record.assetId,
          rightsType: record.rightsType,
          territory: record.territory,
          validity: record.validity,
          exclusivity: record.exclusivity,
          licenceType: record.licenceType,
          royaltyTerms: record.royaltyTerms,
          description: record.description,
          status: record.status,
          governanceScore: record.governanceScore,
          documents: record.documents,
          governanceChecks: record.governanceChecks,
        }),
      }).catch((err) => console.warn('Neon DB rights update sync:', err))

      showToast(`Governance details for "${record.name}" updated.`)
    },
    [currentUser, addActivity, addNotification, showToast]
  )

  const deleteRightsRecord = useCallback(
    (id: string) => {
      const target = masterRightsRecords.find((r) => r.id === id)
      if (!target) return
      setMasterRightsRecords((prev) => prev.filter((r) => r.id !== id))
      addActivity(
        `Deleted rights record: ${target.name}`,
        `Removed by ${currentUser.name}`,
        'alert',
        'bg-rose-100 text-rose-700',
        target.agency || currentUser.agency,
        {
          assetId: target.assetId || target.id,
          assetName: target.name,
          actionType: 'DELETE',
          details: `Removed rights record "${target.name}" (${target.id}).`,
        }
      )
      showToast(`Rights clearance record for "${target.name}" removed.`)
    },
    [masterRightsRecords, currentUser, addActivity, showToast]
  )

  // -------------------------------------------------------------
  // Relationships CRUD
  // -------------------------------------------------------------
  const addRelationship = useCallback(
    (rel: Omit<RelationshipItem, 'id' | 'createdDate' | 'createdTime'>): RelationshipItem => {
      const now = new Date()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const newRel: RelationshipItem = {
        ...rel,
        id: `rel-${Date.now()}`,
        createdDate: dateStr,
        createdTime: timeStr,
      }
      setMasterRelationships((prev) => [newRel, ...prev])

      fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRel),
      }).catch(console.error)

      addActivity(
        `Linked IP assets: ${newRel.sourceAsset} ↔ ${newRel.targetAsset}`,
        `Relation: "${newRel.relationshipType}" established by ${currentUser.name}`,
        'link',
        'bg-blue-100 text-blue-700'
      )
      showToast(`Relationship established between "${newRel.sourceAsset}" and "${newRel.targetAsset}".`)
      return newRel
    },
    [currentUser, addActivity, showToast]
  )

  const deleteRelationship = useCallback(
    (id: string) => {
      const target = masterRelationships.find((r) => r.id === id)
      if (!target) return
      setMasterRelationships((prev) => prev.filter((r) => r.id !== id))

      fetch(`/api/relationships?id=${id}`, {
        method: 'DELETE',
      }).catch(console.error)

      showToast('Relationship unlinked.')
    },
    [masterRelationships, showToast]
  )

  // -------------------------------------------------------------
  // Approvals Actions
  // -------------------------------------------------------------
  const approveRequest = useCallback(
    (approvalId: string, reviewerNotes = 'Clearance and doctrinal review passed successfully.') => {
      const now = new Date()
      const dateStr = now.toLocaleString()

      setMasterApprovals((prev) =>
        prev.map((app) => {
          if (app.id !== approvalId) return app
          return {
            ...app,
            status: 'Approved',
            currentStep: app.totalSteps,
            history: [
              ...app.history,
              {
                stage: 'Approved by Content Reviewer',
                author: currentUser.name,
                authorRole: currentUser.roleLabel,
                date: dateStr,
                status: 'Approved',
                notes: reviewerNotes,
              },
            ],
          }
        })
      )

      // Also set matching asset status to Approved
      const targetApp = masterApprovals.find((a) => a.id === approvalId)
      if (targetApp) {
        setMasterAssets((prev) =>
          prev.map((asset) => (asset.id === targetApp.assetId ? { ...asset, status: 'Approved' } : asset))
        )
        setMasterRightsRecords((prev) =>
          prev.map((r) => (r.assetId === targetApp.assetId ? { ...r, status: 'Cleared', governanceScore: 100 } : r))
        )
        fetch('/api/approvals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: approvalId,
            status: 'Approved',
            feedbackNotes: reviewerNotes,
            stage: 'Cleared & Fully Approved',
            reviewerName: currentUser.name,
            currentStep: 3,
          }),
        }).catch(console.error)

        addActivity(
          `Approved request: ${targetApp.assetName}`,
          `Approved by ${currentUser.name} (${currentUser.roleLabel}) • Agency: ${targetApp.agency}`,
          'check',
          'bg-emerald-100 text-emerald-700',
          targetApp.agency,
          {
            assetId: targetApp.assetId,
            assetName: targetApp.assetName,
            actionType: 'APPROVAL',
            details: `Clearance request approved by ${currentUser.name}. Notes: "${reviewerNotes}"`,
          }
        )

        addNotification({
          type: 'approval',
          title: `Approved: ${targetApp.assetName}`,
          subtitle: `Cleared by ${currentUser.name} (${currentUser.roleLabel}) • Ready for broadcast`,
          targetTab: 'Approvals',
          assetId: targetApp.assetId,
          priority: 'High',
          badge: 'Approved',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          agency: targetApp.agency,
        })

        showToast(`Approval request "${targetApp.assetName}" cleared and marked Approved!`)
      }
    },
    [currentUser, masterApprovals, addActivity, addNotification, showToast]
  )

  const declineRequest = useCallback(
    (approvalId: string, reason: string) => {
      const now = new Date()
      const dateStr = now.toLocaleString()

      setMasterApprovals((prev) =>
        prev.map((app) => {
          if (app.id !== approvalId) return app
          return {
            ...app,
            status: 'Declined',
            history: [
              ...app.history,
              {
                stage: 'Declined by Reviewer',
                author: currentUser.name,
                authorRole: currentUser.roleLabel,
                date: dateStr,
                status: 'Declined',
                notes: reason,
              },
            ],
          }
        })
      )

      fetch('/api/approvals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: approvalId,
          status: 'Declined',
          feedbackNotes: reason,
        }),
      }).catch(console.error)

      const targetApp = masterApprovals.find((a) => a.id === approvalId)
      if (targetApp) {
        setMasterAssets((prev) =>
          prev.map((asset) => (asset.id === targetApp.assetId ? { ...asset, status: 'Requires Attention' } : asset))
        )
        addActivity(
          `Declined review: ${targetApp.assetName}`,
          `Declined by ${currentUser.name}: "${reason}"`,
          'alert',
          'bg-rose-100 text-rose-700',
          targetApp.agency,
          {
            assetId: targetApp.assetId,
            assetName: targetApp.assetName,
            actionType: 'APPROVAL',
            details: `Clearance request declined by ${currentUser.name}. Reason: "${reason}"`,
          }
        )

        addNotification({
          type: 'approval',
          title: `Declined: ${targetApp.assetName}`,
          subtitle: `Reviewer requested revision: "${reason}"`,
          targetTab: 'Approvals',
          assetId: targetApp.assetId,
          priority: 'Urgent',
          badge: 'Declined',
          badgeColor: 'bg-rose-100 text-rose-800',
          agency: targetApp.agency,
        })

        showToast(`Request for "${targetApp.assetName}" declined. Notice sent.`)
      }
    },
    [currentUser, masterApprovals, addActivity, addNotification, showToast]
  )

  const requestFeedback = useCallback(
    (approvalId: string, feedbackNotes: string) => {
      const now = new Date()
      const dateStr = now.toLocaleString()

      setMasterApprovals((prev) =>
        prev.map((app) => {
          if (app.id !== approvalId) return app
          return {
            ...app,
            status: 'Needs Feedback',
            feedbackNotes,
            history: [
              ...app.history,
              {
                stage: 'Feedback Requested',
                author: currentUser.name,
                authorRole: currentUser.roleLabel,
                date: dateStr,
                status: 'Needs Feedback',
                notes: feedbackNotes,
              },
            ],
          }
        })
      )

      fetch('/api/approvals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: approvalId,
          status: 'Needs Feedback',
          feedbackNotes,
        }),
      }).catch(console.error)

      const targetApp = masterApprovals.find((a) => a.id === approvalId)
      if (targetApp) {
        setMasterAssets((prev) =>
          prev.map((asset) => (asset.id === targetApp.assetId ? { ...asset, status: 'In Review' } : asset))
        )
        addActivity(
          `Reviewer requested feedback: ${targetApp.assetName}`,
          `Notes from ${currentUser.name}: "${feedbackNotes}"`,
          'alert',
          'bg-amber-100 text-amber-700',
          targetApp.agency,
          {
            assetId: targetApp.assetId,
            assetName: targetApp.assetName,
            actionType: 'APPROVAL',
            details: `Feedback requested by ${currentUser.name}: "${feedbackNotes}"`,
          }
        )

        addNotification({
          type: 'approval',
          title: `Feedback Needed: ${targetApp.assetName}`,
          subtitle: `Reviewer notes: "${feedbackNotes}"`,
          targetTab: 'Approvals',
          assetId: targetApp.assetId,
          priority: 'Medium',
          badge: 'Needs Feedback',
          badgeColor: 'bg-amber-100 text-amber-800',
          agency: targetApp.agency,
        })

        showToast('Feedback notes registered and sent to creator.')
      }
    },
    [currentUser, masterApprovals, addActivity, addNotification, showToast]
  )

  const createApprovalRequest = useCallback(
    (assetId: string, priority: ApprovalRequest['priority'] = 'Medium'): ApprovalRequest => {
      const now = new Date()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const targetAsset = masterAssets.find((a) => a.id === assetId)
      const assignedAgency: Agency = targetAsset?.agency || currentUser.agency || 'Lovetoons'
      const matchedRights = masterRightsRecords.find((r) => r.assetId === assetId || r.id === assetId)
      const attachedDocs = matchedRights?.documents || []

      if (attachedDocs.length === 0) {
        showToast('Legal documents required before scheduling for approval.')
        throw new Error('Documentation required before scheduling approval.')
      }

      const newApproval: ApprovalRequest = {
        id: `APP-${now.getFullYear()}-${String(masterApprovals.length + 1).padStart(3, '0')}`,
        assetId: targetAsset?.id || assetId,
        assetName: targetAsset?.name || 'Asset for Review',
        category: targetAsset?.category || 'General',
        subcategory: targetAsset?.subcategory || 'General',
        agency: assignedAgency,
        unit: assignedAgency,
        contributors: targetAsset?.contributors || [],
        requesterName: currentUser.name,
        requesterRole: currentUser.roleLabel,
        requesterSkill: currentUser.skills[0] || 'admin',
        reviewerName: 'Faith Daniel',
        stage: 'Submitted for Review',
        currentStep: 1,
        totalSteps: 3,
        status: 'Pending',
        priority,
        submittedDate: dateStr,
        submittedTime: timeStr,
        documents: attachedDocs,
        governanceScore: matchedRights?.governanceScore || 0,
        governanceChecks: matchedRights?.governanceChecks || {},
        history: [
          {
            stage: 'Submitted for Review',
            author: currentUser.name,
            authorRole: currentUser.roleLabel,
            date: `${dateStr} ${timeStr}`,
            status: 'Submitted',
            notes: `Asset submitted for ${assignedAgency} review with ${attachedDocs.length} legal documents attached.`,
          },
        ],
      }

      setMasterApprovals((prev) => [newApproval, ...prev.filter((a) => a.assetId !== assetId)])
      setMasterAssets((prev) =>
        prev.map((a) => (a.id === assetId ? { ...a, status: 'In Review' } : a))
      )

      // Persist to Neon DB
      fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: newApproval.assetId,
          assetName: newApproval.assetName,
          category: newApproval.category,
          subcategory: newApproval.subcategory,
          agency: newApproval.agency,
          unit: newApproval.unit,
          requesterName: newApproval.requesterName,
          requesterRole: newApproval.requesterRole,
          requesterSkill: newApproval.requesterSkill,
          reviewerName: newApproval.reviewerName,
          stage: newApproval.stage,
          currentStep: newApproval.currentStep,
          totalSteps: newApproval.totalSteps,
          priority: newApproval.priority,
          feedbackNotes: 'Submitted for review with attached chain of title documents.',
          documents: attachedDocs,
          governanceScore: newApproval.governanceScore,
        }),
      }).catch(console.error)

      fetch(`/api/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'In Review' }),
      }).catch(console.error)

      addActivity(
        `Scheduled for approval: ${newApproval.assetName}`,
        `Submitted by ${currentUser.name} (${assignedAgency}) • ${attachedDocs.length} documents attached`,
        'shield',
        'bg-indigo-100 text-indigo-700',
        assignedAgency,
        {
          assetId: newApproval.assetId,
          assetName: newApproval.assetName,
          actionType: 'APPROVAL',
          details: `Scheduled clearance review with ${attachedDocs.length} legal document(s) attached. Priority: ${newApproval.priority}.`,
        }
      )

      addNotification({
        type: 'approval',
        title: `Approval Request: ${newApproval.assetName}`,
        subtitle: `Submitted by ${currentUser.name} (${assignedAgency}) • ${attachedDocs.length} legal documents attached`,
        targetTab: 'Approvals',
        assetId: newApproval.assetId,
        priority: newApproval.priority,
        badge: `${newApproval.priority} Priority`,
        badgeColor: newApproval.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800',
        agency: assignedAgency,
      })

      showToast(`Approval request scheduled for "${newApproval.assetName}".`)
      return newApproval
    },
    [masterAssets, masterApprovals.length, masterRightsRecords, currentUser, addActivity, addNotification, showToast]
  )

  // Reset to default & clean database
  const resetToDefaultData = useCallback(async () => {
    try {
      showToast('Resetting database and platform to clean live testing state...')

      // 1. Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(NOTIF_KEY)
      }

      // 2. Call backend reset endpoint to wipe test data and seed clean production assets
      const res = await fetch('/api/reset', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        // Re-fetch fresh live assets from Neon
        const assetsRes = await fetch('/api/assets').then((r) => r.json()).catch(() => null)
        if (assetsRes?.success && Array.isArray(assetsRes.assets)) {
          setMasterAssets(assetsRes.assets)
        } else {
          setMasterAssets(initialAssetsData)
        }
      } else {
        setMasterAssets(initialAssetsData)
      }

      setCategories(initialCategories)
      setSubcategories(initialSubcategories)
      setMasterRightsRecords(initialRightsRecords)
      setMasterRelationships(initialRelationships)
      setMasterApprovals(initialApprovals)
      setMasterActivities([
        {
          id: `act-reset-${Date.now()}`,
          title: 'Database & Asset Catalog Reset',
          subtitle: `Platform reset to pristine live testing state by ${currentUser.name}`,
          time: 'Just now',
          user: currentUser.name,
          agency: currentUser.agency,
          unit: currentUser.agency,
          iconType: 'shield',
          color: 'bg-emerald-100 text-emerald-700',
          timestamp: Date.now(),
          meta: {
            actionType: 'RESET',
            details: `Database cleared and re-seeded with authentic assets by ${currentUser.name}. Ready for testing.`,
          },
        },
        ...initialActivityLogs,
      ])
      setMasterNotifications(defaultInitialNotifications)

      showToast('All platform data and database reset to fresh live state.')
    } catch (err) {
      console.error('Reset error:', err)
      setMasterAssets(initialAssetsData)
      showToast('Platform reset completed locally.')
    }
  }, [currentUser, showToast])

  const value = {
    isInitialized,
    currentUser,
    setCurrentUser,
    availableUsers,
    isAuthenticated,
    login,
    logout,
    canApprove,
    isSuperAdmin,
    isReviewer,
    isAgencyAdmin,
    isUnitAdmin,
    isGlobalViewer,
    userAgency,
    assets,
    allAssets: masterAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    bulkApproveAssets,
    bulkDeleteAssets,
    categories,
    subcategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    rightsRecords,
    allRightsRecords: masterRightsRecords,
    addRightsRecord,
    updateRightsRecord,
    deleteRightsRecord,
    relationships,
    allRelationships: masterRelationships,
    addRelationship,
    deleteRelationship,
    approvals,
    allApprovals: masterApprovals,
    approveRequest,
    declineRequest,
    requestFeedback,
    createApprovalRequest,
    activities,
    allActivities: masterActivities,
    addActivity,
    notifications,
    allNotifications: masterNotifications,
    unreadNotificationsCount,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleNotificationRead,
    dismissNotification,
    clearAllNotifications,
    stats,
    globalStats,
    resetToDefaultData,
    toastMessage,
    showToast,
    dismissToast,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useLovetoonsData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useLovetoonsData must be used within a DataProvider')
  }
  return context
}
