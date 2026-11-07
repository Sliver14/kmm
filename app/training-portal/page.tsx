'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Play,
  Pause,
  Search,
  X,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  Home,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Tv,
  Scale,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  Printer,
  Award,
  CheckCircle,
  Info,
  Layers,
  Flame,
  Target,
  Trophy,
  Bell,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react'
import { ARCHIVED_TRAINING_VIDEOS, VideoItem } from '@/lib/data/trainingVideosData'

export interface TrainingUser {
  id: string
  name: string
  email: string
  agency: string
  role: string
  initials: string
  avatar?: string
  registeredAt: string
}

export default function TrainingPortalPage() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<TrainingUser | null>(null)

  // Navigation tab: 'overview' | 'video' | 'accreditation'
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'accreditation'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRightDetails, setShowRightDetails] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // The single official masterclass video
  const masterclass = ARCHIVED_TRAINING_VIDEOS[0]

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(230) // 03:50 into video
  const totalDuration = 1470 // 24:30
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)

  // Completed modules tracking
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    'vid-1': true,
  })

  const [toastMessage, setToastMessage] = useState('')
  const [copiedHash, setCopiedHash] = useState(false)

  const chapters = useMemo(
    () => [
      { time: '00:00', seconds: 0, title: 'Introduction: The Sacred Trust of Children’s IP', desc: 'Understanding the divine stewardship of children’s media and statutory copyright.' },
      { time: '04:15', seconds: 255, title: 'Statutory Chain of Title & Work-for-Hire', desc: 'Executing unconditional assignments for writers, composers, and animators.' },
      { time: '09:30', seconds: 570, title: 'Minor Performer & Voice Likeness Consent', desc: 'Step-by-step parental release deeds and on-set chaperone protocols.' },
      { time: '14:45', seconds: 885, title: 'AI Transparency & Prompt Preservation', desc: 'Mandatory logging of AI tools, human oversight %, and external training data.' },
      { time: '19:20', seconds: 1160, title: 'Character Silhouette & Trademark Defense', desc: 'Securing character names, vocal signatures, and visual models against infringement.' },
      { time: '23:10', seconds: 1390, title: 'Playout Sign-off & Legal Accreditation', desc: 'Directorate quality sign-off and satellite broadcast certificate generation.' },
    ],
    []
  )

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('kmm_training_theme')
    const darkActive = savedTheme === 'dark'
    setIsDark(darkActive)
    if (typeof window !== 'undefined') {
      if (darkActive) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Default authenticated officer (fallback so user is never locked out)
    const defaultUser: TrainingUser = {
      id: 'TP-LOV-001',
      name: 'Barrister Lillian Okoye',
      email: 'officer@lovetoons.tv',
      agency: 'Lovetoons Content Operations',
      role: 'Head of Legal & IP Directorate',
      initials: 'LO',
      registeredAt: '2026-01-15T09:00:00Z',
    }

    try {
      const storedUserRaw = localStorage.getItem('kmm_training_user')
      if (storedUserRaw) {
        const user: TrainingUser = JSON.parse(storedUserRaw)
        if (user && user.name) {
          setCurrentUser(user)
        } else {
          setCurrentUser(defaultUser)
        }
      } else {
        setCurrentUser(defaultUser)
      }

      const savedModules = localStorage.getItem('kmm_completed_modules')
      if (savedModules) {
        setCompletedModules(JSON.parse(savedModules))
      }
    } catch {
      setCurrentUser(defaultUser)
    }

    // Check query params for tab switching (e.g. ?tab=video or ?tab=accreditation)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      if (tabParam === 'video' || tabParam === 'watch') setActiveTab('video')
      else if (tabParam === 'accreditation') setActiveTab('accreditation')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    localStorage.setItem('kmm_training_theme', nextDark ? 'dark' : 'light')
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  const handleVideoPlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (seconds: number, index: number) => {
    setCurrentTime(seconds)
    setActiveChapterIndex(index)
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
      if (!isPlaying) {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    }
  }

  const toggleModuleCompletion = () => {
    const current = !!completedModules['vid-1']
    const next = !current
    const updated = { ...completedModules, 'vid-1': next }
    setCompletedModules(updated)
    localStorage.setItem('kmm_completed_modules', JSON.stringify(updated))
    showNotification(next ? '✓ Masterclass marked as completed! Accreditation issued.' : 'Module marked in progress.')
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!isMounted) {
    return (
      <div className="h-screen w-full bg-[#F8F9FA] dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="size-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen max-h-screen w-full bg-[#F8F9FB] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col overflow-hidden font-sans antialiased selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 border border-slate-700/50">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container: 100% fixed height, center content scrolls */}
      <div className="flex-1 flex h-full overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: FIXED / STATIONARY (Does not move)          */}
        {/* ========================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 h-full bg-white dark:bg-[#121624] border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between p-5 transition-transform duration-200 md:static md:translate-x-0 shrink-0 overflow-y-auto ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            {/* Brand Logo & Header */}
            <div className="flex items-center justify-between pb-2">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative size-10 shrink-0 rounded-xl overflow-hidden bg-white p-1 border border-slate-200/80 dark:border-white/10 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Image
                    src="/kmm-logo.png"
                    alt="Kiddies Media Ministry"
                    width={40}
                    height={40}
                    priority
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>KMM</span>
                    <span className="text-[#0284C7] dark:text-sky-400 font-black">Academy</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Training &amp; IP Governance</div>
                </div>
              </Link>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Menu Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
                MENU
              </div>

              {/* Navigation Items with live tab switching */}
              <button
                onClick={() => {
                  setActiveTab('overview')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <Layers className={`size-4 ${activeTab === 'overview' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('video')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <Tv className={`size-4 ${activeTab === 'video' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Masterclass Video</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('accreditation')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'accreditation'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <GraduationCap className={`size-4 ${activeTab === 'accreditation' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Accreditation Certificate</span>
              </button>
            </div>
          </div>

          {/* Bottom Card: Legal Guidance / Action Card */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
                  <Scale className="size-3.5" />
                </div>
                <span className="font-bold text-xs text-amber-800 dark:text-amber-300">Need Legal Help?</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Connect with the KMM Legal Directorate for character &amp; music clearance reviews.
              </p>
              <Link
                href="/ip-portal"
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-2xs"
              >
                <span>Go to IP Portal</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <Link
              href="/"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            >
              <span className="flex items-center gap-2">
                <Home className="size-3.5" />
                <span>Return to Home</span>
              </span>
              <ChevronRight className="size-3 text-slate-400" />
            </Link>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER CONTENT AREA (The ONLY area that scrolls)          */}
        {/* ========================================================= */}
        <main className="flex-1 h-full overflow-y-auto min-w-0 flex flex-col">
          {/* Top Bar (Sticky Header & Search) */}
          <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#121624]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
              >
                <Menu className="size-4" />
              </button>
              <div className="relative size-8 shrink-0 rounded-lg overflow-hidden bg-white p-0.5 border border-slate-200/80 dark:border-white/10 hidden sm:flex items-center justify-center shadow-2xs">
                <Image
                  src="/kmm-logo.png"
                  alt="KMM Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white capitalize">
                  {activeTab === 'overview'
                    ? 'Training Academy Overview'
                    : activeTab === 'video'
                    ? 'Featured Masterclass Player'
                    : 'Accreditation Certificate'}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Sovereign Intellectual Property &amp; Statutory Child Protection
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lessons, chapters, covenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-10 py-1.5 rounded-full text-xs bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 text-slate-400">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Quick Actions (Theme, Notifications, User) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
              >
                {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
              </button>

              <button
                onClick={() => showNotification('Statutory child protection guidelines current as of Q1 2026.')}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-amber-500 rounded-full" />
              </button>

              <button
                onClick={() => setShowRightDetails(!showRightDetails)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <span>{showRightDetails ? 'Hide Stats' : 'Show Stats'}</span>
              </button>

              {/* User Avatar Mini Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-white/10">
                <div className="size-8 rounded-full bg-gradient-to-tr from-[#0284C7] to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                  {currentUser?.initials || 'LO'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {currentUser?.name || 'Barrister Lillian'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {currentUser?.role || 'Legal Counsel'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* DYNAMIC TAB CONTENT (Changes as user switches tabs) */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl flex-1">
            {/* ========================================================= */}
            {/* TAB 1: OVERVIEW DASHBOARD                                 */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Welcome / Progress Banner */}
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300">
                      <Sparkles className="size-3" />
                      <span>Official KMM Curriculum</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Welcome back, {currentUser?.name || 'Officer'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                      Master institutional Work-for-Hire vesting, character trademark defense, and minor talent protection under Kiddies Media Ministries.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('video')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer shrink-0"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Watch Masterclass</span>
                  </button>
                </div>

                {/* Section: Continue Learning (2 Course Cards) */}
                <section className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Continue Learning
                    </h2>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Active Milestones
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Course 1: The Single Official Masterclass Video */}
                    <div
                      onClick={() => setActiveTab('video')}
                      className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-amber-500/50 dark:hover:border-amber-400/50 transition cursor-pointer space-y-4 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-105 transition-transform">
                          <Scale className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            SOVEREIGN IP &amp; GOVERNANCE
                          </div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            Protecting Intellectual Properties in Children&apos;s Media
                          </h3>
                        </div>
                      </div>

                      {/* Progress Bar (Orange accent like inspiration) */}
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: completedModules['vid-1'] ? '100%' : '65%' }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <BookOpen className="size-3 text-amber-500" />
                            <span>1 Masterclass • 6 Chapters</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            <span>{completedModules['vid-1'] ? 'Completed' : '24 mins left'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                        <span>{completedModules['vid-1'] ? 'Review Masterclass' : 'Resume Masterclass'}</span>
                        <span className="group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                    </div>

                    {/* Course 2: Sovereign Title & Deeds */}
                    <div
                      onClick={() => setActiveTab('video')}
                      className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-sky-500/50 dark:hover:border-sky-400/50 transition cursor-pointer space-y-4 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="size-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                            SOVEREIGN WORK-FOR-HIRE
                          </div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            Chain of Title &amp; Legal Deeds Masterclass
                          </h3>
                        </div>
                      </div>

                      {/* Progress Bar (Sky accent) */}
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full w-full" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <BookOpen className="size-3 text-sky-500" />
                            <span>6 Key Chapters</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Certified Curriculum</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                        <span>Review Covenants</span>
                        <span className="group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Recommended Training Spotlight (Inspired by Focotech mock) */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Featured Institutional Masterclass
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Official mandatory training for all children&apos;s media directors and creative teams.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Thumbnail Column */}
                    <div
                      onClick={() => setActiveTab('video')}
                      className="md:col-span-5 relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group cursor-pointer shadow-md flex items-center justify-center"
                    >
                      <video
                        src="/kmm-welcome-animation.mp4"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="size-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="size-6 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold">
                        24:30
                      </span>
                    </div>

                    {/* Details Column */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          4K MASTER &bull; LAW-101
                        </span>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          ★ 5.0 (Ministry Certified)
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                        Protecting Intellectual Properties in Children&apos;s Media
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {masterclass.desc}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => setActiveTab('video')}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-2"
                        >
                          <Play className="size-3.5 fill-current" />
                          <span>Watch Masterclass</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('accreditation')}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
                        >
                          View Credential
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: MASTERCLASS VIDEO PLAYER (Dedicated View)          */}
            {/* ========================================================= */}
            {activeTab === 'video' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-1">
                      ★ Official Curriculum Masterclass
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Protecting Intellectual Properties in Children&apos;s Media
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleModuleCompletion}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                        completedModules['vid-1']
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      }`}
                    >
                      {completedModules['vid-1'] ? (
                        <>
                          <CheckCircle className="size-4" />
                          <span>Completed &bull; Retake</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hero Cinema Player */}
                <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#151928] p-4 sm:p-6 shadow-sm space-y-5">
                  <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center group">
                    <video
                      ref={videoRef}
                      src="/kmm-welcome-animation.mp4"
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setCurrentTime(videoRef.current.currentTime)
                        }
                      }}
                      onEnded={() => {
                        setIsPlaying(false)
                        if (!completedModules['vid-1']) toggleModuleCompletion()
                      }}
                      playsInline
                    />

                    {/* Top Overlay Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                        4K Ultra HD &bull; LAW-101
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md">
                        {formatSeconds(currentTime)} / {formatSeconds(totalDuration)}
                      </span>
                    </div>

                    {/* Center Play Button Overlay */}
                    {!isPlaying && (
                      <button
                        onClick={handleVideoPlayToggle}
                        className="absolute size-16 sm:size-20 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                        title="Play Masterclass"
                      >
                        <Play className="size-7 sm:size-9 fill-current ml-1" />
                      </button>
                    )}

                    {/* Bottom Controls Bar */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                      {/* Scrubber Bar */}
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const clickX = e.clientX - rect.left
                          const pct = Math.max(0, Math.min(1, clickX / rect.width))
                          handleSeek(pct * totalDuration, activeChapterIndex)
                        }}
                        className="h-1.5 w-full bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all overflow-hidden"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleVideoPlayToggle}
                            className="hover:text-amber-400 transition cursor-pointer"
                          >
                            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                          </button>
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="hover:text-amber-400 transition cursor-pointer"
                          >
                            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                          </button>
                          <span className="font-mono text-[11px] text-slate-300">
                            {formatSeconds(currentTime)} / {formatSeconds(totalDuration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-300">
                          <span className="text-[11px] font-semibold hidden sm:inline text-amber-300">
                            {chapters[activeChapterIndex]?.title}
                          </span>
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen()
                              }
                            }}
                            className="hover:text-white transition cursor-pointer"
                          >
                            <Maximize2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Speaker & Meta Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3.5">
                      <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                        LO
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {masterclass.speaker}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {masterclass.speakerRole}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        <Award className="size-3.5 text-amber-500" />
                        <span>★ 5.0 Ministry Certified</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('accreditation')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 hover:underline cursor-pointer"
                      >
                        <GraduationCap className="size-3.5" />
                        <span>View Accreditation Certificate</span>
                      </button>
                    </div>
                  </div>

                  {/* Chapter Navigation Chips */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Curriculum Chapter Markers (Click to Seek)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSeek(ch.seconds, idx)}
                          className={`text-left p-3 rounded-xl border transition text-xs flex flex-col justify-between gap-1 cursor-pointer ${
                            activeChapterIndex === idx
                              ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 font-bold shadow-2xs'
                              : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{ch.title}</span>
                            <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">{ch.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal line-clamp-1">{ch.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Institutional Takeaways */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Mandatory Institutional Covenants Covered:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      {masterclass.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                          <CheckCircle2 className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: ACCREDITATION CERTIFICATE (Full In-Page View)      */}
            {/* ========================================================= */}
            {activeTab === 'accreditation' && (
              <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Statutory IP Accreditation
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Institutional accreditation credential for children&apos;s media contributors.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('video')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <span>&larr; Back to Video</span>
                  </button>
                </div>

                {/* The Certificate Frame */}
                <div className="relative w-full bg-white dark:bg-[#151928] rounded-3xl border-2 border-amber-500/40 shadow-2xl p-6 sm:p-10 space-y-6">
                  {/* Decorative Corner Seals */}
                  <div className="absolute top-4 left-4 size-3 border-t-2 border-l-2 border-amber-500" />
                  <div className="absolute top-4 right-4 size-3 border-t-2 border-r-2 border-amber-500" />
                  <div className="absolute bottom-4 left-4 size-3 border-b-2 border-l-2 border-amber-500" />
                  <div className="absolute bottom-4 right-4 size-3 border-b-2 border-r-2 border-amber-500" />

                  {/* Certificate Header */}
                  <div className="text-center space-y-3 border-b border-amber-500/20 pb-6">
                    <div className="relative size-16 mx-auto rounded-2xl bg-white p-2 border border-amber-500/40 flex items-center justify-center shadow-lg">
                      <Image
                        src="/kmm-logo.png"
                        alt="Kiddies Media Ministry"
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Kiddies Media Ministry Academy
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      Certificate of Statutory IP Accreditation
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                      Issued in accordance with Loveworld Kingdom Child Protection &amp; Sovereign Copyright Directives
                    </p>
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center space-y-3 py-4">
                    <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">This certifies that</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white underline decoration-amber-500 decoration-2 underline-offset-8">
                      {currentUser?.name || 'Barrister Lillian Okoye'}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {currentUser?.agency || 'Lovetoons Content Operations'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed pt-3">
                      Has satisfactorily completed all curricular requirements under <b>KMM-IP-101: Protecting Intellectual Properties in Children&apos;s Media</b>, validating sovereign chain of title, Work-for-Hire covenants, parental consent deeds, and AI transparency.
                    </p>
                  </div>

                  {/* Verification Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-amber-500/20 text-[11px]">
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Officer ID</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser?.id || 'TP-OFFICER-001'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Certificate Hash</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">KMM-ACR-2026-IP101</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Authority</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Legal Directorate</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Status</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Verified &amp; Signed</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('https://kmm-portal.internal/verify/KMM-ACR-2026-IP101')
                        setCopiedHash(true)
                        setTimeout(() => setCopiedHash(false), 2000)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      {copiedHash ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                      <span>{copiedHash ? 'Link Copied' : 'Copy Verification Link'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        <Printer className="size-3.5 text-amber-500" />
                        <span>Print PDF</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Save to Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR: FIXED / STATIONARY (Does not move)         */}
        {/* ========================================================= */}
        {showRightDetails && (
          <aside className="w-80 h-full border-l border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#121624] p-5 hidden xl:flex flex-col gap-6 overflow-y-auto shrink-0">
            {/* Top Close Details Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <button
                onClick={() => setShowRightDetails(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                <span>&larr; Close Details</span>
              </button>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Officer Card</span>
            </div>

            {/* Profile Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                  {currentUser?.initials || 'LO'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Barrister Lillian'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.role || 'Head of Legal & IP Directorate'}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-0.5">
                    <Trophy className="size-3" />
                    <span>980 Accreditation Points</span>
                  </div>
                </div>
              </div>

              {/* 3 Stats in Row (Flame / Target / Trophy - Just like inspiration) */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10 text-center">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                    <Flame className="size-3 text-orange-500 fill-orange-500" />
                    <span>07</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Days Streak</div>
                </div>

                <div className="space-y-0.5 border-x border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                    <Target className="size-3 text-rose-500" />
                    <span>04</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Goals Month</div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                    <Trophy className="size-3 text-amber-500" />
                    <span>01</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Directorate</div>
                </div>
              </div>
            </div>

            {/* Weekly Streak Tracker (Inspired by inspiration 7-day pill strip) */}
            <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Weekly Streak</span>
                  <Info className="size-3 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
                  May 2026
                </span>
              </div>

              {/* 7 Day Calendar Strip */}
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-slate-400">4/4 Weeks Active</div>
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {[
                    { day: 'Mon', num: 29, active: true },
                    { day: 'Tue', num: 30, active: true },
                    { day: 'Wed', num: 31, active: true },
                    { day: 'Thu', num: 1, active: true },
                    { day: 'Fri', num: 2, active: false },
                    { day: 'Sat', num: 3, active: false },
                    { day: 'Sun', num: 4, active: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`py-2 px-1 rounded-xl text-center transition ${
                        item.active
                          ? 'bg-gradient-to-b from-amber-500 to-orange-500 text-slate-950 font-black shadow-xs'
                          : 'bg-white dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-[8px] uppercase tracking-wider">{item.day}</div>
                      <div className="text-xs font-bold pt-0.5">{item.num}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Summary Counts */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700/40 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                    <Tv className="size-3 text-amber-500" />
                    <span>Masterclass</span>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    {completedModules['vid-1'] ? 'Completed' : 'In Progress'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700/40 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                    <ShieldCheck className="size-3 text-sky-500" />
                    <span>Curriculum</span>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    6 Chapters
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Watch Time Chart (Inspired by inspiration mini bar chart) */}
            <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Weekly Watch Time</span>
                  <Info className="size-3 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
                  May 2026
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-slate-400">Total: 4 hrs 24 mins</div>
                <div className="h-28 flex items-end justify-between gap-2 pt-6 px-1 relative">
                  {/* Floating Highlight Callout Bubble (Thu 4:24m like inspiration) */}
                  <div className="absolute top-0 left-[48%] -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-950 text-white text-[9px] font-mono font-bold shadow-md">
                    4:24m
                  </div>

                  {[
                    { day: 'M', height: '40%', active: false },
                    { day: 'T', height: '65%', active: false },
                    { day: 'W', height: '50%', active: false },
                    { day: 'T', height: '90%', active: true },
                    { day: 'F', height: '20%', active: false },
                    { day: 'S', height: '35%', active: false },
                    { day: 'S', height: '15%', active: false },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          bar.active
                            ? 'bg-gradient-to-t from-orange-500 to-amber-500 shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700/70 hover:bg-slate-300'
                        }`}
                        style={{ height: bar.height }}
                      />
                      <span className="text-[9px] font-bold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Digital Certificate Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
                  <Award className="size-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    Accreditation Seal
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Official KMM IP Credential
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Certified status for Lovetoons and Children&apos;s Media content producers.
              </p>
              <button
                onClick={() => setActiveTab('accreditation')}
                className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition cursor-pointer text-center"
              >
                View Official Certificate
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
