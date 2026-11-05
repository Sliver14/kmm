'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  Clock,
  Globe,
  Wrench,
  Download,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Sliders,
  FileCheck,
  Printer,
  Eye,
  ChevronDown,
  Award,
  CheckCircle,
  Info,
  Layers,
  LogIn,
  LogOut,
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

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'broadcast', label: 'Broadcast Standards' },
  { id: 'protection', label: 'Child Protection' },
  { id: 'copyright', label: 'Copyright & IP' },
  { id: 'doctrinal', label: 'Scriptural Review' },
  { id: 'merchandising', label: 'Merchandising & Digital' },
]

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
2.1 Literal Scriptural Accuracy: When Bible passages are quoted or animated, characters must faithfully reflect the textual context of the Holy Scriptures. Direct scripture quotations must match the King James Version or approved Loveworld Bible editions.
2.2 The Triumph of Faith & Grace: Miracles, deliverance, and divine protection must be presented as the direct work of the Holy Spirit through faith in Jesus Christ, avoiding secular "magic" or folkloric tropes.
2.3 Dignity in Character Portrayals: Biblical heroes and disciples must be portrayed with reverence, avoid theological caricatures, and never depict godly patriarchs or biblical figures in morally compromising or frivolous lights.

3. SCRIPTURAL CLEARANCE GATEWAY
3.1 Pre-Animation Review: All series pitches, character backstories, and episode scripts must receive written sign-off from the Kiddies Media Ministry Pastoral Review Council prior to storyboard animation.
3.2 Zero Doctrinal Deviation: Submissions presenting salvation through works, generational curses for Christians, or unscriptural fear are returned immediately for theological rewrite.

AUTHORIZED BY: Kiddies Media Ministry Pastoral Directorate & Editorial Review Council`,
  },
  {
    id: 'doc-6',
    code: 'KMM-DOC-006',
    title: 'Kiddies Media Ministry Content Submission & Quality Gate Workflow',
    category: 'broadcast',
    categoryLabel: 'Broadcast Standards',
    classification: 'Operational Submission Protocol',
    revisedDate: 'Quarter 1, 2026',
    pages: '8 Pages',
    desc: 'Procedural roadmap for external ministry departments and internal studios submitting children’s animations, books, or audio dramas for official Kiddies Media Ministry accreditation.',
    content: `CONTENT SUBMISSION & QUALITY GATE PROTOCOL
KIDDIES MEDIA MINISTRY / OPERATIONS DIVISION
DOCUMENT CODE: KMM-DOC-006 / PROCEDURAL SERIES

1. STAGES OF ACCREDITATION
External ministry departments, zonal media teams, and independent animation creators seeking broadcast on Loveworld networks must navigate four sequential Quality Gates:

GATE 1: CONCEPT & SCRIPTURAL SCRUTINY
- Submit series synopsis, character designs, sample script, and intended audience age bracket.
- Pastoral Review Council evaluates biblical fidelity and pedagogical value (Turnaround: 5 working days).

GATE 2: SAFEGUARDING & LEGAL COVENANTS
- Upload fully executed Contributor Release Deeds (KMM-DOC-003) for all child voice talents.
- Submit proof of original music composition licenses and character trademark documentation.

GATE 3: TECHNICAL QA AUDIT
- Master video delivery submitted to Kiddies Media Ministry Playout Server.
- Automated and human review for EBU R128 audio loudness (-24 LKFS) and ITU-R BT.1702 strobe compliance.

GATE 4: ISSUANCE OF KIDDIES MEDIA MINISTRY BROADCAST SEAL
- Content meeting zero-defect thresholds receives the Official Kiddies Media Ministry Broadcast Clearance Seal and is scheduled for satellite playout and mobile app inclusion.

SUBMISSION PORTAL: https://portal.kiddiesmediaministry.org
COORDINATED BY: Kiddies Media Ministry Content Operations Directorate`,
  },
]

export default function TrainingPortalPage() {
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<TrainingUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const [officerEmail, setOfficerEmail] = useState('Barrister Lillian')
  const [activeFilter, setActiveFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null)
  const [viewMode, setViewMode] = useState<'catalog' | 'watch'>('catalog')
  const [activeVideoTab, setActiveVideoTab] = useState<'notes' | 'tools' | 'documents' | 'accreditation'>('notes')
  const [activeToolKey, setActiveToolKey] = useState<ComplianceToolKey>('safeguard')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progressPercent, setProgressPercent] = useState(15)
  const [isCaptionsOn, setIsCaptionsOn] = useState(false)
  const [isTheaterExpanded, setIsTheaterExpanded] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // Document Modal state
  const [readingDoc, setReadingDoc] = useState<SupportingDocument | null>(null)

  // Completed modules tracking
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({})

  // Tool 1: Child Safeguarding Audit Checklist State
  const [safeguardChecks, setSafeguardChecks] = useState<Record<string, boolean>>({
    consent: true,
    strobe: true,
    loudness: true,
    tone: false,
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
    character: false,
    script: true,
    territory: false,
  })

  const playTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

    // Load authenticated training user
    let userKey = 'guest'
    try {
      const storedUserRaw = localStorage.getItem('kmm_training_user')
      if (storedUserRaw) {
        const user: TrainingUser = JSON.parse(storedUserRaw)
        setCurrentUser(user)
        setOfficerEmail(user.name)
        userKey = user.id
      } else {
        const legacyAuth = localStorage.getItem('kmm_auth_officer')
        if (legacyAuth) {
          const name = legacyAuth.split('@')[0]
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
          const fallbackUser: TrainingUser = {
            id: 'TP-LOV-001',
            name: capitalized,
            email: legacyAuth.includes('@') ? legacyAuth : 'officer@lovetoons.tv',
            agency: 'Lovetoons Content Operations',
            role: 'Statutory Child Safeguarding Director',
            initials: capitalized.slice(0, 2).toUpperCase(),
            registeredAt: new Date().toISOString(),
          }
          setCurrentUser(fallbackUser)
          setOfficerEmail(capitalized)
          userKey = fallbackUser.id
        }
      }
    } catch {
      // ignore
    }

    // Load completed modules from storage (user-specific or global)
    try {
      const savedModules =
        localStorage.getItem(`kmm_completed_modules_${userKey}`) ||
        localStorage.getItem('kmm_completed_modules')
      if (savedModules) {
        setCompletedModules(JSON.parse(savedModules))
      }
    } catch {
      // ignore
    }

    // Check hash for direct watch link
    if (window.location.hash.startsWith('#watch-')) {
      const vidId = window.location.hash.replace('#watch-', '')
      const found = ARCHIVED_TRAINING_VIDEOS.find((v) => v.id === vidId)
      if (found) {
        startPlayingVideo(found)
      }
    }

    return () => {
      // Ensure leaving training portal does not keep dark mode on landing/onboarding
      if (typeof document !== 'undefined') {
        const nextPath = window.location.pathname || ''
        if (nextPath === '/' || nextPath.startsWith('/onboarding')) {
          document.documentElement.classList.remove('dark')
          document.documentElement.classList.add('light')
          document.documentElement.style.colorScheme = 'light'
        }
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kmm_training_user')
      localStorage.removeItem('kmm_auth_officer')
    }
    setCurrentUser(null)
    setOfficerEmail('Guest Officer')
    setUserMenuOpen(false)
    showToast('Signed out of training portal session.')
  }


  // Auto playback simulation
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
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
  }, [isPlaying])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3200)
  }

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('kmm_training_theme', next ? 'dark' : 'light')
    if (typeof window !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const startPlayingVideo = (
    video: VideoItem,
    initialTab: 'notes' | 'tools' | 'documents' | 'accreditation' = 'notes'
  ) => {
    setCurrentVideo(video)
    setActiveVideoTab(initialTab)
    if (video.tools && video.tools.length > 0) {
      setActiveToolKey(video.tools[0])
    }
    setViewMode('watch')
    setIsPlaying(initialTab === 'notes')
    setProgressPercent(10)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleModuleCompletion = (moduleId: string) => {
    setCompletedModules((prev) => {
      const next = { ...prev, [moduleId]: !prev[moduleId] }
      const userKey = currentUser?.id || 'guest'
      try {
        localStorage.setItem(`kmm_completed_modules_${userKey}`, JSON.stringify(next))
        localStorage.setItem('kmm_completed_modules', JSON.stringify(next))
      } catch {
        // ignore
      }
      if (next[moduleId]) {
        showToast(`Accreditation verified for ${currentUser?.name || officerEmail}!`)
      }
      return next
    })
  }

  // Filtered Training Materials
  const filteredVideos = useMemo(() => {
    return ARCHIVED_TRAINING_VIDEOS.filter((vid) => {
      const matchesCat = activeFilter === 'all' || vid.category === activeFilter
      const isComp = !!completedModules[vid.id]
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isComp) ||
        (statusFilter === 'in-progress' && !isComp)

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        vid.title.toLowerCase().includes(q) ||
        vid.desc.toLowerCase().includes(q) ||
        vid.code.toLowerCase().includes(q) ||
        vid.speaker.toLowerCase().includes(q) ||
        vid.citations.some((c) => c.toLowerCase().includes(q))
      return matchesCat && matchesStatus && matchesSearch
    })
  }, [activeFilter, statusFilter, searchQuery, completedModules])

  // Attached docs for current video
  const attachedDocs = useMemo(() => {
    if (!currentVideo) return []
    if (currentVideo.docIds && currentVideo.docIds.length > 0) {
      return SUPPORTING_DOCUMENTS.filter((doc) => currentVideo.docIds?.includes(doc.id))
    }
    return SUPPORTING_DOCUMENTS.filter((doc) => doc.category === currentVideo.category).slice(0, 2)
  }, [currentVideo])

  // Other documents not primarily attached
  const otherDocs = useMemo(() => {
    if (!currentVideo) return SUPPORTING_DOCUMENTS
    return SUPPORTING_DOCUMENTS.filter((doc) => !currentVideo.docIds?.includes(doc.id))
  }, [currentVideo])

  // Tool 1: Safeguard score calculation
  const safeguardScore = useMemo(() => {
    const total = 6
    const checked = Object.values(safeguardChecks).filter(Boolean).length
    return Math.round((checked / total) * 100)
  }, [safeguardChecks])

  const copySafeguardReport = () => {
    const checkedCount = Object.values(safeguardChecks).filter(Boolean).length
    const officerDesc = currentUser
      ? `${currentUser.name} (${currentUser.role}, ${currentUser.agency}) [ID: ${currentUser.id}]`
      : `Officer ${officerEmail}`
    const text = `KIDDIES MEDIA MINISTRY CHILD SAFEGUARDING AUDIT VERIFICATION REPORT
Module: ${currentVideo ? `${currentVideo.code} - ${currentVideo.title}` : 'General Compliance Audit'}
Generated by: ${officerDesc}
Compliance Score: ${safeguardScore}% (${checkedCount} of 6 Checks Passed)
Status: ${safeguardScore === 100 ? 'CLEARED FOR SATELLITE & DIGITAL BROADCAST' : 'ATTENTION REQUIRED - INCOMPLETE REMEDIATION'}

CHECKLIST BREAKDOWN:
[${safeguardChecks.consent ? 'X' : ' '}] 1. Minor Parental / Guardian Release Deed Executed
[${safeguardChecks.strobe ? 'X' : ' '}] 2. Screen Safety & Visual Strobing Frequency (< 3 flashes/sec)
[${safeguardChecks.loudness ? 'X' : ' '}] 3. Audio Loudness Normalized to -24 LKFS/LUFS
[${safeguardChecks.tone ? 'X' : ' '}] 4. Age-Appropriate Emotional Tone & Non-Frightening Themes
[${safeguardChecks.music ? 'X' : ' '}] 5. Third-Party Music & Sound Rights Cleared (Work-for-Hire)
[${safeguardChecks.privacy ? 'X' : ' '}] 6. Child Privacy Safeguards Enforced (No personal minor data)

Verified via Kiddies Media Ministry Compliance & Training Portal (https://portal.kiddiesmediaministry.org)`

    navigator.clipboard.writeText(text)
    showToast('Safeguarding Audit Report copied to clipboard!')
  }

  // Tool 2: Age Rating calculation
  const computedRating = useMemo(() => {
    const { ageBand, conflict, pacing, doctrine } = ageCalc

    if (ageBand === '0-3') {
      return {
        rating: 'KMM-E',
        label: 'Early Childhood - Universal All Ages',
        color: 'bg-emerald-500 text-slate-950 border-emerald-400',
        summary: 'Exclusively soothing, gentle animations suitable for infant cognitive comfort and preschool wonder.',
        guidance: 'Zero conflict, soft ambient audio stems, maximum luminance strictly clamped. Perfect for morning nursery blocks.',
      }
    }

    if (ageBand === '4-7') {
      if (conflict === 'action') {
        return {
          rating: 'KMM-Y7',
          label: 'Directed to Older Children (Age 7+)',
          color: 'bg-amber-500 text-slate-950 border-amber-400',
          summary: 'Contains animated action sequences or dramatic moments requiring guidance for younger viewers.',
          guidance: 'Ensure clear moral victory and faith declaration in dialogue before episode resolution.',
        }
      }
      return {
        rating: 'KMM-G',
        label: 'General Child Audience (Ages 4-7)',
        color: 'bg-sky-500 text-slate-950 border-sky-400',
        summary: 'Encouraging Christian character lessons, scripture songs, and wholesome animated adventures.',
        guidance: 'Recommended for Sunday School viewing, children church broadcasts, and family app viewing.',
      }
    }

    if (ageBand === '8-12') {
      if (conflict === 'action' || doctrine === 'deep') {
        return {
          rating: 'KMM-PG',
          label: 'Parental Guidance / Guided Discussion',
          color: 'bg-orange-500 text-slate-950 border-orange-400',
          summary: 'Contains mature spiritual themes (spiritual warfare allegories, historical martyr contexts).',
          guidance: 'Recommended for family discussion, youth fellowship screening, and teacher-led study sessions.',
        }
      }
      return {
        rating: 'KMM-Y7',
        label: 'Pre-Teen General (Ages 8-12)',
        color: 'bg-amber-500 text-slate-950 border-amber-400',
        summary: 'Engaging, faith-anchored storylines with relatable character challenges, humor, and biblical truth.',
        guidance: 'Ideal for weekend children television slots and youth streaming channels.',
      }
    }

    // 13+
    return {
      rating: 'KMM-PG',
      label: 'Teens & Family Audience',
      color: 'bg-purple-500 text-white border-purple-400',
      summary: 'Advanced biblical jurisprudence, worldview apologetics, and deeper kingdom mysteries.',
      guidance: 'Suitable for teen academies, digital youth networks, and high-school ministry outreach.',
    }
  }, [ageCalc])

  // Download document helper
  const handleDownloadDocument = (doc: SupportingDocument) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.code}-${doc.title.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`Downloaded ${doc.code} as text document`)
  }

  // Print document
  const handlePrintDocument = () => {
    window.print()
  }

  const completedCount = Object.values(completedModules).filter(Boolean).length
  const progressPercentTotal = Math.round((completedCount / ARCHIVED_TRAINING_VIDEOS.length) * 100)

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      style={{ fontFamily: 'Figtree, -apple-system, sans-serif' }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="size-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Modern Navigation Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDark ? 'bg-slate-950/85 border-white/10' : 'bg-white/90 border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group text-inherit no-underline shrink-0"
              title="Return to Kiddies Media Ministry Main Home"
            >
              <div className="size-10 sm:size-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="size-5 font-black" />
              </div>
              <div className="min-w-0">
                <div
                  className="font-extrabold text-sm sm:text-base lg:text-lg leading-tight tracking-tight truncate flex items-center gap-2"
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  <span>KMM Academy Portal</span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 border border-amber-500/30">
                    Accreditation Hub
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-[var(--kmm-muted)] uppercase tracking-wider truncate">
                  Broadcast Standards &bull; Safeguarding &bull; IP Clearance
                </div>
              </div>
            </Link>
          </div>

          {/* Center search (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div
              className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition-all ${
                isDark
                  ? 'bg-slate-900 border-white/10 focus-within:border-amber-400 text-white'
                  : 'bg-slate-100 border-slate-200 focus-within:border-amber-500 text-slate-900 focus-within:bg-white'
              }`}
            >
              <Search className="size-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search masterclasses, citations, charters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & User Info */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Accreditation progress badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs">
              <Award className="size-3.5 text-amber-500" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {completedCount}/8 Certified
              </span>
              <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${progressPercentTotal}%` }}
                />
              </div>
            </div>

            {/* Authenticated Officer Profile Widget & Dropdown */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 py-1 pl-1.5 pr-3 rounded-full border text-xs transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-white/10 hover:border-amber-400/50 text-slate-200'
                      : 'bg-white border-slate-200 hover:border-amber-400 text-slate-800 shadow-2xs'
                  }`}
                  aria-expanded={userMenuOpen}
                >
                  <div className="size-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-extrabold flex items-center justify-center text-[11px] shadow-2xs shrink-0">
                    {currentUser.initials || 'KM'}
                  </div>
                  <div className="hidden sm:block text-left min-w-0">
                    <div className="font-bold text-xs truncate max-w-[130px] leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 truncate max-w-[130px] font-semibold leading-none">
                      {currentUser.agency}
                    </div>
                  </div>
                  <ChevronDown className={`size-3 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Card */}
                {userMenuOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-4 border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                      isDark
                        ? 'bg-slate-900 border-white/10 text-slate-100 shadow-black/60'
                        : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                      <div className="size-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                        {currentUser.initials || 'KM'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 truncate max-w-full">
                          {currentUser.agency}
                        </div>
                      </div>
                    </div>

                    <div className="py-2.5 text-xs space-y-1.5 border-b border-slate-100 dark:border-white/10">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Role:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px] text-right">
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Officer ID:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{currentUser.id}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Accreditations:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {completedCount} of {ARCHIVED_TRAINING_VIDEOS.length} Certified
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 space-y-1">
                      <Link
                        href="/auth"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 w-full p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                      >
                        <UserCheck className="size-3.5 text-amber-500" />
                        <span>Switch Officer Account</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full p-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                      >
                        <LogOut className="size-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-xs transition"
                >
                  <LogIn className="size-3.5" />
                  <span>Sign In / Register</span>
                </Link>
              </div>
            )}


            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-white/10 text-amber-400 hover:text-amber-300'
                  : 'bg-white border-slate-200 text-amber-600 hover:text-amber-700 shadow-2xs'
              }`}
              aria-label="Toggle visual theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full border sm:hidden transition-colors cursor-pointer ${
                isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pb-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
              isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <Search className="size-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search curriculum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-inherit placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`sm:hidden border-b px-4 py-4 space-y-3 ${
              isDark ? 'bg-slate-950/95 border-white/10' : 'bg-white/95 border-slate-200 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500">Officer Session:</span>
              <div className="text-right">
                <div className={`font-bold text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {currentUser?.name || officerEmail}
                </div>
                {currentUser?.agency && (
                  <div className="text-[10px] text-slate-400">{currentUser.agency}</div>
                )}
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-1.5 px-3 text-center rounded-lg text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
                >
                  Switch Officer
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 rounded-xl text-center text-xs font-bold bg-amber-500 text-slate-950 flex items-center justify-center gap-1.5"
              >
                <LogIn className="size-3.5" />
                <span>Sign In / Register</span>
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <Link
                href="/"
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
              >
                <Home className="size-3.5 text-emerald-500" />
                <span>KMM Home</span>
              </Link>
              <Link
                href="/ip-portal"
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
              >
                <Scale className="size-3.5 text-blue-500" />
                <span>IP Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* =========================================================================
            WATCH / MODULE WORKSPACE MODE (Video Player + Embedded Tools & Docs)
            ========================================================================= */}
        {viewMode === 'watch' && currentVideo && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Bar with Back & Quick Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <button
                onClick={() => {
                  setViewMode('catalog')
                  setIsPlaying(false)
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer self-start ${
                  isDark
                    ? 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 shadow-2xs'
                }`}
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Academy Curriculum</span>
              </button>

              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-mono font-bold text-amber-500 uppercase tracking-widest">
                  {currentVideo.code}
                </span>
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                  completedModules[currentVideo.id]
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                }`}>
                  {completedModules[currentVideo.id] ? '✓ Module Certified' : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Video Player & Study Mode Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left 8 Cols: Video Screen + Module Hub (Tabs) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Media Screen */}
                <div
                  className={`rounded-3xl overflow-hidden border shadow-2xl relative transition-all ${
                    isTheaterExpanded ? 'lg:col-span-12' : ''
                  } ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-900 border-slate-800'}`}
                >
                  <div
                    className="aspect-video w-full relative flex items-center justify-center p-6 text-center overflow-hidden"
                    style={{ background: currentVideo.gradient }}
                  >
                    {/* Glow backdrop */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: currentVideo.glow }} />

                    {/* Watermark Logo */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold">
                      <GraduationCap className="size-3.5 text-amber-400" />
                      <span>KMM Institutional Masterclass</span>
                    </div>

                    <div className="absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/30">
                      {currentVideo.res}
                    </div>

                    {/* Centered Play Overlay / Presentation */}
                    <div className="relative z-10 max-w-md space-y-3 p-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="size-16 sm:size-20 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-105 cursor-pointer"
                        aria-label={isPlaying ? 'Pause masterclass' : 'Play masterclass'}
                      >
                        {isPlaying ? (
                          <Pause className="size-8 fill-current" />
                        ) : (
                          <Play className="size-8 fill-current ml-1" />
                        )}
                      </button>

                      <div className="text-white">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                          {currentVideo.code} &bull; {currentVideo.categoryLabel}
                        </span>
                        <h2 className="text-lg sm:text-2xl font-extrabold leading-tight mt-1">
                          {currentVideo.title}
                        </h2>
                      </div>
                    </div>

                    {/* Audio wave simulation */}
                    {isPlaying && (
                      <div className="absolute bottom-16 right-6 flex items-end gap-1 pointer-events-none opacity-80">
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
                  <div className="relative bg-slate-950/95 border-t border-white/10 px-4 sm:px-5 py-3 flex flex-col gap-2.5 z-20">
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
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs text-white">
                      <div className="flex items-center gap-2.5 sm:gap-3">
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
                        <span className="text-slate-400 text-[10px] sm:text-[11px] font-mono">
                          {Math.floor((progressPercent / 100) * 18)}:
                          {Math.floor(((progressPercent / 100) * 45) % 60)
                            .toString()
                            .padStart(2, '0')}{' '}
                          / {currentVideo.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 sm:gap-3">
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

                {/* =====================================================================
                    MODULE INTEGRATED WORKSPACE (TABS: Notes, Tools, Documents, Accreditation)
                    ===================================================================== */}
                <div
                  className={`rounded-3xl border overflow-hidden transition-colors ${
                    isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200/90 shadow-sm'
                  }`}
                >
                  {/* Module Title Banner */}
                  <div className="p-6 sm:p-8 pb-4 border-b border-slate-200 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                            {currentVideo.code} &bull; {currentVideo.categoryLabel}
                          </span>
                        </div>
                        <h1
                          className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                          style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                        >
                          {currentVideo.title}
                        </h1>
                      </div>

                      <button
                        onClick={() => toggleModuleCompletion(currentVideo.id)}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-sm shrink-0 ${
                          completedModules[currentVideo.id]
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        }`}
                      >
                        <CheckCircle2 className="size-4" />
                        <span>
                          {completedModules[currentVideo.id]
                            ? 'Module Accredited'
                            : 'Mark as Completed'}
                        </span>
                      </button>
                    </div>

                    {/* Integrated Studio Tab Switcher Bar */}
                    <div className="flex items-center gap-1.5 sm:gap-2 pt-6 overflow-x-auto no-scrollbar">
                      <button
                        onClick={() => setActiveVideoTab('notes')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                          activeVideoTab === 'notes'
                            ? isDark
                              ? 'bg-white text-slate-950 shadow-md'
                              : 'bg-slate-950 text-white shadow-md'
                            : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <BookOpen className="size-3.5" />
                        <span>Lesson Notes</span>
                      </button>

                      <button
                        onClick={() => setActiveVideoTab('tools')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                          activeVideoTab === 'tools'
                            ? isDark
                              ? 'bg-white text-slate-950 shadow-md'
                              : 'bg-slate-950 text-white shadow-md'
                            : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Wrench className="size-3.5 text-amber-500" />
                        <span>Interactive Tools</span>
                        <span className="size-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] flex items-center justify-center font-bold">
                          {currentVideo.tools?.length || 3}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveVideoTab('documents')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                          activeVideoTab === 'documents'
                            ? isDark
                              ? 'bg-white text-slate-950 shadow-md'
                              : 'bg-slate-950 text-white shadow-md'
                            : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Scroll className="size-3.5 text-sky-500" />
                        <span>Attached Policies &amp; Deeds</span>
                        <span className="size-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 text-[10px] flex items-center justify-center font-bold">
                          {attachedDocs.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveVideoTab('accreditation')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                          activeVideoTab === 'accreditation'
                            ? isDark
                              ? 'bg-white text-slate-950 shadow-md'
                              : 'bg-slate-950 text-white shadow-md'
                            : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <GraduationCap className="size-3.5 text-emerald-500" />
                        <span>Accreditation &amp; Sign-Off</span>
                      </button>
                    </div>
                  </div>

                  {/* Tab 1: Lesson Notes */}
                  {activeVideoTab === 'notes' && (
                    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                      {/* Speaker card */}
                      <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40">
                        <div
                          className="size-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-md shrink-0"
                          style={{ background: currentVideo.avatarBg }}
                        >
                          {currentVideo.initials}
                        </div>
                        <div>
                          <div className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {currentVideo.speaker}
                          </div>
                          <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {currentVideo.speakerRole}
                          </div>
                        </div>
                      </div>

                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {currentVideo.desc}
                      </p>

                      {/* Syllabus / Key points */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                          <FileCheck className="size-4" />
                          <span>Curriculum Checkpoints &amp; Production Standards</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5">
                          {currentVideo.points.map((pt, i) => (
                            <div
                              key={i}
                              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                                isDark ? 'bg-slate-950/60 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <span className={`size-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                                isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {i + 1}
                              </span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Statutory Citations */}
                      <div className="pt-2">
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Statutory Citations &amp; Institutional Governance
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentVideo.citations.map((c, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                                isDark
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom action pills to tools and docs */}
                      <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-white/10">
                        <button
                          onClick={() => setActiveVideoTab('tools')}
                          className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Wrench className="size-3.5" />
                          <span>Launch Practical Tools for This Module →</span>
                        </button>
                        <button
                          onClick={() => setActiveVideoTab('documents')}
                          className="px-4 py-2 rounded-full text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Scroll className="size-3.5" />
                          <span>Inspect Attached Policies ({attachedDocs.length}) →</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Embedded Practical Compliance Tools */}
                  {activeVideoTab === 'tools' && (
                    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                      {/* Tool selector bar */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Practical Verification Utilities
                            </h3>
                            <p className="text-xs text-[var(--kmm-muted)]">
                              Select a compliance engine to audit the parameters taught in this masterclass.
                            </p>
                          </div>
                        </div>

                        {/* Switcher Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <button
                            onClick={() => setActiveToolKey('safeguard')}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              activeToolKey === 'safeguard'
                                ? isDark
                                  ? 'border-amber-400/50 bg-amber-500/10 text-white shadow-xs'
                                  : 'border-amber-500 bg-amber-50 text-slate-900 shadow-2xs'
                                : isDark
                                ? 'border-white/10 bg-slate-950/40 text-slate-400 hover:text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Tool 1</span>
                              {currentVideo.tools?.includes('safeguard') && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                  Primary
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-xs">Child Safeguarding Checklist</div>
                            <div className="text-[10px] text-[var(--kmm-muted)] mt-0.5">
                              {safeguardScore}% Passed
                            </div>
                          </button>

                          <button
                            onClick={() => setActiveToolKey('age-rating')}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              activeToolKey === 'age-rating'
                                ? isDark
                                  ? 'border-amber-400/50 bg-amber-500/10 text-white shadow-xs'
                                  : 'border-amber-500 bg-amber-50 text-slate-900 shadow-2xs'
                                : isDark
                                ? 'border-white/10 bg-slate-950/40 text-slate-400 hover:text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Tool 2</span>
                              {currentVideo.tools?.includes('age-rating') && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                  Primary
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-xs">Age-Rating Calculator</div>
                            <div className="text-[10px] text-[var(--kmm-muted)] mt-0.5">
                              Computed: {computedRating.rating}
                            </div>
                          </button>

                          <button
                            onClick={() => setActiveToolKey('ip-clearance')}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              activeToolKey === 'ip-clearance'
                                ? isDark
                                  ? 'border-amber-400/50 bg-amber-500/10 text-white shadow-xs'
                                  : 'border-amber-500 bg-amber-50 text-slate-900 shadow-2xs'
                                : isDark
                                ? 'border-white/10 bg-slate-950/40 text-slate-400 hover:text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">Tool 3</span>
                              {currentVideo.tools?.includes('ip-clearance') && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-400">
                                  Primary
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-xs">IP Rights Verifier</div>
                            <div className="text-[10px] text-[var(--kmm-muted)] mt-0.5">
                              {Object.values(ipChecks).filter(Boolean).length}/5 Cleared
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Tool 1 Content */}
                      {activeToolKey === 'safeguard' && (
                        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/40 dark:bg-slate-950/30 space-y-5 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-extrabold text-base">Child Safeguarding Audit Tool</h4>
                              <p className="text-xs text-[var(--kmm-muted)]">
                                Audit on-set physical safety, audio levels, and parental consent deeds before release.
                              </p>
                            </div>
                            <span className="font-mono text-sm font-bold text-amber-500">
                              {safeguardScore}% Passed
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className={`w-full h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-white/10' : 'bg-slate-200'
                          }`}>
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                safeguardScore === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${safeguardScore}%` }}
                            />
                          </div>

                          {/* Checklist Items */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {[
                              { key: 'consent', label: '1. Minor Guardian Release Deed Signed' },
                              { key: 'strobe', label: '2. Strobe Safety Verified (< 3 Hz limit)' },
                              { key: 'loudness', label: '3. Audio Loudness at -24 LKFS Target' },
                              { key: 'tone', label: '4. Non-Frightening Emotional Narrative' },
                              { key: 'music', label: '5. Work-For-Hire Original Music Cleared' },
                              { key: 'privacy', label: '6. Minor Personal Identity Protected' },
                            ].map((item) => (
                              <label
                                key={item.key}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                                  safeguardChecks[item.key]
                                    ? isDark
                                      ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                                      : 'bg-amber-50 border-amber-300 text-slate-900 shadow-2xs'
                                    : isDark
                                    ? 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={safeguardChecks[item.key] || false}
                                  onChange={(e) =>
                                    setSafeguardChecks((prev) => ({
                                      ...prev,
                                      [item.key]: e.target.checked,
                                    }))
                                  }
                                  className="size-4 accent-amber-500 cursor-pointer rounded shrink-0"
                                />
                                <span className="leading-tight flex-1">{item.label}</span>
                              </label>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                            <button
                              onClick={copySafeguardReport}
                              className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Copy className="size-3.5" />
                              <span>Copy Verification Report</span>
                            </button>
                            <button
                              onClick={() =>
                                setSafeguardChecks({
                                  consent: false,
                                  strobe: false,
                                  loudness: false,
                                  tone: false,
                                  music: false,
                                  privacy: false,
                                })
                              }
                              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tool 2 Content */}
                      {activeToolKey === 'age-rating' && (
                        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/40 dark:bg-slate-950/30 space-y-5 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-extrabold text-base">Age-Rating &amp; Advisory Calculator</h4>
                              <p className="text-xs text-[var(--kmm-muted)]">
                                Compute official KMM broadcast certificate based on audience age and thematic parameters.
                              </p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-black border ${computedRating.color}`}>
                              {computedRating.rating}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                            <div>
                              <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-400">
                                Target Age Bracket
                              </label>
                              <select
                                value={ageCalc.ageBand}
                                onChange={(e) => setAgeCalc({ ...ageCalc, ageBand: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs outline-none"
                              >
                                <option value="0-3">0-3 Years (Infant / Nursery)</option>
                                <option value="4-7">4-7 Years (Early Childhood)</option>
                                <option value="8-12">8-12 Years (Pre-Teens)</option>
                                <option value="13+">13+ Years (Teens &amp; Family)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-400">
                                Conflict Level
                              </label>
                              <select
                                value={ageCalc.conflict}
                                onChange={(e) => setAgeCalc({ ...ageCalc, conflict: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs outline-none"
                              >
                                <option value="none">Gentle &bull; Zero Conflict</option>
                                <option value="mild">Mild Animated Slapstick</option>
                                <option value="action">Dramatic Action / Stakes</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-400">
                                Scriptural Depth
                              </label>
                              <select
                                value={ageCalc.doctrine}
                                onChange={(e) => setAgeCalc({ ...ageCalc, doctrine: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs outline-none"
                              >
                                <option value="foundational">Basic Bible Stories &amp; Songs</option>
                                <option value="character">Christian Character &amp; Ethics</option>
                                <option value="deep">In-Depth Spiritual Truths</option>
                              </select>
                            </div>
                          </div>

                          {/* Advisory Result */}
                          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${computedRating.color}`}>
                                {computedRating.rating}
                              </span>
                              <span className="font-bold text-xs">{computedRating.label}</span>
                            </div>
                            <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                              {computedRating.summary}
                            </p>
                            <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                              Air Window: {computedRating.guidance}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tool 3 Content */}
                      {activeToolKey === 'ip-clearance' && (
                        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/40 dark:bg-slate-950/30 space-y-5 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-extrabold text-base">IP Clearance &amp; Rights Verifier</h4>
                              <p className="text-xs text-[var(--kmm-muted)]">
                                Verify voice, music, character silhouette, and worldwide distribution deeds.
                              </p>
                            </div>
                            <span className="font-mono text-sm font-bold text-sky-500">
                              {Object.values(ipChecks).filter(Boolean).length}/5 Cleared
                            </span>
                          </div>

                          <div className="space-y-2 pt-1">
                            {[
                              { key: 'voice', label: 'Voice Actor Work-for-Hire Deeds Archived' },
                              { key: 'music', label: 'Original Score Master Sync Licenses Acquired' },
                              { key: 'character', label: 'Characters Registered on Kiddies Media Ministry IP Portal' },
                              { key: 'script', label: 'Script Treatments Free of 3rd Party IP' },
                              { key: 'territory', label: 'Worldwide Broadcast Territories Assigned' },
                            ].map((chk) => (
                              <label
                                key={chk.key}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                                  ipChecks[chk.key]
                                    ? isDark
                                      ? 'bg-sky-500/10 border-sky-500/30 text-slate-200'
                                      : 'bg-sky-50 border-sky-300 text-slate-900 shadow-2xs'
                                    : isDark
                                    ? 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={ipChecks[chk.key] || false}
                                  onChange={(e) =>
                                    setIpChecks((prev) => ({
                                      ...prev,
                                      [chk.key]: e.target.checked,
                                    }))
                                  }
                                  className="size-4 accent-sky-500 cursor-pointer rounded shrink-0"
                                />
                                <span className="leading-tight flex-1">{chk.label}</span>
                              </label>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                            <Link
                              href="/ip-portal"
                              className="px-4 py-2 rounded-full text-xs font-bold border border-sky-400 bg-sky-500 text-white hover:bg-sky-600 inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <Scale className="size-3.5" />
                              <span>Open IP Register in Full Portal →</span>
                            </Link>

                            <button
                              onClick={() => {
                                const count = Object.values(ipChecks).filter(Boolean).length
                                navigator.clipboard.writeText(
                                  `Kiddies Media Ministry IP Clearance Log: ${count} of 5 Verification Pillars Cleared for ${currentVideo.code}. Registered by ${currentUser?.name || officerEmail} (${currentUser?.agency || 'Lovetoons'}).`
                                )
                                showToast('IP Clearance summary copied!')
                              }}
                              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                            >
                              Copy Clearance Summary
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Attached Policies & Deeds */}
                  {activeVideoTab === 'documents' && (
                    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                      <div>
                        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Accompanying Statutory Charters &amp; Deeds
                        </h3>
                        <p className="text-xs text-[var(--kmm-muted)]">
                          These official governance documents directly govern the regulatory standards taught in {currentVideo.code}.
                        </p>
                      </div>

                      {/* Attached Documents Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {attachedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                              isDark ? 'bg-slate-950/40 border-white/10 hover:border-amber-400/30' : 'bg-slate-50/60 border-slate-200 hover:border-amber-500/40 hover:bg-white shadow-2xs'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                                  {doc.code}
                                </span>
                                <span className="text-[10px] text-[var(--kmm-muted)]">{doc.pages}</span>
                              </div>
                              <h4 className="font-extrabold text-sm leading-snug line-clamp-2">
                                {doc.title}
                              </h4>
                              <p className="text-xs text-[var(--kmm-muted)] line-clamp-2">
                                {doc.desc}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                              <button
                                onClick={() => setReadingDoc(doc)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 cursor-pointer"
                              >
                                <Eye className="size-3.5" />
                                <span>Read Document</span>
                              </button>

                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Download Text"
                              >
                                <Download className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Browse Other Documents Drawer */}
                      {otherDocs.length > 0 && (
                        <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-muted)]">
                            Other Academy Charters Available in Repository ({otherDocs.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {otherDocs.map((doc) => (
                              <button
                                key={doc.id}
                                onClick={() => setReadingDoc(doc)}
                                className="p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/40 text-left hover:border-amber-400 transition-colors cursor-pointer group"
                              >
                                <div className="text-[10px] font-mono font-bold text-amber-500 mb-0.5">
                                  {doc.code}
                                </div>
                                <div className="font-bold text-xs truncate group-hover:text-amber-500 transition-colors">
                                  {doc.title}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 4: Accreditation & Sign-Off */}
                  {activeVideoTab === 'accreditation' && (
                    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Module Verification &amp; Institutional Sign-Off
                          </h3>
                          <p className="text-xs text-[var(--kmm-muted)]">
                            Verify completion of video lecture, practical audit tools, and accompanying policy charters.
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                          completedModules[currentVideo.id]
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        }`}>
                          {completedModules[currentVideo.id] ? '✓ Accreditated' : 'Pending Verification'}
                        </span>
                      </div>

                      {/* Criteria Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-[var(--kmm-muted)]">Step 1: Video Lecture</div>
                          <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="size-3.5" />
                            <span>{progressPercent >= 80 ? 'Completed (100%)' : `In Progress (${progressPercent}%)`}</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-[var(--kmm-muted)]">Step 2: Practical Tools</div>
                          <div className="font-bold text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <Wrench className="size-3.5" />
                            <span>Audit Score: {safeguardScore}%</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-[var(--kmm-muted)]">Step 3: Statutory Policies</div>
                          <div className="font-bold text-xs flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                            <Scroll className="size-3.5" />
                            <span>{attachedDocs.length} Charters Attached</span>
                          </div>
                        </div>
                      </div>

                      {/* Official Digital Certificate Card */}
                      <div className="p-6 sm:p-7 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 space-y-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3.5">
                            <div className="size-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
                              <Award className="size-6" />
                            </div>
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                KMM Academy Accreditation Certificate
                              </div>
                              <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                                {currentUser?.name || officerEmail}
                              </div>
                              <div className="text-xs text-[var(--kmm-muted)] font-medium">
                                {currentUser?.role || 'Child Safeguarding Reviewer'} &bull; <span className="font-bold text-amber-600 dark:text-amber-400">{currentUser?.agency || 'Lovetoons Content Operations'}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            completedModules[currentVideo.id]
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          }`}>
                            {completedModules[currentVideo.id] ? '✓ Certified & Registered' : 'Pending Verification'}
                          </span>
                        </div>

                        <div className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                          This verifiable digital credential confirms that <b>{currentUser?.name || officerEmail}</b> has completed all statutory compliance benchmarks under <b>{currentVideo.code}: {currentVideo.title}</b> in accordance with Loveworld Kingdom children safeguarding directives.
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] border-t border-amber-500/20">
                          <div>
                            <span className="block text-slate-400 text-[10px] uppercase font-bold">Officer ID</span>
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser?.id || 'TP-OFFICER-2026'}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[10px] uppercase font-bold">Certificate Hash</span>
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">KMM-ACR-{currentVideo.id}-2026</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[10px] uppercase font-bold">Issued Authority</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">KMM Academy Directorate</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[10px] uppercase font-bold">Verification Status</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {completedModules[currentVideo.id] ? 'Active & Signed' : 'Ready to Issue'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-500/20 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              window.print()
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition text-xs"
                          >
                            <Printer className="size-3.5 text-amber-500" />
                            <span>Print / Save Certificate PDF</span>
                          </button>

                          <button
                            onClick={() => toggleModuleCompletion(currentVideo.id)}
                            className={`px-5 py-2 rounded-full font-bold text-xs transition-colors cursor-pointer shadow-xs ${
                              completedModules[currentVideo.id]
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            }`}
                          >
                            {completedModules[currentVideo.id]
                              ? 'Revoke & Retake Module'
                              : 'Sign & Issue Accreditation Certificate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right 4 Cols: Up Next / Curriculum Playlist */}
              <div className="lg:col-span-4 space-y-4">
                <div className={`flex items-center justify-between text-xs font-bold px-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="uppercase tracking-wider">Curriculum Masterclasses</span>
                  <span>{ARCHIVED_TRAINING_VIDEOS.length} Modules</span>
                </div>

                <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
                  {ARCHIVED_TRAINING_VIDEOS.map((vid) => {
                    const isCurrent = vid.id === currentVideo.id
                    return (
                      <div
                        key={vid.id}
                        onClick={() => startPlayingVideo(vid, 'notes')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex gap-3 ${
                          isCurrent
                            ? isDark
                              ? 'bg-amber-500/10 border-amber-400/40 shadow-xs'
                              : 'bg-amber-50/80 border-amber-300 shadow-xs'
                            : isDark
                            ? 'bg-slate-900/50 border-white/5 hover:border-amber-400/40 hover:bg-slate-800/50'
                            : 'bg-white border-slate-200 hover:border-amber-500/40 hover:bg-slate-50 shadow-2xs'
                        }`}
                      >
                        <div
                          className="w-24 h-18 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden text-xs font-bold shadow-xs group-hover:scale-102 transition-transform"
                          style={{ background: vid.gradient }}
                        >
                          <span className={`size-7 rounded-full flex items-center justify-center text-[10px] shadow-md ${
                            isCurrent ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-white/80 text-slate-950'
                          }`}>
                            <Play className="size-3 fill-current ml-0.5" />
                          </span>
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/70 px-1 rounded text-white">
                            {vid.duration}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                              {vid.code}
                            </span>
                            {completedModules[vid.id] && (
                              <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                            isCurrent
                              ? 'text-amber-600 dark:text-amber-400'
                              : isDark
                              ? 'text-slate-200 group-hover:text-amber-400'
                              : 'text-slate-900 group-hover:text-amber-600'
                          }`}>
                            {vid.title}
                          </h4>

                          {/* Quick indicators of tools and docs inside */}
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[var(--kmm-muted)]">
                            <span>🛠️ {vid.tools?.length || 2} Tools</span>
                            <span>&bull;</span>
                            <span>📄 {vid.docIds?.length || 1} Docs</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CATALOG VIEW (Modern Academy Dashboard + Curriculum Masterclasses)
            ========================================================================= */}
        {viewMode === 'catalog' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Modern Hero & Dashboard Overview */}
            <section
              className={`p-6 sm:p-10 rounded-[32px] border relative overflow-hidden shadow-sm transition-colors ${
                isDark
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border-white/10'
                  : 'bg-gradient-to-br from-white via-amber-50/20 to-sky-50/20 border-slate-200/90'
              }`}
            >
              <div className="relative z-10 space-y-6">
                <div className="max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <GraduationCap className="size-3.5" />
                    <span className="uppercase tracking-widest text-[10px]">Academy Agency Directorate</span>
                  </div>

                  <h1
                    className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                    style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  >
                    Officer Training &amp; Compliance Hub
                  </h1>

                  <p className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Official regulatory curriculums covering international child broadcast safety, COPPA mobile privacy, copyright licensing, and scriptural integrity. Each masterclass includes live interactive compliance utilities and statutory policy deeds directly inside the video studio.
                  </p>
                </div>

                {/* Stat Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
                  <div className={`p-4 sm:p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-white/10' : 'bg-white/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">
                      Curriculum
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold">8 Masterclasses</div>
                    <div className="text-xs text-amber-500 mt-0.5">4K Broadcast Masters</div>
                  </div>

                  <div className={`p-4 sm:p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-white/10' : 'bg-white/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">
                      Integrated Tools
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold">3 Utilities</div>
                    <div className="text-xs text-amber-500 mt-0.5">Embedded in Lessons</div>
                  </div>

                  <div className={`p-4 sm:p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-white/10' : 'bg-white/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">
                      Statutory Charters
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold">5 Policy Manuals</div>
                    <div className="text-xs text-sky-500 mt-0.5">Full-Text Reader &amp; PDF</div>
                  </div>

                  <div className={`p-4 sm:p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-white/10' : 'bg-white/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">
                      Your Accreditation
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold">{completedCount} of 8 Done</div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mt-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${progressPercentTotal}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'All Disciplines' },
                  { id: 'broadcast', label: 'Broadcast Standards' },
                  { id: 'protection', label: 'Child Protection' },
                  { id: 'copyright', label: 'Copyright & IP' },
                  { id: 'doctrinal', label: 'Scriptural Review' },
                  { id: 'merchandising', label: 'Production & QA' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : isDark
                        ? 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Status Toggle Pills */}
              <div className="flex items-center gap-1 self-start lg:self-auto text-xs font-semibold">
                <span className="text-[var(--kmm-muted)] text-[11px] mr-1">Status:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'in-progress', label: 'In Progress' },
                  { id: 'completed', label: 'Accredited' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === s.id
                        ? isDark
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-slate-900 text-white font-bold'
                        : 'text-[var(--kmm-muted)] hover:text-[var(--kmm-fg)]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Curriculum Masterclasses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredVideos.map((video) => {
                const isCertified = !!completedModules[video.id]
                return (
                  <div
                    key={video.id}
                    className={`rounded-[28px] border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      isDark
                        ? 'bg-slate-900/60 border-white/10 hover:border-amber-400/40'
                        : 'bg-white border-slate-200/90 hover:border-amber-500/40 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Video Thumbnail Header */}
                      <div
                        onClick={() => startPlayingVideo(video, 'notes')}
                        className="aspect-[16/9] w-full relative flex items-center justify-center p-5 cursor-pointer group overflow-hidden"
                        style={{ background: video.gradient }}
                      >
                        <div className="absolute inset-0 pointer-events-none opacity-80" style={{ background: video.glow }} />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-black/60 text-amber-400 border border-amber-400/30">
                            {video.code}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white border border-white/20">
                            {video.categoryLabel}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300">
                          {video.duration}
                        </div>

                        {/* Play Button Icon */}
                        <div className="size-14 rounded-full bg-amber-500 group-hover:scale-110 text-slate-950 flex items-center justify-center shadow-xl transition-transform">
                          <Play className="size-6 fill-current ml-0.5" />
                        </div>

                        {/* Completed Stamp */}
                        {isCertified && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] shadow-md">
                            <CheckCircle2 className="size-3 fill-current" />
                            <span>Accredited</span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <div className="space-y-1.5">
                          <h3
                            onClick={() => startPlayingVideo(video, 'notes')}
                            className="font-extrabold text-base leading-snug cursor-pointer hover:text-amber-500 transition-colors line-clamp-2"
                            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                          >
                            {video.title}
                          </h3>
                          <p className="text-xs text-[var(--kmm-muted)] line-clamp-2 leading-relaxed">
                            {video.desc}
                          </p>
                        </div>

                        {/* Embedded Tools & Docs Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <button
                            onClick={() => startPlayingVideo(video, 'tools')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors cursor-pointer"
                            title="Launch embedded compliance tools for this module"
                          >
                            <Wrench className="size-3" />
                            <span>{video.tools?.length || 2} Tools Embedded</span>
                          </button>

                          <button
                            onClick={() => startPlayingVideo(video, 'documents')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25 hover:bg-sky-500/20 transition-colors cursor-pointer"
                            title="Inspect attached policies and charters"
                          >
                            <Scroll className="size-3" />
                            <span>{video.docIds?.length || 1} Attached Policies</span>
                          </button>
                        </div>

                        {/* Speaker Information */}
                        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
                          <div
                            className="size-7 rounded-xl flex items-center justify-center font-bold text-[10px] text-white shadow-xs shrink-0"
                            style={{ background: video.avatarBg }}
                          >
                            {video.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold truncate text-[11px]">{video.speaker}</div>
                            <div className="text-[10px] text-[var(--kmm-muted)] truncate">{video.speakerRole}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <div className="p-5 sm:p-6 pt-0">
                      <button
                        onClick={() => startPlayingVideo(video, 'notes')}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isCertified
                            ? isDark
                              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                        }`}
                      >
                        <Play className="size-3.5 fill-current" />
                        <span>{isCertified ? 'Review Masterclass & Tools' : 'Start Masterclass & Tools →'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Directory Strip: Interactive Tools & Policies Across the Curriculum */}
            <section
              className={`p-6 sm:p-8 rounded-[28px] border space-y-5 transition-colors ${
                isDark ? 'bg-slate-900/40 border-white/10' : 'bg-slate-100/60 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                    <Wrench className="size-4 text-amber-500" />
                    <span>Curriculum Tools &amp; Policy Charters Directory</span>
                  </h3>
                  <p className="text-xs text-[var(--kmm-muted)]">
                    All tools and documents are integrated directly inside their respective video lessons above. Quick launch any module below:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => {
                    const vid = ARCHIVED_TRAINING_VIDEOS.find((v) => v.id === 'vid-1') || ARCHIVED_TRAINING_VIDEOS[0]
                    startPlayingVideo(vid, 'tools')
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isDark ? 'bg-slate-950/60 border-white/10 hover:border-amber-400' : 'bg-white border-slate-200 hover:border-amber-500 shadow-2xs'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-amber-500 mb-1">Interactive Tool 1</div>
                  <h4 className="font-bold text-xs group-hover:text-amber-500 transition-colors">
                    Child Safeguarding Audit Checklist
                  </h4>
                  <p className="text-[11px] text-[var(--kmm-muted)] mt-1 line-clamp-2">
                    Included inside <b>GOV-101</b>, <b>DAT-603</b>, and <b>TAL-305</b>.
                  </p>
                  <span className="text-[10px] font-bold text-amber-500 inline-flex items-center gap-1 mt-2">
                    Launch in Module →
                  </span>
                </div>

                <div
                  onClick={() => {
                    const vid = ARCHIVED_TRAINING_VIDEOS.find((v) => v.id === 'vid-4') || ARCHIVED_TRAINING_VIDEOS[0]
                    startPlayingVideo(vid, 'tools')
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isDark ? 'bg-slate-950/60 border-white/10 hover:border-amber-400' : 'bg-white border-slate-200 hover:border-amber-500 shadow-2xs'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-amber-500 mb-1">Interactive Tool 2</div>
                  <h4 className="font-bold text-xs group-hover:text-amber-500 transition-colors">
                    Age-Rating &amp; Advisory Calculator
                  </h4>
                  <p className="text-[11px] text-[var(--kmm-muted)] mt-1 line-clamp-2">
                    Included inside <b>DEF-401</b>, <b>DOC-102</b>, and <b>INT-702</b>.
                  </p>
                  <span className="text-[10px] font-bold text-amber-500 inline-flex items-center gap-1 mt-2">
                    Launch in Module →
                  </span>
                </div>

                <div
                  onClick={() => {
                    const vid = ARCHIVED_TRAINING_VIDEOS.find((v) => v.id === 'vid-3') || ARCHIVED_TRAINING_VIDEOS[0]
                    startPlayingVideo(vid, 'tools')
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isDark ? 'bg-slate-950/60 border-white/10 hover:border-sky-400' : 'bg-white border-slate-200 hover:border-sky-500 shadow-2xs'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-sky-500 mb-1">Interactive Tool 3</div>
                  <h4 className="font-bold text-xs group-hover:text-sky-500 transition-colors">
                    IP Clearance &amp; Licensing Verifier
                  </h4>
                  <p className="text-[11px] text-[var(--kmm-muted)] mt-1 line-clamp-2">
                    Included inside <b>LAW-204</b>, <b>MER-502</b>, and <b>TAL-305</b>.
                  </p>
                  <span className="text-[10px] font-bold text-sky-500 inline-flex items-center gap-1 mt-2">
                    Launch in Module →
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* =========================================================================
          DOCUMENT MODAL (Reader for Supporting Documents)
          ========================================================================= */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
              isDark ? 'bg-slate-900 border-white/15 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded">
                    {readingDoc.code}
                  </span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>&bull;</span>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {readingDoc.classification}
                  </span>
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-extrabold leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  {readingDoc.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(readingDoc.content)
                    showToast('Document text copied to clipboard!')
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Copy Document Text"
                >
                  <Copy className="size-4" />
                </button>

                <button
                  onClick={handlePrintDocument}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Print / Save as PDF"
                >
                  <Printer className="size-4" />
                </button>

                <button
                  onClick={() => setReadingDoc(null)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  aria-label="Close document modal"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Preformatted Document Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4 font-mono text-xs sm:text-sm leading-relaxed">
              <div
                className={`p-4 sm:p-6 rounded-2xl border font-sans text-xs ${
                  isDark ? 'bg-black/20 text-slate-200 border-white/5' : 'bg-slate-50/80 text-slate-800 border-slate-200'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-amber-500 mb-1">Document Synopsis</div>
                <p className="leading-relaxed">{readingDoc.desc}</p>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl border whitespace-pre-wrap ${
                isDark ? 'bg-slate-950 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {readingDoc.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 px-6 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
              <span>Accreditation Reference: {readingDoc.code} &bull; {readingDoc.pages}</span>
              <button
                onClick={() => setReadingDoc(null)}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`border-t py-12 px-4 sm:px-6 transition-colors text-xs ${
          isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Kiddies Media Ministry Academy Directorate
              </span>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Institutional compliance, child safeguarding covenants, and broadcast licensing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Landing Page
            </Link>
            <Link href="/ip-portal" className="hover:text-amber-500 transition-colors">
              IP Register
            </Link>
            <Link href="/onboarding" className="hover:text-amber-500 transition-colors">
              Expression of Interest
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
