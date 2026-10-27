'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Boxes, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, Clock,
  Globe2, FileCode, ShieldCheck, Tv, Film, Music, Play,
  Layers, Download, Plus, Trash2, Link2, Activity, User, Users, Calendar,
  ExternalLink, Tag, Sparkles, Check, X, FileText, AlertCircle,
  Share2, Info, ArrowUpRight, Award, Flame, RefreshCw, BookOpen,
  Gamepad2, Package, UploadCloud, ShieldAlert, FileCheck, CheckSquare, Square,
  Lock, Send, ArrowRight, Pencil, Crown, BadgeCheck, Clapperboard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLovetoonsData } from '@/lib/store/DataContext'
import { AssetVisualPreview } from '@/components/AssetVisualPreview'
import { ConfirmActionModal } from '@/components/ConfirmActionModal'
import { EditAssetModal } from '@/components/EditAssetModal'
import { GovernancePillarModal } from '@/components/GovernancePillarModals'
import { AddContributorModal } from '@/components/AddContributorModal'
import { AssetData, AssetStatus, RelationshipItem, RightsDocument, ApprovalRequest, AssetEpisode, GovernancePillarKey } from '@/types'
import { getAssetRiskAssessment } from '@/lib/risk'
import { getCategoryGovernance, isEpisodeCategory } from '@/lib/categoryGovernance'

interface AssetDetailsViewProps {
  asset: AssetData
  onBack: () => void
  onSelectAsset?: (a: AssetData) => void
  setActiveNav?: (nav: string, assetId?: string | null) => void
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

  // 2 Intuitive Core Pillars (Tabs) - Rights & Governance centralized in its dedicated module
  const [activeTab, setActiveTab] = useState<'overview' | 'connections'>('overview')
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  // Individual Governance Pillar Modal State (Universal Single-Pillar Edits)
  const [activeIndividualPillar, setActiveIndividualPillar] = useState<GovernancePillarKey | null>(null)
  const [isIndividualPillarModalOpen, setIsIndividualPillarModalOpen] = useState(false)
  const [isAddContributorModalOpen, setIsAddContributorModalOpen] = useState(false)

  const openIndividualPillar = (pillarKey: GovernancePillarKey) => {
    setActiveIndividualPillar(pillarKey)
    setIsIndividualPillarModalOpen(true)
  }

  // Add Relationship Modal
  const [isAddRelModalOpen, setIsAddRelModalOpen] = useState(false)
  const [targetAssetId, setTargetAssetId] = useState('')
  const [relType, setRelType] = useState<RelationshipItem['relationshipType']>('Used In')
  const [relDetails, setRelDetails] = useState('')

  // Cloudinary Media Upload Modal State
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaFileType, setMediaFileType] = useState('video_master')
  const [isMasterFile, setIsMasterFile] = useState(true)
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)

  // Existing approval request for this asset
  const existingApproval = useMemo(() => {
    return approvals.find((a) => a.assetId === asset.id)
  }, [approvals, asset.id])

  // Linked Rights Record
  const linkedRights = useMemo(() => {
    return rightsRecords.find((r) => r.assetId === asset.id || r.name.includes(asset.name))
  }, [rightsRecords, asset])

  // Documents attached to Rights record
  const documents = useMemo(() => {
    return (linkedRights?.documents && Array.isArray(linkedRights.documents)) ? linkedRights.documents : []
  }, [linkedRights])

  // Risk & Compliance Evaluation
  const assetRisk = useMemo(() => {
    return getAssetRiskAssessment(asset, rightsRecords, approvals)
  }, [asset, rightsRecords, approvals])

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
    onConfirm: () => { },
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

  // Category Governance Framework resolution
  const govRule = useMemo(() => getCategoryGovernance(asset.category), [asset.category])
  const isEpisodeStructuredCategory = isEpisodeCategory(asset.category)
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
          <div><span className="font-semibold text-slate-700">Source:</span> {asset.name} <span className="font-mono text-slate-500 ml-1.5">({asset.id})</span></div>
          <div><span className="font-semibold text-slate-700">Relationship:</span> {relType}</div>
          <div><span className="font-semibold text-slate-700">Target:</span> {targetAsset.name} <span className="font-mono text-slate-500 ml-1.5">({targetAsset.id})</span></div>
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
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                  <CategoryIcon category={asset.category} />
                  <span>{asset.category}</span>
                </span>
                <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                  Agency: {asset.agency || asset.unit}
                </span>
                <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
                  {asset.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 pt-1">
                {asset.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-3xl leading-relaxed mt-1">
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

            {/* Direct Link to Rights & Governance */}
            {setActiveNav && (
              <button
                id="header-rights-governance-btn"
                onClick={() => {
                  setActiveNav('Rights & Governance', asset.id)
                }}
                className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 dark:text-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs transition cursor-pointer"
                title="Manage legal clearances, territory rights and compliance verification"
              >
                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Rights & Governance ↗</span>
              </button>
            )}

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

      {/* 3. SIMPLIFIED 2-TAB PILL BAR */}
      <div className="border border-slate-200/80 bg-slate-100/70 dark:border-white/10 dark:bg-slate-900/90 p-1 rounded-xl">
        <div className="grid grid-cols-2 gap-1">
          {/* Tab 1: Overview & Media */}
          {/* Tab 1: Overview */}
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs transition cursor-pointer',
              activeTab === 'overview'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60 dark:bg-slate-800 dark:text-white dark:border-white/15'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 font-medium'
            )}
          >
            <Info className="size-3.5" />
            <span>Overview</span>
          </button>

          {/* Tab 2: Connected IP & History */}
          <button
            id="tab-connections"
            onClick={() => setActiveTab('connections')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs transition cursor-pointer',
              activeTab === 'connections'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60 dark:bg-slate-800 dark:text-white dark:border-white/15'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 font-medium'
            )}
          >
            <Layers className="size-3.5" />
            <span>Connected IP & History</span>
            <span
              className={cn(
                'rounded-md px-1.5 py-0.2 text-[9px] font-semibold',
                activeTab === 'connections'
                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-700/80 dark:text-slate-200'
                  : 'bg-white text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-white/10'
              )}
            >
              {assetRelationships.length} Links
            </span>
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW & MEDIA */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Episodes Showcase (Displays only for assets with catalogued episodes; returns null otherwise) */}
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
                  <span className="text-slate-400 text-[11px] block">Sub-Asset Hierarchy</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px]">
                      {govRule.subAssetStructure}
                    </span>
                    {govRule.supportsEpisodes ? (
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                        Episodes
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {govRule.subAssetLabel}
                      </span>
                    )}
                  </div>
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
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#1c202c] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Staff Contributors ({asset.contributors?.length || 0})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddContributorModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-[#2f80ed] dark:hover:text-blue-300 transition cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Add</span>
                  </button>
                  <Users className="size-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {asset.contributors && asset.contributors.length > 0 ? (
                  <div className="space-y-2">
                    {asset.contributors.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-[#141622] p-2.5 text-xs"
                      >
                        <div className="size-8 rounded-lg bg-slate-900 dark:bg-[#2f80ed]/20 text-white dark:text-[#2f80ed] font-bold text-xs grid place-items-center shrink-0 border border-transparent dark:border-[#2f80ed]/30">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {c.role} • <span className="font-medium text-slate-700 dark:text-slate-300">{c.agency || asset.agency}</span>
                          </div>
                        </div>
                        {c.contributionType && (
                          <span className="rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                            {c.contributionType}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/15 p-4 text-center text-slate-400 dark:text-slate-500 text-[11px] flex flex-col items-center gap-2">
                    <span>No specific staff contributors logged.</span>
                    <button
                      type="button"
                      onClick={() => setIsAddContributorModalOpen(true)}
                      className="font-bold text-blue-600 hover:text-blue-700 dark:text-[#2f80ed] dark:hover:text-blue-300 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Contributor</span>
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
                  <span className="font-semibold text-slate-900">{asset.rightsHolder || <span className="text-slate-400 italic font-normal">Unassigned</span>}</span>
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

          {/* Rights & Governance Hub Summary Card with Direct Navigation */}
          <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-slate-900/95 dark:to-indigo-950/30 p-5 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600 text-white grid place-items-center shrink-0 shadow-xs dark:bg-blue-600 dark:shadow-blue-900/40 dark:ring-1 dark:ring-blue-400/30">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Rights & Governance</h4>
                    <span className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold border shadow-2xs",
                      assetRisk.riskBadgeColor
                    )}>
                      {assetRisk.level} Risk • {100 - assetRisk.score}% Compliant
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Clearance deeds, territory scope, legal licensing terms, and governance audit trails for this asset are managed centrally in Rights & Governance.
                  </p>
                </div>
              </div>

              {setActiveNav && (
                <button
                  id="open-rights-governance-hub-btn"
                  onClick={() => {
                    setActiveNav('Rights & Governance', asset.id)
                  }}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-blue-950/50"
                >
                  <ShieldCheck className="size-4" />
                  <span>Open in Rights & Governance ↗</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-blue-100 dark:border-white/10 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Rights Scope</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 truncate block">
                  {linkedRights?.rightsType || 'Unconfigured Scope'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Territory & Term</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                  {linkedRights?.territory || 'Global'}{linkedRights?.term ? ` • ${linkedRights.term}` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Clearance Deeds</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 block">
                  {documents.length > 0 ? `${documents.length} Deeds Filed` : 'No Deeds Attached'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Clearance Status</span>
                <span className={cn(
                  "font-bold block",
                  asset.status === 'Approved' ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                )}>
                  {asset.status}
                </span>
              </div>
            </div>

            {/* 5 Focused Governance Pillars - Quick Individual Action Cards */}
            <div className="pt-3 border-t border-blue-100 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                  <span>5 Governance Pillars • Individual Quick Edit</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Click any pillar to update individually (requires approval)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {/* 1. Legal Owner */}
                <button
                  type="button"
                  onClick={() => openIndividualPillar('legal_owner')}
                  className="group relative flex flex-col justify-between p-3 rounded-xl border border-blue-200/80 bg-white/90 hover:bg-blue-50/60 dark:border-white/10 dark:bg-slate-900/90 dark:hover:bg-blue-950/30 transition text-left cursor-pointer shadow-2xs hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                      <Crown className="size-3 text-amber-500" />
                      <span>Legal Owner</span>
                    </span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs truncate w-full" title={asset.owner || (asset as any).attributes?.owner || linkedRights?.owner || 'Esteemed Executive Minister (Super Admin)'}>
                    {asset.owner || (asset as any).attributes?.owner || linkedRights?.owner || 'Esteemed Executive Minister (Super Admin)'}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    Ref: {asset.ownerCertificateRef || (asset as any).attributes?.ownerCertificateRef || linkedRights?.ownerCertificateRef || 'CERT-HQ'}
                  </div>
                </button>

                {/* 2. Trademark & Licensing */}
                <button
                  type="button"
                  onClick={() => openIndividualPillar('trademark_license')}
                  className="group relative flex flex-col justify-between p-3 rounded-xl border border-purple-200/80 bg-white/90 hover:bg-purple-50/60 dark:border-white/10 dark:bg-slate-900/90 dark:hover:bg-purple-950/30 transition text-left cursor-pointer shadow-2xs hover:border-purple-400 dark:hover:border-purple-600"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-400">
                      <BadgeCheck className="size-3 text-purple-600 dark:text-purple-400" />
                      <span>Trademark</span>
                    </span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition" />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs truncate w-full">
                    {asset.trademarkStatus || (asset as any).attributes?.trademarkStatus || linkedRights?.trademarkStatus || 'Unregistered'}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-1" title={asset.distributionLicense || (asset as any).attributes?.distributionLicense || linkedRights?.distributionLicense || 'None'}>
                    License: {asset.distributionLicense || (asset as any).attributes?.distributionLicense || linkedRights?.distributionLicense || 'None'}
                  </div>
                </button>

                {/* 3. Territory Clearance */}
                <button
                  type="button"
                  onClick={() => openIndividualPillar('territory')}
                  className="group relative flex flex-col justify-between p-3 rounded-xl border border-amber-200/80 bg-white/90 hover:bg-amber-50/60 dark:border-white/10 dark:bg-slate-900/90 dark:hover:bg-amber-950/30 transition text-left cursor-pointer shadow-2xs hover:border-amber-400 dark:hover:border-amber-600"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                      <Globe2 className="size-3 text-amber-600 dark:text-amber-400" />
                      <span>Territory</span>
                    </span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition" />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs truncate w-full" title={asset.territory || (asset as any).attributes?.territory || linkedRights?.territory || 'None'}>
                    {asset.territory || (asset as any).attributes?.territory || linkedRights?.territory || 'None'}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    Status: {asset.territoryClearanceStatus || (asset as any).attributes?.territoryClearanceStatus || linkedRights?.territoryClearanceStatus || 'None'}
                  </div>
                </button>

                {/* 4. Production Rights */}
                <button
                  type="button"
                  onClick={() => openIndividualPillar('production_rights')}
                  className="group relative flex flex-col justify-between p-3 rounded-xl border border-indigo-200/80 bg-white/90 hover:bg-indigo-50/60 dark:border-white/10 dark:bg-slate-900/90 dark:hover:bg-indigo-950/30 transition text-left cursor-pointer shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-600"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
                      <Clapperboard className="size-3 text-indigo-600 dark:text-indigo-400" />
                      <span>Production</span>
                    </span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs truncate w-full" title={asset.productionLicensees || (asset as any).attributes?.productionLicensees || linkedRights?.productionLicensees || 'None'}>
                    {asset.productionLicensees || (asset as any).attributes?.productionLicensees || linkedRights?.productionLicensees || 'None'}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    Studio & Licensees
                  </div>
                </button>

                {/* 5. AI Provenance */}
                <button
                  type="button"
                  onClick={() => openIndividualPillar('ai_provenance')}
                  className="group relative flex flex-col justify-between p-3 rounded-xl border border-cyan-200/80 bg-white/90 hover:bg-cyan-50/60 dark:border-white/10 dark:bg-slate-900/90 dark:hover:bg-cyan-950/30 transition text-left cursor-pointer shadow-2xs hover:border-cyan-400 dark:hover:border-cyan-600"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                      <Sparkles className="size-3 text-cyan-600 dark:text-cyan-400" />
                      <span>AI Provenance</span>
                    </span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition" />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs truncate w-full">
                    {asset.contentProvenance || (asset as any).attributes?.contentProvenance || linkedRights?.contentProvenance || 'Fully Custom'}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    3-Tier Verification
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PRODUCTION EPISODES & RELEASES MANAGER (EPISODE CATEGORIES)   */}
          {/* ------------------------------------------------------------- */}
          {isEpisodeStructuredCategory && (
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
                  <table className="w-full min-w-[580px] text-left text-xs">
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

          {/* ------------------------------------------------------------- */}
          {/* CATEGORY GOVERNANCE & SUB-ASSET SPECIFICATION                 */}
          {/* ------------------------------------------------------------- */}

        </div>
      )}

      {/* TAB 2: CONNECTED IP, SUB-ASSETS & HISTORY */}

      {activeTab === 'connections' && (
        <div className="space-y-6">
          {/* Connected Relationships Section */}
          <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3.5">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Connected Intellectual Property</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cross-media linkages: soundtrack masters, companion books, merchandise, and franchise spin-offs.
                </p>
              </div>
              <button
                id="add-relationship-btn"
                onClick={() => setIsAddRelModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-2xs transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Connect New Asset</span>
              </button>
            </div>

            {govRule.primaryAssetRelations && govRule.primaryAssetRelations.length > 0 && (
              <div className="rounded-lg bg-blue-50/60 border border-blue-200/80 dark:bg-blue-950/30 dark:border-blue-800/40 p-3 text-xs space-y-1.5">
                <div className="font-semibold text-blue-900 dark:text-blue-300 text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  <span>Approved Framework Relations for {asset.category}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {govRule.primaryAssetRelations.map((relGuideline, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-white border border-blue-200 dark:bg-slate-900 dark:border-blue-800/50 dark:text-blue-200 px-2 py-0.5 text-[10px] text-blue-800 font-medium"
                    >
                      {relGuideline}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                      className="flex flex-col justify-between rounded-lg border border-slate-200 p-3.5 bg-slate-50/60 hover:bg-white hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:border-white/20 transition shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="size-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white grid place-items-center shrink-0">
                          <Link2 className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-700/80 dark:border-white/10 dark:text-slate-200 px-1.5 py-0.5 font-medium text-[9px] uppercase">
                              {rel.relationshipType}
                            </span>
                            {otherAssetObj && (
                              <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                {otherAssetObj.category}
                              </span>
                            )}
                            {otherAssetId && (
                              <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                                {otherAssetId}
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white truncate text-xs mt-1.5">
                            {otherAssetName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {rel.details}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
                        {otherAssetObj && onSelectAsset ? (
                          <button
                            onClick={() => onSelectAsset(otherAssetObj)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          >
                            <span>Inspect Asset</span>
                            <ArrowUpRight className="size-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {otherAssetId || 'Linked External IP'}
                          </span>
                        )}

                        <button
                          onClick={() => {
                            deleteRelationship(rel.id)
                            showToast('Disconnected IP relationship')
                          }}
                          className="size-7 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 grid place-items-center transition cursor-pointer"
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
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 dark:bg-slate-800/30 p-7 text-center space-y-2.5">
                <Link2 className="size-7 text-slate-300 dark:text-slate-500 mx-auto" />
                <div className="font-semibold text-slate-700 dark:text-slate-200 text-xs">No Connected Assets Yet</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Link related comic books, soundtrack audio masters, video game packages, and character merchandise to build the complete franchise IP graph.
                </p>
                <button
                  onClick={() => setIsAddRelModalOpen(true)}
                  className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-2xs transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Connect First Asset</span>
                </button>
              </div>
            )}
          </div>

          {/* Activity Trail / Asset History */}
          <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Activity className="size-4 text-slate-700 dark:text-slate-300" />
                <span>Audit Log & Asset Lifecycle History</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chronological record of status changes, reviews, clearances, and version bumps.
              </p>
            </div>

            {assetActivities.length > 0 ? (
              <div className="space-y-2.5 text-xs">
                {assetActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-white/5 p-3 bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <div className="size-1.5 rounded-full bg-slate-900 dark:bg-blue-400 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white">{act.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{act.subtitle}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">{act.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-white/5 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white">Asset Registered into Central KMM Portal</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Initial intake catalogued for {asset.agency || 'KMM Network'} ({asset.createdDate})
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">{asset.createdTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD RELATIONSHIP MODAL */}
      {isAddRelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800/50 dark:text-indigo-300 grid place-items-center">
                  <Link2 className="size-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] dark:text-white text-sm">Connect Related Asset</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Link other IP across agencies to {asset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRelModalOpen(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 grid place-items-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelationshipOnAsset} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Target Asset to Connect:
                </label>
                <select
                  id="target-asset-select"
                  value={targetAssetId}
                  onChange={(e) => setTargetAssetId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Relationship Type:
                </label>
                <select
                  id="rel-type-select"
                  value={relType}
                  onChange={(e) => setRelType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Connection Notes (Optional):
                </label>
                <textarea
                  id="rel-notes-textarea"
                  rows={3}
                  value={relDetails}
                  onChange={(e) => setRelDetails(e.target.value)}
                  placeholder="e.g. Official orchestral soundtrack stems synchronized in opening credits..."
                  className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white p-3 text-xs outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddRelModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
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
      {/* MEDIA UPLOAD MODAL - COMING SOON */}
      {isUploadMediaModalOpen && (
        <div
          onClick={() => setIsUploadMediaModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900 p-6 shadow-2xl space-y-5 cursor-default animate-in zoom-in-95"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0 shadow-xs">
                  <UploadCloud className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Cloud Media Archival
                    </h3>
                    <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:border-amber-800/50 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Centralized media file storage for <span className="font-semibold text-slate-700 dark:text-slate-200">{asset.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadMediaModalOpen(false)}
                className="size-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 grid place-items-center cursor-pointer transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Storage Provisioning Status Notice */}
            <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:border-amber-800/40 dark:from-amber-950/40 dark:to-amber-900/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span>Media Archive Storage in Provisioning Phase</span>
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                Dedicated high-throughput cloud media storage is currently being configured for Kiddies Media Ministries. Direct master upload and CDN streaming pipelines will be activated upon storage connection.
              </p>
            </div>

            {/* Feature Pipeline Grid */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Storage Deliverables Pipeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/40 p-2.5 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Film className="size-3.5 text-blue-500" />
                    <span>Master Video Files</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    4K UHD & 1080p ProRes 422 HQ broadcast clean masters with split audio.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/40 p-2.5 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Music className="size-3.5 text-indigo-500" />
                    <span>Multitrack Audio Stems</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    24-bit/48kHz WAV stems (Vocals, Music, SFX) and soundtrack stems.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/40 p-2.5 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe2 className="size-3.5 text-emerald-500" />
                    <span>Global CDN Distribution</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Direct low-latency streaming pipeline for authorized ministry stations.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/40 p-2.5 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-amber-500" />
                    <span>IP Rights Watermarking</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Automated digital fingerprinting and cryptographic provenance seal.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                Storage Node: KMM-S3-ARCHIVE
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsUploadMediaModalOpen(false)
                  showToast('Cloud media storage provisioning is in progress. Notification will be sent upon activation.')
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 shadow-xs transition cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Production Episode Modal */}
      {isAddEpisodeModalOpen && (
        <div
          onClick={() => setIsAddEpisodeModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900 p-6 shadow-2xl text-xs space-y-4 cursor-default animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-white/10 dark:text-slate-300 grid place-items-center">
                  <Film className="size-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Add Production Episode</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Record episode release details for {asset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEpisodeModalOpen(false)}
                className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 grid place-items-center transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateAddEpisode} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Episode # *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={epNum}
                    onChange={(e) => setEpNum(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Runtime (Minutes) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={epDuration}
                    onChange={(e) => setEpDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Episode 04: The Armor of God in Action"
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white px-3 py-2 text-xs font-medium outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Production Status:</label>
                  <select
                    value={epStatus}
                    onChange={(e) => setEpStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white p-2 text-xs font-medium outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition cursor-pointer"
                  >
                    <option value="In Production" className="dark:bg-slate-900 dark:text-white">In Production</option>
                    <option value="Mastered" className="dark:bg-slate-900 dark:text-white">Mastered</option>
                    <option value="Approved" className="dark:bg-slate-900 dark:text-white">Approved</option>
                    <option value="Broadcast Ready" className="dark:bg-slate-900 dark:text-white">Broadcast Ready</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-slate-400 dark:text-slate-400" />
                      <span>Release / Air Date:</span>
                    </span>
                    {epAirDate && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
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
                      className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white px-3 py-2 text-xs font-medium outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <span>Select calendar date</span>
                    {epAirDate && (
                      <button
                        type="button"
                        onClick={() => setEpAirDate('')}
                        className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                      >
                        Clear date
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Synopsis / Scripture Focus (Optional):</label>
                <textarea
                  rows={2}
                  placeholder="Summary of storyline, character lesson, and scripture references..."
                  value={epSynopsis}
                  onChange={(e) => setEpSynopsis(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white p-2.5 text-xs font-medium outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Master Video Link (Optional)
                  <span className="text-[10px] font-normal text-amber-600 dark:text-amber-400 ml-1.5">• Cloud Storage In Provisioning</span>
                </label>
                <input
                  type="url"
                  placeholder="https://... (Direct master URL if available)"
                  value={epVideoUrl}
                  onChange={(e) => setEpVideoUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800/80 dark:text-white px-3 py-2 text-xs font-medium outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddEpisodeModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2 font-medium text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Add Episode</span>
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

      {/* Individual Focused Governance Pillar Modal */}
      <GovernancePillarModal
        isOpen={isIndividualPillarModalOpen}
        onClose={() => setIsIndividualPillarModalOpen(false)}
        asset={asset}
        activePillar={activeIndividualPillar}
      />

      {/* Add Contributor Modal */}
      <AddContributorModal
        isOpen={isAddContributorModalOpen}
        onClose={() => setIsAddContributorModalOpen(false)}
        asset={asset}
      />
    </div>
  )
}
