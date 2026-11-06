'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  {
    name: "Children's Ministry",
    tagline: 'Kingdom Kids Directorate',
    description: "Church ministry departments, kids churches, teacher training & regional children outreaches.",
    href: '/onboarding',
    badge: 'Ministry',
  },
]

export default function KmmLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [agenciesDropdownOpen, setAgenciesDropdownOpen] = useState(false)
  const [mobileAgenciesOpen, setMobileAgenciesOpen] = useState(false)
  const [isApkModalOpen, setIsApkModalOpen] = useState(false)
  const [hasTrainingAuth, setHasTrainingAuth] = useState(false)
  const agenciesDropdownRef = React.useRef<HTMLLIElement>(null)
  const currentYear = new Date().getFullYear()

  // Ensure landing page renders in light theme & sync training auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
      setHasTrainingAuth(Boolean(localStorage.getItem('kmm_training_user')))
    }
  }, [])

  const trainingPortalHref = hasTrainingAuth ? '/training-portal' : '/auth'

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

  // Ensure landing page is strictly in light mode under all circumstances
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.documentElement.style.colorScheme = 'light'
      document.body.classList.remove('dark')
    }
  }, [])

  return (
    <div className="kmm-site-root">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors border-slate-900/10 bg-white/90 text-[var(--kmm-fg)]">
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
                  <span>Agencies &amp; Ministries</span>
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[390px] rounded-3xl bg-white border border-[var(--kmm-line)] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-[var(--kmm-line)] mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--kmm-muted)]">
                        Agencies &amp; Ministries
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-fg)]">
                        Directory
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

                    <div className="mt-2 pt-2 border-t border-[var(--kmm-line)] px-2.5 py-1.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--kmm-muted)] font-medium">New ministry / department?</span>
                        <Link
                          href="/onboarding"
                          onClick={() => setAgenciesDropdownOpen(false)}
                          className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                          <span>+ Onboard Entity &rarr;</span>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--kmm-muted)] font-medium">Looking for IP records?</span>
                        <Link
                          href="/ip-portal"
                          onClick={() => setAgenciesDropdownOpen(false)}
                          className="text-[11px] font-bold text-[var(--kmm-link)] hover:underline flex items-center gap-1"
                        >
                          <span>Open IP Portal &rarr;</span>
                        </Link>
                      </div>
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
                  href={trainingPortalHref}
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
          <nav className="fixed top-[64px] sm:top-[72px] left-0 right-0 z-50 max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-72px)] overflow-y-auto border-b border-[var(--kmm-line)] bg-white px-5 py-6 shadow-2xl animate-in slide-in-from-top-3 duration-250 lg:hidden">
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
                    <span className="size-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-bold text-sm">
                      🏛
                    </span>
                    <span>Agencies &amp; Ministries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-muted)]">
                      Directory
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
                    <Link
                      href="/onboarding"
                      onClick={() => {
                        setMenuOpen(false)
                        setMobileAgenciesOpen(false)
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-500/10 transition-colors mt-1"
                    >
                      <span>+ Onboard Ministry / Department</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold text-sm">
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
                  href={trainingPortalHref}
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
            {/* Gentle bottom transition into About section */}
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
                  href={trainingPortalHref}
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
                  <span className="font-extrabold text-slate-900">Ministries &amp; Department Registry</span>
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

          {/* Quick Ministry & Agency Jump Bar at Bottom of Hero */}
          <div className="kmm-wrap relative z-10 w-full mt-10 pt-6 border-t border-slate-900/10 hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-amber-500" />
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-600">
                Ministries &amp; Departments:
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
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 font-bold whitespace-nowrap text-xs transition-all shadow-xs"
                title="Register and onboard a new ministry or church department"
              >
                <span className="text-amber-600 font-extrabold">+</span>
                <span>Onboard Department</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            WHO WE ARE SECTION (KMM & ITS ROLE)
            ========================================================================= */}
        <section className="py-20 scroll-mt-20 relative overflow-hidden bg-white" id="about">
          {/* Subtle structural grid texture */}
          <div className="absolute inset-0 kmm-pattern-grid kmm-mask-linear-y pointer-events-none opacity-50" aria-hidden="true" />
          <div className="absolute -top-24 right-10 size-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="eyebrow mb-3">About Kiddies Media Ministry &amp; Its Role</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold">The framework that children&apos;s media works within</h2>
              </div>
              <div className="space-y-6">
                <p className="lead">
                  Kiddies Media Ministry provides the governance, policy, and standards framework for children&apos;s content across Loveworld Kingdom.
                </p>
                <p className="text-base text-[var(--kmm-muted)] leading-relaxed">
                  The website provides basic information about Kiddies Media Ministry and its role to guide, coordinate, and set expectations for children&apos;s media initiatives. Our mission equips ministry departments, animation studios, and creative teams with official training materials, actionable compliance tools, and helpful supporting documents so they can create and share content with clarity, spiritual fidelity, and confidence.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-[32px] p-6 sm:p-7 bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-lg">
                    <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                      What Kiddies Media Ministry does
                    </b>
                    <span className="text-sm leading-relaxed block text-white/90">
                      Guides, coordinates, and establishes the expectations, training materials, practical tools, and supporting documents children&apos;s media initiatives follow.
                    </span>
                  </div>
                  <div className="rounded-[32px] p-6 sm:p-7 bg-gradient-to-br from-[#FFC700] via-[#FFB800] to-[#F59E0B] text-slate-950 shadow-lg">
                    <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                      What Kiddies Media Ministry is not
                    </b>
                    <span className="text-sm leading-relaxed block text-[#10233F]/90 font-medium">
                      A standalone studio that simply produces entertainment content without institutional governance.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars of Kiddies Media Ministry's Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
              <div className="p-6 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-2.5">
                <div className="size-11 rounded-2xl bg-[#0284C7]/15 text-[#0284C7] flex items-center justify-center font-bold text-lg">
                  ⚖
                </div>
                <h3 className="font-extrabold text-base">Policy & Governance</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Establishes statutory child safeguarding covenants, broadcast standards, and operational guidelines across all channels.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-2.5">
                <div className="size-11 rounded-2xl bg-[#FFB800]/25 text-amber-700 flex items-center justify-center font-bold text-lg">
                  📚
                </div>
                <h3 className="font-extrabold text-base">Training Materials</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Delivers structured curriculum modules, masterclasses, and production playbooks for animators and creators.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-2.5">
                <div className="size-11 rounded-2xl bg-rose-500/15 text-[#FF3B6C] flex items-center justify-center font-bold text-lg">
                  🛠
                </div>
                <h3 className="font-extrabold text-base">Practical Tools</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Provides interactive safeguarding audit checklists, age-rating calculators, and IP clearance verification tools.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-2.5">
                <div className="size-11 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-bold text-lg">
                  📋
                </div>
                <h3 className="font-extrabold text-base">Supporting Documents</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Publishes legal covenants, minor contributor release deeds, and stewards children&apos;s intellectual property.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MANDATE SECTION (8 AREAS OF RESPONSIBILITY)
            ========================================================================= */}
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors relative overflow-hidden" id="mandate">
          {/* Tactile dual-stipple texture overlay */}
          <div className="absolute inset-0 kmm-pattern-playful kmm-mask-linear-y pointer-events-none opacity-80" aria-hidden="true" />
          <div className="absolute -bottom-24 left-1/4 size-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">Our mandate</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Eight areas of responsibility</h2>
              <p className="lead">
                From policy to compliance, these are the areas Kiddies Media Ministry covers on behalf of children's media across the ministry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <svg className="size-9 mb-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zm14 0l-3 7a4 4 0 0 0 6 0l-3-7z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Governance and Policy</h3>
                <p className="text-sm leading-relaxed text-white/90">Establish and maintain policies, governance frameworks, and operating guidelines for children's content.</p>
              </article>

              {/* 2 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#FF3B6C] to-[#E11D48] text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <svg className="size-9 mb-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Content Standards</h3>
                <p className="text-sm leading-relaxed text-white/90">Define and communicate expectations for content quality, suitability, consistency, and alignment with ministry values.</p>
              </article>

              {/* 3 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#FFC700] via-[#FFB800] to-[#F59E0B] text-slate-950 shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <svg className="size-9 mb-10 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="7" r="3" />
                  <path d="M5 21v-3a7 7 0 0 1 14 0v3M12 12v3" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Child Protection & Safety</h3>
                <p className="text-sm leading-relaxed text-slate-900/90 font-medium">Promote age-appropriate content, safeguarding principles, responsible representation of children, privacy, and ethical media practices.</p>
              </article>

              {/* 4 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#0E1E38] to-[#162B4E] text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border border-white/10">
                <svg className="size-9 mb-10 text-[#FFC700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M14.5 9.5a3.5 3.5 0 1 0 0 5" />
                </svg>
                <h3 className="text-xl font-bold mb-2">IP & Copyright</h3>
                <p className="text-sm leading-relaxed text-white/90">Provide guidance on content ownership, copyright compliance, permissions, licensing, and appropriate use of creative assets.</p>
              </article>

              {/* 5 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#FF4D7E] to-[#F43F5E] text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <svg className="size-9 mb-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM10 10h4v4h-4z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">AI & Digital Media</h3>
                <p className="text-sm leading-relaxed text-white/90">Guide the responsible use of AI-generated content, digital tools, emerging technologies, and related creative workflows.</p>
              </article>

              {/* 6 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#FFBA00] to-[#E09900] text-slate-950 shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <svg className="size-9 mb-10 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Training & Tools</h3>
                <p className="text-sm leading-relaxed text-slate-900/90 font-medium">Institutional training materials, interactive compliance tools, and qualification for children&apos;s media producers, safeguarding auditors, and broadcast reviewers.</p>
              </article>

              {/* 7 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#0E1E38] to-[#1E293B] text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border border-white/10">
                <svg className="size-9 mb-10 text-[#FFC700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M21 19c0-2.2-1.6-3.7-4-4.2" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                <p className="text-sm leading-relaxed text-white/90">Facilitate structured collaboration, accountability, and alignment among relevant children's media teams and initiatives.</p>
              </article>

              {/* 8 */}
              <article className="p-7 rounded-[32px] rounded-br-[72px] bg-gradient-to-br from-[#0284C7] to-[#0066CC] text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <svg className="size-9 mb-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5M9 12l2 2 4-4" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Monitoring & Review</h3>
                <p className="text-sm leading-relaxed text-white/90">Support the implementation, review, and continuous improvement of established policies and standards.</p>
              </article>
            </div>

            <p className="text-xs text-[var(--kmm-muted)] mt-8 max-w-3xl">
              These are Kiddies Media Ministry&apos;s proposed public-facing areas of responsibility, subject to confirmation against officially approved policies and organizational mandates.
            </p>
          </div>
        </section>

        {/* =========================================================================
            AGENCIES & LOVETOONS ECOSYSTEM SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors relative overflow-hidden" id="agencies">
          {/* Subtle Dual Stipple Pattern Overlay */}
          <div className="absolute inset-0 kmm-pattern-cross kmm-mask-linear-y pointer-events-none opacity-60" aria-hidden="true" />
          <div className="absolute -top-20 right-1/4 size-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          {/* Legacy anchor compatibility */}
          <div id="lovetoons" className="relative -top-24 pointer-events-none" />

          <div className="kmm-wrap relative z-10">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">Operational Directorate &amp; Ministries</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Agencies &amp; onboarded departments powering children&apos;s media</h2>
              <p className="text-sm leading-relaxed text-[var(--kmm-muted)]">
                Kiddies Media Ministry operates across specialized agencies and onboarded ministry departments governing creative animation, literature, interactive technology, institutional accreditation, and foundational schooling.
              </p>
            </div>

            {/* Lovetoons Anchor */}
            <div id="agencies-lovetoons" className="relative -top-24 pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Mobile App */}
              <article className="rounded-[40px] rounded-br-[120px] p-8 sm:p-10 bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0052A3] text-white shadow-xl flex flex-col justify-between hover:shadow-2xl transition-shadow">
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
                    Discover and download inspirational, character-building children's animated media, Bible stories, and interactive adventures on your mobile device.
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
                </div>
              </article>

              {/* Website */}
              <article className="rounded-[40px] rounded-bl-[120px] p-8 sm:p-10 bg-gradient-to-br from-[#FFC700] via-[#FFB800] to-[#F59E0B] text-slate-950 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-shadow">
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
                  <p className="text-sm leading-relaxed text-slate-900/90 font-medium mb-8 max-w-md">
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
              <div id="agencies-publishing" className="scroll-mt-24 rounded-[28px] p-6 bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/15 text-[#FF3B6C] border border-rose-500/25">
                      Publishing
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5" style={{ fontFamily: 'var(--kmm-display)' }}>
                    Publishing Agency
                  </h4>
                  <p className="text-xs text-[var(--kmm-muted)] leading-relaxed mb-4">
                    Comics, devotional books, storybooks, illustrated print, audio books, and foundational curriculum for children.
                  </p>
                </div>
                <Link
                  href="/ip-portal"
                  className="text-xs font-bold text-[var(--kmm-link)] hover:underline inline-flex items-center gap-1"
                >
                  View Publishing Catalog &rarr;
                </Link>
              </div>

              <div id="agencies-digital" className="scroll-mt-24 rounded-[28px] p-6 bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#0284C7]/15 text-[#0284C7] border border-[#0284C7]/25">
                      Technology
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5" style={{ fontFamily: 'var(--kmm-display)' }}>
                    Digital Agency
                  </h4>
                  <p className="text-xs text-[var(--kmm-muted)] leading-relaxed mb-4">
                    Interactive games, educational mobile apps, AR/VR experiences, web applications, and kid-safe digital architectures.
                  </p>
                </div>
                <Link
                  href="/ip-portal"
                  className="text-xs font-bold text-[var(--kmm-link)] hover:underline inline-flex items-center gap-1"
                >
                  Explore Digital Assets &rarr;
                </Link>
              </div>

              <div id="agencies-educational" className="scroll-mt-24 rounded-[28px] p-6 bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#FFB800]/25 text-amber-700 border border-amber-500/25">
                      Education
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5" style={{ fontFamily: 'var(--kmm-display)' }}>
                    Educational Agency
                  </h4>
                  <p className="text-xs text-[var(--kmm-muted)] leading-relaxed mb-4">
                    School outreach packages, Sunday school learning aids, teacher training resources, and moral education frameworks.
                  </p>
                </div>
                <Link
                  href="/auth"
                  className="text-xs font-bold text-[var(--kmm-link)] hover:underline inline-flex items-center gap-1"
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
        <section className="py-20 scroll-mt-20 relative overflow-hidden bg-white" id="training">
          {/* Subtle Dot Mesh Pattern Overlay */}
          <div className="absolute inset-0 kmm-pattern-dots kmm-mask-radial pointer-events-none opacity-50" aria-hidden="true" />
          <div className="absolute -bottom-20 right-10 size-80 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10 space-y-12">
            {/* Header Box */}
            <div className="rounded-[40px] p-8 sm:p-12 bg-gradient-to-br from-[#0E1E38] via-[#142646] to-[#0E1E38] text-white shadow-2xl relative overflow-hidden border border-white/10">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFC700] text-slate-950">
                  <span>Kiddies Media Ministry Institutional Training &amp; Resources</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Training Materials, Practical Tools &amp; Supporting Documents
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-white/85">
                  The website provides basic information about Kiddies Media Ministry and its role, alongside an institutional Training section with training materials and tools, and helpful supporting documents. The training portal equips ministry departments, animation studios, and creative teams with the knowledge, interactive utilities, and official templates needed to uphold zero-defect standards for children&apos;s media.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link href={trainingPortalHref} className="kmm-btn kmm-btn-p">
                    Launch Training Portal &rarr;
                  </Link>
                  <Link href={hasTrainingAuth ? '/training-portal?tab=tools' : '/auth'} className="kmm-btn kmm-btn-s">
                    Practical Tools
                  </Link>
                  <Link href={hasTrainingAuth ? '/training-portal?tab=documents' : '/auth'} className="kmm-btn kmm-btn-o !text-white border-white/40 hover:bg-white/10">
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
              <div className="p-8 rounded-[32px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[#0284C7]/15 text-[#0284C7] flex items-center justify-center font-bold text-xl">
                    📚
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block mb-1">
                      Curriculum & Modules
                    </span>
                    <h3 className="text-xl font-bold">Training Materials</h3>
                  </div>
                  <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                    Comprehensive learning modules covering Child Safeguarding in Media, Broadcast & Visual Excellence, Scriptural Fidelity, and Intellectual Property Clearance.
                  </p>
                  <ul className="text-xs text-[var(--kmm-muted)] space-y-2 pt-2 border-t border-[var(--kmm-line)]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>8 Core masterclasses & curriculum outlines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Biblical anchors & statutory citations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Lesson takeaways & production checkpoints</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={hasTrainingAuth ? '/training-portal?tab=materials' : '/auth'}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kmm-link)] hover:underline"
                  >
                    <span>Explore Training Materials</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Practical Tools */}
              <div className="p-8 rounded-[32px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[#FFB800]/25 text-amber-700 flex items-center justify-center font-bold text-xl">
                    🛠
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                      Interactive Utilities
                    </span>
                    <h3 className="text-xl font-bold">Practical Tools</h3>
                  </div>
                  <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                    Interactive utilities designed for everyday production verification, safeguarding audits, and content age-rating assessments.
                  </p>
                  <ul className="text-xs text-[var(--kmm-muted)] space-y-2 pt-2 border-t border-[var(--kmm-line)]">
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>Child Safeguarding Audit Tool with live score</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>Age-Rating & Sensitivity Advisory Calculator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>5-Point IP Clearance & Licensing Verifier</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={hasTrainingAuth ? '/training-portal?tab=tools' : '/auth'}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kmm-link)] hover:underline"
                  >
                    <span>Launch Practical Tools</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Supporting Documents */}
              <div className="p-8 rounded-[32px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-rose-500/15 text-[#FF3B6C] flex items-center justify-center font-bold text-xl">
                    📋
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3B6C] block mb-1">
                      Charters & Templates
                    </span>
                    <h3 className="text-xl font-bold">Helpful Supporting Documents</h3>
                  </div>
                  <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                    Official gazetted charters, policy covenants, talent release deeds, and compliance templates ready for immediate reading and download.
                  </p>
                  <ul className="text-xs text-[var(--kmm-muted)] space-y-2 pt-2 border-t border-[var(--kmm-line)]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF3B6C] font-bold">✓</span>
                      <span>Official Child Safeguarding Policy Manual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF3B6C] font-bold">✓</span>
                      <span>Minor Talent & Voice Contributor Release Deeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF3B6C] font-bold">✓</span>
                      <span>COPPA Digital Safety & Broadcast Standards</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={hasTrainingAuth ? '/training-portal?tab=documents' : '/auth'}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kmm-link)] hover:underline"
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
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors relative overflow-hidden" id="updates">
          {/* Tactile Playful Multi-Tone Pattern */}
          <div className="absolute inset-0 kmm-pattern-playful kmm-mask-linear-y pointer-events-none opacity-60" aria-hidden="true" />
          <div className="kmm-wrap relative z-10">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">Latest updates</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Policy updates, announcements and new guidelines</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="p-7 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-black text-[11px] bg-[#FFC700] text-slate-950 uppercase tracking-wider">
                    Policy Updates
                  </span>
                  <span className="text-xs text-[var(--kmm-muted)] font-semibold">Institutional circular</span>
                </div>
                <h3 className="text-lg font-bold">How policy updates will be announced</h3>
                <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                  Approved policy updates and revisions will appear here with a date, a category, and direct links to gazetted documentation.
                </p>
              </article>

              <article className="p-7 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-black text-[11px] bg-[#FFC700] text-slate-950 uppercase tracking-wider">
                    Training
                  </span>
                  <span className="text-xs text-[var(--kmm-muted)] font-semibold">Academy session</span>
                </div>
                <h3 className="text-lg font-bold">Training announcements</h3>
                <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                  Public training cohorts and quarterly board seminars will be published here. Video modules and transcripts reside inside the Training Portal.
                </p>
              </article>

              <article className="p-7 rounded-[28px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-black text-[11px] bg-[#FFC700] text-slate-950 uppercase tracking-wider">
                    Guidelines
                  </span>
                  <span className="text-xs text-[var(--kmm-muted)] font-semibold">Pre-release standard</span>
                </div>
                <h3 className="text-lg font-bold">New guidelines and resources</h3>
                <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                  When new guidelines on AI generation, child privacy, or character licensing are approved, they will be introduced here.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MINISTRY & DEPARTMENT ONBOARDING WAITLIST SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors relative overflow-hidden" id="onboarding">
          {/* Subtle Geometric Texture Overlay */}
          <div className="absolute inset-0 kmm-pattern-grid kmm-mask-radial pointer-events-none opacity-60" aria-hidden="true" />
          <div className="absolute top-1/2 left-10 size-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 size-96 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
          <div className="kmm-wrap relative z-10 space-y-10">
            <div className="max-w-3xl space-y-3">
              <p className="eyebrow">Institutional Access & Waitlist</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Onboard your Ministry or Department
              </h2>
              <p className="text-base text-[var(--kmm-muted)] leading-relaxed">
                Whether you represent a Church Zone, Children's Ministry department, or media production unit, join the Kiddies Media Ministry ecosystem and get onboarded to the IP Portal. The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
              </p>
            </div>

            {/* CTA Showcase Card */}
            <div className="p-8 sm:p-12 rounded-[36px] sm:rounded-[44px] bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xl relative overflow-hidden">
              {/* Decorative background glows */}
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#FFC700]/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-[#0284C7]/15 blur-3xl" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#FFC700]/20 text-slate-900 border border-[#FFC700]/30 uppercase tracking-wider">
                    <span className="size-2 rounded-full bg-[#FFC700] animate-pulse" />
                    <span>Official Ministry Waitlist &amp; Verification</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--kmm-fg)]">
                    Ready to Document and Steward Your Ministry&apos;s Media?
                  </h3>

                  <p className="text-sm text-[var(--kmm-muted)] leading-relaxed max-w-2xl">
                    Submit your ministry unit’s expression of interest to receive dedicated access credentials for the Kiddies Media Ministry IP Portal. Our secretariat verifies governance mandates, chain-of-title records, and child safety compliance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-2 text-[var(--kmm-muted)] font-semibold">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>IP Governance &amp; Deeds</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--kmm-muted)] font-semibold">
                      <span className="text-[#0284C7] font-bold">✓</span>
                      <span>Asset Cataloguing</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--kmm-muted)] font-semibold">
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
                    href={trainingPortalHref}
                    className="kmm-btn kmm-btn-o text-center font-bold"
                  >
                    <span>View Training &amp; Guidelines</span>
                  </Link>
                  <p className="text-[11px] text-[var(--kmm-muted)] text-center">
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
        <section className="py-20 scroll-mt-20 relative overflow-hidden bg-white" id="contact">
          {/* Subtle Dot Matrix Texture */}
          <div className="absolute inset-0 kmm-pattern-dots kmm-mask-radial pointer-events-none opacity-45" aria-hidden="true" />
          <div className="kmm-wrap relative z-10 space-y-8">
            <div className="max-w-2xl space-y-3">
              <p className="eyebrow">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Institutional enquiries</h2>
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
                  className="px-4 py-2 rounded-full font-semibold text-xs border-2 border-[var(--kmm-blue)] text-[var(--kmm-fg)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 m-0">
              <div className="p-6 rounded-2xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)]">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">Email</dt>
                <dd className="m-0 font-bold text-base text-[var(--kmm-fg)]">governance@kiddiesmediaministry.org</dd>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)]">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">Directorate</dt>
                <dd className="m-0 font-bold text-base text-[var(--kmm-fg)]">Kiddies Media Ministry Legal &amp; Broadcast Directorate</dd>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)]">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-1">Network Hub</dt>
                <dd className="m-0 font-bold text-base text-[var(--kmm-fg)]">Loveworld Nation Headquarters</dd>
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
                <li><Link href={trainingPortalHref} className="hover:text-[var(--kmm-gold)] transition-colors">Training Portal</Link></li>
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
