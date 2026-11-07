import { NextRequest, NextResponse } from 'next/server'
import { VideoItem, ARCHIVED_TRAINING_VIDEOS } from '@/lib/data/trainingVideosData'

// In-memory store for masterclasses added during server runtime
let customMasterclasses: VideoItem[] = []

export async function GET() {
  return NextResponse.json({
    success: true,
    masterclasses: [...ARCHIVED_TRAINING_VIDEOS, ...customMasterclasses],
    customCount: customMasterclasses.length,
    totalCount: ARCHIVED_TRAINING_VIDEOS.length + customMasterclasses.length,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, code, category, categoryLabel, duration, desc, points, videoUrl } = body

    if (!title || !code) {
      return NextResponse.json(
        { error: 'Title and code are required fields.' },
        { status: 400 }
      )
    }

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

    customMasterclasses.unshift(newVideo)

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

