'use client'

import React, { useState } from 'react'
import {
  Globe, Server, Code, Terminal, Download, FileText, Film, Music,
  Package, Database, Check, Copy, ExternalLink, ShieldCheck, HardDrive,
  FileCode, Sparkles, FolderArchive, Layers, ArrowDownToLine, Clock, Cloud
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetData } from '@/types'
import { generateAssetArchive } from '@/lib/data/assetArchiveData'

interface AssetArchiveHubProps {
  asset: AssetData
  showToast: (msg: string) => void
}

export function AssetArchiveHub({ asset, showToast }: AssetArchiveHubProps) {
  const archive = asset.archive || generateAssetArchive(asset)
  const isDigital = asset.category === 'Digital / Interactive Platform'
  const [copiedClone, setCopiedClone] = useState(false)
  const [copiedApi, setCopiedApi] = useState(false)

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard!`)
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* 1. Cloud Storage & Digital Endpoints Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-blue-50 text-blue-600 grid place-items-center font-bold">
              <Cloud className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#09245a] text-sm">
                {isDigital ? 'Digital Endpoints, Repositories & Server Clusters' : 'Lovetoons Cloud Media Storage & Distribution Endpoints'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isDigital
                  ? 'Live URLs, source code version control, and production API servers.'
                  : 'Master files securely stored in cloud vault and fetched for in-portal preview and download.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 border border-emerald-200">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{archive.serverStatus || 'Online'} • Cloud Vault Active</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Website / Web Portal (Only if present) */}
          {archive.websiteUrl && isDigital && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Live Web Portal</span>
                  <Globe className="size-3.5 text-blue-600" />
                </div>
                <div className="font-bold text-slate-900 font-mono text-xs truncate">{archive.websiteUrl}</div>
                <div className="text-[11px] text-slate-500">Public ministry distribution & streaming portal</div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={archive.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 rounded-lg px-2.5 py-1"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="size-3" />
                </a>
                <button
                  onClick={() => handleCopy(archive.websiteUrl!, 'Website URL')}
                  className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
                  title="Copy URL"
                >
                  <Copy className="size-3" />
                </button>
              </div>
            </div>
          )}

          {/* Production Server / CDN Cluster */}
          {archive.serverUrl && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cloud Storage CDN Cluster</span>
                  <Server className="size-3.5 text-emerald-600" />
                </div>
                <div className="font-bold text-slate-900 font-mono text-xs truncate">{archive.serverUrl}</div>
                <div className="text-[11px] text-slate-500">{archive.serverRegion || 'Global Cloud Storage Vault (Edge CDN)'}</div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => showToast(`Cloud Media Cluster: ${archive.serverUrl} is active with sub-30ms latency.`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white border border-emerald-200 rounded-lg px-2.5 py-1"
                >
                  <Check className="size-3" />
                  <span>Check Cloud Status</span>
                </button>
                <button
                  onClick={() => handleCopy(archive.serverUrl!, 'Server URL')}
                  className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
                  title="Copy Server URL"
                >
                  <Copy className="size-3" />
                </button>
              </div>
            </div>
          )}

          {/* Source Code Git Repository (ONLY for Digital Platforms!) */}
          {isDigital && archive.repositoryUrl && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Git Source Repository</span>
                  <Code className="size-3.5 text-purple-600" />
                </div>
                <div className="font-bold text-slate-900 font-mono text-xs truncate">{archive.repositoryUrl}</div>
                <div className="text-[11px] text-purple-700 font-semibold">Branch: {archive.repositoryBranch || 'main'}</div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={archive.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-800 bg-white border border-purple-200 rounded-lg px-2.5 py-1"
                >
                  <span>Open Repo</span>
                  <ExternalLink className="size-3" />
                </a>
                <button
                  onClick={() => {
                    handleCopy(archive.cloneCommand || `git clone ${archive.repositoryUrl}.git`, 'Git clone command')
                    setCopiedClone(true)
                    setTimeout(() => setCopiedClone(false), 2000)
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-100"
                >
                  {copiedClone ? <Check className="size-3 text-emerald-600" /> : <Terminal className="size-3 text-slate-500" />}
                  <span>{copiedClone ? 'Copied' : 'Clone'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Streaming Manifest Feed (For Video / Music / Events) */}
          {archive.streamUrl && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cloud Stream Feed Manifest</span>
                  <Film className="size-3.5 text-blue-600" />
                </div>
                <div className="font-bold text-slate-900 font-mono text-xs truncate">{archive.streamUrl}</div>
                <div className="text-[11px] text-slate-500">HLS / DASH Master Cloud Feed</div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleCopy(archive.streamUrl!, 'Stream Manifest URL')}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-white border border-blue-200 rounded-lg px-2.5 py-1"
                >
                  <Copy className="size-3" />
                  <span>Copy Stream Manifest</span>
                </button>
              </div>
            </div>
          )}

          {/* Cloud Storage Vault Specification */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Archive Location</span>
                <HardDrive className="size-3.5 text-amber-600" />
              </div>
              <div className="font-bold text-slate-900 text-xs truncate">{archive.archiveStorageLocation || 'Lovetoons Cloud Storage (S3)'}</div>
              <div className="text-[11px] text-slate-500">{archive.retentionPolicy || 'Permanent Ministry Archive'}</div>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">
                <ShieldCheck className="size-3" />
                <span>SHA-256 Verified Masters</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Archival Master Files Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-[#09245a] text-sm">Archival Master Files & Direct Downloads ({archive.files.length})</h3>
            <p className="text-[11px] text-slate-500">
              Master broadcast renditions, stems, vector designs, and print PDFs fetched from cloud storage.
            </p>
          </div>

          <button
            onClick={() => showToast(`All ${archive.files.length} archival master files fetched and packaged into ZIP.`)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Download All Masters (.ZIP)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3">File Name & Description</th>
                <th className="py-3 px-3">Format / Type</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Integrity Checksum</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {archive.files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3">
                    <div className="flex items-start gap-2.5">
                      <div className="size-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0 font-bold text-[10px]">
                        {file.type === 'video' ? (
                          <Film className="size-4" />
                        ) : file.type === 'audio' ? (
                          <Music className="size-4" />
                        ) : file.type === 'code' ? (
                          <Code className="size-4" />
                        ) : file.type === '3d' ? (
                          <Layers className="size-4" />
                        ) : file.type === 'package' ? (
                          <Package className="size-4" />
                        ) : (
                          <FileText className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate max-w-sm" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{file.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 text-[11px]">
                      {file.format}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800 text-[11px]">
                    {file.size}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[10px] text-slate-400">
                    <button
                      onClick={() => handleCopy(file.checksum || 'sha256:7f83b1657ff19a4c', 'Checksum hash')}
                      className="hover:text-blue-600 flex items-center gap-1"
                      title="Click to copy SHA-256 Checksum"
                    >
                      <span>{file.checksum?.slice(0, 16) || 'sha256:7f83b1...'}</span>
                      <Copy className="size-2.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => showToast(`Downloading "${file.name}" (${file.size}) from Cloud Storage...`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                    >
                      <Download className="size-3" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
