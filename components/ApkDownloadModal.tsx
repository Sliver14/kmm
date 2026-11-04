'use client'

import React, { useState, useEffect } from 'react'
import { X, Download, User, Mail, CheckCircle2, Smartphone, Loader2, ShieldCheck } from 'lucide-react'

export interface ApkDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  apkUrl?: string
  apkFileName?: string
}

export function ApkDownloadModal({
  isOpen,
  onClose,
  apkUrl = '/APP-APK/LovetoonsTv5.0.apk',
  apkFileName = 'LovetoonsTv5.0.apk',
}: ApkDownloadModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setErrorMessage('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const triggerDownload = (url: string, filename: string) => {
    try {
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.warn('Programmatic download trigger fallback:', e)
      window.location.href = url
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name.trim()) {
      setErrorMessage('Please enter your full name')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Record download lead
      await fetch('/api/apk-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      }).catch((err) => console.warn('Lead logging error:', err))

      // Trigger actual APK download
      triggerDownload(apkUrl, apkFileName)

      setIsSuccess(true)
    } catch (err: any) {
      console.error('Download error:', err)
      // Fallback: still initiate download if form was filled
      triggerDownload(apkUrl, apkFileName)
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-7 relative text-slate-900 dark:text-white transition-all scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close download dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="size-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--kmm-display)' }}>
                Your Download Has Started!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="font-bold text-slate-900 dark:text-white">{name}</span>. The LoveToons Android APK (v5.0) is downloading to your device.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/10 p-3.5 text-left text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>Package:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{apkFileName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>Confirmation Sent To:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => triggerDownload(apkUrl, apkFileName)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition shadow-xs"
              >
                <Download className="size-3.5" />
                <span>Restart Download</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-start gap-3.5 pr-8">
              <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="size-6" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                  LoveToons Android App
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold leading-tight" style={{ fontFamily: 'var(--kmm-display)' }}>
                  Download LoveToons APK
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Please provide your name and email to start the direct APK download (v5.0).
                </p>
              </div>
            </div>

            {/* Spec Pill */}
            <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Official v5.0 Signed Release</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200">
                Android APK
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="size-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pastor David Vance"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="size-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. david.vance@loveworld.org"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                  Used solely to notify you of major version releases and children ministry updates.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Preparing Download...</span>
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    <span>Download APK Now</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
