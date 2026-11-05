'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MinistryOnboardingForm } from '@/components/MinistryOnboardingForm'
import { ApkDownloadModal } from '@/components/ApkDownloadModal'

const agenciesList = [
  {
    name: 'Lovetoons',
    tagline: 'Animation & Entertainment',
    description: 'Animation series, TV broadcast, character IP & children entertainment.',
    icon: '📺',
    href: '#agencies-lovetoons',
    badge: 'Flagship',
  },
  {
    name: 'Publishing Agency',
    tagline: 'Literature & Curriculum',
    description: 'Comics, devotional books, storybooks, illustrated print & curriculum.',
    icon: '📚',
    href: '#agencies-publishing',
    badge: 'Publishing',
  },
  {
    name: 'Digital Agency',
    tagline: 'Interactive & Apps',
    description: 'Interactive games, educational mobile apps, AR/VR & online portals.',
    icon: '💻',
    href: '#agencies-digital',
    badge: 'Technology',
  },
  {
    name: 'Academy Agency',
    tagline: 'Governance & Training',
    description: 'Legal compliance, officer accreditation, policy auditing & safety covenants.',
    icon: '⚖️',
    href: '#training',
    badge: 'Governance',
  },
  {
    name: 'Educational Agency',
    tagline: 'Foundational Learning',
    description: 'School partnerships, foundational learning aids & global outreaches.',
    icon: '🎓',
    href: '#agencies-educational',
    badge: 'Education',
  },
]

export default function KmmLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [agenciesDropdownOpen, setAgenciesDropdownOpen] = useState(false)
  const [mobileAgenciesOpen, setMobileAgenciesOpen] = useState(false)
  const [isApkModalOpen, setIsApkModalOpen] = useState(false)
  const agenciesDropdownRef = React.useRef<HTMLLIElement>(null)
  const currentYear = new Date().getFullYear()

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
      <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors border-[var(--kmm-line)] bg-[var(--kmm-header)]">
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
                          className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[var(--kmm-band)] transition-colors group text-left"
                        >
                          <span className="size-9 rounded-xl bg-[var(--kmm-band)] flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                            {ag.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
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
                  className="px-4 py-2 rounded-full font-bold text-sm bg-[var(--kmm-orange)] text-[#10233F] hover:brightness-95 transition-all shadow-xs"
                >
                  Training Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/ip-portal"
                  className="px-4 py-2 rounded-full font-bold text-sm bg-[var(--kmm-navy)] text-[var(--kmm-gold)] border-[1.5px] border-[var(--kmm-gold)] hover:bg-[var(--kmm-gold)] hover:text-[var(--kmm-navy)] transition-all shadow-xs ml-1"
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
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
                      >
                        <span className="text-base">{ag.icon}</span>
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
                  className="flex items-center justify-between p-4 rounded-2xl font-bold bg-[var(--kmm-orange)] text-[#10233F] shadow-md hover:brightness-105 active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-xl bg-black/15 text-[#10233F] flex items-center justify-center font-black text-sm">
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
                  className="flex items-center justify-between p-4 rounded-2xl font-bold bg-[var(--kmm-navy)] text-[var(--kmm-gold)] border-2 border-[var(--kmm-gold)] shadow-md hover:bg-[var(--kmm-gold)] hover:text-[var(--kmm-navy)] active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-xl bg-[var(--kmm-gold)]/20 text-[var(--kmm-gold)] flex items-center justify-center font-black text-sm">
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
            HERO SECTION
            ========================================================================= */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          {/* Ribbon SVG background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 640" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M-40 470 C 260 330, 520 560, 820 400 S 1180 210, 1260 250"
              fill="none"
              stroke="var(--kmm-ribbon-a)"
              strokeWidth="64"
              strokeLinecap="round"
              opacity="0.55"
            />
            <path
              d="M-40 560 C 300 470, 600 640, 900 520 S 1200 420, 1260 440"
              fill="none"
              stroke="var(--kmm-ribbon-b)"
              strokeWidth="30"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>

          <div className="kmm-wrap relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Copy Left */}
            <div className="lg:col-span-7 space-y-6">
              <p className="eyebrow kmm-animate-rise">Kiddies Media Ministry</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] kmm-animate-rise">
                Guiding the Standards.{' '}
                <em className="not-italic text-[var(--kmm-orange)] block">
                  Governing the Future of Children's Media.
                </em>
              </h1>
              <p className="lead kmm-animate-rise !text-white" style={{ color: '#ffffff' }}>
                Kiddies Media Ministry provides the governance, training, and resources to document and steward children&apos;s media content and intellectual property across Loveworld Kingdom.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 kmm-animate-rise">
                <a href="#mandate" className="kmm-btn kmm-btn-p">
                  Explore Our Mandate
                </a>
                <Link href="/training-portal" className="kmm-btn kmm-btn-s">
                  Access Training & Tools
                </Link>
                <Link href="/ip-portal" className="kmm-btn kmm-btn-o" title="Intellectual Property & Asset Management Platform">
                  Launch IP Portal
                </Link>
              </div>
            </div>

            {/* Stage Graphic Right */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-square flex items-center justify-center">
                {/* Rotating SVG aura with calm, gentle speed */}
                <svg className="absolute -inset-[8%] w-[116%] h-[116%] overflow-visible kmm-slow-spin" viewBox="0 0 400 400" aria-hidden="true">
                  <circle cx="200" cy="200" r="190" fill="none" stroke="var(--kmm-orange)" strokeWidth="3" strokeDasharray="3 14" strokeLinecap="round" />
                  <circle cx="352" cy="92" r="26" fill="var(--kmm-orange)" />
                  <rect x="14" y="296" width="52" height="52" rx="16" fill="var(--kmm-blue)" transform="rotate(14 40 322)" />
                  <path d="M356 318l8 17 18 3-13 13 3 18-16-9-16 9 3-18-13-13 18-3z" fill="var(--kmm-gold)" />
                </svg>

                {/* Central Emblem */}
                <div className="relative size-[72%] rounded-full bg-white flex items-center justify-center p-6 shadow-[0_0_0_10px_var(--kmm-cream),0_0_0_14px_var(--kmm-gold),0_24px_50px_-16px_rgba(16,35,63,0.5)]">
                  <Image
                    src="/kmm-logo.png"
                    alt="Kiddies Media Ministry Emblem"
                    width={240}
                    height={240}
                    priority
                    className="object-contain"
                  />
                </div>

                {/* Floating Chips */}
                <div
                  className="absolute left-[-2%] top-[10%] px-4 py-2 rounded-full font-bold text-xs bg-[var(--kmm-surface)] text-[var(--kmm-fg)] shadow-[0_10px_24px_-10px_rgba(16,35,63,0.4)] flex items-center gap-2 kmm-chip-bob"
                >
                  <i className="size-2 rounded-full bg-[var(--kmm-gold)]" />
                  Policy & Standards
                </div>

                <div
                  className="absolute right-[-4%] top-[42%] px-4 py-2 rounded-full font-bold text-xs bg-[var(--kmm-surface)] text-[var(--kmm-fg)] shadow-[0_10px_24px_-10px_rgba(16,35,63,0.4)] flex items-center gap-2 kmm-chip-bob"
                  style={{ animationDelay: '-1.7s' }}
                >
                  <i className="size-2 rounded-full bg-[var(--kmm-blue)]" />
                  Child Protection
                </div>

                <div
                  className="absolute left-[6%] bottom-[6%] px-4 py-2 rounded-full font-bold text-xs bg-[var(--kmm-surface)] text-[var(--kmm-fg)] shadow-[0_10px_24px_-10px_rgba(16,35,63,0.4)] flex items-center gap-2 kmm-chip-bob"
                  style={{ animationDelay: '-3.2s' }}
                >
                  <i className="size-2 rounded-full bg-[var(--kmm-orange)]" />
                  Copyright & IP
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            WHO WE ARE SECTION (KMM & ITS ROLE)
            ========================================================================= */}
        <section className="py-20 scroll-mt-20" id="about">
          <div className="kmm-wrap space-y-12">
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
                  <div className="rounded-3xl p-6 bg-[var(--kmm-blue)] text-white shadow-md">
                    <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                      What Kiddies Media Ministry does
                    </b>
                    <span className="text-sm leading-relaxed block text-white/90">
                      Guides, coordinates, and establishes the expectations, training materials, practical tools, and supporting documents children&apos;s media initiatives follow.
                    </span>
                  </div>
                  <div className="rounded-3xl p-6 bg-[var(--kmm-gold)] text-[#10233F] shadow-md">
                    <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                      What Kiddies Media Ministry is not
                    </b>
                    <span className="text-sm leading-relaxed block text-[#10233F]/90">
                      A standalone studio that simply produces entertainment content without institutional governance.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars of Kiddies Media Ministry's Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
              <div className="p-6 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs space-y-2.5">
                <div className="size-10 rounded-2xl bg-[var(--kmm-blue)]/15 text-[var(--kmm-blue)] flex items-center justify-center font-bold text-lg">
                  ⚖
                </div>
                <h3 className="font-extrabold text-base">Policy & Governance</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Establishes statutory child safeguarding covenants, broadcast standards, and operational guidelines across all channels.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs space-y-2.5">
                <div className="size-10 rounded-2xl bg-[var(--kmm-gold)]/20 text-[#10233F] dark:text-[var(--kmm-gold)] flex items-center justify-center font-bold text-lg">
                  📚
                </div>
                <h3 className="font-extrabold text-base">Training Materials</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Delivers structured curriculum modules, masterclasses, and production playbooks for animators and creators.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs space-y-2.5">
                <div className="size-10 rounded-2xl bg-[var(--kmm-orange)]/15 text-[var(--kmm-orange)] flex items-center justify-center font-bold text-lg">
                  🛠
                </div>
                <h3 className="font-extrabold text-base">Practical Tools</h3>
                <p className="text-xs text-[var(--kmm-muted)] leading-relaxed">
                  Provides interactive safeguarding audit checklists, age-rating calculators, and IP clearance verification tools.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-xs space-y-2.5">
                <div className="size-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
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
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors" id="mandate">
          <div className="kmm-wrap">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">Our mandate</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Eight areas of responsibility</h2>
              <p className="lead">
                From policy to compliance, these are the areas Kiddies Media Ministry covers on behalf of children's media across the ministry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-blue)] text-white shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zm14 0l-3 7a4 4 0 0 0 6 0l-3-7z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Governance and Policy</h3>
                <p className="text-sm leading-relaxed text-white/90">Establish and maintain policies, governance frameworks, and operating guidelines for children's content.</p>
              </article>

              {/* 2 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-orange)] text-[#10233F] shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-[#10233F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Content Standards</h3>
                <p className="text-sm leading-relaxed text-[#10233F]/90">Define and communicate expectations for content quality, suitability, consistency, and alignment with ministry values.</p>
              </article>

              {/* 3 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-gold)] text-[#10233F] shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-[#10233F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="7" r="3" />
                  <path d="M5 21v-3a7 7 0 0 1 14 0v3M12 12v3" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Child Protection & Safety</h3>
                <p className="text-sm leading-relaxed text-[#10233F]/90">Promote age-appropriate content, safeguarding principles, responsible representation of children, privacy, and ethical media practices.</p>
              </article>

              {/* 4 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-navy)] text-white shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-[var(--kmm-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M14.5 9.5a3.5 3.5 0 1 0 0 5" />
                </svg>
                <h3 className="text-xl font-bold mb-2">IP & Copyright</h3>
                <p className="text-sm leading-relaxed text-white/90">Provide guidance on content ownership, copyright compliance, permissions, licensing, and appropriate use of creative assets.</p>
              </article>

              {/* 5 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-orange)] text-[#10233F] shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-[#10233F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM10 10h4v4h-4z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">AI & Digital Media</h3>
                <p className="text-sm leading-relaxed text-[#10233F]/90">Guide the responsible use of AI-generated content, digital tools, emerging technologies, and related creative workflows.</p>
              </article>

              {/* 6 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-gold)] text-[#10233F] shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-[#10233F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Training & Tools</h3>
                <p className="text-sm leading-relaxed text-[#10233F]/90">Institutional training materials, interactive compliance tools, and qualification for children&apos;s media producers, safeguarding auditors, and broadcast reviewers.</p>
              </article>

              {/* 7 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-navy)] text-white shadow-md hover:-translate-y-1 transition-transform">
                <svg className="size-9 mb-10 text-[var(--kmm-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M21 19c0-2.2-1.6-3.7-4-4.2" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                <p className="text-sm leading-relaxed text-white/90">Facilitate structured collaboration, accountability, and alignment among relevant children's media teams and initiatives.</p>
              </article>

              {/* 8 */}
              <article className="p-7 rounded-3xl rounded-br-[80px] bg-[var(--kmm-blue)] text-white shadow-md hover:-translate-y-1 transition-transform">
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
            GOVERNANCE FRAMEWORK SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20" id="governance">
          <div className="kmm-wrap">
            <div className="max-w-2xl space-y-3 mb-16">
              <p className="eyebrow">Governance framework</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">How governance moves from policy to practice</h2>
            </div>

            <div className="relative kmm-spine-connector">
              <ol className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 list-none m-0 p-0">
                {[
                  { step: '1', title: 'Policy Development' },
                  { step: '2', title: 'Standards & Guidelines' },
                  { step: '3', title: 'Implementation' },
                  { step: '4', title: 'Review & Compliance' },
                  { step: '5', title: 'Continuous Improvement' },
                ].map((item, index) => (
                  <li key={index} className="flex md:flex-col items-center md:text-center gap-4 md:gap-0">
                    <div className="size-16 rounded-full bg-[var(--kmm-navy)] text-[var(--kmm-gold)] font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-[0_0_0_6px_var(--kmm-bg)] md:mb-4">
                      {item.step}
                    </div>
                    <b className="font-bold text-base md:text-lg leading-tight" style={{ fontFamily: 'var(--kmm-display)' }}>
                      {item.title}
                    </b>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-xs text-[var(--kmm-muted)] text-center mt-12 max-w-xl mx-auto">
              This is the general governance cycle. It does not mean every content item passes through a formal approval workflow.
            </p>
          </div>
        </section>

        {/* =========================================================================
            AGENCIES & LOVETOONS ECOSYSTEM SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors" id="agencies">
          {/* Legacy anchor compatibility */}
          <div id="lovetoons" className="relative -top-24 pointer-events-none" />

          <div className="kmm-wrap">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">Operational Directorate & Agencies</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">The specialized agencies powering children's media</h2>
              <p className="text-sm leading-relaxed text-[var(--kmm-muted)]">
                Kiddies Media Ministry operates across five dedicated specialized agencies governing creative animation, literature, interactive technology, institutional accreditation, and foundational schooling.
              </p>
            </div>

            {/* Lovetoons Anchor */}
            <div id="agencies-lovetoons" className="relative -top-24 pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Mobile App */}
              <article className="rounded-[40px] rounded-br-[120px] p-8 sm:p-10 bg-[var(--kmm-blue)] text-white shadow-xl flex flex-col justify-between">
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
                    className="kmm-btn text-xs bg-white text-[var(--kmm-blue)] hover:bg-white/95 font-bold shadow-md inline-flex items-center gap-2 transition-all"
                  >
                    <svg className="size-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.79.92-2.85-.92.04-2.07.62-2.73 1.39-.58.67-1.09 1.74-.96 2.77 1.03.08 2.13-.53 2.77-1.31z" />
                    </svg>
                    <span>App Store (iOS)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsApkModalOpen(true)}
                    className="kmm-btn text-xs bg-white/20 hover:bg-white/30 text-white font-bold border border-white/30 inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
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
                    className="kmm-btn text-xs bg-white/10 hover:bg-white/20 text-white/90 font-medium inline-flex items-center gap-1.5 transition-all"
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
              <article className="rounded-[40px] rounded-bl-[120px] p-8 sm:p-10 bg-[var(--kmm-gold)] text-[#10233F] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-[#10233F]/15 flex items-center justify-center">
                      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#10233F]/15 text-[#10233F]">
                      Lovetoons Agency
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">LoveToons Website</h3>
                  <p className="text-sm leading-relaxed text-[#10233F]/90 mb-8 max-w-md">
                    Explore LoveToons broadcast series, animated episodes, published comics, and interactive learning media.
                  </p>
                </div>
                <div>
                  <a
                    href="https://lovetoons.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kmm-btn text-xs bg-[#10233F] text-white hover:bg-[#10233F]/90 font-bold shadow-md inline-flex items-center gap-2 transition-all"
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
              <div id="agencies-publishing" className="scroll-mt-24 rounded-3xl p-6 bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
                      📚
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-fg)]">
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

              <div id="agencies-digital" className="scroll-mt-24 rounded-3xl p-6 bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-11 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl">
                      💻
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-fg)]">
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

              <div id="agencies-educational" className="scroll-mt-24 rounded-3xl p-6 bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xl">
                      🎓
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--kmm-band)] text-[var(--kmm-fg)]">
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
        <section className="py-20 scroll-mt-20" id="training">
          <div className="kmm-wrap space-y-12">
            {/* Header Box */}
            <div className="rounded-[40px] p-8 sm:p-12 bg-[var(--kmm-navy)] text-white shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--kmm-gold)] text-[#10233F]">
                  <span>Kiddies Media Ministry Institutional Training &amp; Resources</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Training Materials, Practical Tools &amp; Supporting Documents
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-white/85">
                  The website provides basic information about Kiddies Media Ministry and its role, alongside an institutional Training section with training materials and tools, and helpful supporting documents. The training portal equips ministry departments, animation studios, and creative teams with the knowledge, interactive utilities, and official templates needed to uphold zero-defect standards for children&apos;s media.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link href="/training-portal" className="kmm-btn kmm-btn-p">
                    Launch Training Portal &rarr;
                  </Link>
                  <Link href="/training-portal?tab=tools" className="kmm-btn kmm-btn-s">
                    Practical Tools
                  </Link>
                  <Link href="/training-portal?tab=documents" className="kmm-btn kmm-btn-o !text-white border-white/40 hover:bg-white/10">
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
              <div className="p-8 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[var(--kmm-blue)]/15 text-[var(--kmm-blue)] flex items-center justify-center font-bold text-xl">
                    📚
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-blue)] block mb-1">
                      Curriculum & Modules
                    </span>
                    <h3 className="text-xl font-bold">Training Materials</h3>
                  </div>
                  <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                    Comprehensive learning modules covering Child Safeguarding in Media, Broadcast & Visual Excellence, Scriptural Fidelity, and Intellectual Property Clearance.
                  </p>
                  <ul className="text-xs text-[var(--kmm-muted)] space-y-2 pt-2 border-t border-[var(--kmm-line)]">
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--kmm-blue)] font-bold">✓</span>
                      <span>8 Core masterclasses & curriculum outlines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--kmm-blue)] font-bold">✓</span>
                      <span>Biblical anchors & statutory citations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--kmm-blue)] font-bold">✓</span>
                      <span>Lesson takeaways & production checkpoints</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/training-portal?tab=materials"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kmm-link)] hover:underline"
                  >
                    <span>Explore Training Materials</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Practical Tools */}
              <div className="p-8 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[var(--kmm-gold)]/20 text-[#10233F] dark:text-[var(--kmm-gold)] flex items-center justify-center font-bold text-xl">
                    🛠
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-gold)] block mb-1">
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
                    href="/training-portal?tab=tools"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kmm-link)] hover:underline"
                  >
                    <span>Launch Practical Tools</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Supporting Documents */}
              <div className="p-8 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-[var(--kmm-orange)]/15 text-[var(--kmm-orange)] flex items-center justify-center font-bold text-xl">
                    📋
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--kmm-orange)] block mb-1">
                      Charters & Templates
                    </span>
                    <h3 className="text-xl font-bold">Helpful Supporting Documents</h3>
                  </div>
                  <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                    Official gazetted charters, policy covenants, talent release deeds, and compliance templates ready for immediate reading and download.
                  </p>
                  <ul className="text-xs text-[var(--kmm-muted)] space-y-2 pt-2 border-t border-[var(--kmm-line)]">
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--kmm-orange)] font-bold">✓</span>
                      <span>Official Child Safeguarding Policy Manual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--kmm-orange)] font-bold">✓</span>
                      <span>Minor Talent & Voice Contributor Release Deeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--kmm-orange)] font-bold">✓</span>
                      <span>COPPA Digital Safety & Broadcast Standards</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/training-portal?tab=documents"
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
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors" id="updates">
          <div className="kmm-wrap">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">Latest updates</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Policy updates, announcements and new guidelines</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="p-7 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-bold bg-[var(--kmm-gold)] text-[#10233F]">
                    Policy Updates
                  </span>
                  <span className="text-xs text-[var(--kmm-muted)] font-semibold">Institutional circular</span>
                </div>
                <h3 className="text-lg font-bold">How policy updates will be announced</h3>
                <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                  Approved policy updates and revisions will appear here with a date, a category, and direct links to gazetted documentation.
                </p>
              </article>

              <article className="p-7 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-bold bg-[var(--kmm-gold)] text-[#10233F]">
                    Training
                  </span>
                  <span className="text-xs text-[var(--kmm-muted)] font-semibold">Academy session</span>
                </div>
                <h3 className="text-lg font-bold">Training announcements</h3>
                <p className="text-sm text-[var(--kmm-muted)] leading-relaxed">
                  Public training cohorts and quarterly board seminars will be published here. Video modules and transcripts reside inside the Training Portal.
                </p>
              </article>

              <article className="p-7 rounded-3xl bg-[var(--kmm-surface)] border border-[var(--kmm-line)] shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-bold bg-[var(--kmm-gold)] text-[#10233F]">
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
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors" id="onboarding">
          <div className="kmm-wrap space-y-10">
            <div className="max-w-3xl space-y-3">
              <p className="eyebrow">Institutional Access & Waitlist</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Onboard your Ministry or Department
              </h2>
              <p className="text-base text-[var(--kmm-muted)] leading-relaxed">
                Whether you represent a Church Zone, Children's Ministry department, or media production unit, join the Kiddies Media Ministry ecosystem and get onboarded to the IP Portal. The portal is an important resource for documenting and stewarding children’s media content and related intellectual property.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <MinistryOnboardingForm embedded />
            </div>
          </div>
        </section>

        {/* =========================================================================
            CONTACT / ENQUIRIES SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20" id="contact">
          <div className="kmm-wrap space-y-8">
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
                <li><Link href="/training-portal" className="hover:text-[var(--kmm-gold)] transition-colors">Training Portal Hub</Link></li>
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
