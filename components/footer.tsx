import Link from 'next/link'
import { Sparkles, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'

const quickLinks = [
  { href: '/services/weddings', label: 'Wedding Choreography' },
  { href: '/services/corporate', label: 'Corporate Events' },
  { href: '/services/college', label: 'College Fests' },
  { href: '/services/auditions', label: 'Audition Prep' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/booking', label: 'Book Now' },
]

const socialLinks = [
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-[#3F3D56] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-[#E6C9A8]" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-serif">
                  MRX Studios
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                  Movement Rhythm X
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Transform your special moments into unforgettable dance experiences 
              with India&apos;s premium choreography studio.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#3A86FF] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#E6C9A8]">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#E6C9A8]">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#3A86FF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/70">Call us at</p>
                  <a href="tel:+919876543210" className="text-white hover:text-[#3A86FF] transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#3A86FF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/70">Email us at</p>
                  <a href="mailto:hello@mrxstudios.com" className="text-white hover:text-[#3A86FF] transition-colors">
                    hello@mrxstudios.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#3A86FF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/70">Visit us at</p>
                  <p className="text-white">Mumbai, Maharashtra</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#E6C9A8]">Studio Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-white/70">Monday - Friday</span>
                <span className="text-white">9AM - 9PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/70">Saturday</span>
                <span className="text-white">10AM - 8PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/70">Sunday</span>
                <span className="text-white">By Appointment</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/10 rounded-2xl">
              <p className="text-sm text-white/70">
                <span className="text-[#FF6B6B]">*</span> Home visits available for wedding clients
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} MRX Studios. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
