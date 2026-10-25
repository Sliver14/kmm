'use client'

import React, { useState, useMemo } from 'react'
import {
  ClipboardCheck, CheckCircle2, Clock, AlertTriangle, FileText, Check, X,
  Eye, Download, Search, ArrowUpDown, ShieldCheck, Sparkles, ChevronDown,
  MessageSquare, Calendar, User, Globe2, Lock, ShieldAlert, Layers,
  Flame, Shield, ListChecks, Music, Film, Play, RotateCcw, CheckSquare, Square
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLovetoonsData } from '@/lib/store/DataContext'
import { ApprovalRequest, RightsDocument } from '@/types'

// Core Doctrinal & Governance Verification Gates
export const GOVERNANCE_GATES = [
  {
    key: 'Scripture & Biblical Fidelity Verification',
    title: 'Biblical & Doctrinal Alignment',
    desc: 'Scripture fidelity and theological sound doctrine verified',
  },
  {
    key: 'Child Safety & COPPA Compliance Review',
    title: 'Child Safety & COPPA Review',
    desc: 'Child online privacy and age-appropriate content cleared',
  },
  {
    key: 'Audio Master & Soundtrack Synchronization License',
    title: 'Audio Master & Music Sync',
    desc: 'Original music score and soundtrack rights licensed',
  },
  {
    key: 'Voice Cast Talent Release & Identity Clearance',
    title: 'Voice Cast & Talent Releases',
    desc: 'Executed talent deeds and likeness clearances on file',
  },
  {
    key: 'KMM Ministry Trademark Registration Seal',
    title: 'KMM Trademark & IP Custody',
    desc: 'Registered under KMM intellectual property custody',
  },
]

// Quick revision chips for the feedback modal
const REVISION_QUICK_TAGS = [
  'Missing actor & voice talent release form',
  'Doctrinal review clarification required',
  'Audio soundtrack synchronization clearance needed',
  'Child safety / COPPA compliance documentation missing',
  'High-resolution broadcast master required (4K/1080p)',
  'Update territorial rights scope & expiration term',
  'Statutory trademark certificate not attached',
]

// Category visual helper
function CategoryVisualBadge({ category }: { category: string }) {
  const isVideo = category.includes('Animated') || category.includes('TV') || category.includes('Film')
  const isAudio = category.includes('Music') || category.includes('Audio') || category.includes('Podcast')
  const isGame = category.includes('Interactive') || category.includes('Digital') || category.includes('Game')

  if (isVideo) {
    return (
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-700 shadow-xs border border-purple-200">
        <Film className="size-4" />
      </div>
    )
  }
  if (isAudio) {
    return (
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700 shadow-xs border border-blue-200">
        <Music className="size-4" />
      </div>
    )
  }
  if (isGame) {
    return (
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 shadow-xs border border-emerald-200">
        <Play className="size-4" />
      </div>
    )
  }
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 shadow-xs border border-amber-200">
      <Layers className="size-4" />
    </div>
  )
}

export function ApprovalsWorkflow() {
  const {
    approvals,
    approveRequest,
    declineRequest,
    requestFeedback,
    canApprove,
    currentUser,
    showToast,
    rightsRecords,
    updateRightsRecord,
    assets,
  } = useLovetoonsData()

  // Governance Checklist Toggle (Reviewer / Admin Action)
  const handleToggleGovernanceCheckInApproval = async (approval: ApprovalRequest, checkKey: string) => {
    const matchedRights = rightsRecords.find((r) => r.assetId === approval.assetId || r.id === approval.assetId)
    const currentChecks = {
      ...((matchedRights?.governanceChecks as Record<string, boolean>) || {}),
      ...((approval.governanceChecks as Record<string, boolean>) || {}),
    }
    const updatedChecks = {
      ...currentChecks,
      [checkKey]: !currentChecks[checkKey],
    }
    const verifiedCount = Object.values(updatedChecks).filter(Boolean).length
    const newScore = verifiedCount * 20

    if (matchedRights) {
      updateRightsRecord({
        ...matchedRights,
        governanceChecks: updatedChecks,
        governanceScore: newScore,
        status: newScore === 100 ? 'Cleared' : 'Review',
      })
    }

    try {
      await fetch('/api/rights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: approval.assetId,
          governanceChecks: updatedChecks,
          governanceScore: newScore,
        }),
      })
      await fetch('/api/approvals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: approval.id,
          governanceChecks: updatedChecks,
          governanceScore: newScore,
        }),
      })
      showToast(`Updated verification: ${checkKey} (${newScore}% verified)`)
    } catch (err) {
      console.error(err)
      showToast('Updated verification locally')
    }
  }

  // State Filters
  const [activeTab, setActiveTab] = useState<'Pending' | 'Needs Feedback' | 'Approved' | 'Declined' | 'All'>('Pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAgency, setSelectedAgency] = useState<string>('All')
  const [selectedPriority, setSelectedPriority] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'governance'>('newest')
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards')

  // Expanded items mapped by ID
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({})

  // Batch Selection mapped by ID
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({})

  // Modals State
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [actionType, setActionType] = useState<'feedback' | 'decline' | 'approveNote' | null>(null)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [declineReason, setDeclineReason] = useState('')
  const [approveNote, setApproveNote] = useState('')

  // Document Preview Modal
  const [selectedDocPreview, setSelectedDocPreview] = useState<{
    doc: RightsDocument
    approval: ApprovalRequest
  } | null>(null)

  // Distinct agencies
  const agencies = useMemo(() => {
    const set = new Set<string>()
    approvals.forEach((a) => {
      if (a.agency) set.add(a.agency)
      if (a.unit) set.add(a.unit)
    })
    return ['All', ...Array.from(set)]
  }, [approvals])

  // Summary Metrics & Eligible Approvals:
  // Rule: Asset should not pop in approvals until documents are uploaded before it can be scheduled for Approval request
  const eligibleApprovals = useMemo(() => {
    return approvals.filter((app) => {
      const matchedRights = rightsRecords.find((r) => r.assetId === app.assetId || r.id === app.assetId)
      const hasDocs =
        (Array.isArray(app.documents) && app.documents.length > 0) ||
        (Array.isArray(matchedRights?.documents) && matchedRights.documents.length > 0)
      // Only show if it has documents attached or was already approved
      return hasDocs || app.status === 'Approved'
    })
  }, [approvals, rightsRecords])

  const metrics = useMemo(() => {
    const total = eligibleApprovals.length
    const pending = eligibleApprovals.filter((a) => a.status === 'Pending').length
    const urgent = eligibleApprovals.filter((a) => (a.priority === 'Urgent' || a.priority === 'High') && a.status === 'Pending').length
    const feedback = eligibleApprovals.filter((a) => a.status === 'Needs Feedback').length
    const approved = eligibleApprovals.filter((a) => a.status === 'Approved').length
    const declined = eligibleApprovals.filter((a) => a.status === 'Declined').length

    // Avg governance score
    const scores = eligibleApprovals.map((a) => a.governanceScore ?? 0)
    const avgScore = scores.length ? Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length) : 0

    return { total, pending, urgent, feedback, approved, declined, avgScore }
  }, [eligibleApprovals])

  // Filter & Sort Logic
  const filteredApprovals = useMemo(() => {
    return eligibleApprovals
      .filter((app) => {
        // Tab filter
        if (activeTab === 'Pending' && app.status !== 'Pending') return false
        if (activeTab === 'Needs Feedback' && app.status !== 'Needs Feedback') return false
        if (activeTab === 'Approved' && app.status !== 'Approved') return false
        if (activeTab === 'Declined' && app.status !== 'Declined') return false

        // Agency filter
        if (selectedAgency !== 'All' && app.agency !== selectedAgency && app.unit !== selectedAgency) {
          return false
        }

        // Priority filter
        if (selectedPriority !== 'All' && app.priority !== selectedPriority) {
          return false
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchName = app.assetName.toLowerCase().includes(q)
          const matchId = app.id.toLowerCase().includes(q) || (app.assetId && app.assetId.toLowerCase().includes(q))
          const matchRequester = app.requesterName.toLowerCase().includes(q)
          const matchStage = app.stage.toLowerCase().includes(q)
          const matchCat = app.category.toLowerCase().includes(q) || app.subcategory.toLowerCase().includes(q)
          if (!matchName && !matchId && !matchRequester && !matchStage && !matchCat) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const weight: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 }
          return (weight[b.priority] || 0) - (weight[a.priority] || 0)
        }
        if (sortBy === 'governance') {
          return (b.governanceScore ?? 0) - (a.governanceScore ?? 0)
        }
        if (sortBy === 'oldest') {
          return a.id.localeCompare(b.id)
        }
        // default newest
        return b.id.localeCompare(a.id)
      })
  }, [eligibleApprovals, activeTab, selectedAgency, selectedPriority, searchQuery, sortBy])

  // Toggle expanded
  const toggleExpand = (id: string) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Toggle batch select
  const toggleSelect = (id: string) => {
    setSelectedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedCount = Object.values(selectedMap).filter(Boolean).length

  const selectAllFiltered = () => {
    if (selectedCount === filteredApprovals.length) {
      setSelectedMap({})
    } else {
      const next: Record<string, boolean> = {}
      filteredApprovals.forEach((a) => {
        next[a.id] = true
      })
      setSelectedMap(next)
    }
  }

  const handleBatchApprove = () => {
    const idsToApprove = Object.keys(selectedMap).filter((id) => selectedMap[id])
    idsToApprove.forEach((id) => approveRequest(id, 'Batch cleared via Reviewer Command Center'))
    setSelectedMap({})
    showToast(`Successfully batch-approved ${idsToApprove.length} asset clearances!`)
  }

  // If user does not have clearance (e.g. Unit Admin)
  if (!canApprove) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 pt-4">
        {/* Access Restricted Banner with Quick Switch Button */}
        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-sm">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white mx-auto mb-4 shadow-md shadow-amber-500/25">
            <Lock className="size-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="size-3.5" />
            Role Restricted Access
          </span>
          <h2 className="text-xl font-black text-[#09245a]">Reviewer & Super Admin Sign-off Required</h2>
          <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            You are currently signed in as <b className="text-slate-900">{currentUser.name}</b> ({currentUser.roleLabel} — {currentUser.unit}). Intellectual asset review, doctrinal validation, and legal clearances are restricted to authorized Content Reviewers.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs max-w-md mx-auto text-xs text-slate-500">
            <span>To request clearance on your agency assets, please submit clearance documents through the Assets catalog or Rights & Governance tab.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* EXECUTIVE KPI DASHBOARD STATS (INTERACTIVE FILTERS) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pending Review Card */}
        <button
          id="kpi-pending-btn"
          onClick={() => setActiveTab('Pending')}
          className={cn(
            'group text-left rounded-xl border p-4 transition duration-150 cursor-pointer relative overflow-hidden',
            activeTab === 'Pending'
              ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs dark:bg-blue-950/30 dark:border-blue-500 dark:ring-blue-500/30'
              : 'border-slate-200/80 bg-white hover:border-blue-300 dark:hover:border-blue-500/40 shadow-2xs hover:shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-[11px] font-semibold uppercase tracking-wider transition-colors',
                activeTab === 'Pending'
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Pending Sign-Off
            </span>
            <div
              className={cn(
                'grid size-8 place-items-center rounded-lg transition-colors',
                activeTab === 'Pending'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60'
              )}
            >
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {metrics.pending}
            </span>
            {metrics.urgent > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 text-[10px] font-semibold">
                <Flame className="size-3 text-rose-600" />
                {metrics.urgent} Urgent
              </span>
            ) : (
              <span
                className={cn(
                  'text-[11px] font-semibold transition-colors',
                  activeTab === 'Pending'
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                Queue Active
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Requires legal & governance check
          </div>
        </button>

        {/* Needs Revision Card */}
        <button
          id="kpi-feedback-btn"
          onClick={() => setActiveTab('Needs Feedback')}
          className={cn(
            'group text-left rounded-xl border p-4 transition duration-150 cursor-pointer relative overflow-hidden',
            activeTab === 'Needs Feedback'
              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs dark:bg-amber-950/30 dark:border-amber-500 dark:ring-amber-500/30'
              : 'border-slate-200/80 bg-white hover:border-amber-300 dark:hover:border-amber-500/40 shadow-2xs hover:shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-[11px] font-semibold uppercase tracking-wider transition-colors',
                activeTab === 'Needs Feedback'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Revision Requested
            </span>
            <div
              className={cn(
                'grid size-8 place-items-center rounded-lg transition-colors',
                activeTab === 'Needs Feedback'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60'
              )}
            >
              <MessageSquare className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {metrics.feedback}
            </span>
            <span
              className={cn(
                'text-[11px] font-semibold transition-colors',
                activeTab === 'Needs Feedback'
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Awaiting Creator
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Pending script or release updates
          </div>
        </button>

        {/* Approved Card */}
        <button
          id="kpi-approved-btn"
          onClick={() => setActiveTab('Approved')}
          className={cn(
            'group text-left rounded-xl border p-4 transition duration-150 cursor-pointer relative overflow-hidden',
            activeTab === 'Approved'
              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs dark:bg-emerald-950/30 dark:border-emerald-500 dark:ring-emerald-500/30'
              : 'border-slate-200/80 bg-white hover:border-emerald-300 dark:hover:border-emerald-500/40 shadow-2xs hover:shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-[11px] font-semibold uppercase tracking-wider transition-colors',
                activeTab === 'Approved'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Cleared & Broadcast-Ready
            </span>
            <div
              className={cn(
                'grid size-8 place-items-center rounded-lg transition-colors',
                activeTab === 'Approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60'
              )}
            >
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {metrics.approved}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-semibold transition-colors',
                activeTab === 'Approved'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <ShieldCheck className="size-3.5" /> Certified
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Broadcast certificates sealed
          </div>
        </button>

        {/* Avg Governance Score */}
        <div className="text-left rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Governance Health
            </span>
            <div className="grid size-8 place-items-center rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <Shield className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 tracking-tight">{metrics.avgScore}%</span>
            <span className="text-[11px] font-semibold text-purple-700">Avg Compliance</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Biblical alignment verified
          </div>
        </div>
      </div>

      {/* 3. SEARCH, STATUS TABS, FILTER & CONTROL BAR */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3.5">
        {/* Row 1: Status Tabs + View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Main Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['Pending', 'Needs Feedback', 'Approved', 'Declined', 'All'] as const).map((tab) => {
              const count =
                tab === 'Pending'
                  ? metrics.pending
                  : tab === 'Needs Feedback'
                  ? metrics.feedback
                  : tab === 'Approved'
                  ? metrics.approved
                  : tab === 'Declined'
                  ? metrics.declined
                  : metrics.total

              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  id={`tab-${tab.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer',
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <span>{tab}</span>
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 text-[10px] font-semibold',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 p-1 rounded-lg text-slate-500 text-xs">
            <button
              id="view-mode-cards"
              onClick={() => setViewMode('cards')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer',
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-800'
              )}
            >
              <Layers className="size-3.5" />
              <span>Cards</span>
            </button>
            <button
              id="view-mode-compact"
              onClick={() => setViewMode('compact')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer',
                viewMode === 'compact' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-800'
              )}
            >
              <ListChecks className="size-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search Input, Agency, Priority and Sorting */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              id="approvals-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by asset title, code, stage, requester..."
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Agency Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase hidden md:inline">Agency:</span>
            <select
              id="filter-agency"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 transition cursor-pointer"
            >
              {agencies.map((agency) => (
                <option key={agency} value={agency}>
                  {agency === 'All' ? 'All Agencies' : agency}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase hidden md:inline">Priority:</span>
            <select
              id="filter-priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 transition cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Only</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="size-3.5 text-slate-400" />
            <select
              id="sort-approvals"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 transition cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="priority">Highest Priority</option>
              <option value="governance">Governance Score</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Reset Filters button if active */}
          {(searchQuery || selectedAgency !== 'All' || selectedPriority !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedAgency('All')
                setSelectedPriority('All')
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Batch Actions Bar (Visible when items selected) */}
        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-900 text-white p-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-4 text-emerald-400" />
              <span className="font-medium text-white text-xs">
                {selectedCount} request{selectedCount > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="batch-approve-btn"
                onClick={handleBatchApprove}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition cursor-pointer"
              >
                <Check className="size-3.5" />
                <span>Approve Selected ({selectedCount})</span>
              </button>
              <button
                onClick={() => setSelectedMap({})}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. APPROVALS LIST / CARDS */}
      {filteredApprovals.length === 0 ? (
        <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="grid size-14 place-items-center rounded-xl bg-slate-100 text-slate-500 mx-auto mb-3 shadow-2xs">
            <ClipboardCheck className="size-7" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">No approval requests found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedAgency !== 'All' || selectedPriority !== 'All'
              ? 'No requests matched your active filters. Try searching with different terms or reset your filters.'
              : `All submissions in the "${activeTab}" tab have been processed.`}
          </p>
          {(searchQuery || selectedAgency !== 'All' || selectedPriority !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedAgency('All')
                setSelectedPriority('All')
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Clear Search & Filters</span>
            </button>
          )}
        </div>
      ) : viewMode === 'compact' ? (
        /* COMPACT TABLE VIEW */
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCount === filteredApprovals.length && filteredApprovals.length > 0}
                      onChange={selectAllFiltered}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="px-4 py-3">Asset & Stage</th>
                  <th className="px-4 py-3">Agency</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Governance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApprovals.map((app) => {
                  const isSelected = !!selectedMap[app.id]
                  const isExpanded = !!expandedMap[app.id]
                  const matchedAsset = assets.find((a) => a.id === app.assetId)

                  return (
                    <React.Fragment key={app.id}>
                      <tr className={cn('hover:bg-slate-50/80 transition', isSelected && 'bg-slate-50')}>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(app.id)}
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 text-xs flex items-center gap-2.5">
                            <span>{app.assetName}</span>
                            <span className="font-mono text-[10px] text-slate-400 font-normal">({app.id})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{app.stage}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                            {app.agency || app.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{app.requesterName}</div>
                          <div className="text-[10px] text-slate-400">{app.submittedDate}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              app.priority === 'Urgent'
                                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                                : app.priority === 'High'
                                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {app.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                            <ShieldCheck className="size-3.5" />
                            <span>{app.governanceScore ?? 0}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                              app.status === 'Approved'
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                : app.status === 'Needs Feedback'
                                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                                : app.status === 'Declined'
                                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                                : 'bg-blue-50 border border-blue-200 text-blue-700'
                            )}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`table-review-btn-${app.id}`}
                              onClick={() => toggleExpand(app.id)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                            >
                              {isExpanded ? 'Hide' : 'Review'}
                            </button>
                            {app.status === 'Pending' && (
                              <button
                                id={`table-approve-btn-${app.id}`}
                                onClick={() => approveRequest(app.id)}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 shadow-2xs transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Compact Expanded Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-4 bg-slate-50/60 border-t border-slate-100">
                            <ExpandedDetailsPanel
                              app={app}
                              matchedAsset={matchedAsset}
                              rightsRecords={rightsRecords}
                              canApprove={canApprove}
                              onPreviewDoc={(doc) => setSelectedDocPreview({ doc, approval: app })}
                              onDownloadDoc={(name) => showToast(`Downloading ${name}...`)}
                              onToggleGovernanceCheck={(checkKey) => handleToggleGovernanceCheckInApproval(app, checkKey)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIBRANT CARDS VIEW */
        <div className="grid gap-4">
          {filteredApprovals.map((app) => {
            const isSelected = !!selectedMap[app.id]
            const isExpanded = !!expandedMap[app.id]
            const matchedAsset = assets.find((a) => a.id === app.assetId)
            const matchedRights = rightsRecords.find((r) => r.assetId === app.assetId || r.id === app.assetId)
            const attachedDocs =
              app.documents && app.documents.length > 0
                ? app.documents
                : (matchedRights?.documents || [])

            const progressPct = Math.round((app.currentStep / app.totalSteps) * 100)

            return (
              <div
                key={app.id}
                id={`approval-card-${app.id}`}
                className={cn(
                  'group rounded-xl border bg-white p-5 shadow-xs transition space-y-4 relative overflow-hidden',
                  isExpanded
                    ? 'border-slate-400 ring-1 ring-slate-300 shadow-sm'
                    : isSelected
                    ? 'border-slate-400 bg-slate-50/40'
                    : 'border-slate-200/80 hover:border-slate-300'
                )}
              >
                {/* Priority Accent Line */}
                <div
                  className={cn(
                    'absolute top-0 left-0 right-0 h-1',
                    app.priority === 'Urgent'
                      ? 'bg-rose-500'
                      : app.priority === 'High'
                      ? 'bg-amber-500'
                      : 'bg-slate-300'
                  )}
                />

                {/* Main Card Layout */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Side: Checkbox + Visual Thumbnail + Asset Core Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Batch Checkbox */}
                    <div className="pt-1.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(app.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
                        title="Select for batch clearance"
                      />
                    </div>

                    {/* Visual Media Thumbnail or Category Badge */}
                    <div
                      onClick={() => toggleExpand(app.id)}
                      className="relative shrink-0 cursor-pointer"
                      title="Click to toggle review details"
                    >
                      {matchedAsset?.posterUrl ? (
                        <div className="size-16 sm:size-18 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group-hover:scale-102 transition-transform">
                          <img
                            src={matchedAsset.posterUrl}
                            alt={app.assetName}
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="size-16 sm:size-18 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-2 text-center shadow-2xs">
                          <CategoryVisualBadge category={app.category} />
                          <span className="text-[9px] font-semibold text-slate-500 uppercase mt-1 line-clamp-1">
                            {app.category.split(' ')[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1">
                        <span
                          className={cn(
                            'flex size-3.5 items-center justify-center rounded-full ring-2 ring-white',
                            app.status === 'Approved'
                              ? 'bg-emerald-500'
                              : app.status === 'Needs Feedback'
                              ? 'bg-amber-500'
                              : 'bg-slate-900'
                          )}
                        />
                      </div>
                    </div>

                    {/* Metadata & Title Block */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3
                          onClick={() => toggleExpand(app.id)}
                          className="font-semibold text-slate-900 text-base tracking-tight truncate max-w-md cursor-pointer hover:text-slate-700 transition mr-1.5"
                        >
                          {app.assetName}
                        </h3>
                        <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          {app.id}
                        </span>
                        <span className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                          {app.agency || app.unit}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1',
                            app.priority === 'Urgent'
                              ? 'bg-rose-50 border border-rose-200 text-rose-700'
                              : app.priority === 'High'
                              ? 'bg-amber-50 border border-amber-200 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          )}
                        >
                          {app.priority === 'Urgent' && <Flame className="size-3" />}
                          {app.priority} Priority
                        </span>
                      </div>

                      {/* Category & Stage info */}
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="font-medium text-slate-700">
                          {app.category} • {app.subcategory}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          Stage: <b className="text-slate-900 font-semibold">{app.stage}</b>
                        </span>
                      </div>

                      {/* Requester & Submission Time */}
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="flex items-center gap-1">
                          <User className="size-3 text-slate-400" />
                          <span>Submitted by <b className="text-slate-700">{app.requesterName}</b> ({app.requesterRole})</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="size-3" />
                          <span>{app.submittedDate} at {app.submittedTime}</span>
                        </span>
                      </div>

                      {/* Revision/Feedback callout if present */}
                      {app.feedbackNotes && (
                        <div className="mt-2 rounded-lg bg-amber-50/80 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2.5 animate-in fade-in">
                          <MessageSquare className="size-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Required Revision Notes: </span>
                            <span className="text-amber-800">{app.feedbackNotes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Stepper + Governance Ring + Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
                    {/* Stepper Progress & Governance Score */}
                    <div className="flex items-center gap-3">
                      {/* Governance Score Badge */}
                      <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        <span>{app.governanceScore ?? 0}% Score</span>
                      </div>

                      {/* Multi-Step Pipeline Indicator */}
                      <div className="rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-1 text-right">
                        <div className="text-[9px] font-semibold text-slate-400 uppercase">Review Progress</div>
                        <div className="text-xs font-semibold text-slate-800">
                          Step {app.currentStep} of {app.totalSteps}
                          <span className="text-[10px] text-slate-600 font-medium ml-1">({progressPct}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* View Details / Expand Button */}
                      <button
                        id={`btn-expand-${app.id}`}
                        onClick={() => toggleExpand(app.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-2xs cursor-pointer',
                          isExpanded
                            ? 'border-slate-300 bg-slate-100 text-slate-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Eye className="size-3.5 text-slate-600" />
                        <span>{isExpanded ? 'Hide Workspace' : `Inspect & Verify (${attachedDocs.length})`}</span>
                        <ChevronDown className={cn('size-3.5 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>

                      {app.status === 'Pending' || app.status === 'Needs Feedback' ? (
                        <>
                          {/* Approve & Clear Button */}
                          <button
                            id={`btn-sign-${app.id}`}
                            onClick={() => {
                              setSelectedApproval(app)
                              setActionType('approveNote')
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition active:scale-98 cursor-pointer"
                            title="Sign-off and mark cleared"
                          >
                            <Check className="size-3.5" strokeWidth={2.5} />
                            <span>Sign & Clear</span>
                          </button>

                          {/* Request Feedback Button */}
                          <button
                            id={`btn-revisions-${app.id}`}
                            onClick={() => {
                              setSelectedApproval(app)
                              setActionType('feedback')
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 transition cursor-pointer"
                            title="Request modifications from creator"
                          >
                            <MessageSquare className="size-3.5 text-amber-600" />
                            <span>Revisions</span>
                          </button>

                          {/* Decline Button */}
                          <button
                            id={`btn-decline-${app.id}`}
                            onClick={() => {
                              setSelectedApproval(app)
                              setActionType('decline')
                            }}
                            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
                            title="Decline submission"
                          >
                            Decline
                          </button>
                        </>
                      ) : app.status === 'Approved' ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          <span>Cleared & Sealed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-800">
                          <X className="size-4 text-rose-600" />
                          <span>Declined</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* EXPANDED REVIEW WORKSPACE DRAWER */}
                {isExpanded && (
                  <div className="border-t border-slate-100 pt-5 space-y-5 animate-in fade-in duration-200">
                    <ExpandedDetailsPanel
                      app={app}
                      matchedAsset={matchedAsset}
                      rightsRecords={rightsRecords}
                      canApprove={canApprove}
                      onPreviewDoc={(doc) => setSelectedDocPreview({ doc, approval: app })}
                      onDownloadDoc={(name) => showToast(`Downloading ${name}...`)}
                      onToggleGovernanceCheck={(checkKey) => handleToggleGovernanceCheckInApproval(app, checkKey)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 5. CERTIFIED DOCUMENT PREVIEW MODAL */}
      {selectedDocPreview && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDocPreview(null)
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 p-6 sm:p-7 shadow-2xl text-xs max-h-[90vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-[#03152c] p-2 flex items-center justify-center border border-slate-700 shadow-sm">
                  <img src="/lovetoons-logo.png" alt="Lovetoons" className="h-6 w-auto object-contain" />
                </div>
                <div>
                  <h3 className="font-black text-[#09245a] dark:text-white text-base">{selectedDocPreview.doc.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Official Chain of Title & Statutory Governance Register
                  </p>
                </div>
              </div>
              <button
                id="close-doc-preview-btn"
                onClick={() => setSelectedDocPreview(null)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Document Certificate Meta */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-slate-800/50 p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">File Format</span>
                  <span className="font-black text-indigo-700 dark:text-indigo-400 uppercase">{selectedDocPreview.doc.type} Master</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">File Size</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDocPreview.doc.size}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Filing Timestamp</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDocPreview.doc.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Integrity Stamp</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> SHA-256 Valid
                  </span>
                </div>
              </div>

              {/* Simulated Legal Document Body */}
              <div className="border-t border-slate-200 dark:border-white/10 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white text-xs">Chain of Title & Legal Governance Summary</span>
                  <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/40 font-bold px-2 py-0.5 text-[10px]">
                    KMM Certified Record
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs leading-relaxed space-y-2 font-mono">
                  <p>
                    <b className="text-slate-900 dark:text-white">Document ID:</b> {selectedDocPreview.doc.id}
                  </p>
                  <p>
                    <b className="text-slate-900 dark:text-white">Target Asset:</b> {selectedDocPreview.approval.assetName} <span className="text-slate-500 dark:text-slate-400 font-normal ml-1.5">({selectedDocPreview.approval.category} • {selectedDocPreview.approval.id})</span>
                  </p>
                  <p>
                    <b className="text-slate-900 dark:text-white">Producing Agency:</b> {selectedDocPreview.approval.agency || selectedDocPreview.approval.unit}
                  </p>
                  <p>
                    <b className="text-slate-900 dark:text-white">Submitting Officer:</b> {selectedDocPreview.approval.requesterName} ({selectedDocPreview.approval.requesterRole})
                  </p>
                  <p className="border-t border-slate-100 dark:border-white/10 pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    This certified schedule certifies that all musical stems, voice-over talent releases, script adaptation agreements, and statutory trademark protections conform with Kiddies Media Ministries broadcast policies.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                onClick={() => showToast(`Document "${selectedDocPreview.doc.name}" downloaded.`)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs transition cursor-pointer"
              >
                <Download className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Download Document</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocPreview(null)}
                  className="rounded-xl border border-slate-200 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 text-xs transition cursor-pointer"
                >
                  Close
                </button>
                {selectedDocPreview.approval.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      approveRequest(selectedDocPreview.approval.id, 'Verified via Document Inspection')
                      setSelectedDocPreview(null)
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 font-bold text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm text-xs transition cursor-pointer"
                  >
                    <Check className="size-3.5" />
                    <span>Verify & Approve Asset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ACTION MODALS: APPROVE NOTE / FEEDBACK / DECLINE */}
      {selectedApproval && actionType && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedApproval(null)
              setActionType(null)
            }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 p-6 sm:p-7 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                {actionType === 'approveNote' ? (
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:border dark:border-emerald-800/40 dark:text-emerald-300">
                    <CheckCircle2 className="size-5" />
                  </div>
                ) : actionType === 'feedback' ? (
                  <div className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:border dark:border-amber-800/40 dark:text-amber-300">
                    <MessageSquare className="size-5" />
                  </div>
                ) : (
                  <div className="grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:border dark:border-rose-800/40 dark:text-rose-300">
                    <AlertTriangle className="size-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-black text-[#09245a] dark:text-white text-sm sm:text-base">
                    {actionType === 'approveNote'
                      ? 'Issue Broadcast Clearance & Seal'
                      : actionType === 'feedback'
                      ? 'Request Creator Revisions'
                      : 'Decline Asset Clearance'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {selectedApproval.assetName}
                    <span className="font-mono text-slate-400 dark:text-slate-500 ml-1.5">({selectedApproval.id})</span>
                    <span className="mx-1.5">•</span>
                    {selectedApproval.agency || selectedApproval.unit}
                  </p>
                </div>
              </div>
              <button
                id="close-action-modal-btn"
                onClick={() => {
                  setSelectedApproval(null)
                  setActionType(null)
                }}
                className="grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3.5">
              {actionType === 'approveNote' ? (
                <>
                  <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-200 p-3.5 text-xs text-emerald-900 leading-relaxed">
                    <span className="font-black block mb-1 flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
                      Sign-Off Certification Notice
                    </span>
                    Approving will issue an official broadcast certificate, update asset status to <b>Approved</b>, and notify the production team that this asset is cleared for airing.
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Reviewer Sign-off Notes (Optional):
                    </label>
                    <textarea
                      id="approve-note-textarea"
                      rows={3}
                      value={approveNote}
                      onChange={(e) => setApproveNote(e.target.value)}
                      placeholder="e.g. Doctrinal review passed. Master files verified. Cleared for worldwide distribution."
                      className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white p-3 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </>
              ) : actionType === 'feedback' ? (
                <>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">
                    Select quick revision reasons or enter specific instructions for the creator to address before re-submitting:
                  </p>

                  {/* Quick Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Suggested Fast Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {REVISION_QUICK_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (feedbackInput) {
                              setFeedbackInput((prev) => `${prev}; ${tag}`)
                            } else {
                              setFeedbackInput(tag)
                            }
                          }}
                          className="rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-800 transition cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Detailed Revision Feedback:
                    </label>
                    <textarea
                      id="feedback-input-textarea"
                      rows={4}
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Specify required corrections, legal documents, or audio/video fixes..."
                      className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white p-3 text-xs outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/40 dark:text-rose-200 p-3.5 text-xs text-rose-900 leading-relaxed">
                    <span className="font-black block mb-1 flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                      <AlertTriangle className="size-4" />
                      Decline Clearance Notice
                    </span>
                    Declining will flag this asset as <b>Requires Attention</b> and log this action in the governance audit trail. A reason must be provided.
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Reason for Declining Clearance:
                    </label>
                    <textarea
                      id="decline-reason-textarea"
                      rows={3}
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="e.g. Unresolved copyright infringement or does not conform to ministry doctrine."
                      className="w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white p-3 text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  id="cancel-action-modal-btn"
                  onClick={() => {
                    setSelectedApproval(null)
                    setActionType(null)
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="submit-action-modal-btn"
                  onClick={() => {
                    if (actionType === 'approveNote') {
                      approveRequest(selectedApproval.id, approveNote || 'Clearance and doctrinal review passed successfully.')
                    } else if (actionType === 'feedback') {
                      requestFeedback(selectedApproval.id, feedbackInput || 'Please revise and resubmit with updated documents.')
                    } else {
                      declineRequest(selectedApproval.id, declineReason || 'Does not meet ministry broadcast governance standards.')
                    }
                    setSelectedApproval(null)
                    setActionType(null)
                    setApproveNote('')
                    setFeedbackInput('')
                    setDeclineReason('')
                  }}
                  className={cn(
                    'rounded-lg px-5 py-2 font-medium text-white shadow-xs transition cursor-pointer',
                    actionType === 'approveNote'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : actionType === 'feedback'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  )}
                >
                  {actionType === 'approveNote'
                    ? 'Confirm & Seal Clearance'
                    : actionType === 'feedback'
                    ? 'Send Revision Request'
                    : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// EXPANDED REVIEW DETAILS PANEL COMPONENT
// -------------------------------------------------------------
interface ExpandedDetailsPanelProps {
  app: ApprovalRequest
  matchedAsset?: any
  rightsRecords: any[]
  canApprove?: boolean
  onPreviewDoc: (doc: RightsDocument) => void
  onDownloadDoc: (name: string) => void
  onToggleGovernanceCheck?: (checkKey: string) => void
}

function ExpandedDetailsPanel({
  app,
  matchedAsset,
  rightsRecords,
  canApprove = false,
  onPreviewDoc,
  onDownloadDoc,
  onToggleGovernanceCheck,
}: ExpandedDetailsPanelProps) {
  const matchedRights = rightsRecords.find((r) => r.assetId === app.assetId || r.id === app.assetId)
  const attachedDocs: RightsDocument[] =
    app.documents && app.documents.length > 0
      ? app.documents
      : (matchedRights?.documents || [])

  // Live Governance Checks & Score
  const currentChecks: Record<string, boolean> = {
    ...((matchedRights?.governanceChecks as Record<string, boolean>) || {}),
    ...((app.governanceChecks as Record<string, boolean>) || {}),
  }
  const verifiedCount = GOVERNANCE_GATES.filter((g) => !!currentChecks[g.key]).length
  const effectiveScore = app.governanceScore ?? matchedRights?.governanceScore ?? (verifiedCount * 20)

  return (
    <div className="space-y-4">
      {/* 1. Attached Legal Documents Grid */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-slate-700" />
            <h4 className="font-semibold text-slate-900 text-xs">
              Attached Legal & Title Chain Documents ({attachedDocs.length})
            </h4>
          </div>
          <span className={cn(
            'text-[10px] font-semibold rounded-full px-2.5 py-0.5 border flex items-center gap-1',
            attachedDocs.length > 0
              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
              : 'text-amber-800 bg-amber-50 border-amber-200'
          )}>
            <ShieldCheck className="size-3" />
            {attachedDocs.length > 0 ? 'Documents on File' : 'Awaiting Rep Upload'}
          </span>
        </div>

        {attachedDocs.length > 0 ? (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {attachedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'grid size-8 place-items-center rounded-lg font-semibold text-[9px] shrink-0',
                      doc.type === 'CERT'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : doc.type === 'DOCX'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    )}
                  >
                    {doc.type}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 text-xs truncate max-w-[170px]" title={doc.name}>
                      {doc.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {doc.size} • {doc.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onPreviewDoc(doc)}
                    className="size-7 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 grid place-items-center transition cursor-pointer"
                    title="Preview Document"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDownloadDoc(doc.name)}
                    className="size-7 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 grid place-items-center transition cursor-pointer"
                    title="Download Copy"
                  >
                    <Download className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-4 text-center text-xs text-amber-800 space-y-1">
            <FileText className="size-5 text-amber-600 mx-auto" />
            <span className="font-semibold block">No Legal Documents Attached Yet</span>
            <span className="text-[11px] text-amber-700 block">
              Agency representative must attach executed talent releases, script clearances, and sync licenses before review clearance.
            </span>
          </div>
        )}
      </div>

      {/* 2. Rights Scope & Territorial Clearance Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Rights Scope</span>
          <div className="font-semibold text-slate-900 text-xs">
            {app.rightsType || matchedRights?.rightsType || 'Worldwide Broadcast & Distribution'}
          </div>
          <div className="text-[10px] text-slate-500">
            {app.exclusivity || matchedRights?.exclusivity || 'Exclusive Ministry Rights'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Territory & Term</span>
          <div className="font-semibold text-slate-900 text-xs flex items-center gap-1">
            <Globe2 className="size-3.5 text-slate-600" />
            <span>{app.territory || matchedRights?.territory || 'Worldwide'}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Term: {app.term || matchedRights?.term || '10 Years (2025 - 2035)'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Licensing Structure</span>
          <div className="font-semibold text-slate-900 text-xs">
            {app.licenceType || matchedRights?.licenceType || 'Proprietary Broadcast License'}
          </div>
          <div className="text-[10px] text-slate-500">
            {app.royaltyTerms || matchedRights?.royaltyTerms || '100% Retained Ministry Asset'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Governance Score</span>
          <div className={cn(
            'font-semibold text-sm flex items-center gap-1',
            effectiveScore === 100 ? 'text-emerald-700' : 'text-slate-900'
          )}>
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>{effectiveScore}% Certified</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {verifiedCount === 5 ? 'All Checks Cleared ✓' : `${5 - verifiedCount} Checks Pending Clearance`}
          </div>
        </div>
      </div>

      {/* 3. Reviewer Governance Checklist Status */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider block">
              Reviewer Governance Checklist Verification
            </span>
            <span className="text-[10px] text-slate-500">
              {canApprove ? 'Reviewer sign-off: click any check to verify or update compliance.' : 'Current compliance gates verified by agency representative.'}
            </span>
          </div>
          <span className={cn(
            'text-[10px] font-semibold px-2.5 py-0.5 rounded-full border',
            verifiedCount === 5
              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
              : 'text-amber-800 bg-amber-50 border-amber-200'
          )}>
            {verifiedCount} of 5 Checks Passed
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {GOVERNANCE_GATES.map((gate) => {
            const isChecked = !!currentChecks[gate.key]
            return (
              <button
                key={gate.key}
                type="button"
                disabled={!canApprove}
                onClick={() => onToggleGovernanceCheck?.(gate.key)}
                className={cn(
                  'flex items-start gap-2.5 rounded-lg p-2.5 border text-left transition',
                  canApprove ? 'cursor-pointer hover:border-slate-400' : 'cursor-default',
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                )}
                title={canApprove ? 'Click to toggle verification status' : undefined}
              >
                {isChecked ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="size-4 text-slate-300 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-800 block text-[11px]">{gate.title}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{gate.desc}</span>
                  <span className={cn(
                    'text-[9px] font-semibold mt-1 block',
                    isChecked ? 'text-emerald-700' : 'text-slate-400'
                  )}>
                    {isChecked ? 'Verified ✓' : canApprove ? 'Click to Verify' : 'Pending Verification'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Submission Notes & Step Timeline */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 text-xs bg-slate-50/90 p-4 rounded-xl border border-slate-200/70">
        <div className="space-y-1 flex-1">
          <div className="font-semibold text-slate-800">Submission Description & Production Notes:</div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {app.description ||
              matchedRights?.description ||
              'Full asset master files, legal releases, and chain of title certificates uploaded for reviewer sign-off.'}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-semibold text-slate-400 uppercase block">Governance Workflow</span>
          <span className="font-semibold text-slate-900 text-xs">Stage {app.currentStep} of {app.totalSteps} Completed</span>
        </div>
      </div>

      {/* 5. Audit History Trail */}
      {app.history && app.history.length > 0 && (
        <div className="rounded-xl border border-slate-200/70 bg-white p-4 space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Approval Audit Trail ({app.history.length})
          </span>
          <div className="space-y-2">
            {app.history.map((hist, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[11px] border-l-2 border-slate-300 pl-3 py-0.5">
                <div className="size-1.5 rounded-full bg-slate-900 mt-1.5 -ml-[16px] ring-2 ring-white" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{hist.stage}</span>
                    <span className="text-slate-400 text-[10px]">• {hist.date}</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    by {hist.author} ({hist.authorRole})
                  </div>
                  {hist.notes && (
                    <div className="text-slate-700 bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
                      "{hist.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
