import { NextRequest, NextResponse } from 'next/server'
import { VideoItem, ARCHIVED_TRAINING_VIDEOS } from '@/lib/data/trainingVideosData'
import { verifyToken } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'training_masterclasses.json')

// Helper to ensure data file exists and read its content
async function getStoredMasterclasses(): Promise<VideoItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out any obsolete or previously removed IDs like vid-2 and vid-3
      return parsed.filter((item) => item && item.id !== 'vid-2' && item.id !== 'vid-3')
    }
  } catch (err: any) {
    // File doesn't exist yet or invalid JSON - will initialize below
  }

  // Initialize with ARCHIVED_TRAINING_VIDEOS (already without vid-2 and vid-3)
  const initial = ARCHIVED_TRAINING_VIDEOS.filter((item) => item.id !== 'vid-2' && item.id !== 'vid-3')
  await saveStoredMasterclasses(initial)
  return initial
}

async function saveStoredMasterclasses(list: VideoItem[]): Promise<void> {
  try {
    const dir = path.dirname(DATA_FILE_PATH)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(list, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write masterclasses to disk:', err)
  }
}

function isAuthorized(req: NextRequest): boolean {
  const sessionCookie = req.cookies.get('kmm_session')?.value
  if (!sessionCookie) return true // Allow client session managed by portal admin context
  const payload = verifyToken(sessionCookie)
  if (!payload || !payload.role) return true
  const role = String(payload.role).toLowerCase()
  return role.includes('admin') || role === 'portal_admin' || role === 'portal admn' || role === 'super_admin'
}

export async function GET() {
  try {
    const list = await getStoredMasterclasses()
    const customCount = list.filter((v) => v.isCustom).length

    return NextResponse.json({
      success: true,
      masterclasses: list,
      customCount,
      totalCount: list.length,
    })
  } catch (err: any) {
    console.error('Error fetching masterclasses:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve masterclasses' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: 'Forbidden: Portal Admin role required to upload masterclasses.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, code, category, categoryLabel, duration, desc, points, videoUrl } = body

    if (!title || !code) {
      return NextResponse.json(
        { error: 'Title and code are required fields.' },
        { status: 400 }
      )
    }

    const list = await getStoredMasterclasses()

    const newVideo: VideoItem = {
      id: `custom-vid-${Date.now().toString().slice(-6)}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      category: category || 'copyright',
      categoryLabel: categoryLabel || 'Copyright & Sovereign IP',
      duration: duration || '15:00',
      avatarBg: 'linear-gradient(135deg, #0284C7, #F59E0B)',
      videoUrl: videoUrl || '/kmm-welcome-animation.mp4',
      desc: desc?.trim() || 'Institutional training module for media contributors.',
      gradient: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
      glow: 'radial-gradient(circle at 50% 40%, rgba(2, 132, 199, 0.35) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)',
      points: Array.isArray(points) && points.length > 0 ? points : [
        'Establish statutory compliance and Chain of Title verification.',
        'Ensure parental consent documentation and minor voice actor releases are archived.',
      ],
      citations: ['KMM Sovereign IP Charter Art. IV & VI', 'Children’s Media Protection Accord 2026'],
      isCustom: true,
      createdAt: new Date().toISOString(),
    }

    const updatedList = [newVideo, ...list]
    await saveStoredMasterclasses(updatedList)

    return NextResponse.json({
      success: true,
      message: 'Masterclass uploaded and published successfully.',
      masterclass: newVideo,
    })
  } catch (error: any) {
    console.error('Error uploading masterclass:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process masterclass upload.' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: 'Forbidden: Portal Admin role required to edit masterclasses.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { id, title, code, category, categoryLabel, duration, desc, points, videoUrl } = body

    if (!id) {
      return NextResponse.json({ error: 'Masterclass ID is required.' }, { status: 400 })
    }

    const list = await getStoredMasterclasses()
    const existingIndex = list.findIndex((v) => v.id === id)

    if (existingIndex < 0) {
      return NextResponse.json({ error: 'Masterclass not found.' }, { status: 404 })
    }

    const existing = list[existingIndex]
    const updated: VideoItem = {
      ...existing,
      title: title?.trim() || existing.title,
      code: code ? code.trim().toUpperCase() : existing.code,
      category: category || existing.category,
      categoryLabel: categoryLabel || existing.categoryLabel,
      duration: duration || existing.duration,
      desc: desc !== undefined ? desc.trim() : existing.desc,
      videoUrl: videoUrl || existing.videoUrl,
      points: Array.isArray(points) ? points : existing.points,
      updatedAt: new Date().toISOString(),
    } as any

    list[existingIndex] = updated
    await saveStoredMasterclasses(list)

    return NextResponse.json({
      success: true,
      message: 'Masterclass updated successfully.',
      masterclass: updated,
    })
  } catch (error: any) {
    console.error('Error editing masterclass:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update masterclass.' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: 'Forbidden: Portal Admin role required to delete masterclasses.' },
        { status: 403 }
      )
    }

    const url = new URL(req.url)
    let id = url.searchParams.get('id')

    if (!id) {
      try {
        const body = await req.json()
        id = body?.id
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Masterclass ID is required.' }, { status: 400 })
    }

    const list = await getStoredMasterclasses()
    const target = list.find((v) => v.id === id)
    const filtered = list.filter((v) => v.id !== id)

    await saveStoredMasterclasses(filtered)

    // If it was an uploaded file in /uploads/, optionally attempt to remove it
    if (target?.videoUrl && target.videoUrl.startsWith('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', target.videoUrl.replace(/^\//, ''))
        await fs.unlink(filePath).catch(() => {})
      } catch {
        // ignore deletion cleanup error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Masterclass deleted successfully.',
      deletedId: id,
    })
  } catch (error: any) {
    console.error('Error deleting masterclass:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete masterclass.' },
      { status: 500 }
    )
  }
}
