import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { DataProvider } from '@/lib/store/DataContext'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Kiddies Media Ministries — Intellectual Asset Management Platform',
  description: 'Manage intellectual assets, rights, governance, staff contributors and approvals across Kiddies Media Ministries agencies: Lovetoons, Publishing Agency, Digital Agency, Academy Agency, and Educational Agency.',
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
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-slate-50/80 text-slate-900 selection:bg-blue-600 selection:text-white">
        <DataProvider>
          {children}
        </DataProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
