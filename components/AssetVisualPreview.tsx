'use client'

import React, { useState, useMemo } from 'react'
import {
  Film, Clock, Calendar, Search, Sparkles, CheckCircle2,
  Tv, AlertCircle, FileText, ChevronRight, Hash, Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetData, AssetEpisode } from '@/types'

interface AssetVisualPreviewProps {
  asset: AssetData
  showToast?: (msg: string) => void
  onOpenEditModal?: () => void
}

export function AssetVisualPreview({ asset, showToast, onOpenEditModal }: AssetVisualPreviewProps) {
  const episodes: AssetEpisode[] = useMemo(() => {
    return asset.attributes?.episodes || []
  }, [asset.attributes?.episodes])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses')

  // Rule: display ONLY when asset actually has episodes
  if (episodes.length === 0) {
    return null
  }

  const filteredEpisodes = episodes.filter((ep) => {
    if (selectedStatus !== 'All Statuses' && ep.status !== selectedStatus) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        ep.title.toLowerCase().includes(q) ||
        (ep.synopsis && ep.synopsis.toLowerCase().includes(q)) ||
        `episode ${ep.episodeNumber}`.includes(q) ||
        `ep ${ep.episodeNumber}`.includes(q)
      if (!match) return false
    }
    return true
  })

  const totalMinutes = episodes.reduce((acc, ep) => acc + (ep.durationMinutes || 0), 0)

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90 p-5 shadow-xs space-y-4">
      {/* Header & Archival Storage Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600 text-white grid place-items-center shrink-0 shadow-xs dark:ring-1 dark:ring-blue-400/30">
            <Film className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Production Episodes Registry
              </h3>
              <span className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                {episodes.length} {episodes.length === 1 ? 'Episode' : 'Episodes'} Catalogued
              </span>
              {totalMinutes > 0 && (
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  • {totalMinutes}m Total Runtime
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official catalog of broadcast episodes and seasonal chapters for {asset.name}.
            </p>
          </div>
        </div>

        {/* Media Storage in Provisioning Notice */}
        <div className="inline-flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200/80 px-3.5 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/40 dark:text-amber-300 shrink-0">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <div>
            <div className="font-bold text-[11px] leading-tight">Media Storage: In Provisioning</div>
            <div className="text-[10px] text-amber-700/90 dark:text-amber-400/90 leading-tight">Master video streaming coming soon</div>
          </div>
        </div>
      </div>

      {/* Episodes Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search episode titles or synopses..."
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white text-xs outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800 dark:text-white px-2.5 text-xs font-medium outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="All Statuses">All Statuses ({episodes.length})</option>
            <option value="Broadcast Ready">Broadcast Ready</option>
            <option value="Approved">Approved</option>
            <option value="Mastered">Mastered</option>
            <option value="In Production">In Production</option>
          </select>
        </div>
      </div>

      {/* Episodes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredEpisodes.map((ep, idx) => (
          <div
            key={ep.id || idx}
            className="rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:hover:border-white/20 p-4 transition space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs grid place-items-center shrink-0 shadow-2xs">
                  {ep.episodeNumber < 10 ? `0${ep.episodeNumber}` : ep.episodeNumber}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs leading-snug">
                    {ep.title}
                  </h4>
                  <div className="flex items-center gap-2.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    {ep.durationMinutes && (
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="size-3 text-slate-400" />
                        <span>{ep.durationMinutes} mins</span>
                      </span>
                    )}
                    {ep.airDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-slate-400" />
                        <span>{ep.airDate}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-[10px] font-bold border shrink-0',
                  ep.status === 'Broadcast Ready'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
                    : ep.status === 'Approved'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
                )}
              >
                {ep.status || 'In Production'}
              </span>
            </div>

            {ep.synopsis ? (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {ep.synopsis}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                No synopsis logged yet for this episode.
              </p>
            )}

            {/* Media Storage Status Footer */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Media File: In Provisioning</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (showToast) {
                    showToast(`Episode #${ep.episodeNumber} media file playback will be enabled once cloud media storage is connected.`)
                  }
                }}
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              >
                Playback (Coming Soon) ↗
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
          No episodes match your search query or status filter.
        </div>
      )}
    </div>
  )
}
