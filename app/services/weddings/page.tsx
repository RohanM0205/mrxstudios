import { ServicePageTemplate } from '@/components/services/service-page-template'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Choreography | MRX Studios',
  description:
    'Create magical wedding moments with professional choreography for sangeet, reception, mehendi, and engagement ceremonies.',
}

const weddingPageData = {
  // ── FIX: pass icon as a plain string key, NOT as a component reference ──
  // Passing <Heart /> or the Heart component directly across the Server →
  // Client boundary throws: "Only plain objects can be passed to Client Components"
  // The ServicePageTemplate resolves this string to the actual icon internally.
  icon: 'Heart' as const,

  title: 'Wedding Choreography',
  subtitle: 'Wedding Celebrations',
  description:
    'Make your special day unforgettable with personalized wedding choreography that captures your love story and creates magical moments for you and your guests.',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',

  // Midnight Marigold: Wedding = Marigold (saffron, wedding flowers, auspicious gold)
  color: '#f5a623',

  subtypes: [
    {
      name: 'Sangeet',
      description:
        'The heart of wedding celebrations! We create vibrant, energetic performances that get everyone on the dance floor.',
    },
    {
      name: 'Reception',
      description:
        'Elegant couple performances that showcase your bond and leave your guests mesmerized.',
    },
    {
      name: 'Mehendi',
      description:
        'Fun, colourful choreography perfect for the intimate mehendi ceremony with family and friends.',
    },
    {
      name: 'Engagement',
      description:
        'Mark the beginning of your journey with a beautiful performance that tells your love story.',
    },
    {
      name: 'Haldi',
      description:
        'Joyful, traditional dance sequences that celebrate this auspicious ceremony with energy and colour.',
    },
  ],

  features: [
    {
      title: 'Personalized Choreography',
      description:
        'Every routine is custom-designed to match your personality, song choices, and comfort level.',
    },
    {
      title: 'All Skill Levels Welcome',
      description:
        'Whether you have two left feet or are a seasoned dancer, we adapt to your abilities.',
    },
    {
      title: 'Family-Friendly Sessions',
      description:
        'We teach groups of all ages — from kids to grandparents — ensuring everyone can participate.',
    },
    {
      title: 'Flexible Scheduling',
      description:
        'Sessions at your home, our studio, or any preferred location at times that work for you.',
    },
    {
      title: 'Multiple Song Medleys',
      description:
        'We expertly blend multiple songs into seamless performances that keep the energy high.',
    },
    {
      title: 'Video Tutorials Included',
      description:
        'Practice anytime with recorded tutorials of your choreography for home revision.',
    },
  ],

  packages: [
    {
      name: 'Essential',
      price: '₹15,000',
      sessions: 4,
      features: [
        'Single song choreography',
        'Up to 6 people',
        'Basic formations',
        'Video tutorials',
        'WhatsApp support',
      ],
    },
    {
      name: 'Premium',
      price: '₹35,000',
      sessions: 8,
      popular: true,
      features: [
        '2–3 song medley',
        'Up to 15 people',
        'Props & formations',
        'Video tutorials',
        'Day-of coordination',
        'Dress rehearsal included',
      ],
    },
    {
      name: 'Grand',
      price: '₹60,000',
      sessions: 12,
      features: [
        'Full sangeet package',
        'Unlimited participants',
        'Multiple performances',
        'Custom music editing',
        'Full event coordination',
        'Backup dancers available',
      ],
    },
  ],

  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
      caption: 'Sangeet Night Performance',
    },
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
      caption: 'Couple First Dance',
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
      caption: 'Family Group Dance',
    },
    {
      url: 'https://sadafindia.com/wp-content/uploads/2023/09/Henna-Party-Photo-1-1024x683.jpeg',
      caption: 'Mehendi Celebration',
    },
    {
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
      caption: 'Reception Performance',
    },
    {
      url: 'https://images.unsplash.com/photo-1513623935135-c896b59073c1?w=600&q=80',
      caption: 'Bride Squad Dance',
    },
  ],
}

export default function WeddingsPage() {
  return <ServicePageTemplate {...weddingPageData} />
}