import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    '// Vercel Web Analytics shim\nwindow.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };',
    {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    }
  )
}

