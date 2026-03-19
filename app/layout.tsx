import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MRX Studios | Premium Choreography Services',
  description: 'Movement Rhythm X - Premium choreography services for weddings, corporate events, college fests, and auditions. Book your dream dance experience with Ritesh More.',
  keywords: ['choreography', 'dance', 'wedding choreography', 'corporate dance', 'sangeet', 'MRX Studios', 'Ritesh More'],
  authors: [{ name: 'MRX Studios' }],
  openGraph: {
    title: 'MRX Studios | Premium Choreography Services',
    description: 'Transform your special moments with professional choreography',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3F3D56',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
