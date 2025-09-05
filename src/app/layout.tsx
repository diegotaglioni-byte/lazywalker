import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { SimpleCacheManager } from '@/components/SimpleCacheManager'
import { CacheClearButton } from '@/components/CacheClearButton'

export const metadata: Metadata = {
  title: 'LazyWalker - Japanese Walking Timer',
  description: 'Un timer PWA per aiutarti a fare movimento leggero con la tecnica Japanese Walking',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LazyWalker',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'LazyWalker',
    title: 'LazyWalker - Japanese Walking Timer',
    description: 'Un timer PWA per aiutarti a fare movimento leggero con la tecnica Japanese Walking',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="LazyWalker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LazyWalker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <SimpleCacheManager />
          <CacheClearButton />
        </AuthProvider>
      </body>
    </html>
  )
}
