import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import type { LucideIcon } from 'lucide-react'

interface ServiceFeature {
  title: string
  description: string
}

interface ServicePackage {
  name: string
  price: string
  sessions: number
  features: string[]
  popular?: boolean
}

interface ServicePageProps {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  heroImage: string
  features: ServiceFeature[]
  subtypes: { name: string; description: string }[]
  packages: ServicePackage[]
  gallery: { url: string; caption: string }[]
  color: string
}

export function ServicePageTemplate({
  icon: Icon,
  title,
  subtitle,
  description,
  heroImage,
  features,
  subtypes,
  packages,
  gallery,
  color,
}: ServicePageProps) {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3F3D56]/95 via-[#3F3D56]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div 
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
              <span className="text-sm font-medium text-white/90">{subtitle}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
              {title}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking">
                <Button 
                  size="lg" 
                  className="rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl"
                  style={{ backgroundColor: color }}
                >
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-2xl px-8 py-6 text-lg"
                >
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-medium text-sm uppercase tracking-wider" style={{ color }}>
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 font-serif">
              Event Types
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subtypes.map((subtype) => (
              <div
                key={subtype.name}
                className="bg-background rounded-2xl p-6 shadow-sm hover-lift transition-all duration-300 border border-border"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{subtype.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{subtype.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-medium text-sm uppercase tracking-wider" style={{ color }}>
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 font-serif">
              What Makes Us Special
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Sparkles className="h-6 w-6" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-[#3F3D56] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#E6C9A8] font-medium text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 font-serif">
              Choose Your Package
            </h2>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto">
              Flexible packages designed to meet your needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-white/5 backdrop-blur-md rounded-3xl p-8 ${
                  pkg.popular ? 'ring-2 ring-[#E6C9A8]' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E6C9A8] text-[#3F3D56] px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold" style={{ color }}>{pkg.price}</span>
                </div>
                <p className="text-white/60 text-sm mb-6">{pkg.sessions} sessions included</p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#E6C9A8] mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/booking" className="block">
                  <Button 
                    className="w-full rounded-2xl"
                    style={{ backgroundColor: pkg.popular ? color : 'transparent', borderColor: color }}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-medium text-sm uppercase tracking-wider" style={{ color }}>
              Our Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 font-serif">
              Recent Performances
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group">
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3F3D56]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-white font-medium">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ backgroundColor: color }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Book your consultation today and let&apos;s create something amazing together.
          </p>
          <Link href="/booking">
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 rounded-2xl px-8 py-6 text-lg font-semibold"
              style={{ color }}
            >
              Book Your Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
