import { MessageSquare, Palette, Music, PartyPopper } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Connect With Us',
    description: 'Reach out via our booking form or WhatsApp. Share your vision, event details, and any song preferences.',
  },
  {
    icon: Palette,
    number: '02',
    title: 'Custom Planning',
    description: 'We design a personalized choreography plan based on your skill level, group size, and event theme.',
  },
  {
    icon: Music,
    number: '03',
    title: 'Learn & Practice',
    description: 'Enjoy fun, stress-free sessions at your preferred location. We break down moves for all skill levels.',
  },
  {
    icon: PartyPopper,
    number: '04',
    title: 'Shine & Celebrate',
    description: 'Take the stage with confidence and create memories that last a lifetime. We handle the rest!',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#3F3D56] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#3A86FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#E6C9A8]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#E6C9A8] font-medium text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 font-serif">
            How It Works
          </h2>
          <p className="text-lg text-white/70 mt-4 max-w-2xl mx-auto">
            From first contact to final performance, we make the journey 
            as enjoyable as the destination.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#E6C9A8]/30 to-transparent" />
              )}
              
              <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#E6C9A8] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-[#3F3D56] font-bold text-sm">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#3A86FF]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="h-8 w-8 text-[#3A86FF]" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 font-serif">{step.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/70 mb-2">Ready to start your dance journey?</p>
          <a 
            href="/booking" 
            className="inline-flex items-center gap-2 text-[#E6C9A8] font-semibold hover:underline underline-offset-4"
          >
            Get Started Today
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
