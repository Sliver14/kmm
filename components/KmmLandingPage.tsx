'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function KmmLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentYear = new Date().getFullYear()

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
      <style jsx global>{`
        .kmm-site-root {
          --kmm-bg: #FFF7E6;
          --kmm-surface: #FFFFFF;
          --kmm-band: #FCEBC4;
          --kmm-fg: #10233F;
          --kmm-muted: #46566E;
          --kmm-line: rgba(16, 35, 63, 0.14);
          --kmm-header: rgba(255, 247, 230, 0.94);
          --kmm-blue: #1F6FD0;
          --kmm-orange: #F26A1B;
          --kmm-gold: #F2B233;
          --kmm-navy: #10233F;
          --kmm-cream: #FFF7E6;
          --kmm-link: #1757A8;
          --kmm-eyebrow: #B8420A;
          --kmm-ribbon-a: #F2B233;
          --kmm-ribbon-b: #1F6FD0;
          --kmm-display: "Bricolage Grotesque", "Trebuchet MS", system-ui, sans-serif;
          --kmm-body: "Figtree", system-ui, -apple-system, sans-serif;
          background: var(--kmm-bg);
          color: var(--kmm-fg);
          font-family: var(--kmm-body);
          font-size: 17px;
          line-height: 1.6;
          min-height: 100vh;
        }

        .dark .kmm-site-root {
          --kmm-bg: #0B1730;
          --kmm-surface: #14294D;
          --kmm-band: #102140;
          --kmm-fg: #FFF3DA;
          --kmm-muted: #B7C4DA;
          --kmm-line: rgba(255, 243, 218, 0.16);
          --kmm-header: rgba(11, 23, 48, 0.94);
          --kmm-link: #8DBDFF;
          --kmm-eyebrow: #FFB55E;
        }

        .kmm-wrap {
          max-width: 1160px;
          margin: 0 auto;
          padding-left: 16px;
          padding-right: 16px;
        }
        @media (min-width: 640px) {
          .kmm-wrap {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .kmm-site-root h1,
        .kmm-site-root h2,
        .kmm-site-root h3 {
          font-family: var(--kmm-display);
          line-height: 1.12;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .kmm-site-root .eyebrow {
          font-family: var(--kmm-body);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--kmm-eyebrow);
        }

        .kmm-site-root .lead {
          font-size: 1.15rem;
          color: var(--kmm-muted);
          max-width: 62ch;
          line-height: 1.6;
        }

        /* Buttons */
        .kmm-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 9999px;
          padding: 13px 26px;
          font-family: var(--kmm-body);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          border: 2px solid transparent;
          transition: transform 0.2s ease, filter 0.2s ease, background-color 0.2s ease;
          cursor: pointer;
        }
        .kmm-btn:hover {
          transform: translateY(-2px);
        }
        .kmm-btn-p {
          background: var(--kmm-orange);
          color: #10233F;
        }
        .kmm-btn-p:hover {
          filter: brightness(1.05);
        }
        .kmm-btn-s {
          background: var(--kmm-blue);
          color: #FFFFFF;
        }
        .kmm-btn-s:hover {
          filter: brightness(1.1);
        }
        .kmm-btn-o {
          border-color: currentColor;
          color: var(--kmm-fg);
          background: transparent;
        }
        .kmm-btn-o:hover {
          background: rgba(16, 35, 63, 0.05);
        }
        .dark .kmm-btn-o:hover {
          background: rgba(255, 243, 218, 0.1);
        }
        .kmm-btn-disabled {
          background: transparent;
          border: 2px dashed currentColor;
          opacity: 0.7;
          cursor: not-allowed;
        }
        .kmm-btn-disabled:hover {
          transform: none;
        }

        /* Animations */
        @keyframes kmmRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kmmBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes kmmSlowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .kmm-animate-rise {
          animation: kmmRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .kmm-chip-bob {
          animation: kmmBob 5s ease-in-out infinite;
        }
        .kmm-slow-spin {
          animation: kmmSlowSpin 80s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .kmm-slow-spin,
          .kmm-chip-bob,
          .kmm-animate-rise {
            animation: none !important;
          }
        }

        /* Governance spine line */
        .kmm-spine-connector::before {
          content: "";
          position: absolute;
          left: 5%;
          right: 5%;
          top: 31px;
          border-top: 3px dashed var(--kmm-gold);
          z-index: 1;
        }
        @media (max-width: 860px) {
          .kmm-spine-connector::before {
            left: 31px;
            right: auto;
            top: 0;
            bottom: 0;
            border-top: 0;
            border-left: 3px dashed var(--kmm-gold);
          }
        }
      `}</style>

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
            <ul className="flex items-center gap-1.5 list-none m-0 p-0">
              <li>
                <a href="#about" className="px-3.5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]">
                  About
                </a>
              </li>
              <li>
                <a href="#mandate" className="px-3.5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]">
                  Mandate
                </a>
              </li>
              <li>
                <a href="#governance" className="px-3.5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]">
                  Governance
                </a>
              </li>
              <li>
                <a href="#lovetoons" className="px-3.5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]">
                  LoveToons
                </a>
              </li>
              <li>
                <a href="#updates" className="px-3.5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]">
                  Updates
                </a>
              </li>
              <li>
                <a href="#contact" className="px-3.5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--kmm-band)] transition-colors text-[var(--kmm-fg)]">
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/auth"
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
            <div className="flex flex-col gap-1.5 list-none m-0 p-0">
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-[var(--kmm-blue)]/15 text-[var(--kmm-blue)] flex items-center justify-center font-bold text-sm">
                  ℹ
                </span>
                <span>About KMM</span>
              </a>

              <a
                href="#mandate"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-[var(--kmm-orange)]/15 text-[var(--kmm-orange)] flex items-center justify-center font-bold text-sm">
                  🛡
                </span>
                <span>Mandate & Responsibilities</span>
              </a>

              <a
                href="#governance"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-[var(--kmm-gold)]/20 text-[#10233F] dark:text-[var(--kmm-gold)] flex items-center justify-center font-bold text-sm">
                  ⚖
                </span>
                <span>Governance Framework</span>
              </a>

              <a
                href="#lovetoons"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                  📺
                </span>
                <span>LoveToons TV & Ecosystem</span>
              </a>

              <a
                href="#updates"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  📢
                </span>
                <span>Policy Updates & Gazettes</span>
              </a>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base hover:bg-[var(--kmm-band)] active:bg-[var(--kmm-band)] text-[var(--kmm-fg)] transition-colors"
              >
                <span className="size-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                  ✉
                </span>
                <span>Institutional Enquiries</span>
              </a>

              {/* Portal CTA Cards in Drawer */}
              <div className="pt-4 mt-2 border-t border-[var(--kmm-line)] flex flex-col gap-3">
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl font-bold bg-[var(--kmm-orange)] text-[#10233F] shadow-md hover:brightness-105 active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-xl bg-black/15 text-[#10233F] flex items-center justify-center font-black text-sm">
                      ▶
                    </span>
                    <div className="text-left">
                      <div className="text-sm font-extrabold" style={{ fontFamily: 'var(--kmm-display)' }}>
                        Training Portal & Academy
                      </div>
                      <div className="text-[11px] font-semibold opacity-85">
                        Officer accreditation & video modules
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
                        IP & Asset Management Portal
                      </div>
                      <div className="text-[11px] font-semibold opacity-85">
                        Digital assets, approvals & governance
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black">&rarr;</span>
                </Link>
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
              <p className="eyebrow kmm-animate-rise">Kiddies Media Ministry &middot; KMM</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] kmm-animate-rise">
                Guiding the Standards.{' '}
                <em className="not-italic text-[var(--kmm-orange)] block">
                  Governing the Future of Children's Media.
                </em>
              </h1>
              <p className="lead kmm-animate-rise">
                Kiddies Media Ministry provides the governance framework, policies, standards, and guidance that support responsible, consistent, and purpose-driven children's content across Loveworld Kingdom.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 kmm-animate-rise">
                <a href="#mandate" className="kmm-btn kmm-btn-p">
                  Explore Our Mandate
                </a>
                <Link href="/auth" className="kmm-btn kmm-btn-s">
                  Access Training Portal
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
                    alt="KMM Emblem"
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
            WHO WE ARE SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20" id="about">
          <div className="kmm-wrap grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow mb-3">Who we are</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">The framework that children's media works within</h2>
            </div>
            <div className="space-y-6">
              <p className="lead">
                KMM provides the governance, policy, and standards framework for children's content across Loveworld Kingdom.
              </p>
              <p className="text-base text-[var(--kmm-muted)] leading-relaxed">
                Our purpose is to guide, coordinate, and set expectations for children's media initiatives, so that teams across the ministry can create and share content with clarity and confidence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-3xl p-6 bg-[var(--kmm-blue)] text-white shadow-md">
                  <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                    What KMM does
                  </b>
                  <span className="text-sm leading-relaxed block text-white/90">
                    Guides, coordinates and establishes the expectations children's media initiatives follow.
                  </span>
                </div>
                <div className="rounded-3xl p-6 bg-[var(--kmm-gold)] text-[#10233F] shadow-md">
                  <b className="block font-bold text-lg mb-2" style={{ fontFamily: 'var(--kmm-display)' }}>
                    What KMM is not
                  </b>
                  <span className="text-sm leading-relaxed block text-[#10233F]/90">
                    A studio that simply produces entertainment content.
                  </span>
                </div>
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
                From policy to compliance, these are the areas KMM covers on behalf of children's media across the ministry.
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
                <h3 className="text-xl font-bold mb-2">Legal Accreditation</h3>
                <p className="text-sm leading-relaxed text-[#10233F]/90">Institutional training and regulatory qualification for ministry legal counsels, child safeguarding auditors, and broadcast reviewers.</p>
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
              These are KMM's proposed public-facing areas of responsibility, subject to confirmation against officially approved policies and organizational mandates.
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
            LOVETOONS ECOSYSTEM SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20 bg-[var(--kmm-band)] transition-colors" id="lovetoons">
          <div className="kmm-wrap">
            <div className="max-w-2xl space-y-3 mb-12">
              <p className="eyebrow">The LoveToons ecosystem</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Where children's media reaches children</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* TV */}
              <article className="rounded-[40px] rounded-br-[120px] p-8 sm:p-10 bg-[var(--kmm-blue)] text-white shadow-xl flex flex-col justify-between">
                <div>
                  <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM8 21h8M10 10l5 2.5-5 2.5V10z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">LoveToons TV</h3>
                  <p className="text-sm leading-relaxed text-white/90 mb-8 max-w-md">
                    Discover inspirational, character-building children's animated media through the LoveToons TV application.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="kmm-btn kmm-btn-disabled text-xs">Google Play &middot; coming soon</span>
                  <span className="kmm-btn kmm-btn-disabled text-xs">App Store &middot; coming soon</span>
                </div>
              </article>

              {/* Website */}
              <article className="rounded-[40px] rounded-bl-[120px] p-8 sm:p-10 bg-[var(--kmm-gold)] text-[#10233F] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="size-14 rounded-2xl bg-[#10233F]/15 flex items-center justify-center mb-6">
                    <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">LoveToons Website</h3>
                  <p className="text-sm leading-relaxed text-[#10233F]/90 mb-8 max-w-md">
                    Explore LoveToons broadcast series, animated episodes, published comics, and interactive learning media.
                  </p>
                </div>
                <div>
                  <span className="kmm-btn kmm-btn-disabled text-xs">Visit website &middot; link coming soon</span>
                </div>
              </article>
            </div>

            <p className="text-xs text-[var(--kmm-muted)] mt-8">
              Official download and website links will be added here once supplied.
            </p>
          </div>
        </section>

        {/* =========================================================================
            TRAINING & ACADEMY SECTION
            ========================================================================= */}
        <section className="py-20 scroll-mt-20" id="training">
          <div className="kmm-wrap">
            <div className="rounded-[48px] p-8 sm:p-14 bg-[var(--kmm-navy)] text-white shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
              <div className="lg:col-span-7 space-y-6">
                <p className="eyebrow !text-[var(--kmm-gold)]">KMM Governance, Legal & Policy Academy</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Institutional accreditation & compliance portal
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-white/85">
                  The academy is the official institutional learning environment dedicated exclusively to Governance, Legal Jurisprudence, Statutory Child Protection, and Intellectual Property Policy. Ministry legal counsels, safeguarding auditors, and broadcast compliance reviewers complete mandatory accreditation to enforce zero-defect standards across all Loveworld media channels.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link href="/auth" className="kmm-btn kmm-btn-p">
                    Sign In to Training Portal
                  </Link>
                  <Link href="/auth" className="kmm-btn kmm-btn-s">
                    Officer Authentication
                  </Link>
                  <Link href="/ip-portal" className="kmm-btn kmm-btn-o !text-white border-white/40 hover:bg-white/10">
                    Switch to IP Portal &rarr;
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl p-6 bg-[var(--kmm-cream)] text-[#10233F] shadow-lg flex items-start gap-4">
                  <svg className="size-7 shrink-0 text-[#10233F] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                  </svg>
                  <div>
                    <b className="block font-bold text-base mb-1" style={{ fontFamily: 'var(--kmm-display)' }}>
                      Public Governance Charters
                    </b>
                    <span className="text-xs leading-relaxed block text-[#10233F]/85">
                      Access published statutory child safeguarding protocols, age ratings, broadcast compliance guidelines, and board circulars.
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl p-6 bg-[var(--kmm-orange)] text-[#10233F] shadow-lg flex items-start gap-4">
                  <svg className="size-7 shrink-0 text-[#10233F] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <div>
                    <b className="block font-bold text-base mb-1" style={{ fontFamily: 'var(--kmm-display)' }}>
                      Inside the Academy
                    </b>
                    <span className="text-xs leading-relaxed block text-[#10233F]/85">
                      Interactive compliance case player, defect classification matrices (Critical vs Minor), character copyright registers, and board diplomas.
                    </span>
                  </div>
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
                <dd className="m-0 font-bold text-base text-[var(--kmm-fg)]">KMM Legal & Broadcast Directorate</dd>
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
                  alt="KMM"
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
                <li><a href="#about" className="hover:text-[var(--kmm-gold)] transition-colors">About KMM</a></li>
                <li><a href="#governance" className="hover:text-[var(--kmm-gold)] transition-colors">Governance & Policies</a></li>
                <li><a href="#updates" className="hover:text-[var(--kmm-gold)] transition-colors">Resources & Updates</a></li>
                <li><Link href="/auth" className="hover:text-[var(--kmm-gold)] transition-colors">Training Portal (Sign In)</Link></li>
                <li><Link href="/training-portal" className="hover:text-[var(--kmm-gold)] transition-colors">KMM Video Academy</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--kmm-gold)]">Platforms</h4>
              <ul className="list-none m-0 p-0 space-y-2 text-sm text-white/90">
                <li><Link href="/ip-portal" className="text-[var(--kmm-gold)] font-bold hover:underline">Launch IP Portal &rarr;</Link></li>
                <li><a href="#lovetoons" className="hover:text-[var(--kmm-gold)] transition-colors">LoveToons TV</a></li>
                <li><a href="#lovetoons" className="hover:text-[var(--kmm-gold)] transition-colors">LoveToons Website</a></li>
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
    </div>
  )
}
