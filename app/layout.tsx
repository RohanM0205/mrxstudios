import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MRX Studios | Premium Choreography Services',
  description:
    'Movement Rhythm X - Premium choreography services for weddings, corporate events, college fests, and auditions. Book your dream dance experience with Ritesh More.',
  keywords: [
    'choreography', 'dance', 'wedding choreography',
    'corporate dance', 'sangeet', 'MRX Studios', 'Ritesh More',
  ],
  authors: [{ name: 'MRX Studios' }],
  openGraph: {
    title: 'MRX Studios | Premium Choreography Services',
    description: 'Transform your special moments with professional choreography',
    type: 'website',
  },
  // iOS PWA — prevents white status-bar flash on launch
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Updated from old #3F3D56 to Midnight Marigold base
  // Controls the browser chrome / address bar colour on mobile
  themeColor: '#0d0a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      // ① Dark bg on <html> — very first paint is never white
      style={{ backgroundColor: '#0d0a1a' }}
    >
      <body
        className="font-sans antialiased"
        // ② Dark bg on <body> — belt AND suspenders
        style={{ backgroundColor: '#0d0a1a' }}
      >
        {/*
         * ③ Marigold fire progress bar during Next.js route transitions.
         *    Replaces the default blue loading indicator with brand colours.
         *    Matches the scroll-progress bar in the Navbar component.
         *
         *    Props:
         *    - color:       gradient string for the bar fill
         *    - height:      2px — matches navbar progress bar height
         *    - showSpinner: false — spinner looks out of place on dark bg
         *    - shadow:      warm glow under the bar
         *    - easing/speed: snappy but not jarring
         */}
        <NextTopLoader
          color="linear-gradient(90deg, #f5a623, #ff6b35, #e8175d)"
          height={2}
          showSpinner={false}
          shadow="0 0 8px rgba(245, 166, 35, 0.6), 0 0 4px rgba(255, 107, 53, 0.4)"
          easing="ease"
          speed={200}
          crawlSpeed={200}
          initialPosition={0.08}
        />

        {children}

        <Analytics />
      </body>
    </html>
  )
}