'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useTheme, Theme } from '@/lib/store/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'button' | 'segmented' | 'icon'
  showLabel?: boolean
}

export function ThemeToggle({
  className,
  variant = 'button',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          'size-8.5 rounded-lg border border-slate-200 bg-white/50 animate-pulse',
          className
        )}
      />
    )
  }

  // 1. Segmented control (e.g. for Settings page)
  if (variant === 'segmented') {
    const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
      { value: 'light', label: 'Light', icon: <Sun className="size-3.5" /> },
      { value: 'dark', label: 'Dark', icon: <Moon className="size-3.5" /> },
      { value: 'system', label: 'System', icon: <Laptop className="size-3.5" /> },
    ]

    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-xl p-1 border border-slate-200 bg-slate-100/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-2xs',
          className
        )}
        role="group"
        aria-label="Theme selector"
      >
        {options.map((opt) => {
          const isActive = theme === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer',
                isActive
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  // 2. Default Header / Icon Toggle Button
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="global-theme-toggle-btn"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'group relative flex items-center justify-center rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40',
        variant === 'icon' || !showLabel ? 'size-8.5' : 'h-8.5 px-2.5 gap-2',
        isDark
          ? 'border-slate-700 bg-slate-800/90 text-amber-300 hover:bg-slate-700 hover:text-amber-200 shadow-xs'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs',
        className
      )}
    >
      <div className="relative size-4 flex items-center justify-center overflow-hidden">
        <Sun
          className={cn(
            'size-4 transition-all duration-300 transform',
            isDark
              ? 'rotate-90 scale-0 opacity-0 absolute'
              : 'rotate-0 scale-100 opacity-100 text-amber-500'
          )}
        />
        <Moon
          className={cn(
            'size-4 transition-all duration-300 transform',
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-blue-400'
              : '-rotate-90 scale-0 opacity-0 absolute text-slate-400'
          )}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  )
}
