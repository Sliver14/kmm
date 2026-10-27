'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ConfirmActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'primary' | 'danger' | 'warning' | 'success'
  badge?: string
  details?: React.ReactNode
  isLoading?: boolean
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'primary',
  badge = 'Audit Trail Logged',
  details,
  isLoading = false,
}: ConfirmActionModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="size-5 text-[#ff5c75]" />,
          iconBg: 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/40',
          confirmBtn: 'bg-[#ff5c75] hover:bg-[#e04860] text-white shadow-rose-500/25',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50',
        }
      case 'warning':
        return {
          icon: <ShieldAlert className="size-5 text-amber-500" />,
          iconBg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/40',
          confirmBtn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50',
        }
      case 'success':
        return {
          icon: <CheckCircle2 className="size-5 text-emerald-500" />,
          iconBg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/40',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50',
        }
      case 'primary':
      default:
        return {
          icon: <Info className="size-5 text-[#2f80ed]" />,
          iconBg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/40',
          confirmBtn: 'bg-[#2f80ed] hover:bg-[#256fd1] text-white shadow-blue-500/25',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/50',
        }
    }
  }

  const vStyles = getVariantStyles()

  return (
    <div
      onClick={!isLoading ? onClose : undefined}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-[#1c202c] p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 cursor-default space-y-4"
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-3.5">
          <div className={cn('grid size-10 shrink-0 place-items-center rounded-2xl border shadow-xs', vStyles.iconBg)}>
            {vStyles.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight truncate">{title}</h3>
              {badge && (
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold border shrink-0', vStyles.badgeBg)}>
                  {badge}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{description}</div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition -mr-1 -mt-1 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer disabled:opacity-40"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Optional Context Details Box */}
        {details && (
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 dark:border-white/10 dark:bg-[#171a24] p-3 text-xs text-slate-700 dark:text-slate-200 space-y-1">
            {details}
          </div>
        )}

        {/* Audit Compliance Notice */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-100/70 dark:bg-[#171a24] px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium border border-slate-200/50 dark:border-white/10">
          <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span>Permanently recorded in the KMM Intellectual Property Audit Trail</span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-[#1c202c] px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition cursor-pointer disabled:opacity-50 text-center justify-center"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              'rounded-full px-5 py-2.5 sm:py-2 text-xs font-bold shadow-md transition active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5',
              vStyles.confirmBtn
            )}
          >
            {isLoading && <span className="size-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            <span>{isLoading ? 'Processing...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
