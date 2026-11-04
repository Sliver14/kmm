import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export interface ApkDownloadLead {
  id: string
  name: string
  email: string
  userAgent?: string
  ip?: string
  downloadedAt: string
}

let memoryLeads: ApkDownloadLead[] = []

async function ensureTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS apk_download_leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        user_agent TEXT,
        ip TEXT,
        downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  } catch (err) {
    console.warn('Neon DB apk_download_leads ensureTableExists warning (using fallback memory cache):', err)
  }
}

export async function GET() {
  try {
    await ensureTableExists()
    const rows = await sql`
      SELECT
        id,
        name,
        email,
        user_agent as "userAgent",
        ip,
        downloaded_at as "downloadedAt"
      FROM apk_download_leads
      ORDER BY downloaded_at DESC
      LIMIT 100
    `
    return NextResponse.json({ success: true, leads: rows })
  } catch {
    return NextResponse.json({ success: true, leads: memoryLeads })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    const id = `apk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const userAgent = req.headers.get('user-agent') || undefined
    const ip = req.headers.get('x-forwarded-for') || undefined
    const downloadedAt = new Date().toISOString()

    const newLead: ApkDownloadLead = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      userAgent,
      ip,
      downloadedAt,
    }

    try {
      await ensureTableExists()
      await sql`
        INSERT INTO apk_download_leads (id, name, email, user_agent, ip, downloaded_at)
        VALUES (${id}, ${newLead.name}, ${newLead.email}, ${userAgent || null}, ${ip || null}, NOW())
      `
    } catch (dbErr) {
      console.warn('DB insert failed, saved to memory leads fallback:', dbErr)
      memoryLeads.unshift(newLead)
    }

    return NextResponse.json({
      success: true,
      message: 'Download lead recorded',
      lead: newLead,
      apkUrl: '/APP-APK/LovetoonsTv5.0.apk',
      fileName: 'LovetoonsTv5.0.apk',
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
