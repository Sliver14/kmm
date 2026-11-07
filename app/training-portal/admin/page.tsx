'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrainingPortalAdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kmm_training_user')
      if (!stored) {
        router.replace('/auth?redirect=/training-portal?tab=admin')
        return
      }
      const user = JSON.parse(stored)
      const isPortalAdmin = Boolean(
        user.isPortalAdmin ||
        user.role === 'portal_admin' ||
        user.role === 'portal admn' ||
        user.role?.toLowerCase() === 'portal admin' ||
        user.role?.toLowerCase() === 'portal admn' ||
        user.roleLabel?.toLowerCase().includes('portal admin') ||
        user.roleLabel?.toLowerCase().includes('portal admn') ||
        user.email?.toLowerCase() === 'portaladmin@kiddiesmedia.org' ||
        user.email?.toLowerCase() === 'admin@kmmtraining.org' ||
        user.role === 'super_admin'
      )

      if (isPortalAdmin) {
        router.replace('/training-portal?tab=admin')
      } else {
        router.replace('/training-portal')
      }
    } catch {
      router.replace('/auth?redirect=/training-portal?tab=admin')
    }
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

