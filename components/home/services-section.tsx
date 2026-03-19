import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, Building2, GraduationCap, Mic } from 'lucide-react'

const services = [
  {
    icon: Heart,
    title: 'Wedding Choreography',
    description: 'Create magical moments for your sangeet, reception, and special occasions with personalized choreography.',
    href: '/services/weddings',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    features: ['Sangeet', 'Reception', 'Mehendi', 'Engagement'],
    color: '#FF6B6B',
  },
  {
    icon: Building2,
    title: 'Corporate Events',
    description: 'Energize your corporate gatherings with professional dance performances and team building activities.',
    href: '/services/corporate',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    features: ['Annual Day', 'Team Building', 'Product Launch', 'Awards Night'],
    color: '#3A86FF',
  },
  {
    icon: GraduationCap,
    title: 'College Events',
    description: 'Bring energy and excitement to college fests with dynamic group choreography and flash mobs.',
    href: '/services/college',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    features: ['Freshers', 'Farewell', 'Annual Fest', 'Flash Mob'],
    color: '#E6C9A8',
  },
  {
    icon: Mic,
    title: 'Audition Preparation',
    description: 'Get camera-ready with expert coaching for reality shows, films, and professional auditions.',
    href: '/services/auditions',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80',
    features: ['Reality Shows', 'Film', 'Music Video', 'Brand Shoots'],
    color: '#3F3D56',
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#3A86FF] font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 font-serif">
            Choreography for Every
            <span className="text-gold-gradient"> Occasion</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            From intimate celebrations to grand performances, we bring your vision to life 
            with expert choreography tailored to your unique needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative bg-card rounded-3xl overflow-hidden shadow-lg hover-lift transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                
                {/* Icon badge */}
                <div 
                  className="absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${service.color}20` }}
                >
                  <service.icon className="h-6 w-6" style={{ color: service.color }} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-0 -mt-8 relative z-10">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#3A86FF] transition-colors font-serif">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center text-[#3A86FF] font-medium text-sm">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
