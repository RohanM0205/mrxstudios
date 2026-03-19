'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: '1',
    name: 'Priya & Rahul Sharma',
    event: 'Wedding Sangeet',
    content: 'Ritesh and his team made our sangeet absolutely magical! They taught 15 of our family members a beautiful choreography in just 5 sessions. Everyone was amazed at how confident even our non-dancers became.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&q=80',
  },
  {
    id: '2',
    name: 'Vikram Mehta',
    event: 'Corporate Event',
    content: 'The energy MRX Studios brought to our company annual day was incredible. They handled 50+ employees with different skill levels and created a show-stopping performance. Highly professional team!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: '3',
    name: 'Ananya College Fest',
    event: 'College Performance',
    content: 'Our college fest performance was a huge hit thanks to MRX Studios! The choreography was modern, energetic, and perfectly suited for our group. We won first place in the inter-college competition!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    event: 'Reality Show Audition',
    content: 'I came to Ritesh with zero confidence for my dance reality show audition. His patient coaching and unique choreography helped me clear 3 rounds! Forever grateful for his guidance.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#3A86FF] font-medium text-sm uppercase tracking-wider">
            Client Love
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 font-serif">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from the people who&apos;ve 
            danced with us.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-3xl p-8 md:p-12 relative">
            {/* Quote icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-[#E6C9A8] rounded-2xl flex items-center justify-center shadow-lg">
              <Quote className="h-6 w-6 text-[#3F3D56]" />
            </div>

            {/* Content */}
            <div className="pt-4">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonials[currentIndex].rating
                        ? 'text-[#E6C9A8] fill-[#E6C9A8]'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-serif">
                &ldquo;{testimonials[currentIndex].content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].event}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-[#3A86FF] hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-[#3A86FF]'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-[#3A86FF] hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
