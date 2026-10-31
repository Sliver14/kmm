'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  Search,
  X,
  Sun,
  Moon,
  Menu,
  ArrowLeft,
  ChevronRight,
  Home,
  GraduationCap,
  ShieldCheck,
  Scroll,
  FileText,
  BookOpen,
  Radio,
  Tv,
  Film,
  ShoppingBag,
  Scale,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  UserCheck,
  ArrowRightLeft,
  Clock,
  Globe,
} from 'lucide-react'

interface VideoItem {
  id: string
  code: string
  title: string
  category: string
  categoryLabel: string
  duration: string
  speaker: string
  speakerRole: string
  initials: string
  avatarBg: string
  res: string
  desc: string
  gradient: string
  glow: string
  points: string[]
  citations: string[]
}

// Course / video collection for Training Portal (archived copy preserved in @/lib/data/trainingVideosData)
const VIDEOS: VideoItem[] = []

const CATEGORIES = [
  { id: 'all', label: 'All Modules', icon: Film },
  { id: 'broadcast', label: 'Broadcast Standards', icon: Radio },
  { id: 'protection', label: 'Child Protection', icon: ShieldCheck },
  { id: 'copyright', label: 'Copyright & IP', icon: Scale },
  { id: 'doctrinal', label: 'Scriptural Review', icon: BookOpen },
  { id: 'merchandising', label: 'Merchandising', icon: ShoppingBag },
]

export default function TrainingPortalPage() {
  const [isDark, setIsDark] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [officerEmail, setOfficerEmail] = useState('Barrister Lillian')
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null)
  const [viewMode, setViewMode] = useState<'catalog' | 'watch'>('catalog')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progressPercent, setProgressPercent] = useState(15)
  const [isCaptionsOn, setIsCaptionsOn] = useState(false)
  const [isTheaterExpanded, setIsTheaterExpanded] = useState(false)
  const [isAutoplayOn, setIsAutoplayOn] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const playTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('kmm_theme') || 'dark'
    setIsDark(savedTheme === 'dark')

    const auth = localStorage.getItem('kmm_auth_officer')
    if (auth) {
      const name = auth.split('@')[0]
      setOfficerEmail(name.charAt(0).toUpperCase() + name.slice(1))
    }

    // Check hash for direct watch link
    if (window.location.hash.startsWith('#watch-')) {
      const vidId = window.location.hash.replace('#watch-', '')
      const found = VIDEOS.find((v) => v.id === vidId)
      if (found) {
        startPlayingVideo(found)
      }
    }
  }, [])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Auto playback simulation
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            if (isAutoplayOn) {
              handlePlayNext()
            }
            return 0
          }
          return prev + 1
        })
      }, 500)
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current)
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current)
    }
  }, [isPlaying, isAutoplayOn])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('kmm_theme', next ? 'dark' : 'light')
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const startPlayingVideo = (video: VideoItem) => {
    setCurrentVideo(video)
    setViewMode('watch')
    setIsPlaying(true)
    setProgressPercent(0)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.location.hash = `watch-${video.id}`
    }
  }

  const handlePlayNext = () => {
    if (!VIDEOS.length || !currentVideo) return
    const currentIndex = VIDEOS.findIndex((v) => v.id === currentVideo.id)
    if (currentIndex === -1) return
    const nextIndex = (currentIndex + 1) % VIDEOS.length
    startPlayingVideo(VIDEOS[nextIndex])
    showToast(`Autoplaying next: ${VIDEOS[nextIndex].title}`)
  }

  const filteredVideos = VIDEOS.filter((v) => {
    const matchesCategory = activeFilter === 'all' || v.category === activeFilter
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDark ? 'bg-[#0B1120] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#1E293B]'
      }`}
      style={{ fontFamily: 'Figtree, -apple-system, sans-serif' }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-slate-900 border border-amber-400 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#0B1120]/95 border-white/10' : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <div
            onClick={() => {
              setViewMode('catalog')
              if (typeof window !== 'undefined') window.location.hash = ''
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Play className="size-4 fill-current text-slate-950 ml-0.5" />
            </div>
            <div className="min-w-0">
              <div
                className="font-extrabold text-sm sm:text-base leading-tight tracking-tight truncate"
                style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
              >
                <span className="hidden sm:inline">KMM Policy & Governance</span>
                <span className="sm:hidden">KMM Academy</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-amber-500 tracking-wide uppercase truncate">
                Videos On Demand
              </div>
            </div>
          </div>

          {/* Desktop Search Box (md+) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, speaker, or citation..."
              className={`w-full pl-10 pr-9 py-2 rounded-full text-xs font-medium border outline-hidden transition-all ${
                isDark
                  ? 'bg-slate-900 border-white/10 text-white placeholder-slate-400 focus:border-amber-400'
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-amber-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Navigation Actions (md+) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                setViewMode('catalog')
                if (typeof window !== 'undefined') window.location.hash = ''
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'catalog'
                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="size-3.5" />
              <span>All Modules ({VIDEOS.length})</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <Home className="size-3.5" />
              <span>KMM Home</span>
            </Link>


            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`size-8.5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 border-white/10 text-amber-400 hover:scale-105'
                  : 'bg-white border-slate-200 text-slate-700 hover:scale-105 shadow-xs'
              }`}
            >
              {isMounted && isDark ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-slate-700" />
              )}
            </button>

            {/* Officer status pill */}
            <div
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-xs font-semibold ${
                isDark ? 'bg-slate-800/80 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <div className="size-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                <UserCheck className="size-3 text-slate-950" />
              </div>
              <span className="truncate max-w-[100px]">{officerEmail}</span>
            </div>
          </div>

          {/* Mobile Action Controls (< md) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Quick Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className={`size-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                mobileSearchOpen || searchQuery
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : isDark
                  ? 'bg-slate-800/70 border-white/10 text-slate-300'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              aria-label="Toggle mobile video search"
            >
              <Search className="size-4" />
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`size-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/70 border-white/10 text-amber-400'
                  : 'bg-white border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              {isMounted && isDark ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="size-9 rounded-full flex items-center justify-center bg-amber-500 text-slate-950 font-bold transition-all cursor-pointer shadow-xs"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 bg-[#0B1120] animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses, topics, citations..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full text-xs font-medium border border-white/10 bg-slate-900 text-white placeholder-slate-400 focus:border-amber-400 outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          />
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="fixed top-16 left-0 right-0 z-50 max-h-[calc(100vh-64px)] overflow-y-auto border-b border-white/10 bg-[#0B1120] px-5 py-6 shadow-2xl animate-in slide-in-from-top-3 duration-250 md:hidden space-y-5">
            {/* Mobile Officer Profile Pill */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  <UserCheck className="size-4 text-slate-950" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{officerEmail}</div>
                  <div className="text-[10px] text-amber-400 font-semibold">Legal & Policy Directorate</div>
                </div>
              </div>
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
              >
                <ArrowRightLeft className="size-3" />
                <span>Switch</span>
              </Link>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setViewMode('catalog')
                  setMobileMenuOpen(false)
                  if (typeof window !== 'undefined') window.location.hash = ''
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-colors cursor-pointer ${
                  viewMode === 'catalog'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-900/40 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Film className="size-4 text-amber-500" />
                  <span>All Modules</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                  {VIDEOS.length}
                </span>
              </button>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm bg-slate-900/40 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="size-4 text-sky-400" />
                  <span>KMM Official Website</span>
                </div>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>
            </div>

            {/* Category Quick Filter Grid */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Filter by Subject Matter
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveFilter(cat.id)
                        setViewMode('catalog')
                        setMobileMenuOpen(false)
                      }}
                      className={`inline-flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer truncate ${
                        activeFilter === cat.id
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900/60 border border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* =========================================================================
            WATCH VIEW: Full Theater Mode
            ========================================================================= */}
        {viewMode === 'watch' && currentVideo && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Back to library banner */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                onClick={() => {
                  setViewMode('catalog')
                  if (typeof window !== 'undefined') window.location.hash = ''
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 cursor-pointer transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Complete Video Library</span>
              </button>
              <span className="text-xs font-medium text-slate-400">
                Playing: <b className="text-white">{currentVideo.code}</b> &middot; {currentVideo.res}
              </span>
            </div>

            {/* Video Player + Recommended Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Columns: Video Cinema & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cinema Screen Box */}
                <div
                  className={`relative rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                    isTheaterExpanded ? 'lg:col-span-3' : ''
                  } ${isDark ? 'bg-slate-950 border-white/10 shadow-black/80' : 'bg-slate-900 border-slate-800'}`}
                  style={{
                    background: currentVideo.gradient,
                  }}
                >
                  {/* Atmospheric Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{ background: currentVideo.glow }}
                  />

                  {/* Stage Area */}
                  <div className="relative aspect-video flex flex-col items-center justify-center p-8 select-none">
                    {/* Big Center Play / Pause Button */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="size-20 sm:size-24 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-10 border-4 border-white/30"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying ? (
                        <Pause className="size-9 fill-current" />
                      ) : (
                        <Play className="size-9 fill-current ml-1" />
                      )}
                    </button>

                    {/* Animated Soundwave Visualizer */}
                    {isPlaying && (
                      <div className="absolute bottom-20 flex items-end gap-1.5 h-10 opacity-60 pointer-events-none">
                        <span className="w-1 bg-amber-400 rounded-full animate-pulse h-6" />
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce h-9" />
                        <span className="w-1 bg-amber-400 rounded-full animate-pulse h-4" />
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce h-8" />
                        <span className="w-1 bg-amber-400 rounded-full animate-pulse h-5" />
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce h-7" />
                      </div>
                    )}

                    {/* Captions Overlay */}
                    {isCaptionsOn && (
                      <div className="absolute bottom-20 px-4 py-2 rounded-lg bg-black/80 text-white font-medium text-xs sm:text-sm text-center max-w-xl backdrop-blur-xs">
                        [AUDIO]: Statutory clearance protocols must be verified before satellite release...
                      </div>
                    )}
                  </div>

                  {/* Player Controls Bar */}
                  <div className="relative bg-slate-950/90 border-t border-white/10 px-5 py-3 flex flex-col gap-2.5 z-20">
                    {/* Scrub Progress Bar */}
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const clickX = e.clientX - rect.left
                        const newPercent = Math.min(100, Math.max(0, (clickX / rect.width) * 100))
                        setProgressPercent(newPercent)
                      }}
                      className="relative w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all overflow-hidden"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Buttons row */}
                    <div className="flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="inline-flex items-center gap-1 hover:text-amber-400 cursor-pointer font-bold transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="size-3.5 fill-current" />
                          ) : (
                            <Play className="size-3.5 fill-current" />
                          )}
                          <span>{isPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="inline-flex items-center gap-1 hover:text-amber-400 cursor-pointer text-slate-300 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="size-3.5" />
                          ) : (
                            <Volume2 className="size-3.5" />
                          )}
                          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                        </button>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {Math.floor((progressPercent / 100) * 18)}:
                          {Math.floor(((progressPercent / 100) * 45) % 60)
                            .toString()
                            .padStart(2, '0')}{' '}
                          / {currentVideo.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsCaptionsOn(!isCaptionsOn)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            isCaptionsOn
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'border-white/30 text-white/70 hover:text-white'
                          }`}
                        >
                          <Subtitles className="size-3" />
                          <span>CC</span>
                        </button>

                        <button
                          onClick={() => setIsTheaterExpanded(!isTheaterExpanded)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs cursor-pointer transition-colors"
                        >
                          {isTheaterExpanded ? (
                            <Minimize2 className="size-3.5" />
                          ) : (
                            <Maximize2 className="size-3.5" />
                          )}
                          <span>{isTheaterExpanded ? 'Normal' : 'Expand'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Info Header */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
                    isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
                      {currentVideo.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{currentVideo.categoryLabel}</span>
                    <span className="text-xs font-bold text-emerald-400 ml-auto">{currentVideo.res}</span>
                  </div>

                  <h1
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 leading-snug"
                    style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  >
                    {currentVideo.title}
                  </h1>

                  <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/10">
                    <div
                      className="size-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md"
                      style={{ background: currentVideo.avatarBg }}
                    >
                      {currentVideo.initials}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{currentVideo.speaker}</div>
                      <div className="text-xs text-slate-400">{currentVideo.speakerRole}</div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300 dark:text-slate-300 mb-6">
                    {currentVideo.desc}
                  </p>

                  {/* Key Compliance Directives */}
                  <div className="mb-6">
                    <h3
                      className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-3"
                      style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                    >
                      Key Compliance Directives
                    </h3>
                    <ul className="space-y-2.5">
                      {currentVideo.points.map((pt, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed ${
                            isDark ? 'bg-slate-800/40 border-white/5' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="size-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal Citations */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Statutory Citations & Frameworks
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentVideo.citations.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        >
                          <FileText className="size-3" />
                          <span>{c}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Up Next Recommended Videos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h2
                    className="font-extrabold text-base tracking-tight"
                    style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  >
                    Up Next in Governance
                  </h2>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
                    <span>Autoplay</span>
                    <input
                      type="checkbox"
                      checked={isAutoplayOn}
                      onChange={(e) => setIsAutoplayOn(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  {VIDEOS.filter((v) => v.id !== currentVideo.id).map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => startPlayingVideo(vid)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex gap-3 ${
                        isDark
                          ? 'bg-slate-900/50 border-white/5 hover:border-amber-400/40 hover:bg-slate-800/50'
                          : 'bg-white border-slate-200 hover:border-amber-500/40 hover:bg-slate-50'
                      }`}
                    >
                      {/* Mini Thumbnail */}
                      <div
                        className="w-24 h-16 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden text-xs font-bold shadow-xs group-hover:scale-102 transition-transform"
                        style={{ background: vid.gradient }}
                      >
                        <span className="size-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] shadow-md">
                          <Play className="size-2.5 fill-current ml-0.5" />
                        </span>
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/70 px-1 rounded text-white">
                          {vid.duration}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                          {vid.code}
                        </span>
                        <h4 className="text-xs font-bold leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
                          {vid.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 mt-1 truncate">{vid.speaker}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CATALOG VIEW: Hero Masterclass + Filter Pills + Video Grid
            ========================================================================= */}
        {viewMode === 'catalog' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Overview Hero Banner */}
            <section
              className={`rounded-3xl border overflow-hidden p-8 sm:p-12 relative shadow-2xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/60 border-white/10'
                  : 'bg-gradient-to-r from-white via-slate-50 to-amber-50/50 border-slate-200'
              }`}
            >
              <div className="max-w-3xl relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-500">
                  <GraduationCap className="size-3.5" />
                  <span>Policy & Governance Academy</span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  KMM Training & Governance Portal
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-slate-400 dark:text-slate-300">
                  Official on-demand institutional training repository for Kiddies Media Ministry officers, broadcast reviewers, and creative production heads.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-emerald-400" />
                    <span>Officer Authenticated ({officerEmail})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-amber-400" />
                    <span>Child Safeguarding Standards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Scroll className="size-3.5 text-sky-400" />
                    <span>Statutory Broadcasting Covenants</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/auth"
                    className={`inline-flex items-center gap-1.5 px-5 py-3 rounded-full font-bold text-xs border transition-colors ${
                      isDark
                        ? 'border-white/20 text-white hover:bg-white/10'
                        : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowRightLeft className="size-3.5 text-amber-500" />
                    <span>Switch Officer Profile</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeFilter === cat.id
                          ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                          : isDark
                          ? 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="text-xs font-bold text-slate-400 shrink-0">
                {VIDEOS.length > 0
                  ? `Showing ${filteredVideos.length} of ${VIDEOS.length} Masterclasses`
                  : '0 Modules Available'}
              </div>
            </div>

            {/* Video Cards Grid / Empty State */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => startPlayingVideo(vid)}
                    className={`rounded-2xl border overflow-hidden flex flex-col transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-2xl ${
                      isDark
                        ? 'bg-slate-900/60 border-white/10 hover:border-amber-400/50 shadow-black/40'
                        : 'bg-white border-slate-200 hover:border-amber-500/50 shadow-slate-200/50'
                    }`}
                  >
                    {/* Card Thumbnail */}
                    <div
                      className="h-48 relative flex items-center justify-center p-4 overflow-hidden"
                      style={{ background: vid.gradient }}
                    >
                      {/* Play circle */}
                      <div className="size-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform z-10">
                        <Play className="size-5 fill-current ml-0.5" />
                      </div>

                      {/* Tags overlay */}
                      <span className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-amber-400 border border-amber-400/30">
                        {vid.code}
                      </span>

                      <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-black/70 px-2 py-0.5 rounded text-white">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                            {vid.categoryLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold ml-auto">{vid.res}</span>
                        </div>

                        <h3
                          className="text-base font-extrabold leading-snug group-hover:text-amber-500 transition-colors line-clamp-2 mb-2"
                          style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                        >
                          {vid.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{vid.desc}</p>
                      </div>

                      {/* Speaker footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                            style={{ background: vid.avatarBg }}
                          >
                            {vid.initials}
                          </div>
                          <span className="font-semibold text-slate-300 truncate max-w-[140px]">
                            {vid.speaker}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                          <span>Watch</span>
                          <ChevronRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`rounded-3xl border border-dashed p-12 sm:p-16 text-center space-y-4 transition-all ${
                  isDark
                    ? 'bg-slate-900/40 border-white/10 text-slate-400'
                    : 'bg-slate-50 border-slate-300 text-slate-600'
                }`}
              >
                <div className="size-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Film className="size-7" />
                </div>
                <h3
                  className="text-xl sm:text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  No Courses or Videos Available
                </h3>
                <p className="text-sm max-w-md mx-auto leading-relaxed text-slate-400">
                  Institutional training modules and broadcast compliance masterclasses are currently being scheduled for publication. Check back soon for updated curriculum.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="size-3.5" />
                  <span>Curriculum in Preparation</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-12 mt-16 transition-colors ${
          isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div>
            <div className="font-bold text-sm text-white mb-1">
              Kiddies Media Ministry (KMM) Academy
            </div>
            <p className="text-slate-400">
              Official institutional training & broadcast compliance video repository.
            </p>
          </div>

          <div className="flex items-center gap-6 font-bold">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Home className="size-3.5" />
              <span>KMM Home</span>
            </Link>
            <Link href="/auth" className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <UserCheck className="size-3.5" />
              <span>Officer Sign In</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
