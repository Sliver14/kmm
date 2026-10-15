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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTab = searchParams?.get('tab') || 'dashboard'
  const returnAsset = searchParams?.get('asset')

  const { isAuthenticated, isInitialized, login, availableUsers } = useLovetoonsData()

  const [email, setEmail] = useState('sylver@lovetoons.org')
  const [password, setPassword] = useState('lovetoons2025')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your ministry email address.')
      return
    }

    setIsLoading(true)

    // Simulate authenticating for realistic polished feel
    setTimeout(() => {
      const success = login(email, password)
      if (success) {
        const destination = returnAsset ? `/assets?asset=${returnAsset}` : `/${returnTab}`
        router.replace(destination)
      } else {
        setErrorMessage('User profile not found. Please select one of the available demo accounts.')
        setIsLoading(false)
      }
    }, 450)
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#021124] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[550px] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[550px] rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Left Brand Panel */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br from-[#041a38] via-[#03152c] to-[#020d1c] border-b lg:border-b-0 lg:border-r border-white/10 text-white">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/lovetoons-logo.png"
                alt="Lovetoons"
                className="h-10 w-auto object-contain drop-shadow-md brightness-110"
              />
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/30">
              <Sparkles className="size-3 text-yellow-300" />
              <span>Kiddies Media Ministry</span>
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Intellectual Asset <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                Management Hub
              </span>
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-slate-300 font-medium">
              Centralized platform for master media archival, intellectual property classification, copyright governance, and multi-tier approval workflows.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full governance clearance & territorial rights tracking</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="size-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Dynamic category metadata & relation taxonomy</span>
            </div>

            <div className="pt-3 text-[11px] italic text-slate-400">
              &ldquo;Building Godly Content for a Brighter Generation&rdquo;
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#09245a]">Sign In to Platform</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter your credentials or choose a quick demo role profile below.
                </p>
              </div>
              <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ministry Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@lovetoons.org"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                    Default: lovetoons2025
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
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-3.5"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400">Lovetoons IAM v2.0</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 active:scale-98 transition disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Sign In to IAM Platform</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo One-Click Access */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Quick Demo Profile Sign In
                </span>
                <span className="text-[10px] text-slate-400">1-Click Role Switch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableUsers.slice(0, 4).map((user) => {
                  const isSelected = selectedDemoUser === user.id
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(user.id)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl border p-2 text-left transition',
                        isSelected
                          ? 'border-blue-400 bg-blue-50/70 ring-1 ring-blue-400/40'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                      )}
                    >
                      <div
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-white shadow-2xs',
                          user.role === 'super_admin'
                            ? 'bg-purple-600'
                            : user.role === 'reviewer'
                            ? 'bg-emerald-600'
                            : 'bg-blue-600'
                        )}
                      >
                        {user.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-slate-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-blue-700 font-semibold truncate">
                          {user.roleLabel}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>© 2025–2035 Lovetoons Media Ltd</span>
            <span>All Rights Reserved Worldwide</span>
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
        <div className="min-h-screen bg-[#021124] flex items-center justify-center font-bold text-blue-200">
          Loading Sign In...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
