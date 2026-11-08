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
  roleLabel?: string
  initials: string
  avatar?: string
  password_hash?: string
  isAdmin?: boolean
  isPortalAdmin?: boolean
  registeredAt: string
}

const MINISTRIES_AND_AGENCIES = [
  "Children's Ministry",
  'Lovetoons Animation',
  'Publishing Agency',
  'Digital Agency',
  'Academy Agency',
  'Educational Agency',
  'Healing School Kids',
  'Global Youth Leaders Forum Kids',
  'Teens & Youth Ministry',
  'Other Ministry / Department',
]

const STANDARD_ROLES = [
  'Portal Admin',
  'Administrator & Directorate Lead',
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

  // Sign In state (clean, no demo credentials)
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showSignInPassword, setShowSignInPassword] = useState(false)

  // Sign Up state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpAgency, setSignUpAgency] = useState("Children's Ministry")
  const [customAgency, setCustomAgency] = useState('')
  const [signUpRole, setSignUpRole] = useState('Child Safeguarding Officer')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('kmm_training_theme') : null
    const htmlHasDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    const darkActive = savedTheme ? savedTheme === 'dark' : htmlHasDark
    setIsDark(darkActive)

    if (typeof document !== 'undefined') {
      if (darkActive) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Pre-seed Portal Admin in client storage if not already present
    try {
      const storedUsersRaw = localStorage.getItem('kmm_registered_training_users')
      let users: TrainingUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : []
      if (!Array.isArray(users)) users = []

      const portalAdminExists = users.some(
        (u) => u.email.toLowerCase() === 'portaladmin@kiddiesmedia.org'
      )
      if (!portalAdminExists) {
        users.push({
          id: 'usr-portal-admin',
          name: 'Portal Administrator',
          email: 'portaladmin@kiddiesmedia.org',
          agency: 'KMM Training Directorate',
          role: 'portal_admin',
          roleLabel: 'Portal Admin',
          initials: 'PA',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          password_hash: '$2b$10$98fpe23jR5.ghvcK9E.frekjP0sIn0XsRfb1HEg3/MFmR6P6wpuom',
          isAdmin: true,
          isPortalAdmin: true,
          registeredAt: '2026-01-01T00:00:00.000Z',
        })
        localStorage.setItem('kmm_registered_training_users', JSON.stringify(users))
      }
    } catch (seedErr) {
      console.warn('Could not pre-seed portal admin in local cache:', seedErr)
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
    const password = signInPassword

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid official email address.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      // 1. Locate locally cached user if any to supply password_hash for secure bcrypt verification
      let matchedUser: TrainingUser | undefined
      try {
        const storedUsersRaw = localStorage.getItem('kmm_registered_training_users')
        if (storedUsersRaw) {
          const storedUsers: TrainingUser[] = JSON.parse(storedUsersRaw)
          matchedUser = storedUsers.find((u) => u.email.toLowerCase() === email)
        }
      } catch (readErr) {
        console.warn('Could not read registered users store:', readErr)
      }

      // 2. Call backend authentication route
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fallbackUser: matchedUser,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Invalid credentials. Password incorrect.')
      }

      const isUserPortalAdmin = Boolean(
        data.user?.isPortalAdmin ||
        data.user?.role === 'portal_admin' ||
        data.user?.role === 'portal admn' ||
        data.user?.roleLabel?.toLowerCase().includes('portal admin') ||
        data.user?.roleLabel?.toLowerCase().includes('portal admn') ||
        matchedUser?.isPortalAdmin ||
        email === 'portaladmin@kiddiesmedia.org' ||
        email === 'admin@kmmtraining.org'
      )

      const authenticatedUser: TrainingUser = {
        id: data.user?.id || matchedUser?.id || `TP-${Date.now().toString().slice(-6)}`,
        name: data.user?.name || matchedUser?.name || email.split('@')[0],
        email: data.user?.email || email,
        agency: data.user?.agency || matchedUser?.agency || 'Lovetoons Content Operations',
        role: isUserPortalAdmin ? 'portal_admin' : (data.user?.roleLabel || data.user?.role || matchedUser?.role || 'Child Safeguarding Officer'),
        roleLabel: isUserPortalAdmin ? 'Portal Admin' : (data.user?.roleLabel || data.user?.role || matchedUser?.role || 'Child Safeguarding Officer'),
        initials: data.user?.initials || matchedUser?.initials || (isUserPortalAdmin ? 'PA' : 'KM'),
        isAdmin: isUserPortalAdmin || data.user?.role === 'admin' || (data.user?.roleLabel?.toLowerCase().includes('admin')) || matchedUser?.isAdmin || false,
        isPortalAdmin: isUserPortalAdmin,
        registeredAt: data.user?.created_at || matchedUser?.registeredAt || new Date().toISOString(),
      }

      // Save active training session
      if (typeof window !== 'undefined') {
        localStorage.setItem('kmm_training_user', JSON.stringify(authenticatedUser))
        localStorage.setItem('kmm_auth_officer', authenticatedUser.name)
      }

      setSuccessMessage(`Welcome back, ${authenticatedUser.name}! Launching Training Portal...`)
      setTimeout(() => {
        if (isUserPortalAdmin) {
          router.push('/training-portal?tab=admin')
        } else {
          router.push('/training-portal')
        }
      }, 500)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.')
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
    const agency =
      signUpAgency === 'Other Ministry / Department'
        ? customAgency.trim() || 'Ministry Department'
        : signUpAgency.trim() || "Children's Ministry"
    const role = signUpRole.trim() || 'Child Safeguarding Officer'
    const password = signUpPassword
    const isPortalAdmin = role === 'Portal Admin' || role === 'portal_admin' || email.includes('portaladmin')
    const isAdmin = isPortalAdmin || role.toLowerCase().includes('admin') || email.includes('admin')
    const finalRoleKey = isPortalAdmin ? 'portal_admin' : (role.toLowerCase().includes('admin') ? 'agency_admin' : 'reviewer')

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
      // 1. Call backend registration API (hashes password with bcrypt)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, agency, role, password, isAdmin }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Registration failed.')
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
        id: data.user?.id || `TP-${Date.now().toString().slice(-6)}`,
        name,
        email,
        agency,
        role: finalRoleKey,
        roleLabel: role,
        initials,
        isAdmin,
        isPortalAdmin,
        password_hash: data.user?.password_hash,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        registeredAt: new Date().toISOString(),
      }

      // 3. Persist in registered users list with secure password_hash
      try {
        const storedUsersRaw = localStorage.getItem('kmm_registered_training_users')
        const storedUsers: TrainingUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : []
        const withoutOld = storedUsers.filter((u) => u.email.toLowerCase() !== email)
        withoutOld.push(newUser)
        localStorage.setItem('kmm_registered_training_users', JSON.stringify(withoutOld))
      } catch (storeErr) {
        console.warn('Storage write error:', storeErr)
      }

      // 4. Set active authenticated training session
      if (typeof window !== 'undefined') {
        localStorage.setItem('kmm_training_user', JSON.stringify(newUser))
        localStorage.setItem('kmm_auth_officer', newUser.name)
      }

      setSuccessMessage(`Account registered successfully! Welcome to KMM, ${name}!`)
      setTimeout(() => {
        router.push('/training-portal')
      }, 700)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete registration.')
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-300 bg-[#F0FAFD] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100"
      style={{
        fontFamily: 'Figtree, -apple-system, sans-serif',
      }}
    >
      {/* Background ambient radial glows */}
      <div
        className="fixed -top-40 left-1/10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-sky-500/30 dark:bg-amber-500/20 transition-colors"
      />
      <div
        className="fixed -bottom-40 right-1/10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-amber-500/30 dark:bg-sky-500/20 transition-colors"
      />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-2 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base sm:text-lg group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#F97316] text-[#0F172A] flex items-center justify-center text-sm font-black shadow-md group-hover:scale-105 transition-transform">
            ▶
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            KMM Training Portal
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to KMM Home</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="px-3 py-1.5 rounded-full flex items-center gap-1.5 border text-xs font-semibold transition-all cursor-pointer bg-white dark:bg-slate-900/80 border-slate-200 dark:border-white/10 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs"
          >
            {isDark ? (
              <>
                <Sun className="size-3.5 text-amber-400" />
                <span className="hidden xs:inline">Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-slate-600 dark:text-slate-300" />
                <span className="hidden xs:inline">Dark Theme</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main
        className="w-full max-w-lg my-auto p-6 sm:p-9 rounded-3xl relative z-10 border shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-200 bg-white/95 dark:bg-[#131826]/95 border-slate-200/90 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(2,132,199,0.12)] dark:shadow-black/60 text-slate-900 dark:text-slate-100"
      >
        {/* Badge & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-amber-500/15 border border-amber-500/30 text-amber-500">
            Content Safeguarding & Accreditation
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
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'signin'
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
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'signup'
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
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="officer@lovetoons.tv"
                  autoComplete="username"
                  required
                  className="w-full h-11 pl-10 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl border font-medium text-xs transition-all outline-hidden bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
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
          </form>
        ) : (
          /* MODE 2: SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                Full Name / Officer Title
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Pastor Sarah Williams"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@lovetoons.tv or ministry.org"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Ministry / Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <select
                    value={signUpAgency}
                    onChange={(e) => setSignUpAgency(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden appearance-none cursor-pointer bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                  >
                    {MINISTRIES_AND_AGENCIES.map((ag) => (
                      <option key={ag} value={ag} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>
                {signUpAgency === 'Other Ministry / Department' && (
                  <input
                    type="text"
                    value={customAgency}
                    onChange={(e) => setCustomAgency(e.target.value)}
                    placeholder="Enter ministry / department name"
                    required
                    className="w-full h-9 mt-1.5 px-3 rounded-lg border font-medium text-xs transition-all outline-hidden bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Officer Designation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border font-medium text-xs transition-all outline-hidden appearance-none cursor-pointer bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                  >
                    {STANDARD_ROLES.map((role) => (
                      <option key={role} value={role} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-10 pl-10 pr-10 rounded-xl border font-medium text-xs transition-all outline-hidden bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
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
                  <span>Create Account &amp; Begin Accreditation</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation Links */}
        <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-2 text-center">
          <div className="flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
            <Link href="/" className="hover:text-amber-500 transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft className="size-3.5" />
              <span>Back to KMM Home</span>
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
