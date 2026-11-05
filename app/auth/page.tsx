'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

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

const DEFAULT_DEMO_USERS: TrainingUser[] = [
  {
    id: 'TP-LOV-001',
    name: 'Barrister Lillian',
    email: 'officer@lovetoons.tv',
    agency: 'Lovetoons Content Operations',
    role: 'Statutory Child Safeguarding Director',
    initials: 'BL',
    registeredAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'TP-LOV-002',
    name: 'Pastor Dave',
    email: 'dave@lovetoons.tv',
    agency: 'Lovetoons Animation Studio',
    role: 'Lead Animation Producer',
    initials: 'PD',
    registeredAt: '2026-02-10T11:30:00Z',
  },
  {
    id: 'TP-MIN-003',
    name: "Sister Grace (Children's Ministry)",
    email: 'grace@childrensministry.org',
    agency: "Children's Ministry Directorate",
    role: 'Curriculum & Video Broadcast Reviewer',
    initials: 'SG',
    registeredAt: '2026-03-01T14:20:00Z',
  },
]

const STANDARD_AGENCIES = [
  'Lovetoons Animation',
  'Publishing Agency',
  'Digital Agency',
  'Academy Agency',
  'Educational Agency',
  "Children's Ministry",
  'Healing School Kids',
  'Global Youth Leaders Forum Kids',
]

const STANDARD_ROLES = [
  'Child Safeguarding Officer',
  'Content Reviewer & Policy Officer',
  'Lead Animator / Director',
  'Scriptwriter & Storyboarder',
  'Voice Actor / Audio Engineer',
  'Sunday School Teacher & Educator',
  'Broadcast Compliance Reviewer',
]

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('officer@lovetoons.tv')
  const [signInPassword, setSignInPassword] = useState('admin123')
  const [showSignInPassword, setShowSignInPassword] = useState(false)

  // Sign Up state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpAgency, setSignUpAgency] = useState("Children's Ministry")
  const [signUpRole, setSignUpRole] = useState('Child Safeguarding Officer')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('kmm_training_theme')
    setIsDark(savedTheme === 'dark')

    // Initialize registered demo users in localStorage if not already present
    try {
      const stored = localStorage.getItem('kmm_registered_training_users')
      if (!stored) {
        localStorage.setItem('kmm_registered_training_users', JSON.stringify(DEFAULT_DEMO_USERS))
      }
    } catch {
      // storage unavailable
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    localStorage.setItem('kmm_training_theme', nextDark ? 'dark' : 'light')
    if (typeof document !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const email = signInEmail.trim().toLowerCase()
    if (!email) {
      setErrorMessage('Please enter your email address.')
      return
    }

    setIsLoading(true)

    try {
      // 1. Try to find user in local repository of registered training users
      let matchedUser: TrainingUser | undefined
      try {
        const storedUsersRaw = localStorage.getItem('kmm_registered_training_users')
        const storedUsers: TrainingUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : DEFAULT_DEMO_USERS
        matchedUser = storedUsers.find((u) => u.email.toLowerCase() === email)
      } catch {
        matchedUser = DEFAULT_DEMO_USERS.find((u) => u.email.toLowerCase() === email)
      }

      // If matched user found or fallback demo account
      const effectiveUser: TrainingUser = matchedUser || {
        id: `TP-${Date.now().toString().slice(-6)}`,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        agency: email.includes('lovetoons') ? 'Lovetoons' : "Children's Ministry",
        role: 'Content Reviewer & Safeguarding Officer',
        initials: (email.split('@')[0].slice(0, 2) || 'KM').toUpperCase(),
        registeredAt: new Date().toISOString(),
      }

      // Save active training session
      if (typeof window !== 'undefined') {
        localStorage.setItem('kmm_training_user', JSON.stringify(effectiveUser))
        localStorage.setItem('kmm_auth_officer', effectiveUser.name)
      }

      setSuccessMessage(`Welcome back, ${effectiveUser.name}! Loading training curriculum...`)
      setTimeout(() => {
        router.push('/training-portal')
      }, 500)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate officer session.')
      setIsLoading(false)
    }
  }

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const name = signUpName.trim()
    const email = signUpEmail.trim().toLowerCase()
    const agency = signUpAgency.trim() || "Children's Ministry"
    const role = signUpRole.trim() || 'Child Safeguarding Officer'
    const password = signUpPassword

    if (!name) {
      setErrorMessage('Please provide your full name or title.')
      return
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid ministry email address.')
      return
    }
    if (!password || password.length < 6) {
      setErrorMessage('Please create a secure password of at least 6 characters.')
      return
    }

    setIsLoading(true)

    try {
      // 1. Call backend registration API
      try {
        await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, agency, role, password }),
        })
      } catch {
        // graceful offline fallback
      }

      // 2. Generate new TrainingUser profile
      const initials = name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'KM'

      const newUser: TrainingUser = {
        id: `TP-${Date.now().toString().slice(-6)}`,
        name,
        email,
        agency,
        role,
        initials,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        registeredAt: new Date().toISOString(),
      }

      // 3. Persist in registered users list
      try {
        const storedUsersRaw = localStorage.getItem('kmm_registered_training_users')
        const storedUsers: TrainingUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [...DEFAULT_DEMO_USERS]
        const withoutOld = storedUsers.filter((u) => u.email.toLowerCase() !== email)
        withoutOld.push(newUser)
        localStorage.setItem('kmm_registered_training_users', JSON.stringify(withoutOld))
      } catch {
        // ignore
      }

      // 4. Set active authenticated training session
      if (typeof window !== 'undefined') {
        localStorage.setItem('kmm_training_user', JSON.stringify(newUser))
        localStorage.setItem('kmm_auth_officer', newUser.name)
      }

      setSuccessMessage(`Account created successfully! Welcome to KMM, ${name}!`)
      setTimeout(() => {
        router.push('/training-portal')
      }, 700)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete registration.')
      setIsLoading(false)
    }
  }

  // Quick 1-click demo selection
  const selectDemoUser = (user: TrainingUser) => {
    setMode('signin')
    setSignInEmail(user.email)
    setSignInPassword('admin123')
    setErrorMessage(null)
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F0FAFD] text-slate-900'
      }`}
      style={{
        fontFamily: 'Figtree, -apple-system, sans-serif',
      }}
    >
      {/* Background ambient radial glows */}
      <div
        className="fixed -top-40 left-1/10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{ background: isDark ? '#F59E0B' : '#0284C7' }}
      />
      <div
        className="fixed -bottom-40 right-1/10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ background: isDark ? '#38BDF8' : '#FFB800' }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-2 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base sm:text-lg group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#F97316] text-[#0F172A] flex items-center justify-center text-sm font-black shadow-md group-hover:scale-105 transition-transform">
            ▶
          </div>
          <span className="font-extrabold tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            KMM Training Portal
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/training-portal"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
          >
            <ArrowLeft className="size-3.5" />
            <span>Training Portal</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-white/10 text-amber-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
          >
            {isMounted && isDark ? (
              <>
                <Sun className="size-3.5 text-amber-400" />
                <span className="hidden xs:inline">Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-slate-600" />
                <span className="hidden xs:inline">Dark Theme</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main
        className={`w-full max-w-lg my-auto p-6 sm:p-9 rounded-3xl relative z-10 border shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-slate-900/90 border-white/10 shadow-black/50'
            : 'bg-white/95 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(2,132,199,0.12)]'
        }`}
      >
        {/* Badge & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-amber-500/15 border border-amber-500/30 text-amber-500">
            <span>🎬</span> Content Safeguarding & Accreditation
          </div>

          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            {mode === 'signin' ? 'Officer Sign In' : 'Officer Registration'}
          </h1>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {mode === 'signin'
              ? 'Access statutory safeguarding modules, interactive clearance tools, and legal covenants.'
              : 'Register to record your personal training progress and receive verifiable accreditation certificates.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex rounded-xl p-1 mb-6 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODE 1: SIGN IN FORM */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="officer@lovetoons.tv"
                  autoComplete="username"
                  required
                  className={`w-full h-11 pl-10 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden ${
                    isDark
                      ? 'bg-slate-800/80 border-white/10 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border font-medium text-xs transition-all outline-hidden ${
                    isDark
                      ? 'bg-slate-800/80 border-white/10 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showSignInPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 disabled:opacity-70 mt-2"
              style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
            >
              {isLoading ? (
                <div className="size-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Sign In &amp; Launch Training Portal</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-white/10">
              <div className="flex items-center justify-between text-[11px] mb-2 font-semibold text-slate-500 dark:text-slate-400">
                <span>Quick Demo Accounts:</span>
                <span className="text-[10px] text-amber-500 font-bold">(1-Click Fill)</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {DEFAULT_DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectDemoUser(user)}
                    className="flex items-center justify-between p-2 rounded-lg text-left text-xs bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/5 transition cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.agency}</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider shrink-0 ml-2">
                      Auto-Fill &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* MODE 2: SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                Full Name / Officer Title
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Pastor Sarah Williams"
                  required
                  className={`w-full h-10 pl-10 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden ${
                    isDark
                      ? 'bg-slate-800/80 border-white/10 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@lovetoons.tv or ministry.org"
                  required
                  className={`w-full h-10 pl-10 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden ${
                    isDark
                      ? 'bg-slate-800/80 border-white/10 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Ministry / Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={signUpAgency}
                    onChange={(e) => setSignUpAgency(e.target.value)}
                    className={`w-full h-10 pl-9 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden appearance-none cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 border-white/10 text-white focus:border-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  >
                    {STANDARD_AGENCIES.map((ag) => (
                      <option key={ag} value={ag} className="dark:bg-slate-900">
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Officer Designation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value)}
                    className={`w-full h-10 pl-9 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden appearance-none cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 border-white/10 text-white focus:border-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  >
                    {STANDARD_ROLES.map((role) => (
                      <option key={role} value={role} className="dark:bg-slate-900">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                Create Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className={`w-full h-10 pl-10 pr-10 rounded-xl border font-medium text-xs transition-all outline-hidden ${
                    isDark
                      ? 'bg-slate-800/80 border-white/10 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showSignUpPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 disabled:opacity-70 mt-2"
              style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
            >
              {isLoading ? (
                <div className="size-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Create Account &amp; Begin Accreditation</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation Links */}
        <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-2 text-center">
          <Link
            href="/onboarding"
            className="text-xs font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <span>Interested Ministry or Department? Join Waitlist &rarr;</span>
          </Link>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
            <Link href="/training-portal" className="hover:text-amber-500 transition-colors">
              Enter as Guest
            </Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Return to Website
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Legal Notice */}
      <footer className="relative z-20 text-center py-2 text-[11px] text-slate-500 dark:text-slate-500">
        Loveworld Nation &bull; Kiddies Media Ministry Statutory Training &amp; Child Safeguarding Directorate
      </footer>
    </div>
  )
}
