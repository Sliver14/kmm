'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrainingPortalAdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/training-portal?tab=admin')
  }, [router])

  return (
    <div className="h-screen w-full bg-[#F8F9FA] dark:bg-[#0B0F19] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Training Portal Admin Dashboard...</p>
      </div>
    </div>
  )
}

