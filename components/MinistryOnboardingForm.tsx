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
  'Broadcast syndication on Lovetoons TV & networks',
  'Official Copyright & IP Rights Protection',
  'Curriculum & Sunday School distribution',
  'Creative co-production & character licensing',
  'General ministerial waitlist & accreditation',
]

interface MinistryOnboardingFormProps {
  onSuccess?: (request: MinistryOnboardingRequest) => void
  embedded?: boolean
  className?: string
}

export function MinistryOnboardingForm({
  onSuccess,
  embedded = false,
  className = '',
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
        className={`rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-8 sm:p-12 text-center transition-all animate-in fade-in zoom-in-95 duration-300 ${className}`}
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
          You're on the KMM Onboarding Waitlist!
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
              We reach out to {submittedRequest.email} to align on content format & broadcast policies.
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

  // Active Form View
  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-xl transition-all ${className}`}
    >
      {/* Form Header */}
      <div className="border-b border-slate-100 dark:border-white/10 pb-5 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 mb-3">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Expression of Interest • Ministry Waitlist</span>
        </div>
        <h3
          className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
        >
          Onboard Your Ministry or Department
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Join the Kiddies Media Ministry ecosystem and gain access to the <strong className="text-slate-700 dark:text-slate-200">IP Portal</strong>. The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-5 flex items-center gap-2">
          <span>⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-5 text-left">
        {/* Row 1: Ministry / Department Name (Prominent Full Width) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Ministry / Department Name <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              required
              value={ministryName}
              onChange={(e) => setMinistryName(e.target.value)}
              placeholder="e.g. Loveworld Children's Ministry International"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        {/* Row 2: Contact Person & Official Email (Paired 2-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Contact Person / Lead Officer <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Pastor Grace Okafor"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Contact Email or Kingschat Handle <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@ministry.org or @kingschat"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Phone & Primary Focus Area (Paired 2-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Media / Focus Area
            </label>
            <select
              value={categoryInterest}
              onChange={(e) => setCategoryInterest(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Asset Readiness & Intended Collaboration Goal (Paired 2-Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Asset Readiness / Catalogue Size
            </label>
            <select
              value={estimatedAssetsCount}
              onChange={(e) => setEstimatedAssetsCount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              {SCOPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Intended Collaboration Goal
            </label>
            <select
              value={intendedUsage}
              onChange={(e) => setIntendedUsage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              {GOAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Notes / Special Requirements (Full Width) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Brief Overview / Requirements <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us briefly about your current productions, target audience, or specific accreditation assistance required..."
            className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Registering on Waitlist...</span>
              </>
            ) : (
              <>
                <span>Submit Expression of Interest</span>
                <Send className="size-4 stroke-[2.2]" />
              </>
            )}
          </button>
        </div>

        {/* Security & Confidentiality Tag */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>All submissions are reviewed confidentially by KMM Secretariat & Super Admin</span>
        </div>
      </div>
    </form>
  )
}

