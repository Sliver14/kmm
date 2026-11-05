'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'kmp_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [theme, setThemeState] = useState<Theme>('light')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [mounted, setMounted] = useState(false)

  const isPublicLightRoute = useCallback((path?: string | null) => {
    const current = path || (typeof window !== 'undefined' ? window.location.pathname : '') || ''
    return current === '' || current === '/' || current.startsWith('/onboarding')
  }, [])

  // Apply theme to document
  const applyTheme = useCallback((targetTheme: Theme) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // Landing page and onboarding must ALWAYS be light theme
    if (isPublicLightRoute(window.location.pathname)) {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
      setResolvedTheme('light')
      return
    }

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = targetTheme === 'dark' || (targetTheme === 'system' && systemDark)

    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
      setResolvedTheme('dark')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
      setResolvedTheme('light')
    }
  }, [isPublicLightRoute])

  // Sync on pathname change or mount
  useEffect(() => {
    try {
      if (isPublicLightRoute(pathname)) {
        setThemeState('light')
        applyTheme('light')
        setMounted(true)
        return
      }

      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      const initialTheme: Theme = stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'dark'
      setThemeState(initialTheme)
      applyTheme(initialTheme)
    } catch {
      applyTheme('light')
    }
    setMounted(true)
  }, [pathname, applyTheme, isPublicLightRoute])

  // Listen to system preference changes if in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isPublicLightRoute(pathname)) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyTheme, pathname, isPublicLightRoute])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // storage unavailable
    }
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
