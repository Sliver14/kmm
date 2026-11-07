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
  ArrowLeft,
  ChevronRight,
  Home,
  GraduationCap,
  ShieldCheck,
  Scroll,
  FileText,
  BookOpen,
  Tv,
  Scale,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  Globe,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Printer,
  ChevronDown,
  Award,
  CheckCircle,
  Info,
  Layers,
  LogOut,
  Flame,
  Target,
  Trophy,
  Calendar,
  Bell,
  HelpCircle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'
import { ARCHIVED_TRAINING_VIDEOS, VideoItem, ComplianceToolKey } from '@/lib/data/trainingVideosData'

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

export interface SupportingDocument {
  id: string
  code: string
  title: string
  category: string
  categoryLabel: string
  classification: string
  revisedDate: string
  pages: string
  desc: string
  content: string
}

const SUPPORTING_DOCUMENTS: SupportingDocument[] = [
  {
    id: 'doc-1',
    code: 'KMM-DOC-001',
    title: 'Kiddies Media Ministry Official Child Safeguarding Policy Manual',
    category: 'protection',
    categoryLabel: 'Child Protection & Safety',
    classification: 'Statutory Institutional Policy',
    revisedDate: 'Quarter 1, 2026',
    pages: '18 Pages',
    desc: 'Mandatory institutional framework governing on-set physical safety, chaperone presence, emotional welfare, and reporting protocols for minors involved in media productions.',
    content: `KIDDIES MEDIA MINISTRY
INSTITUTIONAL DIRECTIVE: CHILD SAFEGUARDING & WELFARE MANUAL
DOCUMENT CODE: KMM-DOC-001 / STATUTORY SERIES

PREAMBLE
The Kiddies Media Ministry establishes this Child Safeguarding Policy Manual under divine biblical stewardship and statutory child protection jurisprudence. Every media production, voice recording, live studio appearance, and digital broadcast involving minors across Loveworld Kingdom must comply unconditionally with these directives.

ARTICLE I: PRINCIPLES OF CHILD SAFETY
1.1 Absolute Primacy of Child Welfare: In any conflict between production schedules, deadlines, or budget and the welfare of a minor, the safety and emotional health of the minor shall immediately take precedence.
1.2 Zero Tolerance for Abuse: Kiddies Media Ministry maintains a zero-tolerance policy regarding emotional humiliation, verbal harshness, inappropriate physical contact, or psychological manipulation of minors.
1.3 Certified Chaperone Mandate: No child actor, voice talent, or student contributor shall remain unaccompanied in a studio, editing bay, sound booth, or stage without a designated parent, legal guardian, or certified Kiddies Media Ministry safeguarding officer present.

ARTICLE II: ON-SET & STUDIO PRODUCTION STANDARDS
2.1 Continuous Session Limits: Recording or filming sessions for children under 10 years of age shall not exceed 45 continuous minutes without a mandatory 15-minute rest and hydration pause.
2.2 Daily Maximum Window: The maximum cumulative studio engagement per 24-hour cycle is capped at four (4) hours for minors aged 6-12, and six (6) hours for minors aged 13-17.
2.3 Acoustic & Lighting Safety: Sound recording levels delivered to child headphone feeds must not exceed 75 dBA SPL. Strobe effects and harsh directional lighting must be shielded.

ARTICLE III: SENSORY & EMOTIONAL CONTENT PROTECTION
3.1 Screen Safety & Strobe Thresholds: In compliance with ITU-R BT.1702, animations and broadcast footage must never exceed three (3) flashes or luminance jumps per second.
3.2 Fear & Anxiety Safeguard: Narrative storylines must not expose children to demonic horror, existential dread, or morbid themes contrary to the peace, joy, and victory of the New Creation in Christ Jesus.

ARTICLE IV: INCIDENT REPORTING & COMPLIANCE
4.1 Duty to Report: Any production staff who observes non-compliance or potential child distress is legally and spiritually bound to notify the Kiddies Media Ministry Safeguarding Board within twelve (12) hours.
4.2 Audit & Sanctions: Failure to observe safeguarding covenants results in immediate revocation of Kiddies Media Ministry Broadcast Accreditation.

ISSUED BY: Kiddies Media Ministry Directorate of Legal Jurisprudence & Child Safeguarding
APPROVED FOR BROADCAST RELEASE ACROSS ALL LOVEWORLD CHANNELS`,
  },
  {
    id: 'doc-2',
    code: 'KMM-DOC-002',
    title: 'Institutional Broadcast & Animation Standards Charter',
    category: 'broadcast',
    categoryLabel: 'Broadcast Standards',
    classification: 'Technical & Creative Charter',
    revisedDate: 'Quarter 1, 2026',
    pages: '14 Pages',
    desc: 'Technical video specifications, EBU R128 audio loudness thresholds, visual motion pacing, and zero-defect broadcast quality requirements for terrestrial and satellite playout.',
    content: `KIDDIES MEDIA MINISTRY
TECHNICAL QUALITY CHARTER: BROADCAST & ANIMATION SPECIFICATIONS
DOCUMENT CODE: KMM-DOC-002 / BROADCAST SERIES

1. OVERVIEW & SCOPE
This Charter governs all visual animation masters, live-action kid segments, musical interludes, and interstitials submitted for distribution across Loveworld satellite networks, mobile apps, and syndicated partners.

2. VIDEO DELIVERY SPECIFICATIONS
2.1 Master Playout Format: Apple ProRes 422 HQ or Avid DNxHR HQX at native raster (1920x1080p or 3840x2160p Ultra HD).
2.2 Frame Rate Standards: 25.00 fps for PAL/European/African feeds; 29.97 fps / 59.94p for North American/Global syndication.
2.3 Color Gamut: Rec. 709 for HD masters; Rec. 2020 / HDR10 PQ for 4K releases with maximum luminance ceiling of 1000 nits.
2.4 Cadence & Motion Blur: Animation rendering must maintain fluid motion interpolation. Excessive frame dropping or jitter exceeding 2 frames is classified as a Critical Technical Defect.

3. AUDIO LOUDNESS & MIX BALANCE
3.1 Integrated Loudness Target: -24.0 LKFS/LUFS (±0.5 LUFS tolerance) in strict compliance with EBU R128 and ATSC A/85.
3.2 True Peak Maximum: Shall not exceed -1.0 dBTP on digital playout servers.
3.3 Dialogue Intelligibility: Voiceover speech must be mixed at a minimum of +6 dB above ambient background music stems.

4. DEFECT CLASSIFICATION MATRIX
- Critical Defects (Automatic Rejection): Audio distortion/clipping, strobe flashes >3 Hz, unrendered frames, missing voiceover stems.
- Major Defects (48-Hour Remediation): Lip-sync drift >2 frames, incorrect lower-third titles, audio level drift ±2 LUFS.
- Minor Notes: Slight color grading inconsistency between scene cuts.

SANCTIONED BY: Kiddies Media Ministry Broadcast Quality Assurance Committee`,
  },
  {
    id: 'doc-3',
    code: 'KMM-DOC-003',
    title: 'Minor Contributor & Voice Talent Release Deed Template',
    category: 'copyright',
    categoryLabel: 'Copyright & IP',
    classification: 'Legal Deed & Contributor Covenant',
    revisedDate: 'Quarter 1, 2026',
    pages: '4 Pages',
    desc: 'Official covenant template executed by parents and legal guardians granting irrevocable, worldwide, perpetual broadcast and likeness rights for child voice performers.',
    content: `DEED OF CONTRIBUTION & TALENT RELEASE FOR MINORS
KIDDIES MEDIA MINISTRY / LOVEWORLD KINGDOM
DOCUMENT CODE: KMM-DOC-003 / LEGAL SERIES

THIS DEED OF RELEASE is executed between:
1. THE PARENT/LEGAL GUARDIAN: __________________________________________________
   Residential Address: ________________________________________________________
   Telephone: ______________________ Email: ___________________________________
   On behalf of Minor Performer (Name): ________________________________________
   Date of Birth: ___________________ (the "Minor Talent")

AND
2. KIDDIES MEDIA MINISTRY, representing Loveworld Media Holdings (the "Ministry").

1. GRANT OF RIGHTS & PERMISSIONS
The undersigned Parent/Legal Guardian hereby unconditionally grants to the Ministry the irrevocable, perpetual, worldwide, royalty-free license and authority to:
(a) Record, reproduce, edit, dub, translate, and broadcast the Minor Talent's voice, dialogue, singing, performance, and creative contributions.
(b) Synchronize said performances with animation assets, musical compositions, sound effects, and visual graphics.
(c) Publish and distribute the resulting content across television channels, mobile applications (including LoveToons Mobile App), digital portals, physical media, and educational materials.

2. WORK-FOR-HIRE & OWNERSHIP COVENANT
The Parent/Legal Guardian affirms that all performances rendered constitute a "Work-for-Hire" under international copyright law. All intellectual property, trademarks, recordings, master files, and derivative rights shall belong exclusively and perpetually to the Kiddies Media Ministry.

3. PRIVACY & CHILD PROTECTION
The Ministry agrees to protect the Minor Talent's personal privacy by using character credits or first-name aliases where requested to safeguard the child's identity from public search algorithms.

SIGNED, SEALED AND DELIVERED:
Parent/Guardian Signature: _______________________ Date: ____________________
Kiddies Media Ministry Commissioning Officer Signature: ________________ Date: _________________`,
  },
  {
    id: 'doc-4',
    code: 'KMM-DOC-004',
    title: 'Digital Minor Data Privacy & COPPA Compliance Directive',
    category: 'protection',
    categoryLabel: 'Child Protection & Safety',
    classification: 'Regulatory Digital Directive',
    revisedDate: 'Quarter 1, 2026',
    pages: '12 Pages',
    desc: 'Statutory rules for kid-facing mobile apps and websites, strictly prohibiting third-party advertising, commercial tracking, voice storage, and unverified data collection.',
    content: `DIGITAL PRIVACY & CHILD DATA PROTECTION DIRECTIVE
KIDDIES MEDIA MINISTRY / DIGITAL DIVISION
DOCUMENT CODE: KMM-DOC-004 / REGULATORY SERIES

1. PURPOSE & JURISDICTION
This Directive establishes mandatory compliance for all mobile applications, interactive websites, and digital games produced under the Loveworld Kiddies umbrella, ensuring compliance with the Children's Online Privacy Protection Act (COPPA, 16 C.F.R. Part 312), GDPR-K (Article 8), and Kiddies Media Ministry Institutional Covenants.

2. MANDATORY ARCHITECTURAL PRINCIPLES
2.1 Zero Commercial Ad Networks: Kid apps (including LoveToons Mobile App) are strictly prohibited from embedding third-party behavioral advertising SDKs or programmatic ad exchanges.
2.2 No Cross-App Behavioral Tracking: Apps must not access advertising IDs (IDFA, GAID) or fingerprint user hardware across external digital platforms.
2.3 Verifiable Parental Consent Gates: Account creation, in-app interactions, and access to external web links must be guarded by cryptographic adult verification challenges (e.g., adult cognitive test or parent email authorization).

3. TELEMETRY & DATA RETENTION LIMITS
3.1 Minimalist Telemetry: Only anonymous, aggregated diagnostic telemetry necessary for crash reporting and app performance may be collected.
3.2 Voice Data Protection: Interactive games utilizing microphone inputs must process voice commands locally on-device. No audio recordings of minors may be transmitted or permanently archived on remote cloud servers.
3.3 90-Day Telemetry Purge: Any telemetry logs containing session identifiers must be permanently and irreversibly purged after ninety (90) days.

APPROVED BY: Kiddies Media Ministry Digital Transformation & Cyber Safeguarding Directorate`,
  },
  {
    id: 'doc-5',
    code: 'KMM-DOC-005',
    title: 'Scriptural Review & Doctrinal Integrity Protocol',
    category: 'doctrinal',
    categoryLabel: 'Scriptural Review',
    classification: 'Theological & Pastoral Protocol',
    revisedDate: 'Quarter 1, 2026',
    pages: '10 Pages',
    desc: 'Standards for biblical fidelity, theological accuracy, age-graded doctrine, and editorial review processes to anchor children in the unadulterated Word of God.',
    content: `SCRIPTURAL INTEGRITY & DOCTRINAL REVIEW PROTOCOL
KIDDIES MEDIA MINISTRY / PASTORAL REVIEW COUNCIL
DOCUMENT CODE: KMM-DOC-005 / THEOLOGICAL SERIES

1. THEOLOGICAL VISION
Children's minds are fertile spiritual soil. The Kiddies Media Ministry is mandated to impart the pure, uncompromised Word of God, establishing children in their identity as Kings and Priests in Christ Jesus through the revelations of the New Creation.

2. DOCTRINAL GUIDELINES FOR SCRIPTWRITERS
2.1 Pure Scriptural Fidelity: All scriptural quotations, prophecies, and gospel narratives must align strictly with King James Bible standards and the doctrinal teachings of our Man of God.
2.2 Identity in Christ: Stories must emphasize faith, love, divine health, righteous courage, and the authority of the Believer over darkness.
2.3 No Legalism or Fear: Characters must not be governed by condemnation, demonic fear, or superstitious bondage. The finished works of Christ must shine through every episode.

APPROVED BY: Pastoral Review Board & Editorial Directorate`,
  },
]

export default function TrainingPortalPage() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<TrainingUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  // Navigation tab: 'overview' | 'video' | 'documents' | 'tools' | 'accreditation'
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'documents' | 'tools' | 'accreditation'>('overview')
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

  // Document Modal state
  const [readingDoc, setReadingDoc] = useState<SupportingDocument | null>(null)
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null)

  // Completed modules tracking
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    'vid-1': true,
  })

  // Tool 1: Child Safeguarding Audit Checklist State
  const [safeguardChecks, setSafeguardChecks] = useState<Record<string, boolean>>({
    consent: true,
    strobe: true,
    loudness: true,
    tone: true,
    music: false,
    privacy: false,
  })

  // Tool 2: Content Age-Rating & Sensitivity Calculator State
  const [ageCalc, setAgeCalc] = useState({
    ageBand: '4-7',
    conflict: 'none',
    pacing: 'calm',
    doctrine: 'foundational',
  })

  // Tool 3: IP Clearance Verifier State
  const [ipChecks, setIpChecks] = useState<Record<string, boolean>>({
    voice: true,
    music: true,
    character: true,
    script: true,
    territory: true,
  })

  const [activeToolTab, setActiveToolTab] = useState<'ip-clearance' | 'safeguard' | 'age-rating'>('ip-clearance')
  const [toastMessage, setToastMessage] = useState('')

  const chapters = useMemo(
    () => [
      { time: '00:00', seconds: 0, title: 'Introduction: The Sacred Trust of Children’s IP' },
      { time: '04:15', seconds: 255, title: 'Statutory Chain of Title & Work-for-Hire' },
      { time: '09:30', seconds: 570, title: 'Minor Performer & Voice Likeness Consent' },
      { time: '14:45', seconds: 885, title: 'AI Transparency & Prompt Preservation' },
      { time: '19:20', seconds: 1160, title: 'Character Silhouette & Trademark Defense' },
      { time: '23:10', seconds: 1390, title: 'Playout Sign-off & Legal Accreditation' },
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

    // Check query params for tab switching (e.g. ?tab=tools or ?tab=documents)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      if (tabParam === 'tools') setActiveTab('tools')
      else if (tabParam === 'documents' || tabParam === 'materials') setActiveTab('documents')
      else if (tabParam === 'video' || tabParam === 'watch') setActiveTab('video')
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

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return SUPPORTING_DOCUMENTS
    const q = searchQuery.toLowerCase()
    return SUPPORTING_DOCUMENTS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.categoryLabel.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="size-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 border border-slate-700/50">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex min-h-screen overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR (Inspired by Focotech Design)                */}
        {/* ========================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#121624] border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between p-5 transition-transform duration-200 md:static md:translate-x-0 ${
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

              {/* Navigation Items */}
              <button
                onClick={() => {
                  setActiveTab('overview')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
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
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Tv className={`size-4 ${activeTab === 'video' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Masterclass Video</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('documents')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <FileText className={`size-4 ${activeTab === 'documents' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Supporting Docs</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('tools')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Sliders className={`size-4 ${activeTab === 'tools' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Compliance Tools</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('accreditation')
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'accreditation'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
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
                <span>Return to Portal</span>
              </span>
              <ChevronRight className="size-3 text-slate-400" />
            </Link>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER CONTENT AREA                                       */}
        {/* ========================================================= */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar (Header & Search) */}
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#121624]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
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
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Training Academy
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
                  placeholder="Search lessons, policies, guidelines..."
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
                  {currentUser?.initials || 'BL'}
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

          {/* Main Body Grid */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
            {/* ======================================================= */}
            {/* SECTION 1: CONTINUE LEARNING (Inspired by Focotech)     */}
            {/* ======================================================= */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Continue Learning
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Current Institutional Milestone
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

                {/* Course 2: Statutory Policy Charters */}
                <div
                  onClick={() => setActiveTab('documents')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-sky-500/50 dark:hover:border-sky-400/50 transition cursor-pointer space-y-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="size-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 group-hover:scale-105 transition-transform">
                      <Scroll className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        INSTITUTIONAL DIRECTIVES
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        Child Safeguarding &amp; Broadcast Charters
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
                        <FileText className="size-3 text-sky-500" />
                        <span>5 Statutory Documents</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        <span>All Available</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                    <span>Browse Policy Manuals</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================================= */}
            {/* SECTION 2: OFFICIAL TRAINING MASTERCLASS (THE SOLE VIDEO) */}
            {/* ======================================================= */}
            <section id="masterclass" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-1">
                    ★ Official Curriculum Masterclass
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Protecting Intellectual Properties in Children&apos;s Media
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleModuleCompletion}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                      completedModules['vid-1']
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {completedModules['vid-1'] ? (
                      <>
                        <CheckCircle className="size-3.5" />
                        <span>Completed &bull; Retake</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Video Player Card */}
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#151928] p-4 sm:p-6 shadow-sm space-y-5">
                <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center group">
                  {/* HTML5 Video element with real media */}
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
                      <span>View Accreditation</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Navigation Chips */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Chapter Markers
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSeek(ch.seconds, idx)}
                        className={`text-left p-2.5 rounded-xl border transition text-xs flex items-center justify-between gap-2 cursor-pointer ${
                          activeChapterIndex === idx
                            ? 'bg-amber-500/10 border-amber-500 text-amber-800 dark:text-amber-300 font-bold'
                            : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{ch.title}</span>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0">{ch.time}</span>
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
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                        <CheckCircle2 className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================================= */}
            {/* SECTION 3: STATUTORY SUPPORTING DOCUMENTS               */}
            {/* ======================================================= */}
            <section id="documents" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Statutory Supporting Documents &amp; Legal Deeds
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official policy manuals, talent covenants, and compliance directives.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {filteredDocs.length} Documents
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                        <span>{doc.code}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {doc.pages}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {doc.classification}
                      </span>
                      <button
                        onClick={() => setReadingDoc(doc)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        <span>Read Full Text</span>
                        <ChevronRight className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ======================================================= */}
            {/* SECTION 4: INTERACTIVE COMPLIANCE TOOLS                */}
            {/* ======================================================= */}
            <section id="tools" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Pre-Playout Compliance Tools
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verify statutory clearance benchmarks prior to master export and satellite transmission.
                  </p>
                </div>

                {/* Tool Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs">
                  <button
                    onClick={() => setActiveToolTab('ip-clearance')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      activeToolTab === 'ip-clearance'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    IP Clearance
                  </button>
                  <button
                    onClick={() => setActiveToolTab('safeguard')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      activeToolTab === 'safeguard'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    Child Safeguards
                  </button>
                  <button
                    onClick={() => setActiveToolTab('age-rating')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      activeToolTab === 'age-rating'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    Age-Rating Calculator
                  </button>
                </div>
              </div>

              {/* Active Tool Panel */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#151928] border border-slate-200/80 dark:border-white/10 shadow-xs">
                {activeToolTab === 'ip-clearance' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Statutory IP Clearance Checklist
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Verify that all component stems, recordings, and character likenesses hold executed deeds.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                        {Object.values(ipChecks).filter(Boolean).length} / 5 Cleared
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { key: 'voice', label: 'Executed Minor Talent Release Deed on file for all child voice actors' },
                        { key: 'music', label: 'Work-for-Hire Assignment deed executed for musical composition and stems' },
                        { key: 'character', label: 'Registered character silhouette & trademark likeness clearance' },
                        { key: 'script', label: 'Original script copyright assignment vested in Kiddies Media Ministries' },
                        { key: 'territory', label: 'Worldwide perpetual broadcast & digital syndication rights secured' },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!ipChecks[item.key]}
                            onChange={(e) =>
                              setIpChecks({ ...ipChecks, [item.key]: e.target.checked })
                            }
                            className="size-4 mt-0.5 rounded text-amber-500 focus:ring-amber-500/30"
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeToolTab === 'safeguard' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Child Safeguarding &amp; Broadcast Quality Audit
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Confirm compliance with ITU-R BT.1702 strobe limits and EBU R128 loudness.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                        {Object.values(safeguardChecks).filter(Boolean).length} / 6 Audited
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { key: 'consent', label: 'Parent/Guardian chaperone accompanied child in studio session' },
                        { key: 'strobe', label: 'No visual strobe transitions exceeding 3 flashes per second (ITU-R BT.1702)' },
                        { key: 'loudness', label: 'Dialogue mix balanced at -24 LKFS with +6 dB voice intelligibility headroom' },
                        { key: 'tone', label: 'Doctrinal review completed: zero fear, morbid existential dread or superstition' },
                        { key: 'music', label: 'Headphone monitoring did not exceed safe 75 dBA SPL studio ceiling' },
                        { key: 'privacy', label: 'Child voice performer identity shielded with character alias in credits' },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!safeguardChecks[item.key]}
                            onChange={(e) =>
                              setSafeguardChecks({ ...safeguardChecks, [item.key]: e.target.checked })
                            }
                            className="size-4 mt-0.5 rounded text-amber-500 focus:ring-amber-500/30"
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeToolTab === 'age-rating' && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 dark:border-white/5 pb-3">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Content Age-Rating &amp; Sensitivity Calculator
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Compute official KMM broadcast rating based on audience age and pacing.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Target Age Bracket</label>
                        <select
                          value={ageCalc.ageBand}
                          onChange={(e) => setAgeCalc({ ...ageCalc, ageBand: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        >
                          <option value="2-4">Ages 2-4 (Early Preschool)</option>
                          <option value="4-7">Ages 4-7 (Primary Faith Foundations)</option>
                          <option value="8-12">Ages 8-12 (Junior Champions)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Visual Pacing</label>
                        <select
                          value={ageCalc.pacing}
                          onChange={(e) => setAgeCalc({ ...ageCalc, pacing: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        >
                          <option value="calm">Calm &amp; Soothing (Preschool)</option>
                          <option value="dynamic">Dynamic &amp; Animated (Standard)</option>
                          <option value="high-energy">High-Energy Praise &amp; Action</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Theological Depth</label>
                        <select
                          value={ageCalc.doctrine}
                          onChange={(e) => setAgeCalc({ ...ageCalc, doctrine: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        >
                          <option value="foundational">Foundational (God loves me, prayer)</option>
                          <option value="revelational">New Creation Realities &amp; Authority</option>
                          <option value="scriptural">Scripture Memory &amp; Confessions</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recommended Rating
                        </span>
                        <div className="font-black text-base text-emerald-600 dark:text-emerald-400">
                          KMM-G (Universal Children Broadcast)
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                        Safe for Satellite Playout
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR: PROFILE, STREAK & WATCH TIME               */}
        {/* (Inspired directly by the Focotech design)                */}
        {/* ========================================================= */}
        {showRightDetails && (
          <aside className="w-80 border-l border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#121624] p-5 hidden xl:flex flex-col gap-6 overflow-y-auto shrink-0">
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
                    <FileText className="size-3 text-sky-500" />
                    <span>Policies</span>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    5 Approved
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

      {/* ========================================================= */}
      {/* FULL DOCUMENT READER MODAL                                */}
      {/* ========================================================= */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#151928] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  <span>{readingDoc.code}</span>
                  <span>&bull;</span>
                  <span>{readingDoc.classification}</span>
                  <span>&bull;</span>
                  <span>{readingDoc.pages}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white pt-1">
                  {readingDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-950/30">
              {readingDoc.content}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 bg-white dark:bg-[#151928]">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Statutory Series &bull; Kiddies Media Ministries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(readingDoc.content)
                    setCopiedDocId(readingDoc.id)
                    setTimeout(() => setCopiedDocId(null), 2000)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  {copiedDocId === readingDoc.id ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  <span>{copiedDocId === readingDoc.id ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                >
                  <Printer className="size-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ACCREDITATION CERTIFICATE MODAL VIEW                      */}
      {/* ========================================================= */}
      {activeTab === 'accreditation' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#151928] rounded-3xl border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setActiveTab('overview')}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="size-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-amber-500/20 pb-5">
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Certificate of Statutory IP Accreditation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Issued in accordance with Loveworld Kingdom Child Protection &amp; Sovereign Copyright Directives
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3 py-2">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">This certifies that</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white underline decoration-amber-500 underline-offset-8">
                {currentUser?.name || 'Barrister Lillian Okoye'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {currentUser?.agency || 'Lovetoons Content Operations'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed pt-2">
                Has satisfactorily completed all curricular requirements under <b>KMM-IP-101: Protecting Intellectual Properties in Children&apos;s Media</b>, validating competency in chain of custody, Work-for-Hire covenants, parental consent deeds, and AI use disclosures.
              </p>
            </div>

            {/* Hash & Verification Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-amber-500/20 text-[11px]">
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

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <Printer className="size-3.5 text-amber-500" />
                <span>Print PDF</span>
              </button>
              <button
                onClick={() => {
                  toggleModuleCompletion()
                  setActiveTab('overview')
                }}
                className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
              >
                Close &amp; Save to Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
