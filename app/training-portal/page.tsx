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
  ArrowLeft,
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
  Filter,
  Upload,
  Plus,
  Trash2,
  Pencil,
  Link2,
  LogOut,
  FileVideo,
  Shield,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'
import { ARCHIVED_TRAINING_VIDEOS, VideoItem } from '@/lib/data/trainingVideosData'

export interface TrainingUser {
  id: string
  name: string
  email: string
  agency: string
  role: string
  roleLabel?: string
  initials: string
  isAdmin?: boolean
  isPortalAdmin?: boolean
  avatar?: string
  registeredAt: string
}

export default function TrainingPortalPage() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<TrainingUser | null>(null)

  // Computed check: Is the logged-in user authorized as Portal Admin?
  const isPortalAdmin = useMemo(() => {
    if (!currentUser) return false
    return Boolean(
      currentUser.isPortalAdmin ||
      currentUser.role === 'portal_admin' ||
      currentUser.role === 'portal admn' ||
      currentUser.role?.toLowerCase() === 'portal admin' ||
      currentUser.role?.toLowerCase() === 'portal admn' ||
      currentUser.roleLabel?.toLowerCase().includes('portal admin') ||
      currentUser.roleLabel?.toLowerCase().includes('portal admn') ||
      currentUser.email?.toLowerCase() === 'portaladmin@kiddiesmedia.org' ||
      currentUser.email?.toLowerCase() === 'admin@kmmtraining.org' ||
      currentUser.role === 'super_admin'
    )
  }, [currentUser])

  // Navigation tab: 'overview' | 'video' | 'accreditation' | 'admin'
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'accreditation' | 'admin'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showRightDetails, setShowRightDetails] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Masterclasses state (built-in + admin uploaded)
  const [masterclasses, setMasterclasses] = useState<VideoItem[]>(ARCHIVED_TRAINING_VIDEOS)

  // Currently active / selected video from the list (null = show all list view)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(230) // 03:50 into video
  const totalDuration = 1470 // 24:30
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)

  // Admin & Masterclass Upload State
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCode, setUploadCode] = useState('')
  const [uploadCategory, setUploadCategory] = useState('copyright')
  const [uploadDuration, setUploadDuration] = useState('20:00')
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadVideoUrl, setUploadVideoUrl] = useState('')
  const [uploadVideoSourceType, setUploadVideoSourceType] = useState<'upload' | 'url'>('upload')
  const [uploadVideoFile, setUploadVideoFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedFileSize, setUploadedFileSize] = useState('')
  const [uploadPoints, setUploadPoints] = useState<string[]>([
    'Mandatory Work-for-Hire assignment executed prior to principal recording.',
    'Signed parental consent deed archived for all participating minor voices.',
    'Logged AI transparency declaration and human creative oversight ratio.',
  ])
  const [newPointInput, setNewPointInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Edit Masterclass State
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editCategory, setEditCategory] = useState('copyright')
  const [editDuration, setEditDuration] = useState('20:00')
  const [editDesc, setEditDesc] = useState('')
  const [editVideoUrl, setEditVideoUrl] = useState('')
  const [editVideoSourceType, setEditVideoSourceType] = useState<'upload' | 'url'>('upload')
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null)
  const [editUploadedFileName, setEditUploadedFileName] = useState('')
  const [editUploadedFileSize, setEditUploadedFileSize] = useState('')
  const [editPoints, setEditPoints] = useState<string[]>([])
  const [editNewPointInput, setEditNewPointInput] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Completed modules tracking (maps video.id to boolean)
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    'vid-1': true,
  })

  const [toastMessage, setToastMessage] = useState('')
  const [copiedHash, setCopiedHash] = useState(false)

  // Video Chapters for selected video
  const currentChapters = useMemo(() => {
    if (!selectedVideo) return []
    if (selectedVideo.id === 'vid-1') {
      return [
        { time: '00:00', seconds: 0, title: 'Introduction: The Sacred Trust of Children’s IP', desc: 'Understanding the divine stewardship of children’s media and statutory copyright.' },
        { time: '04:15', seconds: 255, title: 'Statutory Chain of Title & Work-for-Hire', desc: 'Executing unconditional assignments for writers, composers, and animators.' },
        { time: '09:30', seconds: 570, title: 'Minor Performer & Voice Likeness Consent', desc: 'Step-by-step parental release deeds and on-set chaperone protocols.' },
        { time: '14:45', seconds: 885, title: 'AI Transparency & Prompt Preservation', desc: 'Mandatory logging of AI tools, human oversight %, and external training data.' },
        { time: '19:20', seconds: 1160, title: 'Character Silhouette & Trademark Defense', desc: 'Securing character names, vocal signatures, and visual models against infringement.' },
        { time: '23:10', seconds: 1390, title: 'Playout Sign-off & Legal Accreditation', desc: 'Directorate quality sign-off and satellite broadcast certificate generation.' },
      ]
    }
    // Generated chapter checkpoints from points
    return selectedVideo.points.map((pt, idx) => {
      const stepSeconds = idx * 240
      const mins = Math.floor(stepSeconds / 60)
      const secs = stepSeconds % 60
      return {
        time: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        seconds: stepSeconds,
        title: `Chapter ${idx + 1}: ${pt.split(':')[0] || pt.slice(0, 35)}`,
        desc: pt,
      }
    })
  }, [selectedVideo])

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

    // STRICT AUTHENTICATION CHECK: Must have valid session
    const storedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('kmm_training_user') : null
    if (!storedUserRaw) {
      router.push('/auth?redirect=/training-portal')
      return
    }

    let activeSessionUser: TrainingUser | null = null
    try {
      const user: TrainingUser = JSON.parse(storedUserRaw)
      if (user && user.email) {
        activeSessionUser = user
        setCurrentUser(user)
      } else {
        router.push('/auth?redirect=/training-portal')
        return
      }
    } catch {
      router.push('/auth?redirect=/training-portal')
      return
    }

    // Load completed modules
    try {
      const savedModules = localStorage.getItem('kmm_completed_modules')
      if (savedModules) {
        setCompletedModules(JSON.parse(savedModules))
      }
    } catch (e) {
      console.warn(e)
    }

    // Load persisted masterclasses catalog from storage
    try {
      const storedCatalog = localStorage.getItem('kmm_masterclasses_catalog')
      if (storedCatalog) {
        const catalogItems: VideoItem[] = JSON.parse(storedCatalog)
        if (Array.isArray(catalogItems) && catalogItems.length > 0) {
          setMasterclasses(catalogItems)
        }
      } else {
        const storedCustom = localStorage.getItem('kmm_custom_masterclasses')
        if (storedCustom) {
          const customItems: VideoItem[] = JSON.parse(storedCustom)
          if (Array.isArray(customItems) && customItems.length > 0) {
            setMasterclasses([...ARCHIVED_TRAINING_VIDEOS, ...customItems])
          }
        }
      }
    } catch (e) {
      console.warn('Could not load masterclasses catalog', e)
    }

    // Check query params for tab switching or specific video id
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      const vidParam = urlParams.get('v') || urlParams.get('id')
      if (vidParam) {
        const found = ARCHIVED_TRAINING_VIDEOS.find((v) => v.id === vidParam)
        if (found) {
          setSelectedVideo(found)
          setActiveTab('video')
        }
      } else if (tabParam === 'admin') {
        const hasAdminAccess = Boolean(
          activeSessionUser && (
            activeSessionUser.isPortalAdmin ||
            activeSessionUser.role === 'portal_admin' ||
            activeSessionUser.role === 'portal admn' ||
            activeSessionUser.role?.toLowerCase() === 'portal admin' ||
            activeSessionUser.role?.toLowerCase() === 'portal admn' ||
            activeSessionUser.roleLabel?.toLowerCase().includes('portal admin') ||
            activeSessionUser.roleLabel?.toLowerCase().includes('portal admn') ||
            activeSessionUser.email?.toLowerCase() === 'portaladmin@kiddiesmedia.org' ||
            activeSessionUser.email?.toLowerCase() === 'admin@kmmtraining.org' ||
            activeSessionUser.role === 'super_admin'
          )
        )
        if (hasAdminAccess) {
          setActiveTab('admin')
        } else {
          setActiveTab('overview')
        }
      } else if (tabParam === 'video' || tabParam === 'watch') {
        setActiveTab('video')
      } else if (tabParam === 'accreditation') {
        setActiveTab('accreditation')
      }
    }
  }, [router])

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

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setActiveTab('video')
    setCurrentTime(0)
    setActiveChapterIndex(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => { })
      setIsPlaying(true)
    }
    // Smooth scroll to video player
    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleVideoPlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch(() => { })
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
        videoRef.current.play().catch(() => { })
        setIsPlaying(true)
      }
    }
  }

  const toggleModuleCompletion = (videoId: string) => {
    const current = !!completedModules[videoId]
    const next = !current
    const updated = { ...completedModules, [videoId]: next }
    setCompletedModules(updated)
    localStorage.setItem('kmm_completed_modules', JSON.stringify(updated))
    showNotification(next ? '✓ Masterclass marked as completed! Milestone recorded.' : 'Module marked in progress.')
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Filtered masterclass videos
  const filteredVideos = useMemo(() => {
    return masterclasses.filter((v) => {
      const matchesSearch =
        !searchQuery.trim() ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.desc.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [masterclasses, searchQuery, categoryFilter])

  const completedCount = useMemo(() => {
    return Object.values(completedModules).filter(Boolean).length
  }, [completedModules])

  // Helper to upload a video file directly to the VPS server
  const uploadVideoToServer = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', 'video')
    formData.append('ministryId', 'min-kmm')

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok || !data.file?.url) {
      throw new Error(data?.error || 'Failed to upload video to VPS server.')
    }

    return data.file.url
  }

  // Video File attachment handler
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('video/')) {
        showNotification('⚠️ Please select a valid video file (MP4, WebM, MOV)')
        return
      }
      setUploadVideoFile(file)
      setUploadedFileName(file.name)
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setUploadedFileSize(`${sizeMb} MB`)
      showNotification(`✓ Video file "${file.name}" selected. Will be saved to VPS server.`)
    }
  }

  // Publish new masterclass
  const handlePublishMasterclass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPortalAdmin) {
      showNotification('⚠️ Unauthorized: Only the Portal Admin role can publish masterclasses.')
      return
    }
    if (!uploadTitle.trim()) {
      showNotification('⚠️ Please provide a masterclass title.')
      return
    }
    if (!uploadCode.trim()) {
      showNotification('⚠️ Please provide a course code.')
      return
    }

    setIsUploading(true)

    // Handle video URL based on selected source type
    let finalVideoUrl = uploadVideoUrl.trim()

    if (uploadVideoSourceType === 'upload') {
      if (uploadVideoFile) {
        showNotification('⏳ Uploading video file to VPS server storage...')
        try {
          finalVideoUrl = await uploadVideoToServer(uploadVideoFile)
        } catch (uploadErr: any) {
          showNotification(`⚠️ Video upload failed: ${uploadErr.message}`)
          setIsUploading(false)
          return
        }
      } else if (!finalVideoUrl) {
        finalVideoUrl = '/kmm-welcome-animation.mp4'
      }
    } else {
      if (!finalVideoUrl) {
        finalVideoUrl = '/kmm-welcome-animation.mp4'
      }
    }

    const categoryLabels: Record<string, string> = {
      copyright: 'Copyright & Sovereign IP',
      protection: 'Child Protection & Safeguards',
      broadcast: 'Broadcast Standards & Playout',
      doctrinal: 'Scriptural Review & Canon',
      merchandising: 'Merchandising & Contracts',
    }

    const newVideo: VideoItem = {
      id: `custom-vid-${Date.now().toString().slice(-6)}`,
      code: uploadCode.trim().toUpperCase(),
      title: uploadTitle.trim(),
      category: uploadCategory,
      categoryLabel: categoryLabels[uploadCategory] || 'Sovereign Masterclass',
      duration: uploadDuration.trim() || '15:00',
      avatarBg: 'linear-gradient(135deg, #0284C7, #F59E0B)',
      videoUrl: finalVideoUrl,
      desc: uploadDesc.trim() || 'Institutional training module for media contributors.',
      gradient: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
      glow: 'radial-gradient(circle at 50% 40%, rgba(2, 132, 199, 0.35) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)',
      points: uploadPoints.filter(Boolean),
      citations: ['KMM Sovereign IP Charter Art. IV & VI', 'Children’s Media Protection Accord 2026'],
      isCustom: true,
      createdAt: new Date().toISOString(),
    }

    // Call API (graceful offline fallback)
    try {
      await fetch('/api/training/masterclasses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      })
    } catch (apiErr) {
      console.warn('API sync skipped:', apiErr)
    }

    const updated = [newVideo, ...masterclasses]
    setMasterclasses(updated)

    // Save in localStorage
    try {
      localStorage.setItem('kmm_masterclasses_catalog', JSON.stringify(updated))
      const customOnly = updated.filter((v) => v.isCustom)
      localStorage.setItem('kmm_custom_masterclasses', JSON.stringify(customOnly))
    } catch (saveErr) {
      console.warn('Could not save custom masterclasses:', saveErr)
    }

    setIsUploading(false)
    setShowUploadModal(false)
    // Reset form
    setUploadTitle('')
    setUploadCode('')
    setUploadDesc('')
    setUploadVideoUrl('')
    setUploadVideoFile(null)
    setUploadedFileName('')
    setUploadedFileSize('')
    setUploadVideoSourceType('upload')
    showNotification('🎉 Masterclass uploaded & published to curriculum library!')
  }

  // Delete masterclass (available for any masterclass when logged in as portal admin)
  const handleDeleteMasterclass = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!isPortalAdmin) {
      showNotification('⚠️ Unauthorized: Portal Admin role required to delete masterclasses.')
      return
    }
    const target = masterclasses.find((v) => v.id === id)
    const targetTitle = target ? `"${target.title}" (${target.code})` : 'this masterclass'
    if (!window.confirm(`Are you sure you want to delete ${targetTitle} from the curriculum? This will remove the video module.`)) {
      return
    }

    const updated = masterclasses.filter((v) => v.id !== id)
    setMasterclasses(updated)

    try {
      localStorage.setItem('kmm_masterclasses_catalog', JSON.stringify(updated))
      const customOnly = updated.filter((v) => v.isCustom)
      localStorage.setItem('kmm_custom_masterclasses', JSON.stringify(customOnly))
    } catch (saveErr) {
      console.warn(saveErr)
    }

    // Call backend API
    try {
      await fetch(`/api/training/masterclasses?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
    } catch (apiErr) {
      console.warn('API delete sync skipped:', apiErr)
    }

    if (selectedVideo?.id === id) {
      setSelectedVideo(null)
    }
    showNotification(`🗑️ Masterclass ${targetTitle} has been deleted.`)
  }

  // Open Edit Masterclass Modal
  const handleOpenEditModal = (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!isPortalAdmin) {
      showNotification('⚠️ Unauthorized: Portal Admin role required to edit masterclasses.')
      return
    }
    setEditingVideo(video)
    setEditTitle(video.title)
    setEditCode(video.code)
    setEditCategory(video.category || 'copyright')
    setEditDuration(video.duration || '15:00')
    setEditDesc(video.desc || '')
    setEditVideoUrl(video.videoUrl || '/kmm-welcome-animation.mp4')
    setEditVideoSourceType(video.videoUrl?.startsWith('/uploads/') ? 'upload' : 'url')
    setEditVideoFile(null)
    setEditPoints(video.points && video.points.length > 0 ? [...video.points] : [
      'Statutory Work-for-Hire protocol executed and archived.',
      'Parental consent documentation verified for all minor voices.',
    ])
    setEditUploadedFileName('')
    setEditUploadedFileSize('')
    setEditNewPointInput('')
  }

  // Handle Edit Video File
  const handleEditVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditVideoFile(file)
      const objectUrl = URL.createObjectURL(file)
      setEditVideoUrl(objectUrl)
      setEditUploadedFileName(file.name)
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setEditUploadedFileSize(`${sizeMb} MB`)
      showNotification(`✓ New video attached: "${file.name}" (will upload to VPS upon saving)`)
    }
  }

  // Save Edit Masterclass
  const handleSaveEditMasterclass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return
    if (!isPortalAdmin) {
      showNotification('⚠️ Unauthorized: Portal Admin role required.')
      return
    }
    if (!editTitle.trim()) {
      showNotification('⚠️ Please provide a masterclass title.')
      return
    }
    if (!editCode.trim()) {
      showNotification('⚠️ Please provide a course code.')
      return
    }

    setIsSavingEdit(true)

    // Handle VPS file upload if a new file was chosen in 'upload' mode
    let finalVideoUrl = editVideoUrl.trim() || editingVideo.videoUrl || '/kmm-welcome-animation.mp4'
    if (editVideoSourceType === 'upload' && editVideoFile) {
      showNotification('⏳ Uploading updated video file to VPS server storage...')
      try {
        finalVideoUrl = await uploadVideoToServer(editVideoFile)
      } catch (uploadErr: any) {
        showNotification(`⚠️ Video upload failed: ${uploadErr.message}`)
        setIsSavingEdit(false)
        return
      }
    }

    const categoryLabels: Record<string, string> = {
      copyright: 'Copyright & Sovereign IP',
      protection: 'Child Protection & Safeguards',
      broadcast: 'Broadcast Standards & Playout',
      doctrinal: 'Scriptural Review & Canon',
      merchandising: 'Merchandising & Contracts',
    }

    const updatedVideo: VideoItem = {
      ...editingVideo,
      title: editTitle.trim(),
      code: editCode.trim().toUpperCase(),
      category: editCategory,
      categoryLabel: categoryLabels[editCategory] || editingVideo.categoryLabel || 'Sovereign Masterclass',
      duration: editDuration.trim() || editingVideo.duration || '15:00',
      desc: editDesc.trim() || editingVideo.desc,
      videoUrl: finalVideoUrl,
      points: editPoints.filter(Boolean),
    }

    const updatedList = masterclasses.map((v) => (v.id === editingVideo.id ? updatedVideo : v))
    setMasterclasses(updatedList)

    if (selectedVideo?.id === editingVideo.id) {
      setSelectedVideo(updatedVideo)
    }

    try {
      localStorage.setItem('kmm_masterclasses_catalog', JSON.stringify(updatedList))
      const customOnly = updatedList.filter((v) => v.isCustom)
      localStorage.setItem('kmm_custom_masterclasses', JSON.stringify(customOnly))
    } catch (saveErr) {
      console.warn('Could not save edited catalog:', saveErr)
    }

    try {
      await fetch('/api/training/masterclasses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVideo),
      })
    } catch (apiErr) {
      console.warn('API edit sync skipped:', apiErr)
    }

    setIsSavingEdit(false)
    setEditingVideo(null)
    setEditVideoFile(null)
    showNotification('✓ Masterclass updated and published to curriculum!')
  }

  // Sign out officer session
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      if (window.confirm('Are you sure you want to log out of KMM Training Portal?')) {
        localStorage.removeItem('kmm_training_user')
        localStorage.removeItem('kmm_auth_officer')
        router.push('/auth')
      }
    }
  }

  if (!isMounted || !currentUser) {
    return (
      <div className="h-screen w-full bg-[#F8F9FA] dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Verifying Officer Accreditation Session...</p>
        </div>
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

      {/* Main Layout Container: 100% fixed height, sidebars do not move */}
      <div className="flex-1 flex h-full overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: FIXED / STATIONARY (Does not move)          */}
        {/* ========================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 h-full bg-white dark:bg-[#121624] border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between p-5 transition-transform duration-200 md:static md:translate-x-0 shrink-0 overflow-y-auto ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activeTab === 'overview'
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
                  setSelectedVideo(null)
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activeTab === 'video'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                  }`}
              >
                <Tv className={`size-4 ${activeTab === 'video' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Masterclass Videos</span>
                <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {masterclasses.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('accreditation')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activeTab === 'accreditation'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                  }`}
              >
                <GraduationCap className={`size-4 ${activeTab === 'accreditation' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Accreditation Certificate</span>
              </button>

              {/* Admin Dashboard Item - ONLY VISIBLE TO PORTAL ADMIN */}
              {isPortalAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('admin')
                    setMobileSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activeTab === 'admin'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <ShieldCheck className={`size-4 ${activeTab === 'admin' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Admin Dashboard</span>
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Portal Admin
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Card: Legal Guidance / Action Card */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            {/* Authenticated Officer Session & Sign Out */}
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-gradient-to-tr from-[#0284C7] to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {currentUser?.initials || 'OF'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Authenticated Officer'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    {isPortalAdmin && (
                      <span className="inline-flex items-center px-1 py-0.2 rounded-sm bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[8px] uppercase">
                        Admin
                      </span>
                    )}
                    <span className="truncate">{currentUser?.roleLabel || currentUser?.role || 'Child Safeguarding Officer'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign out of Training Portal"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
              >
                <LogOut className="size-4" />
              </button>
            </div>

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
                      ? selectedVideo
                        ? selectedVideo.title
                        : 'Masterclass Video Catalog'
                      : activeTab === 'accreditation'
                        ? 'Accreditation Certificate'
                        : 'Training Portal Admin Dashboard'}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {activeTab === 'video' && selectedVideo
                    ? `${selectedVideo.code} • ${selectedVideo.title}`
                    : activeTab === 'admin'
                    ? 'Masterclass Uploads & Accreditation Governance'
                    : 'Sovereign Intellectual Property & Statutory Child Protection'}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search masterclasses, topics, covenants..."
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

          {/* DYNAMIC TAB CONTENT (Changes smoothly as user switches tabs) */}
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
                      <span>{completedCount} of {ARCHIVED_TRAINING_VIDEOS.length} Masterclasses Completed</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Welcome back, {currentUser?.name || 'Officer'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                      Access all {ARCHIVED_TRAINING_VIDEOS.length} institutional training masterclasses covering sovereign IP ownership, work-for-hire vesting, and child safeguards.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectVideo(ARCHIVED_TRAINING_VIDEOS[0])}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer shrink-0"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Resume Premier Masterclass</span>
                  </button>
                </div>

                {/* Section: Continue Learning (Active Cards) */}
                <section className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Continue Learning
                    </h2>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Curriculum Tracks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Course 1: The Introductory IP Masterclass */}
                    <div
                      onClick={() => handleSelectVideo(ARCHIVED_TRAINING_VIDEOS[0])}
                      className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-amber-500/50 dark:hover:border-amber-400/50 transition cursor-pointer space-y-4 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-105 transition-transform">
                          <Scale className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {ARCHIVED_TRAINING_VIDEOS[0].categoryLabel}
                          </div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {ARCHIVED_TRAINING_VIDEOS[0].title}
                          </h3>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: completedModules[ARCHIVED_TRAINING_VIDEOS[0].id] ? '100%' : '65%' }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <BookOpen className="size-3 text-amber-500" />
                            <span>{ARCHIVED_TRAINING_VIDEOS[0].code} &bull; {ARCHIVED_TRAINING_VIDEOS[0].duration}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            <span>{completedModules[ARCHIVED_TRAINING_VIDEOS[0].id] ? 'Completed' : 'In Progress'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                        <span>{completedModules[ARCHIVED_TRAINING_VIDEOS[0].id] ? 'Review Video' : 'Resume Masterclass'}</span>
                        <span className="group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                    </div>

                    {/* Course 2: Sovereign Title & Deeds */}
                    <div
                      onClick={() => handleSelectVideo(ARCHIVED_TRAINING_VIDEOS[2] || ARCHIVED_TRAINING_VIDEOS[0])}
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
                            Copyright Clearances &amp; Character Likeness
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
                            <span>LAW-204 &bull; 22:30</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Certified Curriculum</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                        <span>Review Masterclass</span>
                        <span className="group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: All Masterclass Videos Grid (Inspired by Focotech "Recommended Courses") */}
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Curriculum Masterclasses ({filteredVideos.length})
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Select any video below to watch the full recording with chapter markers and legal points.
                      </p>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'copyright', label: 'Sovereign IP' },
                        { id: 'protection', label: 'Safeguards' },
                        { id: 'broadcast', label: 'Broadcast' },
                        { id: 'doctrinal', label: 'Scriptural' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryFilter(cat.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${categoryFilter === cat.id
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* The Video Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleSelectVideo(video)}
                        className={`rounded-2xl bg-white dark:bg-[#151928] border transition cursor-pointer flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-md ${selectedVideo?.id === video.id
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-slate-200/80 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-500/40'
                          }`}
                      >
                        {/* Video Thumbnail Box */}
                        <div
                          onContextMenu={(e) => { e.preventDefault(); return false; }}
                          className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none"
                        >
                          <video
                            src={video.videoUrl || "/kmm-welcome-animation.mp4"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                            muted
                            controlsList="nodownload nofullscreen noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={(e) => { e.preventDefault(); return false; }}
                            onDragStart={(e) => e.preventDefault()}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="size-11 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="size-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-amber-400 border border-amber-500/30">
                            {video.code}
                          </span>

                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                            {video.duration}
                          </span>

                          {completedModules[video.id] && (
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                              <Check className="size-2.5 stroke-3" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>

                        {/* Video Details */}
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              {video.categoryLabel}
                            </div>
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {video.desc}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">
                              ★ 5.0 Ministry Certified
                            </span>
                            <span className="font-mono text-slate-400">
                              {video.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: MASTERCLASS VIDEOS                                 */}
            {/* Case A: !selectedVideo -> Masterclass Library / Catalog    */}
            {/* Case B: selectedVideo  -> Detailed Cinema Video Player     */}
            {/* ========================================================= */}
            {activeTab === 'video' && !selectedVideo && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Catalog Hero Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-sky-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      <span>Institutional Masterclasses Catalog</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Masterclass Video Library
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Select any masterclass below to open its dedicated view with cinema video recording, curriculum chapter markers, and statutory legal covenants.
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs text-center min-w-[110px]">
                      <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                        {ARCHIVED_TRAINING_VIDEOS.length}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Masterclasses
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs text-center min-w-[110px]">
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {completedCount}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter and Category Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      Curriculum Masterclasses ({filteredVideos.length})
                    </span>
                    {searchQuery && (
                      <span className="text-xs text-slate-400">
                        matching &ldquo;{searchQuery}&rdquo;
                      </span>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'All Categories' },
                      { id: 'copyright', label: 'Sovereign IP' },
                      { id: 'protection', label: 'Safeguards' },
                      { id: 'broadcast', label: 'Broadcast' },
                      { id: 'doctrinal', label: 'Scriptural' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${categoryFilter === cat.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Masterclasses Grid View */}
                {filteredVideos.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#151928] border border-dashed border-slate-300 dark:border-white/10 space-y-3">
                    <Tv className="size-10 text-slate-400 mx-auto" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">No Masterclasses Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No video modules match your current filter or search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setCategoryFilter('all')
                        setSearchQuery('')
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleSelectVideo(video)}
                        className="rounded-3xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 transition cursor-pointer flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-400/50 hover:-translate-y-0.5 duration-200"
                      >
                        {/* Video Thumbnail Box */}
                        <div
                          onContextMenu={(e) => { e.preventDefault(); return false; }}
                          className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none"
                        >
                          <video
                            src={video.videoUrl || "/kmm-welcome-animation.mp4"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                            muted
                            controlsList="nodownload nofullscreen noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={(e) => { e.preventDefault(); return false; }}
                            onDragStart={(e) => e.preventDefault()}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="size-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="size-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-black/80 text-amber-400 border border-amber-500/30 backdrop-blur-xs">
                            {video.code}
                          </span>

                          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-black/80 text-white backdrop-blur-xs">
                            {video.duration}
                          </span>

                          {completedModules[video.id] && (
                            <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                              <Check className="size-2.5 stroke-3" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>

                        {/* Video Details */}
                        <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                {video.categoryLabel}
                              </span>
                            </div>
                            <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {video.desc}
                            </p>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-500 text-[11px] flex items-center gap-1">
                                <span>★ 5.0 Curriculum Certified</span>
                              </span>
                              <span className="font-mono text-[11px] text-slate-400">
                                {video.duration}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSelectVideo(video)
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 group-hover:bg-amber-500 text-amber-700 dark:text-amber-300 group-hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <span>{completedModules[video.id] ? 'Rewatch Masterclass' : 'Watch Masterclass'}</span>
                                <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                              {isPortalAdmin && (
                                <>
                                  <button
                                    onClick={(e) => handleOpenEditModal(video, e)}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer shrink-0"
                                    title="Edit Masterclass"
                                  >
                                    <Pencil className="size-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteMasterclass(video.id, e)}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer shrink-0"
                                    title="Delete Masterclass"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Case B: Detail View with Cinema Video Player */}
            {activeTab === 'video' && selectedVideo && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Back to Catalog Button & Header Bar */}
                <div ref={playerContainerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer w-fit group"
                    >
                      <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform text-amber-500" />
                      <span>Back to Masterclass Library</span>
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-mono">
                          {selectedVideo.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {selectedVideo.categoryLabel}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {selectedVideo.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleModuleCompletion(selectedVideo.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${completedModules[selectedVideo.id]
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        }`}
                    >
                      {completedModules[selectedVideo.id] ? (
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

                    {isPortalAdmin && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(selectedVideo)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition cursor-pointer"
                          title="Edit Masterclass Details"
                        >
                          <Pencil className="size-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMasterclass(selectedVideo.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition cursor-pointer"
                          title="Delete Masterclass"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hero Cinema Player */}
                <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#151928] p-4 sm:p-6 shadow-sm space-y-5">
                  <div
                    onContextMenu={(e) => { e.preventDefault(); return false; }}
                    className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center group select-none"
                  >
                    <video
                      ref={videoRef}
                      src={selectedVideo.videoUrl || "/kmm-welcome-animation.mp4"}
                      className="w-full h-full object-cover select-none pointer-events-auto"
                      muted={isMuted}
                      controlsList="nodownload nofullscreen noplaybackrate"
                      disablePictureInPicture
                      onContextMenu={(e) => { e.preventDefault(); return false; }}
                      onDragStart={(e) => e.preventDefault()}
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setCurrentTime(videoRef.current.currentTime)
                        }
                      }}
                      onEnded={() => {
                        setIsPlaying(false)
                        if (!completedModules[selectedVideo.id]) toggleModuleCompletion(selectedVideo.id)
                      }}
                      playsInline
                    />

                    {/* Top Overlay Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
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
                            {currentChapters[activeChapterIndex]?.title}
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

                  {/* Curriculum & Meta Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-sm shadow-2xs shrink-0 border border-amber-500/20">
                        <Scale className="size-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                          KMM Institutional Curriculum
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedVideo.categoryLabel} &bull; {selectedVideo.duration}
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
                      {currentChapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSeek(ch.seconds, idx)}
                          className={`text-left p-3 rounded-xl border transition text-xs flex flex-col justify-between gap-1 cursor-pointer ${activeChapterIndex === idx
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
                      {selectedVideo.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                          <CheckCircle2 className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section: Other Curriculum Masterclasses */}
                <section className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                        Other Masterclasses in Curriculum ({Math.max(0, masterclasses.length - 1)})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Explore more specialized training modules on sovereign copyright, safeguarding deeds, and media compliance.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer w-fit"
                    >
                      <span>View All in Library</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {masterclasses.filter((v) => v.id !== selectedVideo.id).map((v) => (
                      <div
                        key={v.id}
                        onClick={() => handleSelectVideo(v)}
                        className="rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-400/50 transition cursor-pointer flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-md hover:-translate-y-0.5 duration-200"
                      >
                        {/* Video Thumbnail Box */}
                        <div
                          onContextMenu={(e) => { e.preventDefault(); return false; }}
                          className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none"
                        >
                          <video
                            src={v.videoUrl || "/kmm-welcome-animation.mp4"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                            muted
                            controlsList="nodownload nofullscreen noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={(e) => { e.preventDefault(); return false; }}
                            onDragStart={(e) => e.preventDefault()}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="size-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="size-4 fill-current ml-0.5" />
                            </div>
                          </div>

                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-amber-400 border border-amber-500/30 backdrop-blur-xs">
                            {v.code}
                          </span>

                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white backdrop-blur-xs">
                            {v.duration}
                          </span>

                          {completedModules[v.id] && (
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                              <Check className="size-2.5 stroke-3" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>

                        {/* Video Details */}
                        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                {v.categoryLabel}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {v.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {v.desc}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-amber-500 shrink-0 flex items-center gap-1">
                                ★ 5.0 Certified
                              </span>
                              <span className="font-mono text-slate-400 text-[10px]">
                                {v.duration}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectVideo(v)
                              }}
                              className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 group-hover:bg-amber-500 text-amber-700 dark:text-amber-300 group-hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <span>Watch Masterclass</span>
                              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
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
                      Has satisfactorily completed all curricular requirements under <b>{(selectedVideo || ARCHIVED_TRAINING_VIDEOS[0]).code}: {(selectedVideo || ARCHIVED_TRAINING_VIDEOS[0]).title}</b>, validating sovereign chain of title, Work-for-Hire covenants, parental consent deeds, and AI transparency.
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
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">KMM-ACR-2026-{(selectedVideo || ARCHIVED_TRAINING_VIDEOS[0]).id.toUpperCase()}</span>
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
                        const hashId = (selectedVideo || ARCHIVED_TRAINING_VIDEOS[0]).id.toUpperCase()
                        navigator.clipboard.writeText(`https://kmm-portal.internal/verify/KMM-ACR-2026-${hashId}`)
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

            {/* ========================================================= */}
            {/* TAB 4: ADMIN DASHBOARD & MASTERCLASSES UPLOAD             */}
            {/* STRICTLY RESTRICTED TO ROLE: PORTAL ADMIN                 */}
            {/* ========================================================= */}
            {activeTab === 'admin' && (
              isPortalAdmin ? (
                <div className="space-y-8 animate-in fade-in duration-200">
                {/* Admin Hero Bar */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-sky-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                      <Shield className="size-3.5 text-amber-500" />
                      <span>Directorate Admin Panel</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Masterclass Management &amp; Uploads
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Publish official masterclasses, configure curriculum chapter checkpoints, attach statutory covenants, and govern officer training accreditation.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                    >
                      <Plus className="size-4 stroke-3" />
                      <span>Upload Masterclass</span>
                    </button>
                  </div>
                </div>

                {/* 4 Stats Cards in Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Masterclasses</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{masterclasses.length}</div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Active in curriculum</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Uploads</div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                      {masterclasses.filter((v) => v.isCustom).length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">Added via admin panel</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Officer Completions</div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {completedCount}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified accreditations</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Video DRM &amp; Protection</div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1.5">
                      <ShieldCheck className="size-4" />
                      <span>No-Download DRM Active</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Stream-only protected playback</div>
                  </div>
                </div>

                {/* Masterclasses Table */}
                <div className="rounded-3xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        Curriculum Masterclasses Repository ({masterclasses.length})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Review, inspect, or manage all institutional video modules published to the training portal.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>New Masterclass</span>
                    </button>
                  </div>

                  {/* Table Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          <th className="py-3 px-3">Module</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Duration</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {masterclasses.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                <div
                                  onContextMenu={(e) => { e.preventDefault(); return false; }}
                                  className="relative size-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center select-none"
                                >
                                  <video
                                    src={v.videoUrl || '/kmm-welcome-animation.mp4'}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                    muted
                                    controlsList="nodownload nofullscreen noplaybackrate"
                                    disablePictureInPicture
                                    onContextMenu={(e) => { e.preventDefault(); return false; }}
                                  />
                                  <Play className="absolute size-3.5 text-amber-400 fill-current" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    {v.code}
                                  </div>
                                  <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                                    {v.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {v.categoryLabel}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-mono font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {v.duration}
                            </td>
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {v.isCustom ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  <span>Custom Upload</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                  <span>Core Curriculum</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSelectVideo(v)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer inline-flex items-center gap-1"
                                  title="Play Masterclass"
                                >
                                  <Play className="size-3 fill-current text-amber-500" />
                                  <span>Play</span>
                                </button>
                                <button
                                  onClick={(e) => handleOpenEditModal(v, e)}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                                  title="Edit Masterclass"
                                >
                                  <Pencil className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteMasterclass(v.id, e)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                                  title="Delete Masterclass"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              ) : (
                <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm animate-in fade-in">
                  <div className="size-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/20">
                    <ShieldAlert className="size-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Access Restricted
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      The Training Portal Admin Dashboard is strictly reserved for users with the <strong className="text-slate-800 dark:text-slate-200 font-bold">Portal Admin</strong> role. Your current account ({currentUser?.email}) does not have administrative permissions.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      Return to Curriculum Overview
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                    >
                      Sign In as Portal Admin
                    </button>
                  </div>
                </div>
              )
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
                    {currentUser?.roleLabel || currentUser?.role || 'Officer'}
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

            {/* Quick Playlist / Up Next (Direct switcher in right sidebar) */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Up Next &bull; Masterclasses</span>
                <span className="text-[10px] font-bold text-slate-400">{completedCount}/{masterclasses.length} Completed</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {masterclasses.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVideo(v)}
                    className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between gap-2 cursor-pointer ${selectedVideo?.id === v.id
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'hover:bg-white dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] truncate">{v.title}</div>
                      <div className="text-[9px] text-slate-400">{v.code} &bull; {v.duration}</div>
                    </div>
                    {completedModules[v.id] ? (
                      <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    ) : (
                      <Play className="size-3 text-slate-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Streak Tracker */}
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
                      className={`py-2 px-1 rounded-xl text-center transition ${item.active
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
                    <span>In Progress</span>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    {Math.max(0, masterclasses.length - completedCount)} Left
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700/40 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                    <ShieldCheck className="size-3 text-emerald-500" />
                    <span>Completed</span>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    {completedCount} Videos
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Watch Time Chart */}
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
                        className={`w-full rounded-t-md transition-all ${bar.active
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

      {/* Upload Masterclass Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#151928] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Upload className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Upload New Masterclass
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publish curriculum recording and attach statutory covenants.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Upload Form */}
            <form onSubmit={handlePublishMasterclass} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Masterclass Title *
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. AI Prompt Transparency & Likeness Consent"
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Institutional Code *
                  </label>
                  <input
                    type="text"
                    value={uploadCode}
                    onChange={(e) => setUploadCode(e.target.value)}
                    placeholder="e.g. KMM-AI-201"
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Curriculum Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500 cursor-pointer"
                  >
                    <option value="copyright">Copyright &amp; Sovereign IP</option>
                    <option value="protection">Child Protection &amp; Safeguards</option>
                    <option value="broadcast">Broadcast Standards &amp; Playout</option>
                    <option value="doctrinal">Scriptural Review &amp; Canon</option>
                    <option value="merchandising">Merchandising &amp; Contracts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Video Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={uploadDuration}
                    onChange={(e) => setUploadDuration(e.target.value)}
                    placeholder="e.g. 18:30"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Video Source Selection (Upload to VPS vs Provide URL) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Masterclass Video Source *
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Protected Streaming &bull; Download Disabled
                  </span>
                </div>

                {/* Source Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setUploadVideoSourceType('upload')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      uploadVideoSourceType === 'upload'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Upload className="size-3.5 text-amber-500" />
                    <span>Upload to Server (VPS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadVideoSourceType('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      uploadVideoSourceType === 'url'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Link2 className="size-3.5 text-amber-500" />
                    <span>Provide Video URL</span>
                  </button>
                </div>

                {/* Mode 1: File Upload (VPS) */}
                {uploadVideoSourceType === 'upload' ? (
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-5 text-center hover:border-amber-500/60 transition cursor-pointer bg-slate-50/50 dark:bg-slate-900/30">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                        <FileVideo className="size-5" />
                      </div>
                      {uploadedFileName ? (
                        <div>
                          <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                            ✓ File Attached: {uploadedFileName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{uploadedFileSize} &bull; Uploads to VPS server</div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            Click to browse or drop video file here
                          </div>
                          <div className="text-[10px] text-slate-400">
                            MP4, WebM or MOV up to 500MB (Saved to VPS <span className="font-mono text-amber-600 dark:text-amber-400">public/uploads</span>)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Mode 2: Direct Video URL */
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={uploadVideoUrl}
                        onChange={(e) => setUploadVideoUrl(e.target.value)}
                        placeholder="https://.../video.mp4 or /kmm-welcome-animation.mp4"
                        className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadVideoUrl('/kmm-welcome-animation.mp4')}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 whitespace-nowrap transition cursor-pointer"
                      >
                        Default Demo Video
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Provide a direct MP4, HLS, or CDN streaming URL, or a local server path.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Course Description &amp; Objectives
                </label>
                <textarea
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Outline the core statutory principles and legal requirements taught in this masterclass..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500 resize-none"
                />
              </div>

              {/* Statutory Covenants */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Institutional Covenants Covered ({uploadPoints.length})
                </label>
                <div className="space-y-1.5 mb-2">
                  {uploadPoints.map((pt, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                      <span className="truncate flex-1">{pt}</span>
                      <button
                        type="button"
                        onClick={() => setUploadPoints(uploadPoints.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPointInput}
                    onChange={(e) => setNewPointInput(e.target.value)}
                    placeholder="Add mandatory legal covenant or takeaway..."
                    className="flex-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPointInput.trim()) {
                        setUploadPoints([...uploadPoints, newPointInput.trim()])
                        setNewPointInput('')
                      }
                    }}
                    className="px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold cursor-pointer transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Publishing...' : 'Publish Masterclass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Masterclass Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#151928] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Pencil className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Edit Masterclass: {editingVideo.code}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update course metadata, institutional category, legal covenants, or video source.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditMasterclass} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Masterclass Title *
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Protecting Intellectual Properties in Children's Media"
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Institutional Code *
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    placeholder="e.g. KMM-IP-101"
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Curriculum Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500 cursor-pointer"
                  >
                    <option value="copyright">Copyright &amp; Sovereign IP</option>
                    <option value="protection">Child Protection &amp; Safeguards</option>
                    <option value="broadcast">Broadcast Standards &amp; Playout</option>
                    <option value="doctrinal">Scriptural Review &amp; Canon</option>
                    <option value="merchandising">Merchandising &amp; Contracts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Video Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="e.g. 24:30"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Video Source Selection (Upload / Replace on VPS vs Provide URL) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Video Source Options *
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Protected Streaming &bull; Download Disabled
                  </span>
                </div>

                {/* Source Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditVideoSourceType('upload')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      editVideoSourceType === 'upload'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Upload className="size-3.5 text-amber-500" />
                    <span>Upload to Server (VPS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditVideoSourceType('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      editVideoSourceType === 'url'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Link2 className="size-3.5 text-amber-500" />
                    <span>Provide Video URL</span>
                  </button>
                </div>

                {/* Mode 1: File Upload (VPS) */}
                {editVideoSourceType === 'upload' ? (
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-5 text-center hover:border-amber-500/60 transition cursor-pointer bg-slate-50/50 dark:bg-slate-900/30">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleEditVideoFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                        <FileVideo className="size-5" />
                      </div>
                      {editUploadedFileName ? (
                        <div>
                          <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                            ✓ New File Attached: {editUploadedFileName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{editUploadedFileSize} &bull; Will upload to VPS storage on Save</div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Click to select a replacement video file or drag and drop
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Currently using: <span className="font-mono text-amber-600 dark:text-amber-400 truncate max-w-xs inline-block align-bottom">{editVideoUrl || '/kmm-welcome-animation.mp4'}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            MP4, WebM or MOV up to 500MB (Saved to VPS <span className="font-mono text-amber-600 dark:text-amber-400">public/uploads</span>)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Mode 2: Direct Video URL */
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editVideoUrl}
                        onChange={(e) => setEditVideoUrl(e.target.value)}
                        placeholder="https://.../video.mp4 or /kmm-welcome-animation.mp4"
                        className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setEditVideoUrl('/kmm-welcome-animation.mp4')}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 whitespace-nowrap transition cursor-pointer"
                      >
                        Default Demo Video
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Provide a direct MP4, HLS, or CDN streaming URL, or a local server path.
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Masterclass Description / Syllabus Overview
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Summarize the legal framework, statutory safeguards, and learning objectives..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              {/* Curriculum Safeguard Points / Key Takeaways */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Mandatory Legal Covenants &amp; Key Safeguards
                </label>
                <div className="space-y-2 mb-2 max-h-36 overflow-y-auto">
                  {editPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="truncate flex-1">&bull; {pt}</span>
                      <button
                        type="button"
                        onClick={() => setEditPoints(editPoints.filter((_, i) => i !== idx))}
                        className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editNewPointInput}
                    onChange={(e) => setEditNewPointInput(e.target.value)}
                    placeholder="Add mandatory legal covenant or takeaway..."
                    className="flex-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editNewPointInput.trim()) {
                        setEditPoints([...editPoints, editNewPointInput.trim()])
                        setEditNewPointInput('')
                      }
                    }}
                    className="px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold cursor-pointer transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteMasterclass(editingVideo.id)}
                  className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Masterclass</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingVideo(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSavingEdit ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
