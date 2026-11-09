import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import {
  getR2Client,
  isR2Configured,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} from '@/lib/r2'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ALLOWED_VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv', 'm4v'])

export async function POST(req: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        {
          error:
            'Cloudflare R2 storage credentials are not yet configured on this server. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your environment variables.',
          isConfigured: false,
        },
        { status: 503 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.fileName) {
      return NextResponse.json(
        { error: 'Invalid request: "fileName" is required.' },
        { status: 400 }
      )
    }

    const { fileName, fileType = 'video/mp4' } = body

    // Validate extension
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    if (!ext || !ALLOWED_VIDEO_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported video format (.${ext}). Permitted formats: MP4, MOV, WEBM, MKV, M4V.`,
        },
        { status: 400 }
      )
    }

    // Sanitize file name for object key
    const sanitizedBase = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50)
    const uniqueKey = `masterclasses/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${sanitizedBase}.${ext}`

    const s3Client = getR2Client()
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    })

    // Presigned upload URL valid for 30 minutes (1800 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 1800 })

    // Determine public streaming URL
    let finalVideoUrl = ''
    if (R2_PUBLIC_URL) {
      finalVideoUrl = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${uniqueKey}`
    } else {
      // Fallback if public domain is not set: use R2 direct endpoint
      finalVideoUrl = `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${uniqueKey}`
    }

    return NextResponse.json({
      uploadUrl,
      finalVideoUrl,
      key: uniqueKey,
      expiresIn: 1800,
    })
  } catch (err: any) {
    console.error('Error generating Cloudflare R2 presigned upload URL:', err)
    return NextResponse.json(
      {
        error: err?.message || 'Failed to generate cloud upload authorization.',
      },
      { status: 500 }
    )
  }
}
