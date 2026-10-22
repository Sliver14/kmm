'use client'

import React, { useState, useMemo } from 'react'
import { X, Check, UploadCloud, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetData, CategoryItem, SubcategoryItem, Agency, AssetContributor } from '@/types'

const DEFAULT_AGENCIES: Agency[] = [
  'Lovetoons',
  'Publishing Agency',
  'Digital Agency',
  'Academy Agency',
  'Educational Agency',
]

export interface EditAssetModalProps {
  isOpen: boolean
  onClose: () => void
  asset: AssetData
  onSave: (updatedData: Partial<AssetData>) => void
  categories: CategoryItem[]
  subcategories: SubcategoryItem[]
  agencies?: Agency[]
  isGlobalViewer?: boolean
}

export function EditAssetModal({
  isOpen,
  onClose,
  asset,
  onSave,
  categories,
  subcategories,
  agencies = DEFAULT_AGENCIES,
  isGlobalViewer = false,
}: EditAssetModalProps) {
  const [name, setName] = useState(asset.name)
  const [category, setCategory] = useState(asset.category)
  const [subcategory, setSubcategory] = useState(asset.subcategory || '')
  const [agency, setAgency] = useState<Agency>(asset.agency || 'Lovetoons')
  const [rightsHolder, setRightsHolder] = useState(asset.rightsHolder || 'Pastor Kalu Chelsea (Executive Minister)')
  const [description, setDescription] = useState(asset.description || '')
  const [tags, setTags] = useState((asset.tags || []).join(', '))
  const [posterUrl, setPosterUrl] = useState(asset.posterUrl || '')
  const [contributors, setContributors] = useState<AssetContributor[]>(asset.contributors || [])
  const [attributes, setAttributes] = useState<Record<string, any>>(asset.attributes || {})

  // New contributor state
  const [newContribName, setNewContribName] = useState('')
  const [newContribRole, setNewContribRole] = useState('Lead 3D Animator')
  const [newContribAgency, setNewContribAgency] = useState<Agency>(asset.agency || 'Lovetoons')

  // Available subcategories for selected category
  const availableSubcategories = useMemo(() => {
    return subcategories.filter((s) => s.parentCategory === category)
  }, [subcategories, category])

  if (!isOpen) return null

  const handleAddContributor = () => {
    if (!newContribName.trim()) return
    const newContrib: AssetContributor = {
      id: `c-staff-${Date.now()}`,
      name: newContribName.trim(),
      role: newContribRole,
      agency: newContribAgency,
      contributionType: 'Core Creative',
    }
    setContributors((prev) => [...prev, newContrib])
    setNewContribName('')
  }

  const handleRemoveContributor = (idOrIndex: string | number) => {
    setContributors((prev) => prev.filter((c, idx) => (c.id ? c.id !== idOrIndex : idx !== idOrIndex)))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPosterUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const cleanedAttributes: Record<string, any> = { ...(asset.attributes || {}) }
    if (attributes) {
      Object.entries(attributes).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanedAttributes[key] = val
        } else {
          delete cleanedAttributes[key]
        }
      })
    }

    onSave({
      name: name.trim(),
      category,
      subcategory,
      agency,
      unit: agency,
      rightsHolder: rightsHolder.trim() || 'Pastor Kalu Chelsea (Executive Minister)',
      description: description.trim(),
      tags: tagList,
      posterUrl: posterUrl.trim() ? posterUrl.trim() : undefined,
      contributors,
      attributes: Object.keys(cleanedAttributes).length > 0 ? cleanedAttributes : undefined,
    })
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/80 bg-white p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 cursor-default space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-[#09245a]">Edit Asset Details & Metadata</h2>
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg ml-1">
                {asset.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates will prompt a confirmation step and will be permanently recorded in the ministry audit trail.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Asset Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Asset Name / Title *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-semibold"
              required
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setSubcategory('')
                }}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-medium"
              >
                <option value="">Select Subcategory (Optional)</option>
                {availableSubcategories.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Agency & Rights Holder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Originating Agency</label>
              {isGlobalViewer ? (
                <select
                  value={agency}
                  onChange={(e) => setAgency(e.target.value as Agency)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-semibold"
                >
                  {agencies.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex h-9 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700">
                  {agency}
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Asset Owner / Rights Holder *</label>
              <input
                type="text"
                value={rightsHolder}
                onChange={(e) => setRightsHolder(e.target.value)}
                placeholder="Pastor Kalu Chelsea (Executive Minister)"
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400 font-medium text-slate-800"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Asset Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief summary of storyline, themes, or production specs..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tag Chips (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Faith, 3D Animation, Character, Broadcast"
              className="h-9 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-400"
            />
          </div>

          {/* Cover Artwork */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs">Asset Cover Artwork (Optional)</label>
              <span className="text-[10px] text-slate-500">Image URL or Local Upload</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Preview */}
              <div className="relative size-16 shrink-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                {posterUrl.trim() ? (
                  <img
                    src={posterUrl}
                    alt="Preview"
                    className="size-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-1 text-center select-none">
                    <span className="text-sm font-black tracking-wider leading-none">
                      {name.trim() ? name.trim().slice(0, 2).toUpperCase() : 'IP'}
                    </span>
                    <span className="text-[8px] font-semibold leading-tight line-clamp-1 opacity-80 px-0.5 mt-0.5">
                      {name.trim() || 'No Cover'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://... (Optional image URL)"
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-blue-400"
                />

                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 cursor-pointer shadow-2xs">
                    <UploadCloud className="size-3 text-blue-600" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {posterUrl.trim() && (
                    <button
                      type="button"
                      onClick={() => setPosterUrl('')}
                      className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Use Monogram Badge
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Staff Contributors Builder */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-bold text-[#09245a] text-xs">
                  Staff Contributors ({contributors.length})
                </label>
                <p className="text-[11px] text-slate-500">Contributing writers, animators, artists, or engineers</p>
              </div>
            </div>

            {/* Chips */}
            {contributors.length === 0 ? (
              <div className="rounded-lg border border-dashed border-blue-200 bg-white/70 p-2.5 text-center text-xs text-slate-500">
                No contributors assigned yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {contributors.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs text-xs"
                  >
                    <div className="grid size-6 place-items-center rounded bg-slate-800 text-[10px] font-bold text-white uppercase">
                      {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'ST'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">{c.name}</div>
                      <div className="text-[10px] text-blue-700 truncate">{c.role}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveContributor(c.id || idx)}
                      className="text-slate-400 hover:text-red-500 transition ml-1 cursor-pointer"
                      title="Remove contributor"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Contributor Mini-Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-t border-blue-100/80 pt-2.5">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Staff name..."
                  value={newContribName}
                  onChange={(e) => setNewContribName(e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>
              <div className="sm:col-span-1">
                <select
                  value={newContribRole}
                  onChange={(e) => setNewContribRole(e.target.value)}
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
                  value={newContribAgency}
                  onChange={(e) => setNewContribAgency(e.target.value as Agency)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-400"
                >
                  {agencies.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddContributor}
                  className="h-8 w-full rounded-md bg-blue-600 font-bold text-white text-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  + Add Staff
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Attributes (Optional) */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5 space-y-3">
            <label className="block font-bold text-purple-900 text-xs">
              Dynamic Attributes ({category})
            </label>

            {(category.includes('TV') || category.includes('Animated')) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Episodes</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={attributes.episodesCount ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        episodesCount: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Runtime (Mins)</label>
                  <input
                    type="number"
                    placeholder="e.g. 22"
                    value={attributes.durationMinutes ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        durationMinutes: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Resolution</label>
                  <select
                    value={attributes.resolution || ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        resolution: e.target.value || undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none"
                  >
                    <option value="">Select (Optional)</option>
                    <option value="4K UHD">4K UHD</option>
                    <option value="1080p Full HD">1080p Full HD</option>
                    <option value="720p HD">720p HD</option>
                  </select>
                </div>
              </div>
            )}

            {category.includes('Music') && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Audio Format</label>
                  <select
                    value={attributes.audioFormat || ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        audioFormat: e.target.value || undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none"
                  >
                    <option value="">Select (Optional)</option>
                    <option value="WAV (24-bit/48kHz)">WAV (24-bit/48kHz)</option>
                    <option value="FLAC">FLAC</option>
                    <option value="MP3 (320kbps)">MP3 (320kbps)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Tempo (BPM)</label>
                  <input
                    type="number"
                    placeholder="e.g. 124"
                    value={attributes.bpm ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        bpm: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Key</label>
                  <input
                    type="text"
                    placeholder="e.g. C Major"
                    value={attributes.keySignature ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        keySignature: e.target.value || undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {category.includes('Publishing') && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Page Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 64"
                    value={attributes.pageCount ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        pageCount: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">ISBN</label>
                  <input
                    type="text"
                    placeholder="978-..."
                    value={attributes.isbn ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        isbn: e.target.value || undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {category.includes('Consumer') && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Product SKU</label>
                  <input
                    type="text"
                    placeholder="LT-SKU-..."
                    value={attributes.sku ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        sku: e.target.value || undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Lovetoons Merch Co."
                    value={attributes.manufacturer ?? ''}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        manufacturer: e.target.value || undefined,
                      }))
                    }
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {(category.includes('Digital') || category.includes('Interactive')) && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Live Production URL</label>
                    <input
                      type="url"
                      placeholder="https://tv.lovetoons.org"
                      value={attributes.liveUrl ?? ''}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          liveUrl: e.target.value || undefined,
                        }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Git Repository URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={attributes.gitRepoUrl ?? ''}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          gitRepoUrl: e.target.value || undefined,
                        }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Server Host & Cloud Provider</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS Cloud • Kubernetes (eu-west-1)"
                      value={attributes.serverHost ?? ''}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          serverHost: e.target.value || undefined,
                        }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px] font-semibold">Tech Stack & Frameworks</label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js 15, TypeScript, PostgreSQL"
                      value={attributes.techStack ?? ''}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          techStack: e.target.value || undefined,
                        }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="size-3.5" />
              <span>Save Modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
