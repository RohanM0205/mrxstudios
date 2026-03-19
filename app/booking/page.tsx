'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { BookingForm } from '@/components/booking/booking-form'
import { BookingSuccess } from '@/components/booking/booking-success'
import { Calendar, Clock, MapPin, Phone } from 'lucide-react'

export default function BookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#3F3D56] to-[#3F3D56]/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
            Book Your <span className="text-gold-gradient">Session</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Fill out the form below and we&apos;ll get back to you within 24 hours 
            to discuss your dance dreams.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <BookingSuccess onReset={() => setIsSubmitted(false)} />
              ) : (
                <BookingForm onSuccess={() => setIsSubmitted(true)} />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-background rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3A86FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-[#3A86FF]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call us directly</p>
                      <a href="tel:+919876543210" className="font-medium text-foreground hover:text-[#3A86FF] transition-colors">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3A86FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[#3A86FF]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Response time</p>
                      <p className="font-medium text-foreground">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3A86FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#3A86FF]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Studio location</p>
                      <p className="font-medium text-foreground">Mumbai, Maharashtra</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-background rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose MRX Studios?</h3>
                <ul className="space-y-3">
                  {[
                    '10+ years of experience',
                    '500+ successful events',
                    'Personalized attention',
                    'Flexible scheduling',
                    'Home visits available',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-[#E6C9A8] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-[#25D366] rounded-3xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Prefer WhatsApp?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Chat with us directly for quick responses and easy communication.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Hi! I'm interested in choreography services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#25D366] px-4 py-2 rounded-xl font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
