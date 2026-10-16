import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DataProvider } from '@/lib/store/DataContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kiddies Media Production — Intellectual Asset Management Platform',
  description: 'Manage intellectual assets, rights, governance, staff contributors and approvals across Kiddies Media Production agencies: Lovetoons, Publishing Agency, Digital Agency, Academy Agency, and Educational Agency.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/kmm-logo.png',
      },
    ],
    apple: '/kmm-logo.png',
    shortcut: '/kmm-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DataProvider>
          {children}
        </DataProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
