import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#3A86FF] via-[#3A86FF] to-[#3F3D56] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E6C9A8]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Main content */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">
            Ready to Create Your
            <span className="block text-[#E6C9A8]">Dance Story?</span>
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Whether it&apos;s your wedding, a corporate event, or preparing for the stage, 
            we&apos;re here to make your dance dreams come true.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button 
                size="lg" 
                className="bg-white text-[#3A86FF] hover:bg-white/90 rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl hover-lift"
              >
                Book Your Session
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white rounded-2xl px-8 py-6 text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>

          {/* Contact info */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70">
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </a>
            <span className="hidden sm:block">|</span>
            <p>Or email us at hello@mrxstudios.com</p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/60 mb-4">Trusted by 500+ happy clients across India</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['5-Star Google Reviews', 'Featured in Wedding Magazines', 'Celebrity Clientele'].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-white/80">
                <svg className="w-5 h-5 text-[#E6C9A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
