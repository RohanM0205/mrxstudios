'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Play, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = ['All', 'Wedding', 'Corporate', 'College', 'Audition']

const portfolioItems = [
  {
    id: '1',
    title: 'Sharma Wedding Sangeet',
    category: 'Wedding',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    description: '15-member family performance',
    isVideo: true,
  },
  {
    id: '2',
    title: 'TechCorp Annual Day',
    category: 'Corporate',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    description: '50+ employees group dance',
    isVideo: true,
  },
  {
    id: '3',
    title: 'IIT Fest Performance',
    category: 'College',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    description: 'First prize winners',
    isVideo: true,
  },
  {
    id: '4',
    title: 'Reality Show Prep',
    category: 'Audition',
    thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80',
    description: 'Successful audition coaching',
    isVideo: false,
  },
  {
    id: '5',
    title: 'Mehendi Celebration',
    category: 'Wedding',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
    description: 'Colorful family dance',
    isVideo: true,
  },
  {
    id: '6',
    title: 'Product Launch Flash Mob',
    category: 'Corporate',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    description: 'Brand activation event',
    isVideo: true,
  },
  {
    id: '7',
    title: 'Farewell Performance',
    category: 'College',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    description: 'Emotional farewell dance',
    isVideo: true,
  },
  {
    id: '8',
    title: 'Music Video Choreography',
    category: 'Audition',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    description: 'Commercial project',
    isVideo: true,
  },
  {
    id: '9',
    title: 'Reception Couple Dance',
    category: 'Wedding',
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    description: 'Romantic first dance',
    isVideo: true,
  },
  {
    id: '10',
    title: 'Team Building Workshop',
    category: 'Corporate',
    thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&q=80',
    description: 'Fun team activity',
    isVideo: false,
  },
  {
    id: '11',
    title: 'Inter-College Competition',
    category: 'College',
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
    description: 'Championship performance',
    isVideo: true,
  },
  {
    id: '12',
    title: 'Film Audition Success',
    category: 'Audition',
    thumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&q=80',
    description: 'Bollywood project',
    isVideo: false,
  },
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filteredItems = activeFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter)

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#3F3D56] to-[#3F3D56]/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
            Our <span className="text-gold-gradient">Portfolio</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our collection of memorable performances and successful events 
            across weddings, corporate shows, college fests, and more.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-muted/50 sticky top-20 z-40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? 'default' : 'outline'}
                className={`rounded-full whitespace-nowrap ${
                  activeFilter === category 
                    ? 'bg-[#3A86FF] hover:bg-[#3A86FF]/90 text-white' 
                    : 'hover:bg-[#3A86FF]/10 hover:text-[#3A86FF] hover:border-[#3A86FF]'
                }`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg hover-lift text-left"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3F3D56]/90 via-[#3F3D56]/20 to-transparent" />
                
                {/* Play button for videos */}
                {item.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl">
                      <Play className="h-6 w-6 text-[#3F3D56] ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white">
                    {item.category}
                  </span>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#3A86FF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif">
            Want to Be Our Next Success Story?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Let&apos;s create something amazing together. Book your consultation today.
          </p>
          <a href="/booking">
            <Button 
              size="lg" 
              className="bg-white text-[#3A86FF] hover:bg-white/90 rounded-2xl px-8 py-6 text-lg font-semibold"
            >
              Book Your Session
            </Button>
          </a>
        </div>
      </section>

      {/* Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div 
            className="relative w-full max-w-4xl aspect-video bg-[#3F3D56] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Video player will be integrated here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
