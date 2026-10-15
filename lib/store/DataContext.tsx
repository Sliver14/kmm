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

interface PlatformStats {
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
  isUnitAdmin: boolean

  // Assets
  assets: AssetData[]
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

  // Rights & Governance
  rightsRecords: RightsRecord[]
  addRightsRecord: (record: Omit<RightsRecord, 'id'> & { id?: string }) => RightsRecord
  updateRightsRecord: (record: RightsRecord) => void
  deleteRightsRecord: (id: string) => void

  // Relationships
  relationships: RelationshipItem[]
  addRelationship: (rel: Omit<RelationshipItem, 'id' | 'createdDate' | 'createdTime'>) => RelationshipItem
  deleteRelationship: (id: string) => void

  // Approvals
  approvals: ApprovalRequest[]
  approveRequest: (approvalId: string, reviewerNotes?: string) => void
  declineRequest: (approvalId: string, reason: string) => void
  requestFeedback: (approvalId: string, feedbackNotes: string) => void
  createApprovalRequest: (assetId: string, priority?: ApprovalRequest['priority']) => ApprovalRequest

  // Activity Logs
  activities: ActivityLog[]
  addActivity: (title: string, subtitle: string, iconType?: ActivityLog['iconType'], color?: string) => void

  // Stats & Utilities
  stats: PlatformStats
  resetToDefaultData: () => void
  toastMessage: string | null
  showToast: (msg: string) => void
}

const STORAGE_KEY = 'lovetoons_platform_data_v6'
const USER_KEY = 'lovetoons_current_user_v6'
const AUTH_KEY = 'lovetoons_auth_state_v6'

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Loaded state
  const [isInitialized, setIsInitialized] = useState(false)

  // Current User & Auth
  const [currentUser, setCurrentUserState] = useState<UserProfile>(initialUsers[0])
  const [availableUsers] = useState<UserProfile[]>(initialUsers)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)

  // Core Data
  const [assets, setAssets] = useState<AssetData[]>(initialAssetsData)
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>(initialSubcategories)
  const [rightsRecords, setRightsRecords] = useState<RightsRecord[]>(initialRightsRecords)
  const [relationships, setRelationships] = useState<RelationshipItem[]>(initialRelationships)
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(initialApprovals)
  const [activities, setActivities] = useState<ActivityLog[]>(initialActivityLogs)

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
          if (parsed.assets) setAssets(parsed.assets)
          if (parsed.categories) setCategories(parsed.categories)
          if (parsed.subcategories) setSubcategories(parsed.subcategories)
          if (parsed.rightsRecords) setRightsRecords(parsed.rightsRecords)
          if (parsed.relationships) setRelationships(parsed.relationships)
          if (parsed.approvals) setApprovals(parsed.approvals)
          if (parsed.activities) setActivities(parsed.activities)
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
          assets,
          categories,
          subcategories,
          rightsRecords,
          relationships,
          approvals,
          activities,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      }
    } catch (e) {
      console.error('Failed to persist storage data', e)
    }
  }, [assets, categories, subcategories, rightsRecords, relationships, approvals, activities, isInitialized])

  // Change User
  const setCurrentUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user)
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, user.id)
    }
    showToast(`Switched active profile to ${user.name} (${user.roleLabel})`)
  }, [showToast])

  // Login handler
  const login = useCallback(
    (emailOrUser: string | UserProfile, password?: string): boolean => {
      let targetUser: UserProfile | undefined
      if (typeof emailOrUser === 'string') {
        const trimmed = emailOrUser.trim().toLowerCase()
        targetUser = availableUsers.find(
          (u) => u.email.toLowerCase() === trimmed || u.name.toLowerCase() === trimmed
        )
        if (!targetUser) {
          targetUser =
            availableUsers.find((u) => u.name.toLowerCase().includes(trimmed)) || availableUsers[0]
        }
      } else {
        targetUser = emailOrUser
      }

      if (targetUser) {
        setCurrentUserState(targetUser)
        setIsAuthenticated(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_KEY, targetUser.id)
          localStorage.setItem(AUTH_KEY, 'true')
        }
        showToast(`Welcome back, ${targetUser.name}!`)
        return true
      }
      return false
    },
    [availableUsers, showToast]
  )

  // Logout handler
  const logout = useCallback(() => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'false')
      window.location.href = '/signin'
    }
    showToast('You have been logged out.')
  }, [showToast])

  // Activity Logger
  const addActivity = useCallback((
    title: string,
    subtitle: string,
    iconType: ActivityLog['iconType'] = 'check',
    color = 'bg-blue-100 text-blue-700'
  ) => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      title,
      subtitle,
      time: 'Just now',
      user: currentUser.name,
      unit: currentUser.unit,
      iconType,
      color,
      timestamp: Date.now(),
    }
    setActivities((prev) => [newAct, ...prev.slice(0, 24)])
  }, [currentUser])

  // Asset CRUD
  const addAsset = useCallback((
    data: Omit<AssetData, 'id' | 'createdDate' | 'createdTime'> & { id?: string }
  ): AssetData => {
    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const categoryPrefix = (data.category || 'AS').slice(0, 2).toUpperCase()
    const autoId = data.id || `LT-${categoryPrefix}-${String(assets.length + 1).padStart(3, '0')}`

    const newAssetItem: AssetData = {
      ...data,
      id: autoId,
      createdDate: dateStr,
      createdTime: timeStr,
      status: data.status || 'Pending',
      unit: data.unit || currentUser.unit,
      creatorName: data.creatorName || currentUser.name,
      creatorRole: data.creatorRole || currentUser.roleLabel,
      creatorSkill: data.creatorSkill || currentUser.skills[0] || 'admin',
      tags: data.tags && data.tags.length > 0 ? data.tags : ['New Asset'],
    }

    setAssets((prev) => [newAssetItem, ...prev])

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
        id: `APP-${now.getFullYear()}-${String(approvals.length + 1).padStart(3, '0')}`,
        assetId: newAssetItem.id,
        assetName: newAssetItem.name,
        category: newAssetItem.category,
        subcategory: newAssetItem.subcategory,
        unit: newAssetItem.unit,
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
            notes: 'Asset submitted for review and approval workflow.',
          },
        ],
      }
      setApprovals((prev) => [newApproval, ...prev])
    }

    // Automatically create Rights Record for the newly created asset
    const newRights: RightsRecord = {
      id: `LT-RG-${String(rightsRecords.length + 1).padStart(3, '0')}`,
      assetId: newAssetItem.id,
      name: newAssetItem.name,
      category: newAssetItem.category,
      subcategory: newAssetItem.subcategory,
      unit: newAssetItem.unit,
      rightsType: 'Master Intellectual Property & Broadcast',
      owner: newAssetItem.rightsHolder || 'Lovetoons Media Ltd',
      validity: '2025 – 2035',
      status: newAssetItem.status === 'Approved' ? 'Cleared' : 'Review',
      territory: 'Worldwide',
      term: '10 Years',
      exclusivity: 'Exclusive Ministry Rights',
      licenceType: 'Proprietary Content License',
      royaltyTerms: '100% In-House Retained',
      thumbType: newAssetItem.thumbType,
      governanceScore: newAssetItem.status === 'Approved' ? 100 : 85,
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `${newAssetItem.name.replace(/[^a-zA-Z0-9]/g, '_')}_Filing_Deed.pdf`,
          size: '2.1 MB',
          date: dateStr,
          type: 'CERT',
        },
      ],
      governanceChecks: {
        biblicalAlignment: true,
        ageAppropriate: true,
        musicSync: true,
        copyrightReg: newAssetItem.status === 'Approved',
        voiceReleases: true,
      },
    }
    setRightsRecords((prev) => [newRights, ...prev])

    addActivity(
      `New asset created: ${newAssetItem.name}`,
      `Created by ${newAssetItem.creatorName} (${newAssetItem.unit}) • ID ${newAssetItem.id}`,
      'file',
      'bg-blue-100 text-blue-700'
    )

    showToast(`Asset "${newAssetItem.name}" successfully created with ID ${newAssetItem.id}!`)
    return newAssetItem
  }, [assets.length, currentUser, approvals.length, rightsRecords.length, addActivity, showToast])

  const updateAsset = useCallback((updated: AssetData) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    addActivity(
      `Asset updated: ${updated.name}`,
      `Modified by ${currentUser.name} • Status: ${updated.status}`,
      'file',
      'bg-indigo-100 text-indigo-700'
    )
    showToast(`Asset "${updated.name}" updated successfully!`)
  }, [currentUser.name, addActivity, showToast])

  const deleteAsset = useCallback((id: string) => {
    const found = assets.find((a) => a.id === id)
    if (!found) return

    setAssets((prev) => prev.filter((a) => a.id !== id))
    setRelationships((prev) => prev.filter((r) => r.sourceId !== id && r.targetId !== id))
    setApprovals((prev) => prev.filter((app) => app.assetId !== id))
    setRightsRecords((prev) => prev.filter((rg) => rg.assetId !== id))

    addActivity(
      `Asset removed: ${found.name}`,
      `Deleted from repository by ${currentUser.name}`,
      'alert',
      'bg-rose-100 text-rose-700'
    )
    showToast(`Asset "${found.name}" removed from platform.`)
  }, [assets, currentUser.name, addActivity, showToast])

  const bulkApproveAssets = useCallback((ids: string[]) => {
    setAssets((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'Approved' } : a))
    )
    setApprovals((prev) =>
      prev.map((app) => (ids.includes(app.assetId) ? { ...app, status: 'Approved' } : app))
    )
    addActivity(
      `Bulk approved ${ids.length} assets`,
      `Approved by ${currentUser.name} (${currentUser.roleLabel})`,
      'check',
      'bg-emerald-100 text-emerald-700'
    )
    showToast(`Approved ${ids.length} assets successfully!`)
  }, [currentUser.name, currentUser.roleLabel, addActivity, showToast])

  const bulkDeleteAssets = useCallback((ids: string[]) => {
    setAssets((prev) => prev.filter((a) => !ids.includes(a.id)))
    setRelationships((prev) =>
      prev.filter((r) => !ids.includes(r.sourceId) && !ids.includes(r.targetId))
    )
    setApprovals((prev) => prev.filter((app) => !ids.includes(app.assetId)))
    showToast(`Deleted ${ids.length} assets.`)
  }, [showToast])

  // Categories & Subcategories CRUD
  const addCategory = useCallback((
    cat: Omit<CategoryItem, 'id' | 'subcategoriesCount' | 'assetsCount'>
  ): CategoryItem => {
    const newCat: CategoryItem = {
      ...cat,
      id: `cat-${Date.now()}`,
      subcategoriesCount: 0,
      assetsCount: 0,
    }
    setCategories((prev) => [...prev, newCat])
    showToast(`Category "${newCat.name}" added successfully!`)
    return newCat
  }, [showToast])

  const updateCategory = useCallback((cat: CategoryItem) => {
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)))
    showToast(`Category "${cat.name}" updated.`)
  }, [showToast])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    showToast('Category removed.')
  }, [showToast])

  const addSubcategory = useCallback((
    sub: Omit<SubcategoryItem, 'id' | 'assetsCount'>
  ): SubcategoryItem => {
    const newSub: SubcategoryItem = {
      ...sub,
      id: `sub-${Date.now()}`,
      assetsCount: 0,
    }
    setSubcategories((prev) => [...prev, newSub])
    setCategories((prev) =>
      prev.map((c) =>
        c.name === newSub.parentCategory
          ? { ...c, subcategoriesCount: c.subcategoriesCount + 1 }
          : c
      )
    )
    showToast(`Subcategory "${newSub.name}" added!`)
    return newSub
  }, [showToast])

  const updateSubcategory = useCallback((sub: SubcategoryItem) => {
    setSubcategories((prev) => prev.map((s) => (s.id === sub.id ? sub : s)))
    showToast(`Subcategory "${sub.name}" updated.`)
  }, [showToast])

  const deleteSubcategory = useCallback((id: string) => {
    const target = subcategories.find((s) => s.id === id)
    if (target) {
      setCategories((prev) =>
        prev.map((c) =>
          c.name === target.parentCategory
            ? { ...c, subcategoriesCount: Math.max(0, c.subcategoriesCount - 1) }
            : c
        )
      )
    }
    setSubcategories((prev) => prev.filter((s) => s.id !== id))
    showToast('Subcategory removed.')
  }, [subcategories, showToast])

  // Rights CRUD
  const addRightsRecord = useCallback((
    record: Omit<RightsRecord, 'id'> & { id?: string }
  ): RightsRecord => {
    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const autoId = record.id || `LT-RG-${String(rightsRecords.length + 1).padStart(3, '0')}`
    const newRecord: RightsRecord = {
      ...record,
      id: autoId,
      governanceScore: record.governanceScore || (record.status === 'Cleared' ? 100 : 85),
      documents: record.documents || [],
      governanceChecks: record.governanceChecks || {
        biblicalAlignment: true,
        ageAppropriate: true,
        musicSync: true,
        copyrightReg: true,
        voiceReleases: true,
      },
    }
    setRightsRecords((prev) => [newRecord, ...prev])

    // If rights scope requires review, automatically push to reviewer queue
    if (newRecord.status === 'Review' || newRecord.status === 'Pending') {
      const newApproval: ApprovalRequest = {
        id: `APP-${now.getFullYear()}-${String(approvals.length + 1).padStart(3, '0')}`,
        assetId: newRecord.assetId || newRecord.id,
        assetName: `${newRecord.name} (Rights Scope Clearance)`,
        category: newRecord.category,
        subcategory: newRecord.subcategory,
        unit: newRecord.unit || currentUser.unit,
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
            notes: `Submitted scope: ${newRecord.rightsType} (${newRecord.territory || 'Worldwide'}, ${newRecord.term || '10 Years'})`,
          },
        ],
      }
      setApprovals((prev) => [newApproval, ...prev])
    }

    addActivity(
      `Rights scope submitted: ${newRecord.name}`,
      `Submitted by ${currentUser.name} (${newRecord.rightsType}) • Territory: ${newRecord.territory || 'Worldwide'}`,
      'shield',
      'bg-purple-100 text-purple-700'
    )
    showToast(`Rights record for "${newRecord.name}" submitted! Reviewer notified.`)
    return newRecord
  }, [rightsRecords.length, approvals.length, currentUser, addActivity, showToast])

  const updateRightsRecord = useCallback((record: RightsRecord) => {
    setRightsRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)))
    addActivity(
      `Governance details updated: ${record.name}`,
      `Modified by ${currentUser.name} (${currentUser.roleLabel}) • Score: ${record.governanceScore || 100}% • Status: ${record.status}`,
      'shield',
      'bg-purple-100 text-purple-700'
    )
    showToast(`Governance & Rights details for "${record.name}" updated and audit logged!`)
  }, [currentUser.name, currentUser.roleLabel, addActivity, showToast])

  const deleteRightsRecord = useCallback((id: string) => {
    setRightsRecords((prev) => prev.filter((r) => r.id !== id))
    showToast('Rights record removed.')
  }, [showToast])

  // Relationships CRUD
  const addRelationship = useCallback((
    rel: Omit<RelationshipItem, 'id' | 'createdDate' | 'createdTime'>
  ): RelationshipItem => {
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

    setRelationships((prev) => [newRel, ...prev])
    addActivity(
      `Asset link created: ${rel.sourceAsset} → ${rel.targetAsset}`,
      `Relationship type: ${rel.relationshipType}`,
      'link',
      'bg-teal-100 text-teal-700'
    )
    showToast(`Connected "${rel.sourceAsset}" to "${rel.targetAsset}"!`)
    return newRel
  }, [addActivity, showToast])

  const deleteRelationship = useCallback((id: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id))
    showToast('Relationship removed.')
  }, [showToast])

  // Approvals Workflow
  const approveRequest = useCallback((approvalId: string, reviewerNotes?: string) => {
    const now = new Date()
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    setApprovals((prev) =>
      prev.map((app) => {
        if (app.id !== approvalId) return app
        const newHistoryItem = {
          stage: 'Approved by Reviewer',
          author: currentUser.name,
          authorRole: currentUser.roleLabel,
          date: dateStr,
          status: 'Approved',
          notes: reviewerNotes || 'Asset & Rights clearance approved for broadcast and distribution.',
        }
        return {
          ...app,
          status: 'Approved',
          currentStep: app.totalSteps,
          history: [...app.history, newHistoryItem],
        }
      })
    )

    // Update associated asset and rights status
    const targetApproval = approvals.find((a) => a.id === approvalId)
    if (targetApproval) {
      setAssets((prev) =>
        prev.map((a) => (a.id === targetApproval.assetId ? { ...a, status: 'Approved' } : a))
      )
      setRightsRecords((prev) =>
        prev.map((r) =>
          r.assetId === targetApproval.assetId || r.id === targetApproval.assetId
            ? { ...r, status: 'Cleared', governanceScore: 100 }
            : r
        )
      )
      addActivity(
        `Approval & clearance granted: ${targetApproval.assetName}`,
        `Cleared by ${currentUser.name} (${currentUser.roleLabel})`,
        'check',
        'bg-emerald-100 text-emerald-700'
      )
    }
    showToast('Asset and rights clearance approved!')
  }, [currentUser.name, currentUser.roleLabel, approvals, addActivity, showToast])

  const declineRequest = useCallback((approvalId: string, reason: string) => {
    const now = new Date()
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    setApprovals((prev) =>
      prev.map((app) => {
        if (app.id !== approvalId) return app
        const newHistoryItem = {
          stage: 'Declined by Reviewer',
          author: currentUser.name,
          authorRole: currentUser.roleLabel,
          date: dateStr,
          status: 'Declined',
          notes: reason,
        }
        return {
          ...app,
          status: 'Declined',
          feedbackNotes: reason,
          history: [...app.history, newHistoryItem],
        }
      })
    )

    const targetApproval = approvals.find((a) => a.id === approvalId)
    if (targetApproval) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === targetApproval.assetId ? { ...a, status: 'Requires Attention' } : a
        )
      )
      addActivity(
        `Asset declined: ${targetApproval.assetName}`,
        `Declined by ${currentUser.name}: "${reason}"`,
        'alert',
        'bg-rose-100 text-rose-700'
      )
    }
    showToast('Asset approval declined. Requester notified.')
  }, [currentUser.name, approvals, addActivity, showToast])

  const requestFeedback = useCallback((approvalId: string, feedbackNotes: string) => {
    const now = new Date()
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    setApprovals((prev) =>
      prev.map((app) => {
        if (app.id !== approvalId) return app
        const newHistoryItem = {
          stage: 'Feedback Requested',
          author: currentUser.name,
          authorRole: currentUser.roleLabel,
          date: dateStr,
          status: 'Needs Feedback',
          notes: feedbackNotes,
        }
        return {
          ...app,
          status: 'Needs Feedback',
          feedbackNotes,
          history: [...app.history, newHistoryItem],
        }
      })
    )

    const targetApproval = approvals.find((a) => a.id === approvalId)
    if (targetApproval) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === targetApproval.assetId ? { ...a, status: 'In Review' } : a
        )
      )
      addActivity(
        `Feedback requested: ${targetApproval.assetName}`,
        `Note from ${currentUser.name}: "${feedbackNotes}"`,
        'alert',
        'bg-amber-100 text-amber-700'
      )
    }
    showToast('Feedback request submitted to creator!')
  }, [currentUser.name, approvals, addActivity, showToast])

  const createApprovalRequest = useCallback((
    assetId: string,
    priority: ApprovalRequest['priority'] = 'Medium'
  ): ApprovalRequest => {
    const targetAsset = assets.find((a) => a.id === assetId)
    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newApproval: ApprovalRequest = {
      id: `APP-${now.getFullYear()}-${String(approvals.length + 1).padStart(3, '0')}`,
      assetId: targetAsset?.id || assetId,
      assetName: targetAsset?.name || 'Asset for Review',
      category: targetAsset?.category || 'General',
      subcategory: targetAsset?.subcategory || 'General',
      unit: targetAsset?.unit || currentUser.unit,
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
          notes: 'Asset submitted for review and clearance.',
        },
      ],
    }

    setApprovals((prev) => [newApproval, ...prev])
    showToast(`Approval workflow started for "${newApproval.assetName}"!`)
    return newApproval
  }, [assets, approvals.length, currentUser, showToast])

  // Reset Data to Factory Default
  const resetToDefaultData = useCallback(() => {
    setAssets(initialAssetsData)
    setCategories(initialCategories)
    setSubcategories(initialSubcategories)
    setRightsRecords(initialRightsRecords)
    setRelationships(initialRelationships)
    setApprovals(initialApprovals)
    setActivities(initialActivityLogs)
    setCurrentUserState(initialUsers[0])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(USER_KEY)
    }
    showToast('All platform data reset to initial demo state.')
  }, [showToast])

  // Computed Real-time Stats
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

  const canApprove = currentUser.role === 'reviewer' || currentUser.role === 'super_admin'
  const isSuperAdmin = currentUser.role === 'super_admin'
  const isReviewer = currentUser.role === 'reviewer'
  const isUnitAdmin = currentUser.role === 'unit_admin'

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
    isUnitAdmin,
    assets,
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
    addRightsRecord,
    updateRightsRecord,
    deleteRightsRecord,
    relationships,
    addRelationship,
    deleteRelationship,
    approvals,
    approveRequest,
    declineRequest,
    requestFeedback,
    createApprovalRequest,
    activities,
    addActivity,
    stats,
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
