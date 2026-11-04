'use client'

import React from 'react'
import KmmLandingPage from '@/components/KmmLandingPage'

// Backward-compatible re-export for routes importing MainApp from '@/app/page'
export { MainApp } from '@/components/MainApp'

export default function Page() {
  return <KmmLandingPage />
}
