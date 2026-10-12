'use client'

import { Suspense } from 'react'
import { MainApp } from '@/app/page'

export default function ApprovalsRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4faff] flex items-center justify-center font-bold text-slate-500">
          Loading Approvals...
        </div>
      }
    >
      <MainApp initialTab="Approvals" />
    </Suspense>
  )
}
