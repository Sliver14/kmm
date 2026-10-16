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
  // Users & Role & Auth
  currentUser: UserProfile
  setCurrentUser: (user: UserProfile) => void
  availableUsers: UserProfile[]
  isAuthenticated: boolean
  isInitialized: boolean
  login: (emailOrUser: string | UserProfile, password?: string) => boolean
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
  addActivity: (title: string, subtitle: string, iconType?: ActivityLog['iconType'], color?: string, agency?: Agency) => void

  // Stats & Utilities
  stats: PlatformStats
  globalStats: PlatformStats
  resetToDefaultData: () => void
  toastMessage: string | null
  showToast: (msg: string) => void
}

const STORAGE_KEY = 'kmp_platform_data_v8'
const USER_KEY = 'kmp_current_user_v8'
const AUTH_KEY = 'kmp_auth_state_v8'

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

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3800)
  }, [])

  // Load from LocalStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const parsed = JSON.parse(storedData)
          if (parsed.assets && Array.isArray(parsed.assets)) {
            // Migrate any legacy asset formats
            const migrated = parsed.assets.map((a: any) => ({
              ...a,
              agency: a.agency || a.unit || 'Lovetoons',
              unit: a.agency || a.unit || 'Lovetoons',
              contributors: a.contributors || [],
            }))
            setMasterAssets(migrated)
          }
          if (parsed.categories) setCategories(parsed.categories)
          if (parsed.subcategories) setSubcategories(parsed.subcategories)
          if (parsed.rightsRecords) {
            setMasterRightsRecords(
              parsed.rightsRecords.map((r: any) => ({
                ...r,
                agency: r.agency || r.unit || 'Lovetoons',
                unit: r.agency || r.unit || 'Lovetoons',
              }))
            )
          }
          if (parsed.relationships) setMasterRelationships(parsed.relationships)
          if (parsed.approvals) {
            setMasterApprovals(
              parsed.approvals.map((app: any) => ({
                ...app,
                agency: app.agency || app.unit || 'Lovetoons',
                unit: app.agency || app.unit || 'Lovetoons',
              }))
            )
          }
          if (parsed.activities) setMasterActivities(parsed.activities)
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
      }
    } catch (e) {
      console.error('Failed to persist storage data', e)
    }
  }, [masterAssets, categories, subcategories, masterRightsRecords, masterRelationships, masterApprovals, masterActivities, isInitialized])

  // Change User
  const setCurrentUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user)
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, user.id)
    }
    showToast(`Switched active profile to ${user.name} (${user.roleLabel} • ${user.agency})`)
  }, [showToast])

  // Login handler
  const login = useCallback(
    (emailOrUser: string | UserProfile, password?: string): boolean => {
      let targetUser: UserProfile | undefined
      if (typeof emailOrUser === 'string') {
        targetUser = availableUsers.find(
          (u) => u.email.toLowerCase() === emailOrUser.toLowerCase() || u.name.toLowerCase() === emailOrUser.toLowerCase()
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
    showToast('Signed out of Kiddies Media Production platform.')
  }, [showToast])

  // Role helper flags
  const isSuperAdmin = currentUser.role === 'super_admin'
  const isReviewer = currentUser.role === 'reviewer'
  const isAgencyAdmin = currentUser.role === 'agency_admin' || (currentUser.role as any) === 'unit_admin'
  const isUnitAdmin = isAgencyAdmin
  const canApprove = isReviewer || isSuperAdmin
  const isGlobalViewer = isSuperAdmin || isReviewer
  const userAgency: Agency = currentUser.agency || (currentUser.unit as Agency) || 'Lovetoons'

  // Activity logger
  const addActivity = useCallback(
    (
      title: string,
      subtitle: string,
      iconType: ActivityLog['iconType'] = 'file',
      color = 'bg-blue-100 text-blue-700',
      agency?: Agency
    ) => {
      const targetAgency = agency || currentUser.agency || 'Lovetoons'
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        title,
        subtitle,
        time: 'Just now',
        user: currentUser.name,
        agency: targetAgency,
        unit: targetAgency,
        iconType,
        color,
        timestamp: Date.now(),
      }
      setMasterActivities((prev) => [newAct, ...prev.slice(0, 29)])
    },
    [currentUser]
  )

  // -------------------------------------------------------------
  // ROLE SCOPING LOGIC:
  // Super Admin & Reviewer -> Cover ALL agencies' details
  // Agency Reps -> View details for JUST their agency
  // -------------------------------------------------------------
  const assets = useMemo(() => {
    if (isGlobalViewer) return masterAssets
    return masterAssets.filter((a) => (a.agency || a.unit) === userAgency)
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

  // Real-time Platform Stats (Computed from the scoped views)
  const stats: PlatformStats = useMemo(() => {
    const totalAssets = assets.length
    const approvedAssets = assets.filter((a) => a.status === 'Approved').length
    const pendingAssets = assets.filter((a) => a.status === 'Pending').length
    const attentionAssets = assets.filter((a) => a.status === 'Requires Attention').length
    const inReviewAssets = assets.filter((a) => a.status === 'In Review').length

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
    const approvedAssets = masterAssets.filter((a) => a.status === 'Approved').length
    const pendingAssets = masterAssets.filter((a) => a.status === 'Pending').length
    const attentionAssets = masterAssets.filter((a) => a.status === 'Requires Attention').length
    const inReviewAssets = masterAssets.filter((a) => a.status === 'In Review').length

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

      const contributors: AssetContributor[] =
        data.contributors && data.contributors.length > 0
          ? data.contributors
          : [
              {
                id: `c-${autoId}-1`,
                name: data.creatorName || currentUser.name,
                role: data.creatorRole || currentUser.roleLabel,
                agency: assignedAgency,
                email: currentUser.email,
                contributionType: 'Lead Author',
              },
            ]

      const newAssetItem: AssetData = {
        ...data,
        id: autoId,
        createdDate: dateStr,
        createdTime: timeStr,
        status: data.status || 'Pending',
        agency: assignedAgency,
        unit: assignedAgency,
        creatorName: data.creatorName || currentUser.name,
        creatorRole: data.creatorRole || currentUser.roleLabel,
        creatorSkill: data.creatorSkill || currentUser.skills[0] || 'admin',
        contributors,
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

      // Automatically create approval request if asset is pending or in review
      if (newAssetItem.status === 'Pending' || newAssetItem.status === 'In Review') {
        const newApproval: ApprovalRequest = {
          id: `APP-${now.getFullYear()}-${String(masterApprovals.length + 1).padStart(3, '0')}`,
          assetId: newAssetItem.id,
          assetName: newAssetItem.name,
          category: newAssetItem.category,
          subcategory: newAssetItem.subcategory,
          agency: newAssetItem.agency,
          unit: newAssetItem.agency,
          contributors: newAssetItem.contributors,
          requesterName: newAssetItem.creatorName,
          requesterRole: newAssetItem.creatorRole,
          requesterSkill: newAssetItem.creatorSkill,
          reviewerName: 'Faith Daniel',
          stage: 'Initial Content & Ministry Doctrine Review',
          currentStep: 1,
          totalSteps: 3,
          status: 'Pending',
          priority: 'Medium',
          submittedDate: dateStr,
          submittedTime: timeStr,
          history: [
            {
              stage: 'Submitted for Review',
              author: newAssetItem.creatorName,
              authorRole: newAssetItem.creatorRole,
              date: `${dateStr} ${timeStr}`,
              status: 'Submitted',
              notes: `Asset submitted for ${newAssetItem.agency} review and clearance workflow.`,
            },
          ],
        }
        setMasterApprovals((prev) => [newApproval, ...prev])
      }

      // Automatically create companion Rights Record
      const newRightsRecord: RightsRecord = {
        id: `RG-${autoId}`,
        assetId: newAssetItem.id,
        name: newAssetItem.name,
        category: newAssetItem.category,
        subcategory: newAssetItem.subcategory,
        agency: newAssetItem.agency,
        unit: newAssetItem.agency,
        contributors: newAssetItem.contributors,
        rightsType: 'Worldwide Media Ministry Clearance',
        owner: newAssetItem.rightsHolder || 'Kiddies Media Production Ltd',
        validity: `${now.getFullYear()} – ${now.getFullYear() + 10}`,
        status: newAssetItem.status === 'Approved' ? 'Cleared' : 'Review',
        territory: 'Worldwide',
        term: '10 Years (Renewable)',
        exclusivity: 'Exclusive Ministry Retained',
        licenceType: 'Proprietary IP Assignment Deed',
        royaltyTerms: '100% In-House Retained',
        thumbType: newAssetItem.thumbType,
        description: `Intellectual property rights and staff contributor deeds logged for ${newAssetItem.name}.`,
        governanceScore: newAssetItem.status === 'Approved' ? 100 : 85,
        documents: [
          {
            id: `doc-cert-${autoId}`,
            name: `${newAssetItem.name.replace(/[^a-zA-Z0-9]/g, '_')}_IP_Assignment.pdf`,
            size: '2.4 MB',
            date: dateStr,
            type: 'CERT',
          },
        ],
        governanceChecks: {
          biblicalAlignment: true,
          ageAppropriate: true,
          musicSync: true,
          copyrightReg: true,
          voiceReleases: true,
        },
      }
      setMasterRightsRecords((prev) => [newRightsRecord, ...prev])

      addActivity(
        `Registered intellectual asset: ${newAssetItem.name}`,
        `Created by ${newAssetItem.creatorName} (${newAssetItem.agency}) • ID ${newAssetItem.id} • ${newAssetItem.contributors.length} contributors`,
        'file',
        'bg-blue-100 text-blue-700',
        newAssetItem.agency
      )

      showToast(`Asset "${newAssetItem.name}" registered successfully for ${newAssetItem.agency}!`)
      return newAssetItem
    },
    [masterAssets.length, masterApprovals.length, isGlobalViewer, userAgency, currentUser, addActivity, showToast]
  )

  const updateAsset = useCallback(
    (asset: AssetData) => {
      setMasterAssets((prev) =>
        prev.map((a) => (a.id === asset.id ? { ...asset, agency: asset.agency || a.agency, unit: asset.agency || a.agency } : a))
      )
      addActivity(
        `Updated asset specifications: ${asset.name}`,
        `Modified by ${currentUser.name} (${asset.agency || currentUser.agency})`,
        'link',
        'bg-slate-100 text-slate-700',
        asset.agency || currentUser.agency
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

      addActivity(
        `Deleted asset from catalog: ${target.name}`,
        `Removed by ${currentUser.name} (${target.agency})`,
        'alert',
        'bg-rose-100 text-rose-700',
        target.agency
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
        'bg-emerald-100 text-emerald-700'
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
        'bg-rose-100 text-rose-700'
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
        governanceScore: record.governanceScore || 90,
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
        assignedAgency
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
        record.agency || currentUser.agency
      )
      showToast(`Governance details for "${record.name}" updated.`)
    },
    [currentUser, addActivity, showToast]
  )

  const deleteRightsRecord = useCallback(
    (id: string) => {
      const target = masterRightsRecords.find((r) => r.id === id)
      if (!target) return
      setMasterRightsRecords((prev) => prev.filter((r) => r.id !== id))
      showToast(`Rights clearance record for "${target.name}" removed.`)
    },
    [masterRightsRecords, showToast]
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
        addActivity(
          `Approved request: ${targetApp.assetName}`,
          `Approved by ${currentUser.name} (${currentUser.roleLabel}) • Agency: ${targetApp.agency}`,
          'check',
          'bg-emerald-100 text-emerald-700',
          targetApp.agency
        )
        showToast(`Approval request "${targetApp.assetName}" cleared and marked Approved!`)
      }
    },
    [currentUser, masterApprovals, addActivity, showToast]
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
          targetApp.agency
        )
        showToast(`Request for "${targetApp.assetName}" declined. Notice sent.`)
      }
    },
    [currentUser, masterApprovals, addActivity, showToast]
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
          targetApp.agency
        )
        showToast('Feedback notes registered and sent to creator.')
      }
    },
    [currentUser, masterApprovals, addActivity, showToast]
  )

  const createApprovalRequest = useCallback(
    (assetId: string, priority: ApprovalRequest['priority'] = 'Medium'): ApprovalRequest => {
      const now = new Date()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const targetAsset = masterAssets.find((a) => a.id === assetId)
      const assignedAgency: Agency = targetAsset?.agency || currentUser.agency || 'Lovetoons'

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
        history: [
          {
            stage: 'Submitted for Review',
            author: currentUser.name,
            authorRole: currentUser.roleLabel,
            date: `${dateStr} ${timeStr}`,
            status: 'Submitted',
            notes: `Asset submitted for ${assignedAgency} review and clearance.`,
          },
        ],
      }

      setMasterApprovals((prev) => [newApproval, ...prev])
      showToast(`Approval request logged for "${newApproval.assetName}".`)
      return newApproval
    },
    [masterAssets, masterApprovals.length, currentUser, showToast]
  )

  // Reset to default
  const resetToDefaultData = useCallback(() => {
    setMasterAssets(initialAssetsData)
    setCategories(initialCategories)
    setSubcategories(initialSubcategories)
    setMasterRightsRecords(initialRightsRecords)
    setMasterRelationships(initialRelationships)
    setMasterApprovals(initialApprovals)
    setMasterActivities(initialActivityLogs)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    showToast('All platform data reset to default state.')
  }, [showToast])

  const value = {
    currentUser,
    setCurrentUser,
    availableUsers,
    isAuthenticated,
    isInitialized,
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
    stats,
    globalStats,
    resetToDefaultData,
    toastMessage,
    showToast,
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
