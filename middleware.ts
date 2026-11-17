import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// System-wide maintenance lock
const MAINTENANCE_MODE = true

// Authorized administrator bypass key
const BYPASS_KEY = process.env.MAINTENANCE_BYPASS_KEY || 'kmm2026'
const BYPASS_COOKIE_NAME = 'kmm_maintenance_bypass'

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next()
  }

  const { pathname, searchParams } = request.nextUrl

  // 1. Exit bypass mode if requested
  if (searchParams.get('exit_bypass') === '1') {
    const cleanUrl = new URL('/', request.url)
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.delete(BYPASS_COOKIE_NAME)
    return response
  }

  // 2. Secret bypass authentication for administrators / testing
  if (searchParams.get('bypass') === BYPASS_KEY || searchParams.get('secret') === BYPASS_KEY) {
    const targetPath = pathname === '/update-in-progress' ? '/' : pathname
    const cleanUrl = new URL(targetPath, request.url)
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set(BYPASS_COOKIE_NAME, 'authorized', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })
    return response
  }

  // 3. If user has active bypass authorization cookie, permit full access
  const hasBypass = request.cookies.get(BYPASS_COOKIE_NAME)?.value === 'authorized'
  if (hasBypass) {
    return NextResponse.next()
  }

  // 4. Always permit static assets, fonts, icons, and Next.js internal bundles
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/kmm-logo.png') ||
    pathname.startsWith('/lovetoons-logo.png') ||
    pathname.startsWith('/apple-icon.png') ||
    /\.(png|jpe?g|svg|webp|ico|gif|woff2?|ttf|css|js|map)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  // 5. Allow status health endpoint for the holding screen
  if (pathname === '/api/maintenance-status') {
    return NextResponse.next()
  }

  // 6. Block all other API endpoints with 503 during maintenance
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      {
        error: 'Service Unavailable',
        message: 'Kiddies Media Ministry platform update is currently in progress. All services are temporarily offline.',
        maintenance: true,
      },
      {
        status: 503,
        headers: {
          'Retry-After': '1800',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  }

  // 7. If user is already on the holding page, allow rendering
  if (pathname === '/update-in-progress') {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  }

  // 8. Redirect all other incoming page requests directly to /update-in-progress
  const maintenanceUrl = new URL('/update-in-progress', request.url)
  return NextResponse.redirect(maintenanceUrl, 307)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
