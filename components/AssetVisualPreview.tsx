'use client'

import React, { useState, useEffect } from 'react'
import {
  Play, Pause, Volume2, VolumeX, Maximize2, SkipForward, SkipBack,
  Smartphone, Monitor, Gamepad2, Music, BookOpen, Layers, Sparkles,
  ShieldCheck, Download, Copy, Check, Terminal, Globe, Server, Code,
  FileText, Film, Eye, ZoomIn, ZoomOut, Sparkle, Package, Calendar,
  ChevronRight, ChevronLeft, Mic, Disc3, BookMarked, FileCode, CheckSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetData } from '@/types'
import { generateAssetArchive } from '@/lib/data/assetArchiveData'

interface AssetVisualPreviewProps {
  asset: AssetData
  showToast: (msg: string) => void
}

export function AssetVisualPreview({ asset, showToast }: AssetVisualPreviewProps) {
  const archive = asset.archive || generateAssetArchive(asset)

  // -------------------------------------------------------------
  // 1. VIDEO / ANIMATION / TV / FILM / DOCUMENTARY STATE
  // -------------------------------------------------------------
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(30)
  const duration = asset.attributes?.durationMinutes ? asset.attributes.durationMinutes * 60 : 900
  const [isMuted, setIsMuted] = useState(false)
  const [selectedDub, setSelectedDub] = useState<'English 5.1' | 'French' | 'Spanish'>('English 5.1')
  const [selectedRes, setSelectedRes] = useState<'4K UHD' | '1080p'>('4K UHD')
  const [activeChapter, setActiveChapter] = useState(0)

  const videoThumbnails = [
    {
      id: 'ep-1',
      title: '01. Opening Credits & Praise Theme',
      time: 0,
      duration: '03:15',
      thumb: asset.posterUrl || '/tv_series_poster.jpg',
      badge: 'Intro',
    },
    {
      id: 'ep-2',
      title: '02. Bible Quest: David & The Giant',
      time: 195,
      duration: '08:40',
      thumb: '/tv_series_showcase.jpg',
      badge: 'Main Story',
    },
    {
      id: 'ep-3',
      title: '03. Tilly & Friends Character Song',
      time: 715,
      duration: '04:10',
      thumb: '/tv_series_poster.jpg',
      badge: 'Musical',
    },
    {
      id: 'ep-4',
      title: '04. Scripture Memory Verse & Prayer',
      time: 965,
      duration: '03:30',
      thumb: '/tv_series_showcase.jpg',
      badge: 'Declaration',
    },
  ]

  useEffect(() => {
    let interval: any
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // -------------------------------------------------------------
  // 2. DIGITAL / INTERACTIVE PLATFORM STATE
  // -------------------------------------------------------------
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile' | 'game'>('desktop')
  const [appTab, setAppTab] = useState<'episodes' | 'singalong' | 'biblequiz' | 'parents'>('episodes')
  const [appSearch, setAppSearch] = useState('')
  const [copiedClone, setCopiedClone] = useState(false)

  // -------------------------------------------------------------
  // 3. MUSIC / AUDIO STATE
  // -------------------------------------------------------------
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioTime, setAudioTime] = useState(24)
  const audioDuration = 215
  const [stemsState, setStemsState] = useState({
    vocals: true,
    guitars: true,
    synths: true,
    drums: true,
  })

  useEffect(() => {
    let interval: any
    if (isAudioPlaying) {
      interval = setInterval(() => {
        setAudioTime((prev) => (prev >= audioDuration ? 0 : prev + 1))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isAudioPlaying, audioDuration])

  // -------------------------------------------------------------
  // 4. PUBLISHING / BOOKS / COMICS STATE
  // -------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(8)
  const totalPages = asset.attributes?.pageCount || 48
  const [isSpreadView, setIsSpreadView] = useState(true)
  const [readerZoom, setReaderZoom] = useState(100)

  // -------------------------------------------------------------
  // 5. CHARACTER / NAMED IP STATE
  // -------------------------------------------------------------
  const [turntableRotation, setTurntableRotation] = useState(45)
  const [isAutoSpin, setIsAutoSpin] = useState(false)
  const [renderStyle, setRenderStyle] = useState<'textured' | 'wireframe' | 'skeleton'>('textured')
  const [expression, setExpression] = useState<'joyful' | 'brave' | 'prayer' | 'wonder'>('joyful')

  useEffect(() => {
    let interval: any
    if (isAutoSpin) {
      interval = setInterval(() => {
        setTurntableRotation((prev) => (prev + 3) % 360)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isAutoSpin])

  // -------------------------------------------------------------
  // 6. CONSUMER PRODUCT / MERCHANDISE STATE
  // -------------------------------------------------------------
  const [productView, setProductView] = useState<'front' | 'back' | 'isometric' | 'lifestyle'>('front')

  // -------------------------------------------------------------
  // 7. BRAND & GUIDELINES STATE
  // -------------------------------------------------------------
  const [logoBg, setLogoBg] = useState<'dark' | 'light' | 'grid' | 'gold'>('dark')

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard!`)
    }
  }

  // Categories
  const isVideoCategory =
    asset.category === 'Animated Programme' ||
    asset.category === 'TV Programme' ||
    asset.category === 'Film / Short Movie' ||
    asset.category === 'Documentary / Video'

  const isDigitalCategory = asset.category === 'Digital / Interactive Platform'
  const isMusicCategory = asset.category === 'Music / Audio'
  const isPublishingCategory = asset.category === 'Publishing / Book' || asset.category === 'Publishing / Comics'
  const isCharacterCategory = asset.category === 'Character / Named IP'
  const isMerchCategory = asset.category === 'Consumer Product / Merchandise'
  const isEventCategory = asset.category === 'Outreach / Event Format'
  const isBrandCategory = asset.category === 'Brand & Guidelines'

  return (
    <div className="space-y-4">
      {/* ----------------------------------------------------------- */}
      {/* 1. COMPACT VIDEO PLAYER & EPISODES / CHAPTERS THUMBNAILS    */}
      {/* ----------------------------------------------------------- */}
      {isVideoCategory && (
        <div className="rounded-2xl border border-slate-800 bg-[#031124] overflow-hidden shadow-xl text-white">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#020b18] px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-black tracking-wider text-red-400 border border-red-500/30">
                <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>CLOUD STREAM</span>
              </span>
              <span className="font-bold text-slate-200 truncate max-w-xs">{asset.name}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <select
                value={selectedDub}
                onChange={(e) => setSelectedDub(e.target.value as any)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 font-semibold focus:outline-none"
              >
                <option value="English 5.1">Audio: English 5.1</option>
                <option value="French">Audio: French Dub</option>
                <option value="Spanish">Audio: Spanish Dub</option>
              </select>

              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 px-2 py-0.5 font-mono text-[10px] font-bold">
                {selectedRes}
              </span>
            </div>
          </div>

          {/* Compact Split Layout: Compact Player on Left, Chapter Thumbnails on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Compact Video Player (Constrained Max Height ~260px) */}
            <div className="lg:col-span-7 relative h-64 sm:h-72 bg-gradient-to-br from-[#051833] via-[#09245a] to-[#010914] flex flex-col justify-between overflow-hidden group">
              {/* Background Poster Image with Gradient Overlay */}
              <img
                src={asset.posterUrl || '/tv_series_poster.jpg'}
                alt={asset.name}
                className="absolute inset-0 size-full object-cover opacity-35 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

              {/* Top Meta Overlay */}
              <div className="relative z-10 p-3 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                  <Film className="size-3 text-cyan-400" />
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                  PRORES 422 HQ
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 space-y-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="size-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl flex items-center justify-center transform hover:scale-110 transition border border-blue-400"
                >
                  {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
                </button>
                <div className="text-xs font-bold text-white drop-shadow-md truncate max-w-sm mt-1">
                  {videoThumbnails[activeChapter]?.title || asset.name}
                </div>
              </div>

              {/* Bottom Scrubber Bar */}
              <div className="relative z-10 p-3 bg-gradient-to-t from-black/95 to-transparent space-y-1.5">
                <div className="relative w-full h-1.5 bg-slate-700/80 rounded-full cursor-pointer overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white">
                      {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white">
                      {isMuted ? <VolumeX className="size-3.5 text-rose-400" /> : <Volume2 className="size-3.5" />}
                    </button>
                    <span className="font-mono text-[10px] text-slate-400">
                      {formatTime(currentTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Switched to fullscreen')}
                      className="hover:text-white"
                      title="Fullscreen"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Subcategory / Episode Video Thumbnails List */}
            <div className="lg:col-span-5 bg-[#020b18] border-t lg:border-t-0 lg:border-l border-slate-800 p-3 flex flex-col justify-between max-h-72 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                  <span>Scene Chapters & Episodes ({videoThumbnails.length})</span>
                  <span className="text-cyan-400 font-semibold">Master Renditions</span>
                </div>

                <div className="space-y-1.5">
                  {videoThumbnails.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveChapter(idx)
                        setCurrentTime(item.time)
                        setIsPlaying(true)
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 rounded-xl p-1.5 text-left transition border',
                        activeChapter === idx
                          ? 'bg-blue-950/80 border-blue-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      )}
                    >
                      {/* Rich Thumbnail with Play Icon */}
                      <div className="relative size-12 shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                        <img src={item.thumb} alt={item.title} className="size-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 grid place-items-center">
                          <Play className="size-3.5 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] truncate pr-1">{item.title}</span>
                          <span className="font-mono text-[9px] text-cyan-400 shrink-0">{item.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-0.5">
                          <span className="rounded bg-slate-800 px-1.5 py-0.2 text-amber-300 font-semibold">{item.badge}</span>
                          <span>• 4K Master</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions at bottom of right panel */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => showToast(`Downloading ProRes master for ${asset.name}...`)}
                  className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white transition shadow-xs"
                >
                  <Download className="size-3" />
                  <span>Download ProRes ({asset.fileSize || '4.8 GB'})</span>
                </button>

                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  <span>Cloud Ready</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 2. DIGITAL / INTERACTIVE PLATFORM PREVIEW                   */}
      {/* ----------------------------------------------------------- */}
      {isDigitalCategory && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md space-y-3">
          {/* Top Simulator Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-blue-600 grid place-items-center text-white font-bold">
                <Globe className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">{asset.name} Live Interactive Frame</h3>
                <p className="text-[10px] text-slate-400">Digital Platform & Software Distribution</p>
              </div>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition text-[11px]',
                  deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                <Monitor className="size-3" />
                <span>Web</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition text-[11px]',
                  deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                <Smartphone className="size-3" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setDeviceMode('game')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition text-[11px]',
                  deviceMode === 'game' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                <Gamepad2 className="size-3" />
                <span>Game</span>
              </button>
            </div>
          </div>

          {/* Direct Deployment & Repository Bar (Only for Digital Platform!) */}
          <div className="px-4 py-2.5 bg-blue-50/70 border-y border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {archive.websiteUrl && (
                <a
                  href={archive.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-700 text-[11px]"
                >
                  <Globe className="size-3" />
                  <span>Visit Portal ↗</span>
                </a>
              )}

              {archive.repositoryUrl && (
                <a
                  href={archive.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-50 text-[11px]"
                >
                  <Code className="size-3 text-purple-600" />
                  <span>GitHub Repo ↗</span>
                </a>
              )}

              {archive.cloneCommand && (
                <button
                  onClick={() => {
                    handleCopy(archive.cloneCommand!, 'Git clone command')
                    setCopiedClone(true)
                    setTimeout(() => setCopiedClone(false), 2000)
                  }}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 text-[11px]"
                >
                  {copiedClone ? <Check className="size-3 text-emerald-600" /> : <Terminal className="size-3 text-slate-500" />}
                  <span>{copiedClone ? 'Copied' : 'Copy git clone'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Server: Online</span>
            </div>
          </div>

          {/* Interactive UI Simulator Mockup */}
          <div className="p-3 flex justify-center">
            <div
              className={cn(
                'rounded-xl border border-slate-800 bg-slate-950 p-2.5 shadow-xl transition-all',
                deviceMode === 'desktop' ? 'w-full max-w-3xl' : deviceMode === 'mobile' ? 'w-72' : 'w-full max-w-2xl'
              )}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-rose-500" />
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="size-2 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-slate-900 px-3 py-0.5 rounded text-cyan-400 font-semibold truncate max-w-xs">
                  {archive.websiteUrl || 'https://tv.lovetoons.org'}
                </div>
                <span className="text-emerald-400 font-bold text-[9px]">● Live</span>
              </div>

              <div className="bg-[#03152c] rounded-lg p-3 text-white space-y-3 min-h-[220px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <img src="/lovetoons-logo.png" alt="Lovetoons" className="h-5 w-auto object-contain" />
                    <span className="font-extrabold text-xs text-white">Lovetoons Kids</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search shows..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { title: 'The Shield of Faith', category: 'Animation', img: '/tv_series_poster.jpg' },
                    { title: 'Praise Sing-Along', category: 'Audio', img: '/tv_series_showcase.jpg' },
                    { title: 'Bible Quest 3D', category: 'Game', img: '/tv_series_poster.jpg' },
                  ].map((card) => (
                    <div
                      key={card.title}
                      onClick={() => showToast(`Playing sample from "${card.title}"`)}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-2 hover:border-blue-400 transition cursor-pointer space-y-1"
                    >
                      <div className="relative aspect-video w-full rounded overflow-hidden">
                        <img src={card.img} alt={card.title} className="size-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 grid place-items-center">
                          <Play className="size-4 text-amber-400" />
                        </div>
                      </div>
                      <div className="font-bold text-[10px] text-white truncate">{card.title}</div>
                      <div className="text-[9px] text-slate-400">{card.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 3. MUSIC / AUDIO STUDIO DECK & FREQUENCY VISUALIZER         */}
      {/* ----------------------------------------------------------- */}
      {isMusicCategory && (
        <div className="rounded-2xl border border-slate-800 bg-[#061224] text-white p-4 shadow-xl space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-pink-600 grid place-items-center font-bold text-white shadow-sm">
                <Music className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">{asset.name}</h3>
                <p className="text-[10px] text-pink-300">Master Studio Multi-Track Audio Deck</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-cyan-400">
                {asset.attributes?.bpm || 128} BPM
              </span>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-amber-400">
                {asset.attributes?.keySignature || 'C Major'}
              </span>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-emerald-400">
                24-bit / 48kHz WAV
              </span>
            </div>
          </div>

          {/* Equalizer Waveform Bars (Compact ~70px) */}
          <div className="relative rounded-xl bg-[#020914] p-4 border border-slate-800 flex flex-col items-center justify-center space-y-2.5">
            <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-lg px-2">
              {[40, 65, 80, 45, 90, 70, 50, 85, 95, 60, 40, 75, 88, 92, 55, 30, 60, 85, 95, 70, 50, 65, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-t-full transition-all duration-150',
                    isAudioPlaying ? 'bg-gradient-to-t from-pink-600 via-purple-500 to-cyan-400' : 'bg-slate-800'
                  )}
                  style={{
                    height: isAudioPlaying ? `${Math.max(15, (h * (0.6 + Math.random() * 0.5)))}%` : '15%',
                  }}
                />
              ))}
            </div>

            {/* Timecode & Scrubber */}
            <div className="w-full max-w-lg space-y-1">
              <div className="relative w-full h-1.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
                  style={{ width: `${(audioTime / audioDuration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{formatTime(audioTime)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>

            {/* Play Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAudioTime(Math.max(0, audioTime - 10))}
                className="size-8 rounded-lg bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300"
              >
                <SkipBack className="size-3.5" />
              </button>
              <button
                onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                className="size-10 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 grid place-items-center text-white shadow-lg"
              >
                {isAudioPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
              </button>
              <button
                onClick={() => setAudioTime(Math.min(audioDuration, audioTime + 10))}
                className="size-8 rounded-lg bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300"
              >
                <SkipForward className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Stems Mute / Solo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { key: 'vocals', name: 'Lead Vocals', icon: Mic },
              { key: 'guitars', name: 'Guitars', icon: Music },
              { key: 'synths', name: 'Synths & Brass', icon: Sparkles },
              { key: 'drums', name: 'Drums', icon: Disc3 },
            ].map((stem) => {
              const isActive = stemsState[stem.key as keyof typeof stemsState]
              return (
                <button
                  key={stem.key}
                  onClick={() =>
                    setStemsState((prev) => ({
                      ...prev,
                      [stem.key]: !prev[stem.key as keyof typeof stemsState],
                    }))
                  }
                  className={cn(
                    'p-2 rounded-lg font-bold text-[10px] flex items-center justify-between border transition',
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                  )}
                >
                  <span className="truncate">{stem.name}</span>
                  <stem.icon className="size-3 shrink-0" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 4. PUBLISHING / BOOKS / COMICS DIGITAL READER               */}
      {/* ----------------------------------------------------------- */}
      {isPublishingCategory && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-500 grid place-items-center text-white font-bold shadow-sm">
                <BookOpen className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#09245a]">{asset.name}</h3>
                <p className="text-[10px] text-slate-500">Digital Publication & Cloud Print Master</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setIsSpreadView(!isSpreadView)}
                className="rounded-lg border border-slate-200 px-2 py-1 font-bold text-slate-700 text-[11px]"
              >
                {isSpreadView ? '2-Page Spread' : 'Single Page'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 bg-slate-100 p-4 flex flex-col items-center justify-center space-y-3">
            <div
              className={cn(
                'flex gap-2 bg-white rounded-lg shadow-md p-3 border border-slate-200 transition-all',
                isSpreadView ? 'w-full max-w-xl' : 'w-64'
              )}
            >
              <div className="flex-1 aspect-[3/4] rounded border border-slate-200 bg-amber-50/30 p-3 flex flex-col justify-between shadow-inner text-[10px]">
                <div>
                  <div className="font-bold text-amber-800 uppercase tracking-wider text-[9px]">
                    Page {currentPage}: The Word of Faith
                  </div>
                  <h4 className="font-black text-xs text-[#09245a] mt-1">Walking In Divine Grace</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[10px]">
                    "Through faith we understand that the worlds were framed by the word of God..." — Hebrews 11:3
                  </p>
                </div>
                <div className="text-center font-mono text-[9px] text-slate-400">Page {currentPage}</div>
              </div>

              {isSpreadView && (
                <div className="flex-1 aspect-[3/4] rounded border border-slate-200 bg-white p-3 flex flex-col justify-between shadow-inner">
                  <div className="size-full rounded bg-gradient-to-tr from-blue-100 to-amber-100 p-2 flex flex-col items-center justify-center text-center space-y-1 border border-slate-200">
                    <img src={asset.posterUrl || '/lovetoons-logo.png'} alt="Illustration" className="h-10 w-auto object-contain" />
                    <span className="font-bold text-[10px] text-[#09245a]">Full Color 300 DPI CMYK</span>
                  </div>
                  <div className="text-center font-mono text-[9px] text-slate-400">Page {currentPage + 1}</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 2))}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-bold text-slate-700 disabled:opacity-40 text-[11px]"
              >
                <ChevronLeft className="size-3.5" />
                <span>Prev</span>
              </button>
              <span className="font-bold text-slate-800 font-mono text-[11px]">
                Page {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 2))}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-bold text-slate-700 disabled:opacity-40 text-[11px]"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 5. CHARACTER / NAMED IP 3D RIG TURNTABLE                    */}
      {/* ----------------------------------------------------------- */}
      {isCharacterCategory && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-red-500 grid place-items-center text-white font-bold shadow-sm">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#09245a]">{asset.name}</h3>
                <p className="text-[10px] text-slate-500">3D Character Rig Turntable & Blendshape Morphs</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setRenderStyle('textured')}
                className={cn('px-2 py-0.5 rounded font-bold text-[10px]', renderStyle === 'textured' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600')}
              >
                Textured
              </button>
              <button
                onClick={() => setRenderStyle('wireframe')}
                className={cn('px-2 py-0.5 rounded font-bold text-[10px]', renderStyle === 'wireframe' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600')}
              >
                Wireframe
              </button>
            </div>
          </div>

          <div className="relative rounded-xl bg-gradient-to-br from-[#0a192f] to-[#020b18] p-6 flex flex-col items-center justify-center text-white min-h-[220px]">
            <div
              className="relative size-32 flex items-center justify-center transition-transform duration-75"
              style={{ transform: `rotateY(${turntableRotation}deg)` }}
            >
              <img src={asset.posterUrl || '/lovetoons-logo.png'} alt="3D Rig" className="h-20 w-auto object-contain drop-shadow-2xl" />
            </div>

            <div className="w-full max-w-xs space-y-1 pt-2">
              <div className="flex items-center justify-between text-[10px] text-slate-300">
                <span className="font-mono">{turntableRotation}°</span>
                <button
                  onClick={() => setIsAutoSpin(!isAutoSpin)}
                  className={cn('px-2 py-0.5 rounded font-bold text-[9px]', isAutoSpin ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300')}
                >
                  {isAutoSpin ? '● SPINNING' : '▶ AUTO-SPIN'}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={turntableRotation}
                onChange={(e) => setTurntableRotation(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 6. CONSUMER PRODUCT / MERCHANDISE STUDIO                    */}
      {/* ----------------------------------------------------------- */}
      {isMerchCategory && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-600 grid place-items-center text-white font-bold shadow-sm">
                <Package className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#09245a]">{asset.name}</h3>
                <p className="text-[10px] text-slate-500">Product Packaging & Lab Clearance</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['front', 'back', 'isometric'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setProductView(v)}
                  className={cn(
                    'px-2 py-0.5 rounded font-bold capitalize text-[10px]',
                    productView === v ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-tr from-slate-100 to-emerald-50 p-6 flex flex-col items-center justify-center min-h-[200px] border border-slate-200">
            <div className="size-32 rounded-xl bg-white p-3 shadow-md border border-slate-200 flex flex-col items-center justify-center space-y-1.5">
              <img src={asset.posterUrl || '/lovetoons-logo.png'} alt="Merchandise" className="h-10 w-auto object-contain" />
              <div className="font-bold text-[11px] text-[#09245a] text-center">{asset.name}</div>
              <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                NAFDAC / CE Approved
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 7. OUTREACH / EVENT FORMAT STAGE BLUEPRINT                  */}
      {/* ----------------------------------------------------------- */}
      {isEventCategory && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md space-y-3">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2 text-xs">
            <div className="size-8 rounded-lg bg-purple-600 grid place-items-center text-white font-bold shadow-sm">
              <Calendar className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#09245a]">{asset.name}</h3>
              <p className="text-[10px] text-slate-500">Live Stage Blueprint & Run of Show</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#020b18] p-5 text-white border border-slate-800 flex flex-col items-center justify-center min-h-[160px] space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px]">
              <Sparkles className="size-3" />
              <span>STAGE 8K LED SCREEN MOTION GRAPHICS</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-400 text-center">
              {asset.name}
            </h2>
            <p className="text-[10px] text-slate-400">Operations playbook, stage lighting cues and livestream archive</p>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 8. BRAND & GUIDELINES LOGO ASSET KIT                        */}
      {/* ----------------------------------------------------------- */}
      {isBrandCategory && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-slate-900 grid place-items-center text-white font-bold shadow-sm">
                <Sparkle className="size-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#09245a]">{asset.name}</h3>
                <p className="text-[10px] text-slate-500">Official Master Vector Brand Identity Suite</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['dark', 'light', 'grid', 'gold'] as const).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setLogoBg(bg)}
                  className={cn(
                    'px-2 py-0.5 rounded font-bold capitalize text-[10px]',
                    logoBg === bg ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  )}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              'rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px] border transition-colors',
              logoBg === 'dark'
                ? 'bg-[#03152c] border-slate-800'
                : logoBg === 'light'
                ? 'bg-slate-50 border-slate-200'
                : logoBg === 'grid'
                ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-white border-slate-300'
                : 'bg-gradient-to-tr from-amber-400 to-orange-500 border-amber-300'
            )}
          >
            <div className="relative p-4 border-2 border-dashed border-cyan-400/40 rounded-xl flex items-center justify-center">
              <img src="/lovetoons-logo.png" alt="Master Logo" className="h-12 w-auto object-contain drop-shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
