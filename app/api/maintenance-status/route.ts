import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    maintenance: true,
    message: 'Kiddies Media Ministry platform update in progress',
    timestamp: new Date().toISOString(),
  })
}
