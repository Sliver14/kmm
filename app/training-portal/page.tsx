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
  ArrowRightLeft,
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
} from 'lucide-react'
import { ARCHIVED_TRAINING_VIDEOS, VideoItem } from '@/lib/data/trainingVideosData'

const AGENCIES_LIST = [
  {
    name: 'Lovetoons',
    tagline: 'Animation & Entertainment',
    description: 'Animation series, TV broadcast, character IP & children entertainment.',
    href: '/#agencies-lovetoons',
    badge: 'Flagship',
  },
  {
    name: 'Publishing Agency',
    tagline: 'Literature & Curriculum',
    description: 'Comics, devotional books, storybooks, illustrated print & curriculum.',
    href: '/#agencies-publishing',
    badge: 'Publishing',
  },
  {
    name: 'Digital Agency',
    tagline: 'Interactive & Apps',
    description: 'Interactive games, educational mobile apps, AR/VR & online portals.',
    href: '/#agencies-digital',
    badge: 'Technology',
  },
  {
    name: 'Academy Agency',
    tagline: 'Governance & Training',
    description: 'Legal compliance, officer accreditation, policy auditing & safety covenants.',
    href: '/training-portal',
    badge: 'Governance',
  },
  {
    name: 'Educational Agency',
    tagline: 'Foundational Learning',
    description: 'School partnerships, foundational learning aids & global outreaches.',
    href: '/#agencies-educational',
    badge: 'Education',
  },
]

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
  const [officerEmail, setOfficerEmail] = useState('Barrister Lillian')
  const [activeTab, setActiveTab] = useState<'all' | 'materials' | 'tools' | 'documents'>('all')
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
  const [agenciesDropdownOpen, setAgenciesDropdownOpen] = useState(false)
  const agenciesDropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('kmm_training_theme') || localStorage.getItem('kmm_theme')
    const darkActive = savedTheme === 'dark'
    setIsDark(darkActive)
    if (typeof window !== 'undefined') {
      if (darkActive) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    const auth = localStorage.getItem('kmm_auth_officer')
    if (auth) {
      const name = auth.split('@')[0]
      setOfficerEmail(name.charAt(0).toUpperCase() + name.slice(1))
    }

    // Load completed modules from storage
    try {
      const savedModules = localStorage.getItem('kmm_completed_modules')
      if (savedModules) {
        setCompletedModules(JSON.parse(savedModules))
      }
    } catch {
      // ignore
    }

    // Parse URL tab parameter
    try {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'materials' || tab === 'tools' || tab === 'documents') {
        setActiveTab(tab)
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
  }, [])

  // Close agencies dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (agenciesDropdownRef.current && !agenciesDropdownRef.current.contains(e.target as Node)) {
        setAgenciesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    localStorage.setItem('kmm_theme', next ? 'dark' : 'light')
    if (typeof window !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const startPlayingVideo = (video: VideoItem) => {
    setCurrentVideo(video)
    setViewMode('watch')
    setIsPlaying(true)
    setProgressPercent(10)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleModuleCompletion = (moduleId: string) => {
    setCompletedModules((prev) => {
      const next = { ...prev, [moduleId]: !prev[moduleId] }
      localStorage.setItem('kmm_completed_modules', JSON.stringify(next))
      if (next[moduleId]) {
        showToast('Module marked as Completed & Accredited!')
      }
      return next
    })
  }

  // Filtered Training Materials
  const filteredVideos = useMemo(() => {
    return ARCHIVED_TRAINING_VIDEOS.filter((vid) => {
      const matchesCat = activeFilter === 'all' || vid.category === activeFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        vid.title.toLowerCase().includes(q) ||
        vid.desc.toLowerCase().includes(q) ||
        vid.code.toLowerCase().includes(q) ||
        vid.speaker.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [activeFilter, searchQuery])

  // Filtered Supporting Documents
  const filteredDocuments = useMemo(() => {
    return SUPPORTING_DOCUMENTS.filter((doc) => {
      const matchesCat = activeFilter === 'all' || doc.category === activeFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.desc.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q) ||
        doc.classification.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [activeFilter, searchQuery])

  // Tool 1: Safeguard score calculation
  const safeguardScore = useMemo(() => {
    const total = 6
    const checked = Object.values(safeguardChecks).filter(Boolean).length
    return Math.round((checked / total) * 100)
  }, [safeguardChecks])

  const copySafeguardReport = () => {
    const checkedCount = Object.values(safeguardChecks).filter(Boolean).length
    const text = `KIDDIES MEDIA MINISTRY CHILD SAFEGUARDING AUDIT VERIFICATION REPORT
Generated by: Officer ${officerEmail}
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

      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDark ? 'bg-slate-950/85 border-white/10' : 'bg-white/90 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group text-inherit no-underline shrink-0"
              title="Return to Kiddies Media Ministry Main Home"
            >
              <div className="size-9 sm:size-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="size-4.5 sm:size-5 font-black" />
              </div>
              <div className="min-w-0">
                <div
                  className="font-extrabold text-sm sm:text-lg leading-tight tracking-tight truncate"
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  <span className="sm:hidden">KMM Training</span>
                  <span className="hidden sm:inline">Kiddies Media Ministry Training Portal</span>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-amber-500 uppercase tracking-widest truncate">
                  <span className="sm:hidden">Materials &bull; Tools</span>
                  <span className="hidden sm:inline">Materials &bull; Tools &bull; Supporting Documents</span>
                </div>
              </div>
            </Link>

            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600 text-xs font-semibold px-1">/</span>

            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className={`px-2.5 py-1 rounded-full border text-[11px] ${
                isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                Institutional Portal
              </span>
            </div>
          </div>

          {/* Center search (desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div
              className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition-all ${
                isDark
                  ? 'bg-slate-900 border-white/10 focus-within:border-amber-400 text-white'
                  : 'bg-slate-50 border-slate-200 focus-within:border-amber-500 text-slate-900 focus-within:bg-white'
              }`}
            >
              <Search className="size-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search training modules, tools, supporting documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 text-inherit"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Link to IP Portal */}
            <Link
              href="/ip-portal"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isDark
                  ? 'border-white/15 text-slate-300 hover:text-white hover:bg-white/5'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'
              }`}
              title="Switch to Intellectual Property Portal"
            >
              <Scale className="size-3 text-amber-500" />
              <span>IP Portal</span>
            </Link>

            {/* Agencies Dropdown (no icons) */}
            <div className="relative hidden md:block" ref={agenciesDropdownRef}>
              <button
                type="button"
                onClick={() => setAgenciesDropdownOpen((prev) => !prev)}
                onMouseEnter={() => setAgenciesDropdownOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  agenciesDropdownOpen
                    ? isDark
                      ? 'bg-slate-800 border-amber-400/40 text-amber-400'
                      : 'bg-slate-100 border-slate-300 text-slate-900'
                    : isDark
                    ? 'border-white/15 text-slate-300 hover:text-white hover:bg-white/5'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                aria-expanded={agenciesDropdownOpen}
              >
                <span>Agencies</span>
                <ChevronDown className={`size-3 transition-transform ${agenciesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {agenciesDropdownOpen && (
                <div
                  onMouseLeave={() => setAgenciesDropdownOpen(false)}
                  className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-2 shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDark ? 'bg-slate-900 border-white/15 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-slate-200 dark:border-white/10 mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Ministry Agencies</span>
                    <span>5 Arms</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {AGENCIES_LIST.map((ag) => (
                      <Link
                        key={ag.name}
                        href={ag.href}
                        onClick={() => setAgenciesDropdownOpen(false)}
                        className={`p-2 rounded-xl transition-colors text-left flex flex-col ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{ag.name}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ag.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{ag.tagline}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer authenticated status */}
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`font-bold truncate max-w-[120px] ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{officerEmail}</span>
            </div>

            {/* Officer switch profile button */}
            <Link
              href="/auth"
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
              title="Switch Officer Authentication"
            >
              <ArrowRightLeft className="size-4" />
            </Link>

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
        <div className="lg:hidden px-4 pb-3">
          <div
            className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs ${
              isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <Search className="size-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search modules, tools, supporting documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-inherit placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Drawer when hamburger opened */}
        {mobileMenuOpen && (
          <div
            className={`sm:hidden border-t px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 ${
              isDark ? 'bg-slate-950/95 border-white/10' : 'bg-white/95 border-slate-200 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{officerEmail}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
              }`}>
                Institutional Officer
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/ip-portal"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Scale className="size-3.5 text-amber-500" />
                <span>IP Portal</span>
              </Link>
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ArrowRightLeft className="size-3.5 text-sky-500" />
                <span>Switch Officer</span>
              </Link>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Home className="size-3.5 text-emerald-500" />
                <span>KMM Home</span>
              </Link>
              <button
                onClick={() => {
                  toggleTheme()
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors text-left cursor-pointer ${
                  isDark
                    ? 'border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {isDark ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-indigo-500" />}
                <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>

            {/* Mobile Agencies List (no icons) */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Ministry Agencies
              </span>
              <div className="grid grid-cols-1 gap-1">
                {AGENCIES_LIST.map((ag) => (
                  <Link
                    key={ag.name}
                    href={ag.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{ag.name}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">{ag.badge}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <button
                onClick={() => {
                  setActiveTab('materials')
                  setMobileMenuOpen(false)
                }}
                className="hover:text-amber-500"
              >
                Materials ({ARCHIVED_TRAINING_VIDEOS.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('tools')
                  setMobileMenuOpen(false)
                }}
                className="hover:text-amber-500"
              >
                Tools (3)
              </button>
              <button
                onClick={() => {
                  setActiveTab('documents')
                  setMobileMenuOpen(false)
                }}
                className="hover:text-amber-500"
              >
                Docs ({SUPPORTING_DOCUMENTS.length})
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* =========================================================================
            WATCH / STUDY GUIDE MODE (When a training module is active)
            ========================================================================= */}
        {viewMode === 'watch' && currentVideo && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              onClick={() => {
                setViewMode('catalog')
                setIsPlaying(false)
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 shadow-2xs'
              }`}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Training Portal &amp; Resources</span>
            </button>

            {/* Video Player & Study Mode Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left 8 Cols: Video Viewport & Curriculum Takeaways */}
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
                      <span>Kiddies Media Ministry Institutional Masterclass</span>
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

                {/* Module Details & Accreditation Box */}
                <div
                  className={`p-5 sm:p-8 rounded-3xl border transition-colors space-y-6 ${
                    isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                        Module Code: {currentVideo.code}
                      </span>
                      <h1
                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                        style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                      >
                        {currentVideo.title}
                      </h1>
                    </div>

                    <button
                      onClick={() => toggleModuleCompletion(currentVideo.id)}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-md shrink-0 w-full sm:w-auto ${
                        completedModules[currentVideo.id]
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      }`}
                    >
                      <CheckCircle2 className="size-4" />
                      <span>
                        {completedModules[currentVideo.id]
                          ? 'Accredited & Completed'
                          : 'Mark as Completed'}
                      </span>
                    </button>
                  </div>

                  {/* Speaker card */}
                  <div className="flex items-center gap-3">
                    <div
                      className="size-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-md shrink-0"
                      style={{ background: currentVideo.avatarBg }}
                    >
                      {currentVideo.initials}
                    </div>
                    <div>
                      <div className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentVideo.speaker}</div>
                      <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentVideo.speakerRole}</div>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {currentVideo.desc}
                  </p>

                  {/* Syllabus / Key points */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <FileCheck className="size-4" />
                      <span>Curriculum Points &amp; Production Standards</span>
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
                </div>
              </div>

              {/* Right 4 Cols: Up next / Other Modules */}
              <div className="lg:col-span-4 space-y-4">
                <div className={`flex items-center justify-between text-xs font-bold px-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span>Other Training Modules</span>
                  <span>{ARCHIVED_TRAINING_VIDEOS.length} Total</span>
                </div>

                <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
                  {ARCHIVED_TRAINING_VIDEOS.filter((v) => v.id !== currentVideo.id).map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => startPlayingVideo(vid)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex gap-3 ${
                        isDark
                          ? 'bg-slate-900/50 border-white/5 hover:border-amber-400/40 hover:bg-slate-800/50'
                          : 'bg-white border-slate-200 hover:border-amber-500/40 hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
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

                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                            {vid.code}
                          </span>
                          {completedModules[vid.id] && (
                            <Check className="size-3 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                          isDark ? 'text-slate-200 group-hover:text-amber-400' : 'text-slate-900 group-hover:text-amber-600'
                        }`}>
                          {vid.title}
                        </h4>
                        <span className={`text-[11px] mt-1 truncate ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>{vid.speaker}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CATALOG VIEW (Tabs: All Resources, Materials, Tools, Supporting Documents)
            ========================================================================= */}
        {viewMode === 'catalog' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Overview Hero Banner */}
            <section
              className={`rounded-3xl border overflow-hidden p-6 sm:p-8 lg:p-12 relative shadow-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/60 border-white/10'
                  : 'bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 border-slate-200'
              }`}
            >
              <div className="max-w-3xl relative z-10 space-y-4">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isDark
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-amber-100/80 border-amber-300 text-amber-800'
                }`}>
                  <GraduationCap className="size-4" />
                  <span>Kiddies Media Ministry Institutional Training &amp; Resources</span>
                </div>

                <h1
                  className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  Training Materials, Tools &amp; Supporting Documents
                </h1>

                <p className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  The official institutional training repository for Kiddies Media Ministry officers, department heads, animators, and broadcast compliance reviewers. Explore specialized training materials, launch practical compliance tools, and access helpful supporting documents.
                </p>

                {/* Quick Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3">
                  <div
                    onClick={() => setActiveTab('materials')}
                    className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-102 ${
                      activeTab === 'materials'
                        ? isDark
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-amber-500 bg-amber-50 shadow-xs'
                        : isDark
                        ? 'border-white/10 bg-slate-900/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-500">{ARCHIVED_TRAINING_VIDEOS.length}</div>
                    <div className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Training Modules</div>
                  </div>

                  <div
                    onClick={() => setActiveTab('tools')}
                    className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-102 ${
                      activeTab === 'tools'
                        ? isDark
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-amber-500 bg-amber-50 shadow-xs'
                        : isDark
                        ? 'border-white/10 bg-slate-900/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-500">3</div>
                    <div className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Practical Tools</div>
                  </div>

                  <div
                    onClick={() => setActiveTab('documents')}
                    className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-102 ${
                      activeTab === 'documents'
                        ? isDark
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-amber-500 bg-amber-50 shadow-xs'
                        : isDark
                        ? 'border-white/10 bg-slate-900/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-500">{SUPPORTING_DOCUMENTS.length}</div>
                    <div className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Supporting Docs</div>
                  </div>

                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl border ${
                      isDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-500">100%</div>
                    <div className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Zero-Defect Goal</div>
                  </div>
                </div>

                <div className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold pt-3 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-emerald-500" />
                    <span>Officer Authenticated ({officerEmail})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-amber-500" />
                    <span>Statutory Child Safeguarding</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Scroll className="size-3.5 text-sky-500" />
                    <span>Broadcast Playout Standards</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Level Tab Switcher */}
            <div className={`flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl sm:rounded-full border w-full sm:w-fit overflow-x-auto ${
              isDark ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white shadow-2xs'
            }`}>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Resources
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Training Materials</span>
                <span className={`size-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeTab === 'materials'
                    ? 'bg-slate-950/20 text-slate-950'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {ARCHIVED_TRAINING_VIDEOS.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'tools'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Practical Tools</span>
                <span className={`size-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeTab === 'tools'
                    ? 'bg-slate-950/20 text-slate-950'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  3
                </span>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'documents'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Supporting Documents</span>
                <span className={`size-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeTab === 'documents'
                    ? 'bg-slate-950/20 text-slate-950'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {SUPPORTING_DOCUMENTS.length}
                </span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={`inline-flex items-center px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                        : isDark
                        ? 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className={`text-xs font-bold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeTab === 'materials'
                  ? `${filteredVideos.length} Modules Filtered`
                  : activeTab === 'documents'
                  ? `${filteredDocuments.length} Documents Filtered`
                  : activeTab === 'tools'
                  ? '3 Practical Utilities'
                  : `${filteredVideos.length} Modules &bull; 3 Tools &bull; ${filteredDocuments.length} Docs`}
              </div>
            </div>

            {/* =========================================================================
                SECTION 1: RELEVANT TRAINING MATERIALS (8 Modules)
                ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'materials') && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <GraduationCap className="size-4" />
                      <span>Curriculum &amp; Masterclasses</span>
                    </div>
                    <h2
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                      style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                    >
                      Relevant Training Materials
                    </h2>
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Interactive Video &amp; Study Guides
                  </span>
                </div>

                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => startPlayingVideo(vid)}
                        className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-2xl ${
                          isDark
                            ? 'bg-slate-900/60 border-white/10 hover:border-amber-400/50 shadow-black/40'
                            : 'bg-white border-slate-200 hover:border-amber-500/50 shadow-slate-200/50'
                        }`}
                      >
                        {/* Card Thumbnail */}
                        <div
                          className="h-44 relative flex items-center justify-center p-4 overflow-hidden"
                          style={{ background: vid.gradient }}
                        >
                          <div className="size-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                            <Play className="size-5 fill-current ml-0.5" />
                          </div>

                          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-amber-400 border border-amber-400/30">
                            {vid.code}
                          </span>

                          <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-black/70 px-2 py-0.5 rounded text-white">
                            {vid.duration}
                          </span>

                          {completedModules[vid.id] && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                              <Check className="size-3" />
                              <span>Accredited</span>
                            </span>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                                {vid.categoryLabel}
                              </span>
                              <span className={`text-[10px] font-semibold ml-auto ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}>{vid.res}</span>
                            </div>

                            <h3
                              className={`text-base font-extrabold leading-snug group-hover:text-amber-500 transition-colors line-clamp-2 mb-2 ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                              style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                            >
                              {vid.title}
                            </h3>

                            <p className={`text-xs line-clamp-2 leading-relaxed ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>{vid.desc}</p>
                          </div>

                          {/* Speaker footer */}
                          <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                            isDark ? 'border-white/10' : 'border-slate-100'
                          }`}>
                            <div className="flex items-center gap-2">
                              <div
                                className="size-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-2xs"
                                style={{ background: vid.avatarBg }}
                              >
                                {vid.initials}
                              </div>
                              <span className={`font-semibold truncate max-w-[130px] sm:max-w-[140px] ${
                                isDark ? 'text-slate-300' : 'text-slate-800'
                              }`}>
                                {vid.speaker}
                              </span>
                            </div>

                            <span className="inline-flex items-center gap-1 font-bold text-amber-500 group-hover:translate-x-1 transition-transform shrink-0">
                              <span className="hidden xs:inline">Open Masterclass</span>
                              <ChevronRight className="size-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`rounded-3xl border border-dashed p-10 text-center space-y-3 ${
                      isDark ? 'bg-slate-900/30 border-white/10' : 'bg-slate-100/50 border-slate-300'
                    }`}
                  >
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No training modules matched the selected category or search filter.</p>
                    <button
                      onClick={() => {
                        setActiveFilter('all')
                        setSearchQuery('')
                      }}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 text-slate-950 cursor-pointer shadow-xs"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* =========================================================================
                SECTION 2: PRACTICAL INTERACTIVE COMPLIANCE TOOLS (3 Tools)
                ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'tools') && (
              <section className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Wrench className="size-4" />
                      <span>Interactive Production Utilities</span>
                    </div>
                    <h2
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                      style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                    >
                      Practical Compliance Tools
                    </h2>
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Live Checklists &amp; Advisory Calculators
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Tool 1: Child Safeguarding Audit Checklist */}
                  <div
                    className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-5 ${
                      isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Tool 1: Audit Checklist
                        </span>
                        <span className={`text-xs font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          {safeguardScore}% Passed
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Child Safeguarding Audit Tool
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Verify statutory child safety checkpoints before approving animations, live-action shoots, or voice recordings for broadcast.
                      </p>

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
                      <div className="space-y-2 pt-1">
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
                            className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                              safeguardChecks[item.key]
                                ? isDark
                                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                                  : 'bg-amber-50 border-amber-300 text-slate-900 shadow-2xs'
                                : isDark
                                ? 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
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
                    </div>

                    <div className={`pt-2 flex items-center justify-between gap-2 border-t ${
                      isDark ? 'border-white/10' : 'border-slate-100'
                    }`}>
                      <button
                        onClick={copySafeguardReport}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-xs"
                      >
                        <Copy className="size-3.5" />
                        <span>Copy Audit Report</span>
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
                        className={`py-2 px-3 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Tool 2: Content Age-Rating & Sensitivity Calculator */}
                  <div
                    className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-5 ${
                      isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Tool 2: Rating Calculator
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${computedRating.color}`}>
                          {computedRating.rating}
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Age-Rating &amp; Advisory Calculator
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Calculate official Kiddies Media Ministry Content Advisory Badges based on intended age demographics and thematic parameters.
                      </p>

                      {/* Selectors */}
                      <div className="space-y-2.5 pt-1 text-xs">
                        <div>
                          <label className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-700'
                          }`}>
                            Target Age Bracket
                          </label>
                          <select
                            value={ageCalc.ageBand}
                            onChange={(e) => setAgeCalc({ ...ageCalc, ageBand: e.target.value })}
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                            }`}
                          >
                            <option value="0-3">0-3 Years (Infant / Nursery)</option>
                            <option value="4-7">4-7 Years (Early Childhood)</option>
                            <option value="8-12">8-12 Years (Pre-Teens)</option>
                            <option value="13+">13+ Years (Teens &amp; Family)</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-700'
                          }`}>
                            Conflict &amp; Tension Level
                          </label>
                          <select
                            value={ageCalc.conflict}
                            onChange={(e) => setAgeCalc({ ...ageCalc, conflict: e.target.value })}
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                            }`}
                          >
                            <option value="none">Gentle &bull; Zero Conflict</option>
                            <option value="mild">Mild Animated Slapstick</option>
                            <option value="action">Dramatic Action / High Stakes</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-700'
                          }`}>
                            Scriptural Depth
                          </label>
                          <select
                            value={ageCalc.doctrine}
                            onChange={(e) => setAgeCalc({ ...ageCalc, doctrine: e.target.value })}
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                            }`}
                          >
                            <option value="foundational">Basic Bible Stories &amp; Songs</option>
                            <option value="character">Christian Character &amp; Ethics</option>
                            <option value="deep">In-Depth Spiritual Truths &amp; War</option>
                          </select>
                        </div>
                      </div>

                      {/* Computed Advisory Result Box */}
                      <div
                        className={`p-3.5 rounded-2xl border ${
                          isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-50 border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${computedRating.color}`}>
                            {computedRating.rating}
                          </span>
                          <span className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {computedRating.label}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed mb-1.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {computedRating.summary}
                        </p>
                        <div className={`text-[10px] font-semibold ${
                          isDark ? 'text-amber-400' : 'text-amber-600'
                        }`}>
                          Air Window: {computedRating.guidance}
                        </div>
                      </div>
                    </div>

                    <div className={`pt-2 border-t text-center ${
                      isDark ? 'border-white/10' : 'border-slate-100'
                    }`}>
                      <span className={`text-[11px] font-semibold ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Officially gazetted under Kiddies Media Ministry Advisory Matrix 2026
                      </span>
                    </div>
                  </div>

                  {/* Tool 3: IP Clearance & Rights Verifier */}
                  <div
                    className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-5 ${
                      isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Tool 3: Rights Verifier
                        </span>
                        <span className={`text-xs font-mono font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                          {Object.values(ipChecks).filter(Boolean).length}/5 Cleared
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        IP Clearance &amp; Licensing Verifier
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Verify original voice, audio, and character copyright clearances before releasing assets on the Kiddies Media Ministry IP Portal.
                      </p>

                      {/* 5 IP Clearance checks */}
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
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
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
                    </div>

                    <div className={`pt-2 border-t flex items-center justify-between gap-3 ${
                      isDark ? 'border-white/10' : 'border-slate-100'
                    }`}>
                      <Link
                        href="/ip-portal"
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold border transition-colors ${
                          isDark
                            ? 'border-sky-400/40 text-sky-400 hover:bg-sky-400/10'
                            : 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100'
                        }`}
                      >
                        <Scale className="size-3.5" />
                        <span>Launch IP Portal</span>
                      </Link>

                      <button
                        onClick={() => {
                          const count = Object.values(ipChecks).filter(Boolean).length
                          navigator.clipboard.writeText(
                            `Kiddies Media Ministry IP Clearance Log: ${count} of 5 Verification Pillars Cleared. Registered by ${officerEmail}.`
                          )
                          showToast('IP Clearance summary copied!')
                        }}
                        className={`py-2 px-3 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Copy Log
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* =========================================================================
                SECTION 3: HELPFUL SUPPORTING DOCUMENTS (6 Documents)
                ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'documents') && (
              <section className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Scroll className="size-4" />
                      <span>Official Policies &amp; Legal Deeds</span>
                    </div>
                    <h2
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                      style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                    >
                      Helpful Supporting Documents
                    </h2>
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Read Online or Download PDF/Text
                  </span>
                </div>

                {filteredDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-5 transition-all hover:shadow-lg ${
                          isDark
                            ? 'bg-slate-900/60 border-white/10 hover:border-amber-400/40'
                            : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2.5 py-0.5 rounded font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                              {doc.code}
                            </span>
                            <span className={`font-semibold text-[11px] ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {doc.pages}
                            </span>
                          </div>

                          <h3
                            className={`text-base font-extrabold leading-snug ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                          >
                            {doc.title}
                          </h3>

                          <div className="flex items-center gap-2 text-[10px] font-semibold">
                            <span className={`px-2 py-0.5 rounded border ${
                              isDark
                                ? 'bg-white/5 border-white/10 text-slate-300'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}>
                              {doc.classification}
                            </span>
                            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>&bull;</span>
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{doc.revisedDate}</span>
                          </div>

                          <p className={`text-xs leading-relaxed line-clamp-3 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {doc.desc}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className={`pt-4 border-t flex items-center justify-between gap-3 ${
                          isDark ? 'border-white/10' : 'border-slate-100'
                        }`}>
                          <button
                            onClick={() => setReadingDoc(doc)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                            <span>Read Document</span>
                          </button>

                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                              isDark
                                ? 'border-white/10 hover:bg-white/10 text-slate-200'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-slate-50'
                            }`}
                            title="Download document text"
                          >
                            <Download className="size-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`rounded-3xl border border-dashed p-10 text-center space-y-3 ${
                      isDark ? 'bg-slate-900/30 border-white/10' : 'bg-slate-100/50 border-slate-300'
                    }`}
                  >
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      No supporting documents matched your search filter.
                    </p>
                    <button
                      onClick={() => {
                        setActiveFilter('all')
                        setSearchQuery('')
                      }}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 text-slate-950 cursor-pointer shadow-xs"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          DOCUMENT READER MODAL
          ========================================================================= */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${
              isDark ? 'bg-slate-900 border-white/15 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-amber-500">{readingDoc.code}</span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>&bull;</span>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {readingDoc.classification}
                  </span>
                </div>
                <h2
                  className={`text-lg sm:text-2xl font-extrabold tracking-tight truncate max-w-xl ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  {readingDoc.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(readingDoc.content)
                    showToast('Document text copied to clipboard!')
                  }}
                  className={`p-2 sm:p-2.5 rounded-full border transition-colors cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-slate-50'
                  }`}
                  title="Copy full document text"
                >
                  <Copy className="size-4" />
                </button>

                <button
                  onClick={() => handleDownloadDocument(readingDoc)}
                  className={`p-2 sm:p-2.5 rounded-full border transition-colors cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-slate-50'
                  }`}
                  title="Download file"
                >
                  <Download className="size-4" />
                </button>

                <button
                  onClick={handlePrintDocument}
                  className={`p-2 sm:p-2.5 rounded-full border transition-colors cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-slate-50'
                  }`}
                  title="Print document"
                >
                  <Printer className="size-4" />
                </button>

                <button
                  onClick={() => setReadingDoc(null)}
                  className="p-2 sm:p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer transition-colors shadow-xs"
                  title="Close document viewer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className={`p-4 sm:p-8 overflow-y-auto space-y-4 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text ${
              isDark ? 'bg-black/20 text-slate-200' : 'bg-slate-50/80 text-slate-800 border-y border-slate-200'
            }`}>
              {readingDoc.content}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
              <span>{readingDoc.revisedDate} &bull; Kiddies Media Ministry Official Gazette</span>
              <button
                onClick={() => setReadingDoc(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-full font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-xs"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`border-t py-12 mt-16 transition-colors ${
          isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div>
            <div className={`font-bold text-sm mb-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Kiddies Media Ministry Training Portal
            </div>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Official repository for training materials, practical compliance tools, and helpful supporting documents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-bold">
            <Link
              href="/"
              className={`inline-flex items-center gap-1.5 transition-colors ${
                isDark ? 'text-slate-400 hover:text-amber-400' : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <Home className="size-3.5" />
              <span>Kiddies Media Ministry Home</span>
            </Link>
            <Link
              href="/ip-portal"
              className={`inline-flex items-center gap-1.5 transition-colors ${
                isDark ? 'text-slate-400 hover:text-amber-400' : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <Scale className="size-3.5" />
              <span>IP Portal</span>
            </Link>
            <Link
              href="/auth"
              className={`inline-flex items-center gap-1.5 transition-colors ${
                isDark ? 'text-slate-400 hover:text-amber-400' : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <UserCheck className="size-3.5" />
              <span>Officer Sign In</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
