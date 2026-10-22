'use client'

import React, { useMemo, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Activity, AlertCircle, Bell, BookOpen, Boxes, Check, ChevronDown, ChevronRight,
  ChevronLeft, CircleHelp, ClipboardCheck, Clock3, FileBarChart, FileText, Filter,
  FolderKanban, Grid2X2, Home, Link2, Menu, MoreHorizontal, Plus, Search, Settings,
  ShieldCheck, Sparkles, Tags, Users, X, Zap, Palette, Globe2, CalendarDays, Database,
  LockKeyhole, Headphones, Pencil, Download, Save, Lightbulb, UserRoundCog, SlidersHorizontal,
  List, Trash2, Eye, ExternalLink, Share2, UploadCloud, CheckCircle2, AlertTriangle, Layers,
  Music, Film, Video, ShoppingBag, Radio, Sparkle, Tag, GraduationCap, Gamepad2, Heart,
  Tv, FolderPlus, ArrowUpDown, ArrowDownUp, Move, Star, CheckCircle, Play, Pause,
  Calendar, Clock, User, Folder, PlayCircle, FileCode, RotateCcw, FileCheck, Files, Copy,
  Shield, Lock, ShieldAlert, CheckSquare, MessageSquare, Send, ArrowRight, ShieldQuestion,
  UserCheck, Sliders, RefreshCw, FileUp, FolderArchive, LogOut, PanelLeftClose, PanelLeftOpen,
  CheckCheck, ScrollText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLovetoonsData } from '@/lib/store/DataContext'
import { AssetVisualPreview } from '@/components/AssetVisualPreview'
import { AssetArchiveHub } from '@/components/AssetArchiveHub'
import { ApprovalsWorkflow } from '@/components/ApprovalsWorkflow'
import { AssetDetailsView } from '@/components/AssetDetailsView'
import { ConfirmActionModal } from '@/components/ConfirmActionModal'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getAssetRiskAssessment, getPortfolioRiskMetrics, PortfolioRiskMetrics } from '@/lib/risk'
import {
  getCategoryComplianceProfile,
  evaluateComplianceReadiness,
  isGatePassed,
  getGateStatus,
  getGateCheckValue,
  GovernanceGateDefinition,
  RequiredDocumentDefinition,
  CategoryCluster,
} from '@/lib/compliance'
import {
  AssetData,
  AssetDynamicAttributes,
  CategoryItem,
  SubcategoryItem,
  RightsRecord,
  RightsDocument,
  RelationshipItem,
  ApprovalRequest,
  Agency,
  OperationalUnit,
  AssetContributor,
  UserSkill,
  UserProfile,
  AssetThumbType,
  AssetStatus,
  RiskTier,
  AssetRiskAssessment,
  GovernanceGateStatus,
  GovernanceCheckValue,
  GovernanceChecksMap,
} from '@/types'

export const tabToPath: Record<string, string> = {
  'Dashboard': '/dashboard',
  'Assets': '/assets',
  'Relationships': '/relationships',
  'Rights & Governance': '/rights',
  'Approvals': '/approvals',
  'Audit Trail': '/audit',
  'Reports': '/reports',
  'Settings': '/settings',
}

export const pathToTab: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/assets': 'Assets',
  '/categories': 'Settings',
  '/categories-and-subcategories': 'Settings',
  '/relationships': 'Relationships',
  '/rights': 'Rights & Governance',
  '/rights-and-governance': 'Rights & Governance',
  '/approvals': 'Approvals',
  '/audit': 'Audit Trail',
  '/audit-trail': 'Audit Trail',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export const queryToTab: Record<string, string> = {
  'dashboard': 'Dashboard',
  'assets': 'Assets',
  'categories': 'Settings',
  'categories-and-subcategories': 'Settings',
  'relationships': 'Relationships',
  'rights': 'Rights & Governance',
  'rights-and-governance': 'Rights & Governance',
  'approvals': 'Approvals',
  'audit': 'Audit Trail',
  'audit-trail': 'Audit Trail',
  'reports': 'Reports',
  'settings': 'Settings',
}

const nav = [
  ['Dashboard', Home],
  ['Assets', Boxes],
  ['Relationships', Link2],
  ['Rights & Governance', ShieldCheck],
  ['Approvals', ClipboardCheck],
  ['Audit Trail', ScrollText],
  ['Reports', FileBarChart],
  ['Settings', Settings],
] as const

export const agencies: Agency[] = [
  'Lovetoons',
  'Publishing Agency',
  'Digital Agency',
  'Academy Agency',
  'Educational Agency',
]

// Backward-compatibility
export const operationalUnits = agencies

const skillOptions: { value: UserSkill; label: string }[] = [
  { value: 'animation', label: 'Animation Artist / Rigger' },
  { value: 'video_editor', label: 'Video Editor & Compositor' },
  { value: 'audio_producer', label: 'Audio Producer / Sound Engineer' },
  { value: 'writer', label: 'Scriptwriter & Author' },
  { value: 'designer', label: 'Graphic / Brand Designer' },
  { value: 'developer', label: 'Software Developer' },
  { value: 'legal_counsel', label: 'Legal & Rights Counsel' },
  { value: 'admin', label: 'Ministry Administrator' },
]

function Logo({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center py-1 group/logo" title="Kiddies Media Ministries">
        <div className="relative">
          <img
            src="/kmm-logo.png"
            alt="Kiddies Media Ministries"
            className="size-8 object-contain transition-transform group-hover/logo:scale-105"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2.5 px-2 py-1 w-full text-left">
      <div className="relative shrink-0">
        <img
          src="/kmm-logo.png"
          alt="Kiddies Media Ministries"
          className="size-8 object-contain drop-shadow-sm"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-slate-900 tracking-tight leading-tight truncate">
          Kiddies Media Ministries
        </div>
        <div className="text-[10px] font-medium text-slate-500 leading-tight truncate flex items-center gap-1.5 mt-0.5">
          <span>Portal</span>
          <span className="size-1 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  )
}

function Sidebar({
  active,
  setActive,
  open,
  setOpen,
  isCollapsed = false,
  setIsCollapsed,
}: {
  active: string
  setActive: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
  isCollapsed?: boolean
  setIsCollapsed?: (v: boolean | ((prev: boolean) => boolean)) => void
}) {
  const { stats, currentUser, logout } = useLovetoonsData()

  const visibleNav = useMemo(() => {
    const isSuperAdmin = currentUser.role === 'super_admin'
    const isAgencyAdmin = currentUser.role === 'agency_admin' || (currentUser.role as any) === 'unit_admin'

    return nav.filter(([label]) => {
      // Approvals portal is strictly for Super Admin and Content Reviewers
      if (label === 'Approvals' && isAgencyAdmin) {
        return false
      }
      // System security audit log is restricted to Super Admin
      if (label === 'Audit Trail' && !isSuperAdmin) {
        return false
      }
      // Executive portfolio risk reports is restricted to Super Admin and Reviewers
      if (label === 'Reports' && isAgencyAdmin) {
        return false
      }
      // Ministry taxonomy configuration is restricted to Super Admin
      if (label === 'Settings' && !isSuperAdmin) {
        return false
      }
      return true
    })
  }, [currentUser.role])

  // Categorize nav for clean section headers
  const coreNavLabels = ['Dashboard', 'Assets', 'Relationships', 'Approvals']

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-50 text-slate-700 transition-all duration-300 ease-in-out border-r border-slate-200 shadow-xs',
        isCollapsed ? 'w-[76px]' : 'w-[248px]',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-4 relative shrink-0">
        <Logo collapsed={isCollapsed} />
      </div>

      {/* Quick Search Shortcut Bar */}
      {isCollapsed ? (
        <div className="flex justify-center px-2 pt-2.5 pb-1">
          <button
            type="button"
            onClick={() => {
              const headerSearch = (document.getElementById('header-global-search-input') || document.querySelector('header input')) as HTMLInputElement
              if (headerSearch) {
                headerSearch.focus()
                headerSearch.select()
              }
            }}
            className="group relative flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-2xs transition cursor-pointer"
            title="Search platform"
            aria-label="Search platform "
          >
            <Search className="size-4 text-slate-500 group-hover:text-slate-800 transition" />
            <span className="pointer-events-none absolute left-full ml-2 hidden group-hover:flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-md z-50 whitespace-nowrap">
              <span>Search</span>
            </span>
          </button>
        </div>
      ) : (
        <div className="px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={() => {
              const headerSearch = (document.getElementById('header-global-search-input') || document.querySelector('header input')) as HTMLInputElement
              if (headerSearch) {
                headerSearch.focus()
                headerSearch.select()
              }
            }}
            className="w-full flex items-center justify-between rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100/60 shadow-2xs transition cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="size-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] font-medium truncate">Search platform...</span>
            </div>
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex flex-1 flex-col px-3 py-3 overflow-y-auto overflow-x-hidden space-y-1">
        {!isCollapsed && (
          <div className="px-2 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspaces
          </div>
        )}

        {visibleNav
          .filter(([label]) => coreNavLabels.includes(label))
          .map(([label, Icon]) => {
            const isActive = active === label
            return (
              <button
                key={label}
                onClick={() => {
                  setActive(label)
                  setOpen(false)
                }}
                className={cn(
                  'group relative flex items-center rounded-lg font-medium transition-all duration-150 cursor-pointer w-full',
                  isCollapsed ? 'justify-center p-2.5 text-xs' : 'gap-2.5 px-3 py-2 text-left text-xs',
                  isActive
                    ? 'bg-white text-slate-900 font-semibold border border-slate-200/90 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                )}
              >
                {isActive && !isCollapsed && (
                  <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-slate-900" />
                )}
                <Icon className={cn('size-4 shrink-0', isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600')} strokeWidth={isActive ? 2.2 : 1.8} />
                {!isCollapsed && <span className="flex-1 truncate text-xs">{label}</span>}
                {!isCollapsed && label === 'Approvals' && stats.pendingApprovalsCount > 0 && (
                  <span className="rounded-md bg-rose-500 text-[10px] font-bold text-white px-1.5 py-0.2 shadow-2xs">
                    {stats.pendingApprovalsCount}
                  </span>
                )}

                {/* Collapsed floating indicator dot */}
                {isCollapsed && label === 'Approvals' && stats.pendingApprovalsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-slate-50" />
                )}

                {/* Tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl border border-slate-800 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto lg:block z-50">
                    {label}
                    {label === 'Approvals' && stats.pendingApprovalsCount > 0 && ` (${stats.pendingApprovalsCount})`}
                  </div>
                )}
              </button>
            )
          })}

        {!isCollapsed && (
          <div className="px-2 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Governance & Audit
          </div>
        )}

        {visibleNav
          .filter(([label]) => !coreNavLabels.includes(label))
          .map(([label, Icon]) => {
            const isActive = active === label
            return (
              <button
                key={label}
                onClick={() => {
                  setActive(label)
                  setOpen(false)
                }}
                className={cn(
                  'group relative flex items-center rounded-lg font-medium transition-all duration-150 cursor-pointer w-full',
                  isCollapsed ? 'justify-center p-2.5 text-xs' : 'gap-2.5 px-3 py-2 text-left text-xs',
                  isActive
                    ? 'bg-white text-slate-900 font-semibold border border-slate-200/90 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                )}
              >
                {isActive && !isCollapsed && (
                  <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-slate-900" />
                )}
                <Icon className={cn('size-4 shrink-0', isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600')} strokeWidth={isActive ? 2.2 : 1.8} />
                {!isCollapsed && <span className="flex-1 truncate text-xs">{label}</span>}

                {/* Tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl border border-slate-800 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto lg:block z-50">
                    {label}
                  </div>
                )}
              </button>
            )
          })}
      </nav>

      {/* Current User Profile Card */}
      <div className={cn(
        'mx-2.5 mb-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs transition-all',
        isCollapsed ? 'p-2 flex flex-col items-center gap-1.5' : 'p-3'
      )}>
        <div className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center')}>
          <div className="relative group/user">
            <div className="grid size-7.5 place-items-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white shadow-xs">
              {currentUser.initials}
            </div>
            {isCollapsed && (
              <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-slate-900 p-2.5 text-xs text-white shadow-2xl border border-slate-800 opacity-0 group-hover/user:opacity-100 lg:block z-50">
                <div className="font-semibold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-slate-300">{currentUser.roleLabel}</div>
                <div className="text-[9px] text-slate-400">{currentUser.agency || currentUser.unit}</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate text-slate-900 text-xs leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{currentUser.roleLabel}</div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 truncate">
            {currentUser.agency || currentUser.unit}
          </div>
        )}

        <button
          onClick={logout}
          title="Sign out of platform"
          className={cn(
            'flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer',
            isCollapsed ? 'size-7 mt-1' : 'w-full mt-2 gap-1.5 py-1 text-[11px] font-medium'
          )}
        >
          <LogOut className="size-3" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Footer Bottom Bar */}
      {!isCollapsed ? (
        <div className="px-3.5 pb-3 text-[11px] text-slate-400 border-t border-slate-200 pt-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400">KMM Platform • v2.1</span>
            <div className="flex items-center gap-1">
              <ThemeToggle variant="icon" className="size-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-none bg-transparent shadow-none" />
              {setIsCollapsed && (
                <button
                  onClick={() => setIsCollapsed(true)}
                  title="Collapse sidebar (Ctrl+[)"
                  className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                >
                  <PanelLeftClose className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col items-center gap-2 p-2.5 border-t border-slate-200">
          <ThemeToggle variant="icon" className="size-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-none bg-transparent shadow-none" />
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar (Ctrl+[)"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <PanelLeftOpen className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </aside>
  )
}

function NotificationModal({
  isOpen,
  onClose,
  setActiveNav,
}: {
  isOpen: boolean
  onClose: () => void
  setActiveNav?: (v: string, assetId?: string | null) => void
}) {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleNotificationRead,
    dismissNotification,
    clearAllNotifications,
    stats,
    currentUser,
  } = useLovetoonsData()

  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'approvals' | 'governance' | 'activities'>('all')

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (notificationFilter === 'unread') return !item.read
      if (notificationFilter === 'approvals') return item.type === 'approval'
      if (notificationFilter === 'governance') return item.type === 'governance' || item.type === 'document'
      if (notificationFilter === 'activities') return item.type === 'activity' || item.type === 'asset'
      return true
    })
  }, [notifications, notificationFilter])

  const handleNotificationClick = (targetTab: string, assetId?: string, notifId?: string) => {
    if (notifId) {
      markNotificationAsRead(notifId)
    }
    onClose()
    if (setActiveNav) {
      setActiveNav(targetTab, assetId || null)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:w-[480px] md:w-[520px] h-full border-l border-slate-200 bg-white shadow-2xl flex flex-col cursor-default animate-in slide-in-from-right duration-300 ease-out overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-10 rounded-xl bg-slate-900 text-white shadow-xs grid place-items-center shrink-0">
              <Bell className="size-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-3 bg-rose-500 ring-2 ring-white"></span>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                  Notifications & Alerts
                </h3>
                {unreadNotificationsCount > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                    <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {unreadNotificationsCount} Unread
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <Check className="size-2.5" />
                    All Caught Up
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Live governance clearances, approvals & activity stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="size-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="size-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="relative z-10 flex items-center gap-1.5 border-b border-slate-200 bg-slate-50/70 p-2.5 sm:px-4 text-xs overflow-x-auto no-scrollbar shrink-0">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadNotificationsCount },
            { key: 'approvals', label: 'Approvals', count: notifications.filter((n) => n.type === 'approval').length },
            { key: 'governance', label: 'Governance & Docs', count: notifications.filter((n) => n.type === 'governance' || n.type === 'document').length },
            { key: 'activities', label: 'Activities', count: notifications.filter((n) => n.type === 'activity' || n.type === 'asset').length },
          ].map((tab) => {
            const isActive = notificationFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setNotificationFilter(tab.key as any)}
                className={cn(
                  'relative rounded-lg px-3 py-1.5 font-medium transition-all flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs hover:bg-slate-50'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-semibold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Notifications List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-slate-50/40 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-6">
              <div className="size-12 mx-auto rounded-xl bg-white border border-slate-200 grid place-items-center text-slate-500 shadow-xs">
                <CheckCircle2 className="size-6 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900 text-sm">All caught up!</h4>
                <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  {notificationFilter === 'unread'
                    ? 'You have zero unread notifications. Great work keeping on top of approvals!'
                    : 'No notifications in this filter view.'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isRead = item.read

              return (
                <div
                  key={item.id}
                  className={cn(
                    'group relative rounded-xl p-3.5 sm:p-4 transition-all duration-150 border text-xs',
                    isRead
                      ? 'bg-white/80 hover:bg-white border-slate-200/70 opacity-75 hover:opacity-100 shadow-2xs hover:shadow-xs'
                      : 'bg-white border-slate-300 shadow-xs hover:border-slate-400'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Category Icon Badge */}
                    <div
                      className={cn(
                        'size-9 rounded-lg grid place-items-center text-white shrink-0 shadow-2xs',
                        item.type === 'approval'
                          ? 'bg-amber-600'
                          : item.type === 'governance'
                            ? 'bg-emerald-600'
                            : item.type === 'document'
                              ? 'bg-slate-900'
                              : item.type === 'asset'
                                ? 'bg-indigo-600'
                                : 'bg-slate-700'
                      )}
                    >
                      {item.type === 'approval' ? (
                        <ClipboardCheck className="size-4" />
                      ) : item.type === 'governance' ? (
                        <ShieldCheck className="size-4" />
                      ) : item.type === 'document' ? (
                        <FileCheck className="size-4" />
                      ) : item.type === 'asset' ? (
                        <FolderPlus className="size-4" />
                      ) : (
                        <Activity className="size-4" />
                      )}
                    </div>

                    {/* Notification Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-1">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                          {item.badge && (
                            <span
                              className={cn(
                                'rounded-md px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider border border-slate-200/80',
                                item.badgeColor || 'bg-slate-100 text-slate-700'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                          {!isRead && (
                            <span className="relative flex size-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full size-2 bg-blue-600 ring-2 ring-white"></span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        {item.subtitle}
                      </p>

                      {/* Bottom metadata & Action */}
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                          <Clock className="size-3 text-slate-400" />
                          <span>{item.time}</span>
                          {item.agency && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-slate-600">{item.agency}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Toggle Read */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleNotificationRead(item.id)
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title={isRead ? 'Mark as unread' : 'Mark as read'}
                            aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
                          >
                            {isRead ? <Eye className="size-3.5" /> : <Check className="size-3.5 text-slate-700" />}
                          </button>

                          {/* Dismiss */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissNotification(item.id)
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Dismiss notification"
                            aria-label="Dismiss notification"
                          >
                            <Trash2 className="size-3.5" />
                          </button>

                          {/* Open Target */}
                          <button
                            onClick={() => handleNotificationClick(item.targetTab, item.assetId, item.id)}
                            className="font-medium text-xs text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors cursor-pointer ml-1"
                          >
                            <span>Open in {item.targetTab}</span>
                            <ArrowRight className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="relative z-10 border-t border-slate-200 px-5 py-3.5 bg-white flex items-center justify-between gap-3 shrink-0">
          {(currentUser.role === 'super_admin' || currentUser.role === 'reviewer') ? (
            <button
              onClick={() => {
                onClose()
                if (setActiveNav) setActiveNav('Approvals')
              }}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 transition-colors cursor-pointer"
            >
              <ClipboardCheck className="size-4 text-slate-600" />
              <span>Approvals Portal ({stats.pendingApprovalsCount})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose()
                if (setActiveNav) setActiveNav('Assets')
              }}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 transition-colors cursor-pointer"
            >
              <Boxes className="size-4 text-slate-600" />
              <span>Assets Catalog</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 font-medium text-white text-xs shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Header({
  setOpen,
  activeTab = 'Dashboard',
  setActiveNav,
  onOpenNotifications,
  isNotificationModalOpen = false,
  unreadCount = 0,
  isCollapsed = false,
  setIsCollapsed,
}: {
  setOpen: (v: boolean) => void
  activeTab?: string
  setActiveNav?: (v: string, assetId?: string | null) => void
  onOpenNotifications?: () => void
  isNotificationModalOpen?: boolean
  unreadCount?: number
  isCollapsed?: boolean
  setIsCollapsed?: (v: boolean | ((prev: boolean) => boolean)) => void
}) {
  const { currentUser, logout } = useLovetoonsData()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md transition-all lg:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
      <button className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer" onClick={() => setOpen(true)} aria-label="Open sidebar menu">
        <Menu className="size-5 text-slate-800" />
      </button>

      {/* Desktop Sidebar Toggle in Header */}
      {setIsCollapsed && (
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden lg:flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          title={isCollapsed ? 'Expand sidebar (Ctrl+[)' : 'Collapse sidebar (Ctrl+[)'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
        </button>
      )}

      {/* Breadcrumb Navigation Trail (AgentOps Inspiration) */}
      <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium select-none">
        <span
          className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
          onClick={() => setActiveNav && setActiveNav('Dashboard')}
        >
          KMM Platform
        </span>
        <span className="text-slate-300 font-normal">›</span>
        <span className="text-slate-900 font-semibold">{activeTab}</span>
      </nav>

      {/* Mobile Branding */}
      <div className="flex items-center gap-2 lg:hidden">
        <img src="/kmm-logo.png" alt="Kiddies Media Ministries" className="size-6 object-contain" />
        <span className="text-xs font-bold text-slate-900 tracking-tight">KMM</span>
      </div>

      {/* Search Input with Clean Subtle Styling & ⌘K badge */}
      <div className="relative max-w-sm sm:max-w-md flex-1 ml-1 sm:ml-3">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-3.5 text-slate-400 pointer-events-none" />
          <input
            id="header-global-search-input"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-8 pr-12 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100 transition"
            placeholder="Search intellectual assets, titles, or rights..."
          />
          {searchFilter ? (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2 grid size-5 place-items-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="size-3" />
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Modal Trigger */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className={cn(
              'grid size-8.5 place-items-center rounded-lg transition border cursor-pointer',
              isNotificationModalOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
            )}
            aria-label="Notifications"
            id="notification-bell-btn"
          >
            <Bell className="size-3.5" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-4 px-1 h-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </div>

        {/* LOGGED IN USER PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Current user profile"
          >
            <div className={cn(
              'grid size-6.5 place-items-center rounded-md text-[10px] font-bold text-white shadow-xs',
              currentUser.role === 'super_admin' ? 'bg-purple-600' : currentUser.role === 'reviewer' ? 'bg-emerald-600' : 'bg-blue-600'
            )}>
              {currentUser.initials}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold leading-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="truncate max-w-[120px]">{currentUser.name}</span>
                <span className="rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-1.5 py-0.2 text-[9px] font-medium text-slate-600 dark:text-slate-300">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'reviewer' ? 'Reviewer' : 'Agency Rep'}
                </span>
              </div>
            </div>
            <ChevronDown className="size-3 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-40 w-72 sm:w-80 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 p-4 shadow-xl dark:shadow-2xl animate-in fade-in">
              {/* User Profile Header Card */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                <div className={cn(
                  'grid size-11 shrink-0 place-items-center rounded-xl font-bold text-sm text-white shadow-sm',
                  currentUser.role === 'super_admin'
                    ? 'bg-purple-600'
                    : currentUser.role === 'reviewer'
                      ? 'bg-emerald-600'
                      : 'bg-blue-600'
                )}>
                  {currentUser.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Session
                    </span>
                  </div>
                </div>
              </div>

              {/* Role & Agency Info */}
              <div className="py-3 space-y-2 text-xs border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[11px] font-medium">Assigned Role</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{currentUser.roleLabel}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[11px] font-medium">Ministry Agency</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{currentUser.agency || currentUser.unit}</span>
                </div>
                {currentUser.skills && currentUser.skills.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-400 tracking-wider block mb-1">
                      Professional Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentUser.skills.map((s) => (
                        <span key={s} className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {s.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Out Action */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 py-2.5 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 transition cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out / Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function AssetThumbnail({
  type,
  name,
  posterUrl,
}: {
  type?: AssetThumbType
  name?: string
  posterUrl?: string
}) {
  const [imgFailed, setImgFailed] = useState(false)

  if (posterUrl && !imgFailed) {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
        <img
          src={posterUrl}
          alt={name || 'Cover'}
          className="size-full object-cover"
          onError={() => setImgFailed(true)}
        />
      </div>
    )
  }

  // Clean typographic monogram based on Asset Name
  const cleanName = (name || 'IP').trim()
  const words = cleanName.split(/\s+/).filter(Boolean)
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : cleanName.slice(0, 2).toUpperCase()

  const gradients = [
    'from-[#021024] to-[#09245a]',
    'from-indigo-600 to-blue-700',
    'from-purple-600 to-indigo-800',
    'from-cyan-600 to-blue-700',
    'from-slate-700 to-slate-900',
    'from-emerald-600 to-teal-800',
    'from-blue-700 to-indigo-900',
  ]
  const colorIndex = (cleanName.charCodeAt(0) + (cleanName.charCodeAt(1) || 0)) % gradients.length
  const gradient = gradients[colorIndex]

  return (
    <div
      className={cn(
        'relative size-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br shadow-2xs flex flex-col items-center justify-center text-white ring-1 ring-black/5 font-black text-xs tracking-wider select-none',
        gradient
      )}
      title={cleanName}
    >
      <span>{initials}</span>
    </div>
  )
}

function CategoryBadgeIcon({ category }: { category: string }) {
  if (category.includes('Animated')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#8b5cf6] text-white shadow-xs">
        <Layers className="size-3.5" />
      </div>
    )
  }
  if (category.includes('TV')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#3b82f6] text-white shadow-xs">
        <Tv className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Documentary')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#0284c7] text-white shadow-xs">
        <FileText className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Film') || category.includes('Movie')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#6366f1] text-white shadow-xs">
        <Film className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Brand')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#334155] text-white shadow-xs">
        <Tag className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Consumer') || category.includes('Product') || category.includes('Merchandise')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#10b981] text-white shadow-xs">
        <ShoppingBag className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Comic')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f97316] text-white shadow-xs">
        <Sparkles className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Book') || category.includes('Publishing')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f59e0b] text-white shadow-xs">
        <BookOpen className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Digital') || category.includes('Platform') || category.includes('Interactive')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#06b6d4] text-white shadow-xs">
        <Globe2 className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Outreach') || category.includes('Event')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#a855f7] text-white shadow-xs">
        <Radio className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Character')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#ef4444] text-white shadow-xs">
        <Users className="size-3.5" />
      </div>
    )
  }
  if (category.includes('Music') || category.includes('Audio')) {
    return (
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#ec4899] text-white shadow-xs">
        <Music className="size-3.5" />
      </div>
    )
  }
  return (
    <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#3b82f6] text-white shadow-xs">
      <Boxes className="size-3.5" />
    </div>
  )
}

function StatusPill({ status }: { status: AssetStatus | 'Active' | 'Inactive' | 'Cleared' | 'Review' }) {
  switch (status) {
    case 'In Production':
    case 'Active':
    case 'Approved':
    case 'Cleared':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-xs">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </span>
      )
    case 'Yet to Launch':
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/80 shadow-xs">
          <span className="size-1.5 rounded-full bg-amber-500" />
          {status}
        </span>
      )
    case 'Discontinued':
    case 'Requires Attention':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/80 shadow-xs">
          <span className="size-1.5 rounded-full bg-rose-500" />
          {status}
        </span>
      )
    case 'Under Review':
    case 'In Review':
    case 'Review':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/80 shadow-xs">
          <span className="size-1.5 rounded-full bg-blue-500" />
          {status}
        </span>
      )
    case 'Inactive':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200/80 shadow-xs">
          <span className="size-1.5 rounded-full bg-slate-400" />
          Inactive
        </span>
      )
    default:
      return null
  }
}

function Stat({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: string | number; color: string; trend: string }) {
  const isPositive = trend.includes('↑') || trend.startsWith('+')
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className={cn('grid size-10 place-items-center rounded-lg text-white shadow-xs transition-transform group-hover:scale-105', color)}>
          <Icon className="size-5" strokeWidth={2} />
        </div>
        <span className={cn(
          'inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-medium',
          isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-700 border border-slate-200'
        )}>
          {trend}
        </span>
      </div>
      <div className="mt-3.5">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
        <div className="mt-1 text-[11px] text-slate-400 font-medium">vs. previous period</div>
      </div>
    </div>
  )
}

function Donut({
  low,
  medium,
  high,
  approved,
  pending,
  attention,
}: {
  low?: number
  medium?: number
  high?: number
  approved?: number
  pending?: number
  attention?: number
}) {
  const cLow = low ?? approved ?? 0
  const cMedium = medium ?? pending ?? 0
  const cHigh = high ?? attention ?? 0
  const total = Math.max(1, cLow + cMedium + cHigh)
  const lowPct = Math.round((cLow / total) * 100)
  const medPct = Math.round((cMedium / total) * 100)

  return (
    <div
      className="relative grid size-36 place-items-center rounded-full p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
      style={{
        background: `conic-gradient(#10b981 0% ${lowPct}%, #f59e0b ${lowPct}% ${lowPct + medPct}%, #ef4444 ${lowPct + medPct}% 100%)`,
      }}
    >
      <div className="grid size-26 place-items-center rounded-full bg-white dark:bg-slate-900 text-center shadow-xs border border-slate-100 dark:border-slate-800">
        <div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{total}</div>
          <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Total Assets</div>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// DASHBOARD COMPONENT
// -------------------------------------------------------------
function Dashboard({
  setActiveNav,
}: {
  setActiveNav?: (nav: string, assetId?: string | null) => void
}) {
  const { assets, allAssets, stats, globalStats, categories, activities, currentUser, isGlobalViewer, userAgency, rightsRecords, approvals } = useLovetoonsData()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      assets.filter((a) =>
        `${a.name} ${a.id} ${a.category} ${a.subcategory}`.toLowerCase().includes(query.toLowerCase())
      ),
    [assets, query]
  )

  const riskMetrics = useMemo(() => getPortfolioRiskMetrics(assets, rightsRecords, approvals), [assets, rightsRecords, approvals])

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Boxes}
          label="Total Catalogued IP"
          value={stats.totalAssets}
          color="bg-slate-900 dark:bg-slate-800"
          trend={`${categories.length} Categories`}
        />
        <Stat
          icon={ShieldCheck}
          label="Low Risk IP"
          value={riskMetrics.lowCount}
          color="bg-emerald-600"
          trend={`${riskMetrics.lowPct}% Baseline Secure`}
        />
        <Stat
          icon={Clock3}
          label="Moderate Exposure"
          value={riskMetrics.mediumCount}
          color="bg-amber-600"
          trend={`${riskMetrics.mediumPct}% Review / Pre-Launch`}
        />
        <Stat
          icon={AlertCircle}
          label="High & Critical Exposure"
          value={riskMetrics.criticalCount + riskMetrics.highCount}
          color="bg-rose-600"
          trend={`${riskMetrics.criticalPct + riskMetrics.highPct}% Documentation Required`}
        />
      </div>

      {/* Portfolio Risk & Governance Exposure At-A-Glance Card */}
      <section className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-xs transition-all backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            {/* <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
              <ShieldCheck className="size-4.5" />
            </div> */}
            {/* <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Portfolio Risk & Governance Exposure</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  {riskMetrics.lowPct}% Low Risk
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Independent intellectual asset liability & title exposure matrix</p>
            </div> */}
          </div>
          {setActiveNav && (
            <button
              onClick={() => setActiveNav('Reports')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-white/20 transition group self-start sm:self-auto cursor-pointer"
            >
              <span>View Full Risk Audit</span>
              <ArrowRight className="size-3 text-slate-500 dark:text-slate-400 group-hover:translate-x-0.5 group-hover:text-slate-900 dark:group-hover:text-white transition" />
            </button>
          )}
        </div>

        {/* Visual Multi-Segment Exposure Meter */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400">Exposure Profile Distribution</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{riskMetrics.lowPct}% Low Risk</span>
              <span className="text-slate-400 dark:text-slate-600 mx-1.5">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{riskMetrics.mediumPct}% Moderate</span>
              <span className="text-slate-400 dark:text-slate-600 mx-1.5">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{riskMetrics.highPct}% High</span>
              <span className="text-slate-400 dark:text-slate-600 mx-1.5">·</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{riskMetrics.criticalPct}% Critical</span>
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex shadow-inner border border-slate-200/40 dark:border-white/5">
            <div
              style={{ width: `${riskMetrics.lowPct}%` }}
              className="h-full bg-emerald-500 transition-all hover:opacity-90"
              title={`Low Risk: ${riskMetrics.lowCount} assets (${riskMetrics.lowPct}%)`}
            />
            <div
              style={{ width: `${riskMetrics.mediumPct}%` }}
              className="h-full bg-blue-500 transition-all hover:opacity-90"
              title={`Moderate Risk: ${riskMetrics.mediumCount} assets (${riskMetrics.mediumPct}%)`}
            />
            <div
              style={{ width: `${riskMetrics.highPct}%` }}
              className="h-full bg-amber-500 transition-all hover:opacity-90"
              title={`High Exposure: ${riskMetrics.highCount} assets (${riskMetrics.highPct}%)`}
            />
            <div
              style={{ width: `${riskMetrics.criticalPct}%` }}
              className="h-full bg-rose-500 transition-all hover:opacity-90"
              title={`Critical Exposure: ${riskMetrics.criticalCount} assets (${riskMetrics.criticalPct}%)`}
            />
          </div>

          {/* 4 Interactive Risk Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/30 transition-all hover:border-emerald-200 dark:hover:border-emerald-500/40">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                <span>Low Risk</span>
                <span className="size-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-xs shadow-emerald-500/50" />
              </div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1.5 tracking-tight">{riskMetrics.lowCount}</div>
              <div className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 mt-0.5 font-medium">In-house liturgy & clean archives</div>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/30 transition-all hover:border-blue-200 dark:hover:border-blue-500/40">
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                <span>Moderate Risk</span>
                <span className="size-2 rounded-full bg-blue-500 dark:bg-blue-400 shadow-xs shadow-blue-500/50" />
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1.5 tracking-tight">{riskMetrics.mediumCount}</div>
              <div className="text-[11px] text-blue-700/90 dark:text-blue-300/80 mt-0.5 font-medium">Books, podcasts, audio & pre-launch</div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/30 transition-all hover:border-amber-200 dark:hover:border-amber-500/40">
              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                <span>High Exposure</span>
                <span className="size-2 rounded-full bg-amber-500 dark:bg-amber-400 shadow-xs shadow-amber-500/50" />
              </div>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1.5 tracking-tight">{riskMetrics.highCount}</div>
              <div className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-0.5 font-medium">Broadcast IP missing talent releases</div>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-100 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/30 transition-all hover:border-rose-200 dark:hover:border-rose-500/40">
              <div className="flex items-center justify-between text-[11px] font-semibold text-rose-800 dark:text-rose-300">
                <span>Critical Exposure</span>
                <span className="size-2 rounded-full bg-rose-500 dark:bg-rose-400 shadow-xs shadow-rose-500/50" />
              </div>
              <div className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-1.5 tracking-tight">{riskMetrics.criticalCount}</div>
              <div className="text-[11px] text-rose-700/90 dark:text-rose-300/80 mt-0.5 font-medium">Commercial products / flagship syndication</div>
            </div>
          </div>

          <div className="flex items-start sm:items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <CircleHelp className="size-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong className="text-slate-700 dark:text-slate-300">Schedule Legal Guidance:</strong> Intellectual asset risk is evaluated independently per asset based on documentation completeness, public liability surface, and distribution reach. Discontinued assets carry low active liability, while active broadcast and commercial assets require attached chain of title deeds.
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_.8fr]">
        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">Assets by Category</h2>
              <p className="text-xs text-slate-500">Distribution across active content streams</p>
            </div>
            <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {categories.length} Categories
            </span>
          </div>

          <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 px-2 pb-2">
            {categories.slice(0, 8).map((cat, i) => {
              const count = assets.filter((a) => a.category === cat.name).length
              const heightPct = Math.max(10, Math.min(100, (count / Math.max(1, assets.length)) * 250))
              return (
                <div key={cat.id} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5 group">
                  <span className="text-xs font-semibold text-slate-800 group-hover:scale-110 transition">{count}</span>
                  <div
                    className={cn(
                      'w-full max-w-7 rounded-t-sm transition-all group-hover:brightness-110 shadow-2xs',
                      ['bg-slate-900', 'bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-600', 'bg-violet-600'][i % 8]
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-medium text-slate-500 truncate max-w-[65px] text-center mt-1" title={cat.name}>
                    {cat.name.split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-slate-900 text-sm">Portfolio Compliance Breakdown</h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {riskMetrics.lowPct}% Low Risk
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Independent risk & title distribution</p>
          <div className="flex items-center justify-center gap-5 py-2">
            <Donut
              low={riskMetrics.lowCount}
              medium={riskMetrics.mediumCount}
              high={riskMetrics.criticalCount + riskMetrics.highCount}
            />
            <div className="space-y-3 text-xs text-slate-700 font-medium">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Low Risk IP
                </span>
                <b className="text-slate-900 font-semibold">{riskMetrics.lowCount}</b>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2 rounded-full bg-amber-400" />
                  Moderate Risk
                </span>
                <b className="text-slate-900 font-semibold">{riskMetrics.mediumCount}</b>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2 rounded-full bg-rose-500" />
                  High & Critical
                </span>
                <b className="text-slate-900 font-semibold">{riskMetrics.criticalCount + riskMetrics.highCount}</b>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Recent Registered Assets</h2>
            <p className="text-[11px] text-slate-500">
              {isGlobalViewer ? 'Latest intellectual property assets registered across all agencies' : `Latest assets for ${currentUser.agency}`}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-300 transition"
              placeholder="Search recent assets..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subcategory</th>
                <th className="px-4 py-3">Agency</th>
                <th className="px-4 py-3">Contributors</th>
                <th className="px-4 py-3">Risk & Compliance</th>
                <th className="px-4 py-3">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 6).map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    if (setActiveNav) {
                      setActiveNav('Assets', item.id)
                    }
                  }}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  title={`Click to view ${item.name} details`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AssetThumbnail type={item.thumbType} name={item.name} posterUrl={item.posterUrl} />
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1 text-xs">
                          <span>{item.name}</span>
                          <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 text-blue-600 transition shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{item.category}</td>
                  <td className="px-4 py-3 text-slate-500">{item.subcategory}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {item.agency || item.unit}
                    </span>
                  </td>
                  <td className="p-3">
                    {item.contributors && item.contributors.length > 0 ? (
                      <div className="flex items-center -space-x-1.5" title={`${item.contributors.length} staff contributor(s)`}>
                        {item.contributors.slice(0, 3).map((c, i) => (
                          <div
                            key={c.id || i}
                            className="grid size-6 place-items-center rounded-full bg-slate-800 text-[9px] font-bold text-white ring-2 ring-white"
                            title={`${c.name} (${c.role})`}
                          >
                            {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'ST'}
                          </div>
                        ))}
                        {item.contributors.length > 3 && (
                          <div className="grid size-6 place-items-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 ring-2 ring-white">
                            +{item.contributors.length - 3}
                          </div>
                        )}
                      </div>
                    ) : item.creatorName ? (
                      <div className="flex items-center gap-1.5" title={item.creatorName}>
                        <div className="grid size-6 place-items-center rounded-full bg-slate-800 text-[9px] font-bold text-white">
                          {item.creatorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-[10px] text-slate-600 font-medium truncate max-w-[80px]">{item.creatorName}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No contributors</span>
                    )}
                  </td>
                  <td className="p-3">
                    {(() => {
                      const assessment = getAssetRiskAssessment(item, rightsRecords, approvals)
                      return (
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold border shadow-2xs',
                              assessment.riskBadgeColor
                            )}
                          >
                            <span
                              className={cn(
                                'size-1.5 rounded-full',
                                assessment.level === 'Low'
                                  ? 'bg-emerald-500'
                                  : assessment.level === 'Medium'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                              )}
                            />
                            <span>{assessment.level} Risk · {100 - assessment.score}% Compliant</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium truncate max-w-[140px]">
                            {item.status} · {assessment.category}
                          </span>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="p-3 text-slate-500 font-medium text-[11px]">{item.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div >
  )
}

// -------------------------------------------------------------
// ASSETS PAGE & 2-STEP DYNAMIC ADD ASSET MODAL
// -------------------------------------------------------------
function AssetsPage({
  setActiveNav,
  initialAssetId,
}: {
  setActiveNav: (nav: string, assetId?: string | null) => void
  initialAssetId?: string | null
}) {
  const { assets, allAssets, addAsset, bulkApproveAssets, bulkDeleteAssets, categories, subcategories, currentUser, showToast, isGlobalViewer, userAgency, availableUsers, rightsRecords, approvals } = useLovetoonsData()

  const [selectedPill, setSelectedPill] = useState<string>('All Assets')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All Subcategories')
  const [selectedRisk, setSelectedRisk] = useState<string>('All Risks')
  const [selectedAgency, setSelectedAgency] = useState<string>('All Agencies')
  const riskMetrics = useMemo(() => getPortfolioRiskMetrics(assets, rightsRecords, approvals), [assets, rightsRecords, approvals])
  const [newContributorName, setNewContributorName] = useState('')
  const [newContributorRole, setNewContributorRole] = useState('Lead 3D Animator')
  const [newContributorAgency, setNewContributorAgency] = useState<Agency>(currentUser.agency || 'Lovetoons')
  const [newContributorType, setNewContributorType] = useState<AssetContributor['contributionType']>('Core Creative')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Reusable Confirmation Modal State for AssetsPage
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    description: React.ReactNode
    confirmLabel?: string
    variant?: 'primary' | 'danger' | 'warning' | 'success'
    badge?: string
    details?: React.ReactNode
    onConfirm: () => void | Promise<void>
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
  })

  const handleInitiateBulkApprove = () => {
    setConfirmConfig({
      isOpen: true,
      title: `Confirm Batch Approval (${selectedRows.length} assets)`,
      description: `Are you sure you want to approve all ${selectedRows.length} selected intellectual assets? All approvals and status changes will be permanently written to the audit trail.`,
      confirmLabel: `Confirm & Approve (${selectedRows.length})`,
      variant: 'success',
      badge: 'Audit Trail Enforced',
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Affected Asset IDs:</span> {selectedRows.join(', ')}</div>
          <div><span className="font-semibold text-slate-700">Authorised By:</span> {currentUser.name} ({currentUser.roleLabel})</div>
        </div>
      ),
      onConfirm: () => {
        bulkApproveAssets(selectedRows)
        setSelectedRows([])
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleInitiateBulkDelete = () => {
    setConfirmConfig({
      isOpen: true,
      title: `Confirm Batch Deletion (${selectedRows.length} assets)`,
      description: `WARNING: This will permanently delete ${selectedRows.length} assets and all associated governance rights records and approvals. This action will be recorded in the audit trail.`,
      confirmLabel: `Confirm & Delete (${selectedRows.length})`,
      variant: 'danger',
      badge: 'Permanent Deletion',
      details: (
        <div className="text-xs space-y-1 text-rose-700">
          <div><span className="font-semibold">Asset IDs:</span> {selectedRows.join(', ')}</div>
          <div><span className="font-semibold">Action Performed By:</span> {currentUser.name}</div>
        </div>
      ),
      onConfirm: () => {
        bulkDeleteAssets(selectedRows)
        setSelectedRows([])
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  // Selected asset for Details Page
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<AssetData | null>(() => {
    if (initialAssetId) {
      return assets.find((a) => a.id === initialAssetId) || allAssets.find((a) => a.id === initialAssetId) || null
    }
    return null
  })

  useEffect(() => {
    if (initialAssetId) {
      const found = assets.find((a) => a.id === initialAssetId) || allAssets.find((a) => a.id === initialAssetId)
      if (found) setSelectedAssetForDetails(found)
    }
  }, [initialAssetId, assets, allAssets])

  const handleSelectAsset = (asset: AssetData | null) => {
    setSelectedAssetForDetails(asset)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (asset) {
        url.searchParams.set('asset', asset.id)
      } else {
        url.searchParams.delete('asset')
      }
      window.history.pushState({}, '', url.toString())
    }
  }

  // Two-way synchronization between Horizontal Pills and Category Dropdown filter
  const handlePillClick = (pillLabel: string) => {
    setSelectedPill(pillLabel)
    if (pillLabel === 'All Assets') {
      setSelectedCategory('All Categories')
    } else {
      setSelectedCategory(pillLabel)
    }
    setSelectedSubcategory('All Subcategories')
  }

  const handleCategoryDropdownChange = (catName: string) => {
    setSelectedCategory(catName)
    if (catName === 'All Categories') {
      setSelectedPill('All Assets')
    } else {
      setSelectedPill(catName)
    }
    setSelectedSubcategory('All Subcategories')
  }

  // 2-Step Dynamic Add Asset Form State
  const [newAssetForm, setNewAssetForm] = useState<{
    name: string
    category: string
    subcategory: string
    agency: Agency
    unit?: Agency
    contributors: AssetContributor[]
    rightsHolder: string
    description: string
    tags: string
    posterUrl: string
    attributes: AssetDynamicAttributes
  }>({
    name: '',
    category: categories[0]?.name || 'Animated Programme',
    subcategory: '',
    agency: currentUser.agency || 'Lovetoons',
    unit: currentUser.agency || 'Lovetoons',
    contributors: [],
    rightsHolder: '',
    description: '',
    tags: '',
    posterUrl: '',
    attributes: {},
  })

  // Dynamic subcategories list matching the selected category in the modal
  const availableSubcategoriesForForm = useMemo(() => {
    return subcategories.filter((s) => s.parentCategory === newAssetForm.category)
  }, [subcategories, newAssetForm.category])

  // Automatically compute auto-generated ID for modal preview
  const autoGeneratedIdPreview = useMemo(() => {
    const prefix = (newAssetForm.category || 'AS').slice(0, 2).toUpperCase()
    return `LT-${prefix}-${String(assets.length + 1).padStart(3, '0')}`
  }, [newAssetForm.category, assets.length])

  // Pill filter options built from categories
  const pillFilters = useMemo(() => {
    const list = [{ label: 'All Assets', count: assets.length }]
    categories.forEach((cat) => {
      const count = assets.filter((a) => a.category === cat.name).length
      list.push({ label: cat.name, count })
    })
    return list
  }, [assets, categories])

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false
      }
      if (selectedSubcategory !== 'All Subcategories' && item.subcategory !== selectedSubcategory) {
        return false
      }
      if (selectedRisk !== 'All Risks') {
        const assessment = getAssetRiskAssessment(item, rightsRecords, approvals)
        if (assessment.level !== selectedRisk) {
          return false
        }
      }
      if (selectedAgency !== 'All Agencies' && (item.agency || item.unit) !== selectedAgency) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.subcategory.toLowerCase().includes(q) ||
          (item.creatorName && item.creatorName.toLowerCase().includes(q)) ||
          (item.rightsHolder && item.rightsHolder.toLowerCase().includes(q)) ||
          (item.agency && item.agency.toLowerCase().includes(q)) ||
          item.contributors?.some(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [assets, selectedCategory, selectedSubcategory, selectedRisk, selectedAgency, searchQuery, rightsRecords, approvals])

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAssetForm.name.trim()) {
      showToast('Please enter an asset name / title.')
      return
    }

    const tagList = newAssetForm.tags.split(',').map((t) => t.trim()).filter(Boolean)

    addAsset({
      name: newAssetForm.name.trim(),
      type: newAssetForm.subcategory || 'Standard IP',
      category: newAssetForm.category,
      categoryGroup: newAssetForm.category,
      subcategory: newAssetForm.subcategory || availableSubcategoriesForForm[0]?.name || 'General',
      agency: isGlobalViewer ? newAssetForm.agency : (currentUser.agency || 'Lovetoons'),
      unit: isGlobalViewer ? newAssetForm.agency : (currentUser.agency || 'Lovetoons'),
      contributors: newAssetForm.contributors,
      status: 'Pending',
      posterUrl: newAssetForm.posterUrl.trim() ? newAssetForm.posterUrl.trim() : undefined,
      rightsHolder: newAssetForm.rightsHolder.trim(),
      description: newAssetForm.description.trim(),
      tags: tagList.length > 0 ? tagList : [newAssetForm.category],
    })

    showToast(`Asset "${newAssetForm.name.trim()}" registered successfully!`)
    setIsAddModalOpen(false)
    setNewAssetForm({
      name: '',
      category: categories[0]?.name || 'Animated Programme',
      subcategory: '',
      agency: currentUser.agency || 'Lovetoons',
      unit: currentUser.agency || 'Lovetoons',
      contributors: [],
      rightsHolder: '',
      description: '',
      tags: '',
      posterUrl: '',
      attributes: {},
    })
  }

  if (selectedAssetForDetails) {
    return (
      <AssetDetailsPage
        asset={selectedAssetForDetails}
        onBack={() => handleSelectAsset(null)}
        onSelectAsset={(a) => handleSelectAsset(a)}
        setActiveNav={setActiveNav}
      />
    )
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* HORIZONTAL CATEGORY PILLS ROW & ACTION */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar flex-1">
          {pillFilters.map((pill) => {
            const isSelected = selectedPill === pill.label
            return (
              <button
                key={pill.label}
                onClick={() => handlePillClick(pill.label)}
                className={cn(
                  'whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition border flex items-center gap-2 cursor-pointer text-xs',
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
                )}
              >
                <span>{pill.label}</span>
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.2 text-[10px] font-semibold',
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {pill.count}
                </span>
              </button>
            )
          })}
        </div>

        <button
          id="open-add-asset-modal-btn"
          onClick={() => {
            setIsAddModalOpen(true)
          }}
          className="shrink-0 flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-slate-800 active:scale-98 cursor-pointer"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>Add New Asset</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by title, ID, creator, or agency..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryDropdownChange(e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none transition"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Risk Level Filter */}
          <div className="relative">
            <select
              id="asset-risk-filter-select"
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none transition cursor-pointer"
            >
              <option value="All Risks">All Risk Profiles ({assets.length})</option>
              <option value="Low">Low Risk ({riskMetrics.lowCount})</option>
              <option value="Medium">Moderate Risk ({riskMetrics.mediumCount})</option>
              <option value="High">High Risk ({riskMetrics.highCount})</option>
              <option value="Critical">Critical Risk ({riskMetrics.criticalCount})</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Agency Filter */}
          <div className="relative">
            {isGlobalViewer ? (
              <>
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none transition"
                >
                  <option value="All Agencies">All Agencies ({assets.length})</option>
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
              </>
            ) : (
              <div className="flex h-9 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700">
                <span className="truncate">Agency: {currentUser.agency || userAgency}</span>
                <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] text-slate-700 shrink-0 font-medium">Agency Scoped</span>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedRows.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2 border border-slate-200 text-xs animate-in fade-in">
            <span className="font-semibold text-slate-800">
              {selectedRows.length} {selectedRows.length === 1 ? 'asset' : 'assets'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                id="bulk-approve-btn"
                onClick={handleInitiateBulkApprove}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-white font-medium hover:bg-emerald-700 transition cursor-pointer shadow-xs"
              >
                Approve Selected
              </button>
              <button
                id="bulk-delete-btn"
                onClick={handleInitiateBulkDelete}
                className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-red-600 font-medium hover:bg-red-50 transition cursor-pointer shadow-xs"
              >
                Delete Selected
              </button>
              <button onClick={() => setSelectedRows([])} className="text-slate-500 hover:text-slate-800 ml-2 font-medium cursor-pointer">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ASSETS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredAssets.length && filteredAssets.length > 0}
                    onChange={() => {
                      if (selectedRows.length === filteredAssets.length) setSelectedRows([])
                      else setSelectedRows(filteredAssets.map((a) => a.id))
                    }}
                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                  />
                </th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subcategory</th>
                <th className="px-4 py-3">Agency</th>
                <th className="px-4 py-3">Contributors</th>
                <th className="px-4 py-3">Owner / Rights Holder</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Boxes className="mx-auto size-10 text-slate-300 mb-2" />
                    <div className="font-bold text-slate-600">No assets matching filters</div>
                    <div className="text-xs text-slate-400">Try adjusting your category pills or search terms</div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isSelected = selectedRows.includes(asset.id)
                  return (
                    <tr
                      key={asset.id}
                      className={cn(
                        'transition-colors cursor-pointer',
                        isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/80'
                      )}
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedRows((prev) =>
                              prev.includes(asset.id) ? prev.filter((i) => i !== asset.id) : [...prev, asset.id]
                            )
                          }}
                          aria-label={`Select ${asset.name}`}
                          className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <AssetThumbnail type={asset.thumbType} name={asset.name} posterUrl={asset.posterUrl} />
                          <div className="min-w-0 space-y-1">
                            <div className="font-semibold text-slate-900 hover:text-blue-600 transition truncate max-w-xs text-xs">
                              {asset.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1">
                              <span>{asset.id}</span>
                              {asset.type && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-500 font-sans">{asset.type}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CategoryBadgeIcon category={asset.category} />
                          <span className="font-medium text-slate-700">{asset.category}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600 font-medium">{asset.subcategory}</td>

                      <td className="px-4 py-3">
                        <span className={cn(
                          'rounded-md px-2 py-0.5 text-[10px] font-bold border',
                          (asset.agency || asset.unit) === 'Lovetoons'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : (asset.agency || asset.unit) === 'Publishing Agency'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : (asset.agency || asset.unit) === 'Digital Agency'
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                : (asset.agency || asset.unit) === 'Academy Agency'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        )}>
                          {asset.agency || asset.unit}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {asset.contributors && asset.contributors.length > 0 ? (
                          <>
                            <div className="flex items-center -space-x-1.5" title={`${asset.contributors.length} staff contributor(s)`}>
                              {asset.contributors.slice(0, 3).map((c, i) => (
                                <div
                                  key={c.id || i}
                                  className="grid size-6 place-items-center rounded-full bg-slate-800 text-[9px] font-bold text-white ring-2 ring-white"
                                  title={`${c.name} (${c.role})`}
                                >
                                  {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'ST'}
                                </div>
                              ))}
                              {asset.contributors.length > 3 && (
                                <div className="grid size-6 place-items-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 ring-2 ring-white">
                                  +{asset.contributors.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                              {asset.contributors.map((c) => c.name).join(', ')}
                            </div>
                          </>
                        ) : asset.creatorName ? (
                          <div className="text-[11px] text-slate-600 font-medium truncate max-w-[120px]">
                            {asset.creatorName}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No contributors</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div
                          className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px]"
                          title={asset.rightsHolder || 'Unassigned'}
                        >
                          {asset.rightsHolder || <span className="text-slate-400 italic font-normal">Unassigned</span>}
                        </div>
                        {asset.rightsHolder ? (
                          <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                            <span>Sole Ownership</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                            <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
                            <span>Pending Assignment</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <StatusPill status={asset.status} />
                          {(() => {
                            const assessment = getAssetRiskAssessment(asset, rightsRecords, approvals)
                            return (
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded border shadow-2xs',
                                  assessment.riskBadgeColor
                                )}
                                title={`Risk Score: ${assessment.score}/100 • Compliance: ${100 - assessment.score}% • Vector: ${assessment.primaryVector}`}
                              >
                                <span>{assessment.level} Risk</span>
                                <span className="opacity-60">·</span>
                                <span>{100 - assessment.score}% Compliant</span>
                              </span>
                            )
                          })()}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{asset.createdDate}</div>
                        <div className="text-[10px] text-slate-400">{asset.createdTime}</div>
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`row-rights-btn-${asset.id}`}
                            onClick={() => {
                              setActiveNav('Rights & Governance', asset.id)
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition shadow-2xs cursor-pointer"
                            title={`Open Rights & Governance for ${asset.name}`}
                          >
                            <ShieldCheck className="size-3.5 text-blue-600" />
                            <span>Rights ↗</span>
                          </button>
                          <button
                            onClick={() => handleSelectAsset(asset)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                            aria-label={`Open details for ${asset.name}`}
                          >
                            <ChevronRight className="size-4 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">1–{filteredAssets.length}</span> of {assets.length} assets
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Lovetoons Central Asset Store</div>
        </div>
      </div>

      {/* DYNAMIC 2-STEP ADD NEW ASSET MODAL */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white font-bold">
                    <Plus className="size-4" />
                  </div>
                  <h3 className="font-bold text-[#09245a] text-sm">Add New Intellectual Asset</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Core Asset Identification & Operational Unit Intake
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddAssetSubmit} className="mt-4 space-y-4">
              <div className="space-y-3.5">
                {/* Auto-Generated Asset ID Preview */}
                <div className="flex items-center justify-between rounded-xl bg-blue-50/80 p-3 border border-blue-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-700 block">Auto-Generated Asset ID</span>
                    <div className="font-mono font-bold text-[#09245a] text-sm">{autoGeneratedIdPreview}</div>
                  </div>
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">Auto-Assigned</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asset Name / Title *</label>
                  <input
                    value={newAssetForm.name}
                    onChange={(e) => setNewAssetForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Brave Boy Adventures Episode 4"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={newAssetForm.category}
                      onChange={(e) => {
                        const newCat = e.target.value
                        setNewAssetForm((prev) => ({
                          ...prev,
                          category: newCat,
                          subcategory: '',
                        }))
                      }}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subcategory *</label>
                    <select
                      value={newAssetForm.subcategory}
                      onChange={(e) => setNewAssetForm((prev) => ({ ...prev, subcategory: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                    >
                      <option value="">Select Subcategory</option>
                      {availableSubcategoriesForForm.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Originating Agency *</label>
                    {isGlobalViewer ? (
                      <select
                        value={newAssetForm.agency}
                        onChange={(e) =>
                          setNewAssetForm((prev) => ({
                            ...prev,
                            agency: e.target.value as Agency,
                            unit: e.target.value as Agency,
                          }))
                        }
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-semibold"
                      >
                        {agencies.map((agency) => (
                          <option key={agency} value={agency}>
                            {agency}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700">
                        {currentUser.agency || 'Lovetoons'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Asset Owner / Rights Holder</label>
                    <input
                      value={newAssetForm.rightsHolder}
                      onChange={(e) => setNewAssetForm((prev) => ({ ...prev, rightsHolder: e.target.value }))}
                      placeholder="Registered Rights Holder (leave blank if unassigned)"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* STAFF CONTRIBUTORS BUILDER */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="block font-bold text-[#09245a] text-xs">
                          Staff Contributors ({newAssetForm.contributors.length})
                        </label>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Manually add contributing authors, animators, artists, or engineers (or leave blank)
                      </p>
                    </div>
                  </div>

                  {/* Contributor List Chips */}
                  {newAssetForm.contributors.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-blue-200/90 bg-white/60 p-3 text-center text-xs text-slate-500">
                      No contributors added yet. Use the fields below to add contributing team members, or leave blank.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {newAssetForm.contributors.map((c, idx) => (
                        <div
                          key={c.id || idx}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs text-xs"
                        >
                          <div className="grid size-6 place-items-center rounded bg-slate-800 text-[10px] font-bold text-white uppercase">
                            {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'ST'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 leading-tight truncate max-w-[130px]">{c.name}</div>
                            <div className="text-[10px] text-blue-700 truncate">{c.role} • {c.agency}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNewAssetForm((prev) => ({
                                ...prev,
                                contributors: prev.contributors.filter((_, i) => i !== idx),
                              }))
                            }}
                            className="text-slate-400 hover:text-red-500 transition ml-1 cursor-pointer"
                            title="Remove contributor"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Contributor Mini-Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-t border-blue-100/80 pt-2.5">
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        placeholder="Contributor name..."
                        value={newContributorName}
                        onChange={(e) => setNewContributorName(e.target.value)}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <select
                        value={newContributorRole}
                        onChange={(e) => setNewContributorRole(e.target.value)}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-400"
                      >
                        <option value="Lead 3D Animator">Lead 3D Animator</option>
                        <option value="Screenwriter & Author">Screenwriter & Author</option>
                        <option value="Voice Artist / Director">Voice Artist / Director</option>
                        <option value="Music Producer & Composer">Music Producer & Composer</option>
                        <option value="Curriculum Author">Curriculum Author</option>
                        <option value="Illustrator & Concept Artist">Illustrator & Concept Artist</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="Audio Sound Engineer">Audio Sound Engineer</option>
                        <option value="Theological Reviewer">Theological Reviewer</option>
                        <option value="Production Specialist">Production Specialist</option>
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <select
                        value={newContributorAgency}
                        onChange={(e) => setNewContributorAgency(e.target.value as Agency)}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-400"
                      >
                        {agencies.map((agency) => (
                          <option key={agency} value={agency}>
                            {agency}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newContributorName.trim()) return
                          setNewAssetForm((prev) => ({
                            ...prev,
                            contributors: [
                              ...prev.contributors,
                              {
                                id: `c-staff-${Date.now()}`,
                                name: newContributorName.trim(),
                                role: newContributorRole,
                                agency: newContributorAgency,
                                contributionType: newContributorType,
                              },
                            ],
                          }))
                          setNewContributorName('')
                        }}
                        className="h-8 w-full rounded-md bg-blue-600 font-bold text-white text-xs hover:bg-blue-700 transition cursor-pointer"
                      >
                        + Add Contributor
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asset Description (Optional)</label>
                  <textarea
                    value={newAssetForm.description}
                    onChange={(e) => setNewAssetForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="Summary of asset content, storyline, or technical specifications..."
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tag Chips (Optional, comma-separated)</label>
                  <input
                    value={newAssetForm.tags}
                    onChange={(e) => setNewAssetForm((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. Faith, 3D, Episode, Broadcast"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>

                {/* Asset Poster / Cover Image (Optional) */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="block font-bold text-slate-800 text-xs">Asset Cover Artwork</label>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Can be added or updated later</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Live preview: either user image or typographic monogram using asset name */}
                    <div className="relative size-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 shadow-2xs">
                      {newAssetForm.posterUrl.trim() ? (
                        <img
                          src={newAssetForm.posterUrl}
                          alt="Cover Preview"
                          className="size-full object-cover"
                          onError={(e) => {
                            ; (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-1 text-center select-none">
                          <span className="text-sm font-black tracking-wider leading-none">
                            {newAssetForm.name.trim() ? newAssetForm.name.trim().slice(0, 2).toUpperCase() : 'IP'}
                          </span>
                          <span className="text-[8px] font-semibold leading-tight line-clamp-1 opacity-80 px-0.5 mt-0.5">
                            {newAssetForm.name.trim() || 'No Cover'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input
                        type="url"
                        value={newAssetForm.posterUrl}
                        onChange={(e) => setNewAssetForm((prev) => ({ ...prev, posterUrl: e.target.value }))}
                        placeholder="https://... (Optional image URL)"
                        className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-blue-400"
                      />
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="text-slate-500">
                          {newAssetForm.posterUrl.trim()
                            ? 'Image cover set. Click Clear to use monogram badge.'
                            : 'No cover image? The asset name monogram badge will be displayed.'}
                        </span>
                        {newAssetForm.posterUrl.trim() && (
                          <button
                            type="button"
                            onClick={() => setNewAssetForm((prev) => ({ ...prev, posterUrl: '' }))}
                            className="text-red-600 hover:text-red-700 font-semibold cursor-pointer shrink-0"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL FOOTER BUTTONS */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 font-bold text-white shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="size-3.5" />
                    <span>Create Asset Now</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Confirmation Modal for AssetsPage */}
      <ConfirmActionModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmLabel={confirmConfig.confirmLabel}
        variant={confirmConfig.variant}
        badge={confirmConfig.badge}
        details={confirmConfig.details}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}

// -------------------------------------------------------------
// ASSET DETAILS PAGE
// -------------------------------------------------------------
function AssetDetailsPage({
  asset,
  onBack,
  onSelectAsset,
  setActiveNav,
}: {
  asset: AssetData
  onBack: () => void
  onSelectAsset?: (a: AssetData) => void
  setActiveNav?: (nav: string, assetId?: string | null) => void
}) {
  return (
    <AssetDetailsView
      asset={asset}
      onBack={onBack}
      onSelectAsset={onSelectAsset}
      setActiveNav={setActiveNav}
    />
  )
}

// -------------------------------------------------------------
// RIGHTS & GOVERNANCE CATALOG & DYNAMIC ADD MODAL
// -------------------------------------------------------------
function RightsPage({
  setActiveNav,
  initialAssetId,
}: {
  setActiveNav?: (nav: string) => void
  initialAssetId?: string | null
}) {
  const { rightsRecords, addRightsRecord, updateRightsRecord, assets, showToast, currentUser, approvals } = useLovetoonsData()

  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedRisk, setSelectedRisk] = useState('All Risks')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const rightsRiskMetrics = useMemo(() => getPortfolioRiskMetrics(assets, rightsRecords, approvals), [assets, rightsRecords, approvals])

  // Individual Document Upload Modal State (Specific record / individual contributor)
  const [individualDocRecord, setIndividualDocRecord] = useState<RightsRecord | null>(null)
  const [docTargetScope, setDocTargetScope] = useState<'individual' | 'asset'>('individual')
  const [docAssigneeName, setDocAssigneeName] = useState('')
  const [docAssigneeRole, setDocAssigneeRole] = useState('')
  const [docType, setDocType] = useState<string>('TALENT_RELEASE')
  const [docTitle, setDocTitle] = useState('')
  const [docFileSize, setDocFileSize] = useState('1.8 MB')
  const [docNotes, setDocNotes] = useState('')
  const [isCustomAssignee, setIsCustomAssignee] = useState(false)

  const individualDocContributors = useMemo(() => {
    if (!individualDocRecord) return []
    if (individualDocRecord.contributors && individualDocRecord.contributors.length > 0) {
      return individualDocRecord.contributors
    }
    const matchingAsset = assets.find((a) => a.id === individualDocRecord.assetId || a.id === individualDocRecord.id)
    return matchingAsset?.contributors || []
  }, [individualDocRecord, assets])

  const handleAddIndividualDocSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!individualDocRecord || !docTitle.trim()) return

    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`

    const newDoc: RightsDocument = {
      id: `doc-${Date.now()}`,
      name: docTitle.trim(),
      size: docFileSize || '1.8 MB',
      date: dateStr,
      type: docType,
      targetScope: docTargetScope,
      assigneeName: docTargetScope === 'individual' ? docAssigneeName.trim() : undefined,
      assigneeRole: docTargetScope === 'individual' ? docAssigneeRole.trim() : undefined,
      notes: docNotes.trim() || undefined,
    }

    const updatedDocuments = [...(individualDocRecord.documents || []), newDoc]
    const updatedRecord: RightsRecord = {
      ...individualDocRecord,
      documents: updatedDocuments,
    }

    updateRightsRecord(updatedRecord)
    showToast(
      docTargetScope === 'individual' && docAssigneeName.trim()
        ? `Document attached for individual "${docAssigneeName}" to ${individualDocRecord.name}!`
        : `Document attached to "${individualDocRecord.name}"!`
    )

    setIndividualDocRecord(null)
    setDocTitle('')
    setDocAssigneeName('')
    setDocAssigneeRole('')
    setDocNotes('')
  }

  const [selectedAssetForRightsDetails, setSelectedAssetForRightsDetails] = useState<RightsRecord | null>(() => {
    if (initialAssetId) {
      return rightsRecords.find((r) => r.id === initialAssetId || r.assetId === initialAssetId) || null
    }
    return null
  })

  useEffect(() => {
    if (initialAssetId) {
      const found = rightsRecords.find((r) => r.id === initialAssetId || r.assetId === initialAssetId)
      if (found) setSelectedAssetForRightsDetails(found)
    }
  }, [initialAssetId, rightsRecords])

  const handleSelectRightsAsset = (record: RightsRecord | null) => {
    setSelectedAssetForRightsDetails(record)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (record) {
        url.searchParams.set('asset', record.id)
      } else {
        url.searchParams.delete('asset')
      }
      window.history.pushState({}, '', url.toString())
    }
  }

  // Dynamic Add Rights Record Form State
  const [newRightsForm, setNewRightsForm] = useState<{
    assetId: string
    name: string
    category: string
    subcategory: string
    rightsType: string
    owner: string
    validity: string
    territory: string
    exclusivity: string
    licenceType: string
    royaltyTerms: string
    documents: RightsDocument[]
    newDocName: string
  }>({
    assetId: assets[0]?.id || '',
    name: assets[0]?.name || '',
    category: assets[0]?.category || 'TV Programme',
    subcategory: assets[0]?.subcategory || 'Broadcast Series',
    rightsType: '',
    owner: '',
    validity: '',
    territory: '',
    exclusivity: '',
    licenceType: '',
    royaltyTerms: '',
    documents: [],
    newDocName: '',
  })

  const handleAddRightsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRightsForm.name) return

    addRightsRecord({
      assetId: newRightsForm.assetId,
      name: newRightsForm.name,
      category: newRightsForm.category,
      subcategory: newRightsForm.subcategory,
      unit: currentUser.unit,
      rightsType: newRightsForm.rightsType,
      owner: newRightsForm.owner,
      validity: newRightsForm.validity,
      status: newRightsForm.documents.length > 0 ? 'Review' : 'Pending',
      territory: newRightsForm.territory,
      term: '',
      exclusivity: newRightsForm.exclusivity,
      licenceType: newRightsForm.licenceType,
      royaltyTerms: newRightsForm.royaltyTerms,
      thumbType: 'tv_series',
      documents: newRightsForm.documents,
    })

    setIsAddModalOpen(false)
  }

  const filteredRecords = useMemo(() => {
    return rightsRecords.filter((rec) => {
      if (selectedCategory !== 'All Categories' && rec.category !== selectedCategory) return false
      if (selectedRisk !== 'All Risks') {
        const parentAsset = assets.find((a) => a.id === rec.assetId || a.name === rec.name)
        if (parentAsset) {
          const assessment = getAssetRiskAssessment(parentAsset, rightsRecords, approvals)
          if (assessment.level !== selectedRisk) return false
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          rec.name.toLowerCase().includes(q) ||
          rec.id.toLowerCase().includes(q) ||
          rec.rightsType.toLowerCase().includes(q) ||
          rec.owner.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [rightsRecords, selectedCategory, selectedRisk, searchQuery, assets, approvals])

  if (selectedAssetForRightsDetails) {
    return (
      <RightsDetailsPage
        asset={selectedAssetForRightsDetails}
        onBack={() => handleSelectRightsAsset(null)}
        setActiveNav={setActiveNav}
      />
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* FILTER BAR & ACTION */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 p-3.5 shadow-xs flex flex-wrap items-center gap-2.5 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rights records, license types, or owners..."
            className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
          />
        </div>

        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="h-8.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 px-3 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition cursor-pointer"
        >
          <option value="All Risks">All Risk Profiles ({rightsRecords.length})</option>
          <option value="Low">Low Risk ({rightsRiskMetrics.lowCount})</option>
          <option value="Medium">Moderate Risk ({rightsRiskMetrics.mediumCount})</option>
          <option value="High">High Risk ({rightsRiskMetrics.highCount})</option>
          <option value="Critical">Critical Risk ({rightsRiskMetrics.criticalCount})</option>
        </select>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>Add Rights Record</span>
        </button>
      </div>

      {/* RECORDS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 shadow-xs">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="bg-slate-50/75 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 dark:border-white/10 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
              <th className="px-4 py-3">Asset / Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Rights Scope</th>
              <th className="px-4 py-3">Owner / Holder</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Docs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredRecords.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => handleSelectRightsAsset(rec)}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AssetThumbnail type={rec.thumbType} name={rec.name} />
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-blue-400 transition">{rec.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">{rec.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{rec.category}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-white/10 dark:text-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {rec.rightsType || <span className="text-amber-600 dark:text-amber-400 font-semibold italic">Pending Scope</span>}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                  {rec.owner || <span className="text-slate-400 italic">Unregistered</span>}
                </td>
                <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                  {rec.validity || <span className="text-slate-400 italic">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-slate-100 border border-slate-200/80 dark:bg-slate-800 dark:border-white/10 dark:text-slate-300 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {rec.documents?.length || 0} File(s)
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 items-start">
                    <StatusPill status={rec.status as any} />
                    {(() => {
                      const parentAsset = assets.find((a) => a.id === rec.assetId || a.name === rec.name)
                      if (!parentAsset) return null
                      const assessment = getAssetRiskAssessment(parentAsset, rightsRecords, approvals)
                      return (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded border shadow-2xs',
                            assessment.riskBadgeColor
                          )}
                          title={`Risk Score: ${assessment.score}/100 • Compliance: ${100 - assessment.score}%`}
                        >
                          <span>{assessment.level} Risk</span>
                        </span>
                      )
                    })()}
                  </div>
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIndividualDocRecord(rec)
                        setDocTargetScope('individual')
                        const matchingAsset = assets.find((a) => a.id === rec.assetId || a.id === rec.id)
                        const contributors = rec.contributors?.length ? rec.contributors : matchingAsset?.contributors || []
                        if (contributors.length > 0) {
                          setDocAssigneeName(contributors[0].name)
                          setDocAssigneeRole(contributors[0].role || 'Contributing Staff')
                          setIsCustomAssignee(false)
                          setDocTitle(`Talent_Release_${contributors[0].name.replace(/[^a-zA-Z0-9]/g, '_')}_Signed.pdf`)
                        } else {
                          setDocAssigneeName(rec.owner || '')
                          setDocAssigneeRole('Rights Holder')
                          setIsCustomAssignee(true)
                          setDocTitle(`Deed_of_Assignment_${rec.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
                        }
                        setDocType('TALENT_RELEASE')
                        setDocFileSize('1.8 MB')
                        setDocNotes('')
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer"
                      title={`Attach legal document specifically for ${rec.name}`}
                    >
                      <FileUp className="size-3 text-slate-500" />
                      <span>+ Add Doc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectRightsAsset(rec)}
                      className="grid size-7 place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                      title="View governance details"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DYNAMIC ADD RIGHTS RECORD MODAL */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-900 p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                <ShieldCheck className="size-4 text-slate-700 dark:text-slate-300" />
                <span>Add Rights & Governance Record</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRightsSubmit} className="mt-4 space-y-3.5">
              {/* Asset Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Asset *</label>
                <select
                  value={newRightsForm.assetId}
                  onChange={(e) => {
                    const target = assets.find((a) => a.id === e.target.value)
                    if (target) {
                      setNewRightsForm((prev) => ({
                        ...prev,
                        assetId: target.id,
                        name: target.name,
                        category: target.category,
                        subcategory: target.subcategory,
                      }))
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}  —  {a.id}  ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rights Scope / Type *</label>
                <input
                  value={newRightsForm.rightsType}
                  onChange={(e) => setNewRightsForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                  placeholder="e.g. Worldwide Broadcast & Streaming Rights"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Owner / Holder</label>
                  <input
                    value={newRightsForm.owner}
                    onChange={(e) => setNewRightsForm((prev) => ({ ...prev, owner: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Validity Period</label>
                  <input
                    value={newRightsForm.validity}
                    onChange={(e) => setNewRightsForm((prev) => ({ ...prev, validity: e.target.value }))}
                    placeholder="2025 – 2035"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Upload Document Attachment */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/40 p-3.5 space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">Attach Rights Document / Certificate</label>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Document Title (e.g. Master_Copyright_Release.pdf)"
                    value={newRightsForm.newDocName}
                    onChange={(e) => setNewRightsForm((prev) => ({ ...prev, newDocName: e.target.value }))}
                    className="h-8 flex-1 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newRightsForm.newDocName.trim()) return
                      const newDoc: RightsDocument = {
                        id: `doc-${Date.now()}`,
                        name: newRightsForm.newDocName.trim(),
                        size: '1.8 MB',
                        date: 'Sep 25, 2025',
                        type: 'CERT',
                      }
                      setNewRightsForm((prev) => ({
                        ...prev,
                        documents: [...prev.documents, newDoc],
                        newDocName: '',
                      }))
                      showToast(`Document "${newDoc.name}" attached.`)
                    }}
                    className="h-8 rounded-lg bg-blue-600 px-3 font-bold text-white hover:bg-blue-700 text-xs"
                  >
                    + Add File
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {newRightsForm.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-white/10 text-[11px]">
                      <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-blue-600" />
                        <span className="font-semibold text-slate-800 dark:text-white">{doc.name}</span>
                        <span className="text-slate-400">({doc.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNewRightsForm((prev) => ({
                            ...prev,
                            documents: prev.documents.filter((d) => d.id !== doc.id),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 px-3.5 py-2 font-medium text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2 font-medium text-xs text-white shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Save Rights Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED INDIVIDUAL DOCUMENT UPLOAD MODAL */}
      {individualDocRecord && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIndividualDocRecord(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-slate-900 p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:border dark:border-blue-800/50 dark:text-blue-300">
                    <FileUp className="size-4" />
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Attach Legal Document
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Attach an individual talent release, deed, or certificate to <strong className="text-slate-800 dark:text-slate-200">{individualDocRecord.name}</strong> <span className="font-mono text-slate-500 dark:text-slate-400">({individualDocRecord.id})</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIndividualDocRecord(null)}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddIndividualDocSubmit} className="mt-4 space-y-4">
              {/* Document Scope: Individual Contributor vs Asset-Level */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Document Scope *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDocTargetScope('individual')
                      if (individualDocContributors.length > 0) {
                        setDocAssigneeName(individualDocContributors[0].name)
                        setDocAssigneeRole(individualDocContributors[0].role || 'Contributor')
                        setIsCustomAssignee(false)
                        setDocTitle(`Talent_Release_${individualDocContributors[0].name.replace(/[^a-zA-Z0-9]/g, '_')}_Signed.pdf`)
                      }
                      setDocType('TALENT_RELEASE')
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition cursor-pointer',
                      docTargetScope === 'individual'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-700 dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-300 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800'
                    )}
                  >
                    <User className="size-3.5" />
                    <span>Individual Contributor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocTargetScope('asset')
                      setDocAssigneeName('')
                      setDocAssigneeRole('')
                      setDocType('CERT')
                      setDocTitle(`Master_IP_Clearance_Deed_${individualDocRecord.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition cursor-pointer',
                      docTargetScope === 'asset'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-700 dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-300 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800'
                    )}
                  >
                    <Boxes className="size-3.5" />
                    <span>General Asset Level</span>
                  </button>
                </div>
              </div>

              {/* Individual Assignee details */}
              {docTargetScope === 'individual' && (
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/40 p-3 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Select Contributor / Individual *</label>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !isCustomAssignee
                          setIsCustomAssignee(nextVal)
                          if (nextVal) {
                            setDocAssigneeName('')
                            setDocAssigneeRole('')
                          } else if (individualDocContributors.length > 0) {
                            setDocAssigneeName(individualDocContributors[0].name)
                            setDocAssigneeRole(individualDocContributors[0].role || 'Contributor')
                            setDocTitle(`Talent_Release_${individualDocContributors[0].name.replace(/[^a-zA-Z0-9]/g, '_')}_Signed.pdf`)
                          }
                        }}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {isCustomAssignee ? 'Pick from contributors' : '+ Custom / External Talent'}
                      </button>
                    </div>

                    {!isCustomAssignee && individualDocContributors.length > 0 ? (
                      <select
                        value={docAssigneeName}
                        onChange={(e) => {
                          const val = e.target.value
                          setDocAssigneeName(val)
                          const found = individualDocContributors.find((c) => c.name === val)
                          if (found) {
                            setDocAssigneeRole(found.role || 'Contributor')
                            setDocTitle(`Talent_Release_${val.replace(/[^a-zA-Z0-9]/g, '_')}_Signed.pdf`)
                          }
                        }}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400"
                      >
                        {individualDocContributors.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name} — {c.role || 'Contributor'}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={docAssigneeName}
                          onChange={(e) => {
                            setDocAssigneeName(e.target.value)
                            if (e.target.value) {
                              setDocTitle(`Talent_Release_${e.target.value.replace(/[^a-zA-Z0-9]/g, '_')}_Signed.pdf`)
                            }
                          }}
                          placeholder="Individual Name (e.g. John Doe)"
                          className="h-9 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400"
                          required
                        />
                        <input
                          value={docAssigneeRole}
                          onChange={(e) => setDocAssigneeRole(e.target.value)}
                          placeholder="Role (e.g. Voice Actor, Musician)"
                          className="h-9 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Document Category / Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Category *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400"
                  >
                    <option value="TALENT_RELEASE">Talent Release Deed</option>
                    <option value="DEED">Work-for-Hire & Assignment Deed</option>
                    <option value="CERT">IP Filing & Trademark Certificate</option>
                    <option value="LICENSE">Synchronization / Broadcast License</option>
                    <option value="PDF">General Executed Contract (PDF)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">File Size</label>
                  <input
                    value={docFileSize}
                    onChange={(e) => setDocFileSize(e.target.value)}
                    placeholder="e.g. 1.8 MB"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Document Title / File Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document File Name *</label>
                <input
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Talent_Release_Faith_Daniel_Signed.pdf"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400 font-mono text-[11px]"
                  required
                />
              </div>

              {/* File picker */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Local File (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setDocTitle(file.name)
                      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
                      setDocFileSize(`${sizeInMb} MB`)
                    }
                  }}
                  className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Filing Notes / Registration Reference</label>
                <input
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="e.g. Signed in presence of counsel; deposited with media registry."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-slate-400"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIndividualDocRecord(null)}
                  className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 px-3.5 py-2 font-medium text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2 font-semibold text-xs text-white shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Attach Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// RIGHTS DETAILS PAGE (FULL RICH TABS, AUDIT LOGGING & EDIT/ADD)
// -------------------------------------------------------------
function RightsDetailsPage({
  asset,
  onBack,
  setActiveNav,
}: {
  asset: RightsRecord
  onBack: () => void
  setActiveNav?: (nav: string) => void
}) {
  const { updateRightsRecord, addRightsRecord, currentUser, showToast, activities, approvals, addAsset, assets, createApprovalRequest } = useLovetoonsData()
  const [subTab, setSubTab] = useState('Overview & Rights')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddRightsModalOpen, setIsAddRightsModalOpen] = useState(false)
  const [newDocTitle, setNewDocTitle] = useState('')

  // Resolve Category-Specific Compliance Standard Profile
  const complianceProfile = useMemo(() => {
    return getCategoryComplianceProfile(asset.category, asset.name)
  }, [asset.category, asset.name])

  const parentAsset = useMemo(() => {
    return assets.find((a) => a.id === asset.assetId || a.id === asset.id) || (asset as any)
  }, [assets, asset])

  const complianceReadiness = useMemo(() => {
    return evaluateComplianceReadiness(parentAsset, asset, asset.documents || [])
  }, [parentAsset, asset])

  // Existing approval request for this rights record's asset
  const existingApproval = useMemo(() => {
    return approvals.find((a) => a.assetId === (asset.assetId || asset.id))
  }, [approvals, asset.assetId, asset.id])

  const handleScheduleApproval = () => {
    if (!asset.documents || asset.documents.length === 0) {
      showToast(`Cannot schedule approval: ${complianceProfile.clusterLabel} requires at least one executed legal clearance deed.`)
      return
    }

    if (complianceReadiness.missingMandatoryDocs.length > 0) {
      showToast(`Category Mandatory Deed Missing: Please attach "${complianceReadiness.missingMandatoryDocs[0].label}" for ${complianceProfile.clusterLabel}.`)
      return
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Approval Clearance Submission',
      description: `Schedule "${asset.name}" for formal executive clearance review? Legal counsel and reviewer will be alerted, and this request will be permanently logged in the audit trail.`,
      confirmLabel: 'Confirm & Schedule Approval',
      variant: 'primary',
      badge: `${complianceProfile.clusterLabel} Audit`,
      details: (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-slate-700">Target Asset:</span> {asset.name} <span className="font-mono text-slate-500 ml-1.5">({asset.assetId || asset.id})</span></div>
          <div><span className="font-semibold text-slate-700">Category Cluster:</span> {complianceProfile.clusterLabel} ({complianceProfile.inherentLiability} Liability)</div>
          <div><span className="font-semibold text-slate-700">Legal Documents Attached:</span> {asset.documents.length} files verified</div>
          <div><span className="font-semibold text-slate-700">Compliance Score:</span> {complianceReadiness.complianceScore}% ({complianceReadiness.passedGatesCount}/{complianceReadiness.totalGatesCount} gates verified)</div>
          <div><span className="font-semibold text-slate-700">Submitting Officer:</span> {currentUser.name}</div>
        </div>
      ),
      onConfirm: async () => {
        const priority = complianceProfile.inherentLiability === 'Critical' ? 'Urgent' : complianceProfile.inherentLiability === 'High' ? 'High' : 'Medium'
        createApprovalRequest(asset.assetId || asset.id, priority)
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Approval request scheduled for ${asset.name}! Reviewer alerted.`)
      },
    })
  }

  // Document Attachment Form State (Individual Contributor vs Asset-Level)
  const assetContributors: AssetContributor[] = useMemo(() => {
    if (asset.contributors && asset.contributors.length > 0) return asset.contributors
    return parentAsset?.contributors || []
  }, [asset, parentAsset])

  const [detailsDocScope, setDetailsDocScope] = useState<'individual' | 'asset'>(
    assetContributors.length > 0 ? 'individual' : 'asset'
  )
  const [detailsDocAssignee, setDetailsDocAssignee] = useState(assetContributors[0]?.name || '')
  const [detailsDocRole, setDetailsDocRole] = useState(assetContributors[0]?.role || 'Talent / Contributor')
  const [detailsDocType, setDetailsDocType] = useState<RightsDocument['type']>('TALENT_RELEASE')
  const [detailsDocFileSize, setDetailsDocFileSize] = useState('1.8 MB')
  const [detailsDocNotes, setDetailsDocNotes] = useState('')
  const [detailsIsCustomAssignee, setDetailsIsCustomAssignee] = useState(assetContributors.length === 0)

  // Edit Governance Form State
  const [editForm, setEditForm] = useState({
    rightsType: asset.rightsType || '',
    owner: asset.owner || '',
    validity: asset.validity || '',
    territory: asset.territory || '',
    term: asset.term || '',
    exclusivity: asset.exclusivity || '',
    licenceType: asset.licenceType || '',
    royaltyTerms: asset.royaltyTerms || '',
    governanceScore: asset.governanceScore ?? 0,
    status: asset.status || 'Pending',
    description: asset.description || '',
  })

  // Submit Clearance / New Rights Record Form State
  const [addRightsForm, setAddRightsForm] = useState({
    rightsType: '',
    territory: '',
    term: '',
    exclusivity: '',
    licenceType: '',
    royaltyTerms: '',
    docName: '',
  })

  const [checks, setChecks] = useState<GovernanceChecksMap>(() => {
    if (asset.governanceChecks && Object.keys(asset.governanceChecks).length > 0) {
      return asset.governanceChecks
    }
    const initial: GovernanceChecksMap = {}
    complianceProfile.gates.forEach((g) => {
      initial[g.key] = { status: 'PENDING' }
    })
    return initial
  })

  // Scope Configuration & Certificate Modal State
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false)
  const [scopeForm, setScopeForm] = useState({
    rightsType: asset.rightsType || '',
    territory: asset.territory || '',
    term: asset.term || '',
    validity: asset.validity || '',
    exclusivity: asset.exclusivity || '',
    licenceType: asset.licenceType || '',
    royaltyTerms: asset.royaltyTerms || '',
    owner: asset.owner || '',
    description: asset.description || '',
    attachDoc: false,
    docTitle: '',
    docType: 'CERT' as RightsDocument['type'],
    docFileSize: '2.4 MB',
    docRegNumber: '',
    docNotes: '',
  })

  const openScopeModal = () => {
    setScopeForm({
      rightsType: asset.rightsType || 'Worldwide Broadcast & Digital Distribution',
      territory: asset.territory || 'Global / Worldwide',
      term: asset.term || 'In Perpetuity',
      validity: asset.validity || 'Active / Perpetual',
      exclusivity: asset.exclusivity || 'Exclusive Ministry Rights',
      licenceType: asset.licenceType || '100% Ministry Owned',
      royaltyTerms: asset.royaltyTerms || 'Zero Royalty Encumbrance',
      owner: asset.owner || 'Pastor Chelsea Kalu / LoveWorld Kiddies Ministries',
      description: asset.description || '',
      attachDoc: false,
      docTitle: '',
      docType: 'CERT',
      docFileSize: '2.4 MB',
      docRegNumber: '',
      docNotes: '',
    })
    setIsScopeModalOpen(true)
  }

  const handleScopeModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const willAttach = scopeForm.attachDoc && !!scopeForm.docTitle.trim()
    const targetDocName = scopeForm.docTitle.trim() || `Clearance_Certificate_${asset.name.replace(/\s+/g, '_')}.pdf`

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Rights Scope & Certificate Filing',
      description: `Update the legal scope and filing details for "${asset.name}"? This action will update the chain of title and log all modifications in the audit trail.`,
      confirmLabel: 'Confirm & Save Scope',
      variant: 'primary',
      badge: 'Scope Configuration',
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Rights Scope:</span> {scopeForm.rightsType}</div>
          <div><span className="font-semibold text-slate-700">Territory:</span> {scopeForm.territory}</div>
          <div><span className="font-semibold text-slate-700">Term:</span> {scopeForm.term}</div>
          <div><span className="font-semibold text-slate-700">Rights Holder:</span> {scopeForm.owner}</div>
          {willAttach && (
            <div><span className="font-semibold text-emerald-700">Attached Certificate:</span> {targetDocName} ({scopeForm.docType})</div>
          )}
          <div><span className="font-semibold text-slate-700">Authorized By:</span> {currentUser.name}</div>
        </div>
      ),
      onConfirm: () => {
        let updatedDocs = [...(asset.documents || [])]
        if (willAttach) {
          const newDoc: RightsDocument = {
            id: `doc-${Date.now()}`,
            name: targetDocName,
            size: scopeForm.docFileSize || '2.4 MB',
            date: 'Just now',
            type: scopeForm.docType,
            targetScope: 'asset',
            notes: scopeForm.docNotes.trim() || (scopeForm.docRegNumber ? `Filing/Reg #: ${scopeForm.docRegNumber}` : 'Filed via Scope Breakdown Modal'),
          }
          updatedDocs = [newDoc, ...updatedDocs]
        }

        updateRightsRecord({
          ...asset,
          rightsType: scopeForm.rightsType,
          territory: scopeForm.territory,
          term: scopeForm.term,
          validity: scopeForm.validity,
          exclusivity: scopeForm.exclusivity,
          licenceType: scopeForm.licenceType,
          royaltyTerms: scopeForm.royaltyTerms,
          owner: scopeForm.owner,
          description: scopeForm.description,
          documents: updatedDocs,
        })

        setIsScopeModalOpen(false)
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(
          willAttach
            ? `Rights scope updated and certificate "${targetDocName}" attached!`
            : `Rights & governance scope updated for "${asset.name}"!`
        )
      },
    })
  }

  // Gate Clearance & Supporting Document Modal State
  const [selectedGateForModal, setSelectedGateForModal] = useState<GovernanceGateDefinition | null>(null)
  const [gateModalForm, setGateModalForm] = useState({
    status: 'CLEARED' as GovernanceGateStatus,
    notes: '',
    attachDoc: false,
    docTitle: '',
    docType: 'CERT' as RightsDocument['type'],
    docFileSize: '1.8 MB',
  })

  const openGateModal = (gate: GovernanceGateDefinition) => {
    setSelectedGateForModal(gate)
    const current = getGateCheckValue(checks[gate.key])
    setGateModalForm({
      status: current.status,
      notes: current.notes || '',
      attachDoc: !!current.documentName,
      docTitle: current.documentName || '',
      docType: gate.pillar === 'Legal' ? 'DEED' : 'CERT',
      docFileSize: '1.8 MB',
    })
  }

  const handleGateStatusChange = (gate: GovernanceGateDefinition, newStatus: GovernanceGateStatus) => {
    const prevVal = checks[gate.key]
    const currentValObj = getGateCheckValue(prevVal)
    const updatedObj: GovernanceCheckValue = {
      ...currentValObj,
      status: newStatus,
      verifiedAt: newStatus === 'CLEARED' || newStatus === 'EXEMPT' ? 'Just now' : undefined,
      verifiedBy: newStatus === 'CLEARED' || newStatus === 'EXEMPT' ? currentUser.name : undefined,
    }
    const updatedChecks: GovernanceChecksMap = { ...checks, [gate.key]: updatedObj }
    const passedCount = complianceProfile.gates.filter((g) => isGatePassed(updatedChecks[g.key])).length
    const calculatedScore = Math.round((passedCount / Math.max(1, complianceProfile.gates.length)) * 100)

    setConfirmConfig({
      isOpen: true,
      title: `Confirm Gate Status: ${newStatus}`,
      description: `Set clearance status for "${gate.title}" to ${newStatus}? This update will be logged in the permanent audit trail.`,
      confirmLabel: 'Confirm Status Update',
      variant: newStatus === 'CLEARED' ? 'success' : newStatus === 'FLAGGED' ? 'danger' : 'primary',
      badge: `${gate.pillar} Pillar Gate`,
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Governance Gate:</span> {gate.title}</div>
          <div><span className="font-semibold text-slate-700">Cluster:</span> {complianceProfile.clusterLabel}</div>
          <div><span className="font-semibold text-slate-700">New Status:</span> {newStatus}</div>
          <div><span className="font-semibold text-slate-700">Compliance Score:</span> {calculatedScore}% ({passedCount}/{complianceProfile.gates.length} cleared)</div>
          <div><span className="font-semibold text-slate-700">Authorized By:</span> {currentUser.name} ({currentUser.roleLabel})</div>
        </div>
      ),
      onConfirm: () => {
        setChecks(updatedChecks)
        updateRightsRecord({
          ...asset,
          governanceChecks: updatedChecks,
          governanceScore: calculatedScore,
        })
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Gate "${gate.title}" updated to ${newStatus} (${calculatedScore}% Score)`)
      },
    })
  }

  const handleGateModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGateForModal) return

    const gate = selectedGateForModal
    const newStatus = gateModalForm.status
    const willAttach = gateModalForm.attachDoc && !!gateModalForm.docTitle.trim()
    const targetDocName = gateModalForm.docTitle.trim() || `${gate.pillar}_Clearance_${asset.name.replace(/\s+/g, '_')}.pdf`

    const updatedObj: GovernanceCheckValue = {
      status: newStatus,
      notes: gateModalForm.notes.trim() || undefined,
      documentName: willAttach ? targetDocName : undefined,
      verifiedAt: newStatus === 'CLEARED' || newStatus === 'EXEMPT' ? 'Just now' : undefined,
      verifiedBy: newStatus === 'CLEARED' || newStatus === 'EXEMPT' ? currentUser.name : undefined,
    }

    const updatedChecks: GovernanceChecksMap = {
      ...checks,
      [gate.key]: updatedObj,
    }
    const passedCount = complianceProfile.gates.filter((g) => isGatePassed(updatedChecks[g.key])).length
    const calculatedScore = Math.round((passedCount / Math.max(1, complianceProfile.gates.length)) * 100)

    setConfirmConfig({
      isOpen: true,
      title: `Confirm Gate Clearance: ${gate.title}`,
      description: `Save clearance status (${newStatus}) and details for "${gate.title}"? This verification will be logged in the permanent audit trail.`,
      confirmLabel: 'Confirm & Save Gate',
      variant: newStatus === 'CLEARED' ? 'success' : newStatus === 'FLAGGED' ? 'danger' : 'primary',
      badge: `${gate.pillar} Pillar Gate`,
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Governance Gate:</span> {gate.title}</div>
          <div><span className="font-semibold text-slate-700">Clearance Status:</span> {newStatus}</div>
          {gateModalForm.notes && (
            <div><span className="font-semibold text-slate-700">Verification Notes:</span> {gateModalForm.notes}</div>
          )}
          {willAttach && (
            <div><span className="font-semibold text-emerald-700">Supporting Document:</span> {targetDocName}</div>
          )}
          <div><span className="font-semibold text-slate-700">Updated Score:</span> {calculatedScore}% ({passedCount}/{complianceProfile.gates.length} passed)</div>
          <div><span className="font-semibold text-slate-700">Reviewer:</span> {currentUser.name}</div>
        </div>
      ),
      onConfirm: () => {
        let updatedDocs = [...(asset.documents || [])]
        if (willAttach) {
          const newDoc: RightsDocument = {
            id: `doc-${Date.now()}`,
            name: targetDocName,
            size: gateModalForm.docFileSize || '1.8 MB',
            date: 'Just now',
            type: gateModalForm.docType,
            targetScope: 'asset',
            notes: `Supporting evidence for gate "${gate.title}" — Verified by ${currentUser.name}`,
          }
          updatedDocs = [newDoc, ...updatedDocs]
        }

        setChecks(updatedChecks)
        updateRightsRecord({
          ...asset,
          governanceChecks: updatedChecks,
          governanceScore: calculatedScore,
          documents: updatedDocs,
        })

        setSelectedGateForModal(null)
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Gate "${gate.title}" updated to ${newStatus}! (${calculatedScore}% Score)`)
      },
    })
  }

  // Reusable Confirmation Modal State for RightsDetailsPage
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    description: React.ReactNode
    confirmLabel?: string
    variant?: 'primary' | 'danger' | 'warning' | 'success'
    badge?: string
    details?: React.ReactNode
    onConfirm: () => void | Promise<void>
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
  })

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Governance Specifications Modification',
      description: `Save updated governance & licensing terms for "${asset.name}"? All modified clauses will be written to the audit trail.`,
      confirmLabel: 'Confirm & Save Changes',
      variant: 'primary',
      badge: 'Audit Logged',
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Scope:</span> {editForm.rightsType}</div>
          <div><span className="font-semibold text-slate-700">Territory:</span> {editForm.territory}</div>
          <div><span className="font-semibold text-slate-700">Term / Validity:</span> {editForm.validity}</div>
          <div><span className="font-semibold text-slate-700">Status:</span> {editForm.status}</div>
        </div>
      ),
      onConfirm: () => {
        updateRightsRecord({
          ...asset,
          rightsType: editForm.rightsType,
          owner: editForm.owner,
          validity: editForm.validity,
          territory: editForm.territory,
          term: editForm.term,
          exclusivity: editForm.exclusivity,
          licenceType: editForm.licenceType,
          royaltyTerms: editForm.royaltyTerms,
          governanceScore: editForm.governanceScore,
          status: editForm.status,
          description: editForm.description,
        })
        setIsEditModalOpen(false)
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Governance details for "${asset.name}" updated and audit logged!`)
      },
    })
  }

  const handleAddRightsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Rights Clearance Scope Submission',
      description: `Submit new rights scope "${addRightsForm.rightsType}" for clearance review? An approval ticket will be scheduled for Content Reviewers and logged in the audit trail.`,
      confirmLabel: 'Confirm & Submit Scope',
      variant: 'primary',
      badge: 'Audit Trail Enforced',
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Rights Type:</span> {addRightsForm.rightsType}</div>
          <div><span className="font-semibold text-slate-700">Territory:</span> {addRightsForm.territory}</div>
          <div><span className="font-semibold text-slate-700">Term:</span> {addRightsForm.term}</div>
          <div><span className="font-semibold text-slate-700">Document:</span> {addRightsForm.docName}</div>
        </div>
      ),
      onConfirm: () => {
        const hasDoc = !!addRightsForm.docName.trim()
        const newDoc: RightsDocument | null = hasDoc
          ? {
              id: `doc-${Date.now()}`,
              name: addRightsForm.docName.trim(),
              size: '2.5 MB',
              date: 'Just now',
              type: 'LICENSE',
            }
          : null

        addRightsRecord({
          assetId: asset.assetId || asset.id,
          name: `${asset.name} (${addRightsForm.rightsType.split(' ')[0] || 'Scope'})`,
          category: asset.category,
          subcategory: asset.subcategory,
          unit: asset.unit || currentUser.unit,
          rightsType: addRightsForm.rightsType,
          owner: asset.owner || '',
          validity: '',
          status: 'Review',
          territory: addRightsForm.territory,
          term: addRightsForm.term,
          exclusivity: addRightsForm.exclusivity,
          licenceType: addRightsForm.licenceType,
          royaltyTerms: addRightsForm.royaltyTerms,
          thumbType: asset.thumbType,
          governanceScore: hasDoc ? 20 : 0,
          documents: newDoc ? [newDoc] : [],
          governanceChecks: {},
        })

        setIsAddRightsModalOpen(false)
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast('New rights scope submitted! Reviewers will see this in their Approvals queue.')
      },
    })
  }

  const handleAttachDocument = (e: React.FormEvent) => {
    e.preventDefault()
    const targetTitle = newDocTitle.trim() || (
      detailsDocScope === 'individual'
        ? `Talent_Release_${(detailsDocAssignee || 'Contributor').replace(/\s+/g, '_')}_Signed.pdf`
        : `Clearance_Deed_${asset.name.replace(/\s+/g, '_')}.pdf`
    )

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Legal Document Attachment',
      description: `Attach legal document "${targetTitle}" to "${asset.name}"? This certificate upload will be recorded in the audit trail.`,
      confirmLabel: 'Confirm Attachment',
      variant: 'primary',
      badge: 'Audit Logged',
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Document Name:</span> {targetTitle}</div>
          <div><span className="font-semibold text-slate-700">Scope:</span> {detailsDocScope === 'individual' ? `Individual Contributor (${detailsDocAssignee || 'Unassigned'})` : 'Asset-Level Master'}</div>
          {detailsDocScope === 'individual' && detailsDocRole && (
            <div><span className="font-semibold text-slate-700">Designated Role:</span> {detailsDocRole}</div>
          )}
          <div><span className="font-semibold text-slate-700">Document Category:</span> {detailsDocType}</div>
          <div><span className="font-semibold text-slate-700">Asset:</span> {asset.name}</div>
          <div><span className="font-semibold text-slate-700">Uploader:</span> {currentUser.name}</div>
        </div>
      ),
      onConfirm: () => {
        const newDoc: RightsDocument = {
          id: `doc-${Date.now()}`,
          name: targetTitle,
          size: detailsDocFileSize || '1.8 MB',
          date: 'Just now',
          type: detailsDocType,
          targetScope: detailsDocScope,
          assigneeName: detailsDocScope === 'individual' ? detailsDocAssignee.trim() : undefined,
          assigneeRole: detailsDocScope === 'individual' ? detailsDocRole.trim() : undefined,
          notes: detailsDocNotes.trim() || undefined,
        }

        const updatedDocs = [...(asset.documents || []), newDoc]
        updateRightsRecord({
          ...asset,
          documents: updatedDocs,
        })
        setNewDocTitle('')
        setDetailsDocNotes('')
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(
          detailsDocScope === 'individual'
            ? `Talent release document attached for ${detailsDocAssignee || 'contributor'}!`
            : `Legal document "${newDoc.name}" uploaded and attached!`
        )
      },
    })
  }

  const handleDeleteDocument = (docId: string, docName: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Legal Document Removal',
      description: `Remove document "${docName}" from "${asset.name}"? This certificate deletion will be recorded in the governance audit trail.`,
      confirmLabel: 'Remove Document',
      variant: 'danger',
      badge: 'Permanent Modification',
      details: (
        <div className="text-xs space-y-1">
          <div><span className="font-semibold text-slate-700">Document Name:</span> {docName}</div>
          <div><span className="font-semibold text-slate-700">Asset:</span> {asset.name}</div>
          <div><span className="font-semibold text-slate-700">Action:</span> Remove from active rights record</div>
        </div>
      ),
      onConfirm: () => {
        const updatedDocs = (asset.documents || []).filter((d) => d.id !== docId)
        updateRightsRecord({
          ...asset,
          documents: updatedDocs,
        })
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        showToast(`Document "${docName}" removed from records.`)
      },
    })
  }

  const recordActivities = useMemo(() => {
    return activities.filter(
      (act) =>
        act.title.includes(asset.name) ||
        act.subtitle.includes(asset.id) ||
        act.subtitle.includes(asset.name) ||
        act.title.includes('Rights') ||
        act.title.includes('Governance')
    )
  }, [activities, asset.name, asset.id])

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top breadcrumb navigation with prominent Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Rights & Governance</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-1" />
          <button onClick={onBack} className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            <ShieldCheck className="size-3.5" />
            <span>Rights & Governance</span>
          </button>
          <ChevronRight className="size-3 text-slate-400 dark:text-slate-500" />
          <span className="font-bold text-slate-900 dark:text-white">{asset.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {setActiveNav && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', `/assets?asset=${asset.assetId || 'LT-TS-001'}`)
                }
                setActiveNav('Assets')
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Boxes className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span>View Core Asset ↗</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <AssetThumbnail type={asset.thumbType} name={asset.name} posterUrl={(asset as any).posterUrl} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:border dark:border-purple-800/40 dark:text-purple-300 px-2.5 py-0.5 text-[10px] font-bold">{asset.category}</span>
                <span className="rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-white/10 px-2 py-0.5 text-[10px] font-bold">ID: {asset.id}</span>
                <span className={cn(
                  'rounded px-2.5 py-0.5 text-[10px] font-bold',
                  asset.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border dark:border-amber-800/40'
                )}>
                  ★ {asset.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#09245a] dark:text-white pt-1">{asset.name}</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {asset.rightsType || <span className="text-amber-600 dark:text-amber-400 italic font-medium">Unconfigured Rights Scope (Pending Filing)</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Pencil className="size-3.5" />
              <span>Edit Governance Details</span>
            </button>
            <button
              onClick={() => setIsAddRightsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition"
            >
              <Plus className="size-4" />
              <span>+ Add Rights Scope</span>
            </button>
          </div>
        </div>
      </div>

      {/* Approval Scheduling & Documents Readiness Gate */}
      {(!asset.documents || asset.documents.length === 0) ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-950/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-amber-500 text-white grid place-items-center shrink-0 shadow-2xs">
              <ShieldAlert className="size-4.5" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-950 dark:text-amber-200 text-sm">
                Legal Documentation Required Before Approval Scheduling
              </h4>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                This asset will <b>not enter the reviewer approvals queue</b> until executed legal chain of title, script clearances, or talent releases are uploaded.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSubTab('Governance & Clearance')}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Attach Legal Deeds</span>
            </button>
            <div
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800/60 dark:border-white/10 dark:text-slate-500 px-3 py-1.5 text-xs font-medium cursor-not-allowed"
              title="Upload at least one legal clearance document before scheduling approval"
            >
              <Lock className="size-3.5" />
              <span>Schedule Approval</span>
            </div>
          </div>
        </div>
      ) : !existingApproval ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-950/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-emerald-600 text-white grid place-items-center shrink-0 shadow-2xs">
              <FileCheck className="size-4.5" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-950 dark:text-emerald-200 text-sm">
                Clearance Documents Ready for Executive Review
              </h4>
              <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
                {asset.documents.length} legal deeds uploaded and verified. Ready to schedule formal executive review.
              </p>
            </div>
          </div>
          <button
            id="rights-schedule-approval-btn"
            onClick={handleScheduleApproval}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0"
          >
            <Send className="size-3.5" />
            <span>Schedule for Approval Request</span>
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-950/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-blue-600 text-white grid place-items-center shrink-0 shadow-2xs">
              <Clock className="size-4.5" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-950 dark:text-blue-200 text-sm">
                Active Approval Request Scheduled ({existingApproval.priority} Priority)
              </h4>
              <p className="text-xs text-blue-800/90 dark:text-blue-300/90 mt-0.5 leading-relaxed">
                Scheduled by {existingApproval.requesterName || 'Legal Representative'} on {existingApproval.submittedDate}. Status: <b>{existingApproval.status}</b>.
              </p>
            </div>
          </div>
          {setActiveNav && (
            <button
              onClick={() => setActiveNav('Approvals')}
              className="flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0"
            >
              <span>View in Approvals Queue →</span>
            </button>
          )}
        </div>
      )}

      {/* 4 Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 dark:border-white/10 dark:bg-slate-800/50 p-4">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Chain of Title</div>
          <div className={cn(
            "text-xs font-bold mt-0.5",
            (asset.documents?.length || 0) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
          )}>
            {(asset.documents?.length || 0) > 0 ? `Documented & Filed ✓ (${asset.documents?.length} Files)` : 'Pending Documentation (0 Files Attached)'}
          </div>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 dark:border-white/10 dark:bg-slate-800/50 p-4">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Rights Clearance</div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{asset.status}</div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 dark:border-white/10 dark:bg-slate-800/50 p-4">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Territory & Term</div>
          <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
            {asset.territory || asset.term
              ? `${asset.territory || 'Unspecified'}${asset.term ? ` • ${asset.term}` : ''}`
              : <span className="text-amber-600 dark:text-amber-400">Territory & Term Not Filed</span>}
          </div>
        </div>
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 dark:border-white/10 dark:bg-slate-800/50 p-4">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Governance Score</div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-0.5">{asset.governanceScore ?? 0}% Compliant</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/90 px-3 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['Overview & Rights', 'Governance & Clearance', 'Filing Certificates & Legal Contracts', 'Audit History'].map((st) => (
            <button
              key={st}
              id={`rights-subtab-${st.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSubTab(st)}
              className={cn(
                'px-4 py-3.5 text-xs font-bold border-b-2 -mb-[1px] transition cursor-pointer flex items-center gap-2 whitespace-nowrap',
                subTab === st || (st === 'Governance & Clearance' && subTab === 'Governance Checklist') || (st === 'Filing Certificates & Legal Contracts' && subTab === 'Legal Documents')
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <span>{st}</span>
              {st === 'Governance & Clearance' && (
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  (complianceReadiness?.complianceScore || 0) >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                )}>
                  {complianceReadiness?.complianceScore || 0}%
                </span>
              )}
              {st === 'Filing Certificates & Legal Contracts' && (
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  (asset.documents?.length || 0) > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}>
                  {asset.documents?.length || 0} File(s)
                </span>
              )}
              {st === 'Audit History' && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 text-[10px]">
                  {activities.filter(a => a.subtitle?.includes(asset.name) || a.title?.includes(asset.name)).length || 3}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Overview & Rights Sub-Tab */}
      {subTab === 'Overview & Rights' && (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px] items-start">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#09245a] dark:text-white">
                    Rights & Governance Scope Breakdown
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Active legal ownership parameters, territorial bounds, licensing rights, and filing certificates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openScopeModal}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-blue-600/20 transition cursor-pointer shrink-0"
                >
                  <FileUp className="size-3.5" />
                  <span>+ Update Scope & Attach Certificate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div
                  onClick={openScopeModal}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/50 p-4 space-y-1 hover:border-blue-200 dark:hover:border-blue-800/60 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Primary Rights Scope</span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {asset.rightsType || <span className="text-amber-600 dark:text-amber-400 font-semibold italic">Not Configured (Pending Scope Filing)</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {asset.exclusivity || <span className="text-slate-400 italic">No exclusivity terms filed</span>}
                  </div>
                </div>

                <div
                  onClick={openScopeModal}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/50 p-4 space-y-1 hover:border-blue-200 dark:hover:border-blue-800/60 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Territory Clearance</span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {asset.territory || <span className="text-amber-600 dark:text-amber-400 font-semibold italic">Territory Not Filed</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Term: {asset.term || <span className="text-slate-400 italic">Unspecified</span>} {asset.validity ? `(${asset.validity})` : ''}
                  </div>
                </div>

                <div
                  onClick={openScopeModal}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/50 p-4 space-y-1 hover:border-blue-200 dark:hover:border-blue-800/60 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Registered Rights Holder</span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {asset.owner || <span className="text-amber-600 dark:text-amber-400 font-semibold italic">Unregistered (No Holder Assigned)</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Parent Agency: {asset.agency || 'Lovetoons'}</div>
                </div>

                <div
                  onClick={openScopeModal}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/50 p-4 space-y-1 hover:border-blue-200 dark:hover:border-blue-800/60 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Licensing & Royalty Terms</span>
                    <Pencil className="size-3 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {asset.licenceType || <span className="text-amber-600 dark:text-amber-400 font-semibold italic">Unspecified License</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {asset.royaltyTerms || <span className="text-slate-400 italic">No royalty terms configured</span>}
                  </div>
                </div>
              </div>

              {/* Attached Scope Filing Certificates Strip */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-slate-800/40 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                    <span>Attached Scope Filing Certificates & Deeds:</span>
                  </span>
                  <button
                    onClick={() => setSubTab('Filing Certificates & Legal Contracts')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    View all in Filing Repository →
                  </button>
                </div>

                {asset.documents && asset.documents.filter(d => d.type === 'CERT' || d.type === 'LICENSE' || d.targetScope === 'asset').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {asset.documents.filter(d => d.type === 'CERT' || d.type === 'LICENSE' || d.targetScope === 'asset').map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">{doc.name}</div>
                            <div className="text-[10px] text-slate-500">{doc.size} • {doc.date}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast(`Starting download for ${doc.name}...`)}
                          className="shrink-0 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
                    <span>No official filing certificate attached for this rights scope yet.</span>
                    <button
                      onClick={openScopeModal}
                      className="font-bold text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      + Attach Certificate Now
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/40 text-xs">
                <div className="font-bold text-blue-950 dark:text-blue-200 mb-1">Legal Summary & Chain of Title Notes</div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asset.description || 'No legal summary or chain of title notes filed yet. Click \'+ Update Scope & Attach Certificate\' to record legal terms.'}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold text-[#09245a] dark:text-white">Governance Compliance Score</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Compliance Rate</span>
                  <span className="text-blue-700 dark:text-blue-400">{asset.governanceScore ?? 0}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${asset.governanceScore ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-white/10 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Attached Documents</span>
                  <b className="text-slate-900 dark:text-white">{asset.documents?.length || 0} File(s)</b>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Current Clearance Status</span>
                  <b className="text-emerald-700 dark:text-emerald-400">{asset.status}</b>
                </div>
              </div>

              <button
                onClick={openScopeModal}
                className="w-full rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 p-2.5 text-xs font-bold transition cursor-pointer"
              >
                Configure Scope & Attach Certificate
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Modify Governance Controls
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 2. Governance & Clearance Sub-Tab */}
      {(subTab === 'Governance & Clearance' || subTab === 'Governance Checklist') && (
        <div className="space-y-6">
          {/* Approval Scheduling & Documents Readiness Gate */}
          {(!asset.documents || asset.documents.length === 0) ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-950/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-amber-500 text-white grid place-items-center shrink-0 shadow-2xs">
                  <ShieldAlert className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-950 dark:text-amber-200 text-sm">
                    Executive Clearance Review Gate: Documentation Required
                  </h4>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                    This asset will <b>not enter the reviewer approvals queue</b> until executed legal chain of title, script clearances, or talent releases are uploaded in the Filing Certificates repository.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSubTab('Filing Certificates & Legal Contracts')}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Attach Legal Deeds</span>
                </button>
                <div
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800/60 dark:border-white/10 dark:text-slate-500 px-3 py-1.5 text-xs font-medium cursor-not-allowed"
                  title="Upload at least one legal clearance document before scheduling approval"
                >
                  <Lock className="size-3.5" />
                  <span>Approval Locked (0 Deeds)</span>
                </div>
              </div>
            </div>
          ) : !existingApproval ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-950/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-emerald-600 text-white grid place-items-center shrink-0 shadow-2xs">
                  <FileCheck className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-950 dark:text-emerald-200 text-sm">
                    Clearance Documents Verified & Ready for Executive Sign-off
                  </h4>
                  <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
                    {asset.documents.length} legal deeds uploaded and verified. Ready to schedule formal executive clearance review.
                  </p>
                </div>
              </div>
              <button
                id="rights-schedule-approval-tab-btn"
                onClick={handleScheduleApproval}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0"
              >
                <Send className="size-3.5" />
                <span>Schedule for Approval Request</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-950/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-blue-600 text-white grid place-items-center shrink-0 shadow-2xs">
                  <Clock className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-950 dark:text-blue-200 text-sm">
                    Active Approval Request Scheduled ({existingApproval.priority} Priority)
                  </h4>
                  <p className="text-xs text-blue-800/90 dark:text-blue-300/90 mt-0.5 leading-relaxed">
                    Scheduled by {existingApproval.requesterName || 'Legal Representative'} on {existingApproval.submittedDate}. Status: <b>{existingApproval.status}</b>.
                  </p>
                </div>
              </div>
              {setActiveNav && (
                <button
                  onClick={() => setActiveNav('Approvals')}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0"
                >
                  <span>View in Approvals Queue →</span>
                </button>
              )}
            </div>
          )}

          {/* Ministry Governance & Content Clearance Checklist Hub */}
          <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3.5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[#09245a] dark:text-white text-sm">Ministry Governance & Content Clearance Checklist</h3>
                  <span className="rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800/40 px-2.5 py-0.5 text-[10px] font-bold">
                    {complianceProfile.clusterLabel}
                  </span>
                  <span className={cn(
                    'rounded-md px-2 py-0.5 text-[10px] font-bold',
                    complianceProfile.inherentLiability === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                    complianceProfile.inherentLiability === 'High' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  )}>
                    {complianceProfile.inherentLiability} Liability Profile
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Standard: <span className="font-semibold text-slate-700 dark:text-slate-300">{complianceProfile.standardsReference}</span> — {complianceProfile.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300 px-3 py-1 text-xs font-bold">
                  Score: {complianceReadiness.complianceScore}% ({complianceReadiness.passedGatesCount}/{complianceReadiness.totalGatesCount} Cleared)
                </span>
              </div>
            </div>

            {/* Dynamic Category Gates with Select Options and Proof Modals */}
            <div className="space-y-3 text-xs">
              {complianceProfile.gates.map((gate) => {
                const gateVal = checks[gate.key]
                const gateStatus = getGateStatus(gateVal)
                const gateObj = getGateCheckValue(gateVal)

                return (
                  <div
                    key={gate.key}
                    className={cn(
                      'rounded-xl border p-3.5 transition space-y-2.5',
                      gateStatus === 'CLEARED'
                        ? 'border-emerald-200/90 bg-emerald-50/40 dark:border-emerald-800/40 dark:bg-emerald-950/20'
                        : gateStatus === 'FLAGGED'
                        ? 'border-rose-200/90 bg-rose-50/40 dark:border-rose-800/40 dark:bg-rose-950/20'
                        : gateStatus === 'IN_REVIEW'
                        ? 'border-blue-200/90 bg-blue-50/40 dark:border-blue-800/40 dark:bg-blue-950/20'
                        : gateStatus === 'EXEMPT'
                        ? 'border-slate-200/80 bg-slate-100/60 dark:border-white/10 dark:bg-slate-800/40'
                        : 'border-slate-200/80 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/50'
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                              gate.pillar === 'Doctrinal' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' :
                              gate.pillar === 'ChildSafety' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                              gate.pillar === 'Legal' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            )}
                          >
                            {gate.pillar} Pillar
                          </span>
                          {gate.mandatory && (
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                              * Mandatory
                            </span>
                          )}
                          <div className="font-semibold text-slate-900 dark:text-white text-xs">{gate.title}</div>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{gate.desc}</div>
                      </div>

                      {/* Right controls: Select Status Option + Modal Action */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <select
                          value={gateStatus}
                          onChange={(e) => handleGateStatusChange(gate, e.target.value as GovernanceGateStatus)}
                          className={cn(
                            'h-8.5 rounded-lg px-2.5 text-xs font-bold border transition cursor-pointer outline-none shadow-2xs',
                            gateStatus === 'CLEARED'
                              ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
                              : gateStatus === 'IN_REVIEW'
                              ? 'border-blue-300 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700'
                              : gateStatus === 'FLAGGED'
                              ? 'border-rose-300 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700'
                              : gateStatus === 'EXEMPT'
                              ? 'border-slate-300 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                              : 'border-amber-300 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                          )}
                        >
                          <option value="CLEARED">Cleared ✓</option>
                          <option value="IN_REVIEW">Under Review ⏱</option>
                          <option value="PENDING">Pending Clearance ⚠️</option>
                          <option value="EXEMPT">Exempt / N/A —</option>
                          <option value="FLAGGED">Flagged / Action Needed ❌</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => openGateModal(gate)}
                          className="flex items-center gap-1.5 h-8.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 hover:bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition shadow-2xs cursor-pointer shrink-0"
                          title="Attach clearance certificate, document proof, or verification notes"
                        >
                          <FileUp className="size-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{gateObj.documentName ? 'Proof Attached ✓' : 'Add Proof / Notes'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Reviewer Note / Attached Proof pill */}
                    {(gateObj.notes || gateObj.documentName || gateObj.verifiedBy) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-white/5 text-[11px]">
                        {gateObj.verifiedBy && (
                          <span className="text-slate-500 dark:text-slate-400">
                            Verified by <b>{gateObj.verifiedBy}</b> {gateObj.verifiedAt ? `(${gateObj.verifiedAt})` : ''}
                          </span>
                        )}
                        {gateObj.notes && (
                          <span className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/80 dark:border-white/10">
                            Note: {gateObj.notes}
                          </span>
                        )}
                        {gateObj.documentName && (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 font-semibold">
                            <FileCheck className="size-3" />
                            <span>Proof Doc: {gateObj.documentName}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Filing Certificates & Legal Contracts Sub-Tab */}
      {(subTab === 'Filing Certificates & Legal Contracts' || subTab === 'Legal Documents') && (
        <div className="space-y-6">
          {/* Legal Documents & Deeds Hub */}
          <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-[#09245a] dark:text-white text-base">Filing Certificates & Legal Contracts</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Official certificates of registration, talent releases, work-for-hire deeds, broadcast agreements, and compliance test records.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300 px-3 py-1 text-xs font-bold">
                  {asset.documents?.length || 0} Total Document(s)
                </span>
              </div>
            </div>

            {/* Category Mandatory Deeds Requirements Strip */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-slate-800/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Mandatory Legal Clearances for {complianceProfile.clusterLabel}:</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {complianceReadiness.missingMandatoryDocs.length === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">All Category Deeds Verified ✓</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{complianceReadiness.missingMandatoryDocs.length} Mandatory Deed(s) Missing</span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {complianceProfile.requiredDocuments.map((reqDoc, idx) => {
                  const hasDoc = (asset.documents || []).some(
                    (d) =>
                      d.type === reqDoc.type ||
                      d.name.toLowerCase().includes(reqDoc.label.toLowerCase()) ||
                      d.name.toLowerCase().includes(reqDoc.type.toLowerCase())
                  )
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'rounded-lg border p-2 text-xs flex items-center justify-between gap-2',
                        hasDoc
                          ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
                          : reqDoc.mandatory
                            ? 'border-amber-200 bg-amber-50/70 dark:border-amber-800/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300'
                            : 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      )}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{reqDoc.label}</div>
                        <div className="text-[10px] opacity-80 truncate">{reqDoc.desc}</div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold">
                        {hasDoc ? 'Attached ✓' : reqDoc.mandatory ? 'Required *' : 'Optional'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contributor Talent Releases Strip */}
            {assetContributors.length > 0 && (
              <div className="rounded-xl border border-purple-100 bg-purple-50/40 dark:border-purple-900/30 dark:bg-purple-950/20 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-purple-950 dark:text-purple-300 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <User className="size-3 text-purple-600 dark:text-purple-400" />
                    <span>Individual Contributor Release Auditing ({assetContributors.length} Credited):</span>
                  </span>
                  <span>
                    {complianceReadiness.missingContributorReleases.length === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">All Talent Released ✓</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {complianceReadiness.missingContributorReleases.length} Release(s) Pending
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {assetContributors.map((c: AssetContributor, i: number) => {
                    const hasRelease = (asset.documents || []).some(
                      (d) =>
                        (d.type === 'TALENT_RELEASE' || d.type === 'DEED') &&
                        (d.assigneeName?.toLowerCase() === c.name.toLowerCase() ||
                          d.name.toLowerCase().includes(c.name.toLowerCase()))
                    )
                    return (
                      <span
                        key={i}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border',
                          hasRelease
                            ? 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40'
                            : 'border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40'
                        )}
                      >
                        <span>{c.name} ({c.role}):</span>
                        <b>{hasRelease ? 'Released ✓' : 'Pending Deed'}</b>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Attach Document Form */}
            <form onSubmit={handleAttachDocument} className="rounded-xl border border-blue-100 bg-blue-50/40 dark:border-white/10 dark:bg-slate-800/50 p-4 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100/70 dark:border-white/10 pb-2.5">
                <div className="font-bold text-[#09245a] dark:text-white flex items-center gap-1.5">
                  <FileUp className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>Attach Legal Document to Record</span>
                </div>

                {/* Target Scope Toggle */}
                <div className="inline-flex rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailsDocScope('individual')
                      setDetailsDocType('TALENT_RELEASE')
                    }}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-bold transition cursor-pointer',
                      detailsDocScope === 'individual'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    )}
                  >
                    <User className="size-3" />
                    <span>Individual Contributor / Talent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDetailsDocScope('asset')
                      setDetailsDocType('CERT')
                    }}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-bold transition cursor-pointer',
                      detailsDocScope === 'asset'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    )}
                  >
                    <ShieldCheck className="size-3" />
                    <span>Asset-Level Master Document</span>
                  </button>
                </div>
              </div>

              {/* Individual Contributor Selector */}
              {detailsDocScope === 'individual' && (
                <div className="rounded-lg border border-purple-100 bg-white dark:border-purple-900/40 dark:bg-slate-900/90 p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-purple-900 dark:text-purple-300">Designated Contributor / Talent</label>
                    {assetContributors.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setDetailsIsCustomAssignee(!detailsIsCustomAssignee)}
                        className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        {detailsIsCustomAssignee ? 'Pick from asset credits' : '+ Custom talent name'}
                      </button>
                    )}
                  </div>

                  {!detailsIsCustomAssignee && assetContributors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <select
                          value={detailsDocAssignee}
                          onChange={(e) => {
                            const val = e.target.value
                            setDetailsDocAssignee(val)
                            const found = assetContributors.find((c: AssetContributor) => c.name === val)
                            if (found) setDetailsDocRole(found.role)
                          }}
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-purple-400"
                        >
                          {assetContributors.map((c: AssetContributor, idx: number) => (
                            <option key={idx} value={c.name}>
                              {c.name} — {c.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          value={detailsDocRole}
                          onChange={(e) => setDetailsDocRole(e.target.value)}
                          placeholder="Talent role (e.g. Lead Voice Actor, Illustrator)"
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs text-slate-800 outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <input
                          value={detailsDocAssignee}
                          onChange={(e) => setDetailsDocAssignee(e.target.value)}
                          placeholder="Talent or Contributor full name..."
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs text-slate-800 outline-none focus:border-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <input
                          value={detailsDocRole}
                          onChange={(e) => setDetailsDocRole(e.target.value)}
                          placeholder="Role (e.g. Performer, Music Producer, Animator)..."
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs text-slate-800 outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Document Details: Type, File Picker, Title & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Document Category</label>
                  <select
                    value={detailsDocType}
                    onChange={(e) => setDetailsDocType(e.target.value as any)}
                    className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-400"
                  >
                    <option value="TALENT_RELEASE">Talent Release Deed (Performer/Voice)</option>
                    <option value="DEED">Work-for-Hire Assignment Deed</option>
                    <option value="CERT">IP Filing Certificate / Copyright</option>
                    <option value="LICENSE">License / Sync Agreement</option>
                    <option value="CONTRACT">General Production Contract</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Document File or Title</label>
                  <div className="flex items-center gap-2">
                    <input
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder={
                        detailsDocScope === 'individual'
                          ? `Talent_Release_${(detailsDocAssignee || 'Contributor').replace(/\s+/g, '_')}_Signed.pdf`
                          : `Clearance_Deed_${asset.name.replace(/\s+/g, '_')}.pdf`
                      }
                      className="h-8.5 flex-1 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                    />
                    <label className="inline-flex items-center gap-1.5 h-8.5 cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 shrink-0">
                      <UploadCloud className="size-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Browse</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setNewDocTitle(file.name)
                            const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
                            setDetailsDocFileSize(`${sizeMb} MB`)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <input
                  value={detailsDocNotes}
                  onChange={(e) => setDetailsDocNotes(e.target.value)}
                  placeholder="Optional governance notes / clauses cleared (e.g. Worldwide, in perpetuity, verified ID on record)..."
                  className="h-8.5 w-full sm:flex-1 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="h-8.5 w-full sm:w-auto rounded-lg bg-blue-600 px-4 font-bold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition shadow-2xs shrink-0 cursor-pointer"
                >
                  + Attach Document
                </button>
              </div>
            </form>

            {/* Document List */}
            <div className="space-y-2.5 text-xs">
              {asset.documents && asset.documents.length > 0 ? (
                asset.documents.map((d) => (
                  <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/10 p-3.5 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-lg font-bold text-[10px]",
                        d.targetScope === 'individual' || d.assigneeName ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      )}>
                        {d.targetScope === 'individual' || d.type === 'TALENT_RELEASE' ? (
                          <User className="size-4" />
                        ) : d.type === 'DEED' ? (
                          <FileCheck className="size-4" />
                        ) : d.type === 'CERT' ? (
                          <ShieldCheck className="size-4" />
                        ) : d.type === 'LICENSE' ? (
                          <ScrollText className="size-4" />
                        ) : (
                          <FileText className="size-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">{d.name}</span>
                          <span className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                            d.type === 'TALENT_RELEASE' ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 dark:border dark:border-purple-800/40" :
                              d.type === 'DEED' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border dark:border-emerald-800/40" :
                                d.type === 'CERT' ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:border dark:border-blue-800/40" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-white/10"
                          )}>
                            {d.type ? d.type.replace('_', ' ') : 'PDF'}
                          </span>
                          {d.assigneeName && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800/40 dark:text-purple-300 px-2 py-0.5 text-[10px] font-semibold">
                              <User className="size-2.5" />
                              <span>Individual: {d.assigneeName} {d.assigneeRole ? `(${d.assigneeRole})` : ''}</span>
                            </span>
                          )}
                          {d.targetScope === 'asset' && !d.assigneeName && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300 px-2 py-0.5 text-[10px] font-semibold">
                              Asset-Level Master
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400">
                          {d.size} • Uploaded on {d.date}
                          {d.notes ? ` • Note: ${d.notes}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => showToast(`Starting download for ${d.name}...`)}
                        className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs text-xs cursor-pointer"
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(d.id, d.name)}
                        className="rounded-lg border border-red-200 bg-white dark:border-red-500/30 dark:bg-rose-950/30 dark:text-red-400 dark:hover:bg-rose-950/60 p-1.5 font-bold text-red-600 hover:bg-red-50 transition shadow-2xs cursor-pointer"
                        title="Delete document"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:border dark:border-white/5 rounded-xl">
                  No legal documents attached yet. Use the upload box above to add talent release deeds or filing certificates.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Audit History Sub-Tab */}
      {subTab === 'Audit History' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="font-bold text-[#09245a] dark:text-white text-sm">Governance Audit Log & Activity Trail</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Immutable record of modifications, reviews, status changes, and administrator edits.</p>
          </div>

          <div className="space-y-3 text-xs">
            {recordActivities.length > 0 ? (
              recordActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-white/10 p-3.5 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className={cn('grid size-7 place-items-center rounded-lg text-xs shrink-0', act.color)}>
                    <Shield className="size-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">{act.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{act.subtitle}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{act.time} • by {act.user} ({act.unit || 'Platform Admin'})</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:border dark:border-white/5 rounded-xl">
                No previous changes logged for this record. Any edits made will appear here automatically.
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT GOVERNANCE MODAL */}
      {isEditModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#09245a] dark:text-white text-sm">
                <Pencil className="size-4 text-blue-600 dark:text-blue-400" />
                <span>Edit Governance & Rights Details</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rights Scope / Title</label>
                <input
                  value={editForm.rightsType}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                  placeholder="e.g. Worldwide Broadcast & Streaming (or leave unassigned)"
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rights Holder / Owner</label>
                  <input
                    value={editForm.owner}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, owner: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clearance Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  >
                    <option value="Cleared">Cleared</option>
                    <option value="Review">Under Review</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                  <input
                    value={editForm.territory}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, territory: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Term / Validity</label>
                  <input
                    value={editForm.validity}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, validity: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Exclusivity</label>
                  <input
                    value={editForm.exclusivity}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, exclusivity: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Licence Type</label>
                  <input
                    value={editForm.licenceType}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, licenceType: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Royalty Terms</label>
                <input
                  value={editForm.royaltyTerms}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, royaltyTerms: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Legal Description & Notes</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white p-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm transition cursor-pointer"
                >
                  Save & Log Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT RIGHTS CLEARANCE / ADD RIGHTS SCOPE MODAL */}
      {isAddRightsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddRightsModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#09245a] dark:text-white text-sm">
                <Plus className="size-4 text-blue-600 dark:text-blue-400" />
                <span>Submit Rights Scope for {asset.name}</span>
              </div>
              <button
                onClick={() => setIsAddRightsModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRightsSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New Rights Scope / Type *</label>
                <input
                  value={addRightsForm.rightsType}
                  onChange={(e) => setAddRightsForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                  placeholder="e.g. Worldwide Merchandising & Digital Licensing"
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                  <input
                    value={addRightsForm.territory}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, territory: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Term Duration</label>
                  <input
                    value={addRightsForm.term}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, term: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Exclusivity</label>
                  <input
                    value={addRightsForm.exclusivity}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, exclusivity: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Licence Type</label>
                  <input
                    value={addRightsForm.licenceType}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, licenceType: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Royalty Split / Financial Terms</label>
                <input
                  value={addRightsForm.royaltyTerms}
                  onChange={(e) => setAddRightsForm((prev) => ({ ...prev, royaltyTerms: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Supporting Document File</label>
                <input
                  value={addRightsForm.docName}
                  onChange={(e) => setAddRightsForm((prev) => ({ ...prev, docName: e.target.value }))}
                  placeholder="e.g. Licensing_Agreement_Draft.pdf"
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300 p-3">
                <b>Note for Review Workflow:</b> Submitting this rights clearance automatically adds an entry to the Approvals Queue for Lead Reviewers and Super Admins to verify.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddRightsModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm transition cursor-pointer"
                >
                  Submit for Clearance Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. INDIVIDUAL CONCISE MODAL: RIGHTS & GOVERNANCE SCOPE & CERTIFICATE */}
      {isScopeModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsScopeModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2 font-bold text-[#09245a] dark:text-white text-base">
                  <ScrollText className="size-4.5 text-blue-600 dark:text-blue-400" />
                  <span>Rights & Governance Scope Configuration</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Update legal scope dimensions and attach official filing certificates for <b>{asset.name}</b>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScopeModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleScopeModalSubmit} className="space-y-4">
              {/* Section 1: Scope Specifications */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  1. Legal Scope & Licensing Terms
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Rights Scope *</label>
                    <input
                      value={scopeForm.rightsType}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                      placeholder="e.g. Worldwide Broadcast & Digital Distribution"
                      className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Exclusivity</label>
                    <select
                      value={scopeForm.exclusivity}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, exclusivity: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                    >
                      <option value="Exclusive Ministry Rights">Exclusive Ministry Rights</option>
                      <option value="Non-Exclusive Ministry License">Non-Exclusive Ministry License</option>
                      <option value="Sole Distributor Rights">Sole Distributor Rights</option>
                      <option value="Co-Exclusive Partnership">Co-Exclusive Partnership</option>
                      <option value="Unrestricted Public Domain">Unrestricted Public Domain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Territory Clearance *</label>
                    <input
                      value={scopeForm.territory}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, territory: e.target.value }))}
                      placeholder="e.g. Worldwide / Global, Sub-Saharan Africa"
                      className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Term / Duration *</label>
                    <input
                      value={scopeForm.term}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, term: e.target.value }))}
                      placeholder="e.g. In Perpetuity, 5 Years with Auto-Renewal"
                      className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Registered Rights Holder / Owner</label>
                    <input
                      value={scopeForm.owner}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, owner: e.target.value }))}
                      placeholder="e.g. Pastor Chelsea Kalu / LoveWorld Kiddies Ministries"
                      className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Licence Type</label>
                    <select
                      value={scopeForm.licenceType}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, licenceType: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                    >
                      <option value="100% Ministry Owned">100% Ministry Owned</option>
                      <option value="Work-for-Hire Assignment">Work-for-Hire Assignment</option>
                      <option value="Master License Agreement">Master License Agreement</option>
                      <option value="Royalty-Free Perpetual">Royalty-Free Perpetual</option>
                      <option value="Commercial Syndication">Commercial Syndication</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Royalty & Financial Terms</label>
                  <input
                    value={scopeForm.royaltyTerms}
                    onChange={(e) => setScopeForm((prev) => ({ ...prev, royaltyTerms: e.target.value }))}
                    placeholder="e.g. Zero Royalty Encumbrance — 100% Retained by Ministry"
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Legal Summary & Chain of Title Notes</label>
                  <textarea
                    value={scopeForm.description}
                    onChange={(e) => setScopeForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Legal history, chain of title, script sign-offs, and administrative records..."
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white p-2.5 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Section 2: Attach Official Certificate or Filing Document */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="scope-attach-doc-checkbox"
                      checked={scopeForm.attachDoc}
                      onChange={(e) => setScopeForm((prev) => ({ ...prev, attachDoc: e.target.checked }))}
                      className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="scope-attach-doc-checkbox" className="font-bold text-blue-950 dark:text-blue-200 cursor-pointer text-xs">
                      Attach Official Filing Certificate / Legal Deed Document Now
                    </label>
                  </div>
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                    Auto-files into Filing Repository
                  </span>
                </div>

                {scopeForm.attachDoc && (
                  <div className="space-y-3 pt-2 border-t border-blue-100 dark:border-blue-900/40 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Certificate / Document Title *</label>
                        <input
                          value={scopeForm.docTitle}
                          onChange={(e) => setScopeForm((prev) => ({ ...prev, docTitle: e.target.value }))}
                          placeholder={`Certificate_${asset.name.replace(/\s+/g, '_')}_Official.pdf`}
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                          required={scopeForm.attachDoc}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Category</label>
                        <select
                          value={scopeForm.docType}
                          onChange={(e) => setScopeForm((prev) => ({ ...prev, docType: e.target.value as any }))}
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                        >
                          <option value="CERT">IP Filing Certificate / Trademark</option>
                          <option value="LICENSE">Master License / Sync Agreement</option>
                          <option value="DEED">Work-for-Hire Assignment Deed</option>
                          <option value="CONTRACT">General Production Contract</option>
                          <option value="TALENT_RELEASE">Talent Release Deed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Filing / Registration Ref # (Optional)</label>
                        <input
                          value={scopeForm.docRegNumber}
                          onChange={(e) => setScopeForm((prev) => ({ ...prev, docRegNumber: e.target.value }))}
                          placeholder="e.g. TM-2026-99482 / COP-1049"
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Browse Physical File</label>
                        <label className="flex items-center justify-center gap-1.5 h-8.5 cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-50 px-3 text-xs font-semibold text-slate-700">
                          <UploadCloud className="size-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Choose PDF or Document</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setScopeForm((prev) => ({
                                  ...prev,
                                  docTitle: file.name,
                                  docFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                                }))
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsScopeModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm transition cursor-pointer"
                >
                  Save Scope & Attach Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CONCISE MODAL: GATE CLEARANCE & SUPPORTING DOCUMENT */}
      {selectedGateForModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedGateForModal(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                    selectedGateForModal.pillar === 'Doctrinal' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' :
                    selectedGateForModal.pillar === 'ChildSafety' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                    selectedGateForModal.pillar === 'Legal' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                  )}>
                    {selectedGateForModal.pillar} Pillar Gate
                  </span>
                  {selectedGateForModal.mandatory && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      * Mandatory
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-[#09245a] dark:text-white text-base mt-1">
                  {selectedGateForModal.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedGateForModal.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGateForModal(null)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleGateModalSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clearance Gate Status *</label>
                <select
                  value={gateModalForm.status}
                  onChange={(e) => setGateModalForm((prev) => ({ ...prev, status: e.target.value as GovernanceGateStatus }))}
                  className={cn(
                    'h-9 w-full rounded-lg px-3 text-xs font-bold border transition outline-none shadow-2xs',
                    gateModalForm.status === 'CLEARED'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : gateModalForm.status === 'IN_REVIEW'
                      ? 'border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      : gateModalForm.status === 'FLAGGED'
                      ? 'border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      : gateModalForm.status === 'EXEMPT'
                      ? 'border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                  )}
                >
                  <option value="CLEARED">Cleared / Verified ✓</option>
                  <option value="IN_REVIEW">Under Review / In Progress ⏱</option>
                  <option value="PENDING">Pending Clearance ⚠️</option>
                  <option value="EXEMPT">Exempt / Not Applicable —</option>
                  <option value="FLAGGED">Flagged / Action Required ❌</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reviewer Verification Notes / Sign-Off Comments</label>
                <textarea
                  value={gateModalForm.notes}
                  onChange={(e) => setGateModalForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder={`e.g. Theological review verified by ${currentUser.name}. Script checked for doctrinal consistency on ${new Date().toLocaleDateString('en-GB')}.`}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white p-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              {/* Attach Supporting Clearance Document */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="gate-attach-doc-checkbox"
                      checked={gateModalForm.attachDoc}
                      onChange={(e) => setGateModalForm((prev) => ({ ...prev, attachDoc: e.target.checked }))}
                      className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="gate-attach-doc-checkbox" className="font-bold text-blue-950 dark:text-blue-200 cursor-pointer text-xs">
                      Attach Supporting Clearance Proof / Document
                    </label>
                  </div>
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                    Evidence Verification
                  </span>
                </div>

                {gateModalForm.attachDoc && (
                  <div className="space-y-3 pt-2 border-t border-blue-100 dark:border-blue-900/40 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Title *</label>
                        <input
                          value={gateModalForm.docTitle}
                          onChange={(e) => setGateModalForm((prev) => ({ ...prev, docTitle: e.target.value }))}
                          placeholder={`${selectedGateForModal.pillar}_Proof_${asset.name.replace(/\s+/g, '_')}.pdf`}
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                          required={gateModalForm.attachDoc}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Category</label>
                        <select
                          value={gateModalForm.docType}
                          onChange={(e) => setGateModalForm((prev) => ({ ...prev, docType: e.target.value as any }))}
                          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-2.5 text-xs outline-none focus:border-blue-400"
                        >
                          <option value="CERT">Clearance Certificate / Report</option>
                          <option value="DEED">Signed Deed / Assignment</option>
                          <option value="TALENT_RELEASE">Talent Release Form</option>
                          <option value="LICENSE">License / Agreement</option>
                          <option value="CONTRACT">Review Contract / Protocol</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload File Proof</label>
                      <label className="flex items-center justify-center gap-1.5 h-8.5 cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-50 px-3 text-xs font-semibold text-slate-700">
                        <UploadCloud className="size-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Choose Supporting PDF / File</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setGateModalForm((prev) => ({
                                ...prev,
                                docTitle: file.name,
                                docFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                              }))
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedGateForModal(null)}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm transition cursor-pointer"
                >
                  Save Gate Clearance & Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Confirmation Modal for RightsDetailsPage */}
      <ConfirmActionModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmLabel={confirmConfig.confirmLabel}
        variant={confirmConfig.variant}
        badge={confirmConfig.badge}
        details={confirmConfig.details}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// APPROVALS PAGE (ROLE PROTECTED - REVIEWER & SUPER ADMIN ONLY)
// -------------------------------------------------------------
function ApprovalsPage() {
  return <ApprovalsWorkflow />
}

// -------------------------------------------------------------
// RELATIONSHIPS PAGE
// -------------------------------------------------------------
// -------------------------------------------------------------
// RELATIONSHIPS PAGE
// -------------------------------------------------------------
function RelationshipsPage() {
  const { relationships, addRelationship, deleteRelationship, assets, showToast } = useLovetoonsData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRelType, setSelectedRelType] = useState('All Types')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form State
  const [sourceId, setSourceId] = useState(assets[0]?.id || '')
  const [targetId, setTargetId] = useState(assets[1]?.id || '')
  const [relType, setRelType] = useState<RelationshipItem['relationshipType']>('Used In')
  const [relDetails, setRelDetails] = useState('')

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sourceAsset = assets.find((a) => a.id === sourceId)
    const targetAsset = assets.find((a) => a.id === targetId)

    if (!sourceAsset || !targetAsset) {
      showToast('Please select valid source and target assets')
      return
    }

    if (sourceAsset.id === targetAsset.id) {
      showToast('Source and Target assets must be different')
      return
    }

    addRelationship({
      sourceAssetId: sourceAsset.id,
      sourceAsset: sourceAsset.name,
      sourceId: sourceAsset.id,
      sourceIconType: sourceAsset.thumbType || 'tv_series',
      relationshipType: relType,
      targetAssetId: targetAsset.id,
      targetAsset: targetAsset.name,
      targetId: targetAsset.id,
      targetIconType: targetAsset.thumbType || 'tv_series',
      details: relDetails || `${sourceAsset.name} ${relType.toLowerCase()} ${targetAsset.name}`,
      category: sourceAsset.category,
    })

    showToast(`Linked "${sourceAsset.name}" to "${targetAsset.name}"`)
    setIsAddModalOpen(false)
    setRelDetails('')
  }

  const filtered = useMemo(() => {
    return relationships.filter((r) => {
      if (selectedRelType !== 'All Types' && r.relationshipType !== selectedRelType) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          r.sourceAsset.toLowerCase().includes(q) ||
          r.targetAsset.toLowerCase().includes(q) ||
          r.relationshipType.toLowerCase().includes(q) ||
          r.details.toLowerCase().includes(q) ||
          r.sourceId.toLowerCase().includes(q) ||
          r.targetId.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [relationships, searchQuery, selectedRelType])

  const relTypeOptions: RelationshipItem['relationshipType'][] = [
    'Used In',
    'Used By',
    'Applied To',
    'Appears In',
    'Distributed On',
    'Contains',
    'Related To',
    'Parent Of',
    'Derived From',
    'Soundtrack For',
    'Featured At',
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs">
          <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{relationships.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Active IP Relationships</div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs">
          <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{assets.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Total Linked Assets</div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs">
          <div className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">100%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Governance Integrity</div>
        </div>
      </div>

      {/* Relationships Table & Filter Box */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
              All Connected Asset Links ({filtered.length})
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cross-asset dependencies, soundtrack links, and character mascot usages
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connected assets or details..."
                className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-slate-950 dark:text-white pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/10 transition"
              />
            </div>

            <select
              value={selectedRelType}
              onChange={(e) => setSelectedRelType(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 px-3 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
            >
              <option value="All Types">All Relationship Types</option>
              {relTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
              <span>Add Relationship</span>
            </button>
          </div>
        </div>

        {/* Relationships Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-white/10 text-[11px] uppercase tracking-wider">
                <th className="p-3">Source Asset</th>
                <th className="p-3">Relationship Type</th>
                <th className="p-3">Target Asset</th>
                <th className="p-3">Link Scope & Notes</th>
                <th className="p-3">Registered On</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 dark:text-slate-500">
                    No relationships found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((rel) => {
                  const srcAsset = assets.find((a) => a.id === rel.sourceId || a.id === rel.sourceAssetId)
                  const tgtAsset = assets.find((a) => a.id === rel.targetId || a.id === rel.targetAssetId)

                  return (
                    <tr key={rel.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                            <img
                              src={srcAsset?.posterUrl || '/tv_series_poster.jpg'}
                              alt={rel.sourceAsset}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-[#09245a] dark:text-white leading-snug">{rel.sourceAsset}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">{rel.sourceId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 text-[10px] font-bold">
                          <span>{rel.relationshipType}</span>
                          <ArrowRight className="size-3 text-blue-500 dark:text-blue-400" />
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                            <img
                              src={tgtAsset?.posterUrl || '/tv_series_showcase.jpg'}
                              alt={rel.targetAsset}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white leading-snug">{rel.targetAsset}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">{rel.targetId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs leading-tight">
                        {rel.details}
                      </td>

                      <td className="p-3 text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                        {rel.createdDate}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            deleteRelationship(rel.id)
                            showToast('Relationship removed')
                          }}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Delete Relationship"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD RELATIONSHIP MODAL */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white font-bold">
                  <Link2 className="size-4" />
                </div>
                <h3 className="font-bold text-[#09245a] dark:text-white text-sm">Add IP Relationship Link</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Source Asset *</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}  —  {a.id}  ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Relationship Type *</label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value as any)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {relTypeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Asset *</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {assets
                    .filter((a) => a.id !== sourceId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}  —  {a.id}  ({a.category})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Scope & Description</label>
                <textarea
                  value={relDetails}
                  onChange={(e) => setRelDetails(e.target.value)}
                  placeholder="e.g. Character mascot artwork and logo printed on school bag merchandise..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 p-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 px-3.5 py-2 font-medium text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2 font-medium text-xs text-white hover:bg-slate-800 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Create Relationship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// CATEGORIES & SUBCATEGORIES PAGE
// -------------------------------------------------------------
function CategoriesPage({ setActiveNav }: { setActiveNav?: (nav: string) => void }) {
  const { categories, subcategories, assets, addCategory, addSubcategory, showToast } = useLovetoonsData()
  const [isAddCatOpen, setIsAddCatOpen] = useState(false)
  const [isAddSubOpen, setIsAddSubOpen] = useState(false)

  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [subName, setSubName] = useState('')
  const [subParent, setSubParent] = useState(categories[0]?.name || '')

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setIsAddCatOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>Add Category</span>
        </button>
        <button
          onClick={() => setIsAddSubOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const liveAssetsCount = assets.filter((a) => a.category === cat.name).length
          const liveSubsCount = subcategories.filter((s) => s.parentCategory === cat.name).length

          return (
            <div key={cat.id} className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <CategoryBadgeIcon category={cat.name} />
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Active
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Subcategories</span>
                  <div className="font-semibold text-slate-900">{liveSubsCount}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Assets</span>
                  <div className="font-semibold text-slate-900">{liveAssetsCount}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ADD CATEGORY MODAL */}
      {isAddCatOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddCatOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Add Category</h3>
              <button onClick={() => setIsAddCatOpen(false)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!catName) return
                addCategory({
                  name: catName,
                  description: catDesc || 'Ministry content category',
                  status: 'Active',
                  iconType: 'tv',
                  color: 'bg-slate-900',
                })
                setIsAddCatOpen(false)
                setCatName('')
                setCatDesc('')
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Category Name *</label>
                <input
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-medium text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-xs text-white hover:bg-slate-800 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBCATEGORY MODAL */}
      {isAddSubOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddSubOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Add Subcategory</h3>
              <button onClick={() => setIsAddSubOpen(false)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!subName) return
                addSubcategory({
                  name: subName,
                  parentCategory: subParent,
                  status: 'Active',
                  iconType: 'tv',
                  color: 'bg-slate-900',
                })
                setIsAddSubOpen(false)
                setSubName('')
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Parent Category *</label>
                <select
                  value={subParent}
                  onChange={(e) => setSubParent(e.target.value)}
                  className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Subcategory Name *</label>
                <input
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="h-8.5 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-medium text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-xs text-white hover:bg-slate-800 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// REPORTS PAGE
// -------------------------------------------------------------
function ReportsPage({
  setActiveNav,
}: {
  setActiveNav?: (nav: string, assetId?: string | null) => void
}) {
  const { stats, assets, categories, showToast, rightsRecords, approvals } = useLovetoonsData()
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All')
  const [riskSearchQuery, setRiskSearchQuery] = useState('')
  const [activeReportTab, setActiveReportTab] = useState<'risk' | 'distribution'>('risk')

  const riskMetrics = useMemo(() => getPortfolioRiskMetrics(assets, rightsRecords, approvals), [assets, rightsRecords, approvals])

  const assetsWithRisk = useMemo(() => {
    return assets.map((asset) => {
      const risk = getAssetRiskAssessment(asset, rightsRecords, approvals)
      return { asset, risk }
    })
  }, [assets, rightsRecords, approvals])

  const filteredRiskAssets = useMemo(() => {
    return assetsWithRisk.filter(({ asset, risk }) => {
      // Risk filter
      if (selectedRiskFilter === 'Critical' && risk.level !== 'Critical') return false
      if (selectedRiskFilter === 'High' && risk.level !== 'High') return false
      if (selectedRiskFilter === 'Critical & High' && risk.level !== 'Critical' && risk.level !== 'High') return false
      if (selectedRiskFilter === 'Medium' && risk.level !== 'Medium') return false
      if (selectedRiskFilter === 'Low' && risk.level !== 'Low') return false

      // Search query
      if (riskSearchQuery.trim()) {
        const q = riskSearchQuery.toLowerCase()
        const match =
          asset.name.toLowerCase().includes(q) ||
          asset.id.toLowerCase().includes(q) ||
          (asset.scheduleNumber != null && String(asset.scheduleNumber).toLowerCase().includes(q)) ||
          asset.category.toLowerCase().includes(q) ||
          (asset.agency && asset.agency.toLowerCase().includes(q)) ||
          risk.primaryVector.toLowerCase().includes(q) ||
          risk.remediationAction.toLowerCase().includes(q)
        if (!match) return false
      }

      return true
    })
  }, [assetsWithRisk, selectedRiskFilter, riskSearchQuery])

  // Real CSV Export for Risk & Exposure Audit
  const handleExportRiskAuditCSV = () => {
    try {
      const headers = [
        'Schedule #',
        'Asset ID',
        'Asset Name',
        'Agency',
        'Category',
        'Subcategory',
        'Operational Status',
        'Risk Level',
        'Risk Score',
        'Exposure Category',
        'Primary Exposure Vector',
        'Recommended Remediation Action',
        'Rights Holder',
        'Governance Clearance',
      ]

      const rows = assetsWithRisk.map(({ asset, risk }) => [
        `"${asset.scheduleNumber || ''}"`,
        `"${asset.id}"`,
        `"${(asset.name || '').replace(/"/g, '""')}"`,
        `"${asset.agency || asset.unit || ''}"`,
        `"${asset.category || ''}"`,
        `"${asset.subcategory || ''}"`,
        `"${asset.officialStatus || asset.status}"`,
        `"${risk.level}"`,
        `"${risk.score}"`,
        `"${risk.category}"`,
        `"${(risk.primaryVector || '').replace(/"/g, '""')}"`,
        `"${(risk.remediationAction || '').replace(/"/g, '""')}"`,
        `"${(asset.rightsHolder || '').replace(/"/g, '""')}"`,
        `"${asset.governanceClearance || 'Active Registry Verified'}"`,
      ])

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `kmm_portfolio_risk_and_exposure_audit_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showToast('Risk & Exposure Audit Report successfully exported (CSV)')
    } catch (err) {
      console.error('Failed to export CSV', err)
      showToast('Export failed. Please try again.')
    }
  }

  // Real CSV Export for Full Asset Registry
  const handleExportAllAssetsCSV = () => {
    try {
      const headers = [
        'Schedule #',
        'Asset ID',
        'Asset Name',
        'Agency',
        'Category',
        'Subcategory',
        'Status',
        'Created Date',
        'Rights Holder',
        'Tags',
      ]

      const rows = assets.map((a) => [
        `"${a.scheduleNumber || ''}"`,
        `"${a.id}"`,
        `"${(a.name || '').replace(/"/g, '""')}"`,
        `"${a.agency || a.unit || ''}"`,
        `"${a.category || ''}"`,
        `"${a.subcategory || ''}"`,
        `"${a.status}"`,
        `"${a.createdDate || ''}"`,
        `"${(a.rightsHolder || '').replace(/"/g, '""')}"`,
        `"${(a.tags || []).join('; ')}"`,
      ])

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `kmm_intellectual_assets_registry_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showToast('Full Asset Registry successfully exported (CSV)')
    } catch (err) {
      console.error('Failed to export CSV', err)
      showToast('Export failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Intellectual Asset Portfolio & Risk Report
            </h1>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              Schedule Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time assessment of operational risk, chain-of-title exposure, and agency governance compliance across 125 ministerial items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportRiskAuditCSV}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer"
          >
            <ShieldAlert className="size-3.5" strokeWidth={2.2} />
            <span>Export Risk Audit (CSV)</span>
          </button>
          <button
            onClick={handleExportAllAssetsCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 active:scale-98 transition cursor-pointer"
          >
            <Download className="size-3.5" strokeWidth={2.2} />
            <span>Export Master Catalog (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Top-line KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Portfolio Risk Index</span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold border',
              riskMetrics.overallTier === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            )}>
              {riskMetrics.overallTier} Risk
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900 mt-2">
            {riskMetrics.averageScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {riskMetrics.lowPct}% Low Risk across portfolio
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Critical Exposure</span>
            <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
              Immediate Action
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-rose-600 mt-2">
            {riskMetrics.criticalCount} <span className="text-sm font-normal text-slate-500">Assets</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Commercial & flagship IP requiring legal clearance
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>High & Moderate Exposure</span>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Review Required
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-amber-600 mt-2">
            {riskMetrics.highCount + riskMetrics.mediumCount} <span className="text-sm font-normal text-slate-500">Assets</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {riskMetrics.highCount} High · {riskMetrics.mediumCount} Moderate
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Low Risk IP</span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Baseline Safe
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-emerald-600 mt-2">
            {riskMetrics.lowCount} <span className="text-sm font-normal text-slate-500">Assets</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            In-house scripture liturgy & low-liability archives
          </div>
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveReportTab('risk')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition cursor-pointer',
            activeReportTab === 'risk'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <ShieldAlert className="size-3.5" />
          <span>Risk & Legal Exposure Audit Matrix</span>
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveReportTab('distribution')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition cursor-pointer',
            activeReportTab === 'distribution'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Layers className="size-3.5" />
          <span>Agency Distribution & Compliance</span>
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            5 Agencies
          </span>
        </button>
      </div>

      {activeReportTab === 'risk' ? (
        <div className="space-y-4">
          {/* Visual Distribution Summary Banner */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div>
                <span className="font-semibold text-slate-900">Portfolio Exposure Summary: </span>
                <span className="text-slate-600">
                  {riskMetrics.lowCount} Low Risk · {riskMetrics.mediumCount} Moderate · {riskMetrics.highCount} High · {riskMetrics.criticalCount} Critical
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="size-2 rounded-full bg-emerald-500" /> Low ({riskMetrics.lowPct}%)
                </span>
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="size-2 rounded-full bg-blue-500" /> Medium ({riskMetrics.mediumPct}%)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="size-2 rounded-full bg-amber-500" /> High ({riskMetrics.highPct}%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-700">
                  <span className="size-2 rounded-full bg-rose-500" /> Critical ({riskMetrics.criticalPct}%)
                </span>
              </div>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner mt-3">
              <div style={{ width: `${riskMetrics.lowPct}%` }} className="h-full bg-emerald-500" title={`Low Risk: ${riskMetrics.lowCount}`} />
              <div style={{ width: `${riskMetrics.mediumPct}%` }} className="h-full bg-blue-500" title={`Medium Risk: ${riskMetrics.mediumCount}`} />
              <div style={{ width: `${riskMetrics.highPct}%` }} className="h-full bg-amber-500" title={`High Exposure: ${riskMetrics.highCount}`} />
              <div style={{ width: `${riskMetrics.criticalPct}%` }} className="h-full bg-rose-500" title={`Critical Exposure: ${riskMetrics.criticalCount}`} />
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'All', label: 'All Risk Profiles', count: assets.length },
                { id: 'Critical', label: 'Critical Exposure', count: riskMetrics.criticalCount, badgeColor: 'bg-rose-100 text-rose-800' },
                { id: 'High', label: 'High Exposure', count: riskMetrics.highCount, badgeColor: 'bg-amber-100 text-amber-800' },
                { id: 'Medium', label: 'Moderate', count: riskMetrics.mediumCount, badgeColor: 'bg-blue-100 text-blue-800' },
                { id: 'Low', label: 'Low Risk', count: riskMetrics.lowCount, badgeColor: 'bg-emerald-100 text-emerald-800' },
              ].map((tab) => {
                const isActive = selectedRiskFilter === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedRiskFilter(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer border',
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <span>{tab.label}</span>
                    <span className={cn(
                      'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                      isActive ? 'bg-white/20 text-white' : (tab.badgeColor || 'bg-slate-100 text-slate-700')
                    )}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
              <input
                value={riskSearchQuery}
                onChange={(e) => setRiskSearchQuery(e.target.value)}
                placeholder="Search risk profile, asset, or vector..."
                className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>
          </div>

          {/* Risk & Exposure Table */}
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3">Schedule # & Asset</th>
                    <th className="px-4 py-3">Agency</th>
                    <th className="px-4 py-3">Operating Status</th>
                    <th className="px-4 py-3">Risk Level</th>
                    <th className="px-4 py-3">Primary Legal Exposure Vector</th>
                    <th className="px-4 py-3">Recommended Remediation Action</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRiskAssets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                        No assets match the selected risk filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredRiskAssets.map(({ asset, risk }) => (
                      <tr
                        key={asset.id}
                        className="hover:bg-slate-50/70 transition group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <AssetThumbnail type={asset.thumbType} name={asset.name} posterUrl={asset.posterUrl} />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {asset.scheduleNumber && (
                                  <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-700">
                                    {asset.scheduleNumber}
                                  </span>
                                )}
                                <span className="font-mono text-[10px] text-slate-400">{asset.id}</span>
                              </div>
                              <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1 text-xs pt-0.5">
                                <span>{asset.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 block">{asset.category}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-700">
                          {asset.agency || asset.unit || 'Lovetoons'}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                              asset.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : asset.status === 'In Review'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : asset.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                            )}
                          >
                            {asset.officialStatus || asset.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border', risk.riskBadgeColor)}>
                              {risk.level}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 font-mono">
                              ({risk.score})
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 max-w-[280px]">
                          <p className="text-xs font-medium text-slate-800 leading-snug">
                            {risk.primaryVector}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {risk.exposureSummary}
                          </p>
                        </td>

                        <td className="px-4 py-3 max-w-[280px]">
                          <div className="rounded-md border border-slate-200 bg-slate-50/80 p-2 text-[11px] text-slate-700 font-medium leading-relaxed">
                            {risk.remediationAction}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          {setActiveNav && (
                            <button
                              onClick={() => setActiveNav('Assets', asset.id)}
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer"
                            >
                              Inspect
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schedule Guidance Callout */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 flex items-start gap-3 shadow-xs">
            <CircleHelp className="size-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">
                Attorney-General Legal Schedule Compliance Directive:
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
                Discontinued programmes remain listed on the Attorney-General schedule because the underlying intellectual property (characters, concepts, master animation files, theme compositions, and recordings) continues to exist as permanent ministry assets. To insulate the ministry from copyright lapse and third-party infringement, all 29 discontinued titles must undergo a formal digital archival preservation and chain-of-title sealing rather than deletion from registry.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Unit Breakdown Table */
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200/80">
            <h2 className="font-semibold text-slate-900 text-sm">Agency Asset Distribution & Contributions</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Asset volumes and approval compliance rates across operational units</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead>
                <tr className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3">Agency</th>
                  <th className="px-4 py-3">Total Assets</th>
                  <th className="px-4 py-3">Approved (Active)</th>
                  <th className="px-4 py-3">In Review / Pending</th>
                  <th className="px-4 py-3">Discontinued (Dormant)</th>
                  <th className="px-4 py-3">Compliance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operationalUnits.map((u) => {
                  const unitAssets = assets.filter((a) => (a.agency || a.unit) === u)
                  const unitApproved = unitAssets.filter((a) => a.status === 'Approved').length
                  const unitPending = unitAssets.filter((a) => a.status === 'Pending' || a.status === 'In Review').length
                  const unitDiscontinued = unitAssets.filter((a) => a.status === 'Requires Attention').length
                  const rate = unitAssets.length > 0 ? Math.round((unitApproved / unitAssets.length) * 100) : 100

                  return (
                    <tr key={u} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">{u}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{unitAssets.length}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{unitApproved}</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">{unitPending}</td>
                      <td className="px-4 py-3 text-rose-600 font-medium">{unitDiscontinued}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="font-semibold text-slate-700">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// AUDIT TRAIL PAGE (IMMUTABLE RECORD LEDGER & COMPLIANCE LOG)
// -------------------------------------------------------------
function AuditTrailPage({ setActiveNav }: { setActiveNav?: (nav: string) => void }) {
  const { activities, assets, currentUser, isGlobalViewer, userAgency, showToast } = useLovetoonsData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActionType, setSelectedActionType] = useState<string>('All Actions')
  const [selectedAgency, setSelectedAgency] = useState<string>('All Agencies')
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  // Agency scoping: unit admins only see their agency logs, global viewers see all
  const scopedActivities = useMemo(() => {
    return activities.filter((act) => {
      if (!isGlobalViewer && act.agency && act.agency !== currentUser.agency && act.agency !== userAgency) {
        return false
      }
      return true
    })
  }, [activities, isGlobalViewer, currentUser.agency, userAgency])

  const filteredLogs = useMemo(() => {
    return scopedActivities.filter((act) => {
      if (selectedActionType !== 'All Actions' && act.actionType !== selectedActionType) {
        return false
      }
      if (selectedAgency !== 'All Agencies' && act.agency !== selectedAgency) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = act.title.toLowerCase().includes(q)
        const matchSubtitle = act.subtitle.toLowerCase().includes(q)
        const matchDetails = act.details?.toLowerCase().includes(q)
        const matchAssetId = act.assetId?.toLowerCase().includes(q)
        const matchAssetName = act.assetName?.toLowerCase().includes(q)
        const matchAgency = act.agency?.toLowerCase().includes(q)
        if (!matchTitle && !matchSubtitle && !matchDetails && !matchAssetId && !matchAssetName && !matchAgency) {
          return false
        }
      }
      return true
    })
  }, [scopedActivities, selectedActionType, selectedAgency, searchQuery])

  // Summary Metrics
  const summaryStats = useMemo(() => {
    const total = scopedActivities.length
    const governance = scopedActivities.filter((a) => a.actionType === 'GOVERNANCE' || a.actionType === 'APPROVAL').length
    const updates = scopedActivities.filter((a) => a.actionType === 'UPDATE' || a.actionType === 'STATUS_CHANGE').length
    const deeds = scopedActivities.filter((a) => a.actionType === 'DOCUMENT' || a.actionType === 'CREATE').length
    return { total, governance, updates, deeds }
  }, [scopedActivities])

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast('No audit logs available to export.')
      return
    }
    const headers = ['Log ID', 'Timestamp', 'Agency', 'Action Type', 'Asset ID', 'Asset Name', 'Action Summary', 'Details']
    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.time}"`,
      `"${log.agency || 'Ministry-wide'}"`,
      `"${log.actionType || 'LOG'}"`,
      `"${log.assetId || 'N/A'}"`,
      `"${(log.assetName || '').replace(/"/g, '""')}"`,
      `"${log.title.replace(/"/g, '""')}"`,
      `"${(log.details || log.subtitle).replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `KMM_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredLogs.length} audit trail records to CSV!`)
  }

  const getActionBadgeColor = (type?: string) => {
    switch (type) {
      case 'CREATE':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'STATUS_CHANGE':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'GOVERNANCE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'APPROVAL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'DOCUMENT':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* 1. KPI SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Audit Records</span>
            <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">Scoped</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">{summaryStats.total}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Retention capacity: 500 immutable entries
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Governance & Clearances</span>
            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Verified</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-emerald-600 mt-1">{summaryStats.governance}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Doctrinal & legal clearance milestones
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Metadata & State Updates</span>
            <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-medium text-blue-700">Confirmed</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">{summaryStats.updates}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Specifications & attribute transitions
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Deeds & New Intakes</span>
            <span className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-medium text-purple-700">Archived</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">{summaryStats.deeds}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Master intakes & legal certificate deeds
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              id="audit-search-input"
              type="text"
              placeholder="Search by action, actor, asset ID (e.g. KMP-PU-001), or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-8 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-300 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Agency Filter */}
          <div className="flex items-center gap-2">
            {isGlobalViewer ? (
              <div className="relative min-w-[180px]">
                <select
                  id="audit-agency-filter"
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="h-8.5 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none transition"
                >
                  <option value="All Agencies">All Agencies</option>
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
              </div>
            ) : (
              <div className="flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700">
                <span>Agency: {currentUser.agency || userAgency}</span>
              </div>
            )}

            <button
              id="export-audit-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer shrink-0"
            >
              <Download className="size-3.5" strokeWidth={2.5} />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>

        {/* Action Type Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Action:</span>
          {[
            { id: 'All Actions', label: 'All Actions' },
            { id: 'UPDATE', label: 'Updates & Edits' },
            { id: 'STATUS_CHANGE', label: 'Status Changes' },
            { id: 'GOVERNANCE', label: 'Governance Verifications' },
            { id: 'APPROVAL', label: 'Approvals & Clearances' },
            { id: 'DOCUMENT', label: 'Document Attachments' },
            { id: 'CREATE', label: 'Asset Intake' },
            { id: 'DELETE', label: 'Deletions' },
          ].map((type) => {
            const isSelected = selectedActionType === type.id
            return (
              <button
                key={type.id}
                onClick={() => setSelectedActionType(type.id)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer border',
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
                )}
              >
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. AUDIT TRAIL LOGS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3.5 w-32">Timestamp</th>
                <th className="px-4 py-3.5 w-36">Action Classification</th>
                <th className="px-4 py-3.5">IP Asset / Context</th>
                <th className="px-4 py-3.5 w-36">Agency</th>
                <th className="px-4 py-3.5">Action Details & Summary</th>
                <th className="px-4 py-3.5 w-24 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <ScrollText className="mx-auto size-10 text-slate-300 mb-2" />
                    <div className="font-bold text-slate-600">No matching audit trail records found</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Try resetting your search query or action type filters
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id
                  const matchedAsset = log.assetId ? assets.find((a) => a.id === log.assetId) : null

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        className={cn(
                          'hover:bg-slate-50/80 transition-colors cursor-pointer',
                          isExpanded && 'bg-indigo-50/30'
                        )}
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      >
                        {/* Timestamp */}
                        <td className="px-4 py-3 text-slate-500 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Clock className="size-3.5 text-slate-400 shrink-0" />
                            <span>{log.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {log.id}</span>
                        </td>

                        {/* Action Badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider',
                              getActionBadgeColor(log.actionType)
                            )}
                          >
                            <span>{log.actionType || 'UPDATE'}</span>
                          </span>
                        </td>

                        {/* IP Asset Context */}
                        <td className="px-4 py-3">
                          {log.assetId ? (
                            <div className="space-y-1">
                              <div className="font-bold text-[#09245a] flex items-center gap-1.5 leading-snug">
                                <span>{log.assetName || log.assetId}</span>
                                {setActiveNav && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (typeof window !== 'undefined') {
                                        window.history.pushState({}, '', `/assets?asset=${log.assetId}`)
                                      }
                                      setActiveNav('Assets')
                                    }}
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline text-[10px] font-bold flex items-center gap-0.5 ml-1.5"
                                    title="Open Asset View"
                                  >
                                    <span>View IP</span>
                                    <ExternalLink className="size-2.5" />
                                  </button>
                                )}
                              </div>
                              <div className="pt-0.5">
                                <span className="inline-block font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {log.assetId}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Ministry General</span>
                          )}
                        </td>

                        {/* Agency */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="rounded-lg bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            {log.agency || 'Global KMM'}
                          </span>
                        </td>

                        {/* Summary & Details */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 line-clamp-1">{log.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {log.details || log.subtitle}
                          </div>
                        </td>

                        {/* Inspect action */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedLogId(isExpanded ? null : log.id)
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                          >
                            {isExpanded ? 'Collapse' : 'Details'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-gradient-to-r from-indigo-50/40 via-white to-blue-50/40 border-b border-indigo-100/80">
                          <td colSpan={6} className="px-6 py-4 space-y-3">
                            <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-2xs space-y-2.5 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                <span className="font-bold text-[#09245a] flex items-center gap-1.5">
                                  <ScrollText className="size-3.5 text-indigo-600" />
                                  <span>Audit Verification Certificate — Log #{log.id}</span>
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  Captured at: {log.time}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                    Action Performed
                                  </span>
                                  <span className="font-bold text-slate-800">{log.title}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                    Authorised Agency
                                  </span>
                                  <span className="font-bold text-slate-800">{log.agency || 'Global Ministry'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                    Linked Asset
                                  </span>
                                  <span className="font-bold text-slate-800">
                                    {log.assetName ? (
                                      <span>
                                        {log.assetName}
                                        {log.assetId && (
                                          <span className="font-mono text-xs font-normal text-slate-500 ml-2">
                                            ({log.assetId})
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      log.assetId || 'General Ministry Operation'
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 mt-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                  Detailed Modification Ledger
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                                  {log.details || log.subtitle}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// SETTINGS PAGE
// -------------------------------------------------------------
function SettingsPage() {
  const {
    currentUser,
    stats,
    resetToDefaultData,
    showToast,
    categories,
    subcategories,
    assets,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    setCurrentUser,
    availableUsers,
    logout,
  } = useLovetoonsData()

  const [defaultRightsScope, setDefaultRightsScope] = useState('Worldwide Master Copyright')
  const [governanceScoreThreshold, setGovernanceScoreThreshold] = useState(95)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserAlerts, setBrowserAlerts] = useState(true)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Taxonomy Management State (Super Admin)
  const [isAddCatOpen, setIsAddCatOpen] = useState(false)
  const [isAddSubOpen, setIsAddSubOpen] = useState(false)
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catColor, setCatColor] = useState('bg-blue-600')
  const [subName, setSubName] = useState('')
  const [subParent, setSubParent] = useState(categories[0]?.name || '')

  // Edit States
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [editCatName, setEditCatName] = useState('')
  const [editCatDesc, setEditCatDesc] = useState('')

  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryItem | null>(null)
  const [editSubName, setEditSubName] = useState('')
  const [editSubParent, setEditSubParent] = useState('')

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'category' | 'subcategory'
    id: string
    name: string
    linkedAssetsCount: number
  } | null>(null)

  const [taxonomySearch, setTaxonomySearch] = useState('')

  const isSuperAdmin = currentUser.role === 'super_admin'

  const filteredCategories = useMemo(() => {
    if (!taxonomySearch.trim()) return categories
    const q = taxonomySearch.toLowerCase()
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        subcategories.some(
          (s) => s.parentCategory === c.name && s.name.toLowerCase().includes(q)
        )
    )
  }, [categories, subcategories, taxonomySearch])

  const openAddSubForCategory = (parentName: string) => {
    setSubParent(parentName)
    setIsAddSubOpen(true)
  }

  const handleStartEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat)
    setEditCatName(cat.name)
    setEditCatDesc(cat.description)
  }

  const handleStartEditSubcategory = (sub: SubcategoryItem) => {
    setEditingSubcategory(sub)
    setEditSubName(sub.name)
    setEditSubParent(sub.parentCategory)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-end">
        <button
          onClick={() => showToast('Platform configuration saved successfully!')}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer"
        >
          <Save className="size-3.5" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* APPEARANCE & THEME PREFERENCES */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Palette className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900">
                Appearance & Theme Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize your visual interface. Switch between clean Light mode, high-contrast Dark mode, or sync automatically with your system.
              </p>
            </div>
          </div>
          <div>
            <ThemeToggle variant="segmented" />
          </div>
        </div>
      </div>

      {/* SUPER ADMIN TAXONOMY MANAGEMENT PANEL */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="grid size-10 place-items-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Grid2X2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900">
                  Super Admin Settings: Category & Subcategory Taxonomy
                </h2>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700">
                    <ShieldCheck className="size-3 text-purple-600" />
                    <span>Super Admin Mode</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    <ShieldAlert className="size-3 text-amber-600" />
                    <span>Read Only</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage global IP classification, add new categories & subcategories, and regulate portfolio metadata taxonomy.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isSuperAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 active:scale-98 transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add New Category</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubParent(categories[0]?.name || '')
                    setIsAddSubOpen(true)
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-98 transition shadow-2xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add New Subcategory</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-500">
                <Lock className="size-3.5" />
                <span>Super Admin Permissions Required</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Taxonomy KPI Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Categories</span>
            <div className="text-xl font-semibold text-slate-900 mt-0.5">{categories.length}</div>
            <div className="text-[10px] text-emerald-600 font-medium">Master Classifications</div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Subcategories</span>
            <div className="text-xl font-semibold text-purple-700 mt-0.5">{subcategories.length}</div>
            <div className="text-[10px] text-slate-500 font-medium">Specialized Types</div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Classified Assets</span>
            <div className="text-xl font-semibold text-slate-900 mt-0.5">{stats.totalAssets}</div>
            <div className="text-[10px] text-slate-500 font-medium">Mapped to Taxonomy</div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Registry Governance</span>
            <div className="text-xl font-semibold text-emerald-700 mt-0.5">100%</div>
            <div className="text-[10px] text-emerald-600 font-medium">Central Verified</div>
          </div>
        </div>

        {/* Search taxonomy */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={taxonomySearch}
              onChange={(e) => setTaxonomySearch(e.target.value)}
              placeholder="Filter categories or subcategories..."
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>
          {taxonomySearch && (
            <button
              onClick={() => setTaxonomySearch('')}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Categories Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-1">
          {filteredCategories.map((cat) => {
            const catAssets = assets.filter((a) => a.category === cat.name)
            const catSubs = subcategories.filter((s) => s.parentCategory === cat.name)

            return (
              <div
                key={cat.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm hover:border-slate-300 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CategoryBadgeIcon category={cat.name} />
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm leading-snug">{cat.name}</h3>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2">
                          Active Category
                        </span>
                      </div>
                    </div>

                    {isSuperAdmin && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(cat)}
                          title="Edit category"
                          className="grid size-7 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: 'category',
                              id: cat.id,
                              name: cat.name,
                              linkedAssetsCount: catAssets.length,
                            })
                          }
                          title="Delete category"
                          className="grid size-7 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Subcategories list */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Subcategories ({catSubs.length})
                      </span>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => openAddSubForCategory(cat.name)}
                          className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="size-3" />
                          <span>Add Sub</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar pr-0.5">
                      {catSubs.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic">No subcategories defined yet.</div>
                      ) : (
                        catSubs.map((sub) => {
                          const subAssetsCount = assets.filter(
                            (a) => a.category === cat.name && a.subcategory === sub.name
                          ).length

                          return (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-[11px] font-medium text-slate-700 group/sub"
                            >
                              <span>{sub.name}</span>
                              <span className="rounded bg-slate-200/70 px-1 py-0.2 text-[9px] font-semibold text-slate-700">
                                {subAssetsCount}
                              </span>
                              {isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'subcategory',
                                      id: sub.id,
                                      name: sub.name,
                                      linkedAssetsCount: subAssetsCount,
                                    })
                                  }
                                  title="Delete subcategory"
                                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                >
                                  <X className="size-3" />
                                </button>
                              )}
                            </span>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Total Associated Assets:
                  </span>
                  <span className="font-semibold text-slate-900">{catAssets.length} assets</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CORE SYSTEM CONFIGURATION 2-COLUMN GRID */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* 1. Organization & Ministry Profile */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-slate-700" />
              <h2 className="font-semibold text-slate-900 text-sm">Ministry Organization & Brand Registry</h2>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              Active Entity
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col items-center justify-center size-20 rounded-xl bg-slate-900 p-2.5 border border-slate-800 shrink-0 shadow-xs">
              <img src="/lovetoons-logo.png" alt="Lovetoons" className="h-7 w-auto object-contain brightness-105" />
              <div className="text-[8px] font-semibold text-white/80 uppercase mt-1 tracking-wider">Kiddies Media</div>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="font-semibold text-slate-900 text-sm">Kiddies Media Ministry (Lovetoons)</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Global intellectual property owner and publishing entity for Christian animation, music, publishing, and interactive digital platforms.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">ID: KMM-LT-GLOBAL-01</span>
                <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded">www.lovetoons.org</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Headquarters / Studio</span>
              <div className="font-semibold text-slate-800">Lagos Studio & London Bureau</div>
              <div className="text-[10px] text-slate-500">Lovetoons Media Ltd, Nigeria & UK</div>
            </div>

            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Default Rights Notice</span>
              <div className="font-semibold text-slate-800 line-clamp-1">© 2025–2035 Lovetoons Media Ltd</div>
              <div className="text-[10px] text-slate-500">All Rights Reserved Worldwide</div>
            </div>
          </div>
        </div>

        {/* 2. Governance & Legal Clearance Policies */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-purple-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Governance & Rights Clearance Policies</h2>
            </div>
            <span className="rounded bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-semibold">
              Standard v2.1
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Master License Scope</label>
              <select
                value={defaultRightsScope}
                onChange={(e) => setDefaultRightsScope(e.target.value)}
                className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-400 font-medium"
              >
                <option value="Worldwide Master Copyright">Worldwide Master Copyright (All Channels & Media)</option>
                <option value="Territorial License (Africa & EMEA)">Territorial License (Africa & EMEA)</option>
                <option value="Digital / OTT Distribution Only">Digital / OTT Distribution Only</option>
                <option value="Print & Merchandise Exclusive">Print & Merchandise Exclusive</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Minimum Governance Score for Auto-Release</label>
                <span className="font-mono font-semibold text-purple-700">{governanceScoreThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                value={governanceScoreThreshold}
                onChange={(e) => setGovernanceScoreThreshold(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>80% Minimum</span>
                <span>95% Recommended</span>
                <span>100% Strict</span>
              </div>
            </div>

            <div className="rounded-lg bg-purple-50/60 p-3 border border-purple-100 space-y-2">
              <div className="font-semibold text-purple-900 text-xs">Mandatory Pre-Broadcast Clearances</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-purple-950">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                  <span>Biblical Doctrine Alignment</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                  <span>Age Rating & Child Protection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                  <span>Music Master & Sync Clearance</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                  <span>Voice Actor Talent Releases</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Cloud Media Storage & Archival Infrastructure */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-slate-700" />
              <h2 className="font-semibold text-slate-900 text-sm">Cloud Media Storage & Archival Infrastructure</h2>
            </div>
            <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
              99.99% Online
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Primary S3 / Cloud Bucket</span>
                <span className="font-mono text-[10px] text-emerald-700 font-semibold">Connected ✓</span>
              </div>
              <div className="font-mono font-semibold text-slate-900 text-xs">s3://lovetoons-master-media-archives-prod</div>
              <div className="text-[10px] text-slate-500">Region: eu-west-1 (Ireland) • 24.8 TB Total Stored</div>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Global Media Stream CDN</span>
                <span className="font-mono text-[10px] text-slate-900 font-semibold">Edge Active</span>
              </div>
              <div className="font-mono font-semibold text-slate-900 text-xs">https://cdn.lovetoons.org/masters/v1/</div>
              <div className="text-[10px] text-slate-500">Edge caching enabled across Africa, Europe, Americas and Asia</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                <div className="text-[10px] font-semibold text-slate-500">Master Retention</div>
                <div className="font-semibold text-slate-900 mt-0.5">Permanent Cold Storage</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                <div className="text-[10px] font-semibold text-slate-500">Transcode Targets</div>
                <div className="font-semibold text-slate-900 mt-0.5">4K UHD, 1080p, 720p, WAV</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Active Session, Notifications & Security */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-slate-700" />
              <h2 className="font-semibold text-slate-900 text-sm">Active Account Session & Maintenance</h2>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Session Live
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* User Session Details */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-slate-900 text-white font-semibold text-xs shadow-xs">
                  {currentUser.initials}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-600 font-medium">{currentUser.roleLabel} • {currentUser.unit}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
              >
                <LogOut className="size-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Notifications */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Email Alerts on Approval Requests</div>
                  <div className="text-[11px] text-slate-500">Send notifications to reviewers when items are submitted</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-500 size-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">In-App Push Alerts for Rights Clearance</div>
                  <div className="text-[11px] text-slate-500">Show high-priority badges when copyright deeds expire or clear</div>
                </div>
                <input
                  type="checkbox"
                  checked={browserAlerts}
                  onChange={(e) => setBrowserAlerts(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-500 size-4"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Maintenance Operations</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Platform cache purged and synced with Cloud storage')}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition text-xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5 text-slate-500" />
                  <span>Purge Cache & Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/80 p-2 font-medium text-rose-700 hover:bg-rose-100 transition text-xs cursor-pointer"
                >
                  <Trash2 className="size-3.5 text-rose-600" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD CATEGORY (Super Admin) */}
      {isAddCatOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddCatOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-800 font-semibold">
                  <Plus className="size-4" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Add New Category (Super Admin)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCatOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!catName.trim()) return
                addCategory({
                  name: catName.trim(),
                  description: catDesc.trim() || 'Central Lovetoons IP Content Category',
                  status: 'Active',
                  iconType: 'tv',
                  color: catColor,
                })
                setIsAddCatOpen(false)
                setCatName('')
                setCatDesc('')
              }}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Interactive & XR, Theatrical Outreach"
                  className="h-8.5 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Explain the scope and asset types for this classification..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color Theme</label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Blue', val: 'bg-blue-600' },
                    { label: 'Purple', val: 'bg-purple-600' },
                    { label: 'Emerald', val: 'bg-emerald-600' },
                    { label: 'Amber', val: 'bg-amber-600' },
                    { label: 'Rose', val: 'bg-rose-600' },
                  ].map((color) => (
                    <button
                      key={color.val}
                      type="button"
                      onClick={() => setCatColor(color.val)}
                      className={cn(
                        'size-7 rounded-full transition flex items-center justify-center',
                        color.val,
                        catColor === color.val ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-80'
                      )}
                    >
                      {catColor === color.val && <Check className="size-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SUBCATEGORY (Super Admin) */}
      {isAddSubOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddSubOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-800 font-semibold">
                  <Plus className="size-4" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Add New Subcategory (Super Admin)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSubOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!subName.trim() || !subParent) return
                addSubcategory({
                  name: subName.trim(),
                  parentCategory: subParent,
                  status: 'Active',
                  iconType: 'tv',
                  color: 'bg-purple-600',
                })
                setIsAddSubOpen(false)
                setSubName('')
              }}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Category *</label>
                <select
                  value={subParent}
                  onChange={(e) => setSubParent(e.target.value)}
                  className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. 3D CGI Short, Musical Album, Illustrated Comic"
                  className="h-8.5 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
                >
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT CATEGORY */}
      {editingCategory && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCategory(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Edit Category</h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!editCatName.trim()) return
                updateCategory({
                  ...editingCategory,
                  name: editCatName.trim(),
                  description: editCatDesc.trim(),
                })
                setEditingCategory(null)
              }}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="h-8.5 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xl text-xs cursor-default space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Delete {deleteTarget.type === 'category' ? 'Category' : 'Subcategory'}?
                </h3>
                <p className="text-[11px] text-slate-500">&ldquo;{deleteTarget.name}&rdquo;</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {deleteTarget.linkedAssetsCount > 0 ? (
                <span className="text-amber-700 font-semibold">
                  Warning: There are currently {deleteTarget.linkedAssetsCount} assets catalogued under this {deleteTarget.type}. Deleting it will remove this taxonomy link.
                </span>
              ) : (
                <span>Are you sure you want to remove this taxonomy item from the platform? This action cannot be undone.</span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteTarget.type === 'category') {
                    deleteCategory(deleteTarget.id)
                  } else {
                    deleteSubcategory(deleteTarget.id)
                  }
                  setDeleteTarget(null)
                }}
                className="rounded-lg bg-rose-600 px-5 py-2 font-medium text-white hover:bg-rose-700 shadow-xs transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: RESET DATA CONFIRMATION */}
      {isResetConfirmOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsResetConfirmOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xl text-xs cursor-default space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Reset All Platform Data?</h3>
                <p className="text-[11px] text-slate-500">This will restore initial demo assets, rights records, categories, and relationships.</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Any custom assets or taxonomy additions stored in your browser local storage will be refreshed back to default Lovetoons production demo state.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaultData()
                  setIsResetConfirmOpen(false)
                  showToast('Platform data reset to factory demo state')
                }}
                className="rounded-lg bg-rose-600 px-5 py-2 font-medium text-white hover:bg-rose-700 shadow-xs transition cursor-pointer"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// MAIN APP SHELL & ROUTER
// -------------------------------------------------------------
export function MainApp({
  initialTab,
  initialAssetId,
}: {
  initialTab?: string
  initialAssetId?: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryTab = searchParams?.get('tab')
  const queryAsset = searchParams?.get('asset') || searchParams?.get('id') || initialAssetId || null

  const resolvedInitialTab = useMemo(() => {
    if (queryTab && queryToTab[queryTab.toLowerCase()]) {
      return queryToTab[queryTab.toLowerCase()]
    }
    if (pathname && pathToTab[pathname] && pathname !== '/') {
      return pathToTab[pathname]
    }
    if (initialTab) {
      return initialTab
    }
    return 'Dashboard'
  }, [pathname, queryTab, initialTab])

  const [active, setActive] = useState<string>(resolvedInitialTab)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(queryAsset)
  const [open, setOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kmm_sidebar_collapsed') === 'true'
    }
    return false
  })

  // Keyboard shortcuts: Ctrl+[ / Cmd+[ (toggle sidebar) and Ctrl+K / Cmd+K (focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault()
        setIsCollapsed((prev) => {
          const next = !prev
          if (typeof window !== 'undefined') {
            localStorage.setItem('kmm_sidebar_collapsed', String(next))
          }
          return next
        })
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const searchInput = (document.getElementById('header-global-search-input') || document.querySelector('header input')) as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSetCollapsed = (val: boolean | ((p: boolean) => boolean)) => {
    setIsCollapsed((prev) => {
      const next = typeof val === 'function' ? val(prev) : val
      if (typeof window !== 'undefined') {
        localStorage.setItem('kmm_sidebar_collapsed', String(next))
      }
      return next
    })
  }

  const { currentUser, toastMessage, dismissToast, unreadNotificationsCount, isAuthenticated, isInitialized } = useLovetoonsData()

  // Auth Guard: Redirect unauthenticated sessions to /signin
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/signin'
      }
    }
  }, [isInitialized, isAuthenticated])

  // Role Guard: Hide / Redirect restricted roles smoothly
  useEffect(() => {
    const isSuperAdmin = currentUser.role === 'super_admin'
    const isAgencyAdmin = currentUser.role === 'agency_admin' || (currentUser.role as any) === 'unit_admin'

    if (active === 'Approvals' && isAgencyAdmin) {
      setActive('Dashboard')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/dashboard')
      }
    } else if (active === 'Settings' && !isSuperAdmin) {
      setActive('Dashboard')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/dashboard')
      }
    } else if (active === 'Audit Trail' && !isSuperAdmin) {
      setActive('Dashboard')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/dashboard')
      }
    } else if (active === 'Reports' && isAgencyAdmin) {
      setActive('Dashboard')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/dashboard')
      }
    } else if (active === 'Categories & Subcategories') {
      setActive(isSuperAdmin ? 'Settings' : 'Dashboard')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', isSuperAdmin ? '/settings' : '/dashboard')
      }
    }
  }, [currentUser.role, active])

  // Sync active tab and asset if popstate (back/forward) occurs
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname
      const params = new URLSearchParams(window.location.search)
      const tabFromQuery = params.get('tab')
      const targetTab =
        (tabFromQuery && queryToTab[tabFromQuery.toLowerCase()]) ||
        pathToTab[currentPath] ||
        'Dashboard'
      setActive(targetTab)
      const asset = params.get('asset') || params.get('id') || null
      setSelectedAssetId(asset)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Fast, instant client-side tab switcher with 0ms delay & zero full-tree remount
  const handleNavigate = (newTab: string, assetId?: string | null) => {
    setActive(newTab)
    if (assetId !== undefined) {
      setSelectedAssetId(assetId)
    }
    const targetPath = tabToPath[newTab] || '/dashboard'
    const finalAsset = assetId !== undefined ? assetId : (newTab === active ? selectedAssetId : null)
    const fullPath = finalAsset ? `${targetPath}?asset=${finalAsset}` : targetPath

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', fullPath)
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">
        Loading KMM Platform...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">
        Redirecting to Sign In...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Glossy System Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-3.5 rounded-2xl bg-slate-900/90 px-4 py-3.5 text-xs text-white shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md overflow-hidden group"
        >
          {/* Ambient Specular Glow */}
          <div className="pointer-events-none absolute -left-6 -top-6 size-24 rounded-full bg-blue-500/30 blur-xl" />

          {/* Luminous Icon Badge */}
          <div className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-blue-500/30 border border-white/20">
            <Sparkles className="size-4.5 text-yellow-300 animate-pulse" />
          </div>

          {/* Toast Message Body */}
          <div className="relative flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                KMM Notice
              </span>
              <span className="size-1 rounded-full bg-blue-400" />
              <span className="text-[10px] font-medium text-slate-400">Just now</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-slate-100 leading-snug break-words">
              {toastMessage}
            </p>
          </div>

          {/* Quick Dismiss Button */}
          <button
            onClick={dismissToast}
            title="Dismiss notification"
            className="relative size-7 shrink-0 grid place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="size-3.5" />
          </button>

          {/* Auto-Dismiss Countdown Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-toast-progress" />
          </div>
        </aside>
      )}

      {/* Standalone Full-Viewport Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        setActiveNav={handleNavigate}
      />

      <Sidebar
        active={active}
        setActive={handleNavigate}
        open={open}
        setOpen={setOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleSetCollapsed}
      />
      <div className={cn(
        'transition-all duration-300 ease-in-out min-h-screen flex flex-col',
        isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]'
      )}>
        <Header
          setOpen={setOpen}
          activeTab={active}
          setActiveNav={handleNavigate}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          isNotificationModalOpen={isNotificationModalOpen}
          unreadCount={unreadNotificationsCount}
          isCollapsed={isCollapsed}
          setIsCollapsed={handleSetCollapsed}
        />
        <main className="flex-1 mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {active === 'Dashboard' ? (
            <Dashboard setActiveNav={handleNavigate} />
          ) : active === 'Assets' ? (
            <AssetsPage setActiveNav={handleNavigate} initialAssetId={selectedAssetId || queryAsset} />
          ) : active === 'Settings' ? (
            <SettingsPage />
          ) : active === 'Reports' ? (
            <ReportsPage setActiveNav={handleNavigate} />
          ) : active === 'Approvals' ? (
            <ApprovalsPage />
          ) : active === 'Rights & Governance' ? (
            <RightsPage setActiveNav={handleNavigate} initialAssetId={selectedAssetId || queryAsset} />
          ) : active === 'Relationships' ? (
            <RelationshipsPage />
          ) : active === 'Audit Trail' ? (
            <AuditTrailPage setActiveNav={handleNavigate} />
          ) : (
            <Dashboard setActiveNav={handleNavigate} />
          )}
        </main>
      </div>
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
        />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4faff] flex items-center justify-center font-bold text-slate-500">
          Loading Lovetoons Platform...
        </div>
      }
    >
      <MainApp initialTab="Dashboard" />
    </Suspense>
  )
}
