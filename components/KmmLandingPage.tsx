'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Scale,
  ShieldCheck,
  FileText,
  Sliders,
  Layers,
  RefreshCw,
  BookOpen,
  Globe,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Lock,
  FileCheck,
  Award,
  Users,
  Check,
  Workflow,
  Eye,
  SlidersHorizontal,
  CheckCheck
} from 'lucide-react'
import { ApkDownloadModal } from '@/components/ApkDownloadModal'

const agenciesList = [
  {
    name: 'Lovetoons',
    tagline: 'Animation & Entertainment',
    description: 'Animation series, TV broadcast, character IP & children entertainment.',
    href: '#agencies-lovetoons',
    badge: 'Flagship',
  },
  {
    name: 'Publishing Agency',
    tagline: 'Literature & Curriculum',
    description: 'Comics, devotional books, storybooks, illustrated print & curriculum.',
    href: '#agencies-publishing',
    badge: 'Publishing',
  },
  {
    name: 'Digital Agency',
    tagline: 'Interactive & Apps',
    description: 'Interactive games, educational mobile apps, AR/VR & online portals.',
    href: '#agencies-digital',
    badge: 'Technology',
  },
  {
    name: 'Academy Agency',
    tagline: 'Governance & Training',
    description: 'Legal compliance, officer accreditation, policy auditing & safety covenants.',
    href: '#training',
    badge: 'Governance',
  },
  {
    name: 'Educational Agency',
    tagline: 'Foundational Learning',
    description: 'School partnerships, foundational learning aids & global outreaches.',
    href: '#agencies-educational',
    badge: 'Education',
  },
]

const governanceLifecycleSteps = [
  {
    step: '01',
    phase: 'Foundation',
    title: 'Policy Formulation & Mandate',
    icon: FileText,
    accent: '#2F80ED',
    badge: 'Stage 01 • Institutional Root',
    summary: 'Codifies foundational scriptural doctrine, institutional mandates, and statutory child protection directives covenanted by the Ministry Trust.',
    deliverables: [
      'Official Kiddies Media Ministry Charter & Policies',
      'Child Safeguarding Statutory Directives & Covenants',
      'Editorial Boundaries & Doctrinal Vetting Protocols',
    ],
    stakeholders: 'Esteemed Executive Minister, Pastoral Leadership & Legal Counsel',
    toolLabel: 'Explore Training Documents',
    toolHref: '/training-portal#documents',
    quote: 'Establishes the non-negotiable spiritual and legal boundaries for all children\'s media initiatives across Loveworld Kingdom.',
  },
  {
    step: '02',
    phase: 'Specifications',
    title: 'Standards, Codecs & Guidelines',
    icon: Sliders,
    accent: '#FF7A00',
    badge: 'Stage 02 • Technical & Editorial Rules',
    summary: 'Translates high-level covenants into objective engineering codecs, loudness benchmarks, age-rating brackets, and character turnaround standards.',
    deliverables: [
      'Broadcast LKFS -24 Audio Loudness & Strobe (<3Hz) Limits',
      'Official Content Advisory & Age-Bracket Matrix (0-3, 4-7, 8-12, 13+)',
      'Character Turnaround Style Guides & Animation Bibles',
    ],
    stakeholders: 'Quality Assurance Leads, Creative Directors & Sound Engineers',
    toolLabel: 'Launch Advisory Calculator',
    toolHref: '/training-portal#tools',
    quote: 'Precise technical specs prevent photosensitive seizures, hearing fatigue, and developmental dissonance.',
  },
  {
    step: '03',
    phase: 'Production',
    title: 'Studio Integration & Workflows',
    icon: Layers,
    accent: '#FFC72C',
    badge: 'Stage 03 • Creative Workflows',
    summary: 'Animation studios, literature creators, and developers execute asset pipelines using sanctioned production playbooks and legal release covenants.',
    deliverables: [
      'Minor Contributor & Voice Actor Work-for-Hire Deeds',
      'Original Music Master Synchronization Clearances',
      'Standardized Turnaround 3D Rigs, Stems & Episode Script Drafts',
    ],
    stakeholders: 'Animation Studios, Writers, Composers & Voice Ministers',
    toolLabel: 'Access Production Training',
    toolHref: '/training-portal',
    quote: 'Empowers creative teams to produce world-class animated content with complete spiritual clarity and legal protection.',
  },
  {
    step: '04',
    phase: 'Compliance',
    title: 'Audit, Rights & IP Clearance',
    icon: ShieldCheck,
    accent: '#10B981',
    badge: 'Stage 04 • Compliance Gate',
    summary: 'Assets pass rigorous automated and officer reviews across the Four Legal Pillars: Title, Trademark, License Sync, and Territorial Distribution.',
    deliverables: [
      'Automated Child Safeguarding Audit Verification (100% Pass)',
      'Immutable Registry on KMM Intellectual Property Portal',
      'Secured Chain of Title Certification & Executive Sign-off',
    ],
    stakeholders: 'Accredited Compliance Officers, IP Custodians & Broadcast Reviewers',
    toolLabel: 'Launch Audit Checklist',
    toolHref: '/training-portal#tools',
    quote: 'No asset airs or streams across ministry channels without complete chain-of-title and safeguarding sign-off.',
  },
  {
    step: '05',
    phase: 'Stewardship',
    title: 'Global Custody & Continuous Iteration',
    icon: RefreshCw,
    accent: '#8B5CF6',
    badge: 'Stage 05 • Global Stewardship',
    summary: 'Maintains archival master custody in ministry vaults, tracks global broadcast telemetry, gathers viewer feedback, and iterates future policy editions.',
    deliverables: [
      'Permanent Secure Vault Master Archival & Custody Records',
      'Worldwide Multi-Language Localization & Dubbing Logs',
      'Annual Governance Gazette & Framework Policy Revisions',
    ],
    stakeholders: 'Archival Directorate, Distribution Networks & Global Ministry Trust',
    toolLabel: 'Verify Assets on IP Portal',
    toolHref: '/ip-portal',
    quote: 'Safeguards intellectual property for generations while continuously refining standards based on global feedback.',
  },
]

const governancePillars = [
  {
    title: 'Title & Scriptural Integrity',
    pillar: 'Pillar 01',
    icon: BookOpen,
    accent: '#2F80ED',
    summary: 'Ensuring immutable scriptural fidelity, biblical historical accuracy, pastoral doctrinal review, and clear chain of title registration for every concept.',
    points: [
      'Doctrinal conformity with Loveworld Kingdom teachings',
      'Clear chain of title registered under Ministry Trust',
      'Script treatments free of unverified secondary lore',
      'Pastoral executive certification prior to release',
    ],
  },
  {
    title: 'Child Safeguarding & Safety',
    pillar: 'Pillar 02',
    icon: ShieldCheck,
    accent: '#10B981',
    summary: 'Strict statutory compliance protecting minors: legal parental release deeds, photosensitive epilepsy prevention (<3Hz strobe limit), and emotional well-being.',
    points: [
      'Mandatory Minor Guardian Release Deeds on file',
      'Photosensitive seizure prevention (<3Hz strobe test)',
      'Strict audio loudness compliance (-24 LKFS standard)',
      'Non-frightening narratives designed for age brackets',
    ],
  },
  {
    title: 'IP, Copyright & Licensing',
    pillar: 'Pillar 03',
    icon: Scale,
    accent: '#FFC72C',
    summary: 'Comprehensive legal clearance: work-for-hire actor agreements, original score master sync releases, and registration on the Kiddies Media Ministry IP Portal.',
    points: [
      'Work-for-hire agreements for all creative talent',
      'Original music master sync licenses secured',
      'Character 3D turnaround rigs registered in IP register',
      'Complete elimination of unassigned third-party IP',
    ],
  },
  {
    title: 'Territorial Clearance & Custody',
    pillar: 'Pillar 04',
    icon: Globe,
    accent: '#8B5CF6',
    summary: 'Assigning worldwide multi-channel broadcast permissions, OTT streaming rights, localized language dubbing custody, and long-term secure archival preservation.',
    points: [
      'Worldwide broadcast covenants across TV & web',
      'Multi-language dubbing and localization protocols',
      'Permanent cold-storage archival custody in vault',
      'Strict digital watermarking and distribution rights',
    ],
  },
]

export default function KmmLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [agenciesDropdownOpen, setAgenciesDropdownOpen] = useState(false)
  const [mobileAgenciesOpen, setMobileAgenciesOpen] = useState(false)
  const [isApkModalOpen, setIsApkModalOpen] = useState(false)
  const [activeGovStep, setActiveGovStep] = useState(0)
  const [govView, setGovView] = useState<'both' | 'lifecycle' | 'pillars'>('both')
  const agenciesDropdownRef = React.useRef<HTMLLIElement>(null)
  const currentYear = new Date().getFullYear()

  // Ensure landing page renders in light theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
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

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="kmm-site-root">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors border-slate-900/10 bg-white/75">
        <div className="kmm-wrap flex items-center justify-between min-h-[64px] sm:min-h-[72px] gap-2 sm:gap-4">
          {/* Brand */}
          <Link href="#top" className="flex items-center gap-2.5 sm:gap-3 no-underline text-[var(--kmm-fg)] min-w-0 group">
            <div className="relative size-10 sm:size-12 shrink-0 rounded-full overflow-hidden shadow-[0_0_0_2px_var(--kmm-gold)] sm:shadow-[0_0_0_3px_var(--kmm-gold)] group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
              <Image
                src="/kmm-logo.png"
                alt="Kiddies Media Ministry"
                width={48}
                height={48}
                priority
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <b className="font-extrabold text-sm sm:text-base lg:text-lg leading-tight block truncate" style={{ fontFamily: 'var(--kmm-display)' }}>
                Kiddies Media Ministry
              </b>
              <small className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase block text-[var(--kmm-muted)] truncate">
                Governance & Policy
              </small>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2 list-none m-0 p-0">
              <li>
                <a
                  href="#about"
                  className="px-4 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]"
                >
                  About
                </a>
              </li>
              <li className="relative" ref={agenciesDropdownRef}>
                <button
                  type="button"
                  onClick={() => setAgenciesDropdownOpen((prev) => !prev)}
                  onMouseEnter={() => setAgenciesDropdownOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm transition-colors text-[var(--kmm-fg)] cursor-pointer ${agenciesDropdownOpen ? 'bg-[var(--kmm-band)]' : 'hover:bg-[var(--kmm-band)]'
                    }`}
                  aria-expanded={agenciesDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Agencies</span>
                  <svg
                    className={`size-3.5 transition-transform duration-200 ${agenciesDropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {agenciesDropdownOpen && (
                  <div
                    onMouseLeave={() => setAgenciesDropdownOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[390px] rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-[var(--kmm-line)] mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--kmm-muted)]">
                        Ministry Agencies
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-fg)]">
                        5 Arms
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {agenciesList.map((ag) => (
                        <a
                          key={ag.name}
                          href={ag.href}
                          onClick={() => setAgenciesDropdownOpen(false)}
                          className="flex items-start justify-between p-2.5 rounded-2xl hover:bg-[var(--kmm-band)] transition-colors group text-left"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[var(--kmm-fg)] group-hover:text-[var(--kmm-orange)] transition-colors">
                                {ag.name}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-[var(--kmm-bg)] text-[var(--kmm-muted)] border border-[var(--kmm-line)]">
                                {ag.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--kmm-muted)] line-clamp-1 mt-0.5">
                              {ag.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[var(--kmm-line)] px-2.5 py-1 flex items-center justify-between">
                      <span className="text-[11px] text-[var(--kmm-muted)] font-medium">Looking for IP records?</span>
                      <Link
                        href="/ip-portal"
                        onClick={() => setAgenciesDropdownOpen(false)}
                        className="text-[11px] font-bold text-[var(--kmm-link)] hover:underline flex items-center gap-1"
                      >
                        <span>Open IP Portal</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  href="/onboarding"
                  className="px-4 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)] inline-flex items-center gap-1.5"
                  title="Ministry & Department Onboarding Waitlist"
                >
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Onboard</span>
                </Link>
              </li>
              <li className="ml-2">
                <Link
                  href="/training-portal"
                  className="px-4 py-2 rounded-full font-black text-sm bg-[#FFC700] text-slate-950 hover:bg-[#FFB800] transition-all shadow-xs"
                >
                  Training Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/ip-portal"
                  className="px-4 py-2 rounded-full font-black text-sm bg-[#0E1E38] text-[#FFC700] border-[1.5px] border-[#FFC700] hover:bg-[#FFC700] hover:text-slate-950 transition-all shadow-xs ml-1"
                  title="Lovetoons Intellectual Property & Rights Portal"
                >
                  IP Portal
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button with Animated Hamburger / X icon */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/ip-portal"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--kmm-navy)] text-[var(--kmm-gold)] border border-[var(--kmm-gold)] sm:hidden"
            >
              IP Portal
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="size-10 sm:size-11 rounded-full flex items-center justify-center bg-[var(--kmm-navy)] text-white hover:opacity-90 transition-all cursor-pointer shadow-sm relative z-50"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Backdrop Overlay */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-[64px] sm:top-[72px] bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          />
        )}

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav className="fixed top-[64px] sm:top-[72px] left-0 right-0 z-50 max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-72px)] overflow-y-auto border-b border-[var(--kmm-line)] bg-[var(--kmm-bg)] px-5 py-6 shadow-2xl animate-in slide-in-from-top-3 duration-250 lg:hidden">
            <div className="flex flex-col gap-2 list-none m-0 p-0">
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-[var(--kmm-blue)]/15 text-[var(--kmm-blue)] flex items-center justify-center font-bold text-sm">
                  ℹ
                </span>
                <span>About Kiddies Media Ministry</span>
              </a>

              {/* Agencies Dropdown Accordion */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileAgenciesOpen(!mobileAgenciesOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors cursor-pointer"
                  aria-expanded={mobileAgenciesOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="size-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                      🏛
                    </span>
                    <span>Agencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-muted)]">
                      5
                    </span>
                    <svg
                      className={`size-4 transition-transform duration-200 text-[var(--kmm-muted)] ${mobileAgenciesOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                {mobileAgenciesOpen && (
                  <div className="ml-5 pl-4 border-l-2 border-[var(--kmm-line)] flex flex-col gap-1 py-1 my-1">
                    {agenciesList.map((ag) => (
                      <a
                        key={ag.name}
                        href={ag.href}
                        onClick={() => {
                          setMenuOpen(false)
                          setMobileAgenciesOpen(false)
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs truncate">{ag.name}</span>
                            <span className="text-[9px] font-semibold opacity-70 uppercase">{ag.badge}</span>
                          </div>
                          <p className="text-[10px] text-[var(--kmm-muted)] truncate">{ag.tagline}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                  ✨
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Ministry Onboarding</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">Waitlist</span>
                  </div>
                  <p className="text-[10px] text-[var(--kmm-muted)] truncate">Express interest for department content</p>
                </div>
              </Link>

              {/* Portal CTA Cards in Drawer */}
              <div className="pt-4 mt-2 border-t border-[var(--kmm-line)] flex flex-col gap-3">
                <Link
                  href="/training-portal"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl font-black bg-[#FFC700] text-slate-950 shadow-md hover:bg-[#FFB800] active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-xl bg-black/15 text-slate-950 flex items-center justify-center font-black text-sm">
                      ▶
                    </span>
                    <div className="text-left">
                      <div className="text-sm font-extrabold" style={{ fontFamily: 'var(--kmm-display)' }}>
                        Training Portal &amp; Resources
                      </div>
                      <div className="text-[11px] font-semibold opacity-85">
                        Training materials, tools &amp; supporting documents
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black">&rarr;</span>
                </Link>

                <Link
                  href="/ip-portal"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl font-black bg-[#0E1E38] text-[#FFC700] border-2 border-[#FFC700] shadow-md hover:bg-[#FFC700] hover:text-slate-950 active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-xl bg-[#FFC700]/20 text-[#FFC700] flex items-center justify-center font-black text-sm">
                      🛡
                    </span>
                    <div className="text-left">
                      <div className="text-sm font-extrabold" style={{ fontFamily: 'var(--kmm-display)' }}>
                        IP &amp; Asset Management Portal
                      </div>
                      <div className="text-[11px] font-semibold opacity-85">
                        Digital assets, approvals &amp; governance
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black">&rarr;</span>
                </Link>
              </div>

              {/* Quick Secondary Links */}
              <div className="pt-3 border-t border-[var(--kmm-line)] flex items-center justify-between text-xs text-[var(--kmm-muted)] px-2">
                <a
                  href="#updates"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[var(--kmm-fg)] transition-colors"
                >
                  Policy Updates
                </a>
                <span>&bull;</span>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[var(--kmm-fg)] transition-colors"
                >
                  Institutional Enquiries
                </a>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* =========================================================================
            HERO SECTION - Full-Bleed Image covering Navigation & Hero Canvas
            ========================================================================= */}
        <section className="relative overflow-hidden -mt-[64px] sm:-mt-[72px] pt-[100px] sm:pt-[120px] lg:pt-[132px] pb-12 sm:pb-16 min-h-[660px] lg:min-h-[760px] flex flex-col justify-between">
          {/* Full-Bleed Background Image covering the entire hero and navigation area */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <Image
              src="/children-ministry-hero.png"
              alt="Children's Ministry Background"
              fill
              priority
              className="object-cover object-[80%_center] sm:object-[84%_center] lg:object-right"
              sizes="100vw"
            />
            {/* Subtle tactile micro-dots texture overlay */}
            <div className="absolute inset-0 kmm-pattern-dots kmm-mask-radial opacity-20" />
            {/* Gentle bottom transition into white About section */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="kmm-wrap relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center flex-1">
            {/* Copy Left */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-950 border border-amber-500/30 backdrop-blur-md shadow-xs kmm-animate-rise">
                <span className="flex size-2 rounded-full bg-[#FFB800] ring-4 ring-[#FFB800]/30 animate-pulse" />
                <span className="tracking-wider uppercase text-[11px] font-black">Official Children&apos;s Media Framework</span>
                <span className="text-amber-400 font-bold">•</span>
                <span className="text-[#FF3B6C] font-black">Kiddies Media Ministry</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-extrabold tracking-tight leading-[1.06] text-slate-950 kmm-animate-rise"
                style={{ fontFamily: 'var(--kmm-display)' }}
              >
                Guiding the Standards.{' '}
                <span className="block mt-1 sm:mt-2">
                  <span className="text-[#FF3B6C]">Governing the Future </span>
                  <span className="text-[#0284C7]">of Children&apos;s Media.</span>
                </span>
              </h1>

              <p className="lead kmm-animate-rise text-slate-700 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-medium">
                Kiddies Media Ministry provides the governance, training, and resources to document and steward children&apos;s media content and intellectual property across Loveworld Kingdom.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 kmm-animate-rise">
                <Link
                  href="/training-portal"
                  className="kmm-btn kmm-btn-p font-black shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <span>Access Training &amp; Tools</span>
                  <span className="text-sm font-black">&rarr;</span>
                </Link>
                <Link
                  href="/ip-portal"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-black text-sm bg-[#0E1E38] text-[#FFC700] border-2 border-[#FFC700]/70 hover:bg-[#FFC700] hover:text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  title="Intellectual Property & Asset Management Platform"
                >
                  <span className="size-2 rounded-full bg-[#FFC700] animate-pulse" />
                  <span>Launch IP Portal</span>
                </Link>
              </div>

              {/* Trust & Proof Highlights - Modern Frosted Glass Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-700 kmm-animate-rise">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="font-extrabold text-slate-900">5 Specialized Ministry Arms</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-xs">
                  <span className="size-2 rounded-full bg-[#0284C7]" />
                  <span className="font-extrabold text-slate-900">Child Safeguarded Standards</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-xs">
                  <span className="size-2 rounded-full bg-[#FFB800]" />
                  <span className="font-extrabold text-slate-900">Loveworld Kingdom Registry</span>
                </div>
              </div>
            </div>

            {/* Stage Graphic Right - Open, Unobstructed Children Showcase with Anchored Verified Seal */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-end items-center lg:items-end pt-6 lg:pt-0">
              {/* Anchored Institutional Status Card at bottom right */}
              <div className="w-full max-w-[360px] kmm-animate-rise">
                <div className="p-4 rounded-3xl bg-white/92 backdrop-blur-md shadow-2xl border border-white/90 transition-all hover:scale-[1.02] duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-1.5 shadow-xs border border-amber-300/50 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Image
                        src="/kmm-logo.png"
                        alt="Kiddies Media Ministry"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-sm font-black text-slate-900 truncate" style={{ fontFamily: 'var(--kmm-display)' }}>
                          Kiddies Media Ministry
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 shrink-0">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Verified
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block truncate mt-0.5">
                        Official Children&apos;s IP Registry
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#0284C7]" />
                      Legal Clearance: Active
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Copyright Status: Cleared
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Agency Jump Bar at Bottom of Hero */}
          <div className="kmm-wrap relative z-10 w-full mt-10 pt-6 border-t border-slate-900/10 hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-amber-500" />
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-600">
                Explore 5 Ministry Arms:
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {agenciesList.map((ag) => (
                <a
                  key={ag.name}
                  href={ag.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-200/70 shadow-xs hover:shadow transition-all font-bold whitespace-nowrap text-xs group"
                >
                  <span>{ag.name}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-600 font-medium transition-colors">
                    &bull; {ag.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            WHO WE ARE SECTION (KMM & ITS ROLE)
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 relative overflow-hidden bg-white" id="about">
          {/* Subtle structural grid texture */}
          <div className="absolute inset-0 kmm-pattern-grid kmm-mask-linear-y pointer-events-none opacity-50" aria-hidden="true" />
          <div className="absolute -top-24 right-10 size-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-950 border border-amber-500/25 mb-4 shadow-xs">
                  <span className="size-2 rounded-full bg-[#FFB800] animate-pulse" />
                  <span className="uppercase tracking-wider">About Kiddies Media Ministry &amp; Its Role</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 leading-tight">
                  The framework that children&apos;s media works within
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
                  Kiddies Media Ministry provides the governance, policy, and standards framework for children&apos;s content across Loveworld Kingdom.
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  The website provides basic information about Kiddies Media Ministry and its role to guide, coordinate, and set expectations for children&apos;s media initiatives. Our mission equips ministry departments, animation studios, and creative teams with official training materials, actionable compliance tools, and helpful supporting documents so they can create and share content with clarity, spiritual fidelity, and confidence.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-md">
                    <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                      What Kiddies Media Ministry does
                    </b>
                    <span className="text-sm leading-relaxed block text-white/90">
                      Guides, coordinates, and establishes the expectations, training materials, practical tools, and supporting documents children&apos;s media initiatives follow.
                    </span>
                  </div>
                  <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#FFC700] via-[#FFB800] to-[#F59E0B] text-slate-950 shadow-md">
                    <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                      What Kiddies Media Ministry is not
                    </b>
                    <span className="text-sm leading-relaxed block text-slate-950/90 font-medium">
                      A standalone studio that simply produces entertainment content without institutional governance.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars of Kiddies Media Ministry's Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center font-bold text-xl border border-[#0284C7]/20 group-hover:scale-105 transition-transform">
                  ⚖
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#0284C7] transition-colors">Policy &amp; Governance</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Establishes statutory child safeguarding covenants, broadcast standards, and operational guidelines across all channels.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xl border border-amber-500/20 group-hover:scale-105 transition-transform">
                  📚
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">Training Materials</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Delivers structured curriculum modules, masterclasses, and production playbooks for animators and creators.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-rose-500/10 text-[#FF3B6C] flex items-center justify-center font-bold text-xl border border-rose-500/20 group-hover:scale-105 transition-transform">
                  🛠
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#FF3B6C] transition-colors">Practical Tools</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Provides interactive safeguarding audit checklists, age-rating calculators, and IP clearance verification tools.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xl border border-purple-500/20 group-hover:scale-105 transition-transform">
                  📋
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-600 transition-colors">Supporting Documents</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Publishes legal covenants, minor contributor release deeds, and stewards children&apos;s intellectual property.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MANDATE SECTION (8 AREAS OF RESPONSIBILITY)
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 bg-[#F0FAFD] border-y border-slate-200/60 transition-colors relative overflow-hidden" id="mandate">
          {/* Tactile dual-stipple texture overlay */}
          <div className="absolute inset-0 kmm-pattern-playful kmm-mask-linear-y pointer-events-none opacity-80" aria-hidden="true" />
          <div className="absolute -bottom-24 left-1/4 size-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10">
            <div className="max-w-2xl space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-sky-500/10 text-sky-950 border border-sky-500/25 mb-2 shadow-xs">
                <span className="size-2 rounded-full bg-[#0284C7] animate-pulse" />
                <span className="uppercase tracking-wider">Our Mandate &amp; Directives</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 leading-tight">
                Eight areas of strategic responsibility
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                From policy to compliance, these are the core areas Kiddies Media Ministry covers on behalf of children&apos;s media across Loveworld Kingdom.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-[#0284C7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zm14 0l-3 7a4 4 0 0 0 6 0l-3-7z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">01</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-[#0284C7] transition-colors">Governance and Policy</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Establish and maintain policies, governance frameworks, and operating guidelines for children&apos;s content.</p>
                </div>
              </article>

              {/* 2 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-rose-50 text-[#FF3B6C] border border-rose-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-[#FF3B6C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">02</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-[#FF3B6C] transition-colors">Content Standards</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Define and communicate expectations for content quality, suitability, consistency, and alignment with ministry values.</p>
                </div>
              </article>

              {/* 3 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="7" r="3" />
                        <path d="M5 21v-3a7 7 0 0 1 14 0v3M12 12v3" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">03</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-amber-600 transition-colors">Child Protection &amp; Safety</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Promote age-appropriate content, safeguarding principles, responsible representation of children, privacy, and ethical media practices.</p>
                </div>
              </article>

              {/* 4 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M14.5 9.5a3.5 3.5 0 1 0 0 5" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">04</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-slate-900 transition-colors">IP &amp; Copyright</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Provide guidance on content ownership, copyright compliance, permissions, licensing, and appropriate use of creative assets.</p>
                </div>
              </article>

              {/* 5 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM10 10h4v4h-4z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">05</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-purple-600 transition-colors">AI &amp; Digital Media</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Guide the responsible use of AI-generated content, digital tools, emerging technologies, and related creative workflows.</p>
                </div>
              </article>

              {/* 6 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">06</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-amber-600 transition-colors">Training &amp; Tools</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Institutional training materials, interactive compliance tools, and qualification for children&apos;s media producers, safeguarding auditors, and broadcast reviewers.</p>
                </div>
              </article>

              {/* 7 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="8" r="3" />
                        <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M21 19c0-2.2-1.6-3.7-4-4.2" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">07</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-indigo-600 transition-colors">Collaboration</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Facilitate structured collaboration, accountability, and alignment among relevant children&apos;s media teams and initiatives.</p>
                </div>
              </article>

              {/* 8 */}
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="size-6 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">08</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-emerald-700 transition-colors">Monitoring &amp; Review</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Support the implementation, review, and continuous improvement of established policies and standards.</p>
                </div>
              </article>
            </div>

            <p className="text-xs text-slate-500 mt-8 max-w-3xl">
              These are Kiddies Media Ministry&apos;s proposed public-facing areas of responsibility, subject to confirmation against officially approved policies and organizational mandates.
            </p>
          </div>
        </section>

        {/* =========================================================================
            GOVERNANCE FRAMEWORK SECTION
            ========================================================================= */}
        <section
          className="py-24 scroll-mt-20 relative overflow-hidden bg-gradient-to-b from-white via-[var(--kmm-surface)] to-white transition-colors"
          id="governance"
        >
          {/* Architectural Blueprint Grid Pattern Overlay */}
          <div className="absolute inset-0 kmm-pattern-grid kmm-mask-radial pointer-events-none opacity-60" aria-hidden="true" />
          {/* Top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[340px] bg-gradient-to-b from-[var(--kmm-blue)]/10 via-[var(--kmm-gold)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="kmm-wrap relative z-10 space-y-16">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--kmm-blue)]/10 text-[var(--kmm-blue)] border border-[var(--kmm-blue)]/25">
                  <Scale className="size-3.5" />
                  <span className="uppercase tracking-widest text-[10px]">Institutional Governance Architecture</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  How Governance Moves from Policy to Global Practice
                </h2>
                <p className="lead text-[var(--kmm-muted)] leading-relaxed">
                  A continuous five-stage lifecycle anchored by four immutable legal verification pillars, ensuring every animation, script, voice master, and digital platform meets unconditional scriptural fidelity and statutory child safety standards across Loveworld Kingdom.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="inline-flex items-center p-1 rounded-2xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-2xs text-xs font-bold self-start lg:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setGovView('both')}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${govView === 'both'
                    ? 'bg-[var(--kmm-navy)] text-[var(--kmm-gold)] shadow-xs'
                    : 'text-[var(--kmm-muted)] hover:text-[var(--kmm-fg)]'
                    }`}
                >
                  Complete Architecture
                </button>
                <button
                  type="button"
                  onClick={() => setGovView('lifecycle')}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${govView === 'lifecycle'
                    ? 'bg-[var(--kmm-navy)] text-[var(--kmm-gold)] shadow-xs'
                    : 'text-[var(--kmm-muted)] hover:text-[var(--kmm-fg)]'
                    }`}
                >
                  5-Stage Lifecycle
                </button>
                <button
                  type="button"
                  onClick={() => setGovView('pillars')}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${govView === 'pillars'
                    ? 'bg-[var(--kmm-navy)] text-[var(--kmm-gold)] shadow-xs'
                    : 'text-[var(--kmm-muted)] hover:text-[var(--kmm-fg)]'
                    }`}
                >
                  Four Legal Pillars
                </button>
              </div>
            </div>

            {/* =========================================================================
                PART A: THE 5-STAGE OPERATIONAL LIFECYCLE
                ========================================================================= */}
            {(govView === 'both' || govView === 'lifecycle') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--kmm-line)] pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--kmm-gold)]">
                    <Workflow className="size-4" />
                    <span>Operational Governance Lifecycle</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--kmm-muted)]">
                    Select any phase below to inspect required deliverables &amp; verification criteria
                  </span>
                </div>

                {/* 5-Step Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {governanceLifecycleSteps.map((s, idx) => {
                    const isActive = activeGovStep === idx
                    const StepIcon = s.icon
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setActiveGovStep(idx)}
                        className={`p-4 sm:p-5 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${isActive
                          ? 'bg-[var(--kmm-surface)] border-[var(--kmm-gold)] shadow-lg ring-2 ring-[var(--kmm-gold)]/30 -translate-y-0.5'
                          : 'bg-[var(--kmm-surface)]/60 border-[var(--kmm-line)] hover:border-[var(--kmm-line)]/80 hover:bg-[var(--kmm-surface)]'
                          }`}
                      >
                        {/* Accent top line */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                            }`}
                          style={{ backgroundColor: s.accent }}
                        />

                        <div className="flex items-center justify-between">
                          <span
                            className={`size-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${isActive
                              ? 'bg-[var(--kmm-navy)] text-[var(--kmm-gold)] shadow-xs'
                              : 'bg-[var(--kmm-line)] text-[var(--kmm-muted)]'
                              }`}
                          >
                            {s.step}
                          </span>
                          <div
                            className={`size-8 rounded-xl flex items-center justify-center transition-colors ${isActive
                              ? 'text-white shadow-xs'
                              : 'text-[var(--kmm-muted)] group-hover:text-[var(--kmm-fg)]'
                              }`}
                            style={{
                              backgroundColor: isActive ? s.accent : 'transparent',
                            }}
                          >
                            <StepIcon className="size-4" />
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-0.5">
                            {s.phase}
                          </div>
                          <div className="font-extrabold text-xs sm:text-sm leading-snug line-clamp-1">
                            {s.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          <span className={isActive ? 'text-[var(--kmm-gold)] font-black' : 'text-[var(--kmm-muted)]'}>
                            {isActive ? 'Active Stage' : 'Inspect Details'}
                          </span>
                          <ChevronRight
                            className={`size-3 transition-transform ${isActive ? 'translate-x-0.5 text-[var(--kmm-gold)]' : 'text-[var(--kmm-muted)]'
                              }`}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Active Stage Spotlight Showcase Card */}
                {(() => {
                  const current = governanceLifecycleSteps[activeGovStep]
                  const IconComponent = current.icon
                  return (
                    <div className="rounded-3xl border border-[var(--kmm-line)] bg-[var(--kmm-surface)] shadow-xl p-6 sm:p-10 relative overflow-hidden transition-all">
                      {/* Watermark Icon */}
                      <IconComponent className="absolute right-4 bottom-4 size-56 sm:size-72 opacity-[0.03] pointer-events-none select-none" />

                      {/* Spotlight Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--kmm-line)] mb-8">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span
                              className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-2xs"
                              style={{ backgroundColor: current.accent }}
                            >
                              {current.badge}
                            </span>
                            <span className="text-xs font-mono font-bold text-[var(--kmm-muted)]">
                              Phase {current.step} of 05
                            </span>
                          </div>
                          <h3
                            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                            style={{ fontFamily: 'var(--kmm-display)' }}
                          >
                            {current.title}
                          </h3>
                          <p className="text-sm sm:text-base text-[var(--kmm-muted)] max-w-2xl leading-relaxed">
                            {current.summary}
                          </p>
                        </div>

                        {/* Prev / Next Controls */}
                        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveGovStep((prev) =>
                                prev > 0 ? prev - 1 : governanceLifecycleSteps.length - 1
                              )
                            }
                            className="p-2.5 rounded-2xl border border-[var(--kmm-line)] bg-[var(--kmm-surface)] text-[var(--kmm-fg)] hover:bg-[var(--kmm-line)]/50 transition-colors cursor-pointer shadow-xs"
                            title="Previous Stage"
                          >
                            <ChevronLeft className="size-4" />
                          </button>
                          <span className="text-xs font-mono font-bold px-2 text-[var(--kmm-muted)]">
                            {activeGovStep + 1} / {governanceLifecycleSteps.length}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveGovStep((prev) =>
                                prev < governanceLifecycleSteps.length - 1 ? prev + 1 : 0
                              )
                            }
                            className="p-2.5 rounded-2xl border border-[var(--kmm-line)] bg-[var(--kmm-surface)] text-[var(--kmm-fg)] hover:bg-[var(--kmm-line)]/50 transition-colors cursor-pointer shadow-xs"
                            title="Next Stage"
                          >
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      </div>

                      {/* Spotlight 2-Column Body */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Checkpoints & Deliverables */}
                        <div className="lg:col-span-7 space-y-5">
                          <div className="space-y-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-gold)] flex items-center gap-1.5">
                              <CheckCircle2 className="size-4" />
                              <span>Official Mandated Deliverables</span>
                            </div>
                            <h4 className="font-extrabold text-base sm:text-lg">
                              Required Checkpoints &amp; Legal Instruments
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {current.deliverables.map((deliv, dIdx) => (
                              <div
                                key={dIdx}
                                className="p-3.5 rounded-2xl border border-[var(--kmm-line)] bg-[var(--kmm-band)] flex items-start gap-3 transition-colors hover:border-[var(--kmm-gold)]/40"
                              >
                                <div className="size-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="size-3.5 stroke-[2.5]" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-xs sm:text-sm font-bold block leading-snug">
                                    {deliv}
                                  </span>
                                  <span className="text-[11px] text-[var(--kmm-muted)] block">
                                    Mandatory verification artifact under Kiddies Media Ministry governance register
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Philosophy Quote */}
                          <div className="p-4 rounded-2xl bg-[var(--kmm-navy)] text-white shadow-md border-l-4 border-[var(--kmm-gold)]">
                            <p className="text-xs sm:text-sm italic leading-relaxed text-white/95">
                              &ldquo;{current.quote}&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* Right: Stakeholders & Live Demonstration */}
                        <div className="lg:col-span-5 space-y-5">
                          <div className="p-5 rounded-2xl border border-[var(--kmm-line)] bg-[var(--kmm-band)] space-y-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-9 rounded-xl bg-[var(--kmm-blue)]/15 text-[var(--kmm-blue)] flex items-center justify-center font-bold">
                                <Users className="size-4" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] block">
                                  Governing Authority
                                </span>
                                <h5 className="font-extrabold text-xs sm:text-sm">
                                  Responsible Stakeholders
                                </h5>
                              </div>
                            </div>
                            <p className="text-xs text-[var(--kmm-muted)] leading-relaxed font-medium">
                              {current.stakeholders}
                            </p>
                          </div>

                          {/* Action Card */}
                          <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--kmm-navy)] to-[#182b49] text-white shadow-lg space-y-4 border border-white/10">
                            <div className="flex items-center justify-between text-xs">
                              <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-white/20 text-white">
                                Live Demonstration
                              </span>
                              <span className="font-mono text-[11px] text-[var(--kmm-gold)] font-bold">
                                Version 2026.1
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <h5 className="text-base font-extrabold text-white">
                                Test This Governance Stage
                              </h5>
                              <p className="text-xs text-white/80 leading-relaxed">
                                Directly access the operational compliance tools or policy documents for this stage.
                              </p>
                            </div>

                            <Link
                              href={current.toolHref}
                              className="w-full py-2.5 px-4 rounded-full font-bold text-xs bg-[var(--kmm-gold)] text-[#10233F] hover:bg-amber-400 transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
                            >
                              <span>{current.toolLabel}</span>
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* =========================================================================
                PART B: FOUR-PILLAR LEGAL VERIFICATION ARCHITECTURE
                ========================================================================= */}
            {(govView === 'both' || govView === 'pillars') && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--kmm-line)] pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-gold)] flex items-center gap-1.5">
                      <ShieldCheck className="size-4" />
                      <span>Legal Clearance Architecture</span>
                    </div>
                    <h3
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                      style={{ fontFamily: 'var(--kmm-display)' }}
                    >
                      Four Pillars of Institutional Governance
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[var(--kmm-muted)]">
                    Immutable Verification Standards for Every Asset
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {governancePillars.map((p, pIdx) => {
                    const PillarIcon = p.icon
                    return (
                      <article
                        key={pIdx}
                        className="p-6 sm:p-7 rounded-3xl border border-[var(--kmm-line)] bg-[var(--kmm-surface)] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-5 hover:-translate-y-1"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div
                              className="size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs"
                              style={{ backgroundColor: p.accent }}
                            >
                              <PillarIcon className="size-6 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--kmm-band)] border border-[var(--kmm-line)] text-[var(--kmm-muted)]">
                              {p.pillar}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="font-extrabold text-lg leading-snug">
                              {p.title}
                            </h4>
                            <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                              {p.summary}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-[var(--kmm-line)]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-muted)] block">
                              Pillar Verification Points
                            </span>
                            <ul className="space-y-1.5 list-none m-0 p-0">
                              {p.points.map((pt, ptIdx) => (
                                <li key={ptIdx} className="flex items-start gap-2 text-xs font-medium text-[var(--kmm-fg)]">
                                  <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="leading-tight text-[11px]">{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Link
                            href="/ip-portal"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kmm-blue)] hover:underline"
                          >
                            <span>Verify on IP Register</span>
                            <ChevronRight className="size-3" />
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}

            {/* =========================================================================
                PART C: EXECUTIVE CALLOUT BANNER (GOVERNANCE IN ACTION)
                ========================================================================= */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[var(--kmm-navy)] via-[#152a48] to-[var(--kmm-navy)] text-white shadow-xl relative overflow-hidden border border-white/10">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-[var(--kmm-gold)] border border-white/15">
                    <Award className="size-3.5" />
                    <span>Institutional Accreditation &amp; Vault</span>
                  </div>
                  <h4
                    className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                    style={{ fontFamily: 'var(--kmm-display)' }}
                  >
                    Experience Institutional Governance in Action
                  </h4>
                  <p className="text-sm text-white/85 leading-relaxed">
                    Audit live child safety parameters, compute age-rating content advisories, or register production assets directly on the Kiddies Media Ministry Intellectual Property Register.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    href="/training-portal#tools"
                    className="py-3 px-5 rounded-full text-xs font-bold bg-[var(--kmm-gold)] text-[#10233F] hover:bg-amber-400 transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    <span>Open Compliance Tools</span>
                  </Link>
                  <Link
                    href="/training-portal#documents"
                    className="py-3 px-5 rounded-full text-xs font-bold bg-white/15 text-white hover:bg-white/25 transition-colors border border-white/20 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="size-3.5" />
                    <span>Read Policy Documents</span>
                  </Link>
                  <Link
                    href="/ip-portal"
                    className="py-3 px-5 rounded-full text-xs font-bold bg-[var(--kmm-blue)] text-white hover:bg-blue-600 transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Scale className="size-3.5" />
                    <span>Launch IP Portal</span>
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--kmm-muted)] text-center max-w-2xl mx-auto">
              This governance architecture serves as Loveworld Kingdom&apos;s official benchmark for child safeguarding, doctrinal fidelity, and intellectual asset stewardship across all broadcast and digital platforms.
            </p>
          </div>
        </section>

        {/* =========================================================================
            AGENCIES & LOVETOONS ECOSYSTEM SECTION
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 bg-[#F0FAFD] border-y border-slate-200/60 transition-colors relative overflow-hidden" id="agencies">
          {/* Subtle Dual Stipple Pattern Overlay */}
          <div className="absolute inset-0 kmm-pattern-cross kmm-mask-linear-y pointer-events-none opacity-60" aria-hidden="true" />
          <div className="absolute -top-20 right-1/4 size-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          {/* Legacy anchor compatibility */}
          <div id="lovetoons" className="relative -top-24 pointer-events-none" />

          <div className="kmm-wrap relative z-10">
            <div className="max-w-2xl space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-950 border border-amber-500/25 mb-2 shadow-xs">
                <span className="size-2 rounded-full bg-[#FFB800] animate-pulse" />
                <span className="uppercase tracking-wider">Operational Directorate &amp; Agencies</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 leading-tight">
                The 5 specialized agencies powering children&apos;s media
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Kiddies Media Ministry operates across five dedicated specialized agencies governing creative animation, literature, interactive technology, institutional accreditation, and foundational schooling.
              </p>
            </div>

            {/* Lovetoons Anchor */}
            <div id="agencies-lovetoons" className="relative -top-24 pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Mobile App */}
              <article className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0052A3] text-white shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center">
                      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white">
                      Lovetoons Agency
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">LoveToons Mobile App</h3>
                  <p className="text-sm leading-relaxed text-white/90 mb-8 max-w-md">
                    Discover and download inspirational, character-building children&apos;s animated media, Bible stories, and interactive adventures on your mobile device.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://apps.apple.com/us/app/lovetoons-tv/id1665457245"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kmm-btn text-xs bg-white text-[#0284C7] hover:bg-white/95 font-black shadow-md inline-flex items-center gap-2 transition-all"
                  >
                    <svg className="size-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.79.92-2.85-.92.04-2.07.62-2.73 1.39-.58.67-1.09 1.74-.96 2.77 1.03.08 2.13-.53 2.77-1.31z" />
                    </svg>
                    <span>App Store (iOS)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsApkModalOpen(true)}
                    className="kmm-btn text-xs bg-white/20 hover:bg-white/30 text-white font-black border border-white/30 inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download APK (Android)</span>
                  </button>
                  <a
                    href="https://lwappstore.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kmm-btn text-xs bg-white/10 hover:bg-white/20 text-white/90 font-bold inline-flex items-center gap-1.5 transition-all"
                  >
                    <span>Loveworld Store</span>
                    <svg className="size-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </article>

              {/* Website */}
              <article className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#FFC700] via-[#FFB800] to-[#F59E0B] text-slate-950 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-black/15 flex items-center justify-center">
                      <svg className="size-8 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/15 text-slate-950">
                      Lovetoons Agency
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">LoveToons Website</h3>
                  <p className="text-sm leading-relaxed text-slate-950/90 font-medium mb-8 max-w-md">
                    Explore LoveToons broadcast series, animated episodes, published comics, and interactive learning media.
                  </p>
                </div>
                <div>
                  <a
                    href="https://lovetoons.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kmm-btn text-xs bg-[#0E1E38] text-white hover:bg-slate-900 font-black shadow-md inline-flex items-center gap-2 transition-all"
                  >
                    Visit lovetoons.org
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </article>
            </div>

            {/* Other Specialized Agencies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              <div id="agencies-publishing" className="scroll-mt-24 rounded-3xl p-7 bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-50 text-[#FF3B6C] border border-rose-200/80">
                      Publishing
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5 text-slate-950 group-hover:text-[#FF3B6C] transition-colors" style={{ fontFamily: 'var(--kmm-display)' }}>
                    Publishing Agency
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Comics, devotional books, storybooks, illustrated print, audio books, and foundational curriculum for children.
                  </p>
                </div>
                <Link
                  href="/ip-portal"
                  className="text-xs font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                >
                  View Publishing Catalog &rarr;
                </Link>
              </div>

              <div id="agencies-digital" className="scroll-mt-24 rounded-3xl p-7 bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200/80">
                      Technology
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5 text-slate-950 group-hover:text-[#0284C7] transition-colors" style={{ fontFamily: 'var(--kmm-display)' }}>
                    Digital Agency
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Interactive games, educational mobile apps, AR/VR experiences, web applications, and kid-safe digital architectures.
                  </p>
                </div>
                <Link
                  href="/ip-portal"
                  className="text-xs font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                >
                  Explore Digital Assets &rarr;
                </Link>
              </div>

              <div id="agencies-educational" className="scroll-mt-24 rounded-3xl p-7 bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-1 group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                      Education
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5 text-slate-950 group-hover:text-amber-600 transition-colors" style={{ fontFamily: 'var(--kmm-display)' }}>
                    Educational Agency
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    School outreach packages, Sunday school learning aids, teacher training resources, and moral education frameworks.
                  </p>
                </div>
                <Link
                  href="/auth"
                  className="text-xs font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                >
                  Access Educational Tools &rarr;
                </Link>
              </div>
            </div>

            <p className="text-xs text-[var(--kmm-muted)] mt-8">
              Official download and website links will be added here once supplied.
            </p>
          </div>
        </section>

        {/* =========================================================================
            TRAINING SECTION (MATERIALS, TOOLS & SUPPORTING DOCUMENTS)
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 relative overflow-hidden bg-white" id="training">
          {/* Subtle Dot Mesh Pattern Overlay */}
          <div className="absolute inset-0 kmm-pattern-dots kmm-mask-radial pointer-events-none opacity-50" aria-hidden="true" />
          <div className="absolute -bottom-20 right-10 size-80 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10 space-y-12">
            {/* Header Box */}
            <div className="rounded-3xl sm:rounded-[36px] p-8 sm:p-12 bg-gradient-to-br from-[#0E1E38] via-[#142646] to-[#0E1E38] text-white shadow-2xl relative overflow-hidden border border-white/10">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFC700] text-slate-950 shadow-xs">
                  <span>Kiddies Media Ministry Institutional Training &amp; Resources</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Training Materials, Practical Tools &amp; Supporting Documents
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-white/85">
                  The website provides basic information about Kiddies Media Ministry and its role, alongside an institutional Training section with training materials and tools, and helpful supporting documents. The training portal equips ministry departments, animation studios, and creative teams with the knowledge, interactive utilities, and official templates needed to uphold zero-defect standards for children&apos;s media.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link href="/training-portal" className="kmm-btn kmm-btn-p font-black shadow-md">
                    Launch Training Portal &rarr;
                  </Link>
                  <Link href="/training-portal?tab=tools" className="kmm-btn kmm-btn-s font-black shadow-md">
                    Practical Tools
                  </Link>
                  <Link href="/training-portal?tab=documents" className="kmm-btn kmm-btn-o !text-white border-white/40 hover:bg-white/10 font-bold">
                    Supporting Documents
                  </Link>
                  <Link href="/auth" className="px-4 py-2.5 rounded-full text-xs font-bold text-white/80 hover:text-white hover:underline transition-colors ml-auto sm:ml-0">
                    Officer Sign In &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Main Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Training Materials */}
              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[#0284C7]/15 text-[#0284C7] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    📚
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0284C7] block mb-1">
                      Curriculum &amp; Modules
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">Training Materials</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Comprehensive learning modules covering Child Safeguarding in Media, Broadcast &amp; Visual Excellence, Scriptural Fidelity, and Intellectual Property Clearance.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>8 Core masterclasses &amp; curriculum outlines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Biblical anchors &amp; statutory citations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Lesson takeaways &amp; production checkpoints</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/training-portal?tab=materials"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    <span>Explore Training Materials</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Practical Tools */}
              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[#FFB800]/25 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    🛠
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
                      Interactive Utilities
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-amber-600 transition-colors">Practical Tools</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Interactive utilities designed for everyday production verification, safeguarding audits, and content age-rating assessments.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>Child Safeguarding Audit Tool with live score</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>Age-Rating &amp; Sensitivity Advisory Calculator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>5-Point IP Clearance &amp; Licensing Verifier</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/training-portal?tab=tools"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    <span>Launch Practical Tools</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Supporting Documents */}
              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-rose-500/15 text-[#FF3B6C] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    📋
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF3B6C] block mb-1">
                      Charters &amp; Templates
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-[#FF3B6C] transition-colors">Helpful Supporting Documents</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Official gazetted charters, policy covenants, talent release deeds, and compliance templates ready for immediate reading and download.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF3B6C] font-bold">✓</span>
                      <span>Official Child Safeguarding Policy Manual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF3B6C] font-bold">✓</span>
                      <span>Minor Talent &amp; Voice Contributor Release Deeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF3B6C] font-bold">✓</span>
                      <span>COPPA Digital Safety &amp; Broadcast Standards</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/training-portal?tab=documents"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    <span>View Supporting Documents</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            LATEST UPDATES SECTION
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 bg-[#F0FAFD] border-y border-slate-200/60 transition-colors relative overflow-hidden" id="updates">
          {/* Tactile Playful Multi-Tone Pattern */}
          <div className="absolute inset-0 kmm-pattern-playful kmm-mask-linear-y pointer-events-none opacity-60" aria-hidden="true" />
          <div className="kmm-wrap relative z-10">
            <div className="max-w-2xl space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-950 border border-rose-500/25 mb-2 shadow-xs">
                <span className="size-2 rounded-full bg-[#FF3B6C] animate-pulse" />
                <span className="uppercase tracking-wider">Latest Policy Announcements</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 leading-tight">
                Policy updates, gazettes and new guidelines
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Approved policy revisions, institutional gazettes, and quarterly board seminars from the Kiddies Media Ministry Secretariat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-black text-[11px] bg-[#FFC700] text-slate-950 uppercase tracking-wider">
                    Policy Updates
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Institutional circular</span>
                </div>
                <h3 className="text-lg font-bold text-slate-950">How policy updates will be announced</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Approved policy updates and revisions will appear here with a date, a category, and direct links to gazetted documentation.
                </p>
              </article>

              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-black text-[11px] bg-[#FFC700] text-slate-950 uppercase tracking-wider">
                    Training
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Academy session</span>
                </div>
                <h3 className="text-lg font-bold text-slate-950">Training announcements</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Public training cohorts and quarterly board seminars will be published here. Video modules and transcripts reside inside the Training Portal.
                </p>
              </article>

              <article className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-black text-[11px] bg-[#FFC700] text-slate-950 uppercase tracking-wider">
                    Guidelines
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Pre-release standard</span>
                </div>
                <h3 className="text-lg font-bold text-slate-950">New guidelines and resources</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When new guidelines on AI generation, child privacy, or character licensing are approved, they will be introduced here.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MINISTRY & DEPARTMENT ONBOARDING WAITLIST SECTION
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 bg-white transition-colors relative overflow-hidden" id="onboarding">
          {/* Subtle Geometric Texture Overlay */}
          <div className="absolute inset-0 kmm-pattern-grid kmm-mask-radial pointer-events-none opacity-60" aria-hidden="true" />
          <div className="absolute top-1/2 left-10 size-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 size-96 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10 space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-950 border border-amber-500/25 mb-2 shadow-xs">
                <span className="size-2 rounded-full bg-[#FFB800] animate-pulse" />
                <span className="uppercase tracking-wider">Institutional Access &amp; Waitlist</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 leading-tight">
                Onboard your Ministry or Department
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Whether you represent a Church Zone, Children&apos;s Ministry department, or media production unit, join the Kiddies Media Ministry ecosystem and get onboarded to the IP Portal. The portal is an important resource for documenting and stewarding children&apos;s media content and related intellectual property.
              </p>
            </div>

            {/* CTA Showcase Card */}
            <div className="p-8 sm:p-12 rounded-3xl sm:rounded-[36px] bg-slate-50/80 border border-slate-200/90 shadow-xl relative overflow-hidden">
              {/* Decorative background glows */}
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#FFC700]/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-[#0284C7]/15 blur-3xl" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#FFC700]/20 text-slate-900 border border-[#FFC700]/30 uppercase tracking-wider">
                    <span className="size-2 rounded-full bg-[#FFC700] animate-pulse" />
                    <span>Official Ministry Waitlist &amp; Verification</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                    Ready to Document and Steward Your Ministry&apos;s Media?
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Submit your ministry unit’s expression of interest to receive dedicated access credentials for the Kiddies Media Ministry IP Portal. Our secretariat verifies governance mandates, chain-of-title records, and child safety compliance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>IP Governance &amp; Deeds</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Asset Cataloguing</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Dedicated Portal Access</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                  <Link
                    href="/onboarding"
                    className="kmm-btn kmm-btn-p text-center shadow-md font-bold"
                  >
                    <span>Begin Onboarding &rarr;</span>
                  </Link>
                  <Link
                    href="/training-portal"
                    className="kmm-btn kmm-btn-o text-center font-bold bg-white"
                  >
                    <span>View Training &amp; Guidelines</span>
                  </Link>
                  <p className="text-[11px] text-slate-500 text-center">
                    Simple 2-minute registration • Verified by Secretariat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CONTACT / ENQUIRIES SECTION
            ========================================================================= */}
        <section className="py-20 sm:py-24 scroll-mt-20 bg-[#F0FAFD] border-t border-slate-200/60 relative overflow-hidden" id="contact">
          {/* Subtle Dot Matrix Texture */}
          <div className="absolute inset-0 kmm-pattern-dots kmm-mask-radial pointer-events-none opacity-45" aria-hidden="true" />
          <div className="kmm-wrap relative z-10 space-y-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-sky-500/10 text-sky-950 border border-sky-500/25 mb-2 shadow-xs">
                <span className="size-2 rounded-full bg-[#0284C7] animate-pulse" />
                <span className="uppercase tracking-wider">Institutional Enquiries &amp; Engagement</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 leading-tight">
                Connect with Kiddies Media Ministry
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Official secretariat channels for doctrinal vetting, safeguarding audits, copyright clearances, and institutional partnerships across Loveworld Kingdom.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                'General enquiries',
                'Governance and policy',
                'Content standards and copyright',
                'Training and capacity development',
                'Partnerships',
                'Technical support',
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-4 py-2 rounded-full font-bold text-xs bg-white text-slate-800 border border-slate-200/90 shadow-xs hover:border-[#0284C7] hover:text-[#0284C7] transition-all cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 m-0">
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email</dt>
                <dd className="m-0 font-bold text-base text-slate-950">governance@kiddiesmediaministry.org</dd>
              </div>
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Directorate</dt>
                <dd className="m-0 font-bold text-base text-slate-950">Kiddies Media Ministry Legal &amp; Broadcast Directorate</dd>
              </div>
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Network Hub</dt>
                <dd className="m-0 font-bold text-base text-slate-950">Loveworld Nation Headquarters</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SITE FOOTER
          ========================================================================= */}
      <footer className="bg-[var(--kmm-navy)] text-white py-14 mt-16">
        <div className="kmm-wrap space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Col 1 */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative size-16 rounded-full overflow-hidden shadow-[0_0_0_3px_var(--kmm-gold)] bg-white flex items-center justify-center">
                <Image
                  src="/kmm-logo.png"
                  alt="Kiddies Media Ministry"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Governance, policy, standards and digital transformation for children's media across Loveworld Kingdom.
              </p>
            </div>

            {/* Col 2 */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--kmm-gold)]">Explore</h4>
              <ul className="list-none m-0 p-0 space-y-2 text-sm text-white/90">
                <li><a href="#about" className="hover:text-[var(--kmm-gold)] transition-colors">About Kiddies Media Ministry &amp; Its Role</a></li>
                <li><a href="#mandate" className="hover:text-[var(--kmm-gold)] transition-colors">Mandate &amp; Responsibilities</a></li>
                <li><a href="#training" className="hover:text-[var(--kmm-gold)] transition-colors">Training, Tools &amp; Docs</a></li>
                <li><Link href="/training-portal" className="hover:text-[var(--kmm-gold)] transition-colors">Training Portal</Link></li>
                <li><a href="#governance" className="hover:text-[var(--kmm-gold)] transition-colors">Governance &amp; Policies</a></li>
                <li><a href="#updates" className="hover:text-[var(--kmm-gold)] transition-colors">Resources &amp; Updates</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--kmm-gold)]">Platforms</h4>
              <ul className="list-none m-0 p-0 space-y-2 text-sm text-white/90">
                <li><Link href="/ip-portal" className="text-[var(--kmm-gold)] font-bold hover:underline">Launch IP Portal &rarr;</Link></li>
                <li><Link href="/onboarding" className="hover:text-[var(--kmm-gold)] transition-colors">Ministry Onboarding (Waitlist)</Link></li>
                <li><a href="#agencies" className="hover:text-[var(--kmm-gold)] transition-colors">Agencies & Directory</a></li>
                <li>
                  <a
                    href="https://lovetoons.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--kmm-gold)] transition-colors inline-flex items-center gap-1.5"
                  >
                    LoveToons (lovetoons.org)
                    <svg className="size-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://apps.apple.com/us/app/lovetoons-tv/id1665457245"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--kmm-gold)] transition-colors inline-flex items-center gap-1.5"
                  >
                    LoveToons Mobile App (iOS / APK)
                    <svg className="size-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </li>
                <li><a href="#contact" className="hover:text-[var(--kmm-gold)] transition-colors">Contact Directorate</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/15 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
            <span>&copy; {currentYear} Kiddies Media Ministry. All rights reserved.</span>
            <span>Policy Compliance &middot; Loveworld Nations Standards &middot; Child Safeguarding Covenant</span>
          </div>
        </div>
      </footer>

      {/* LoveToons APK Download Modal (Name + Email gate) */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  )
}
