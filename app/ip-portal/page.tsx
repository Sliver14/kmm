'use client'

import { Suspense } from 'react'
import { MainApp } from '@/app/page'

export default function IpPortalRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4faff] dark:bg-[#0b0f17] flex items-center justify-center font-bold text-slate-500">
          Loading KMM IP Portal...
        </div>
      }
    >
      <MainApp initialTab="Dashboard" />
    </Suspense>
  )
}
