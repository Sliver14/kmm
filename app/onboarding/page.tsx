'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Tv,
  Scale,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  ChevronRight,
  Globe,
  Film,
  Building2,
  Users2,
  Lock,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { MinistryOnboardingForm } from '@/components/MinistryOnboardingForm'

export default function OnboardingPage() {
  const [isDark, setIsDark] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('kmm_theme') || 'dark'
    setIsDark(savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('kmm_theme', next ? 'dark' : 'light')
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F5F7] text-slate-900'
      }`}
      style={{ fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Background glow orbs */}
      <div className="fixed -top-40 left-1/4 size-[550px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="fixed -bottom-40 right-1/4 size-[550px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/85 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/kmm-logo.png"
              alt="Kiddies Media Ministry"
              className="size-8 sm:size-9 object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <div
                className="text-sm sm:text-base font-extrabold tracking-tight leading-tight"
                style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
              >
                Kiddies Media Ministry
              </div>
              <div className="text-[10px] font-semibold text-amber-500 tracking-wider uppercase">
                Department Onboarding
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                isDark
                  ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to</span>
              <span>Home</span>
            </Link>

            <Link
              href="/ip-portal"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
            >
              <span>IP Portal</span>
              <ChevronRight className="size-3.5" />
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className={`size-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-white/10 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              {isMounted && isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        {/* Modern 2-Column Enclosure Card - Directly mirroring design spec */}
        <div
          className={`rounded-[32px] sm:rounded-[44px] border p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-300 ${
            isDark
              ? 'bg-[#0B0F17] border-white/10 shadow-black/50'
              : 'bg-white border-slate-200/90 shadow-slate-200/50'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Headline, Description, Stewardship Pillars & Contact Badges */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-5">
                {/* Eyebrow Pill */}
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-700'
                  }`}
                >
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Ministry &amp; Department Onboarding Waitlist</span>
                </div>

                {/* Display Headline */}
                <h1
                  className={`text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight leading-[1.18] ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                  style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
                >
                  Document and Steward Your Ministry&apos;s Children&apos;s Media on the Kiddies Media Ministry IP Portal
                </h1>

                {/* Description */}
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Register your ministry or department to access the{' '}
                  <strong className={isDark ? 'text-white' : 'text-slate-950'}>IP Portal</strong> — the official
                  platform for documenting and stewarding children’s media content and related intellectual property.
                </p>

                {/* 3 Pillars Summary */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs sm:text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          IP Governance &amp; Deeds
                        </div>
                        <p className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Centralized chain-of-title rights, songwriter splits, and international copyright protection.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Tv className="size-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs sm:text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          Asset Cataloguing &amp; Stewardship
                        </div>
                        <p className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Standardized media classification, metadata stewardship, and structured IP registers across departments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Users2 className="size-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs sm:text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          Kiddies Media Ministry IP Portal Access
                        </div>
                        <p className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Circular-Icon Contact Badges (Directly mirroring reference design) */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-8 sm:size-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                      isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'
                    }`}
                  >
                    <Phone className="size-3.5 sm:size-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    +234 803 000 0000 / Kingschat Direct
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`size-8 sm:size-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                      isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'
                    }`}
                  >
                    <MapPin className="size-3.5 sm:size-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Central Secretariat &amp; Rights Registry
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`size-8 sm:size-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                      isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'
                    }`}
                  >
                    <Mail className="size-3.5 sm:size-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    kmm.secretariat@loveworld.org
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Signature Golden Onboarding Form Card */}
            <div className="lg:col-span-7">
              <MinistryOnboardingForm isDark={isDark} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-10 mt-16 text-xs transition-colors ${
          isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <img src="/kmm-logo.png" alt="Kiddies Media Ministry" className="size-5 object-contain" />
            <span>Kiddies Media Ministry • IP &amp; Rights Directorate</span>
          </div>

          <div className="flex items-center gap-5 font-semibold">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Home
            </Link>
            <Link href="/auth" className="hover:text-amber-500 transition-colors">
              Training Portal
            </Link>
            <Link href="/ip-portal" className="hover:text-amber-500 transition-colors">
              Officer Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
