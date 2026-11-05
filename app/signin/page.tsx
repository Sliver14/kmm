'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLovetoonsData } from '@/lib/store/DataContext'
import { useTheme } from '@/lib/store/ThemeContext'
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Building2,
  Sun,
  Moon,
} from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTab = searchParams?.get('tab') || 'dashboard'
  const returnAsset = searchParams?.get('asset')

  const { isAuthenticated, isInitialized, login } = useLovetoonsData()
  const { resolvedTheme, toggleTheme } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If already authenticated and initialized, redirect to dashboard or return target
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const destination = returnAsset
        ? `/assets?asset=${returnAsset}`
        : (returnTab && returnTab !== 'signin' && returnTab !== 'login')
        ? `/${returnTab}`
        : '/dashboard'
      router.replace(destination)
    }
  }, [isInitialized, isAuthenticated, returnTab, returnAsset, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        const destination = returnAsset
          ? `/assets?asset=${returnAsset}`
          : (returnTab && returnTab !== 'signin' && returnTab !== 'login')
          ? `/${returnTab}`
          : '/dashboard'
        router.replace(destination)
      } else {
        setErrorMessage('Invalid credentials. Please verify your email and password.')
        setIsLoading(false)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please check your credentials.')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F0FAFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Ambient decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[550px] rounded-full bg-sky-400/20 dark:bg-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[550px] rounded-full bg-amber-400/15 dark:bg-slate-800/20 blur-[130px]" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-1 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0284C7] dark:hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10"
        >
          <ArrowLeft className="size-3.5" />
          <span>KMM Website</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/training-portal"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0284C7] dark:hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10"
          >
            <span>Training Portal</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#0284C7] dark:hover:border-white/30 shadow-2xs transition-all cursor-pointer"
          >
            {isMounted && resolvedTheme === 'dark' ? (
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
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto grid lg:grid-cols-12 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(2,132,199,0.12),0_10px_30px_-10px_rgba(15,23,42,0.08)] dark:shadow-2xl overflow-hidden transition-all duration-300">
        {/* Left Brand Panel */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br from-[#EBF6FB] via-[#F3F9FC] to-[#E2F3F9] dark:from-[#0c182f] dark:via-[#102242] dark:to-[#0c1931] border-b lg:border-b-0 lg:border-r border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-300">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative group size-11 shrink-0 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 shadow-md shadow-amber-500/20">
                <video
                  src="/kmm-welcome-animation.mp4"
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="size-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  Kiddies Media
                </div>
                <div className="text-[11px] font-bold text-[#0284C7] dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  Ministries
                </div>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-[#0284C7] dark:text-slate-300 border border-sky-200/80 dark:border-slate-700/60 shadow-2xs">
              <ShieldCheck className="size-3.5 text-[#0284C7] dark:text-blue-400" />
              <span>Asset &amp; Governance Platform</span>
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Intellectual Asset <br />
              <span className="text-[#0284C7] dark:text-slate-400 font-normal">Governance System</span>
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
              Unified registry for intellectual property, broadcast rights, and operational oversight across Loveworld Nation.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>125+ Registered Ministry Assets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Worldwide Rights &amp; Clearance Governance</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-[#0284C7] dark:text-blue-400 shrink-0" />
                <span>Multi-Agency Operational Oversight</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">
              Office of the Executive Minister
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Submitted to the Office of the Attorney-General
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-white dark:bg-[#14161f] flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sign In</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter your credentials to access the platform.
                </p>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-sky-50 dark:bg-white/5 text-[#0284C7] dark:text-slate-300 border border-sky-100 dark:border-white/10 shadow-2xs">
                <LogIn className="size-5" />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@kiddiesmedia.org"
                    className="h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#1c202c] pl-10 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0284C7] focus:bg-white dark:focus:bg-[#1c202c] focus:ring-2 focus:ring-[#0284C7]/20 transition shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#1c202c] pl-10 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0284C7] focus:bg-white dark:focus:bg-[#1c202c] focus:ring-2 focus:ring-[#0284C7]/20 transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-white/20 text-[#0284C7] focus:ring-[#0284C7] size-3.5"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">KMM Cloud Auth</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0284C7] hover:bg-[#0274ae] active:bg-[#0369a1] py-3 px-4 text-xs font-bold text-white shadow-md shadow-sky-500/25 active:scale-98 transition disabled:opacity-70 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Shortcuts */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between text-[11px] mb-2 text-slate-500 dark:text-slate-400 font-medium">
                <span>Quick Demo Access:</span>
                <span className="text-[10px] text-slate-400">(Click to auto-fill)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@lovetoons.tv')
                    setPassword('admin123')
                    setErrorMessage(null)
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-50 dark:bg-white/5 hover:bg-sky-100 dark:hover:bg-white/10 text-[#0284C7] dark:text-sky-300 border border-sky-200/60 dark:border-white/10 transition cursor-pointer"
                >
                  Super Admin (admin@lovetoons.tv)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('officer@lovetoons.tv')
                    setPassword('admin123')
                    setErrorMessage(null)
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition cursor-pointer"
                >
                  Lovetoons Officer
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-5">
              <div className="flex items-start gap-2.5 rounded-xl bg-sky-50/60 dark:bg-white/5 p-3.5 border border-sky-100 dark:border-white/5 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="size-4 text-[#0284C7] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Authorized Personnel Only</span>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                    Access to this intellectual property registry is strictly restricted to verified ministry staff and designated agency administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Kiddies Media Ministry</span>
            <span>Intellectual Asset Portal</span>
          </div>
        </div>
      </div>

      {/* Subtle bottom footer spacer */}
      <div className="relative z-20 text-center py-2 text-[11px] text-slate-400">
        Loveworld Nation &bull; Kiddies Media Ministry Intellectual Asset Management System
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0FAFD] dark:bg-slate-950 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 text-sm">
          Loading Sign In...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
