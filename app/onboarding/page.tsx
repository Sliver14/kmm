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
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      style={{ fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Background glow orbs */}
      <div className="fixed -top-40 left-1/4 size-[550px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="fixed -bottom-40 right-1/4 size-[550px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/25 text-amber-500">
            <Sparkles className="size-3.5" />
            <span>Ministry & Department Onboarding Waitlist</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: 'Bricolage Grotesque, -apple-system, sans-serif' }}
          >
            Bring Your Ministry Content to the Global Lovetoons Network
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Are you producing children's animation, comic books, worship music, or educational materials for young minds? Register your ministry or department to gain access to the <strong className="text-slate-900 dark:text-white">IP Portal</strong> — an important resource for documenting and stewarding children’s media content and related intellectual property.
          </p>

          {/* 3 Pillars Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-left">
            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="size-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold mb-2.5">
                <ShieldCheck className="size-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                IP Governance & Deeds
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Centralized chain-of-title rights, songwriter splits, and international copyright protection.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="size-9 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center font-bold mb-2.5">
                <Tv className="size-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                Global Broadcast Syndication
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Distribution channels across Lovetoons TV, Loveworld Nation networks, and child digital platforms.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="size-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold mb-2.5">
                <Users2 className="size-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                KMM IP Portal Access
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <MinistryOnboardingForm />
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-10 mt-16 text-xs transition-colors ${
          isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <img src="/kmm-logo.png" alt="KMM" className="size-5 object-contain" />
            <span>Kiddies Media Ministry • Lovetoons Rights Directorate</span>
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

