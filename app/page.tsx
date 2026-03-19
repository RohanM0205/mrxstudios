import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HeroSection } from '@/components/home/hero-section'
import { ChoreographerSection } from '@/components/home/choreographer-section'
import { ServicesSection } from '@/components/home/services-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { VideoSection } from '@/components/home/video-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <VideoSection />
      <ChoreographerSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
