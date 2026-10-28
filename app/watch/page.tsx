'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function WatchRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const videoId = searchParams.get('v') || searchParams.get('id') || 'vid-1'
    router.replace(`/training-portal#watch-${videoId}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col items-center justify-center p-4">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-semibold text-sm text-slate-300">Loading full-page cinema video player...</p>
    </div>
  )
}

export default function WatchRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
          Loading player...
        </div>
      }
    >
      <WatchRedirectContent />
    </Suspense>
  )
}
