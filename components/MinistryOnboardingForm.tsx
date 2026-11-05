'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building2,
  User,
  Mail,
  Phone,
  Sparkles,
  Layers,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  HelpCircle,
  Copy,
  Check,
  KeyRound,
  ExternalLink,
  Lock,
} from 'lucide-react'
import { useLovetoonsData } from '@/lib/store/DataContext'
import type { MinistryOnboardingRequest } from '@/types'

const CATEGORY_OPTIONS = [
  'Animation & Cartoons',
  'Comics & Illustrated Literature',
  'Music, Jingles & Soundtracks',
  'Educational & Children Games',
  'Broadcast TV Series & Specials',
  'Puppetry & Creative Stage Acts',
  'Audio Affirmations & Podcasts',
  'Other Ministry Media',
]

const SCOPE_OPTIONS = [
  'Just starting / Concept stage',
  '1 - 5 completed assets',
  '6 - 20 assets in catalogue',
  '20+ active media assets',
]

const GOAL_OPTIONS = [
  'Documenting & stewarding IP on the Kiddies Media Ministry IP Portal',
  'Broadcast syndication on Lovetoons Mobile App & networks',
  'Official Copyright & IP Rights Protection',
  'Curriculum & Sunday School distribution',
  'Creative co-production & character licensing',
  'General ministerial registration & peer agency accreditation',
]

interface MinistryOnboardingFormProps {
  onSuccess?: (request: MinistryOnboardingRequest) => void
  embedded?: boolean
  className?: string
  isDark?: boolean
}

export function MinistryOnboardingForm({
  onSuccess,
  embedded = false,
  className = '',
  isDark = true,
}: MinistryOnboardingFormProps) {
  const router = useRouter()
  const { addOnboardingRequest, loginAsMinistry, showToast } = useLovetoonsData()

  const [ministryName, setMinistryName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [categoryInterest, setCategoryInterest] = useState(CATEGORY_OPTIONS[0])
  const [estimatedAssetsCount, setEstimatedAssetsCount] = useState(SCOPE_OPTIONS[1])
  const [intendedUsage, setIntendedUsage] = useState(GOAL_OPTIONS[0])
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRequest, setSubmittedRequest] = useState<MinistryOnboardingRequest | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!ministryName.trim()) {
      setErrorMessage('Please enter your Ministry or Department.')
      return
    }

    if (!contactPerson.trim()) {
      setErrorMessage('Please provide a Contact Person / Lead Officer name.')
      return
    }

    if (!email.trim()) {
      setErrorMessage('Please provide an official contact email or Kingschat handle.')
      return
    }

    setIsSubmitting(true)

    try {
      const created = await addOnboardingRequest({
        ministryName: ministryName.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        categoryInterest,
        estimatedAssetsCount,
        intendedUsage,
        notes: notes.trim() || undefined,
      })

      setSubmittedRequest(created)
      if (onSuccess) {
        onSuccess(created)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit onboarding request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setMinistryName('')
    setContactPerson('')
    setEmail('')
    setPhone('')
    setCategoryInterest(CATEGORY_OPTIONS[0])
    setEstimatedAssetsCount(SCOPE_OPTIONS[1])
    setIntendedUsage(GOAL_OPTIONS[0])
    setNotes('')
    setSubmittedRequest(null)
    setErrorMessage(null)
    setCopied(false)
  }

  const handleCopyCredentials = () => {
    if (!submittedRequest) return
    const textToCopy = [
      `=== KIDDIES MEDIA MINISTRIES - PORTAL ACCESS DETAILS ===`,
      `Ministry / Department: ${submittedRequest.ministryName}`,
      `Entity Identifier Code: ${submittedRequest.assignedCode || 'KMM-NEW'}`,
      `Portal Login Email: ${submittedRequest.portalLoginEmail || submittedRequest.email}`,
      `Secure Access Key: ${submittedRequest.accessKey || 'KMM-ACCESS-KEY'}`,
      `Status: Full Agency Peer Status (Equal to Lovetoons)`,
      `Portal URL: ${typeof window !== 'undefined' ? window.location.origin : ''}/ip-portal`,
    ].join('\n')

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    showToast?.('Portal access credentials copied to clipboard!')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleEnterPortal = () => {
    if (!submittedRequest) return
    loginAsMinistry(submittedRequest)
    router.push('/ip-portal')
  }

  // Confirmation Success View with Direct Access Details
  if (submittedRequest) {
    return (
      <div
        className={`rounded-[30px] sm:rounded-[36px] border p-6 sm:p-10 text-center transition-all animate-in fade-in zoom-in-95 duration-300 shadow-2xl ${
          isDark
            ? 'border-emerald-500/30 bg-[#0E1520] text-white'
            : 'border-emerald-500/30 bg-white text-slate-900'
        } ${className}`}
      >
        <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 mb-4">
          <CheckCircle2 className="size-9 sm:size-11 stroke-[2.2]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-3">
          <ShieldCheck className="size-3.5" />
          <span>Full Agency Peer Status Granted • Equal to Lovetoons</span>
        </div>

        <h3
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2"
          style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
        >
          Ministry Registered & Portal Access Issued!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
          Welcome aboard, <strong className="text-slate-900 dark:text-white">{submittedRequest.contactPerson}</strong>.{' '}
          <strong className="text-slate-900 dark:text-white">{submittedRequest.ministryName}</strong> is now registered as an active peer entity on the Kiddies Media Ministries IP Portal.
        </p>

        {/* Portal Access Details Card */}
        <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/90 p-5 text-left mb-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="size-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Portal Access Credentials
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy Details</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="sm:col-span-2 rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Ministry / Department</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm block truncate">
                {submittedRequest.ministryName}
              </span>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Portal Login Email</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-sm block truncate">
                {submittedRequest.portalLoginEmail || submittedRequest.email}
              </span>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Entity Identifier Code</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-sm block truncate">
                {submittedRequest.assignedCode || `KMM-${submittedRequest.id.slice(-4).toUpperCase()}`}
              </span>
            </div>

            <div className="sm:col-span-2 rounded-xl bg-amber-500/10 border border-amber-500/25 p-3">
              <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1">
                Generated Secure Access Key (Password)
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-sm tracking-wider">
                  {submittedRequest.accessKey || 'KMM-ACCESS-KEY'}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Role: Agency Admin
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 p-3 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <Lock className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Zero-Selection Context:</strong> The portal automatically recognizes your entity ({submittedRequest.ministryName}) across all modals and forms. You will never have to select your ministry from a dropdown when adding intellectual properties.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleEnterPortal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-extrabold transition shadow-lg shadow-emerald-600/25 cursor-pointer active:scale-98"
          >
            <span>Log In & Start Adding Intellectual Properties</span>
            <ArrowRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
          >
            Register Another Department
          </button>
        </div>
      </div>
    )
  }

  // Active Form View (Modern Yellow Card UI)
  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[30px] sm:rounded-[36px] bg-gradient-to-br from-[#FFBA00] via-[#FFB800] to-[#F59E0B] p-6 sm:p-8 lg:p-9 text-slate-950 shadow-2xl border border-amber-300/40 relative overflow-hidden transition-all ${className}`}
    >
      {/* Form Header */}
      <div className="border-b border-slate-950/15 pb-5 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-950/10 border border-slate-950/15 text-slate-950 mb-3 uppercase tracking-wider">
          <Sparkles className="size-3.5 text-slate-950" />
          <span>Peer Agency Registration • Immediate IP Portal Access</span>
        </div>
        <h3
          className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-950 tracking-tight leading-tight"
          style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
        >
          Onboard Your Ministry or Department
        </h3>
        <p className="text-xs sm:text-sm text-slate-950/80 font-medium mt-1.5 leading-relaxed">
          Register your ministry entity on the same level as Lovetoons to receive immediate portal access details and start documenting and stewarding your intellectual properties.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-900/30 bg-red-500/20 p-3.5 text-xs font-bold text-red-950 mb-5 flex items-center gap-2">
          <span className="text-base">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4 sm:space-y-5 text-left">
        {/* Row 1: Ministry / Department */}
        <div>
          <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
            Ministry / Department <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-800/70" />
            <input
              type="text"
              required
              value={ministryName}
              onChange={(e) => setMinistryName(e.target.value)}
              placeholder="e.g Children's Ministry"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 placeholder-slate-700/60 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all shadow-inner/10"
            />
          </div>
        </div>

        {/* Row 2: Contact Person & Official Email (Paired 2-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
              Contact Person / Lead Officer <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-800/70" />
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Pastor Grace Okafor"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 placeholder-slate-700/60 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all shadow-inner/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
              Official Email / Kingschat Handle <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-800/70" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@ministry.org or @kingschat"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 placeholder-slate-700/60 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all shadow-inner/10"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Phone & Primary Focus Area (Paired 2-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
              Phone Number <span className="text-slate-800/60 font-semibold lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-800/70" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 placeholder-slate-700/60 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all shadow-inner/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
              Primary Media / Focus Area
            </label>
            <select
              value={categoryInterest}
              onChange={(e) => setCategoryInterest(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all cursor-pointer shadow-inner/10"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-slate-900 font-medium">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Asset Readiness & Intended Collaboration Goal (Paired 2-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
              Asset Readiness / Catalogue
            </label>
            <select
              value={estimatedAssetsCount}
              onChange={(e) => setEstimatedAssetsCount(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all cursor-pointer shadow-inner/10"
            >
              {SCOPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-slate-900 font-medium">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
              Intended Collaboration Goal
            </label>
            <select
              value={intendedUsage}
              onChange={(e) => setIntendedUsage(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all cursor-pointer shadow-inner/10"
            >
              {GOAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-slate-900 font-medium">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Notes / Special Requirements (Full Width) */}
        <div>
          <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
            Brief Overview / Requirements <span className="text-slate-800/60 font-semibold lowercase">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us briefly about your current productions, target audience, or specific accreditation assistance required..."
            className="w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold border-amber-600/25 bg-[#FFE380]/85 text-slate-950 placeholder-slate-700/60 outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-950/20 transition-all resize-y shadow-inner/10"
          />
        </div>

        {/* Submit Pill Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group w-full sm:w-auto inline-flex items-center justify-center gap-3.5 pl-3 pr-6 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-slate-950 text-white hover:bg-slate-900 shadow-xl shadow-slate-950/30'
                : 'bg-slate-950 text-white hover:bg-slate-800 shadow-xl shadow-slate-950/20'
            }`}
          >
            <div className="size-8 sm:size-9 rounded-full bg-[#FFBA00] text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
              {isSubmitting ? (
                <div className="size-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <Send className="size-3.5 sm:size-4" />
              )}
            </div>
            <span>
              {isSubmitting ? 'Registering Ministry & Generating Access...' : 'Register Ministry & Generate Portal Access'}
            </span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </form>
  )
}
