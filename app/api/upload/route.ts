import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import crypto from 'crypto'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

// 500 MB maximum file size limit for VPS storage (videos, masterclasses & media assets)
const MAX_FILE_SIZE = 500 * 1024 * 1024

// Whitelist of supported and safe formats
const ALLOWED_EXTENSIONS = new Set([
  // Documents & Legal Deeds
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'rtf',
  // Visual & Artwork
  'jpg',
  'jpeg',
  'png',
  'webp',
  'svg',
  'gif',
  // Audio Assets
  'mp3',
  'wav',
  'm4a',
  'aac',
  'ogg',
  // Video Clips & Playbooks
  'mp4',
  'mov',
  'webm',
])

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const assetId = (formData.get('assetId') as string) || ''
    const fileType = (formData.get('fileType') as string) || 'document'
    const ministryId = (formData.get('ministryId') as string) || 'min-kmm'
    const isMaster = formData.get('isMaster') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided for upload.' }, { status: 400 })
    }

    const fileName = file.name || 'document.pdf'
    const fileSizeBytes = file.size
    const formattedSize = formatBytes(fileSizeBytes)
    const mimeType = file.type || 'application/octet-stream'

    // 1. File size validation
    if (fileSizeBytes > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${formattedSize}) exceeds the maximum allowed VPS storage limit of 500 MB. Please compress or optimize the file before uploading.`,
        },
        { status: 400 }
      )
    }

    // 2. Format & extension whitelist validation
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `File extension .${ext} is not supported. Permitted formats include: Documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT), Images (JPG, PNG, WEBP, SVG), Audio (MP3, WAV, M4A), and Video (MP4, MOV, WEBM).`,
        },
        { status: 400 }
      )
    }

    // 3. Prevent path traversal and sanitize base name
    const sanitizedBase = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60)
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${sanitizedBase}.${ext}`

    // 4. Ensure VPS upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const targetPath = path.join(uploadDir, uniqueFileName)
    // Security check: ensure target path is within uploadDir
    if (!targetPath.startsWith(uploadDir)) {
      return NextResponse.json({ error: 'Security violation: invalid file path.' }, { status: 400 })
    }

    // 5. Write file directly to VPS storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(targetPath, buffer)

    const fileUrl = `/uploads/${uniqueFileName}`
    const fileId = `file-${Date.now().toString().slice(-6)}`
    const resolution = mimeType.startsWith('image/') || mimeType.startsWith('video/') ? '1080p' : 'Document'

    // 6. Graceful database registration (if Neon Postgres is connected)
    try {
      if (assetId) {
        await sql`
          INSERT INTO asset_files (
            id, asset_id, ministry_id, file_name, file_type, mime_type,
            file_size_bytes, formatted_size, resolution, duration_seconds,
            storage_bucket, storage_path, is_master, status
          ) VALUES (
            ${fileId}, ${assetId}, ${ministryId}, ${fileName}, ${fileType}, ${mimeType},
            ${fileSizeBytes}, ${formattedSize}, ${resolution}, 0,
            'vps_local', ${fileUrl}, ${isMaster}, 'active'
          )
        `

        // If poster, update asset poster_url
        if (fileType === 'poster' || mimeType.startsWith('image/')) {
          await sql`
            UPDATE assets
            SET poster_url = ${fileUrl}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${assetId}
          `
        }
      }
    } catch (dbErr) {
      console.warn('Optional DB sync skipped for file upload:', dbErr)
    }

    return NextResponse.json({
      success: true,
      message: 'File successfully stored safely in VPS storage.',
      file: {
        id: fileId,
        fileName,
        storedName: uniqueFileName,
        fileType,
        mimeType,
        fileSizeBytes,
        formattedSize,
        resolution,
        url: fileUrl,
        storageBucket: 'vps_local',
      },
    })
  } catch (error: any) {
    console.error('Error in VPS /api/upload:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to save file to VPS storage' },
      { status: 500 }
    )
  }
}
