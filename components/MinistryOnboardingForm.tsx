'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
  'General ministerial waitlist & accreditation',
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
  const { addOnboardingRequest } = useLovetoonsData()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!ministryName.trim()) {
      setErrorMessage('Please enter your Ministry or Church Entity Name.')
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
  }

  // Confirmation Success View
  if (submittedRequest) {
    return (
      <div
        className={`rounded-[30px] sm:rounded-[36px] border p-8 sm:p-12 text-center transition-all animate-in fade-in zoom-in-95 duration-300 shadow-2xl ${
          isDark
            ? 'border-emerald-500/30 bg-[#0E1520] text-white'
            : 'border-emerald-500/30 bg-emerald-50/80 text-slate-900'
        } ${className}`}
      >
        <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 mb-6">
          <CheckCircle2 className="size-9 sm:size-11 stroke-[2.2]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-4">
          <span>Reference ID:</span>
          <span className="uppercase">{submittedRequest.id}</span>
        </div>

        <h3
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3"
          style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
        >
          You&apos;re on the Kiddies Media Ministry Onboarding Waitlist!
        </h3>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-8">
          Thank you, <strong className="text-slate-900 dark:text-white">{submittedRequest.contactPerson}</strong>. We have logged{' '}
          <strong className="text-slate-900 dark:text-white">{submittedRequest.ministryName}</strong> into our central department registry.
        </p>

        {/* What Happens Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-left mb-8">
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-4 space-y-1.5 shadow-xs">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Step 01</span>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Admin Review</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Super Admin & Secretariat review your media profile and jurisdiction.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-4 space-y-1.5 shadow-xs">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Step 02</span>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Consultation Call</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              We reach out to {submittedRequest.email} to align on documentation standards and IP onboarding protocols.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-4 space-y-1.5 shadow-xs">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Step 03</span>
            <div className="text-xs font-bold text-slate-900 dark:text-white">IP Portal Access</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Your unit receives dedicated access to the IP Portal — an important resource for documenting and stewarding children’s media content and related intellectual property.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
          >
            Submit Another Department
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            Return to Homepage
          </Link>
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
          <span>Expression of Interest • Ministry Waitlist</span>
        </div>
        <h3
          className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-950 tracking-tight leading-tight"
          style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
        >
          Onboard Your Ministry or Department
        </h3>
        <p className="text-xs sm:text-sm text-slate-950/80 font-medium mt-1.5 leading-relaxed">
          Join the Kiddies Media Ministry ecosystem and gain access to the <strong className="text-slate-950 font-bold">IP Portal</strong>. The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-900/30 bg-red-500/20 p-3.5 text-xs font-bold text-red-950 mb-5 flex items-center gap-2">
          <span className="text-base">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4 sm:space-y-5 text-left">
        {/* Row 1: Ministry / Department Name (Prominent Full Width) */}
        <div>
          <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5">
            Ministry / Department Name <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-800/70" />
            <input
              type="text"
              required
              value={ministryName}
              onChange={(e) => setMinistryName(e.target.value)}
              placeholder="e.g. Loveworld Children's Ministry International"
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
              Contact Email / Kingschat <span className="text-red-700">*</span>
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

        {/* Submit Pill Button - Mode aware mirroring reference design */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group w-full sm:w-auto inline-flex items-center justify-center gap-3.5 pl-3 pr-6 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-slate-950 text-white hover:bg-slate-900 shadow-xl shadow-slate-950/25 active:scale-98'
                : 'bg-white text-slate-950 hover:bg-slate-50 shadow-lg shadow-black/10 active:scale-98'
            }`}
          >
            <span
              className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'
              }`}
            >
              {isSubmitting ? (
                <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Send className="size-3.5 stroke-[2.5]" />
              )}
            </span>
            <span>
              {isSubmitting ? 'Registering on Waitlist...' : 'Submit Expression of Interest'}
            </span>
          </button>
        </div>

        {/* Security & Confidentiality Tag */}
        <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] font-semibold text-slate-950/75 pt-1">
          <ShieldCheck className="size-3.5 text-slate-950" />
          <span>All submissions are reviewed confidentially by Kiddies Media Ministry Secretariat &amp; Super Admin</span>
        </div>
      </div>
    </form>
  )
}
