'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Building2,
  Layers,
  FileText,
  ExternalLink,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Edit3,
  Download,
  Send,
  Eye,
  Check,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { useLovetoonsData } from '@/lib/store/DataContext'
import type { MinistryOnboardingRequest, OnboardingStatus } from '@/types'
import { ConfirmActionModal } from '@/components/ConfirmActionModal'

interface MinistryWaitlistManagerProps {
  className?: string
}

const STATUS_CONFIG: Record<
  OnboardingStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: 'Pending Review',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  contacted: {
    label: 'Contacted',
    badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    dot: 'bg-sky-500',
  },
  reviewed: {
    label: 'Under Review',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    dot: 'bg-purple-500',
  },
  approved: {
    label: 'Approved & Onboarded',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  declined: {
    label: 'Declined / Inactive',
    badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400',
  },
}

export function MinistryWaitlistManager({ className = '' }: MinistryWaitlistManagerProps) {
  const {
    onboardingRequests,
    pendingOnboardingCount,
    updateOnboardingRequest,
    deleteOnboardingRequest,
    approveAndRegisterMinistry,
    currentUser,
    showToast,
  } = useLovetoonsData()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OnboardingStatus>('all')
  const [selectedRequest, setSelectedRequest] = useState<MinistryOnboardingRequest | null>(null)
  const [adminNotesInput, setAdminNotesInput] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  // Confirm delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // KPI Calculations
  const stats = useMemo(() => {
    const total = onboardingRequests.length
    const pending = onboardingRequests.filter((r) => r.status === 'pending').length
    const contacted = onboardingRequests.filter((r) => r.status === 'contacted').length
    const reviewed = onboardingRequests.filter((r) => r.status === 'reviewed').length
    const approved = onboardingRequests.filter((r) => r.status === 'approved').length
    return { total, pending, contacted, reviewed, approved }
  }, [onboardingRequests])

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return onboardingRequests.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        const match =
          item.ministryName.toLowerCase().includes(q) ||
          (item.departmentName && item.departmentName.toLowerCase().includes(q)) ||
          item.contactPerson.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          (item.zoneRegion && item.zoneRegion.toLowerCase().includes(q)) ||
          (item.categoryInterest && item.categoryInterest.toLowerCase().includes(q)) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [onboardingRequests, statusFilter, search])

  const openDetailsModal = (req: MinistryOnboardingRequest) => {
    setSelectedRequest(req)
    setAdminNotesInput(req.adminNotes || '')
  }

  const handleStatusChange = async (id: string, newStatus: OnboardingStatus) => {
    await updateOnboardingRequest(id, { status: newStatus })
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedRequest) return
    setIsSavingNotes(true)
    await updateOnboardingRequest(selectedRequest.id, { adminNotes: adminNotesInput.trim() })
    setSelectedRequest((prev) => (prev ? { ...prev, adminNotes: adminNotesInput.trim() } : null))
    setIsSavingNotes(false)
    showToast('Admin notes saved successfully.')
  }

  const handleApproveAndRegister = async (requestId: string) => {
    setIsRegistering(true)
    const result = await approveAndRegisterMinistry(requestId)
    setIsRegistering(false)
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'approved',
              adminNotes: 'Registered into active ministries architecture.',
            }
          : null
      )
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    await deleteOnboardingRequest(deleteTargetId)
    if (selectedRequest?.id === deleteTargetId) {
      setSelectedRequest(null)
    }
    setDeleteTargetId(null)
  }

  const handleExportCSV = () => {
    if (filteredRequests.length === 0) {
      showToast('No waitlist requests to export.')
      return
    }

    const headers = [
      'ID',
      'Ministry Name',
      'Department Name',
      'Contact Person',
      'Email',
      'Phone',
      'Zone/Region',
      'Category Interest',
      'Estimated Assets',
      'Intended Usage',
      'Status',
      'Submitted At',
      'Admin Notes',
    ]

    const rows = filteredRequests.map((r) => [
      `"${r.id}"`,
      `"${(r.ministryName || '').replace(/"/g, '""')}"`,
      `"${(r.departmentName || '').replace(/"/g, '""')}"`,
      `"${(r.contactPerson || '').replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone || ''}"`,
      `"${(r.zoneRegion || '').replace(/"/g, '""')}"`,
      `"${(r.categoryInterest || '').replace(/"/g, '""')}"`,
      `"${(r.estimatedAssetsCount || '').replace(/"/g, '""')}"`,
      `"${(r.intendedUsage || '').replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.submittedAt}"`,
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `kmm_ministry_waitlist_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported waitlist to CSV.')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ministry & Department Onboarding Waitlist
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
              <ShieldCheck className="size-3 text-purple-600 dark:text-purple-400" />
              <span>Super Admin Exclusive</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review incoming expressions of interest from church zones and media departments wishing to join the KMM ecosystem and syndicate on Lovetoons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Inquiries</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Departments on waitlist</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Pending Review</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{stats.pending}</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400/80 font-medium">Awaiting action</div>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">Contacted & Active</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-0.5">{stats.contacted + stats.reviewed}</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400/80 font-medium">In consultation</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Approved Ministries</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.approved}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 font-medium">Accredited to portal</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'pending', label: 'Pending', count: stats.pending },
            { id: 'contacted', label: 'Contacted', count: stats.contacted },
            { id: 'reviewed', label: 'Under Review', count: stats.reviewed },
            { id: 'approved', label: 'Approved', count: stats.approved },
          ].map((pill) => {
            const isActive = statusFilter === pill.id
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setStatusFilter(pill.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`size-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive
                      ? 'bg-white/20 text-white dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px] sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ministry, contact, email..."
            className="w-full pl-9 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-amber-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs p-1"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Table / List View */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-12 text-center space-y-3 bg-white/50 dark:bg-slate-900/40">
          <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="size-6" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">No onboarding requests found</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {search || statusFilter !== 'all'
              ? 'No requests match the active filter or search criteria.'
              : 'New departments and ministries submitting the onboarding form will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Ministry & Department</th>
                  <th className="py-3 px-4">Lead Contact</th>
                  <th className="py-3 px-4">Focus & Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredRequests.map((req) => {
                  const statusInfo = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => openDetailsModal(req)}
                    >
                      {/* Ministry Name & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                          {req.ministryName}
                        </div>
                        {req.departmentName && (
                          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {req.departmentName}
                          </div>
                        )}
                        {req.zoneRegion && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="size-2.5 shrink-0" />
                            <span className="truncate max-w-[180px]">{req.zoneRegion}</span>
                          </div>
                        )}
                      </td>

                      {/* Lead Contact Info */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {req.contactPerson}
                        </div>
                        <a
                          href={`mailto:${req.email}`}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="size-2.5" />
                          <span className="truncate max-w-[160px]">{req.email}</span>
                        </a>
                        {req.phone && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="size-2.5" />
                            <span>{req.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Focus & Scope */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-1">
                          {req.categoryInterest || 'Media & Ministry'}
                        </span>
                        {req.estimatedAssetsCount && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {req.estimatedAssetsCount}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-current/20 shadow-2xs">
                          <span className={`size-1.5 rounded-full ${statusInfo.dot}`} />
                          <span className={statusInfo.badge.split(' ')[1]}>{statusInfo.label}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(req.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetailsModal(req)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Review Details"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          {req.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleApproveAndRegister(req.id)}
                              disabled={isRegistering}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/30 transition cursor-pointer"
                              title="Approve and register to architecture"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(req.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED APPLICATION REVIEW MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase mb-2">
                  <span>ID:</span>
                  <span>{selectedRequest.id}</span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
                >
                  {selectedRequest.ministryName}
                </h3>
                {selectedRequest.departmentName && (
                  <p className="text-xs font-semibold text-amber-500 mt-0.5">
                    {selectedRequest.departmentName}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Submission Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Officer</span>
                <div className="font-bold text-slate-900 dark:text-white">{selectedRequest.contactPerson}</div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 pt-0.5">
                  <Mail className="size-3 text-amber-500" />
                  <a href={`mailto:${selectedRequest.email}`} className="hover:underline">
                    {selectedRequest.email}
                  </a>
                </div>
                {selectedRequest.phone && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Phone className="size-3 text-emerald-500" />
                    <a href={`tel:${selectedRequest.phone}`} className="hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jurisdiction & Media</span>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedRequest.zoneRegion || 'Global / Unspecified'}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Focus: <strong>{selectedRequest.categoryInterest || 'Media'}</strong>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Readiness: {selectedRequest.estimatedAssetsCount || 'In preparation'}
                </div>
              </div>
            </div>

            {/* Intended Collaboration & Goal */}
            {selectedRequest.intendedUsage && (
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                  Stated Collaboration Goal
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedRequest.intendedUsage}
                </p>
              </div>
            )}

            {/* Submitter Notes */}
            {selectedRequest.notes && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Submitted Overview / Message
                </span>
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedRequest.notes}
                </div>
              </div>
            )}

            {/* Super Admin Status Changer */}
            <div className="space-y-2 border-t border-slate-100 dark:border-white/10 pt-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Update Application Status
              </span>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'contacted', 'reviewed', 'approved', 'declined'] as OnboardingStatus[]).map((st) => {
                  const info = STATUS_CONFIG[st]
                  const isCurrent = selectedRequest.status === st
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedRequest.id, st)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:text-slate-950 dark:border-amber-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${info.dot}`} />
                      <span>{info.label}</span>
                      {isCurrent && <Check className="size-3 stroke-[2.5]" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Internal Super Admin Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Internal Secretariat & Admin Notes
              </label>
              <textarea
                rows={3}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Log internal follow-up notes, phone calls, or approval rationale..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500 transition-all resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSavingNotes ? 'Saving...' : 'Save Admin Notes'}
                </button>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-slate-100 dark:border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(selectedRequest.id)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 transition"
              >
                Delete from Waitlist
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>

                {selectedRequest.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleApproveAndRegister(selectedRequest.id)}
                    disabled={isRegistering}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Approve & Register to Architecture</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove from Onboarding Waitlist"
        description="Are you sure you want to remove this ministry expression of interest? This action cannot be undone."
        confirmLabel="Remove Application"
        variant="danger"
        badge="Permanent Action"
      />
    </div>
  )
}

