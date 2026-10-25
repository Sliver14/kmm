'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Crown,
  BadgeCheck,
  Globe2,
  Clapperboard,
  Music,
  Sparkles,
  AlertTriangle,
  Check,
  Send,
  FileText,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Trash2,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AssetData,
  RightsRecord,
  RightsDocument,
  GovernancePillarKey,
  GovernancePillarUpdatePayload,
  ContentProvenance,
} from '@/types'
import { useLovetoonsData } from '@/lib/store/DataContext'

export interface GovernancePillarModalProps {
  isOpen: boolean
  onClose: () => void
  asset: AssetData | RightsRecord
  activePillar: GovernancePillarKey | null
  onSaveSuccess?: (pillar: GovernancePillarKey, payload: GovernancePillarUpdatePayload) => void
}

export function GovernancePillarModal({
  isOpen,
  onClose,
  asset,
  activePillar,
  onSaveSuccess,
}: GovernancePillarModalProps) {
  const { updateAssetGovernancePillar, showToast } = useLovetoonsData()

  // Form State initialized from asset
  const [owner, setOwner] = useState('')
  const [ownerCertificateRef, setOwnerCertificateRef] = useState('')
  const [trademarkStatus, setTrademarkStatus] = useState<'Registered' | 'Pending Filing' | 'In Progress' | 'Unregistered'>('Unregistered')
  const [distributionLicense, setDistributionLicense] = useState('None')
  const [productionLicensees, setProductionLicensees] = useState('None')
  const [territory, setTerritory] = useState('None')
  const [territoryClearanceStatus, setTerritoryClearanceStatus] = useState<
    'Cleared Global' | 'Cleared Regional' | 'Pending Clearance' | 'Restricted' | 'Unassigned' | 'None'
  >('Pending Clearance')
  const [contentProvenance, setContentProvenance] = useState<ContentProvenance>('Fully Custom')
  const [songWriter, setSongWriter] = useState('')
  const [songWriterProvenance, setSongWriterProvenance] = useState<ContentProvenance>('Fully Custom')
  const [justificationNotes, setJustificationNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Document Attachment State (PDF, DOC, DOCX)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [docName, setDocName] = useState('')
  const [docSize, setDocSize] = useState('')
  const [docType, setDocType] = useState('PDF')
  const [docNotes, setDocNotes] = useState('')

  // Reset or populate fields whenever activePillar or asset changes
  useEffect(() => {
    if (!asset || !isOpen) return

    const attrs = (asset as any).attributes || {}
    setOwner(asset.owner || (asset as any).rightsHolder || attrs.owner || attrs.rightsHolder || '')
    setOwnerCertificateRef(asset.ownerCertificateRef || attrs.ownerCertificateRef || '')
    setTrademarkStatus((asset.trademarkStatus as any) || attrs.trademarkStatus || 'Unregistered')
    setDistributionLicense(asset.distributionLicense || attrs.distributionLicense || 'None')
    setProductionLicensees(asset.productionLicensees || attrs.productionLicensees || 'None')
    setTerritory(asset.territory || attrs.territory || 'None')
    setTerritoryClearanceStatus((asset.territoryClearanceStatus as any) || attrs.territoryClearanceStatus || 'Pending Clearance')
    setContentProvenance(asset.contentProvenance || attrs.contentProvenance || 'Fully Custom')
    setSongWriter(asset.songWriter || attrs.songWriter || '')
    setSongWriterProvenance(asset.songWriterProvenance || attrs.songWriterProvenance || 'Fully Custom')
    setJustificationNotes('')
    setAttachedFile(null)
    setDocName('')
    setDocSize('')
    setDocType('PDF')
    setDocNotes('')
  }, [asset, activePillar, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
      setDocName(file.name)
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setDocSize(`${sizeMb} MB`)
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF'
      setDocType(ext === 'DOC' || ext === 'DOCX' ? ext : 'PDF')
    }
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
    setDocName('')
    setDocSize('')
    setDocType('PDF')
    setDocNotes('')
  }

  if (!isOpen || !activePillar) return null

  const isAudioCategory =
    (asset.category || '').toLowerCase().includes('audio') ||
    (asset.category || '').toLowerCase().includes('music') ||
    (asset.category || '').toLowerCase().includes('song')

  const isVideoCategory =
    (asset.category || '').toLowerCase().includes('tv') ||
    (asset.category || '').toLowerCase().includes('video') ||
    (asset.category || '').toLowerCase().includes('animation') ||
    (asset.category || '').toLowerCase().includes('film')

  // Pillar Titles and Icons
  const pillarMeta: Record<
    GovernancePillarKey,
    {
      title: string
      badge: string
      color: string
      badgeBg: string
      icon: React.ReactNode
      description: string
    }
  > = {
    legal_owner: {
      title: '1. Assign Legal Ownership & Title Deed',
      badge: 'Ownership Title',
      color: 'text-amber-500',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
      icon: <Crown className="size-4 text-amber-500" />,
      description: 'Update ministerial title holder and certified legal deed filing reference.',
    },
    trademark_license: {
      title: '2. Trademark & Distribution Licensing',
      badge: 'IP Protection',
      color: 'text-purple-500',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
      icon: <BadgeCheck className="size-4 text-purple-500" />,
      description: 'Define official trademark registration status and universal distribution terms.',
    },
    territory: {
      title: '3. Territory Scope & Clearance',
      badge: 'Territory Rights',
      color: 'text-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
      icon: <Globe2 className="size-4 text-amber-500" />,
      description: 'Configure authorized global or regional clearance territories for this asset.',
    },
    production_rights: {
      title: '4. Broadcast & Production Rights',
      badge: 'Production & Broadcast',
      color: 'text-indigo-500',
      badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300',
      icon: <Clapperboard className="size-4 text-indigo-500" />,
      description: 'Authorize licensed production studios, broadcast networks, and publishing entities.',
    },
    ai_provenance: {
      title: '5. AI Content & Provenance Classification',
      badge: 'Provenance Matrix',
      color: 'text-cyan-500',
      badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300',
      icon: <Sparkles className="size-4 text-cyan-500" />,
      description: 'Declare AI generation attribution, authorial integrity, and composer provenance.',
    },
  }

  const currentMeta = pillarMeta[activePillar]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload: GovernancePillarUpdatePayload = {}

    if (activePillar === 'legal_owner') {
      payload.owner = owner.trim() || 'Unassigned'
      payload.ownerCertificateRef = ownerCertificateRef.trim()
      payload.justification = justificationNotes.trim()
    } else if (activePillar === 'trademark_license') {
      payload.trademarkStatus = trademarkStatus
      payload.distributionLicense = distributionLicense.trim()
      payload.justification = justificationNotes.trim()
    } else if (activePillar === 'territory') {
      payload.territory = territory.trim()
      payload.territoryClearanceStatus = territoryClearanceStatus
      payload.justification = justificationNotes.trim()
    } else if (activePillar === 'production_rights') {
      payload.productionLicensees = productionLicensees.trim()
      payload.justification = justificationNotes.trim()
    } else if (activePillar === 'ai_provenance') {
      payload.contentProvenance = contentProvenance
      payload.songWriter = songWriter.trim()
      payload.songWriterProvenance = songWriterProvenance
      payload.justification = justificationNotes.trim()
    }

    // Attach Document Evidence if selected (only for legal, trademark, territory, and production pillars)
    if (activePillar !== 'ai_provenance' && (attachedFile || docName.trim())) {
      const targetDocName = docName.trim() || `${currentMeta.badge.replace(/\s+/g, '_')}_${asset.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      const newDoc: RightsDocument = {
        id: `doc-${Date.now()}`,
        name: targetDocName,
        size: docSize || '1.8 MB',
        date: 'Just now',
        type: docType,
        targetScope: 'asset',
        pillarKey: activePillar,
        notes: docNotes.trim() || `Supporting document uploaded for ${currentMeta.title}`,
      }
      payload.document = newDoc
    }

    try {
      const assetId = (asset as any).assetId || asset.id
      await updateAssetGovernancePillar(assetId, activePillar, payload, justificationNotes.trim())
      if (onSaveSuccess) {
        onSaveSuccess(activePillar, payload)
      }
      onClose()
    } catch (err: any) {
      console.error('Failed to submit pillar update:', err)
      showToast(err?.message || 'Failed to submit pillar for approval.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
    >
      <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-[#1c202c] p-6 shadow-2xl text-xs max-h-[92vh] overflow-y-auto cursor-default">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
              {currentMeta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentMeta.title}
                </h3>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider',
                    currentMeta.badgeBg
                  )}
                >
                  Individual Pillar
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Target Asset: <strong className="text-slate-700 dark:text-slate-200">{asset.name}</strong>{' '}
                <span className="font-mono text-slate-400">({asset.id})</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Approval Requirement Warning Callout */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/30 p-3.5 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-[11px] text-amber-800 dark:text-amber-300">
            <AlertTriangle className="size-3.5 text-amber-600 shrink-0" />
            <span>Ministerial Approval & Governance Audit Trail Required</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/80">
            Updating this pillar will immediately set the asset to <strong>Pending Review</strong> and queue an official clearance request in the <strong>Approvals Workflow</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* PILLAR 1: LEGAL OWNER */}
          {activePillar === 'legal_owner' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Assign Legal Owner / Title Holder *
                  </label>
                  <button
                    type="button"
                    onClick={() => setOwner('Esteemed Executive Minister (Pastor Chelsea Kalu)')}
                    className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold cursor-pointer underline"
                  >
                    Preset: Executive Minister
                  </button>
                </div>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g. Esteemed Executive Minister (Pastor Chelsea Kalu)"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Title Certificate Filing Reference
                  </label>
                  <button
                    type="button"
                    onClick={() => setOwnerCertificateRef(`CERT-EXEC-MIN-${new Date().getFullYear()}-HQ`)}
                    className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold cursor-pointer underline"
                  >
                    Preset: Ministry HQ Ref
                  </button>
                </div>
                <input
                  type="text"
                  value={ownerCertificateRef}
                  onChange={(e) => setOwnerCertificateRef(e.target.value)}
                  placeholder="e.g. CERT-EXEC-MIN-2026-HQ"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400 font-mono text-[11px]"
                />
              </div>

              <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3 text-[11px] text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <ShieldCheck className="size-4 text-blue-600 shrink-0" />
                <span>All intellectual property created under KMM ministries is vested solely in ministry leadership in perpetuity.</span>
              </div>
            </div>
          )}

          {/* PILLAR 2: TRADEMARK & LICENSING */}
          {activePillar === 'trademark_license' && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trademark Protection Status *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Unregistered', 'Pending Filing', 'In Progress', 'Registered'] as const).map(
                    (statusOption) => {
                      const isSelected = trademarkStatus === statusOption
                      return (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => setTrademarkStatus(statusOption)}
                          className={cn(
                            'p-2 rounded-lg border text-center transition font-semibold text-xs cursor-pointer',
                            isSelected
                              ? 'border-purple-600 bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500 shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300'
                          )}
                        >
                          {statusOption}
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Distribution License Scope *
                  </label>
                  <div className="flex gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDistributionLicense('Exclusive Ministry Global Distribution')}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold cursor-pointer underline"
                    >
                      Exclusive Global
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistributionLicense('None')}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-semibold cursor-pointer underline"
                    >
                      None (Default)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={distributionLicense}
                  onChange={(e) => setDistributionLicense(e.target.value)}
                  placeholder="e.g. Exclusive Ministry Global Distribution or None"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
                  required
                />
              </div>
            </div>
          )}

          {/* PILLAR 3: TERRITORY CLEARANCE */}
          {activePillar === 'territory' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Cleared Territory *
                  </label>
                  <div className="flex gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTerritory('Worldwide / Global')}
                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold cursor-pointer underline"
                    >
                      Worldwide
                    </button>
                    <button
                      type="button"
                      onClick={() => setTerritory('None')}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-semibold cursor-pointer underline"
                    >
                      None (Default)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  placeholder="e.g. Worldwide / Global or None"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clearance Status
                </label>
                <select
                  value={territoryClearanceStatus}
                  onChange={(e) => setTerritoryClearanceStatus(e.target.value as any)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  <option value="Pending Clearance" className="dark:bg-slate-900 dark:text-white">Pending Clearance (Review Required)</option>
                  <option value="Cleared Global" className="dark:bg-slate-900 dark:text-white">Cleared Global (Subject to Approval)</option>
                  <option value="Cleared Regional" className="dark:bg-slate-900 dark:text-white">Cleared Regional</option>
                  <option value="Restricted" className="dark:bg-slate-900 dark:text-white">Restricted</option>
                  <option value="None" className="dark:bg-slate-900 dark:text-white">None</option>
                </select>
              </div>
            </div>
          )}

          {/* PILLAR 4: BROADCAST & PRODUCTION RIGHTS */}
          {activePillar === 'production_rights' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Authorized Production Licensees *
                  </label>
                  <div className="flex gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setProductionLicensees('Lovetoons Animation Studio, KMM Publishing, LoveWorld Media')}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold cursor-pointer underline"
                    >
                      KMM Studios
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductionLicensees('None')}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-semibold cursor-pointer underline"
                    >
                      None (Default)
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={productionLicensees}
                  onChange={(e) => setProductionLicensees(e.target.value)}
                  placeholder="e.g. Lovetoons Animation Studio, KMM Publishing, LoveWorld Media or None"
                  className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white p-2.5 text-xs outline-none focus:border-blue-400 font-medium"
                  required
                />
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Authorized licensees maintain physical production rights while all final master deliverables remain exclusively vested in KMM.
              </div>
            </div>
          )}

          {/* PILLAR 5: AI CONTENT & PROVENANCE */}
          {activePillar === 'ai_provenance' && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overall Content Provenance *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Fully Custom', 'AI Assisted', 'Fully AI'] as const).map((prov) => {
                    const isSelected = contentProvenance === prov
                    return (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setContentProvenance(prov)}
                        className={cn(
                          'p-2.5 rounded-lg border text-center transition font-semibold text-xs cursor-pointer',
                          isSelected
                            ? 'border-cyan-600 bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300'
                        )}
                      >
                        {prov === 'Fully Custom' && '✦ Fully Custom'}
                        {prov === 'AI Assisted' && '⚡ AI Assisted'}
                        {prov === 'Fully AI' && '🤖 Fully AI'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Music / Audio specific songwriter provenance */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Songwriter / Composer / Lead Author (Optional)
                </label>
                <input
                  type="text"
                  value={songWriter}
                  onChange={(e) => setSongWriter(e.target.value)}
                  placeholder="e.g. KMM Music Ministry (Staff Composer)"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Composition Provenance
                </label>
                <select
                  value={songWriterProvenance}
                  onChange={(e) => setSongWriterProvenance(e.target.value as ContentProvenance)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  <option value="Fully Custom" className="dark:bg-slate-900 dark:text-white">Fully Custom (100% Human Composer / Staff Author)</option>
                  <option value="AI Assisted" className="dark:bg-slate-900 dark:text-white">AI Assisted (Generative Ideation / Human Arranged)</option>
                  <option value="Fully AI" className="dark:bg-slate-900 dark:text-white">Fully AI (Fully Synthesized)</option>
                </select>
              </div>
            </div>
          )}

          {/* Supporting Certificate & Legal Document (DOC, PDF) - Not applicable for AI Provenance */}
          {activePillar !== 'ai_provenance' && (
            <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20 dark:border-white/10 dark:bg-slate-800/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-4 text-blue-600 dark:text-blue-400" />
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Supporting Legal Document / Certificate (DOC, PDF)
                  </label>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                  Official Evidence
                </span>
              </div>

              {attachedFile || docName ? (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/40 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="grid size-8 place-items-center rounded bg-emerald-600 text-white shrink-0">
                      <FileCheck className="size-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                        {docName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Format: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{docType}</span> • {docSize || 'File Selected'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 dark:border-white/15 dark:hover:border-blue-500 bg-white dark:bg-slate-900 transition cursor-pointer group">
                    <UploadCloud className="size-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 transition" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Click to browse or drop legal document (.pdf, .doc, .docx)
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Clearance certificates, official registration, or signed licensing deed
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {/* Optional document notes/description */}
              <div>
                <input
                  type="text"
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="Document reference or note (e.g. Registered in UK IPO, Signed by Director)..."
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          {/* Submission Audit Justification */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Filing Justification & Audit Notes *
            </label>
            <textarea
              rows={2}
              value={justificationNotes}
              onChange={(e) => setJustificationNotes(e.target.value)}
              placeholder="State the reason or ministerial authorization for this individual pillar update..."
              className="w-full rounded-lg border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-800 dark:text-white p-2.5 text-xs outline-none focus:border-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              required
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-slate-200 dark:border-white/15 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 text-xs transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#2f80ed] hover:bg-[#256fd1] px-5 py-2 font-bold text-white shadow-md shadow-blue-500/25 text-xs flex items-center gap-1.5 transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Approval...</span>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Submit for Ministerial Approval</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
