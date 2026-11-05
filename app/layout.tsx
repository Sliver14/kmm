import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono, Bricolage_Grotesque, Figtree } from 'next/font/google'
import { DataProvider } from '@/lib/store/DataContext'
import { ThemeProvider } from '@/lib/store/ThemeContext'
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

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Kiddies Media Ministry — Intellectual Asset Management Platform',
  description: 'Manage intellectual assets, rights, governance, staff contributors and approvals across Kiddies Media Ministry agencies: Lovetoons, Publishing Agency, Digital Agency, Academy Agency, and Educational Agency.',
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
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0f17' },
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${bricolageGrotesque.variable} ${figtree.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname || '';
                  var isPublic = path === '/' || path.startsWith('/training-portal') || path.startsWith('/onboarding');
                  if (path.startsWith('/training-portal')) {
                    var tpTheme = localStorage.getItem('kmm_training_theme') || localStorage.getItem('kmm_theme');
                    if (tpTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                      document.documentElement.style.colorScheme = 'dark';
                    } else {
                      document.documentElement.classList.remove('dark');
                      document.documentElement.style.colorScheme = 'light';
                    }
                    return;
                  }
                  var stored = localStorage.getItem('kmp_theme') || localStorage.getItem('kmm_theme');
                  if (stored === 'light' || (!stored && isPublic)) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch(e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#f8f9fa] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-blue-600">
        <ThemeProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
