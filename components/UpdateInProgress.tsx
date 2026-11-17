'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Wrench,
  ShieldCheck,
  Server,
  Lock,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

export default function UpdateInProgress() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [isResolved, setIsResolved] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toUTCString().replace('GMT', 'UTC')
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-check in background if maintenance is lifted
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/maintenance-status', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.maintenance === false) {
          setIsResolved(true)
          setTimeout(() => {
            window.location.href = '/'
          }, 1500)
          return
        }
      }
    } catch {
      // Still in maintenance or network error
    }
  }

  useEffect(() => {
    // Periodically poll status every 30 seconds
    const pollTimer = setInterval(checkStatus, 30000)
    return () => clearInterval(pollTimer)
  }, [])

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Soft radial glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Header / Ministry Badge */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-xl bg-white/[0.04] p-1.5 border border-white/10 shadow-inner flex items-center justify-center">
            <Image
              src="/kmm-logo.png"
              alt="Kiddies Media Ministry"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Kiddies Media Ministry
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Official Maintenance
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">
              Central Intellectual Asset & Media Infrastructure
            </p>
          </div>
        </div>

        {/* Live Clock / Status */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-mono text-[11px]">{mounted ? currentTime : 'Syncing time...'}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-6 py-12 flex flex-col justify-center items-center text-center">
        {/* Pulsing Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_25px_rgba(245,158,11,0.15)] animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          Update in Progress
        </div>

        {/* Centered Large KMM Emblem with Ambient Halo */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-blue-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-700" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-4 shadow-2xl flex items-center justify-center backdrop-blur-xl">
            <Image
              src="/kmm-logo.png"
              alt="KMM Emblem"
              width={80}
              height={80}
              className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Primary Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 max-w-2xl leading-[1.15]">
          System Update & Infrastructure Upgrade
        </h2>

        {/* Informative Subtext */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-10 text-balance">
          We are currently deploying critical platform enhancements, core security updates, and database optimizations across the{' '}
          <span className="text-amber-300 font-medium">Kiddies Media Ministry</span> network. All ministerial dashboards, registries, and learning systems are temporarily offline.
        </p>

        {/* Feature / Safety Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl text-left mb-8">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-white mb-1">Asset Security</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              100% integrity guaranteed. All intellectual assets and masterclasses are locked in secure storage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-white mb-1">Infrastructure Upgrades</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enhancing content distribution nodes, streaming pipelines, and server response performance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2.5">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-white mb-1">Controlled Access</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All logins and contributor access portals will re-open immediately upon update completion.
            </p>
          </div>
        </div>

        {/* Reassurance banner */}
        {isResolved ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Maintenance Complete! Redirecting to platform...
          </div>
        ) : (
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Services will automatically restore once deployment validation is finished.
          </p>
        )}
      </main>

      {/* Ministerial Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Kiddies Media Ministry. All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>LoveWorld Children&apos;s Ministry</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span>Digital Network Infrastructure</span>
        </div>
      </footer>
    </div>
  )
}
