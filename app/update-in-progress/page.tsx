import { Metadata } from 'next'
import UpdateInProgress from '@/components/UpdateInProgress'

export const metadata: Metadata = {
  title: 'Update in Progress — Kiddies Media Ministry',
  description: 'The Kiddies Media Ministry digital platform is currently undergoing scheduled updates and infrastructure maintenance.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default function UpdateInProgressPage() {
  return <UpdateInProgress />
}
