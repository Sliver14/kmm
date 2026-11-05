'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Tv,
  Scale,
  Sparkles,
  ArrowLeft,
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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-[#F4F5F7] text-slate-900 transition-colors duration-300"
      style={{ fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Background glow orbs */}
      <div className="fixed -top-40 left-1/4 size-[550px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="fixed -bottom-40 right-1/4 size-[550px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors bg-white/85 border-slate-200">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
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
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        {/* Modern 2-Column Enclosure Card in Light Theme */}
        <div className="rounded-[32px] sm:rounded-[44px] border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-200/50 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Headline, Description, Stewardship Pillars & Contact Badges */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-5">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border bg-amber-500/10 border-amber-500/30 text-amber-700 transition-colors">
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Peer Agency Registration • Immediate IP Portal Access</span>
                </div>

                {/* Display Headline */}
                <h1
                  className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight leading-[1.18] text-slate-950"
                  style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
                >
                  Document and Steward Your Ministry&apos;s Children&apos;s Media on the Kiddies Media Ministry IP Portal
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  Register your ministry or department on the same level as Lovetoons to receive immediate portal access credentials and start documenting and stewarding your children’s media intellectual property.
                </p>

                {/* 3 Pillars Summary */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 shadow-2xs transition-all">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm mb-0.5 text-slate-950">
                          IP Governance &amp; Deeds
                        </div>
                        <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600">
                          Centralized chain-of-title rights, songwriter splits, and international copyright protection.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 shadow-2xs transition-all">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Tv className="size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm mb-0.5 text-slate-950">
                          Asset Cataloguing &amp; Stewardship
                        </div>
                        <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600">
                          Standardized media classification, metadata stewardship, and structured IP registers across departments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 shadow-2xs transition-all">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Users2 className="size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm mb-0.5 text-slate-950">
                          Kiddies Media Ministry IP Portal Access
                        </div>
                        <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600">
                          The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Circular-Icon Contact Badges */}
              <div className="pt-4 border-t border-slate-200/60 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 sm:size-9 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-950 text-white transition-transform">
                    <Phone className="size-3.5 sm:size-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    +234 803 000 0000 / Kingschat Direct
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 sm:size-9 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-950 text-white transition-transform">
                    <MapPin className="size-3.5 sm:size-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    Central Secretariat &amp; Rights Registry
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 sm:size-9 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-950 text-white transition-transform">
                    <Mail className="size-3.5 sm:size-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    kmm.secretariat@loveworld.org
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Signature Golden Onboarding Form Card in Light Mode */}
            <div className="lg:col-span-7">
              <MinistryOnboardingForm isDark={false} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 mt-16 text-xs bg-white text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <img src="/kmm-logo.png" alt="Kiddies Media Ministry" className="size-5 object-contain" />
            <span>Kiddies Media Ministry • IP &amp; Rights Directorate</span>
          </div>

          <div className="flex items-center gap-5 font-semibold">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link href="/auth" className="hover:text-amber-600 transition-colors">
              Training Portal
            </Link>
            <Link href="/ip-portal" className="hover:text-amber-600 transition-colors">
              Officer Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
