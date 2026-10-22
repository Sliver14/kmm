'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLovetoonsData } from '@/lib/store/DataContext'
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTab = searchParams?.get('tab') || 'dashboard'
  const returnAsset = searchParams?.get('asset')

  const { isAuthenticated, isInitialized, login, availableUsers } = useLovetoonsData()

  const [email, setEmail] = useState('sylver@kiddiesmedia.org')
  const [password, setPassword] = useState('kmm2025')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>('usr-1')

  // If already authenticated and initialized, redirect to dashboard or return target
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const destination = returnAsset ? `/assets?asset=${returnAsset}` : `/${returnTab}`
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

    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        const destination = returnAsset ? `/assets?asset=${returnAsset}` : `/${returnTab}`
        router.replace(destination)
      } else {
        setErrorMessage('Invalid credentials. Please verify your email and password, or select a role below.')
        setIsLoading(false)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please check your credentials.')
      setIsLoading(false)
    }
  }

  const handleQuickDemoLogin = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId)
    if (!user) return
    setSelectedDemoUser(userId)
    setEmail(user.email)
    setIsLoading(true)
    setErrorMessage(null)

    setTimeout(() => {
      login(user)
      const destination = returnAsset ? `/assets?asset=${returnAsset}` : `/${returnTab}`
      router.replace(destination)
    }, 350)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[550px] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[550px] rounded-full bg-slate-800/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-12 rounded-3xl border border-slate-800/80 bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Left Brand Panel */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 text-white">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/kmm-logo.png"
                alt="Kiddies Media Ministries"
                className="size-10 object-contain drop-shadow-md"
              />
              <div>
                <div className="text-lg font-bold text-white tracking-tight leading-none">
                  Kiddies Media
                </div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                  Ministries
                </div>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-300 border border-slate-700/60">
              <ShieldCheck className="size-3.5 text-blue-400" />
              <span>Asset & Governance Platform</span>
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
              Intellectual Asset <br />
              <span className="text-slate-400 font-normal">Governance System</span>
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-slate-300 font-normal">
              Unified registry for intellectual property, broadcast rights, and operational oversight across Loveworld Nation.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>125 Registered Ministry Assets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>Worldwide Rights & Clearance Governance</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-blue-400 shrink-0" />
                <span>Multi-Agency Operational Oversight</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-300 font-medium">
              Office of the Executive Minister
            </div>
            <div className="text-[10px] text-slate-500">
              Submitted to the Office of the Attorney-General
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">Sign In</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter your credentials or choose a role below.
                </p>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                <LogIn className="size-5" />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
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
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Default: kmm2025
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 size-3.5"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400">KMM Platform</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo One-Click Access Across Agencies */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-700">
                  Quick Access
                </span>
                <span className="text-[11px] text-slate-400">Select role to review</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {availableUsers.map((user) => {
                  const isSelected = selectedDemoUser === user.id
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(user.id)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg border p-2 text-left transition cursor-pointer',
                        isSelected
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 shadow-2xs'
                      )}
                    >
                      <div
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-md text-xs font-semibold text-white shadow-2xs',
                          user.role === 'super_admin'
                            ? 'bg-purple-600'
                            : user.role === 'reviewer'
                              ? 'bg-emerald-600'
                              : 'bg-slate-900'
                        )}
                      >
                        {user.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-900 truncate">
                            {user.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium truncate">
                          {user.roleLabel}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">
                          {user.agency}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Kiddies Media Ministries</span>
            <span>Intellectual Asset Portal</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center font-semibold text-slate-400 text-sm">
          Loading Sign In...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
