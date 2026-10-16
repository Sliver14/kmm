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
  CheckCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLovetoonsData } from '@/lib/store/DataContext'
import { AssetVisualPreview } from '@/components/AssetVisualPreview'
import { AssetArchiveHub } from '@/components/AssetArchiveHub'
import {
  AssetData,
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
} from '@/types'

export const tabToPath: Record<string, string> = {
  'Dashboard': '/dashboard',
  'Assets': '/assets',
  'Relationships': '/relationships',
  'Rights & Governance': '/rights',
  'Approvals': '/approvals',
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
  'reports': 'Reports',
  'settings': 'Settings',
}

const nav = [
  ['Dashboard', Home],
  ['Assets', Boxes],
  ['Relationships', Link2],
  ['Rights & Governance', ShieldCheck],
  ['Approvals', ClipboardCheck],
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
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60 blur-xs transition group-hover/logo:opacity-100" />
          <img
            src="/kmm-logo.png"
            alt="Kiddies Media Ministries"
            className="relative size-8 object-contain drop-shadow-md transition-transform group-hover/logo:scale-110"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-1 text-center transition-opacity duration-200">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-blue-500/40 blur-xs" />
          <img
            src="/kmm-logo.png"
            alt="Kiddies Media Ministries"
            className="relative size-7 object-contain drop-shadow-md"
          />
        </div>
        <span className="text-sm font-black text-white tracking-tight">Kiddies Media</span>
      </div>
      <div className="rounded-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-400/30 px-2.5 py-0.5 text-[9px] text-blue-200 font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs">
        Ministries
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
    return nav.filter(([label]) => {
      if (label === 'Approvals' && currentUser.role === 'unit_admin') {
        return false
      }
      return true
    })
  }, [currentUser.role])

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-[#021024]/95 text-white transition-all duration-300 ease-in-out backdrop-blur-2xl border-r border-white/10 shadow-[4px_0_30px_rgba(0,0,0,0.35)]',
        isCollapsed ? 'w-[76px]' : 'w-[248px]',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >

      {/* Header / Logo */}
      <div className="flex h-[76px] items-center justify-center border-b border-white/10 px-3 relative">
        <Logo collapsed={isCollapsed} />
      </div>

      {/* Navigation List */}
      <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5 overflow-y-auto overflow-x-hidden">
        {visibleNav.map(([label, Icon]) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => {
                setActive(label)
                setOpen(false)
              }}
              className={cn(
                'group relative flex items-center rounded-xl font-medium transition-all duration-200 cursor-pointer',
                isCollapsed ? 'justify-center p-3 text-sm' : 'gap-3 px-3.5 py-2.5 text-left text-sm',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.45)] border border-white/25'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm'
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.8} />
              {!isCollapsed && <span className="flex-1 truncate text-xs font-semibold">{label}</span>}
              {!isCollapsed && label === 'Approvals' && stats.pendingApprovalsCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#021024]">
                  {stats.pendingApprovalsCount}
                </span>
              )}

              {/* Collapsed floating indicator dot */}
              {isCollapsed && label === 'Approvals' && stats.pendingApprovalsCount > 0 && (
                <span className="absolute top-2 right-2 size-2.5 rounded-full bg-rose-500 ring-2 ring-[#021024]" />
              )}

              {/* Tooltip for collapsed view */}
              {isCollapsed && (
                <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-slate-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md border border-white/10 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto lg:block z-50">
                  {label}
                  {label === 'Approvals' && stats.pendingApprovalsCount > 0 && ` (${stats.pendingApprovalsCount})`}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Current User Role Pill */}
      <div className={cn(
        'mx-2.5 mb-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all',
        isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3'
      )}>
        <div className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center')}>
          <div className="relative group/user">
            <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md">
              {currentUser.initials}
            </div>
            {isCollapsed && (
              <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-slate-900/95 p-2.5 text-xs text-white shadow-2xl backdrop-blur-md border border-white/10 opacity-0 group-hover/user:opacity-100 lg:block z-50">
                <div className="font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-blue-300">{currentUser.roleLabel}</div>
                <div className="text-[9px] text-slate-400">{currentUser.agency || currentUser.unit}</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-bold truncate text-white text-xs">{currentUser.name}</div>
              <div className="text-[10px] text-blue-300 truncate font-medium">{currentUser.roleLabel}</div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 truncate">
            Agency: {currentUser.agency || currentUser.unit}
          </div>
        )}

        <button
          onClick={logout}
          title="Sign out of platform"
          className={cn(
            'flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-rose-500/20 hover:text-rose-200 hover:border-rose-500/30 transition cursor-pointer',
            isCollapsed ? 'size-8 mt-1' : 'w-full mt-2.5 gap-1.5 py-1.5 text-xs font-medium'
          )}
        >
          <LogOut className="size-3.5" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Footer Bottom Bar */}
      {!isCollapsed ? (
        <div className="relative px-4 pb-4 text-[11px] leading-relaxed text-white/70 border-t border-white/10 pt-3">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="italic font-light">Building Godly Content</span>
              <div className="not-italic text-[10px] font-medium text-blue-400">KMM Platform • v2.1</div>
            </div>
            {setIsCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                title="Collapse sidebar (Ctrl+[)"
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <PanelLeftClose className="size-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-white/10">
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar (Ctrl+[)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <PanelLeftOpen className="size-4" />
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
  readAlertIds,
  setReadAlertIds,
}: {
  isOpen: boolean
  onClose: () => void
  setActiveNav?: (v: string, assetId?: string | null) => void
  readAlertIds: string[]
  setReadAlertIds: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const { stats, showToast, approvals, rightsRecords, activities } = useLovetoonsData()
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'approvals' | 'rights' | 'activity'>('all')

  // Build unified platform notification alerts
  const allNotifications = useMemo(() => {
    const list: Array<{
      id: string
      type: 'approval' | 'rights' | 'activity'
      title: string
      subtitle: string
      time: string
      badge?: string
      badgeColor?: string
      targetTab: string
      assetId?: string
      priority?: 'High' | 'Medium' | 'Low' | 'Urgent'
    }> = []

    // 1. Pending & Active Approvals
    approvals.forEach((app) => {
      list.push({
        id: `app-${app.id}`,
        type: 'approval',
        title: app.status === 'Pending' ? `Approval Request: ${app.assetName}` : `Approved: ${app.assetName}`,
        subtitle: `${app.stage} • Submitted by ${app.requesterName} (${app.unit})`,
        time: `${app.submittedDate} ${app.submittedTime}`,
        badge: app.status === 'Pending' ? `${app.priority} Priority` : 'Approved',
        badgeColor: app.status === 'Pending' ? (app.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800') : 'bg-emerald-100 text-emerald-800',
        targetTab: 'Approvals',
        assetId: app.assetId,
        priority: app.priority,
      })
    })

    // 2. Rights Governance Records
    rightsRecords.slice(0, 5).forEach((rg) => {
      list.push({
        id: `rg-${rg.id}`,
        type: 'rights',
        title: `Rights Registry: ${rg.name}`,
        subtitle: `Scope: ${rg.rightsType} • Territory: ${rg.territory || 'Worldwide'} • Governance Score: ${rg.governanceScore || 100}%`,
        time: rg.validity || '2025–2035',
        badge: rg.status === 'Cleared' ? '100% Cleared' : 'Under Review',
        badgeColor: rg.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800',
        targetTab: 'Rights & Governance',
        assetId: rg.assetId || rg.id,
      })
    })

    // 3. Activity Logs
    activities.slice(0, 6).forEach((act) => {
      list.push({
        id: `act-${act.id}`,
        type: 'activity',
        title: act.title,
        subtitle: `${act.subtitle} • by ${act.user}`,
        time: act.time,
        badge: 'Activity',
        badgeColor: 'bg-slate-100 text-slate-700',
        targetTab: 'Assets',
      })
    })

    return list
  }, [approvals, rightsRecords, activities])

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((item) => {
      if (notificationFilter === 'approvals') return item.type === 'approval'
      if (notificationFilter === 'rights') return item.type === 'rights'
      if (notificationFilter === 'activity') return item.type === 'activity'
      return true
    })
  }, [allNotifications, notificationFilter])

  const unreadCount = useMemo(() => {
    return allNotifications.filter((n) => !readAlertIds.includes(n.id)).length
  }, [allNotifications, readAlertIds])

  const handleMarkAllRead = () => {
    setReadAlertIds(allNotifications.map((n) => n.id))
    showToast('All ministry alerts marked as read')
  }

  const handleNotificationClick = (targetTab: string, assetId?: string, notifId?: string) => {
    if (notifId && !readAlertIds.includes(notifId)) {
      setReadAlertIds((prev) => [...prev, notifId])
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
      className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:w-[460px] md:w-[500px] h-full border-l border-white/20 bg-white/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(2,6,23,0.35)] flex flex-col cursor-default animate-in slide-in-from-right duration-300 ease-out overflow-hidden"
      >
        {/* Ambient specular glowing gradients */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-20 size-60 rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />

        {/* Drawer Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 p-4 sm:p-5 bg-gradient-to-r from-slate-50/90 via-blue-50/40 to-slate-50/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-10.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-white/80 grid place-items-center shrink-0">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-3.5 bg-rose-500 ring-2 ring-white"></span>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-[#09245a] text-sm sm:text-base tracking-tight truncate">
                  Ministry Alerts
                </h3>
                {unreadCount > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs shadow-rose-500/20">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    {unreadCount} New
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <Check className="size-2.5" />
                    All Caught Up
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                Live governance clearances, approvals & activity stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50/90 hover:bg-blue-100 border border-blue-200/70 rounded-xl px-2.5 py-1.5 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="size-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="grid size-8.5 place-items-center rounded-xl bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="relative z-10 flex items-center gap-1.5 border-b border-slate-200/70 bg-gradient-to-b from-slate-50/70 to-white/80 backdrop-blur-md p-2.5 sm:px-4 text-xs overflow-x-auto no-scrollbar shrink-0">
          {[
            { key: 'all', label: 'All Alerts', count: allNotifications.length },
            { key: 'approvals', label: 'Approvals', count: allNotifications.filter((n) => n.type === 'approval').length },
            { key: 'rights', label: 'Governance', count: allNotifications.filter((n) => n.type === 'rights').length },
            { key: 'activity', label: 'Activities', count: allNotifications.filter((n) => n.type === 'activity').length },
          ].map((tab) => {
            const isActive = notificationFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setNotificationFilter(tab.key as any)}
                className={cn(
                  'relative rounded-xl px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap text-xs active:scale-95 cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-white/20'
                    : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:border-slate-300 shadow-2xs'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-black',
                    isActive
                      ? 'bg-white/25 text-white ring-1 ring-white/30'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Notifications List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-6">
              <div className="size-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 grid place-items-center text-blue-500 shadow-sm">
                <CheckCircle2 className="size-7 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-sm">All caught up!</h4>
                <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  No notifications in this filter. Any new ministry approvals or rights updates will appear here automatically.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isRead = readAlertIds.includes(item.id)

              return (
                <div
                  key={item.id}
                  className={cn(
                    'group relative rounded-2xl p-3.5 sm:p-4 transition-all duration-200 border text-xs',
                    isRead
                      ? 'bg-white/80 hover:bg-white border-slate-200/70 opacity-75 hover:opacity-100 shadow-2xs hover:shadow-xs'
                      : 'bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 border-blue-200/80 hover:border-blue-300 shadow-xs hover:shadow-md'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Category Icon Badge */}
                    <div
                      className={cn(
                        'size-9.5 rounded-xl grid place-items-center text-white shrink-0 shadow-sm ring-2 ring-white',
                        item.type === 'approval'
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-600 shadow-amber-500/20'
                          : item.type === 'rights'
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/20'
                          : 'bg-gradient-to-tr from-blue-600 to-cyan-600 shadow-blue-500/20'
                      )}
                    >
                      {item.type === 'approval' ? (
                        <ClipboardCheck className="size-4.5" />
                      ) : item.type === 'rights' ? (
                        <ShieldCheck className="size-4.5" />
                      ) : (
                        <Sparkles className="size-4.5" />
                      )}
                    </div>

                    {/* Notification Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-[#09245a] text-xs sm:text-[13px] leading-snug group-hover:text-blue-700 transition-colors line-clamp-1">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                          {item.badge && (
                            <span
                              className={cn(
                                'rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-2xs',
                                item.badgeColor
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
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100/90 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                          <Clock className="size-3 text-slate-400" />
                          <span>{item.time}</span>
                        </div>

                        <button
                          onClick={() => handleNotificationClick(item.targetTab, item.assetId, item.id)}
                          className="font-bold text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/90 border border-blue-200/60 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all active:scale-95 shadow-2xs group/btn cursor-pointer"
                        >
                          <span>Open in {item.targetTab}</span>
                          <ArrowRight className="size-3 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="relative z-10 border-t border-slate-200/80 p-3.5 sm:p-4 bg-gradient-to-b from-white/90 to-slate-50/95 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose()
              if (setActiveNav) setActiveNav('Approvals')
            }}
            className="flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/60 rounded-xl px-3 py-2 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          >
            <ClipboardCheck className="size-4 text-blue-600" />
            <span>Approvals Portal ({stats.pendingApprovalsCount})</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2 font-bold text-slate-700 text-xs shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
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
  setActiveNav,
  onOpenNotifications,
  isNotificationModalOpen = false,
  unreadCount = 0,
  isCollapsed = false,
  setIsCollapsed,
}: {
  setOpen: (v: boolean) => void
  setActiveNav?: (v: string, assetId?: string | null) => void
  onOpenNotifications?: () => void
  isNotificationModalOpen?: boolean
  unreadCount?: number
  isCollapsed?: boolean
  setIsCollapsed?: (v: boolean | ((prev: boolean) => boolean)) => void
}) {
  const { currentUser, setCurrentUser, availableUsers, resetToDefaultData, logout } = useLovetoonsData()
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3.5 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl transition-all lg:px-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <button className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer" onClick={() => setOpen(true)} aria-label="Open sidebar menu">
        <Menu className="size-5 text-[#09245a]" />
      </button>

      {/* Desktop Sidebar Toggle in Header */}
      {setIsCollapsed && (
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden lg:flex size-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-600 hover:text-blue-600 hover:bg-white shadow-2xs transition cursor-pointer"
          title={isCollapsed ? 'Expand sidebar (Ctrl+[)' : 'Collapse sidebar (Ctrl+[)'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      )}

      {/* Mobile Branding */}
      <div className="flex items-center gap-2 lg:hidden">
        <img src="/kmm-logo.png" alt="Kiddies Media Ministries" className="size-7 object-contain" />
        <span className="text-xs font-black text-[#09245a] tracking-tight">KMM</span>
      </div>

      {/* Search Input with Glossy Finish */}
      <div className="relative max-w-[520px] flex-1">
        <input
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200/80 bg-slate-100/60 pl-4 pr-11 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition backdrop-blur-sm"
          placeholder="Search intellectual assets, categories, titles, or rights..."
        />
        {searchFilter ? (
          <button
            onClick={() => setSearchFilter('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 grid size-6 place-items-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs pointer-events-none">
            <Search className="size-3.5" strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        {/* Notifications Modal Trigger */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className={cn(
              'grid size-9 place-items-center rounded-xl transition border cursor-pointer',
              isNotificationModalOpen
                ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500/20'
                : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white hover:text-blue-600 shadow-2xs'
            )}
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-4 px-1 h-4 place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        {/* ROLE SWITCHER DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 px-2.5 sm:px-3 py-1.5 shadow-2xs hover:border-blue-300 hover:bg-white transition cursor-pointer backdrop-blur-sm"
          >
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#021024] to-[#09245a] text-xs font-bold text-white shadow-sm">
              {currentUser.initials}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold leading-tight text-[#09245a] flex items-center gap-1.5">
                <span className="truncate max-w-[120px]">{currentUser.name}</span>
                <span className="rounded-md bg-blue-50 border border-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'reviewer' ? 'Reviewer' : 'Agency Rep'}
                </span>
              </div>
              <div className="text-[10px] font-medium text-slate-500 truncate max-w-[140px]">{currentUser.agency || currentUser.unit}</div>
            </div>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 w-72 sm:w-80 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in">
              <div className="border-b border-slate-100 pb-2.5 px-1">
                <div className="text-xs font-bold text-[#09245a]">Active Role & Profile Switcher</div>
                <p className="text-[11px] text-slate-500">Switch user profile to test role permissions</p>
              </div>

              <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {availableUsers.map((user) => {
                  const isSelected = user.id === currentUser.id
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user)
                        setRoleDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full flex items-start gap-2.5 rounded-xl p-2 text-left transition border cursor-pointer',
                        isSelected
                          ? 'bg-blue-50/80 border-blue-200 shadow-2xs'
                          : 'border-transparent hover:bg-slate-50'
                      )}
                    >
                      <div
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-lg font-bold text-xs text-white shadow-xs',
                          user.role === 'super_admin'
                            ? 'bg-purple-600'
                            : user.role === 'reviewer'
                            ? 'bg-emerald-600'
                            : 'bg-blue-600'
                        )}
                      >
                        {user.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs truncate">{user.name}</span>
                          {isSelected && <Check className="size-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <div className="text-[11px] font-semibold text-blue-700">{user.roleLabel}</div>
                        <div className="text-[10px] text-slate-400 truncate">Agency: {user.agency || user.unit}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-2.5 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    resetToDefaultData()
                    setRoleDropdownOpen(false)
                  }}
                  className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-800 p-1 cursor-pointer"
                >
                  <RefreshCw className="size-3" />
                  <span>Reset Demo Data</span>
                </button>
                <span className="text-slate-400 font-mono text-[10px]">KMM Platform</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setRoleDropdownOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2 px-3 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition cursor-pointer"
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

function AssetThumbnail({ type, name }: { type: AssetThumbType; name?: string }) {
  switch (type) {
    case 'tv_series':
      return (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-sm flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="size-full">
            <circle cx="38" cy="45" r="20" fill="#fcd34d" />
            <circle cx="34" cy="42" r="3" fill="#0f172a" />
            <circle cx="44" cy="42" r="3" fill="#0f172a" />
            <path d="M 33 50 Q 38 56 45 50" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 22 35 Q 38 18 54 35" fill="#78350f" />
            <circle cx="68" cy="52" r="18" fill="#fdba74" />
            <circle cx="64" cy="49" r="2.5" fill="#0f172a" />
            <circle cx="73" cy="49" r="2.5" fill="#0f172a" />
            <path d="M 63 56 Q 68 62 74 56" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 52 42 Q 68 28 82 42" fill="#ec4899" />
          </svg>
        </div>
      )
    case 'brave_boy':
      return (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-lime-400 to-emerald-600 shadow-sm flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="size-full">
            <circle cx="50" cy="50" r="26" fill="#f59e0b" />
            <circle cx="42" cy="46" r="3.5" fill="#0f172a" />
            <circle cx="58" cy="46" r="3.5" fill="#0f172a" />
            <path d="M 40 56 Q 50 66 60 56" stroke="#0f172a" strokeWidth="3" fill="#ffffff" strokeLinecap="round" />
            <path d="M 28 42 Q 50 16 72 42 C 65 30 35 30 28 42 Z" fill="#1e293b" />
            <path d="M 32 76 Q 50 88 68 76 L 75 100 L 25 100 Z" fill="#15803d" />
          </svg>
        </div>
      )
    case 'logo':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-[#03152c] p-1 shadow-sm flex items-center justify-center border border-slate-700 overflow-hidden">
          <img src="/lovetoons-logo.png" alt={name || 'Logo'} className="size-full object-contain" />
        </div>
      )
    case 'zobo':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-rose-900 to-red-950 p-1 shadow-sm flex items-center justify-center">
          <svg viewBox="0 0 60 80" className="h-8 w-5">
            <rect x="24" y="8" width="12" height="10" rx="2" fill="#e2e8f0" />
            <path d="M 18 20 Q 18 16 24 16 L 36 16 Q 42 16 42 20 L 44 65 Q 44 72 36 72 L 24 72 Q 16 72 16 65 Z" fill="#991b1b" stroke="#fecdd3" strokeWidth="1.5" />
            <rect x="20" y="32" width="20" height="22" rx="2" fill="#fff" opacity="0.9" />
            <circle cx="30" cy="43" r="5" fill="#e11d48" />
          </svg>
        </div>
      )
    case 'book':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-1 shadow-sm flex items-center justify-center">
          <div className="h-8 w-6 rounded-r bg-amber-400/90 border-l-2 border-indigo-950 p-0.5 flex flex-col items-center justify-between text-indigo-950 shadow">
            <span className="text-[5px] font-black tracking-tighter">PRAY</span>
            <div className="size-2 rounded-full border border-indigo-950 flex items-center justify-center text-[5px] font-bold">✝</div>
            <span className="text-[4px] font-semibold">BOOK</span>
          </div>
        </div>
      )
    case 'comics':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
          <div className="size-full rounded bg-white/90 p-0.5 flex flex-col items-center justify-between">
            <div className="w-full bg-red-600 text-[5px] font-black text-center text-white rounded-[2px] leading-tight">
              FAITH
            </div>
            <div className="text-[10px] font-black text-orange-600 leading-none">⚡</div>
            <div className="text-[4px] font-bold text-slate-800">COMIC</div>
          </div>
        </div>
      )
    case 'event':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-1 shadow-sm flex items-center justify-center relative overflow-hidden">
          <Sparkles className="size-4 text-amber-300" />
          <div className="text-[5px] font-bold text-cyan-300 mt-0.5">EVENT</div>
        </div>
      )
    case 'character_tilly':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-sm flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 100 100" className="size-full">
            <circle cx="50" cy="50" r="26" fill="#fbcfe8" />
            <circle cx="42" cy="46" r="3.5" fill="#0f172a" />
            <circle cx="58" cy="46" r="3.5" fill="#0f172a" />
            <path d="M 42 56 Q 50 64 58 56" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 24 38 Q 50 20 76 38 C 72 26 28 26 24 38 Z" fill="#7c2d12" />
            <rect x="25" y="34" width="50" height="6" rx="3" fill="#06b6d4" />
          </svg>
        </div>
      )
    case 'theme_song':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-950 p-1 shadow-sm flex items-center justify-center">
          <div className="flex items-end gap-0.5 h-5">
            <div className="w-1 bg-cyan-400 rounded-full h-2 animate-pulse" />
            <div className="w-1 bg-pink-400 rounded-full h-4 animate-pulse" />
            <div className="w-1 bg-amber-400 rounded-full h-5 animate-pulse" />
            <div className="w-1 bg-cyan-300 rounded-full h-3 animate-pulse" />
          </div>
        </div>
      )
    case 'brand_guidelines':
      return (
        <div className="size-10 shrink-0 rounded-lg bg-[#03152c] p-1 shadow-sm flex items-center justify-center border border-slate-700 overflow-hidden">
          <img src="/lovetoons-logo.png" alt={name || 'Brand Guidelines'} className="size-full object-contain scale-90" />
        </div>
      )
    default:
      return (
        <div className="size-10 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
          {name?.slice(0, 2) || 'LT'}
        </div>
      )
  }
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
    case 'Active':
    case 'Approved':
    case 'Cleared':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/70 shadow-2xs backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </span>
      )
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50/80 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/70 shadow-2xs backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      )
    case 'Requires Attention':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/80 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/70 shadow-2xs backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-rose-500" />
          Attention
        </span>
      )
    case 'In Review':
    case 'Review':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/70 shadow-2xs backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-blue-500" />
          In Review
        </span>
      )
    case 'Inactive':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200/60">
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
    <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgb(0,0,0,0.07)] hover:border-blue-200/80">
      <div className="flex items-start justify-between">
        <div className={cn('grid size-11 place-items-center rounded-xl text-white shadow-md transition-transform group-hover:scale-105', color)}>
          <Icon className="size-5" strokeWidth={2} />
        </div>
        <span className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold backdrop-blur-xs',
          isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-700 border border-slate-200'
        )}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
        <div className="mt-1 text-[11px] text-slate-400 font-medium">vs. previous period</div>
      </div>
    </div>
  )
}

function Donut({ approved, pending, attention }: { approved: number; pending: number; attention: number }) {
  const total = Math.max(1, approved + pending + attention)
  const appPct = Math.round((approved / total) * 100)
  const pendPct = Math.round((pending / total) * 100)

  return (
    <div
      className="relative grid size-40 place-items-center rounded-full p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
      style={{
        background: `conic-gradient(#10b981 0% ${appPct}%, #f59e0b ${appPct}% ${appPct + pendPct}%, #ef4444 ${appPct + pendPct}% 100%)`,
      }}
    >
      <div className="grid size-28 place-items-center rounded-full bg-white/95 backdrop-blur-md text-center shadow-lg border border-white/60">
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{total}</div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Assets</div>
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
  const { assets, allAssets, stats, globalStats, categories, activities, currentUser, isGlobalViewer, userAgency } = useLovetoonsData()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      assets.filter((a) =>
        `${a.name} ${a.id} ${a.category} ${a.subcategory}`.toLowerCase().includes(query.toLowerCase())
      ),
    [assets, query]
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-white/20">
            <Activity className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">
                {isGlobalViewer ? 'KMM Network Governance Dashboard' : `${currentUser.agency || userAgency} Dashboard`}
              </h1>
              <span className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-xs',
                isGlobalViewer ? 'bg-purple-100/80 text-purple-700 border-purple-200' : 'bg-blue-100/80 text-blue-700 border-blue-200'
              )}>
                {isGlobalViewer ? 'All Agencies Scope' : `${currentUser.agency} Rep`}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {isGlobalViewer
                ? 'Centralized oversight of Lovetoons, Publishing Agency, Digital Agency, Academy Agency, and Educational Agency.'
                : `Viewing intellectual assets, clearance compliance and staff contributors exclusively for ${currentUser.agency || userAgency}.`}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-white hover:border-blue-300 transition cursor-pointer backdrop-blur-sm">
          <CalendarDays className="size-3.5 text-blue-600" />
          <span>Active Q3 Period</span>
          <ChevronDown className="size-3 text-slate-400" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Boxes} label="Total Assets" value={stats.totalAssets} color="bg-gradient-to-br from-violet-600 to-purple-600" trend="↑ 12%" />
        <Stat icon={Check} label="Approved" value={stats.approvedAssets} color="bg-gradient-to-br from-emerald-500 to-teal-600" trend="↑ 8%" />
        <Stat icon={Clock3} label="Pending Approval" value={stats.pendingAssets} color="bg-gradient-to-br from-amber-500 to-orange-600" trend="↓ 3%" />
        <Stat icon={AlertCircle} label="Requires Attention" value={stats.attentionAssets} color="bg-gradient-to-br from-rose-500 to-red-600" trend="↓ 5%" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_.8fr]">
        <section className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#09245a] text-sm">Assets by Category</h2>
              <p className="text-xs text-blue-600">Distribution across active content streams</p>
            </div>
            <span className="rounded-lg bg-blue-50/80 border border-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
              {categories.length} Categories
            </span>
          </div>

          <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 px-2 pb-2">
            {categories.slice(0, 8).map((cat, i) => {
              const count = assets.filter((a) => a.category === cat.name).length
              const heightPct = Math.max(10, Math.min(100, (count / Math.max(1, assets.length)) * 250))
              return (
                <div key={cat.id} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5 group">
                  <span className="text-xs font-bold text-slate-800 group-hover:scale-110 transition">{count}</span>
                  <div
                    className={cn(
                      'w-full max-w-8 rounded-t-lg transition-all group-hover:brightness-110 shadow-xs',
                      ['bg-blue-600', 'bg-violet-600', 'bg-emerald-500', 'bg-orange-400', 'bg-rose-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500'][i % 8]
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

        <section className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md">
          <h2 className="font-bold text-[#09245a] text-sm">Asset Governance Status</h2>
          <div className="flex items-center justify-center gap-5 py-4">
            <Donut approved={stats.approvedAssets} pending={stats.pendingAssets} attention={stats.attentionAssets} />
            <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  Approved
                </span>
                <b className="text-slate-900">{stats.approvedAssets}</b>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  Pending
                </span>
                <b className="text-slate-900">{stats.pendingAssets}</b>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2.5 rounded-full bg-rose-500" />
                  Attention
                </span>
                <b className="text-slate-900">{stats.attentionAssets}</b>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#09245a] text-sm">Recent Registered Assets</h2>
            <p className="text-[11px] text-blue-600">
              {isGlobalViewer ? 'Latest intellectual property assets registered across all agencies' : `Latest assets for ${currentUser.agency}`}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[11px] outline-none focus:border-blue-400"
              placeholder="Search recent assets..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subcategory</th>
                <th className="p-3">Agency</th>
                <th className="p-3">Contributors</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created On</th>
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
                  className="hover:bg-blue-50/50 cursor-pointer transition group"
                  title={`Click to view ${item.name} details`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <AssetThumbnail type={item.thumbType} name={item.name} />
                      <div>
                        <div className="font-bold text-[#09245a] group-hover:text-blue-600 transition flex items-center gap-1">
                          <span>{item.name}</span>
                          <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 text-blue-600 transition shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{item.category}</td>
                  <td className="p-3 text-slate-600">{item.subcategory}</td>
                  <td className="p-3">
                    <span className="rounded-md bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {item.agency || item.unit}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center -space-x-1.5" title={`${item.contributors?.length || 1} staff contributors`}>
                      {(item.contributors && item.contributors.length > 0 ? item.contributors.slice(0, 3) : [
                        { id: 'c1', name: item.creatorName, role: item.creatorRole }
                      ]).map((c, i) => (
                        <div
                          key={c.id || i}
                          className="grid size-6 place-items-center rounded-full bg-slate-800 text-[9px] font-bold text-white ring-2 ring-white"
                          title={`${c.name} (${c.role})`}
                        >
                          {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                      ))}
                      {(item.contributors?.length || 0) > 3 && (
                        <div className="grid size-6 place-items-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 ring-2 ring-white">
                          +{(item.contributors?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="p-3 text-slate-500 font-medium text-[11px]">{item.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// -------------------------------------------------------------
// ASSETS PAGE & 2-STEP DYNAMIC ADD ASSET MODAL
// -------------------------------------------------------------
function AssetsPage({
  setActiveNav,
  initialAssetId,
}: {
  setActiveNav: (nav: string) => void
  initialAssetId?: string | null
}) {
  const { assets, allAssets, addAsset, bulkApproveAssets, bulkDeleteAssets, categories, subcategories, currentUser, showToast, isGlobalViewer, userAgency, availableUsers } = useLovetoonsData()

  const [selectedPill, setSelectedPill] = useState<string>('All Assets')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All Subcategories')
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses')
  const [selectedAgency, setSelectedAgency] = useState<string>('All Agencies')
  const [newContributorName, setNewContributorName] = useState('')
  const [newContributorRole, setNewContributorRole] = useState('Lead 3D Animator')
  const [newContributorAgency, setNewContributorAgency] = useState<Agency>(currentUser.agency || 'Lovetoons')
  const [newContributorType, setNewContributorType] = useState<AssetContributor['contributionType']>('Core Creative')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<1 | 2>(1)

  // Selected asset for Details Page
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<AssetData | null>(() => {
    if (initialAssetId) {
      return assets.find((a) => a.id === initialAssetId) || null
    }
    return null
  })

  useEffect(() => {
    if (initialAssetId) {
      const found = assets.find((a) => a.id === initialAssetId)
      if (found) setSelectedAssetForDetails(found)
    }
  }, [initialAssetId, assets])

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
    creatorName: string
    creatorSkill: UserSkill
    contributors: AssetContributor[]
    rightsHolder: string
    description: string
    tags: string
    thumbType: AssetThumbType
    posterUrl: string
    attributes: {
      episodesCount?: number
      durationMinutes?: number
      resolution?: '4K UHD' | '1080p Full HD' | '720p HD'
      aspectRatio?: '16:9' | '4:3' | '21:9'
      audioFormat?: 'WAV (24-bit/48kHz)' | 'FLAC' | 'MP3 (320kbps)'
      bpm?: number
      keySignature?: string
      pageCount?: number
      isbn?: string
      sku?: string
      manufacturer?: string
      trademarkClass?: string
      voiceActor?: string
      eventDate?: string
      venueLocation?: string
    }
  }>({
    name: '',
    category: categories[0]?.name || 'Animated Programme',
    subcategory: '',
    agency: currentUser.agency || 'Lovetoons',
    unit: currentUser.agency || 'Lovetoons',
    creatorName: currentUser.name,
    creatorSkill: currentUser.skills[0] || 'admin',
    contributors: [
      {
        id: 'c-init-1',
        name: currentUser.name,
        role: currentUser.roleLabel,
        agency: currentUser.agency || 'Lovetoons',
        email: currentUser.email,
        contributionType: 'Lead Author',
      },
    ],
    rightsHolder: 'Lovetoons Media Ltd',
    description: '',
    tags: 'Faith, Animated, Kids',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_poster.jpg',
    attributes: {
      resolution: '4K UHD',
      aspectRatio: '16:9',
      durationMinutes: 22,
    },
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
      if (selectedStatus !== 'All Statuses' && item.status !== selectedStatus) {
        return false
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
          item.creatorName.toLowerCase().includes(q) ||
          (item.agency && item.agency.toLowerCase().includes(q)) ||
          item.contributors?.some(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [assets, selectedCategory, selectedSubcategory, selectedStatus, selectedAgency, searchQuery])

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAssetForm.name) return

    const tagList = newAssetForm.tags.split(',').map((t) => t.trim()).filter(Boolean)

    addAsset({
      name: newAssetForm.name,
      type: newAssetForm.subcategory || 'Standard IP',
      category: newAssetForm.category,
      categoryGroup: newAssetForm.category,
      subcategory: newAssetForm.subcategory || availableSubcategoriesForForm[0]?.name || 'General',
      agency: isGlobalViewer ? newAssetForm.agency : (currentUser.agency || 'Lovetoons'),
      unit: isGlobalViewer ? newAssetForm.agency : (currentUser.agency || 'Lovetoons'),
      creatorName: newAssetForm.creatorName || currentUser.name,
      creatorRole: currentUser.roleLabel,
      creatorSkill: newAssetForm.creatorSkill,
      contributors: newAssetForm.contributors,
      status: 'Pending',
      thumbType: newAssetForm.thumbType,
      posterUrl: newAssetForm.posterUrl || '/tv_series_poster.jpg',
      rightsHolder: newAssetForm.rightsHolder,
      description: newAssetForm.description,
      tags: tagList.length > 0 ? tagList : ['New IP'],
      attributes: newAssetForm.attributes,
    })

    setIsAddModalOpen(false)
    setModalStep(1)
    setNewAssetForm({
      name: '',
      category: categories[0]?.name || 'Animated Programme',
      subcategory: '',
      agency: currentUser.agency || 'Lovetoons',
      unit: currentUser.agency || 'Lovetoons',
      contributors: [
        {
          id: 'c-init-1',
          name: currentUser.name,
          role: currentUser.roleLabel,
          agency: currentUser.agency || 'Lovetoons',
          email: currentUser.email,
          contributionType: 'Lead Author',
        },
      ],
      creatorName: currentUser.name,
      creatorSkill: currentUser.skills[0] || 'admin',
      rightsHolder: 'Lovetoons Media Ltd',
      description: '',
      tags: 'Faith, Animated, Kids',
      thumbType: 'tv_series',
      posterUrl: '/tv_series_poster.jpg',
      attributes: {
        resolution: '4K UHD',
        aspectRatio: '16:9',
        durationMinutes: 22,
      },
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* TOP HEADER / TITLE SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-white/20">
            <Boxes className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">Intellectual Assets</h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              View, manage, and track all intellectual property assets across Kiddies Media Ministries agencies.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsAddModalOpen(true)
            setModalStep(1)
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-700 hover:to-indigo-700 active:scale-98 cursor-pointer border border-white/20"
        >
          <Plus className="size-4" strokeWidth={2.5} />
          <span>Add New Asset</span>
        </button>
      </div>

      {/* HORIZONTAL CATEGORY PILLS ROW (Synced with Dropdown) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {pillFilters.map((pill) => {
          const isSelected = selectedPill === pill.label
          return (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill.label)}
              className={cn(
                'whitespace-nowrap rounded-xl px-3.5 py-2 font-semibold transition border flex items-center gap-2 cursor-pointer backdrop-blur-xs',
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white/80 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 shadow-2xs'
              )}
            >
              <span>{pill.label}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {pill.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by title, ID, creator, or agency..."
              className="h-10 w-full rounded-xl border border-slate-200/80 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryDropdownChange(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Requires Attention">Requires Attention</option>
              <option value="In Review">In Review</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Agency Filter */}
          <div className="relative">
            {isGlobalViewer ? (
              <>
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition"
                >
                  <option value="All Agencies">All Agencies ({assets.length})</option>
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              </>
            ) : (
              <div className="flex h-10 items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-3 text-xs font-bold text-blue-900">
                <span className="truncate">Agency: {currentUser.agency || userAgency}</span>
                <span className="rounded-md bg-blue-200/80 px-1.5 py-0.5 text-[9px] text-blue-800 shrink-0">Agency Scoped</span>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedRows.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50/90 px-4 py-2.5 border border-blue-200 text-xs backdrop-blur-sm animate-in fade-in">
            <span className="font-semibold text-blue-900">
              {selectedRows.length} {selectedRows.length === 1 ? 'asset' : 'assets'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  bulkApproveAssets(selectedRows)
                  setSelectedRows([])
                }}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white font-medium hover:bg-emerald-700 transition cursor-pointer shadow-xs"
              >
                Approve Selected
              </button>
              <button
                onClick={() => {
                  bulkDeleteAssets(selectedRows)
                  setSelectedRows([])
                }}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-red-600 font-medium hover:bg-red-50 transition cursor-pointer shadow-xs"
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
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-md text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                <th className="px-4 py-3">Creator / Skill</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
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
                        'transition duration-100 hover:bg-blue-50/40 cursor-pointer',
                        isSelected ? 'bg-blue-50/60' : 'bg-white'
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
                          <AssetThumbnail type={asset.thumbType} name={asset.name} />
                          <div className="min-w-0">
                            <div className="font-bold text-[#09245a] hover:text-blue-600 transition truncate max-w-xs">
                              {asset.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
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
                        <div className="flex items-center -space-x-1.5" title={`${asset.contributors?.length || 1} staff contributors`}>
                          {(asset.contributors && asset.contributors.length > 0 ? asset.contributors.slice(0, 3) : [
                            { id: 'lead', name: asset.creatorName, role: asset.creatorRole }
                          ]).map((c, i) => (
                            <div
                              key={c.id || i}
                              className="grid size-6 place-items-center rounded-full bg-slate-800 text-[9px] font-bold text-white ring-2 ring-white"
                              title={`${c.name} (${c.role})`}
                            >
                              {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                          ))}
                          {(asset.contributors?.length || 0) > 3 && (
                            <div className="grid size-6 place-items-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 ring-2 ring-white">
                              +{(asset.contributors?.length || 0) - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                          {asset.contributors?.[0]?.name || asset.creatorName}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{asset.creatorName}</div>
                        <div className="text-[10px] text-blue-600 capitalize">
                          {asset.creatorSkill.replace('_', ' ')}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <StatusPill status={asset.status} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{asset.createdDate}</div>
                        <div className="text-[10px] text-slate-400">{asset.createdTime}</div>
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectAsset(asset)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          aria-label={`Open details for ${asset.name}`}
                        >
                          <ChevronRight className="size-4 text-blue-600" />
                        </button>
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
            {/* Modal Header & Step Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white font-bold">
                    <Plus className="size-4" />
                  </div>
                  <h3 className="font-bold text-[#09245a] text-sm">Add New Intellectual Asset</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {modalStep === 1
                    ? 'Step 1 of 2: Core Identification & Operational Unit'
                    : `Step 2 of 2: Dynamic Category Attributes for ${newAssetForm.category}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'grid size-6 place-items-center rounded-full text-xs font-bold',
                      modalStep === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    1
                  </span>
                  <div className="h-0.5 w-4 bg-slate-200" />
                  <span
                    className={cn(
                      'grid size-6 place-items-center rounded-full text-xs font-bold',
                      modalStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    2
                  </span>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddAssetSubmit} className="mt-4 space-y-4">
              {/* STEP 1: CORE IDENTIFICATION */}
              {modalStep === 1 && (
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Agency *</label>
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
                      <label className="block font-semibold text-slate-700 mb-1">Creator Skill Classification</label>
                      <select
                        value={newAssetForm.creatorSkill}
                        onChange={(e) => setNewAssetForm((prev) => ({ ...prev, creatorSkill: e.target.value as UserSkill }))}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                      >
                        {skillOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* STAFF CONTRIBUTORS BUILDER */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block font-bold text-[#09245a] text-xs">Staff Contributors on this IP ({newAssetForm.contributors.length})</label>
                        <p className="text-[11px] text-slate-500">Capture contributing staff members, writers, artists, and engineers</p>
                      </div>
                    </div>

                    {/* Contributor List Chips */}
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {newAssetForm.contributors.map((c, idx) => (
                        <div
                          key={c.id || idx}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs text-xs"
                        >
                          <div className="grid size-6 place-items-center rounded bg-slate-800 text-[10px] font-bold text-white">
                            {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 leading-tight truncate max-w-[130px]">{c.name}</div>
                            <div className="text-[10px] text-blue-700 truncate">{c.role} • {c.agency}</div>
                          </div>
                          {newAssetForm.contributors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewAssetForm((prev) => ({
                                  ...prev,
                                  contributors: prev.contributors.filter((_, i) => i !== idx),
                                }))
                              }}
                              className="text-slate-400 hover:text-red-500 transition ml-1"
                              title="Remove contributor"
                            >
                              <X className="size-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Contributor Mini-Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-t border-blue-100/80 pt-2.5">
                      <div className="sm:col-span-1">
                        <input
                          type="text"
                          placeholder="Staff name..."
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
                          className="h-8 w-full rounded-md bg-blue-600 font-bold text-white text-xs hover:bg-blue-700 transition"
                        >
                          + Add Staff
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rights Holder / Owner</label>
                    <input
                      value={newAssetForm.rightsHolder}
                      onChange={(e) => setNewAssetForm((prev) => ({ ...prev, rightsHolder: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Asset Description</label>
                    <textarea
                      value={newAssetForm.description}
                      onChange={(e) => setNewAssetForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      placeholder="Summary of asset content, storyline, or technical specifications..."
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tag Chips (comma-separated)</label>
                    <input
                      value={newAssetForm.tags}
                      onChange={(e) => setNewAssetForm((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g. Faith, 3D, Episode, Broadcast"
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Asset Poster / Cover Image Selector */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-800 text-xs">Asset Poster / Cover Artwork</label>
                      <span className="text-[10px] text-slate-500 font-medium">Select a preset or enter image URL</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative size-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={newAssetForm.posterUrl || '/tv_series_poster.jpg'}
                          alt="Preview"
                          className="size-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/tv_series_poster.jpg'
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="url"
                          value={newAssetForm.posterUrl}
                          onChange={(e) => setNewAssetForm((prev) => ({ ...prev, posterUrl: e.target.value }))}
                          placeholder="https://... or /tv_series_poster.jpg"
                          className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-blue-400"
                        />
                        <div className="mt-1 text-[10px] text-slate-500">Live preview thumbnail shown on left</div>
                      </div>
                    </div>

                    {/* Quick Artwork Presets */}
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quick Presets</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'TV Show', url: '/tv_series_showcase.jpg' },
                          { label: 'TV Poster', url: '/tv_series_poster.jpg' },
                          { label: 'Lovetoons Logo', url: '/lovetoons-logo.png' },
                          { label: 'KMM Ministry', url: '/kmm-logo.png' },
                          { label: 'Storybook', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80' },
                          { label: 'Comic Strip', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80' },
                          { label: 'Music Studio', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80' },
                          { label: 'Merch Product', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80' },
                          { label: 'Live Festival', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setNewAssetForm((prev) => ({ ...prev, posterUrl: preset.url }))}
                            className={cn(
                              'rounded-lg px-2 py-1 text-[10px] font-semibold transition border',
                              newAssetForm.posterUrl === preset.url
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            )}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CATEGORY-SPECIFIC DYNAMIC ATTRIBUTES */}
              {modalStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="rounded-xl bg-purple-50/60 p-3 border border-purple-100 flex items-center gap-2.5">
                    <CategoryBadgeIcon category={newAssetForm.category} />
                    <div>
                      <div className="font-bold text-purple-900 text-xs">Dynamic Attributes: {newAssetForm.category}</div>
                      <div className="text-[10px] text-purple-700">Fields adapt dynamically to this intellectual asset type</div>
                    </div>
                  </div>

                  {/* If TV / Animation */}
                  {(newAssetForm.category.includes('TV') || newAssetForm.category.includes('Animated')) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Episode Count</label>
                        <input
                          type="number"
                          value={newAssetForm.attributes.episodesCount || 1}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, episodesCount: Number(e.target.value) },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Runtime (Mins)</label>
                        <input
                          type="number"
                          value={newAssetForm.attributes.durationMinutes || 22}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, durationMinutes: Number(e.target.value) },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Master Resolution</label>
                        <select
                          value={newAssetForm.attributes.resolution || '4K UHD'}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, resolution: e.target.value as any },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                        >
                          <option value="4K UHD">4K UHD</option>
                          <option value="1080p Full HD">1080p Full HD</option>
                          <option value="720p HD">720p HD</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* If Music / Audio */}
                  {newAssetForm.category.includes('Music') && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Audio Format</label>
                        <select
                          value={newAssetForm.attributes.audioFormat || 'WAV (24-bit/48kHz)'}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, audioFormat: e.target.value as any },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                        >
                          <option value="WAV (24-bit/48kHz)">WAV (24-bit/48kHz)</option>
                          <option value="FLAC">FLAC</option>
                          <option value="MP3 (320kbps)">MP3 (320kbps)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Tempo (BPM)</label>
                        <input
                          type="number"
                          placeholder="e.g. 124"
                          value={newAssetForm.attributes.bpm || ''}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, bpm: Number(e.target.value) },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Key Signature</label>
                        <input
                          placeholder="e.g. C Major"
                          value={newAssetForm.attributes.keySignature || ''}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, keySignature: e.target.value },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* If Publishing / Book / Comics */}
                  {newAssetForm.category.includes('Publishing') && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Page Count</label>
                        <input
                          type="number"
                          placeholder="e.g. 64"
                          value={newAssetForm.attributes.pageCount || ''}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, pageCount: Number(e.target.value) },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">ISBN / Filing Number</label>
                        <input
                          placeholder="978-0-998877-XX-X"
                          value={newAssetForm.attributes.isbn || ''}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, isbn: e.target.value },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* If Consumer Product */}
                  {newAssetForm.category.includes('Consumer') && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Product SKU</label>
                        <input
                          placeholder="LT-SKU-1002"
                          value={newAssetForm.attributes.sku || ''}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, sku: e.target.value },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Manufacturer Partner</label>
                        <input
                          placeholder="Lovetoons Merchandise Co."
                          value={newAssetForm.attributes.manufacturer || ''}
                          onChange={(e) =>
                            setNewAssetForm((prev) => ({
                              ...prev,
                              attributes: { ...prev.attributes, manufacturer: e.target.value },
                            }))
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Preset Selection */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Asset Mascot / Visual Preset</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {(
                        [
                          ['tv_series', 'TV Series'],
                          ['brave_boy', 'Brave Boy'],
                          ['character_tilly', 'Tilly Rig'],
                          ['book', 'Storybook'],
                          ['comics', 'Comics'],
                          ['theme_song', 'Audio Track'],
                          ['zobo', 'Merch Zobo'],
                          ['logo', 'Brand Logo'],
                          ['event', 'Festival'],
                        ] as [AssetThumbType, string][]
                      ).map(([t, label]) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewAssetForm((prev) => ({ ...prev, thumbType: t }))}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition',
                            newAssetForm.thumbType === t
                              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <AssetThumbnail type={t} name={label} />
                          <span className="text-[10px] font-semibold text-slate-700 truncate w-full">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL FOOTER BUTTONS */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                {modalStep === 2 ? (
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    ← Back to Step 1
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}

                {modalStep === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAssetForm.name) {
                        showToast('Please enter asset title first')
                        return
                      }
                      setModalStep(2)
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-sm flex items-center gap-1.5"
                  >
                    <span>Next: Category Attributes</span>
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white hover:bg-emerald-700 shadow-md flex items-center gap-1.5"
                  >
                    <Check className="size-4" />
                    <span>Create & Submit Asset</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
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
  setActiveNav?: (nav: string) => void
}) {
  const { assets, updateAsset, showToast, rightsRecords, relationships, approvals, activities, addRelationship, deleteRelationship } = useLovetoonsData()
  const [activeTab, setActiveTab] = useState('Overview & Preview')
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  // Direct Asset Relationship Modal State
  const [isAddRelModalOpen, setIsAddRelModalOpen] = useState(false)
  const [targetAssetId, setTargetAssetId] = useState('')
  const [relType, setRelType] = useState<RelationshipItem['relationshipType']>('Used In')
  const [relDetails, setRelDetails] = useState('')

  const handleAddRelationshipOnAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetAssetId) {
      showToast('Please select a target asset to link')
      return
    }
    const targetAsset = assets.find((a) => a.id === targetAssetId)
    if (!targetAsset) return

    addRelationship({
      sourceId: asset.id,
      sourceAssetId: asset.id,
      sourceAsset: asset.name,
      sourceIconType: asset.thumbType || 'tv_series',
      targetId: targetAsset.id,
      targetAssetId: targetAsset.id,
      targetAsset: targetAsset.name,
      targetIconType: targetAsset.thumbType || 'tv_series',
      relationshipType: relType,
      details: relDetails.trim() || `${asset.name} is ${relType} ${targetAsset.name}`,
      category: asset.category,
    })

    setIsAddRelModalOpen(false)
    setTargetAssetId('')
    setRelDetails('')
  }

  const linkedRights = useMemo(() => {
    return rightsRecords.find((r) => r.assetId === asset.id || r.name.includes(asset.name))
  }, [rightsRecords, asset])

  const assetRelationships = useMemo(() => {
    return relationships.filter((r) => r.sourceId === asset.id || r.targetId === asset.id || r.sourceAssetId === asset.id || r.targetAssetId === asset.id)
  }, [relationships, asset.id])

  const assetApprovals = useMemo(() => {
    return approvals.filter((a) => a.assetId === asset.id)
  }, [approvals, asset.id])

  const assetActivities = useMemo(() => {
    return activities.filter((act) => act.title.includes(asset.name) || act.subtitle.includes(asset.id))
  }, [activities, asset.name, asset.id])

  const tabs = ['Overview & Preview', 'Master Archive & Links', 'Sub-assets', 'Rights & Governance', 'Relationships', 'Approvals', 'Files & Versions', 'History']

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top breadcrumb navigation with prominent Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Assets</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <button onClick={onBack} className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
            <Boxes className="size-3.5" />
            <span>Assets</span>
          </button>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-slate-600">{asset.category}</span>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900 truncate max-w-xs">{asset.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {asset.category === 'Digital / Interactive Platform' && asset.archive?.websiteUrl && (
            <a
              href={asset.archive.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 shadow-2xs"
            >
              <Globe2 className="size-3.5" />
              <span>Visit Portal ↗</span>
            </a>
          )}

          {asset.category === 'Digital / Interactive Platform' && asset.archive?.repositoryUrl && (
            <a
              href={asset.archive.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 shadow-2xs"
            >
              <FileCode className="size-3.5" />
              <span>Source Repo ↗</span>
            </a>
          )}

          <button
            onClick={() => setActiveTab('Master Archive & Links')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <FolderKanban className="size-3.5 text-slate-600" />
            <span>Archive & Stems</span>
          </button>

          {setActiveNav && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', `/rights?asset=${asset.id}`)
                }
                setActiveNav('Rights & Governance')
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ShieldCheck className="size-3.5 text-blue-600" />
              <span>Rights & Governance ↗</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-white/80 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 min-w-0">
            <div className="relative size-32 sm:size-36 shrink-0 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-purple-100 to-blue-100 shadow-sm">
              {asset.id === 'LT-TS-001' || asset.posterUrl ? (
                <img src={asset.posterUrl || '/tv_series_poster.jpg'} alt={asset.name} className="size-full object-cover" />
              ) : (
                <div className="size-full grid place-items-center bg-[#03152c] p-2">
                  <AssetThumbnail type={asset.thumbType} name={asset.name} />
                </div>
              )}
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 border border-purple-200/80 px-2.5 py-1 text-xs font-bold text-purple-700 backdrop-blur-xs">
                  <Tv className="size-3.5" />
                  <span>{asset.category}</span>
                </span>
                <span className="rounded-lg bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-xs font-bold text-blue-700">
                  Agency: {asset.agency || asset.unit}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#09245a]">{asset.name}</h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">{asset.description}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {asset.tags.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100/80 border border-slate-200/70 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end justify-between gap-4 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0 shrink-0">
            <div className="relative">
              <button
                onClick={() => setStatusMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-emerald-50/80 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-2xs hover:bg-emerald-100 transition cursor-pointer backdrop-blur-xs"
              >
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>{asset.status}</span>
                <ChevronDown className="size-3 text-emerald-600" />
              </button>
              {statusMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl text-xs font-semibold backdrop-blur-xl animate-in fade-in">
                  {(['Approved', 'Pending', 'Requires Attention', 'In Review'] as AssetStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateAsset({ ...asset, status: s })
                        setStatusMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{s}</span>
                      {asset.status === s && <Check className="size-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-left sm:text-right">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Asset ID</div>
                <div className="text-xs font-mono font-extrabold text-[#09245a]">{asset.id}</div>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Created On</div>
                <div className="text-xs font-bold text-slate-800">{asset.createdDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border border-white/80 bg-white/80 px-2 sm:px-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                'whitespace-nowrap px-4 py-3 text-xs font-bold transition border-b-2 -mb-[1px] cursor-pointer',
                activeTab === t
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Overview & Visual Preview Tab */}
      {(activeTab === 'Overview & Preview' || activeTab === 'Overview') && (
        <div className="space-y-5">
          {/* Interactive Visual Preview Engine */}
          <AssetVisualPreview asset={asset} showToast={showToast} />

          {/* Asset Metadata & Dynamic Specifications */}
          <div className="grid gap-5 xl:grid-cols-[1fr_310px] items-start">
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <h2 className="text-base font-bold text-[#09245a] mb-4 border-b border-slate-100 pb-3">
                  Asset Metadata & Dynamic Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Agency</span>
                    <div className="font-bold text-slate-900">{asset.agency || asset.unit}</div>
                    <div className="text-[11px] text-slate-500">Created by {asset.creatorName} ({asset.creatorSkill})</div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Category & Subcategory</span>
                    <div className="font-bold text-slate-900">{asset.category}</div>
                    <div className="text-[11px] text-slate-500">{asset.subcategory}</div>
                  </div>

                  {asset.attributes?.episodesCount && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Episodes & Duration</span>
                      <div className="font-bold text-slate-900">{asset.attributes.episodesCount} Episodes • {asset.attributes.durationMinutes || 22} mins per ep</div>
                      <div className="text-[11px] text-slate-500">Master 4K UHD Broadcast Master</div>
                    </div>
                  )}

                  {asset.attributes?.audioFormat && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Audio Master Spec</span>
                      <div className="font-bold text-slate-900">{asset.attributes.audioFormat}</div>
                      <div className="text-[11px] text-slate-500">BPM: {asset.attributes.bpm || 120} • Key: {asset.attributes.keySignature || 'C Major'}</div>
                    </div>
                  )}

                  {asset.attributes?.pageCount && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Publication Specs</span>
                      <div className="font-bold text-slate-900">{asset.attributes.pageCount} Pages • {asset.attributes.isbn || 'ISBN Registered'}</div>
                      <div className="text-[11px] text-slate-500">{asset.attributes.formatType || 'Illustrated Hardcover'}</div>
                    </div>
                  )}

                  {asset.attributes?.sku && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Merchandise SKU</span>
                      <div className="font-bold text-slate-900">{asset.attributes.sku}</div>
                      <div className="text-[11px] text-slate-500">{asset.attributes.manufacturer || 'Lovetoons Merchandise'}</div>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Rights Holder Entity</span>
                    <div className="font-bold text-slate-900">{asset.rightsHolder || 'Lovetoons Media Ltd'}</div>
                    <div className="text-[11px] text-slate-500">Version {asset.version || 'v1.0'} • {asset.fileSize || '1.5 GB'}</div>
                  </div>
                </div>
              </div>

              {/* STAFF CONTRIBUTORS & CREATIVE TEAM CARD */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#09245a] flex items-center gap-2">
                      <Users className="size-4 text-blue-600" />
                      <span>Staff Contributors & Creative Team</span>
                      <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-bold">
                        {asset.contributors?.length || 1}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Staff members, artists, and specialists who contributed to this intellectual property
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(asset.contributors && asset.contributors.length > 0 ? asset.contributors : [
                    { id: 'lead', name: asset.creatorName, role: asset.creatorRole, agency: asset.agency || 'Lovetoons', contributionType: 'Lead Author' }
                  ]).map((c, idx) => (
                    <div
                      key={c.id || idx}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-white hover:border-blue-200 hover:shadow-xs transition"
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white shadow-2xs">
                        {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 text-xs truncate">{c.name}</span>
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 shrink-0">
                            {c.contributionType || 'Contributor'}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 truncate">{c.role}</div>
                        <div className="text-[10px] text-slate-400 truncate">{c.agency} • {(c as any).email || 'Verified Staff'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-[#09245a]">Rights Record Linked</h3>
                {linkedRights ? (
                  <div className="rounded-xl bg-purple-50 p-3 border border-purple-100 text-xs space-y-1">
                    <div className="font-bold text-purple-950">{linkedRights.rightsType}</div>
                    <div className="text-[11px] text-purple-700">Validity: {linkedRights.validity}</div>
                    <div className="text-[10px] text-emerald-700 font-bold">✓ Status: {linkedRights.status}</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 p-2 text-center bg-slate-50 rounded-xl">
                    No rights record linked yet
                  </div>
                )}
              </div>

              {/* Master Archive Shortcut Box */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-4 shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <FolderArchive className="size-4 text-blue-600" />
                  <span>IP Archive & Repositories</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Access live server endpoints, source code repositories, and master download files.
                </p>
                <button
                  onClick={() => setActiveTab('Master Archive & Links')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-2 font-bold text-white text-xs shadow-xs"
                >
                  <span>Open Master Archive Hub</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* 2. Master Archive & Links Tab */}
      {activeTab === 'Master Archive & Links' && (
        <AssetArchiveHub asset={asset} showToast={showToast} />
      )}

      {/* 2. Sub-assets Tab */}
      {activeTab === 'Sub-assets' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Associated Sub-Assets & Child Elements</h3>
              <p className="text-[11px] text-slate-500">Episodes, 3D rigs, audio stems and localized chapters linked to this master IP.</p>
            </div>
            <button
              onClick={() => showToast('Sub-asset upload drawer opened')}
              className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              + Add Sub-Asset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Video Sub-asset 1 with 16:9 thumbnail */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-44 aspect-video shrink-0 bg-slate-900 group">
                <img
                  src="/tv_series_showcase.jpg"
                  alt="Episode 01"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition">
                  <div className="grid size-8 place-items-center rounded-full bg-white/90 text-blue-600 shadow-md">
                    <Play className="size-4 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  24:15
                </span>
                <span className="absolute top-1.5 left-1.5 rounded bg-blue-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  4K UHD
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-slate-900 line-clamp-1">Episode 01: The Beginning of Faith</div>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shrink-0">Master Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Broadcast master with full multi-language audio stems and subtitles.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[10px] text-slate-500">
                  <span>Stereo & 5.1 Mix</span>
                  <button onClick={() => showToast('Playing Episode 01 preview...')} className="font-bold text-blue-600 hover:underline">Play Preview</button>
                </div>
              </div>
            </div>

            {/* Video Sub-asset 2 with 16:9 thumbnail */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-44 aspect-video shrink-0 bg-slate-900 group">
                <img
                  src="/tv_series_poster.jpg"
                  alt="Episode 02"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition">
                  <div className="grid size-8 place-items-center rounded-full bg-white/90 text-blue-600 shadow-md">
                    <Play className="size-4 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  22:40
                </span>
                <span className="absolute top-1.5 left-1.5 rounded bg-blue-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  4K UHD
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-slate-900 line-clamp-1">Episode 02: The Courage to Stand</div>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shrink-0">Master Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Complete animation render with color-graded scenes and sound effects.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[10px] text-slate-500">
                  <span>Stereo & 5.1 Mix</span>
                  <button onClick={() => showToast('Playing Episode 02 preview...')} className="font-bold text-blue-600 hover:underline">Play Preview</button>
                </div>
              </div>
            </div>

            {/* Audio Stems Sub-asset */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-xl bg-purple-100 text-purple-700 grid place-items-center shrink-0">
                  <Music className="size-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">Soundtrack Orchestral Stems & Cues</div>
                  <div className="text-[11px] text-slate-500">WAV 24-bit/48kHz • 14 Separate Instrument Tracks</div>
                </div>
              </div>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 shrink-0">Audio Sync</span>
            </div>

            {/* 3D Character Rig Sub-asset */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-xl bg-amber-100 text-amber-700 grid place-items-center shrink-0">
                  <Layers className="size-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">3D Main Character Rig & Facial Morph Pack</div>
                  <div className="text-[11px] text-slate-500">Blender / Maya .blend • v2.4 Master Production Rig</div>
                </div>
              </div>
              <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 shrink-0">Rig Active</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Rights & Governance Tab */}
      {activeTab === 'Rights & Governance' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Chain of Title & Legal Governance</h3>
              <p className="text-[11px] text-slate-500">Copyright clearance certificates, licensing scope and territory rights.</p>
            </div>
            {setActiveNav && (
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', `/rights?asset=${asset.id}`)
                  }
                  setActiveNav('Rights & Governance')
                }}
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 flex items-center gap-1.5"
              >
                <ShieldCheck className="size-3.5" />
                <span>Open in Rights Portal</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rights Scope</span>
              <div className="font-bold text-slate-900">{linkedRights?.rightsType || 'Worldwide Master Copyright'}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Territory & Term</span>
              <div className="font-bold text-slate-900">{linkedRights?.territory || 'Worldwide'} • {linkedRights?.validity || '2025–2035'}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Governance Clearance</span>
              <div className="font-bold text-emerald-700">100% Cleared ✓ ({linkedRights?.status || 'Cleared'})</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Relationships Tab */}
      {activeTab === 'Relationships' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Asset Relationships & Cross-Unit Links</h3>
              <p className="text-[11px] text-slate-500">
                Connected master brands, musical soundtracks, merchandise, publications, and broadcast dependencies.
              </p>
            </div>
            <button
              onClick={() => setIsAddRelModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
              <span>Add Relationship</span>
            </button>
          </div>

          {assetRelationships.length > 0 ? (
            <div className="space-y-2.5 text-xs">
              {assetRelationships.map((rel) => {
                const isSource = rel.sourceId === asset.id || rel.sourceAssetId === asset.id || rel.sourceAsset === asset.name
                const otherAssetName = isSource ? rel.targetAsset : rel.sourceAsset
                const otherAssetId = isSource ? rel.targetId || rel.targetAssetId : rel.sourceId || rel.sourceAssetId
                const otherAssetObj = assets.find((a) => a.id === otherAssetId || a.name === otherAssetName)

                return (
                  <div
                    key={rel.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 grid place-items-center shrink-0 font-bold">
                        <Link2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.5 font-extrabold text-[10px] tracking-wide uppercase">
                            {rel.relationshipType}
                          </span>
                          <span className="font-bold text-[#09245a] truncate text-sm">
                            {otherAssetName}
                          </span>
                          {otherAssetObj && (
                            <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
                              {otherAssetObj.category}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{rel.details}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      {otherAssetObj && onSelectAsset && (
                        <button
                          onClick={() => onSelectAsset(otherAssetObj)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          <span>View Asset</span>
                          <ChevronRight className="size-3" />
                        </button>
                      )}
                      <div className="text-[10px] text-slate-400 font-medium">{rel.createdDate}</div>
                      <button
                        onClick={() => deleteRelationship(rel.id)}
                        title="Remove Relationship"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-xs text-slate-500 p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 mx-auto">
                <Link2 className="size-5" />
              </div>
              <div className="font-bold text-slate-700">No Relationships Linked Yet</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Link this asset to soundtracks, companion books, merchandising products, brand guidelines or character rigs.
              </p>
              <button
                onClick={() => setIsAddRelModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus className="size-3.5" />
                <span>Add First Relationship</span>
              </button>
            </div>
          )}

          {/* Interactive Add Relationship Modal */}
          {isAddRelModalOpen && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsAddRelModalOpen(false)
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
            >
              <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid size-7 place-items-center rounded-lg bg-teal-600 text-white font-bold">
                      <Link2 className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#09245a] text-sm">Add Relationship to Asset</h3>
                      <p className="text-[10px] text-slate-500">Connect {asset.name} to another intellectual asset</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddRelModalOpen(false)}
                    className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <form onSubmit={handleAddRelationshipOnAsset} className="mt-4 space-y-4">
                  {/* Source Asset (Fixed) */}
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Source Asset</span>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="font-mono text-blue-600">{asset.id}</span>
                      <span>{asset.name}</span>
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] text-blue-700 font-semibold">{asset.category}</span>
                    </div>
                  </div>

                  {/* Relationship Type */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship Type *</label>
                    <select
                      value={relType}
                      onChange={(e) => setRelType(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-semibold text-slate-800"
                    >
                      <option value="Used In">Used In (e.g. Character Used In TV Episode)</option>
                      <option value="Used By">Used By (e.g. Asset Used By Digital App)</option>
                      <option value="Soundtrack For">Soundtrack For (e.g. Music Album for TV Series)</option>
                      <option value="Derived From">Derived From (e.g. Comic Book Derived From Animation)</option>
                      <option value="Contains">Contains (e.g. Master Series Contains Episodes/Rigs)</option>
                      <option value="Appears In">Appears In (e.g. Character Appears In Game)</option>
                      <option value="Applied To">Applied To (e.g. Brand Applied To Merchandise)</option>
                      <option value="Distributed On">Distributed On (e.g. Show Distributed On OTT Portal)</option>
                      <option value="Parent Of">Parent Of (e.g. IP Universe Parent Of Spin-Off)</option>
                      <option value="Featured At">Featured At (e.g. Characters Featured At Festival)</option>
                      <option value="Related To">Related To (General Cross-IP Association)</option>
                    </select>
                  </div>

                  {/* Target Asset */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Asset *</label>
                    <select
                      value={targetAssetId}
                      onChange={(e) => setTargetAssetId(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-semibold text-slate-800"
                      required
                    >
                      <option value="">-- Select Target Intellectual Asset --</option>
                      {assets
                        .filter((a) => a.id !== asset.id)
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.category} • {a.id})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Connection Details / Notes */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship Context / Details</label>
                    <textarea
                      value={relDetails}
                      onChange={(e) => setRelDetails(e.target.value)}
                      placeholder="Describe how these two intellectual assets connect or depend on each other..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Modal Buttons */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddRelModalOpen(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700 shadow-md flex items-center gap-1.5"
                    >
                      <Link2 className="size-4" />
                      <span>Save Relationship</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Approvals Tab */}
      {activeTab === 'Approvals' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Ministry Governance & Content Approval Pipeline</h3>
              <p className="text-[11px] text-slate-500">Editorial reviews, doctrine clearance, and reviewer sign-off history.</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {asset.status === 'Approved' ? '✓ Fully Approved' : 'In Review'}
            </span>
          </div>

          {assetApprovals.length > 0 ? (
            <div className="space-y-3">
              {assetApprovals.map((app) => (
                <div key={app.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#09245a] text-sm">{app.stage}</span>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">{app.status}</span>
                  </div>
                  <div className="text-slate-600">Reviewer: <b className="text-slate-900">{app.reviewerName}</b> • Submitted by: {app.requesterName}</div>
                  {app.feedbackNotes && (
                    <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-slate-700 italic">
                      "{app.feedbackNotes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 text-xs space-y-2">
              <div className="font-bold text-emerald-700">✓ Standard Ministry Review Passed</div>
              <div className="text-slate-600">Approved by Lead Reviewer Faith Daniel for worldwide broadcast and distribution.</div>
            </div>
          )}
        </div>
      )}

      {/* 6. Files & Versions Tab */}
      {activeTab === 'Files & Versions' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Master Files, Stems & Version History</h3>
              <p className="text-[11px] text-slate-500">Master broadcast renditions, project source files and release archives.</p>
            </div>
            <button
              onClick={() => showToast('File upload drawer opened')}
              className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              + Upload Version
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50 hover:bg-white transition">
              <div className="flex items-center gap-3">
                <FileCode className="size-5 text-blue-600" />
                <div>
                  <div className="font-bold text-slate-900">{asset.name.replace(/[^a-zA-Z0-9]/g, '_')}_Master_4K_ProRes.mov</div>
                  <div className="text-[10px] text-slate-400">{asset.fileSize || '2.1 GB'} • ProRes 422 HQ • Master Master v2.0</div>
                </div>
              </div>
              <button
                onClick={() => showToast('Starting download for master ProRes file...')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Download
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50 hover:bg-white transition">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-purple-600" />
                <div>
                  <div className="font-bold text-slate-900">Script_Storyboards_and_Dialogue_Release.pdf</div>
                  <div className="text-[10px] text-slate-400">12.4 MB • PDF Document • v1.0</div>
                </div>
              </div>
              <button
                onClick={() => showToast('Starting download for script doc...')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. History Tab */}
      {activeTab === 'History' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-[#09245a] text-sm border-b border-slate-100 pb-3">Audit Log & Modification History</h3>
          <div className="space-y-3 text-xs">
            {assetActivities.length > 0 ? (
              assetActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <div className={cn('grid size-7 place-items-center rounded-lg text-xs shrink-0', act.color)}>
                    <Activity className="size-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{act.title}</div>
                    <div className="text-[11px] text-slate-500">{act.subtitle}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{act.time} • by {act.user}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl space-y-1">
                <div className="font-semibold text-slate-800">Asset Registered into Platform</div>
                <div className="text-[11px] text-slate-500">{asset.createdDate} by {asset.creatorName} ({asset.unit})</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
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
  const { rightsRecords, addRightsRecord, assets, showToast, currentUser } = useLovetoonsData()

  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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
    rightsType: 'Worldwide Broadcast & Streaming',
    owner: 'Lovetoons Media Ltd',
    validity: '2025 – 2035',
    territory: 'Worldwide',
    exclusivity: 'Exclusive Ministry Rights',
    licenceType: 'Proprietary Broadcast License',
    royaltyTerms: '100% In-House Retained',
    documents: [
      {
        id: `doc-${Date.now()}`,
        name: 'Lovetoons_IP_Registration_Filing_Certificate.pdf',
        size: '2.4 MB',
        date: 'Sep 25, 2025',
        type: 'CERT',
      },
    ],
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
      status: 'Cleared',
      territory: newRightsForm.territory,
      term: '10 Years',
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
      if (selectedStatus !== 'All Statuses' && rec.status !== selectedStatus) return false
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
  }, [rightsRecords, selectedCategory, selectedStatus, searchQuery])

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
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">Rights & Governance</h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              Track copyright, chain of title, territory clearances and legal documents across assets.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
        >
          <Plus className="size-4" />
          <span>Add Rights Record</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs flex flex-wrap gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rights records, license types, or owners..."
            className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-400"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none"
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Cleared">Cleared</option>
          <option value="Review">Under Review</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* RECORDS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="p-3.5">Asset / Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Rights Scope</th>
              <th className="p-3.5">Owner / Holder</th>
              <th className="p-3.5">Validity</th>
              <th className="p-3.5">Docs</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => handleSelectRightsAsset(rec)}
                className="hover:bg-blue-50/40 cursor-pointer transition"
              >
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <AssetThumbnail type={rec.thumbType} name={rec.name} />
                    <div>
                      <div className="font-bold text-[#09245a] hover:text-blue-600 transition">{rec.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rec.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-medium text-slate-700">{rec.category}</td>
                <td className="p-3.5">
                  <span className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                    {rec.rightsType}
                  </span>
                </td>
                <td className="p-3.5 font-medium text-slate-700">{rec.owner}</td>
                <td className="p-3.5 font-semibold text-slate-600">{rec.validity}</td>
                <td className="p-3.5">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {rec.documents?.length || 1} File(s)
                  </span>
                </td>
                <td className="p-3.5">
                  <StatusPill status={rec.status as any} />
                </td>
                <td className="p-3.5 text-right">
                  <ChevronRight className="size-4 text-blue-600 inline" />
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
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#09245a] text-sm">
                <ShieldCheck className="size-4 text-blue-600" />
                <span>Add Rights & Governance Record</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRightsSubmit} className="mt-4 space-y-3.5">
              {/* Asset Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Asset *</label>
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
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.id} — {a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rights Scope / Type *</label>
                <input
                  value={newRightsForm.rightsType}
                  onChange={(e) => setNewRightsForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                  placeholder="e.g. Worldwide Broadcast & Streaming Rights"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner / Holder</label>
                  <input
                    value={newRightsForm.owner}
                    onChange={(e) => setNewRightsForm((prev) => ({ ...prev, owner: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validity Period</label>
                  <input
                    value={newRightsForm.validity}
                    onChange={(e) => setNewRightsForm((prev) => ({ ...prev, validity: e.target.value }))}
                    placeholder="2025 – 2035"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Upload Document Attachment */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
                <label className="block font-bold text-slate-800 text-xs">Attach Rights Document / Certificate</label>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Document Title (e.g. Master_Copyright_Release.pdf)"
                    value={newRightsForm.newDocName}
                    onChange={(e) => setNewRightsForm((prev) => ({ ...prev, newDocName: e.target.value }))}
                    className="h-8 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none"
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
                    <div key={doc.id} className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200 text-[11px]">
                      <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-blue-600" />
                        <span className="font-semibold text-slate-800">{doc.name}</span>
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
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Save Rights Record
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
  const { updateRightsRecord, addRightsRecord, currentUser, showToast, activities, approvals, addAsset } = useLovetoonsData()
  const [subTab, setSubTab] = useState('Overview & Rights')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddRightsModalOpen, setIsAddRightsModalOpen] = useState(false)
  const [newDocTitle, setNewDocTitle] = useState('')

  // Edit Governance Form State
  const [editForm, setEditForm] = useState({
    rightsType: asset.rightsType,
    owner: asset.owner,
    validity: asset.validity,
    territory: asset.territory || 'Worldwide',
    term: asset.term || '10 Years',
    exclusivity: asset.exclusivity || 'Exclusive Ministry Rights',
    licenceType: asset.licenceType || 'Proprietary Broadcast License',
    royaltyTerms: asset.royaltyTerms || '100% In-House Retained',
    governanceScore: asset.governanceScore || 100,
    status: asset.status,
    description: asset.description || 'Master chain of title and IP clearance certificate on file.',
  })

  // Submit Clearance / New Rights Record Form State
  const [addRightsForm, setAddRightsForm] = useState({
    rightsType: 'Digital Streaming & International Syndication',
    territory: 'North America & Europe',
    term: '5 Years',
    exclusivity: 'Non-Exclusive License',
    licenceType: 'Syndication Broadcast',
    royaltyTerms: '15% Gross Revenue Share',
    docName: 'Syndication_Agreement_Draft.pdf',
  })

  const [checks, setChecks] = useState(
    asset.governanceChecks || {
      biblicalAlignment: true,
      ageAppropriate: true,
      musicSync: true,
      copyrightReg: true,
      voiceReleases: true,
    }
  )

  const toggleCheck = (key: keyof typeof checks) => {
    const updated = { ...checks, [key]: !checks[key] }
    setChecks(updated)
    const passedCount = Object.values(updated).filter(Boolean).length
    const calculatedScore = Math.round((passedCount / Object.keys(updated).length) * 100)
    updateRightsRecord({
      ...asset,
      governanceChecks: updated,
      governanceScore: calculatedScore,
    })
    showToast(`Governance check updated: ${key} (${calculatedScore}% Score)`)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
    showToast(`Governance details for "${asset.name}" updated and audit logged!`)
  }

  const handleAddRightsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDoc: RightsDocument = {
      id: `doc-${Date.now()}`,
      name: addRightsForm.docName || 'Rights_Clearance_Submission.pdf',
      size: '2.5 MB',
      date: 'Just now',
      type: 'LICENSE',
    }

    addRightsRecord({
      assetId: asset.assetId || asset.id,
      name: `${asset.name} (${addRightsForm.rightsType.split(' ')[0]})`,
      category: asset.category,
      subcategory: asset.subcategory,
      unit: asset.unit || currentUser.unit,
      rightsType: addRightsForm.rightsType,
      owner: asset.owner,
      validity: '2025 – 2030',
      status: 'Review',
      territory: addRightsForm.territory,
      term: addRightsForm.term,
      exclusivity: addRightsForm.exclusivity,
      licenceType: addRightsForm.licenceType,
      royaltyTerms: addRightsForm.royaltyTerms,
      thumbType: asset.thumbType,
      governanceScore: 85,
      documents: [newDoc],
    })

    setIsAddRightsModalOpen(false)
    showToast('New rights scope submitted! Reviewers will see this in their Approvals queue.')
  }

  const handleAttachDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocTitle.trim()) return

    const newDoc: RightsDocument = {
      id: `doc-${Date.now()}`,
      name: newDocTitle.trim(),
      size: '1.9 MB',
      date: 'Just now',
      type: 'CERT',
    }

    const updatedDocs = [...(asset.documents || []), newDoc]
    updateRightsRecord({
      ...asset,
      documents: updatedDocs,
    })
    setNewDocTitle('')
    showToast(`Document "${newDoc.name}" uploaded and attached!`)
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
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Rights & Governance</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <button onClick={onBack} className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
            <ShieldCheck className="size-3.5" />
            <span>Rights & Governance</span>
          </button>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-bold text-slate-900">{asset.name}</span>
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
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Boxes className="size-3.5 text-blue-600" />
              <span>View Core Asset ↗</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <AssetThumbnail type={asset.thumbType} name={asset.name} />
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">{asset.category}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">ID: {asset.id}</span>
                <span className={cn(
                  'rounded px-2.5 py-0.5 text-[10px] font-bold',
                  asset.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                )}>
                  ★ {asset.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#09245a] mt-1.5">{asset.name}</h1>
              <p className="text-xs text-slate-600 mt-0.5">{asset.rightsType}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Pencil className="size-3.5" />
              <span>Edit Governance Details</span>
            </button>
            <button
              onClick={() => setIsAddRightsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition"
            >
              <Plus className="size-4" />
              <span>+ Add Rights Scope</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="text-[11px] font-bold text-slate-600">Chain of Title</div>
          <div className="text-xs font-bold text-emerald-600 mt-0.5">Documented & Filed ✓</div>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
          <div className="text-[11px] font-bold text-slate-600">Rights Clearance</div>
          <div className="text-xs font-bold text-emerald-600 mt-0.5">{asset.status} ✓</div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="text-[11px] font-bold text-slate-600">Territory & Term</div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">{asset.territory || 'Worldwide'} • {asset.term || '10 Yrs'}</div>
        </div>
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
          <div className="text-[11px] font-bold text-slate-600">Governance Score</div>
          <div className="text-xs font-bold text-blue-700 mt-0.5">{asset.governanceScore || 100}% Compliant</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-slate-200 bg-white px-3 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          {['Overview & Rights', 'Governance Checklist', 'Legal Documents', 'Audit History'].map((st) => (
            <button
              key={st}
              onClick={() => setSubTab(st)}
              className={cn(
                'px-4 py-3.5 text-xs font-bold border-b-2 -mb-[1px] transition',
                subTab === st ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Overview & Rights Sub-Tab */}
      {subTab === 'Overview & Rights' && (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px] items-start">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#09245a] border-b border-slate-100 pb-3">
                Rights & Governance Scope Breakdown
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Rights Scope</span>
                  <div className="font-bold text-slate-900 text-sm">{asset.rightsType}</div>
                  <div className="text-[11px] text-slate-500">{asset.exclusivity || 'Exclusive Ministry Rights'}</div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Territory Clearance</span>
                  <div className="font-bold text-slate-900 text-sm">{asset.territory || 'Worldwide'}</div>
                  <div className="text-[11px] text-slate-500">Term: {asset.term || '10 Years'} ({asset.validity})</div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Rights Holder</span>
                  <div className="font-bold text-slate-900 text-sm">{asset.owner}</div>
                  <div className="text-[11px] text-slate-500">Parent Agency: {asset.agency || 'Lovetoons'}</div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Licensing & Royalty Terms</span>
                  <div className="font-bold text-slate-900 text-sm">{asset.licenceType || 'Proprietary Broadcast'}</div>
                  <div className="text-[11px] text-slate-500">{asset.royaltyTerms || '100% In-House Retained'}</div>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100 text-xs">
                <div className="font-bold text-blue-950 mb-1">Legal Summary & Chain of Title Notes</div>
                <p className="text-slate-600 leading-relaxed">
                  {asset.description || 'Full worldwide copyright, theatrical, broadcast and OTT streaming clearance on file with LoveWorld/Lovetoons intellectual property administration.'}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold text-[#09245a]">Governance Compliance Score</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Compliance Rate</span>
                  <span className="text-blue-700">{asset.governanceScore || 100}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${asset.governanceScore || 100}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Attached Documents</span>
                  <b className="text-slate-900">{asset.documents?.length || 1} File(s)</b>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Current Clearance Status</span>
                  <b className="text-emerald-700">{asset.status}</b>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full rounded-xl bg-slate-100 p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Modify Governance Controls
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 2. Governance Checklist Sub-Tab */}
      {subTab === 'Governance Checklist' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Ministry Governance & Content Clearance Checklist</h3>
              <p className="text-[11px] text-slate-500">Toggle clearance controls to update real-time governance compliance scoring.</p>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
              Score: {asset.governanceScore || 100}%
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              ['biblicalAlignment', 'Biblical & Spiritual Doctrine Alignment Validated', 'Content conforms with ministry faith and scripture doctrine.'],
              ['ageAppropriate', 'Age-Appropriate Rating & Child Safety Standards Cleared', 'Kiddies media safety and psychological review passed.'],
              ['musicSync', 'Music & Soundtrack Synchronization License Filed', 'Composer deeds, cue sheets and publishing agreements signed.'],
              ['copyrightReg', 'Trademark & Master Copyright Certificate Filed', 'Official statutory IP filing deed and brand mark registered.'],
              ['voiceReleases', 'Voice Actor & Performer Release Deeds Executed', 'All voice cast, vocalists and talent releases archived.'],
            ].map(([k, label, desc]) => (
              <div key={k} className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 bg-slate-50/60 hover:bg-slate-50 transition">
                <div>
                  <div className="font-semibold text-slate-800 text-xs">{label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
                </div>
                <button
                  onClick={() => toggleCheck(k as any)}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 font-bold text-xs transition shadow-2xs shrink-0',
                    (checks as any)[k] ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  )}
                >
                  {(checks as any)[k] ? 'Cleared ✓' : 'Pending'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Legal Documents Sub-Tab */}
      {subTab === 'Legal Documents' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">Filing Certificates & Legal Contracts</h3>
              <p className="text-[11px] text-slate-500">Official certificates of registration, work-for-hire deeds, and broadcast agreements.</p>
            </div>
          </div>

          <form onSubmit={handleAttachDocument} className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 flex items-center gap-2 text-xs">
            <input
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Attach new legal contract (e.g. Master_Licensing_Agreement_2025.pdf)..."
              className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="h-9 rounded-lg bg-blue-600 px-4 font-bold text-white hover:bg-blue-700 transition"
            >
              + Upload Document
            </button>
          </form>

          <div className="space-y-2.5 text-xs">
            {asset.documents && asset.documents.length > 0 ? (
              asset.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-blue-100 text-blue-700 font-bold text-[10px]">
                      {d.type || 'PDF'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{d.name}</div>
                      <div className="text-[10px] text-slate-400">{d.size} • Uploaded on {d.date}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Starting download for ${d.name}...`)}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    Download
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                No legal documents attached yet. Use the upload box above to add filing certificates.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Audit History Sub-Tab */}
      {subTab === 'Audit History' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#09245a] text-sm">Governance Audit Log & Activity Trail</h3>
            <p className="text-[11px] text-slate-500">Immutable record of modifications, reviews, status changes, and administrator edits.</p>
          </div>

          <div className="space-y-3 text-xs">
            {recordActivities.length > 0 ? (
              recordActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5 bg-slate-50/50">
                  <div className={cn('grid size-7 place-items-center rounded-lg text-xs shrink-0', act.color)}>
                    <Shield className="size-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{act.title}</div>
                    <div className="text-[11px] text-slate-500">{act.subtitle}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{act.time} • by {act.user} ({act.unit || 'Platform Admin'})</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
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
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#09245a] text-sm">
                <Pencil className="size-4 text-blue-600" />
                <span>Edit Governance & Rights Details</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rights Scope / Title</label>
                <input
                  value={editForm.rightsType}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rights Holder / Owner</label>
                  <input
                    value={editForm.owner}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, owner: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clearance Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
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
                  <label className="block font-semibold text-slate-700 mb-1">Territory</label>
                  <input
                    value={editForm.territory}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, territory: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Term / Validity</label>
                  <input
                    value={editForm.validity}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, validity: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exclusivity</label>
                  <input
                    value={editForm.exclusivity}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, exclusivity: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Licence Type</label>
                  <input
                    value={editForm.licenceType}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, licenceType: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Royalty Terms</label>
                <input
                  value={editForm.royaltyTerms}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, royaltyTerms: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Legal Description & Notes</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-sm"
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
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#09245a] text-sm">
                <Plus className="size-4 text-blue-600" />
                <span>Submit Rights Scope for {asset.name}</span>
              </div>
              <button
                onClick={() => setIsAddRightsModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRightsSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Rights Scope / Type *</label>
                <input
                  value={addRightsForm.rightsType}
                  onChange={(e) => setAddRightsForm((prev) => ({ ...prev, rightsType: e.target.value }))}
                  placeholder="e.g. Worldwide Merchandising & Digital Licensing"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Territory</label>
                  <input
                    value={addRightsForm.territory}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, territory: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Term Duration</label>
                  <input
                    value={addRightsForm.term}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, term: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exclusivity</label>
                  <input
                    value={addRightsForm.exclusivity}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, exclusivity: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Licence Type</label>
                  <input
                    value={addRightsForm.licenceType}
                    onChange={(e) => setAddRightsForm((prev) => ({ ...prev, licenceType: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Royalty Split / Financial Terms</label>
                <input
                  value={addRightsForm.royaltyTerms}
                  onChange={(e) => setAddRightsForm((prev) => ({ ...prev, royaltyTerms: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supporting Document File</label>
                <input
                  value={addRightsForm.docName}
                  onChange={(e) => setAddRightsForm((prev) => ({ ...prev, docName: e.target.value }))}
                  placeholder="e.g. Licensing_Agreement_Draft.pdf"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
                <b>Note for Review Workflow:</b> Submitting this rights clearance automatically adds an entry to the Approvals Queue for Lead Reviewers and Super Admins to verify.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRightsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Submit for Clearance Review
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
// -------------------------------------------------------------
// APPROVALS PAGE (ROLE PROTECTED - REVIEWER & SUPER ADMIN ONLY)
// -------------------------------------------------------------
function ApprovalsPage() {
  const {
    approvals,
    approveRequest,
    declineRequest,
    requestFeedback,
    canApprove,
    currentUser,
    setCurrentUser,
    availableUsers,
    showToast,
    rightsRecords,
  } = useLovetoonsData()

  const [activeTab, setActiveTab] = useState<'Pending' | 'Needs Feedback' | 'Approved' | 'All'>('Pending')
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null)
  const [selectedDocPreview, setSelectedDocPreview] = useState<{
    doc: RightsDocument
    approval: ApprovalRequest
  } | null>(null)

  const [feedbackInput, setFeedbackInput] = useState('')
  const [declineReason, setDeclineReason] = useState('')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'feedback' | 'decline' | null>(null)

  const filteredApprovals = useMemo(() => {
    return approvals.filter((a) => {
      if (activeTab === 'Pending') return a.status === 'Pending'
      if (activeTab === 'Needs Feedback') return a.status === 'Needs Feedback'
      if (activeTab === 'Approved') return a.status === 'Approved'
      return true
    })
  }, [approvals, activeTab])

  // If user is a Unit Admin (not Reviewer or Super Admin), show clear permission gate
  if (!canApprove) {
    const reviewerUser = availableUsers.find((u) => u.role === 'reviewer') || availableUsers[1]
    const superAdminUser = availableUsers.find((u) => u.role === 'super_admin') || availableUsers[0]

    return (
      <div className="space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <ShieldAlert className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a]">Approvals Workflow Queue</h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              Governance and clearance queue for content reviewers and administrators.
            </p>
          </div>
        </div>

        {/* Access Restricted Banner with Quick Switch Button */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-xs">
          <div className="grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-700 mx-auto mb-3 shadow-inner">
            <Lock className="size-7" />
          </div>
          <h2 className="text-lg font-bold text-[#09245a]">Reviewer & Super Admin Access Only</h2>
          <p className="mt-1.5 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            You are currently logged in as <b className="text-slate-900">{currentUser.name}</b> ({currentUser.roleLabel} — {currentUser.unit}). Approval reviews and sign-offs are restricted to Content Reviewers and Super Admins.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentUser(reviewerUser)}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              Switch to Faith Daniel (Reviewer)
            </button>
            <button
              onClick={() => setCurrentUser(superAdminUser)}
              className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition"
            >
              Switch to Sylver Oyinaga (Super Admin)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/20">
            <ClipboardCheck className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">Approvals & Governance Queue</h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              Review submitted intellectual assets, attached legal documents, and validate ministry standards for broadcast sign-off.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle className="size-3.5" />
            <span>Authorized Reviewer: {currentUser.name} ({currentUser.roleLabel})</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white px-3 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['Pending', 'Needs Feedback', 'Approved', 'All'] as const).map((tab) => {
            const count =
              tab === 'Pending'
                ? approvals.filter((a) => a.status === 'Pending').length
                : tab === 'Needs Feedback'
                ? approvals.filter((a) => a.status === 'Needs Feedback').length
                : tab === 'Approved'
                ? approvals.filter((a) => a.status === 'Approved').length
                : approvals.length

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3.5 text-xs font-bold border-b-2 -mb-[1px] transition flex items-center gap-1.5',
                  activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                )}
              >
                <span>{tab}</span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* APPROVALS CARDS LIST */}
      <div className="grid gap-4">
        {filteredApprovals.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <ClipboardCheck className="mx-auto size-10 text-slate-300 mb-2" />
            <div className="font-bold text-slate-700">No approval requests in this tab</div>
            <div className="text-xs text-slate-400">All submissions are currently processed</div>
          </div>
        ) : (
          filteredApprovals.map((app) => {
            const isExpanded = expandedAppId === app.id
            const matchedRights = rightsRecords.find((r) => r.assetId === app.assetId || r.id === app.assetId)
            const attachedDocs = app.documents && app.documents.length > 0
              ? app.documents
              : matchedRights?.documents || [
                  {
                    id: 'doc-def-1',
                    name: 'Kiddies_Media_Ministry_Lovetoons_IP_Register.docx',
                    size: '4.8 MB',
                    date: app.submittedDate,
                    type: 'DOCX',
                  },
                  {
                    id: 'doc-def-2',
                    name: 'Chain_of_Title_and_Script_Clearance.pdf',
                    size: '2.1 MB',
                    date: app.submittedDate,
                    type: 'CERT',
                  },
                ]

            return (
              <div
                key={app.id}
                className={cn(
                  'rounded-2xl border bg-white p-5 shadow-xs transition duration-200 space-y-4',
                  isExpanded ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200/90 hover:border-slate-300'
                )}
              >
                {/* Main Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <CategoryBadgeIcon category={app.category} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#09245a] text-sm sm:text-base">{app.assetName}</h3>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {app.category} • {app.subcategory}
                        </span>
                        <span className="rounded bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                          Agency: {app.agency || app.unit}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[9px] font-bold',
                            app.priority === 'Urgent' || app.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {app.priority} Priority
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Stage: <b className="text-slate-800">{app.stage}</b></span>
                        <span className="text-slate-300">•</span>
                        <span>Submitted by <b className="text-slate-800">{app.requesterName}</b> ({app.requesterRole})</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">{app.submittedDate} {app.submittedTime}</span>
                      </div>

                      {app.feedbackNotes && (
                        <div className="mt-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2.5">
                          <MessageSquare className="size-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Feedback / Revision Request: </span>
                            <span>{app.feedbackNotes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 lg:shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition',
                        isExpanded
                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <Eye className="size-3.5" />
                      <span>{isExpanded ? 'Hide Review Details' : `View Details & Docs (${attachedDocs.length})`}</span>
                      <ChevronDown className={cn('size-3.5 transition-transform', isExpanded && 'rotate-180')} />
                    </button>

                    {app.status === 'Pending' || app.status === 'Needs Feedback' ? (
                      <>
                        <button
                          onClick={() => approveRequest(app.id)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="size-3.5" />
                          <span>Approve & Clear</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApproval(app)
                            setActionType('feedback')
                            setIsActionModalOpen(true)
                          }}
                          className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 flex items-center gap-1.5"
                        >
                          <MessageSquare className="size-3.5" />
                          <span>Request Feedback</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApproval(app)
                            setActionType('decline')
                            setIsActionModalOpen(true)
                          }}
                          className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <Check className="size-3.5" />
                        <span>Cleared & Approved</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* EXPANDABLE REVIEWER DETAILS & ATTACHED DOCUMENTS */}
                {isExpanded && (
                  <div className="border-t border-slate-100 pt-4 space-y-4 animate-in fade-in duration-150">
                    {/* 1. Attached Documents Section */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-blue-600" />
                          <h4 className="font-bold text-[#09245a] text-xs">Attached Legal & Clearance Documents ({attachedDocs.length})</h4>
                        </div>
                        <span className="text-[10px] text-blue-700 font-semibold bg-white rounded px-2 py-0.5 border border-blue-200">
                          Chain of Title Verified
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {attachedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs hover:border-blue-300 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 shrink-0 font-bold text-[10px]">
                                {doc.type === 'DOCX' ? 'DOCX' : doc.type === 'CERT' ? 'CERT' : 'PDF'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 text-xs truncate max-w-[200px]" title={doc.name}>
                                  {doc.name}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {doc.size} • {doc.date}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setSelectedDocPreview({ doc, approval: app })}
                                className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition"
                              >
                                <Eye className="size-3" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => showToast(`Downloading ${doc.name}...`)}
                                className="grid size-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 transition"
                                title="Download Document"
                              >
                                <Download className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Rights Scope & Territorial Clearance Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Rights Scope</span>
                        <div className="font-bold text-slate-900">{app.rightsType || matchedRights?.rightsType || 'Worldwide Broadcast & Distribution'}</div>
                        <div className="text-[10px] text-slate-500">{app.exclusivity || matchedRights?.exclusivity || 'Exclusive Ministry Rights'}</div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Territory & Term</span>
                        <div className="font-bold text-slate-900">{app.territory || matchedRights?.territory || 'Worldwide'}</div>
                        <div className="text-[10px] text-slate-500">Term: {app.term || matchedRights?.term || '10 Years'}</div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Licensing Terms</span>
                        <div className="font-bold text-slate-900">{app.licenceType || matchedRights?.licenceType || 'Proprietary Broadcast License'}</div>
                        <div className="text-[10px] text-slate-500">{app.royaltyTerms || matchedRights?.royaltyTerms || '100% In-House Retained'}</div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Governance Score</span>
                        <div className="font-bold text-emerald-700 text-sm">
                          {app.governanceScore || matchedRights?.governanceScore || 100}% Compliant
                        </div>
                        <div className="text-[10px] text-slate-500">Doctrinal Checks Passed ✓</div>
                      </div>
                    </div>

                    {/* 3. Governance Checklist Preview */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs space-y-2">
                      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Reviewer Governance Checklist Status</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          ['Biblical & Doctrine Alignment', true],
                          ['Age-Appropriate Child Safety', true],
                          ['Music & Soundtrack Synchronization', true],
                          ['Statutory Trademark / IP Registration', true],
                          ['Talent & Voice Performer Releases', true],
                        ].map(([label, passed]) => (
                          <div key={label as string} className="flex items-center gap-2 rounded-lg bg-white p-2 border border-slate-200/80 text-[11px]">
                            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{label as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Submission Justification & Timeline */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800">Submission Description & Notes:</div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {app.description || matchedRights?.description || 'Full asset production master files, script releases and chain of title certificates uploaded for reviewer sign-off.'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Review Steps</span>
                        <span className="font-bold text-slate-800 text-xs">Step {app.currentStep} of {app.totalSteps}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDocPreview && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDocPreview(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs max-h-[90vh] overflow-y-auto cursor-default space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#03152c] p-1.5 flex items-center justify-center border border-slate-700">
                  <img src="/lovetoons-logo.png" alt="Lovetoons" className="h-5 w-auto object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-[#09245a] text-sm">{selectedDocPreview.doc.name}</h3>
                  <p className="text-[11px] text-slate-500">Official Intellectual Property & Governance Attachment</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Document Details & Certification Content */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">File Type</span>
                  <span className="font-bold text-blue-700 uppercase">{selectedDocPreview.doc.type} Document</span>
                </div>
                <div>
                  <span className="text-slate-400 block">File Size</span>
                  <span className="font-bold text-slate-800">{selectedDocPreview.doc.size}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Upload Date</span>
                  <span className="font-bold text-slate-800">{selectedDocPreview.doc.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Security Status</span>
                  <span className="font-bold text-emerald-700">SHA-256 Verified ✓</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="font-bold text-slate-900 text-xs">Chain of Title & Legal Governance Summary:</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed space-y-1.5 font-mono">
                  <p>
                    <b>Document Identifier:</b> {selectedDocPreview.doc.id}
                  </p>
                  <p>
                    <b>Registered Asset:</b> {selectedDocPreview.approval.assetName} ({selectedDocPreview.approval.category})
                  </p>
                  <p>
                    <b>Submitting Entity:</b> {selectedDocPreview.approval.requesterName} ({selectedDocPreview.approval.unit})
                  </p>
                  <p>
                    <b>Clearance Clause:</b> This intellectual asset document represents statutory copyright filings, talent releases, and doctrinal alignment verification certified under Lovetoons / Kiddies Media Ministry governance protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => showToast(`Document "${selectedDocPreview.doc.name}" downloaded to local disk.`)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 text-xs"
              >
                <Download className="size-3.5 text-blue-600" />
                <span>Download File</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocPreview(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 text-xs"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    approveRequest(selectedDocPreview.approval.id)
                    setSelectedDocPreview(null)
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700 shadow-sm text-xs flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Verify & Approve Asset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK & DECLINE MODAL */}
      {isActionModalOpen && selectedApproval && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsActionModalOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#09245a] text-sm">
                {actionType === 'feedback' ? 'Request Revisions / Feedback' : 'Decline Asset Clearance'}
              </h3>
              <button onClick={() => setIsActionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="font-bold text-slate-900">{selectedApproval.assetName}</div>
                <div className="text-[11px] text-slate-500">Requester: {selectedApproval.requesterName} ({selectedApproval.unit})</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {actionType === 'feedback' ? 'Specify required revisions or questions:' : 'Reason for declining:'}
                </label>
                <textarea
                  rows={4}
                  value={actionType === 'feedback' ? feedbackInput : declineReason}
                  onChange={(e) => (actionType === 'feedback' ? setFeedbackInput(e.target.value) : setDeclineReason(e.target.value))}
                  placeholder="Enter detailed review feedback for the creator..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (actionType === 'feedback') {
                      requestFeedback(selectedApproval.id, feedbackInput || 'Please revise and resubmit.')
                    } else {
                      declineRequest(selectedApproval.id, declineReason || 'Does not meet ministry broadcast standards.')
                    }
                    setIsActionModalOpen(false)
                    setFeedbackInput('')
                    setDeclineReason('')
                  }}
                  className={cn(
                    'rounded-lg px-5 py-2 font-bold text-white shadow-sm',
                    actionType === 'feedback' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                  )}
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
      sourceIconType: sourceAsset.thumbType,
      relationshipType: relType,
      targetAssetId: targetAsset.id,
      targetAsset: targetAsset.name,
      targetId: targetAsset.id,
      targetIconType: targetAsset.thumbType,
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
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            <Link2 className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">Asset Relationships</h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              Manage cross-asset dependencies, soundtrack links, character mascot usages, and distribution links.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          <Plus className="size-4" />
          <span>Add Relationship</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-2xl font-black text-[#09245a]">{relationships.length}</div>
          <div className="text-xs text-slate-500 font-semibold">Active IP Relationships</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-2xl font-black text-purple-700">{assets.length}</div>
          <div className="text-xs text-slate-500 font-semibold">Total Linked Assets</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-2xl font-black text-emerald-600">100%</div>
          <div className="text-xs text-slate-500 font-semibold">Governance Integrity</div>
        </div>
      </div>

      {/* Relationships Table & Filter Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="font-bold text-[#09245a] text-sm">
            All Connected Asset Links ({filtered.length})
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connected assets or details..."
                className="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-blue-400"
              />
            </div>

            <select
              value={selectedRelType}
              onChange={(e) => setSelectedRelType(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All Types">All Relationship Types</option>
              {relTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Relationships Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="p-3">Source Asset</th>
                <th className="p-3">Relationship Type</th>
                <th className="p-3">Target Asset</th>
                <th className="p-3">Link Scope & Notes</th>
                <th className="p-3">Registered On</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No relationships found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((rel) => {
                  const srcAsset = assets.find((a) => a.id === rel.sourceId || a.id === rel.sourceAssetId)
                  const tgtAsset = assets.find((a) => a.id === rel.targetId || a.id === rel.targetAssetId)

                  return (
                    <tr key={rel.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            <img
                              src={srcAsset?.posterUrl || '/tv_series_poster.jpg'}
                              alt={rel.sourceAsset}
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#09245a]">{rel.sourceAsset}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{rel.sourceId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                          <span>{rel.relationshipType}</span>
                          <ArrowRight className="size-3 text-blue-500" />
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            <img
                              src={tgtAsset?.posterUrl || '/tv_series_showcase.jpg'}
                              alt={rel.targetAsset}
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{rel.targetAsset}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{rel.targetId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-600 text-[11px] max-w-xs leading-tight">
                        {rel.details}
                      </td>

                      <td className="p-3 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {rel.createdDate}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            deleteRelationship(rel.id)
                            showToast('Relationship removed')
                          }}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white font-bold">
                  <Link2 className="size-4" />
                </div>
                <h3 className="font-bold text-[#09245a] text-sm">Add IP Relationship Link</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source Asset *</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.category} • {a.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship Type *</label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value as any)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {relTypeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Asset *</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                >
                  {assets
                    .filter((a) => a.id !== sourceId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.category} • {a.id})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link Scope & Description</label>
                <textarea
                  value={relDetails}
                  onChange={(e) => setRelDetails(e.target.value)}
                  placeholder="e.g. Character mascot artwork and logo printed on school bag merchandise..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-sm">
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
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            <Grid2X2 className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">
              Categories & Subcategories
            </h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              Manage IP classification taxonomy, category hierarchy, and operational counts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddCatOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="size-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => setIsAddSubOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-50"
          >
            <Plus className="size-4" />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const liveAssetsCount = assets.filter((a) => a.category === cat.name).length
          const liveSubsCount = subcategories.filter((s) => s.parentCategory === cat.name).length

          return (
            <div key={cat.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <CategoryBadgeIcon category={cat.name} />
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Active
                </span>
              </div>

              <div>
                <h3 className="font-bold text-[#09245a] text-sm">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Subcategories</span>
                  <div className="font-bold text-slate-900">{liveSubsCount}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Assets</span>
                  <div className="font-bold text-blue-600">{liveAssetsCount}</div>
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#09245a] text-sm">Add Category</h3>
              <button onClick={() => setIsAddCatOpen(false)} className="text-slate-400">
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
                  color: 'bg-blue-600',
                })
                setIsAddCatOpen(false)
                setCatName('')
                setCatDesc('')
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddCatOpen(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg">
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#09245a] text-sm">Add Subcategory</h3>
              <button onClick={() => setIsAddSubOpen(false)} className="text-slate-400">
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
                  color: 'bg-purple-600',
                })
                setIsAddSubOpen(false)
                setSubName('')
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Category *</label>
                <select
                  value={subParent}
                  onChange={(e) => setSubParent(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none"
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
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddSubOpen(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg">
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
function ReportsPage() {
  const { stats, assets, categories, showToast } = useLovetoonsData()

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            <FileBarChart className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">
              Governance & IP Analytics Reports
            </h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              Live portfolio summary, copyright clearance health, and asset distribution statistics.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Exporting complete Intellectual Asset Portfolio Report (CSV)...')}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
        >
          <Download className="size-4" />
          <span>Export All Data (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Total Portfolio Assets</div>
          <div className="text-2xl font-black text-[#09245a] mt-1">{stats.totalAssets}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Catalogued</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Cleared Rights Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {Math.round((stats.clearedRightsCount / Math.max(1, stats.totalRights)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">{stats.clearedRightsCount} of {stats.totalRights} Cleared</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Agencies</div>
          <div className="text-2xl font-black text-purple-700 mt-1">{agencies.length}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">All Active</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Pending Governance Items</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.pendingApprovalsCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Requires Review</div>
        </div>
      </div>

      {/* Unit Breakdown Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
        <h2 className="font-bold text-[#09245a] text-sm">Agency Asset Distribution & Contributions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="p-3">Agency</th>
                <th className="p-3">Total Assets</th>
                <th className="p-3">Approved</th>
                <th className="p-3">Pending</th>
                <th className="p-3">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operationalUnits.map((u) => {
                const unitAssets = assets.filter((a) => (a.agency || a.unit) === u)
                const unitApproved = unitAssets.filter((a) => a.status === 'Approved').length
                const unitPending = unitAssets.filter((a) => a.status === 'Pending').length
                const rate = unitAssets.length > 0 ? Math.round((unitApproved / unitAssets.length) * 100) : 100

                return (
                  <tr key={u} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#09245a]">{u}</td>
                    <td className="p-3 font-semibold text-slate-700">{unitAssets.length}</td>
                    <td className="p-3 text-emerald-700 font-bold">{unitApproved}</td>
                    <td className="p-3 text-amber-600 font-bold">{unitPending}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="font-bold text-slate-700">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            <Settings className="size-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#09245a] sm:text-3xl">Platform Settings</h1>
            <p className="mt-0.5 text-[12px] font-medium text-slate-500">
              System architecture, category taxonomy governance, cloud media storage, and admin session security.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('Platform configuration saved successfully!')}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
          >
            <Save className="size-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* SUPER ADMIN TAXONOMY MANAGEMENT PANEL */}
      <div className="rounded-3xl border-2 border-blue-500/25 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#09245a] text-white shadow-md shadow-blue-900/20">
              <Grid2X2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#09245a]">
                  Super Admin Settings: Category & Subcategory Taxonomy
                </h2>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                    <ShieldCheck className="size-3 text-purple-700" />
                    <span>Super Admin Mode</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    <ShieldAlert className="size-3 text-amber-700" />
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
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-98 transition cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Add New Category</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubParent(categories[0]?.name || '')
                    setIsAddSubOpen(true)
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 active:scale-98 transition shadow-2xs cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Add New Subcategory</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const superAdminUser = availableUsers.find((u) => u.role === 'super_admin')
                  if (superAdminUser) {
                    setCurrentUser(superAdminUser)
                    showToast('Switched to Super Admin profile to unlock category creation.')
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition cursor-pointer"
              >
                <ShieldCheck className="size-4" />
                <span>Switch to Super Admin to Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Taxonomy KPI Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
            <div className="text-xl font-black text-[#09245a] mt-0.5">{categories.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Master Classifications</div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subcategories</span>
            <div className="text-xl font-black text-purple-700 mt-0.5">{subcategories.length}</div>
            <div className="text-[10px] text-slate-400 font-medium">Specialized Types</div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classified Assets</span>
            <div className="text-xl font-black text-blue-600 mt-0.5">{stats.totalAssets}</div>
            <div className="text-[10px] text-slate-400 font-medium">Mapped to Taxonomy</div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registry Governance</span>
            <div className="text-xl font-black text-emerald-700 mt-0.5">100%</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Central Verified</div>
          </div>
        </div>

        {/* Search taxonomy */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={taxonomySearch}
              onChange={(e) => setTaxonomySearch(e.target.value)}
              placeholder="Filter categories or subcategories..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-blue-200 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CategoryBadgeIcon category={cat.name} />
                      <div>
                        <h3 className="font-bold text-[#09245a] text-sm leading-snug">{cat.name}</h3>
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Subcategories ({catSubs.length})
                      </span>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => openAddSubForCategory(cat.name)}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
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
                              <span className="rounded bg-blue-100/70 px-1 py-0.2 text-[9px] font-bold text-blue-800">
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
                  <span className="font-bold text-blue-600">{catAssets.length} assets</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CORE SYSTEM CONFIGURATION 2-COLUMN GRID */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* 1. Organization & Ministry Profile */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-blue-600" />
              <h2 className="font-bold text-[#09245a] text-sm">Ministry Organization & Brand Registry</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              Active Entity
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col items-center justify-center size-24 rounded-2xl bg-[#03152c] p-2.5 border border-slate-700 shrink-0 shadow-sm">
              <img src="/lovetoons-logo.png" alt="Lovetoons" className="h-8 w-auto object-contain brightness-105" />
              <div className="text-[8px] font-bold text-white/80 uppercase mt-1 tracking-wider">Kiddies Media</div>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="font-bold text-[#09245a] text-sm">Kiddies Media Ministry (Lovetoons)</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Global intellectual property owner and publishing entity for Christian animation, music, publishing, and interactive digital platforms.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">ID: KMM-LT-GLOBAL-01</span>
                <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">www.lovetoons.org</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Headquarters / Studio</span>
              <div className="font-bold text-slate-800">Lagos Studio & London Bureau</div>
              <div className="text-[10px] text-slate-500">Lovetoons Media Ltd, Nigeria & UK</div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Default Rights Notice</span>
              <div className="font-bold text-slate-800 line-clamp-1">© 2025–2035 Lovetoons Media Ltd</div>
              <div className="text-[10px] text-slate-500">All Rights Reserved Worldwide</div>
            </div>
          </div>
        </div>

        {/* 2. Governance & Legal Clearance Policies */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-purple-600" />
              <h2 className="font-bold text-[#09245a] text-sm">Governance & Rights Clearance Policies</h2>
            </div>
            <span className="rounded bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-bold">
              Standard v2.1
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Master License Scope</label>
              <select
                value={defaultRightsScope}
                onChange={(e) => setDefaultRightsScope(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
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
                <span className="font-mono font-bold text-purple-700">{governanceScoreThreshold}%</span>
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

            <div className="rounded-xl bg-purple-50/60 p-3 border border-purple-100 space-y-2">
              <div className="font-bold text-purple-900 text-xs">Mandatory Pre-Broadcast Clearances</div>
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
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-blue-600" />
              <h2 className="font-bold text-[#09245a] text-sm">Cloud Media Storage & Archival Infrastructure</h2>
            </div>
            <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              99.99% Online
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Primary S3 / Cloud Bucket</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">Connected ✓</span>
              </div>
              <div className="font-mono font-bold text-slate-900 text-xs">s3://lovetoons-master-media-archives-prod</div>
              <div className="text-[10px] text-slate-500">Region: eu-west-1 (Ireland) • 24.8 TB Total Stored</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Global Media Stream CDN</span>
                <span className="font-mono text-[10px] text-blue-700 font-bold">Edge Active</span>
              </div>
              <div className="font-mono font-bold text-slate-900 text-xs">https://cdn.lovetoons.org/masters/v1/</div>
              <div className="text-[10px] text-slate-500">Edge caching enabled across Africa, Europe, Americas and Asia</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg bg-blue-50/80 p-2.5 border border-blue-100">
                <div className="text-[10px] font-bold text-blue-800">Master Retention</div>
                <div className="font-bold text-[#09245a] mt-0.5">Permanent Cold Storage</div>
              </div>
              <div className="rounded-lg bg-blue-50/80 p-2.5 border border-blue-100">
                <div className="text-[10px] font-bold text-blue-800">Transcode Targets</div>
                <div className="font-bold text-[#09245a] mt-0.5">4K UHD, 1080p, 720p, WAV</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Active Session, Notifications & Security */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-blue-600" />
              <h2 className="font-bold text-[#09245a] text-sm">Active Account Session & Maintenance</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Session Live
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* User Session Details */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-blue-100 bg-blue-50/40">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#03152c] text-white font-bold text-xs shadow-xs">
                  {currentUser.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                  <div className="text-[11px] text-blue-700 font-semibold">{currentUser.roleLabel} • {currentUser.unit}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
              >
                <LogOut className="size-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Notifications */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer">
                <div>
                  <div className="font-bold text-slate-800">Email Alerts on Approval Requests</div>
                  <div className="text-[11px] text-slate-500">Send notifications to reviewers when items are submitted</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 size-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer">
                <div>
                  <div className="font-bold text-slate-800">In-App Push Alerts for Rights Clearance</div>
                  <div className="text-[11px] text-slate-500">Show high-priority badges when copyright deeds expire or clear</div>
                </div>
                <input
                  type="checkbox"
                  checked={browserAlerts}
                  onChange={(e) => setBrowserAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 size-4"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maintenance Operations</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Platform cache purged and synced with Cloud storage')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition text-xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5 text-slate-500" />
                  <span>Purge Cache & Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 p-2.5 font-bold text-rose-700 hover:bg-rose-100 transition text-xs cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  <Plus className="size-4" />
                </div>
                <h3 className="font-bold text-[#09245a] text-sm">Add New Category (Super Admin)</h3>
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
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Explain the scope and asset types for this classification..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
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
                        catColor === color.val ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'opacity-80'
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
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  <Plus className="size-4" />
                </div>
                <h3 className="font-bold text-[#09245a] text-sm">Add New Subcategory (Super Admin)</h3>
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
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
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
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#09245a] text-sm">Edit Category</h3>
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
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#09245a] text-sm">
                  Delete {deleteTarget.type === 'category' ? 'Category' : 'Subcategory'}?
                </h3>
                <p className="text-[11px] text-slate-500">&ldquo;{deleteTarget.name}&rdquo;</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
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
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
                className="rounded-lg bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700 shadow-md cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs cursor-default space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#09245a] text-sm">Reset All Platform Data?</h3>
                <p className="text-[11px] text-slate-500">This will restore initial demo assets, rights records, categories, and relationships.</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              Any custom assets or taxonomy additions stored in your browser local storage will be refreshed back to default Lovetoons production demo state.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
                className="rounded-lg bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700 shadow-md cursor-pointer"
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
  const [readAlertIds, setReadAlertIds] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kmm_sidebar_collapsed') === 'true'
    }
    return false
  })

  // Keyboard shortcut Ctrl+[ or Cmd+[ to toggle desktop sidebar
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

  const { currentUser, toastMessage, dismissToast, approvals, rightsRecords, activities, isAuthenticated, isInitialized } = useLovetoonsData()

  // Calculate unread alerts count
  const unreadAlertsCount = useMemo(() => {
    const totalNotifs = approvals.length + Math.min(rightsRecords.length, 5) + Math.min(activities.length, 6)
    const readCount = readAlertIds.length
    return Math.max(0, totalNotifs - readCount)
  }, [approvals, rightsRecords, activities, readAlertIds])

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
    if (active === 'Approvals' && currentUser.role === 'unit_admin') {
      setActive('Dashboard')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/dashboard')
      }
    } else if (active === 'Categories & Subcategories') {
      setActive('Settings')
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/settings')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f6f9fd] to-[#edf4fc] text-slate-900 selection:bg-blue-600 selection:text-white">
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
        readAlertIds={readAlertIds}
        setReadAlertIds={setReadAlertIds}
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
          setActiveNav={handleNavigate}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          isNotificationModalOpen={isNotificationModalOpen}
          unreadCount={unreadAlertsCount}
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
            <ReportsPage />
          ) : active === 'Approvals' ? (
            <ApprovalsPage />
          ) : active === 'Rights & Governance' ? (
            <RightsPage setActiveNav={handleNavigate} initialAssetId={selectedAssetId || queryAsset} />
          ) : active === 'Relationships' ? (
            <RelationshipsPage />
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
