'use client'

import React, { useState } from 'react'
import {
  X,
  UserPlus,
  User,
  Briefcase,
  Building2,
  Mail,
  Sparkles,
  Check,
  ShieldCheck,
  FileSignature,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetData, RightsRecord, AssetContributor, Agency } from '@/types'
import { useLovetoonsData } from '@/lib/store/DataContext'

export interface AddContributorModalProps {
  isOpen: boolean
  onClose: () => void
  asset: AssetData | RightsRecord
  onSuccess?: (contributor: AssetContributor) => void
}

const ALL_AGENCIES: Agency[] = [
  'Lovetoons',
  'Publishing Agency',
  'Digital Agency',
  'Academy Agency',
  'Educational Agency',
]

const ROLE_PRESETS = [
  'Lead 3D Animator',
  'Lead Scriptwriter & Author',
  'Character Designer',
  'Voice Artist & Director',
  'Sound Engineer & Composer',
  'Curriculum Specialist',
  'Creative Director',
  'Legal & IP Counsel',
  'Story Artist',
  'Contributing Illustrator',
]

const CONTRIBUTION_TYPES: {
  type: NonNullable<AssetContributor['contributionType']>
  label: string
  desc: string
  badgeBg: string
}[] = [
  {
    type: 'Lead Author',
    label: 'Lead Author',
    desc: 'Primary creative originator or head author',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
  },
  {
    type: 'Core Creative',
    label: 'Core Creative',
    desc: 'Principal animator, voice lead, or designer',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700/50',
  },
  {
    type: 'Technical Specialist',
    label: 'Technical Specialist',
    desc: 'Audio engineer, compositor, or developer',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50',
  },
  {
    type: 'Contributing Artist',
    label: 'Contributing Artist',
    desc: 'Supporting illustrator, animator, or musician',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-700/50',
  },
  {
    type: 'Reviewer',
    label: 'Reviewer',
    desc: 'Doctrinal, script, or safety auditor',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50',
  },
]

export function AddContributorModal({
  isOpen,
  onClose,
  asset,
  onSuccess,
}: AddContributorModalProps) {
  const { addAssetContributor, showToast } = useLovetoonsData()

  const defaultAgency = (asset?.agency || (asset as any)?.unit || 'Lovetoons') as Agency

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [agency, setAgency] = useState<Agency>(defaultAgency)
  const [email, setEmail] = useState('')
  const [contributionType, setContributionType] = useState<NonNullable<AssetContributor['contributionType']>>('Core Creative')
  const [autoDraftDeed, setAutoDraftDeed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !asset) return null

  const targetAssetId = (asset as any).assetId || asset.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Contributor name is required.')
      return
    }
    if (!role.trim()) {
      showToast('Contributor role is required.')
      return
    }

    setIsSubmitting(true)
    try {
      const newContributor = await addAssetContributor(targetAssetId, {
        name: name.trim(),
        role: role.trim(),
        agency,
        email: email.trim() || undefined,
        contributionType,
        joinedDate: new Date().toISOString().split('T')[0],
      })

      if (onSuccess) {
        onSuccess(newContributor)
      }
      onClose()
      setName('')
      setRole('')
      setEmail('')
    } catch (err: any) {
      console.error('Failed to add contributor:', err)
      showToast(err?.message || 'Failed to add contributor.')
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
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-[#2f80ed]/15 dark:text-[#2f80ed] border border-blue-100 dark:border-[#2f80ed]/30">
              <UserPlus className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Add Asset Contributor
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-[#2f80ed]/20 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-[#2f80ed]/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                  Talent Roster
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Register creative talent or staff member for{' '}
                <strong className="text-slate-700 dark:text-slate-200">{asset.name}</strong>{' '}
                <span className="font-mono text-slate-400">({targetAssetId})</span>
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

        {/* Governance Notice */}
        <div className="mt-4 rounded-xl border border-purple-200/80 bg-purple-50/70 dark:border-purple-900/50 dark:bg-purple-950/20 p-3 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
          <ShieldCheck className="size-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            All registered contributors will be automatically tracked in the <strong>Contributor Talent Release Auditing</strong> ledger to verify copyright assignment and ministry clearance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Staff / Contributor Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="size-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bro. David Adeleke, Sis. Rachel Adams"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#141622] dark:text-white pl-9 pr-3 text-xs outline-none focus:border-[#2f80ed] font-medium"
                required
              />
            </div>
          </div>

          {/* Role & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Primary Creative Role / Designation *
              </label>
              <span className="text-[10px] text-slate-400">Select preset or type custom</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="size-4" />
              </div>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead 3D Animator, Sound Engineer, Voice Actor"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#141622] dark:text-white pl-9 pr-3 text-xs outline-none focus:border-[#2f80ed] font-medium"
                required
              />
            </div>

            {/* Role Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ROLE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRole(preset)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition cursor-pointer',
                    role === preset
                      ? 'bg-[#2f80ed] text-white border-[#2f80ed] shadow-2xs'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Agency & Ministry Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Originating Agency */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Agency / Unit *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="size-4" />
                </div>
                <select
                  value={agency}
                  onChange={(e) => setAgency(e.target.value as Agency)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#141622] dark:text-white pl-9 pr-3 text-xs outline-none focus:border-[#2f80ed] cursor-pointer"
                >
                  {ALL_AGENCIES.map((ag) => (
                    <option key={ag} value={ag} className="dark:bg-[#1c202c] dark:text-white">
                      {ag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ministry Email */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ministry Email (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="size-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kmm.org"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#141622] dark:text-white pl-9 pr-3 text-xs outline-none focus:border-[#2f80ed]"
                />
              </div>
            </div>
          </div>

          {/* Contribution Tier Selection */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contribution Tier / IP Attribution
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTRIBUTION_TYPES.map((ct) => {
                const isSelected = contributionType === ct.type
                return (
                  <button
                    key={ct.type}
                    type="button"
                    onClick={() => setContributionType(ct.type)}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5',
                      isSelected
                        ? 'border-[#2f80ed] bg-blue-50/70 dark:bg-[#2f80ed]/15 text-[#09245a] dark:text-white shadow-2xs'
                        : 'border-slate-200 bg-white dark:border-white/10 dark:bg-[#141622] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    )}
                  >
                    <div
                      className={cn(
                        'size-4 rounded-full border grid place-items-center shrink-0 mt-0.5',
                        isSelected
                          ? 'border-[#2f80ed] bg-[#2f80ed] text-white'
                          : 'border-slate-300 dark:border-white/30'
                      )}
                    >
                      {isSelected && <Check className="size-2.5" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{ct.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {ct.desc}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Companion Talent Release Option */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-[#141622] cursor-pointer">
            <input
              type="checkbox"
              checked={autoDraftDeed}
              onChange={(e) => setAutoDraftDeed(e.target.checked)}
              className="size-4 rounded text-[#2f80ed] focus:ring-[#2f80ed] cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <FileSignature className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Track Talent Release & Copyright Assignment</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Creates a compliance audit slot to attach this contributor&apos;s signed intellectual property deed.
              </p>
            </div>
          </label>

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
                <span>Adding Contributor...</span>
              ) : (
                <>
                  <UserPlus className="size-3.5" />
                  <span>Register Contributor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
