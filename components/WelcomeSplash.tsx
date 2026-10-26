'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeSplashProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  autoCloseDelayMs?: number // e.g. 9500 to match video duration
}

export function WelcomeSplash({
  isOpen,
  onClose,
  userName,
  autoCloseDelayMs = 9500,
}: WelcomeSplashProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  // Auto-close countdown
  useEffect(() => {
    if (!isOpen) return

    // Track video time progress for smooth bar
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.duration) {
        const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100
        setProgress(pct)
      }
    }, 100)

    const timer = setTimeout(() => {
      onClose()
    }, autoCloseDelayMs)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [isOpen, onClose, autoCloseDelayMs])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const toggleSound = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }, [])

  const restartVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Kiddies Media Ministries"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#05070d]/95 backdrop-blur-2xl text-white animate-in fade-in duration-500"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 size-[600px] rounded-full bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 size-[600px] rounded-full bg-gradient-to-t from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px]" />

      {/* Floating particles aesthetic dots */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Top action bar: Mute / Restart / Close */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={restartVideo}
          title="Replay animation"
          className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
        >
          <RotateCcw className="size-4" />
        </button>

        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-amber-300" />}
        </button>

        <button
          onClick={onClose}
          title="Close / Enter portal (Esc)"
          className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Main Content Showcase */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl mx-auto">
        {/* Animated Medallion Container */}
        <div className="relative group">
          {/* Pulsing golden halo ring */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-amber-600/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />

          {/* Golden bezel border */}
          <div className="relative p-1 rounded-full bg-gradient-to-b from-amber-300/80 via-yellow-500/40 to-amber-600/80 shadow-[0_0_60px_rgba(245,158,11,0.35)]">
            <div className="relative size-56 sm:size-72 md:size-80 rounded-full overflow-hidden bg-slate-950">
              <video
                ref={videoRef}
                src="/kmm-welcome-animation.mp4"
                autoPlay
                muted={isMuted}
                playsInline
                loop={false}
                onLoadedData={() => setVideoLoaded(true)}
                onEnded={onClose}
                className="size-full object-cover rounded-full"
              />
              {/* Fallback image if video is buffering */}
              {!videoLoaded && (
                <img
                  src="/kmm-logo.png"
                  alt="Kiddies Media Ministries"
                  className="absolute inset-0 size-full object-contain p-6 animate-pulse"
                />
              )}
            </div>
          </div>
        </div>

        {/* Brand Titles */}
        <div className="mt-8 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>Kiddies Media Ministries • Loveworld Nation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {userName ? `Welcome back, ${userName}` : 'Welcome to Kiddies Media Ministries'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Intellectual Asset Management & Worldwide Rights Governance Platform
          </p>
        </div>

        {/* Enter Portal Action & Progress */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-xs">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm py-3 px-6 shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <span>Enter Governance Platform</span>
            <ArrowRight className="size-4 stroke-[2.5]" />
          </button>

          {/* Progress bar representing animation duration */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">Esc</kbd> or click button to skip
          </span>
        </div>
      </div>
    </div>
  )
}
