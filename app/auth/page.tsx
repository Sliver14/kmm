'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('officer@lovetoons.tv')
  const [isDark, setIsDark] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('kmm_theme') || 'dark'
    setIsDark(savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    localStorage.setItem('kmm_theme', nextDark ? 'dark' : 'light')
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    const officerEmail = email.trim() || 'officer@lovetoons.tv'
    if (typeof window !== 'undefined') {
      localStorage.setItem('kmm_auth_officer', officerEmail)
    }
    router.push('/training-portal')
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0F172A] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
      style={{
        fontFamily: 'Figtree, -apple-system, sans-serif',
      }}
    >
      {/* Background radial glow orbs */}
      <div
        className="fixed -top-36 left-1/10 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: '#F59E0B' }}
      />
      <div
        className="fixed -bottom-36 right-1/10 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: '#38BDF8' }}
      />

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between z-10 w-full">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#F97316] text-[#0F172A] flex items-center justify-center text-sm font-black shadow-md group-hover:scale-105 transition-transform">
            ▶
          </div>
          <span className="font-extrabold tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            KMM Video Portal
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/training-portal"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to </span>
            <span>Training Portal</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800/80 border-white/10 text-amber-400 hover:bg-slate-800 hover:scale-105'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:scale-105 shadow-xs'
            }`}
          >
            {isMounted && isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Card */}
      <main
        className={`w-full max-w-md p-8 sm:p-10 rounded-3xl relative z-10 border shadow-2xl backdrop-blur-xl text-center transition-all animate-in fade-in zoom-in-95 duration-300 ${
          isDark
            ? 'bg-slate-900/80 border-white/10 shadow-black/40'
            : 'bg-white/90 border-slate-200 shadow-slate-300/40'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5 bg-amber-500/15 border border-amber-500/30 text-amber-500">
          <span>🎬</span> Policy & Governance On-Demand
        </div>

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
          style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
        >
          Watch & Learn
        </h1>

        <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Instant on-demand video access to Lovetoons child safeguarding, statutory broadcast standards, and legal compliance.
        </p>

        <form onSubmit={handleSignIn} className="space-y-5 text-left">
          <div>
            <label
              htmlFor="officerEmail"
              className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Officer / Reviewer Email
            </label>
            <input
              id="officerEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@lovetoons.tv"
              autoComplete="username"
              className={`w-full px-4 py-3 rounded-xl border font-medium text-sm transition-all outline-hidden ${
                isDark
                  ? 'bg-slate-800/80 border-white/10 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            <span>Enter Video Portal</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <div className={`mt-5 flex items-center justify-center gap-2 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>1-Click demo access &middot; No password required</span>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/20 flex flex-col gap-2.5">
          <Link
            href="/training-portal"
            className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Training Portal</span>
          </Link>
          <Link
            href="/"
            className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold transition-colors hover:underline ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Return to KMM Official Website
          </Link>
        </div>
      </main>
    </div>
  )
}
