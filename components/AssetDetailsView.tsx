'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Boxes, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, Clock,
  Globe2, FileCode, ShieldCheck, Tv, Film, Music, Play,
  Layers, Download, Plus, Trash2, Link2, Activity, User, Users, Calendar,
  ExternalLink, Tag, Sparkles, Check, X, FileText, AlertCircle,
  Share2, Info, ArrowUpRight, Award, Flame, RefreshCw, BookOpen,
  Gamepad2, Package, UploadCloud, ShieldAlert, FileCheck, CheckSquare, Square,
  Lock, Send, ArrowRight, Pencil
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLovetoonsData } from '@/lib/store/DataContext'
import { AssetVisualPreview } from '@/components/AssetVisualPreview'
import { ConfirmActionModal } from '@/components/ConfirmActionModal'
import { EditAssetModal } from '@/components/EditAssetModal'
import { AssetData, AssetStatus, RelationshipItem, RightsDocument, ApprovalRequest, AssetEpisode } from '@/types'

interface AssetDetailsViewProps {
  asset: AssetData
  onBack: () => void
  onSelectAsset?: (a: AssetData) => void
  setActiveNav?: (nav: string) => void
}

// Category icon helper
function CategoryIcon({ category }: { category: string }) {
  if (category.includes('Animated') || category.includes('TV') || category.includes('Film')) {
    return <Tv className="size-4" />
  }
  if (category.includes('Music') || category.includes('Audio')) {
    return <Music className="size-4" />
  }
  if (category.includes('Digital') || category.includes('Interactive') || category.includes('Game')) {
    return <Gamepad2 className="size-4" />
  }
  if (category.includes('Book') || category.includes('Publishing') || category.includes('Comic')) {
    return <BookOpen className="size-4" />
  }
  return <Package className="size-4" />
}

export function AssetDetailsView({
  asset,
  onBack,
  onSelectAsset,
  setActiveNav,
}: AssetDetailsViewProps) {
  const {
    assets,
    updateAsset,
    showToast,
    rightsRecords,
    updateRightsRecord,
    relationships,
    approvals,
    createApprovalRequest,
    activities,
    addRelationship,
    deleteRelationship,
    currentUser,
    addActivity,
    categories,
    subcategories,
    isGlobalViewer,
  } = useLovetoonsData()

  // 3 Intuitive Core Pillars (Tabs) - File archive details removed from frontend until secure cloud storage is connected
  const [activeTab, setActiveTab] = useState<'overview' | 'rights' | 'connections'>('overview')
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  // Add Relationship Modal
  const [isAddRelModalOpen, setIsAddRelModalOpen] = useState(false)
  const [targetAssetId, setTargetAssetId] = useState('')
  const [relType, setRelType] = useState<RelationshipItem['relationshipType']>('Used In')
  const [relDetails, setRelDetails] = useState('')

  // Representative Document Upload Modal
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false)
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState<'PDF' | 'DOCX' | 'CERT' | 'LICENSE'>('PDF')
  const [docNotes, setDocNotes] = useState('')
  const [isSavingDoc, setIsSavingDoc] = useState(false)

  // Cloudinary Media Upload Modal State
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaFileType, setMediaFileType] = useState('video_master')
  const [isMasterFile, setIsMasterFile] = useState(true)
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)

  // Schedule Approval Modal State
  const [isScheduleApprovalModalOpen, setIsScheduleApprovalModalOpen] = useState(false)
  const [schedulePriority, setSchedulePriority] = useState<ApprovalRequest['priority']>('Medium')
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)

  // Existing approval request for this asset
  const existingApproval = useMemo(() => {
    return approvals.find((a) => a.assetId === asset.id)
  }, [approvals, asset.id])

  // Linked Rights Record
  const linkedRights = useMemo(() => {
    return rightsRecords.find((r) => r.assetId === asset.id || r.name.includes(asset.name))
  }, [rightsRecords, asset])

  // Representative Governance Checks State
  const [checks, setChecks] = useState<Record<string, boolean>>({
    'Scripture & Biblical Fidelity Verification': false,
    'Child Safety & COPPA Compliance Review': false,
    'Audio Master & Soundtrack Synchronization License': false,
    'Voice Cast Talent Release & Identity Clearance': false,
    'KMM Ministry Trademark Registration Seal': false,
  })

  // Representative Uploaded Documents State
  const [documents, setDocuments] = useState<RightsDocument[]>([])

  // Representative Rights & Legal Terms Modal State
  const [isEditRightsModalOpen, setIsEditRightsModalOpen] = useState(false)
  const [rightsScopeInput, setRightsScopeInput] = useState('')
  const [exclusivityInput, setExclusivityInput] = useState('')
  const [territoryInput, setTerritoryInput] = useState('')
  const [validityInput, setValidityInput] = useState('')
  const [licenceTypeInput, setLicenceTypeInput] = useState('')
  const [royaltyTermsInput, setRoyaltyTermsInput] = useState('')
  const [attachDocWithRights, setAttachDocWithRights] = useState(false)
  const [rightsDocTitle, setRightsDocTitle] = useState('')
  const [rightsDocClassification, setRightsDocClassification] = useState<'PDF' | 'DOCX' | 'CERT' | 'LICENSE'>('PDF')
  const [rightsDocNotes, setRightsDocNotes] = useState('')
  const [isSavingRights, setIsSavingRights] = useState(false)

  const openRightsModal = (defaultSection?: 'scope' | 'territory' | 'licensing') => {
    setRightsScopeInput(linkedRights?.rightsType || '')
    setExclusivityInput(linkedRights?.exclusivity || '')
    setTerritoryInput(linkedRights?.territory || '')
    setValidityInput(linkedRights?.validity || linkedRights?.term || '')
    setLicenceTypeInput(linkedRights?.licenceType || '')
    setRoyaltyTermsInput(linkedRights?.royaltyTerms || '')
    setAttachDocWithRights(false)
    setRightsDocTitle('')
    setRightsDocNotes('')
    setIsEditRightsModalOpen(true)
  }

  useEffect(() => {
    if (linkedRights) {
      if (Array.isArray(linkedRights.documents)) {
        setDocuments(linkedRights.documents)
      }
      if (linkedRights.governanceChecks && typeof linkedRights.governanceChecks === 'object') {
        setChecks((prev) => ({
          ...prev,
          ...linkedRights.governanceChecks,
        }))
      }
    }
  }, [linkedRights])

  // Governance Score Calculation (Each check is 20%)
  const completedChecksCount = useMemo(() => {
    return Object.values(checks).filter(Boolean).length
  }, [checks])
  const calculatedGovernanceScore = completedChecksCount * 20

  // Asset Relationships
  const assetRelationships = useMemo(() => {
    return relationships.filter(
      (r) =>
        r.sourceId === asset.id ||
        r.targetId === asset.id ||
        r.sourceAssetId === asset.id ||
        r.targetAssetId === asset.id
    )
  }, [relationships, asset.id])

  // Asset Approvals
  const assetApprovals = useMemo(() => {
    return approvals.filter((a) => a.assetId === asset.id)
  }, [approvals, asset.id])

  // Asset Activities / History
  const assetActivities = useMemo(() => {
    return activities.filter(
      (act) => act.assetId === asset.id || act.title.includes(asset.name) || act.subtitle.includes(asset.id) || act.details?.includes(asset.id)
    )
  }, [activities, asset.name, asset.id])

  // Reusable Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    description: React.ReactNode
    confirmLabel?: string
    variant?: 'primary' | 'danger' | 'warning' | 'success'
    badge?: string
    details?: React.ReactNode
    onConfirm: () => void | Promise<void>
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  // Edit Asset Modal State
  const [isEditAssetModalOpen, setIsEditAssetModalOpen] = useState(false)

  // Handle Edit Asset Save with Confirmation & Audit Log
  const handleInitiateAssetSave = (updatedData: Partial<AssetData>) => {
    setIsEditAssetModalOpen(false)
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Asset Modification',
      description: `Are you sure you want to save modifications to "${asset.name}"? All updated attributes and details will be logged in the permanent audit trail.`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Updated Title:</span> {updatedData.name || asset.name}</div>
          <div><span className="font-semibold text-slate-700">Category:</span> {updatedData.category || asset.category}</div>
          <div><span className="font-semibold text-slate-700">Rights Holder:</span> {updatedData.rightsHolder || asset.rightsHolder}</div>
          <div><span className="font-semibold text-slate-700">Staff Contributors:</span> {updatedData.contributors?.length || 0} assigned</div>
        </div>
      ),
      confirmLabel: 'Confirm & Save Changes',
      variant: 'primary',
      badge: 'Audit Trail Required',
      onConfirm: () => {
        const merged: AssetData = { ...asset, ...updatedData }
        updateAsset(merged)
        addActivity(
          `Asset metadata modified: ${merged.name}`,
          `Specifications and details updated by ${currentUser.name} (${currentUser.roleLabel})`,
          'file',
          'bg-blue-100 text-blue-700',
          merged.agency,
          {
            assetId: merged.id,
            assetName: merged.name,
            actionType: 'UPDATE',
            details: `Asset details, attributes, and contributors updated for ${merged.name} (${merged.id}).`,
          }
        )
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Asset "${merged.name}" updated and audit logged!`)
      },
    })
  }

  // Category classification helpers
  const isVideoCategory =
    asset.category === 'Animated Programme' ||
    asset.category === 'TV Programme' ||
    asset.category === 'Film / Short Movie' ||
    asset.category === 'Documentary / Video'

  const isDigitalCategory = asset.category === 'Digital / Interactive Platform'
  const isPublishingCategory = asset.category === 'Publishing / Book' || asset.category === 'Publishing / Comics'
  const isMusicCategory = asset.category === 'Music / Audio'

  const episodes: AssetEpisode[] = useMemo(() => {
    return asset.attributes?.episodes || []
  }, [asset.attributes?.episodes])

  // Episode Management Modal State
  const [isAddEpisodeModalOpen, setIsAddEpisodeModalOpen] = useState(false)
  const [epNum, setEpNum] = useState<number>(episodes.length + 1)
  const [epTitle, setEpTitle] = useState('')
  const [epDuration, setEpDuration] = useState<number>(asset.attributes?.durationMinutes || 15)
  const [epSynopsis, setEpSynopsis] = useState('')
  const [epAirDate, setEpAirDate] = useState('')
  const [epStatus, setEpStatus] = useState<AssetEpisode['status']>('In Production')
  const [epVideoUrl, setEpVideoUrl] = useState('')

  // Handle Add Episode Submit with Confirmation & Audit Log
  const handleInitiateAddEpisode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!epTitle.trim()) {
      showToast('Please enter an episode title.')
      return
    }

    const newEpNumber = Number(epNum) || (episodes.length + 1)
    let formattedAirDate: string | undefined = undefined
    if (epAirDate.trim()) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(epAirDate.trim())) {
        const [y, m, d] = epAirDate.trim().split('-').map(Number)
        const dateObj = new Date(y, m - 1, d)
        formattedAirDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } else {
        formattedAirDate = epAirDate.trim()
      }
    }

    const newEp: AssetEpisode = {
      id: `ep-${asset.id}-${Date.now().toString().slice(-4)}`,
      episodeNumber: newEpNumber,
      title: epTitle.trim(),
      durationMinutes: Number(epDuration) || 15,
      synopsis: epSynopsis.trim(),
      airDate: formattedAirDate,
      status: epStatus,
      videoUrl: epVideoUrl.trim() || undefined,
    }

    setIsAddEpisodeModalOpen(false)
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Adding Production Episode',
      description: `Confirm cataloguing Episode #${newEp.episodeNumber} "${newEp.title}" into the official production registry for "${asset.name}"?`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Episode:</span> #{newEp.episodeNumber} - {newEp.title}</div>
          <div><span className="font-semibold text-slate-700">Duration:</span> {newEp.durationMinutes} mins</div>
          <div><span className="font-semibold text-slate-700">Status:</span> {newEp.status}</div>
          {newEp.airDate && <div><span className="font-semibold text-slate-700">Release Date:</span> {newEp.airDate}</div>}
        </div>
      ),
      confirmLabel: 'Confirm & Record Episode',
      variant: 'primary',
      badge: 'Audit Trail Required',
      onConfirm: () => {
        const updatedEpisodes = [...episodes, newEp]
        const updatedAsset: AssetData = {
          ...asset,
          attributes: {
            ...asset.attributes,
            episodes: updatedEpisodes,
            episodesCount: Math.max(asset.attributes?.episodesCount || 0, updatedEpisodes.length),
          },
        }
        updateAsset(updatedAsset)
        addActivity(
          `Added episode #${newEp.episodeNumber}: "${newEp.title}"`,
          `Catalogued for "${asset.name}" by ${currentUser.name} (${currentUser.roleLabel})`,
          'file',
          'bg-purple-100 text-purple-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'UPDATE',
            details: `Added Episode #${newEp.episodeNumber} "${newEp.title}" (${newEp.durationMinutes} mins, status: ${newEp.status}) to ${asset.name}.`,
          }
        )
        setEpTitle('')
        setEpSynopsis('')
        setEpVideoUrl('')
        setEpAirDate('')
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Episode #${newEp.episodeNumber} recorded and audit logged!`)
      },
    })
  }

  // Handle Delete Episode Submit with Confirmation & Audit Log
  const handleInitiateDeleteEpisode = (episodeId: string) => {
    const target = episodes.find((e) => e.id === episodeId)
    if (!target) return

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Deletion of Production Episode',
      description: `Are you sure you want to remove Episode #${target.episodeNumber} "${target.title}" from "${asset.name}"? This action will be logged in the audit trail.`,
      confirmLabel: 'Delete Episode',
      variant: 'danger',
      badge: 'Permanent Deletion',
      onConfirm: () => {
        const updatedEpisodes = episodes.filter((e) => e.id !== episodeId)
        const updatedAsset: AssetData = {
          ...asset,
          attributes: {
            ...asset.attributes,
            episodes: updatedEpisodes,
          },
        }
        updateAsset(updatedAsset)
        addActivity(
          `Removed episode #${target.episodeNumber}: "${target.title}"`,
          `Deleted from "${asset.name}" by ${currentUser.name} (${currentUser.roleLabel})`,
          'alert',
          'bg-rose-100 text-rose-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'DELETE',
            details: `Deleted Episode #${target.episodeNumber} "${target.title}" from ${asset.name}.`,
          }
        )
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Episode #${target.episodeNumber} removed from registry.`)
      },
    })
  }

  // Handle Add Relationship Submit with Confirmation
  const handleAddRelationshipOnAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetAssetId) {
      showToast('Please select an asset to connect')
      return
    }
    const targetAsset = assets.find((a) => a.id === targetAssetId)
    if (!targetAsset) return

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Intellectual Asset Connection',
      description: `Establish a "${relType}" link between "${asset.name}" and "${targetAsset.name}"?`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Source:</span> {asset.name}</div>
          <div><span className="font-semibold text-slate-700">Relationship:</span> {relType}</div>
          <div><span className="font-semibold text-slate-700">Target:</span> {targetAsset.name}</div>
        </div>
      ),
      confirmLabel: 'Confirm Connection',
      variant: 'primary',
      badge: 'Audit Trail Logged',
      onConfirm: () => {
        addRelationship({
          sourceId: asset.id,
          sourceAssetId: asset.id,
          sourceAsset: asset.name,
          sourceIconType: asset.thumbType || 'tv_series',
          targetId: targetAsset.id,
          targetAssetId: targetAsset.id,
          targetAsset: targetAsset.name,
          targetIconType: targetAsset.thumbType || 'tv_series',
          relationshipType: relType,
          details: relDetails.trim() || `${asset.name} is ${relType} ${targetAsset.name}`,
          category: asset.category,
        })

        addActivity(
          `Connected IP assets: ${asset.name} ↔ ${targetAsset.name}`,
          `"${relType}" connection established by ${currentUser.name}`,
          'link',
          'bg-blue-100 text-blue-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'UPDATE',
            details: `Linked "${asset.name}" with "${targetAsset.name}" as ${relType}`,
          }
        )

        setIsAddRelModalOpen(false)
        setTargetAssetId('')
        setRelDetails('')
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Connected ${asset.name} with ${targetAsset.name}`)
      },
    })
  }

  // Handle Governance Check Toggle with Confirmation & Audit Log
  const handleToggleGovernanceCheck = (checkKey: string) => {
    const isCurrentlyChecked = !!checks[checkKey]
    const updatedChecks = {
      ...checks,
      [checkKey]: !isCurrentlyChecked,
    }
    const newScore = Object.values(updatedChecks).filter(Boolean).length * 20

    setConfirmConfig({
      isOpen: true,
      title: isCurrentlyChecked ? 'Confirm Check Invalidation' : 'Confirm Governance Clearance',
      description: `Are you sure you want to mark "${checkKey}" as ${!isCurrentlyChecked ? 'VERIFIED' : 'UNVERIFIED'} for "${asset.name}"?`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Clearance Item:</span> {checkKey}</div>
          <div><span className="font-semibold text-slate-700">Governance Score:</span> {completedChecksCount * 20}% → <span className="font-bold text-indigo-600">{newScore}%</span></div>
          <div><span className="font-semibold text-slate-700">Acting Representative:</span> {currentUser.name} ({currentUser.roleLabel})</div>
        </div>
      ),
      confirmLabel: !isCurrentlyChecked ? 'Confirm Clearance & Log' : 'Confirm Invalidation',
      variant: !isCurrentlyChecked ? 'success' : 'warning',
      badge: 'Audit Trail Required',
      onConfirm: async () => {
        setChecks(updatedChecks)
        if (linkedRights) {
          updateRightsRecord({
            ...linkedRights,
            governanceChecks: updatedChecks,
            governanceScore: newScore,
            status: newScore === 100 ? 'Cleared' : 'Review',
          })
        }

        addActivity(
          `Governance verification: ${asset.name}`,
          `"${checkKey}" set to ${!isCurrentlyChecked ? 'Verified' : 'Unchecked'} by ${currentUser.name} (${newScore}% compliance score)`,
          'shield',
          !isCurrentlyChecked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'GOVERNANCE',
            details: `Clearance check "${checkKey}" set to ${!isCurrentlyChecked ? 'TRUE' : 'FALSE'}. Governance score is now ${newScore}%.`,
          }
        )

        try {
          await fetch('/api/rights', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assetId: asset.id,
              governanceChecks: updatedChecks,
              governanceScore: newScore,
              status: newScore === 100 ? 'Cleared' : 'Pending Representative Review',
            }),
          })
          showToast(`Governance verification updated & audit logged! (${newScore}% verified)`)
        } catch (err) {
          console.error(err)
          showToast('Updated locally (offline mode)')
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  // Handle Representative Document Upload with Confirmation & Audit Log
  const handleSaveRepresentativeDoc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!docName.trim()) {
      showToast('Please enter document title')
      return
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Legal Document Attachment',
      description: `Attach legal clearance document "${docName.trim()}" (${docType}) to "${asset.name}"? This deed attachment will be recorded in the permanent audit trail.`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Document Title:</span> {docName.trim()}</div>
          <div><span className="font-semibold text-slate-700">Classification:</span> {docType}</div>
          <div><span className="font-semibold text-slate-700">Uploading Representative:</span> {currentUser.name}</div>
        </div>
      ),
      confirmLabel: 'Confirm & Attach Document',
      variant: 'primary',
      badge: 'Audit Trail Logged',
      onConfirm: async () => {
        setIsSavingDoc(true)
        const newDoc: RightsDocument = {
          id: `doc-${Date.now().toString().slice(-6)}`,
          name: docName.trim(),
          type: docType,
          size: '2.4 MB',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }

        const updatedDocs = [...documents, newDoc]
        setDocuments(updatedDocs)

        if (linkedRights) {
          updateRightsRecord({
            ...linkedRights,
            documents: updatedDocs,
            status: 'Review',
          })
        }

        addActivity(
          `Legal document attached: ${newDoc.name}`,
          `Attached to ${asset.name} by ${currentUser.name} (${docType})`,
          'file',
          'bg-indigo-100 text-indigo-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'DOCUMENT',
            details: `Document "${newDoc.name}" (${docType}) attached to ${asset.name}.`,
          }
        )

        try {
          await fetch('/api/rights', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assetId: asset.id,
              documents: updatedDocs,
              status: 'Under Review',
            }),
          })
          showToast(`Document "${docName}" attached & audit logged!`)
        } catch (err) {
          console.error(err)
          showToast('Document attached locally')
        } finally {
          setIsSavingDoc(false)
          setIsUploadDocModalOpen(false)
          setDocName('')
          setDocNotes('')
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  // Handle Representative Saving Rights Scope, Territory, Term & Licensing with Confirmation & Audit Log
  const handleSaveRightsTerms = (e: React.FormEvent) => {
    e.preventDefault()

    if (!rightsScopeInput.trim() && !territoryInput.trim() && !licenceTypeInput.trim()) {
      showToast('Please specify at least Rights Scope, Territory, or Licensing Terms.')
      return
    }

    if (attachDocWithRights && !rightsDocTitle.trim()) {
      showToast('Please enter the document title or uncheck document attachment.')
      return
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Rights & Legal Clearances Filing',
      description: `Save legal rights terms for "${asset.name}"? This filing will be recorded in the permanent audit trail.`,
      details: (
        <div className="space-y-1.5 text-xs">
          <div><span className="font-semibold text-slate-700">Rights Scope:</span> {rightsScopeInput.trim() || 'Not Defined'} {exclusivityInput.trim() ? `(${exclusivityInput.trim()})` : ''}</div>
          <div><span className="font-semibold text-slate-700">Territory & Term:</span> {territoryInput.trim() || 'Not Defined'} • {validityInput.trim() || 'Open Term'}</div>
          <div><span className="font-semibold text-slate-700">Licensing Terms:</span> {licenceTypeInput.trim() || 'Not Defined'} {royaltyTermsInput.trim() ? `• ${royaltyTermsInput.trim()}` : ''}</div>
          {attachDocWithRights && rightsDocTitle.trim() && (
            <div className="pt-1 border-t border-slate-100 text-indigo-700 font-semibold">
              Attached Deed: {rightsDocTitle.trim()} ({rightsDocClassification})
            </div>
          )}
        </div>
      ),
      confirmLabel: 'Confirm & File Legal Terms',
      variant: 'primary',
      badge: 'Audit Trail Required',
      onConfirm: async () => {
        setIsSavingRights(true)
        let updatedDocs = [...documents]
        let attachedDocItem: RightsDocument | null = null

        if (attachDocWithRights && rightsDocTitle.trim()) {
          attachedDocItem = {
            id: `doc-${Date.now().toString().slice(-6)}`,
            name: rightsDocTitle.trim(),
            type: rightsDocClassification,
            size: '2.5 MB',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }
          updatedDocs = [...documents, attachedDocItem]
          setDocuments(updatedDocs)
        }

        const baseRecord = linkedRights || {
          id: `rr-${asset.id}`,
          name: `${asset.name} - Rights Record`,
          assetId: asset.id,
          assetTitle: asset.name,
          assetCategory: asset.category,
          registeredDate: new Date().toISOString().split('T')[0],
          agency: asset.agency,
          governanceChecks: checks,
          governanceScore: calculatedGovernanceScore,
          status: 'Review' as const,
        }

        const updatedRecord = {
          ...baseRecord,
          rightsType: rightsScopeInput.trim(),
          exclusivity: exclusivityInput.trim(),
          territory: territoryInput.trim(),
          validity: validityInput.trim(),
          term: validityInput.trim(),
          licenceType: licenceTypeInput.trim(),
          royaltyTerms: royaltyTermsInput.trim(),
          documents: updatedDocs,
          status: 'Review' as const,
        }

        updateRightsRecord(updatedRecord as any)

        addActivity(
          `Rights filed: ${asset.name}`,
          `Legal terms filed by ${currentUser.name} (${rightsScopeInput.trim() || 'Custom'} • ${territoryInput.trim() || 'Global'})`,
          'shield',
          'bg-indigo-100 text-indigo-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'GOVERNANCE',
            details: `Filed Rights: Scope="${rightsScopeInput.trim()}", Territory="${territoryInput.trim()}", Term="${validityInput.trim()}", License="${licenceTypeInput.trim()}". ${attachedDocItem ? `Attached Document: ${attachedDocItem.name}` : ''}`,
          }
        )

        try {
          await fetch('/api/rights', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assetId: asset.id,
              rightsType: rightsScopeInput.trim() || null,
              exclusivity: exclusivityInput.trim() || null,
              territory: territoryInput.trim() || null,
              validity: validityInput.trim() || null,
              licenceType: licenceTypeInput.trim() || null,
              royaltyTerms: royaltyTermsInput.trim() || null,
              documents: updatedDocs,
              status: 'Under Review',
            }),
          })
          showToast(`Rights & legal clearances filed successfully!`)
        } catch (err) {
          console.error(err)
          showToast('Terms saved locally')
        } finally {
          setIsSavingRights(false)
          setIsEditRightsModalOpen(false)
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  // Handle Representative Scheduling Approval Request with Confirmation & Audit Log
  const handleScheduleApproval = (e: React.FormEvent) => {
    e.preventDefault()
    if (documents.length === 0) {
      showToast('Cannot schedule approval: please attach at least one legal clearance document.')
      return
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Approval Clearance Submission',
      description: `Schedule "${asset.name}" for formal executive clearance review with priority "${schedulePriority}"? Legal counsel and reviewer will be alerted, and this request will be permanently logged in the audit trail.`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Target Asset:</span> {asset.name} ({asset.id})</div>
          <div><span className="font-semibold text-slate-700">Clearance Priority:</span> {schedulePriority}</div>
          <div><span className="font-semibold text-slate-700">Legal Documents Attached:</span> {documents.length} files</div>
          <div><span className="font-semibold text-slate-700">Submitting Rep:</span> {currentUser.name}</div>
        </div>
      ),
      confirmLabel: 'Confirm & Schedule',
      variant: 'primary',
      badge: 'Audit Logged',
      onConfirm: async () => {
        setIsSubmittingApproval(true)
        try {
          createApprovalRequest(asset.id, schedulePriority)
          addActivity(
            `Approval request scheduled: ${asset.name}`,
            `Submitted for clearance review by ${currentUser.name} (Priority: ${schedulePriority})`,
            'check',
            'bg-blue-100 text-blue-700',
            asset.agency,
            {
              assetId: asset.id,
              assetName: asset.name,
              actionType: 'APPROVAL',
              details: `Approval clearance scheduled with priority ${schedulePriority}.`,
            }
          )
          setIsScheduleApprovalModalOpen(false)
          showToast(`Asset "${asset.name}" scheduled for approval clearance! Reviewer notified.`)
        } catch (err: any) {
          console.error(err)
          showToast(err?.message || 'Failed to schedule approval')
        } finally {
          setIsSubmittingApproval(false)
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  // Handle Cloudinary Media File Upload with Confirmation & Audit Log
  const handleUploadToCloudinary = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mediaFile) {
      showToast('Please select a media file to upload')
      return
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Media File Archival',
      description: `Upload and archive "${mediaFile.name}" to Cloudinary secure media vault for "${asset.name}"? This file archival will be logged in the permanent audit trail.`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">File Name:</span> {mediaFile.name}</div>
          <div><span className="font-semibold text-slate-700">File Type:</span> {mediaFileType}</div>
          <div><span className="font-semibold text-slate-700">Master Asset:</span> {isMasterFile ? 'Yes (Primary Master)' : 'Derivative'}</div>
        </div>
      ),
      confirmLabel: 'Confirm & Upload',
      variant: 'primary',
      badge: 'Audit Logged',
      onConfirm: async () => {
        setIsUploadingMedia(true)
        const formData = new FormData()
        formData.append('file', mediaFile)
        formData.append('assetId', asset.id)
        formData.append('fileType', mediaFileType)
        formData.append('isMaster', String(isMasterFile))
        formData.append('ministryId', 'min-kmm')

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          const data = await res.json()
          if (res.ok && data.success) {
            addActivity(
              `Archived master file: ${mediaFile.name}`,
              `Uploaded to Cloudinary for ${asset.name} by ${currentUser.name}`,
              'file',
              'bg-emerald-100 text-emerald-700',
              asset.agency,
              {
                assetId: asset.id,
                assetName: asset.name,
                actionType: 'DOCUMENT',
                details: `Uploaded ${mediaFileType} file ${mediaFile.name} to Cloudinary.`,
              }
            )
            showToast(`File "${mediaFile.name}" processed & archived to Cloudinary!`)
            setIsUploadMediaModalOpen(false)
            setMediaFile(null)
          } else {
            showToast(data.error || 'Failed to upload media file')
          }
        } catch (err: any) {
          console.error(err)
          showToast('Upload error. Please try again.')
        } finally {
          setIsUploadingMedia(false)
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  // Handle Status Update with Confirmation & Audit Log
  const handleUpdateStatus = (newStatus: AssetStatus) => {
    setStatusMenuOpen(false)
    if (newStatus === asset.status) return

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Status Transition',
      description: `Are you sure you want to change the status of "${asset.name}" from "${asset.status}" to "${newStatus}"? This state change will be logged in the permanent audit trail.`,
      details: (
        <div className="space-y-1 text-xs">
          <div>
            <span className="font-semibold text-slate-700">State Transition:</span>{' '}
            <span className="line-through text-slate-400">{asset.status}</span> → <span className="font-bold text-blue-600">{newStatus}</span>
          </div>
          <div><span className="font-semibold text-slate-700">Authorised By:</span> {currentUser.name} ({currentUser.roleLabel})</div>
        </div>
      ),
      confirmLabel: `Confirm → ${newStatus}`,
      variant: newStatus === 'Approved' ? 'success' : 'warning',
      badge: 'Audit Trail Required',
      onConfirm: () => {
        updateAsset({ ...asset, status: newStatus })
        addActivity(
          `Asset status updated: ${asset.name} → ${newStatus}`,
          `Status transitioned by ${currentUser.name} (${currentUser.roleLabel})`,
          newStatus === 'Approved' ? 'check' : 'alert',
          newStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
          asset.agency,
          {
            assetId: asset.id,
            assetName: asset.name,
            actionType: 'STATUS_CHANGE',
            details: `Status transitioned from ${asset.status} to ${newStatus}.`,
          }
        )
        fetch(`/api/assets/${asset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }).catch(console.error)
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Status updated to "${newStatus}" and logged in audit trail.`)
      },
    })
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. TOP BREADCRUMB & BACK ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition font-medium cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Asset Registry</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">{asset.category}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
            {asset.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {setActiveNav && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', `/rights?asset=${asset.id}`)
                }
                setActiveNav('Rights & Governance')
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
            >
              <ShieldCheck className="size-3.5 text-slate-600" />
              <span>Rights Hub ↗</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. REFINED ASSET HERO HEADER */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Thumbnail & Core Details */}
          <div className="flex flex-col sm:flex-row items-start gap-4.5 flex-1 min-w-0">
            {/* Visual Poster Thumbnail */}
            <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-2xs group">
              {asset.posterUrl ? (
                <img
                  src={asset.posterUrl}
                  alt={asset.name}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="size-full bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-white select-none">
                  <div className="text-2xl font-bold text-amber-400 tracking-wider">
                    {(asset.name || 'IP')
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="text-[10px] font-medium text-slate-300 line-clamp-2 mt-1 leading-tight max-w-[90px]">
                    {asset.name}
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="rounded bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wider">
                  {asset.category.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                  <CategoryIcon category={asset.category} />
                  <span>{asset.category}</span>
                </span>
                <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                  Agency: {asset.agency || asset.unit}
                </span>
                <span className="font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                  {asset.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                {asset.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-3xl leading-relaxed">
                {asset.description || 'Global faith-based intellectual property asset produced under Kiddies Media Ministries.'}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {/* Status Selector Dropdown */}
            <div className="relative">
              <button
                id="asset-status-toggle"
                onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-2xs cursor-pointer',
                  asset.status === 'Approved'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : asset.status === 'Pending'
                    ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
                )}
              >
                <span className="size-1.5 rounded-full bg-current" />
                <span>{asset.status}</span>
                <ChevronDown className="size-3 opacity-60" />
              </button>

              {statusMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-30 space-y-1">
                  {(['Approved', 'Pending', 'In Review', 'Requires Attention'] as AssetStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition text-left cursor-pointer',
                        asset.status === st
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <span>{st}</span>
                      {asset.status === st && <Check className="size-3.5 text-slate-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Asset Button */}
            <button
              id="edit-asset-header-btn"
              onClick={() => setIsEditAssetModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Pencil className="size-3.5 text-slate-500" />
              <span>Edit Asset</span>
            </button>

            {/* Upload to Cloudinary Action */}
            <button
              id="upload-media-cloudinary-btn"
              onClick={() => setIsUploadMediaModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              <UploadCloud className="size-3.5" />
              <span>Upload Media</span>
            </button>

            {/* Quick Share / Export Link */}
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                  showToast('Asset link copied to clipboard')
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
            >
              <Share2 className="size-3.5 text-slate-500" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SIMPLIFIED 3-TAB PILL BAR */}
      <div className="border border-slate-200/80 bg-slate-100/70 p-1 rounded-xl">
        <div className="grid grid-cols-3 gap-1">
          {/* Tab 1: Overview & Media */}
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs transition cursor-pointer',
              activeTab === 'overview'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
            )}
          >
            <Play className="size-3.5" />
            <span>Overview & Media</span>
          </button>

          {/* Tab 2: Rights & Governance */}
          <button
            id="tab-rights"
            onClick={() => setActiveTab('rights')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs transition cursor-pointer',
              activeTab === 'rights'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
            )}
          >
            <ShieldCheck className="size-3.5" />
            <span>Rights & Clearances</span>
            <span
              className={cn(
                'rounded-md px-1.5 py-0.2 text-[9px] font-semibold',
                activeTab === 'rights' ? 'bg-slate-100 text-slate-700' : 'bg-white text-slate-600 border border-slate-200/60'
              )}
            >
              {documents.length > 0 ? `${documents.length} Docs` : 'Pending Rep Docs'}
            </span>
          </button>

          {/* Tab 3: Connected IP & History */}
          <button
            id="tab-connections"
            onClick={() => setActiveTab('connections')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs transition cursor-pointer',
              activeTab === 'connections'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
            )}
          >
            <Link2 className="size-3.5" />
            <span>Connected IP & History</span>
            <span
              className={cn(
                'rounded-md px-1.5 py-0.2 text-[9px] font-semibold',
                activeTab === 'connections' ? 'bg-slate-100 text-slate-700' : 'bg-white text-slate-600 border border-slate-200/60'
              )}
            >
              {assetRelationships.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW & MEDIA */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Visual Media Player Engine */}
          <AssetVisualPreview
            asset={asset}
            showToast={showToast}
            onOpenEditModal={() => setIsEditAssetModalOpen(true)}
          />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {/* Core Classification Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                  Classification & Agency
                </span>
                <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-medium">
                  {asset.id}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Primary Category</span>
                  <span className="font-semibold text-slate-900 text-sm">{asset.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Subcategory / Genre</span>
                  <span className="font-medium text-slate-700">{asset.subcategory || 'Standard Series'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Originating Agency</span>
                  <span className="font-semibold text-slate-900">{asset.agency || asset.unit}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Target Ministry</span>
                  <span className="font-medium text-slate-700">Kiddies Media Ministry (KMM)</span>
                </div>
              </div>
            </div>

            {/* Staff Contributors Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                  Staff Contributors ({asset.contributors?.length || 0})
                </span>
                <Users className="size-4 text-slate-400" />
              </div>

              <div className="space-y-2 text-xs">
                {asset.contributors && asset.contributors.length > 0 ? (
                  <div className="space-y-2">
                    {asset.contributors.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-xs"
                      >
                        <div className="size-7 rounded-md bg-slate-900 text-white font-semibold text-[11px] grid place-items-center shrink-0">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{c.role} • {c.agency || asset.agency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1.5">
                    <span>No specific staff contributors logged.</span>
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                      + Add Contributors
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Production Timestamps Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                  Registration & Archival
                </span>
                <Calendar className="size-4 text-slate-400" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Created / Registered Date</span>
                  <span className="font-medium text-slate-800">{asset.createdDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Rights Holder / Owner</span>
                  <span className="font-semibold text-slate-900">{asset.rightsHolder || 'Pastor Kalu Chelsea (Executive Minister)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Tags & Keywords</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {asset.tags && asset.tags.length > 0 ? (
                      Array.from(new Set(asset.tags)).map((tag, idx) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="rounded-md bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 text-[9px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px] italic">No tags assigned</span>
                        <button
                          type="button"
                          onClick={() => setIsEditAssetModalOpen(true)}
                          className="text-[10px] font-medium text-blue-600 hover:underline cursor-pointer"
                        >
                          + Add Tags
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PRODUCTION EPISODES & RELEASES MANAGER (VIDEO / ANIMATION)    */}
          {/* ------------------------------------------------------------- */}
          {isVideoCategory && (
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 grid place-items-center">
                    <Film className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-slate-900">Production Episodes & Releases</h3>
                      <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-medium">
                        {episodes.length} Catalogued
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Manage real broadcast episodes, runtimes, release schedules, and clearance statuses.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="add-real-episode-btn"
                  onClick={() => {
                    setEpNum(episodes.length + 1)
                    setEpTitle('')
                    setEpDuration(asset.attributes?.durationMinutes || 15)
                    setEpSynopsis('')
                    setEpAirDate('')
                    setEpStatus('In Production')
                    setEpVideoUrl('')
                    setIsAddEpisodeModalOpen(true)
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-medium shadow-xs transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>+ Add Production Episode</span>
                </button>
              </div>

              {episodes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                        <th className="pb-2.5 font-bold">Ep #</th>
                        <th className="pb-2.5 font-bold">Episode Title & Synopsis</th>
                        <th className="pb-2.5 font-bold">Runtime</th>
                        <th className="pb-2.5 font-bold">Release / Air Date</th>
                        <th className="pb-2.5 font-bold">Status</th>
                        <th className="pb-2.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {episodes.map((ep, idx) => (
                        <tr key={ep.id || idx} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 font-mono font-bold text-blue-700">
                            {String(ep.episodeNumber || idx + 1).padStart(2, '0')}
                          </td>
                          <td className="py-3 max-w-sm">
                            <div className="font-bold text-slate-900">{ep.title}</div>
                            {ep.synopsis && (
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ep.synopsis}</div>
                            )}
                          </td>
                          <td className="py-3 font-mono text-slate-600">
                            {ep.durationMinutes ? `${ep.durationMinutes} mins` : '15 mins'}
                          </td>
                          <td className="py-3 text-slate-600 font-medium">
                            {ep.airDate || 'TBD'}
                          </td>
                          <td className="py-3">
                            <span
                              className={cn(
                                'inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border',
                                ep.status === 'Broadcast Ready'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : ep.status === 'Mastered'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : ep.status === 'Approved'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              )}
                            >
                              {ep.status || 'In Production'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleInitiateDeleteEpisode(ep.id)}
                              className="size-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition grid place-items-center ml-auto cursor-pointer"
                              title="Delete episode"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center space-y-2">
                  <Film className="size-8 text-slate-400 mx-auto" />
                  <div className="font-bold text-xs text-slate-700">No Production Episodes Catalogued</div>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    This programme currently has zero recorded episodes. Click <strong>+ Add Production Episode</strong> above to input real episode titles and specifications.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* DIGITAL PLATFORM LIVE DEPLOYMENT & TECHNICAL SPECIFICATIONS   */}
          {/* ------------------------------------------------------------- */}
          {isDigitalCategory && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe2 className="size-4.5 text-blue-600" />
                  <h3 className="font-black text-sm text-[#09245a]">
                    Digital Platform Deployment & Technical Specifications
                  </h3>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[10px] font-bold border',
                    asset.attributes?.liveUrl
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  )}
                >
                  {asset.attributes?.liveUrl ? '● Live Production' : '○ Setup Pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Live URL */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Live Production URL</span>
                    {asset.attributes?.liveUrl ? (
                      <div className="font-bold text-blue-700 truncate text-xs mt-0.5">
                        {asset.attributes.liveUrl}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        Not configured
                      </div>
                    )}
                  </div>
                  {asset.attributes?.liveUrl ? (
                    <a
                      href={asset.attributes.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline pt-0.5"
                    >
                      <span>Visit Live Portal</span>
                      <ArrowUpRight className="size-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add Live URL</span>
                    </button>
                  )}
                </div>

                {/* Git Repo */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Git Repository</span>
                    {asset.attributes?.gitRepoUrl ? (
                      <div className="font-bold text-slate-800 truncate text-xs mt-0.5">
                        {asset.attributes.gitRepoUrl}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        No repository linked
                      </div>
                    )}
                  </div>
                  {asset.attributes?.gitRepoUrl ? (
                    <a
                      href={asset.attributes.gitRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:underline pt-0.5"
                    >
                      <span>Inspect Repository</span>
                      <ArrowUpRight className="size-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add Git Repo</span>
                    </button>
                  )}
                </div>

                {/* Server Host */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Server Host & Infrastructure</span>
                    {asset.attributes?.serverHost ? (
                      <div className="font-bold text-slate-800 truncate text-xs mt-0.5">
                        {asset.attributes.serverHost}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        Not specified
                      </div>
                    )}
                  </div>
                  {asset.attributes?.serverHost ? (
                    <span className="text-[11px] text-emerald-700 font-semibold block pt-0.5">
                      ● High Availability Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add Server Host</span>
                    </button>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Technology Stack</span>
                    {asset.attributes?.techStack ? (
                      <div className="font-bold text-slate-800 truncate text-xs mt-0.5">
                        {asset.attributes.techStack}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        Not specified
                      </div>
                    )}
                  </div>
                  {asset.attributes?.techStack ? (
                    <span className="text-[11px] text-slate-500 block pt-0.5">
                      Cross-Platform Web & Mobile
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add Tech Stack</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PUBLISHING & PRINT SPECIFICATIONS                             */}
          {/* ------------------------------------------------------------- */}
          {isPublishingCategory && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4.5 text-amber-600" />
                  <h3 className="font-black text-sm text-[#09245a]">
                    Publishing & Print Catalog Specifications
                  </h3>
                </div>
                <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold">
                  {asset.attributes?.formatType || 'Print Edition'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* ISBN */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">ISBN / Filing Number</span>
                    {asset.attributes?.isbn ? (
                      <div className="font-bold text-slate-800 font-mono text-xs mt-0.5">
                        {asset.attributes.isbn}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        Not filed yet
                      </div>
                    )}
                  </div>
                  {!asset.attributes?.isbn && (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add ISBN</span>
                    </button>
                  )}
                </div>

                {/* Page Count */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Page Count & Volume</span>
                    {asset.attributes?.pageCount ? (
                      <div className="font-bold text-slate-800 text-xs mt-0.5">
                        {asset.attributes.pageCount} Pages
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        Not specified
                      </div>
                    )}
                  </div>
                  {!asset.attributes?.pageCount && (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add Page Count</span>
                    </button>
                  )}
                </div>

                {/* Format & Binding */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Format & Binding</span>
                    {asset.attributes?.formatType ? (
                      <div className="font-bold text-slate-800 text-xs mt-0.5">
                        {asset.attributes.formatType}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px] mt-0.5">
                        Not specified
                      </div>
                    )}
                  </div>
                  {!asset.attributes?.formatType && (
                    <button
                      type="button"
                      onClick={() => setIsEditAssetModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer pt-0.5"
                    >
                      <Plus className="size-3" />
                      <span>+ Add Format</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RIGHTS, CLEARANCES & REPRESENTATIVE GOVERNANCE HUB */}
      {activeTab === 'rights' && (
        <div className="space-y-6">
          {/* Approval Scheduling & Documents Readiness Gate */}
          {documents.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-amber-500 text-white grid place-items-center shrink-0 shadow-2xs">
                  <ShieldAlert className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-950 text-sm">
                    Legal Documentation Required Before Approval Scheduling
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                    This asset will <b>not pop into the reviewer approvals queue</b> until executed legal chain of title, script clearances, or talent releases are uploaded.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="open-rep-upload-btn"
                  onClick={() => setIsUploadDocModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-medium shadow-2xs transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Upload Representative Doc</span>
                </button>
                <div
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1.5 text-xs font-medium cursor-not-allowed"
                  title="Upload at least one legal clearance document before scheduling approval"
                >
                  <Lock className="size-3.5" />
                  <span>Schedule Approval</span>
                </div>
              </div>
            </div>
          ) : !existingApproval ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-emerald-600 text-white grid place-items-center shrink-0 shadow-2xs">
                  <FileCheck className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-950 text-sm">
                    {documents.length} Legal Document(s) Attached — Ready to Schedule Approval
                  </h4>
                  <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                    Chain of title and clearances on file. You can now schedule this asset so it pops into the Reviewer approvals queue for official sign-off.
                  </p>
                </div>
              </div>
              <button
                id="schedule-approval-btn"
                onClick={() => setIsScheduleApprovalModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-medium shadow-2xs transition shrink-0 cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>Schedule for Approval Request</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-slate-900 text-white grid place-items-center shrink-0 shadow-2xs">
                  <Clock className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      Approval Request Scheduled ({existingApproval.status})
                    </h4>
                    <span className="rounded-md bg-slate-200/80 text-slate-800 text-[10px] font-semibold px-2 py-0.5">
                      {existingApproval.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Under review by <b>{existingApproval.reviewerName}</b> • Stage: {existingApproval.stage} (Step {existingApproval.currentStep} of {existingApproval.totalSteps})
                  </p>
                </div>
              </div>
              {setActiveNav && (
                <button
                  onClick={() => setActiveNav('approvals')}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-medium shadow-2xs transition shrink-0 cursor-pointer"
                >
                  <span>Open in Approvals Queue</span>
                  <ArrowRight className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Rights Status Summary Cards */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="size-4.5 text-slate-700" />
                  <span>Legal Rights & Governance Registry</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Global intellectual property protection, licensing mandates, and representative governance tracking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openRightsModal()}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  <FileText className="size-3.5 text-slate-500" />
                  <span>Configure Rights & Terms</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Attach Document</span>
                </button>
              </div>
            </div>

            {/* Structured Scope Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Rights Scope */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Rights Scope
                    </span>
                    {linkedRights?.rightsType ? (
                      <button
                        type="button"
                        onClick={() => openRightsModal('scope')}
                        className="text-[10px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Pencil className="size-2.5" />
                        <span>Edit</span>
                      </button>
                    ) : null}
                  </div>
                  {linkedRights?.rightsType ? (
                    <>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-1">
                        {linkedRights.rightsType}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {linkedRights.exclusivity || 'Standard Scope'}
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 space-y-1">
                      <div className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-0.5 inline-block">
                        Scope Not Defined Yet
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Awaiting legal scope definition by representative.
                      </p>
                    </div>
                  )}
                </div>

                {!linkedRights?.rightsType && (
                  <button
                    type="button"
                    onClick={() => openRightsModal('scope')}
                    className="w-full mt-2.5 rounded-md border border-slate-200 bg-white py-1.5 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="size-3" />
                    <span>Define Rights Scope</span>
                  </button>
                )}
              </div>

              {/* Territory & Term */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Territory & Term
                    </span>
                    {linkedRights?.territory || linkedRights?.validity ? (
                      <button
                        type="button"
                        onClick={() => openRightsModal('territory')}
                        className="text-[10px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Pencil className="size-2.5" />
                        <span>Edit</span>
                      </button>
                    ) : null}
                  </div>
                  {linkedRights?.territory || linkedRights?.validity ? (
                    <>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1 mt-1">
                        <Globe2 className="size-3.5 text-slate-600" />
                        <span>{linkedRights?.territory || 'Unspecified Territory'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Term: {linkedRights?.validity || linkedRights?.term || 'Open Term'}
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 space-y-1">
                      <div className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-0.5 inline-block">
                        Territory & Term Not Filed
                      </div>
                      <p className="text-[10px] text-slate-400">
                        No territorial bounds or term period recorded.
                      </p>
                    </div>
                  )}
                </div>

                {!(linkedRights?.territory || linkedRights?.validity) && (
                  <button
                    type="button"
                    onClick={() => openRightsModal('territory')}
                    className="w-full mt-2.5 rounded-md border border-slate-200 bg-white py-1.5 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="size-3" />
                    <span>Set Territory & Term</span>
                  </button>
                )}
              </div>

              {/* Licensing Terms */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Licensing Terms
                    </span>
                    {linkedRights?.licenceType || linkedRights?.royaltyTerms ? (
                      <button
                        type="button"
                        onClick={() => openRightsModal('licensing')}
                        className="text-[10px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Pencil className="size-2.5" />
                        <span>Edit</span>
                      </button>
                    ) : null}
                  </div>
                  {linkedRights?.licenceType || linkedRights?.royaltyTerms ? (
                    <>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-1">
                        {linkedRights.licenceType || 'Proprietary License'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {linkedRights.royaltyTerms || 'Standard Terms'}
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 space-y-1">
                      <div className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-0.5 inline-block">
                        Licensing Terms Not Filed
                      </div>
                      <p className="text-[10px] text-slate-400">
                        No licensing deed or terms added by representative.
                      </p>
                    </div>
                  )}
                </div>

                {!(linkedRights?.licenceType || linkedRights?.royaltyTerms) && (
                  <button
                    type="button"
                    onClick={() => openRightsModal('licensing')}
                    className="w-full mt-2.5 rounded-md border border-slate-200 bg-white py-1.5 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="size-3" />
                    <span>Set Licensing Terms</span>
                  </button>
                )}
              </div>

              <div className={cn(
                'rounded-lg border p-3.5 space-y-1',
                calculatedGovernanceScore === 100
                  ? 'border-emerald-200 bg-emerald-50/70'
                  : 'border-slate-200 bg-slate-50/60'
              )}>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Representative Score
                </span>
                <div className={cn(
                  'font-semibold text-sm flex items-center gap-1',
                  calculatedGovernanceScore === 100 ? 'text-emerald-800' : 'text-slate-900'
                )}>
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>{calculatedGovernanceScore}% Verified</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {completedChecksCount} of 5 Verifications Checked
                </div>
              </div>
            </div>

            {/* Representative Legal Documents Section */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="size-4 text-slate-700" />
                    <span>Representative Legal Documents & Chain of Title</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Uploaded contracts, releases, synchronization licenses, and doctrinal seals.
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-medium">
                  {documents.length} Files
                </span>
              </div>

              {documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 flex items-start gap-2.5 hover:bg-white hover:border-slate-300 transition shadow-2xs"
                    >
                      <div className="size-8 rounded-md bg-slate-900 text-white grid place-items-center shrink-0 font-medium text-xs">
                        <FileCheck className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 text-xs truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {doc.type} • {doc.size || '2.4 MB'} • Added {doc.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-5 text-center space-y-2">
                  <FileText className="size-7 text-slate-400 mx-auto" />
                  <div className="font-semibold text-slate-800 text-xs">No Legal Documents Attached Yet</div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Ministry representatives can upload executed talent agreements, music licenses, and broadcast clearance certificates.
                  </p>
                  <button
                    onClick={() => setIsUploadDocModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 shadow-2xs transition cursor-pointer mt-1"
                  >
                    <Plus className="size-3" />
                    <span>Upload First Document</span>
                  </button>
                </div>
              )}
            </div>

            {/* Representative Interactive Governance Checklist */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4.5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 text-xs uppercase tracking-wider block">
                    Representative Doctrinal & Governance Verification Matrix
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Click each item to toggle verified compliance. Changes persist to the central Neon database.
                  </p>
                </div>
                <span className="rounded-md bg-slate-200/80 text-slate-800 px-2 py-0.5 text-[10px] font-semibold">
                  {completedChecksCount}/5 Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(checks).map(([title, isChecked]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => handleToggleGovernanceCheck(title)}
                    className={cn(
                      'flex items-start gap-2.5 rounded-lg p-2.5 border text-left transition cursor-pointer',
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs text-emerald-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isChecked ? (
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                      ) : (
                        <Square className="size-3.5 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-[11px] block">{title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {isChecked ? 'Verified ✓' : 'Click to Verify (Representative Action)'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Approval Trail & Clearance Audits */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Approval Pipeline & Clearance Audit</h3>
                <p className="text-[11px] text-slate-500">Sign-off trail and reviewer endorsements for broadcast</p>
              </div>
              <span className="rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-2.5 py-0.5 text-xs font-medium">
                {asset.status === 'Approved' ? '✓ Fully Approved' : 'In Clearance'}
              </span>
            </div>

            {assetApprovals.length > 0 ? (
              <div className="space-y-3 text-xs">
                {assetApprovals.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-slate-200 p-4 bg-slate-50/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#09245a] text-sm">{app.stage}</span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-slate-600 text-xs">
                      Reviewer: <b className="text-slate-900">{app.reviewerName}</b> • Submitted by: {app.requesterName} ({app.submittedDate})
                    </div>
                    {app.feedbackNotes && (
                      <div className="rounded-xl bg-white p-3 border border-slate-200 text-slate-700 italic">
                        "{app.feedbackNotes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-700" />
                  Standard Ministry Clearance Active
                </div>
                <div className="text-emerald-700 text-[11px]">
                  Approved by Lead Content Reviewer Faith Daniel for worldwide broadcast and syndication.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONNECTED IP, SUB-ASSETS & HISTORY */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          {/* Connected Relationships Section */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Connected Intellectual Property</h3>
                <p className="text-xs text-slate-500">
                  Cross-media linkages: soundtrack masters, companion books, merchandise, and franchise spin-offs.
                </p>
              </div>
              <button
                id="add-relationship-btn"
                onClick={() => setIsAddRelModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 shadow-2xs transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Connect New Asset</span>
              </button>
            </div>

            {assetRelationships.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {assetRelationships.map((rel) => {
                  const isSource =
                    rel.sourceId === asset.id ||
                    rel.sourceAssetId === asset.id ||
                    rel.sourceAsset === asset.name
                  const otherAssetName = isSource ? rel.targetAsset : rel.sourceAsset
                  const otherAssetId = isSource
                    ? rel.targetId || rel.targetAssetId
                    : rel.sourceId || rel.sourceAssetId
                  const otherAssetObj = assets.find(
                    (a) => a.id === otherAssetId || a.name === otherAssetName
                  )

                  return (
                    <div
                      key={rel.id}
                      className="flex flex-col justify-between rounded-lg border border-slate-200 p-3.5 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="size-8 rounded-lg bg-slate-900 text-white grid place-items-center shrink-0">
                          <Link2 className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 font-medium text-[9px] uppercase">
                              {rel.relationshipType}
                            </span>
                            {otherAssetObj && (
                              <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                                {otherAssetObj.category}
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-slate-900 truncate text-xs mt-1">
                            {otherAssetName}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {rel.details}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        {otherAssetObj && onSelectAsset ? (
                          <button
                            onClick={() => onSelectAsset(otherAssetObj)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <span>Inspect Asset</span>
                            <ArrowUpRight className="size-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {otherAssetId || 'Linked External IP'}
                          </span>
                        )}

                        <button
                          onClick={() => {
                            deleteRelationship(rel.id)
                            showToast('Disconnected IP relationship')
                          }}
                          className="size-7 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 grid place-items-center transition cursor-pointer"
                          title="Remove connection"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-7 text-center space-y-2.5">
                <Link2 className="size-7 text-slate-300 mx-auto" />
                <div className="font-semibold text-slate-700 text-xs">No Connected Assets Yet</div>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Link related comic books, soundtrack audio masters, video game packages, and character merchandise to build the complete franchise IP graph.
                </p>
                <button
                  onClick={() => setIsAddRelModalOpen(true)}
                  className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 shadow-2xs transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Connect First Asset</span>
                </button>
              </div>
            )}
          </div>

          {/* Activity Trail / Asset History */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="size-4 text-slate-700" />
                <span>Audit Log & Asset Lifecycle History</span>
              </h3>
              <p className="text-xs text-slate-500">
                Chronological record of status changes, reviews, clearances, and version bumps.
              </p>
            </div>

            {assetActivities.length > 0 ? (
              <div className="space-y-2.5 text-xs">
                {assetActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 bg-slate-50/50"
                  >
                    <div className="size-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500">{act.subtitle}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{act.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 bg-slate-50/50">
                  <div className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900">Asset Registered into Central KMM Portal</div>
                    <div className="text-[11px] text-slate-500">
                      Initial intake catalogued for {asset.agency || 'KMM Network'} ({asset.createdDate})
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">{asset.createdTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPRESENTATIVE DOCUMENT UPLOAD MODAL */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 grid place-items-center">
                  <UploadCloud className="size-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] text-sm">Upload Representative Document</h3>
                  <p className="text-[11px] text-slate-500">Attach legal agreements or clearances for {asset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadDocModalOpen(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRepresentativeDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title:</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Talent Release Agreement, Master Sync License..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Classification:</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="PDF">PDF Contract / Agreement</option>
                  <option value="DOCX">DOCX Script / Clearances</option>
                  <option value="CERT">CERT Doctrinal Approval Certificate</option>
                  <option value="LICENSE">LICENSE Master Synchronization License</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clearance Notes (Optional):</label>
                <textarea
                  rows={3}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="e.g. Executed with voice actors and lead songwriter. Full perpetual worldwide license."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDoc}
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingDoc ? 'Saving...' : 'Save & Attach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD RELATIONSHIP MODAL */}
      {isAddRelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 grid place-items-center">
                  <Link2 className="size-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] text-sm">Connect Related Asset</h3>
                  <p className="text-[11px] text-slate-500">Link other IP across agencies to {asset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRelModalOpen(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelationshipOnAsset} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Target Asset to Connect:
                </label>
                <select
                  id="target-asset-select"
                  value={targetAssetId}
                  onChange={(e) => setTargetAssetId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="">-- Choose an Asset from Registry --</option>
                  {assets
                    .filter((a) => a.id !== asset.id)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.category} • {a.agency})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Relationship Type:
                </label>
                <select
                  id="rel-type-select"
                  value={relType}
                  onChange={(e) => setRelType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="Used In">Used In (e.g. Stem/Track in Episode)</option>
                  <option value="Adapted From">Adapted From (e.g. Book to Animation)</option>
                  <option value="Soundtrack For">Soundtrack For (Theme music/Album)</option>
                  <option value="Merchandise For">Merchandise For (Consumer product)</option>
                  <option value="Spin-off Of">Spin-off Of (Franchise extension)</option>
                  <option value="Parent Of">Parent Of (Series to Season/Ep)</option>
                  <option value="Child Of">Child Of (Episode in Series)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Connection Notes (Optional):
                </label>
                <textarea
                  id="rel-notes-textarea"
                  rows={3}
                  value={relDetails}
                  onChange={(e) => setRelDetails(e.target.value)}
                  placeholder="e.g. Official orchestral soundtrack stems synchronized in opening credits..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRelModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-add-rel-btn"
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 shadow-sm transition cursor-pointer"
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CLOUDINARY MEDIA UPLOAD MODAL */}
      {isUploadMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 grid place-items-center">
                  <UploadCloud className="size-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] text-sm">Upload Media to Cloudinary</h3>
                  <p className="text-[11px] text-slate-500">Archive master video, audio stem, or key art for {asset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadMediaModalOpen(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUploadToCloudinary} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Media File:</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Archive Classification:</label>
                <select
                  value={mediaFileType}
                  onChange={(e) => setMediaFileType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="video_master">Video Master (4K / 1080p ProRes or MP4)</option>
                  <option value="audio_stem">Audio Stem / Soundtrack Master (WAV / FLAC)</option>
                  <option value="trailer">Broadcast Trailer / Promo Clip</option>
                  <option value="poster">Poster Key Art / Promotional Thumbnail</option>
                  <option value="subtitle">Subtitle / Timed Text / Closed Captions</option>
                  <option value="script_doc">Script / Storyboard Package</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="master-check"
                  checked={isMasterFile}
                  onChange={(e) => setIsMasterFile(e.target.checked)}
                  className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="master-check" className="font-semibold text-slate-700 cursor-pointer text-xs">
                  Mark as Primary Master Deliverable
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadMediaModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMedia}
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isUploadingMedia ? 'Uploading to Cloudinary...' : 'Upload & Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE APPROVAL MODAL */}
      {isScheduleApprovalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 grid place-items-center">
                  <Send className="size-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] text-sm">Schedule Approval Request</h3>
                  <p className="text-[11px] text-slate-500">Submit {asset.name} to the Reviewer clearance queue</p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleApprovalModalOpen(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleApproval} className="space-y-4 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Attached Chain of Title</span>
                  <span className="font-black text-emerald-700 text-[11px] bg-emerald-100 px-2 py-0.5 rounded-full">
                    {documents.length} File(s) Verified
                  </span>
                </div>
                <div className="space-y-1">
                  {documents.map((d) => (
                    <div key={d.id} className="text-[11px] font-semibold text-slate-700 truncate flex items-center gap-1.5">
                      <FileCheck className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{d.name} ({d.type})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clearance Priority Level:</label>
                <select
                  value={schedulePriority}
                  onChange={(e) => setSchedulePriority(e.target.value as ApprovalRequest['priority'])}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Low">Low — Standard Scheduling</option>
                  <option value="Medium">Medium — General Production Broadcast</option>
                  <option value="High">High — Upcoming Global Syndication</option>
                  <option value="Urgent">Urgent — Immediate Broadcast Clearance Needed</option>
                </select>
              </div>

              <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3 text-[11px] text-indigo-900 leading-relaxed">
                <b>Reviewer Assignment:</b> This request will be scheduled into Faith Daniel's review workspace for multi-step content and doctrinal governance sign-off.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleApprovalModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApproval}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  <span>{isSubmittingApproval ? 'Scheduling...' : 'Confirm & Schedule Approval'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Production Episode Modal */}
      {isAddEpisodeModalOpen && (
        <div
          onClick={() => setIsAddEpisodeModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl text-xs space-y-4 cursor-default animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 grid place-items-center">
                  <Film className="size-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Add Production Episode</h3>
                  <p className="text-[11px] text-slate-500">Record episode release details for {asset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEpisodeModalOpen(false)}
                className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateAddEpisode} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-medium text-slate-700 mb-1">Episode # *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={epNum}
                    onChange={(e) => setEpNum(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Runtime (Minutes) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={epDuration}
                    onChange={(e) => setEpDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Episode 04: The Armor of God in Action"
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Production Status:</label>
                  <select
                    value={epStatus}
                    onChange={(e) => setEpStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition cursor-pointer"
                  >
                    <option value="In Production">In Production</option>
                    <option value="Mastered">Mastered</option>
                    <option value="Approved">Approved</option>
                    <option value="Broadcast Ready">Broadcast Ready</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-slate-400" />
                      <span>Release / Air Date:</span>
                    </span>
                    {epAirDate && (
                      <span className="text-[10px] text-emerald-600 font-medium">
                        {/^\d{4}-\d{2}-\d{2}$/.test(epAirDate)
                          ? new Date(epAirDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : epAirDate}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="episode-air-date-picker"
                      value={epAirDate}
                      onChange={(e) => setEpAirDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition cursor-pointer [color-scheme:light]"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>Select calendar date</span>
                    {epAirDate && (
                      <button
                        type="button"
                        onClick={() => setEpAirDate('')}
                        className="text-slate-500 hover:text-rose-600 transition cursor-pointer"
                      >
                        Clear date
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Synopsis / Scripture Focus (Optional):</label>
                <textarea
                  rows={2}
                  placeholder="Summary of storyline, character lesson, and scripture references..."
                  value={epSynopsis}
                  onChange={(e) => setEpSynopsis(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Master Video Link (Optional)
                  <span className="text-[10px] font-normal text-amber-600 ml-1.5">• Cloud Storage In Provisioning</span>
                </label>
                <input
                  type="url"
                  placeholder="https://... (Direct master URL if available)"
                  value={epVideoUrl}
                  onChange={(e) => setEpVideoUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEpisodeModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 font-medium text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Add Episode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure Rights & Legal Clearances Modal */}
      {isEditRightsModalOpen && (
        <div
          onClick={() => setIsEditRightsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-xs space-y-4 cursor-default animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 grid place-items-center">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] text-sm">Configure Rights & Legal Clearances</h3>
                  <p className="text-[11px] text-slate-500">
                    File legal terms, territory, and attach deeds for {asset.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditRightsModalOpen(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRightsTerms} className="space-y-4 text-xs">
              {/* Section 1: Scope & Exclusivity */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  1. Rights Scope & Exclusivity
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rights Scope</label>
                    <input
                      list="rights-scope-options"
                      type="text"
                      placeholder="e.g. Worldwide Master Copyright"
                      value={rightsScopeInput}
                      onChange={(e) => setRightsScopeInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                    <datalist id="rights-scope-options">
                      <option value="Worldwide Master Copyright" />
                      <option value="Broadcast & Digital Streaming License" />
                      <option value="Publishing & Distribution Rights" />
                      <option value="Merchandising & Consumer Rights" />
                      <option value="Sync & Master Recording Rights" />
                      <option value="Educational & Ministry Exemption" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exclusivity Mandate</label>
                    <select
                      value={exclusivityInput}
                      onChange={(e) => setExclusivityInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer bg-white"
                    >
                      <option value="">-- Select Exclusivity --</option>
                      <option value="100% Exclusive Ministry Ownership">100% Exclusive Ministry Ownership</option>
                      <option value="Exclusive Commercial Partner">Exclusive Commercial Partner</option>
                      <option value="Non-Exclusive Ministry License">Non-Exclusive Ministry License</option>
                      <option value="Co-Ownership / Shared IP">Co-Ownership / Shared IP</option>
                      <option value="Open Access / Public Domain">Open Access / Public Domain</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Territory & Term */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  2. Territory & Validity Term
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Geographical Territory</label>
                    <input
                      list="territory-options"
                      type="text"
                      placeholder="e.g. Worldwide, Sub-Saharan Africa..."
                      value={territoryInput}
                      onChange={(e) => setTerritoryInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                    <datalist id="territory-options">
                      <option value="Worldwide" />
                      <option value="North America" />
                      <option value="Sub-Saharan Africa" />
                      <option value="United Kingdom & Europe" />
                      <option value="Nigeria & West Africa" />
                      <option value="Asia-Pacific" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Validity / Term Limit</label>
                    <input
                      type="text"
                      placeholder="e.g. Perpetual or 2026–2036"
                      value={validityInput}
                      onChange={(e) => setValidityInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Licensing & Commercial Terms */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  3. Licensing Agreement & Commercial Terms
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Licence Classification</label>
                    <input
                      list="licence-options"
                      type="text"
                      placeholder="e.g. Proprietary Ministry License"
                      value={licenceTypeInput}
                      onChange={(e) => setLicenceTypeInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                    <datalist id="licence-options">
                      <option value="Proprietary Ministry License" />
                      <option value="Restricted Syndication Agreement" />
                      <option value="Creative Commons / Educational" />
                      <option value="Commercial Merchandising Agreement" />
                      <option value="Broadcasting Sub-License" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Commercial / Royalty Terms</label>
                    <input
                      type="text"
                      placeholder="e.g. Non-transferable Broadcast Rights"
                      value={royaltyTermsInput}
                      onChange={(e) => setRoyaltyTermsInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Relevant Document Attachment (Where Necessary) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachDocWithRights}
                      onChange={(e) => setAttachDocWithRights(e.target.checked)}
                      className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 text-xs">
                      Attach Relevant Legal Document / Deed with this filing
                    </span>
                  </label>
                  <span className="text-[10px] text-slate-400">Where necessary</span>
                </div>

                {attachDocWithRights && (
                  <div className="space-y-3 pt-2 border-t border-slate-200/80 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                        <input
                          type="text"
                          required={attachDocWithRights}
                          placeholder="e.g. Deed of Master Assignment"
                          value={rightsDocTitle}
                          onChange={(e) => setRightsDocTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Classification</label>
                        <select
                          value={rightsDocClassification}
                          onChange={(e) => setRightsDocClassification(e.target.value as any)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="PDF">PDF Contract / Agreement</option>
                          <option value="DOCX">DOCX Script / Clearances</option>
                          <option value="CERT">CERT Doctrinal Approval Certificate</option>
                          <option value="LICENSE">LICENSE Master Synchronization License</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Filing Notes (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Executed and notarized deed attached."
                        value={rightsDocNotes}
                        onChange={(e) => setRightsDocNotes(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditRightsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingRights}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-blue-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>{isSavingRights ? 'Saving...' : 'Confirm & File Rights Terms'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      <EditAssetModal
        isOpen={isEditAssetModalOpen}
        onClose={() => setIsEditAssetModalOpen(false)}
        asset={asset}
        onSave={handleInitiateAssetSave}
        categories={categories}
        subcategories={subcategories}
        isGlobalViewer={isGlobalViewer}
      />

      {/* Reusable Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmLabel={confirmConfig.confirmLabel}
        variant={confirmConfig.variant}
        badge={confirmConfig.badge}
        details={confirmConfig.details}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
