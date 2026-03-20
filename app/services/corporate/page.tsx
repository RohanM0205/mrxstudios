import { ServicePageTemplate } from '@/components/services/service-page-template'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Event Choreography | MRX Studios',
  description:
    'Energize your corporate events with professional dance performances and team building activities from MRX Studios.',
}

const corporatePageData = {
  // ── FIX: pass icon as a plain string key, NOT as a component reference ──
  // Passing <Building2 /> or the Building2 component directly across the
  // Server → Client boundary throws:
  // "Only plain objects can be passed to Client Components"
  // ServicePageTemplate resolves this string to the actual icon internally.
  icon: 'Building2' as const,

  title: 'Corporate Events',
  subtitle: 'Corporate Entertainment',
  description:
    'Transform your corporate gatherings into memorable experiences with professional choreography that energizes teams and impresses clients.',
  heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',

  // Midnight Marigold: Corporate = Ember (burnished orange — energy, drive)
  color: '#ff6b35',

  subtypes: [
    {
      name: 'Annual Day',
      description:
        'High-energy group performances that celebrate your company achievements and culture.',
    },
    {
      name: 'Team Building',
      description:
        'Dance workshops that boost morale, improve coordination, and strengthen team bonds.',
    },
    {
      name: 'Product Launch',
      description:
        'Impactful dance sequences that create buzz and memorably showcase your brand.',
    },
    {
      name: 'Awards Night',
      description:
        'Glamorous performances that add star quality to your recognition ceremonies.',
    },
    {
      name: 'Conference Entertainment',
      description:
        'Engaging flash mobs and performances that break the ice and energize attendees.',
    },
  ],

  features: [
    {
      title: 'Professional Coordination',
      description:
        'We handle all logistics, from music to staging, ensuring flawless execution.',
    },
    {
      title: 'Brand Integration',
      description:
        'Choreography that subtly incorporates your brand colors, values, and messaging.',
    },
    {
      title: 'Large Group Management',
      description:
        'Expert at coordinating performances with 50+ participants across departments.',
    },
    {
      title: 'Time-Efficient Sessions',
      description:
        'Designed for busy professionals with minimal practice time required.',
    },
    {
      title: 'On-Site Training',
      description:
        'We come to your office or venue, eliminating travel time for your team.',
    },
    {
      title: 'Stress-Free Experience',
      description:
        'We manage everything so your team can focus on having fun.',
    },
  ],

  packages: [
    {
      name: 'Team Workshop',
      price: '₹25,000',
      sessions: 3,
      features: [
        '2-hour workshop sessions',
        'Up to 30 participants',
        'Team building activities',
        'Basic choreography',
        'On-site at your office',
      ],
    },
    {
      name: 'Event Performance',
      price: '₹50,000',
      sessions: 6,
      popular: true,
      features: [
        'Full event choreography',
        'Up to 50 participants',
        'Professional staging',
        'Music editing included',
        'Dress rehearsal',
        'Day-of coordination',
      ],
    },
    {
      name: 'Enterprise Package',
      price: 'Custom',
      sessions: 10,
      features: [
        'Multiple performances',
        'Unlimited participants',
        'Full event production',
        'Professional dancers',
        'Complete event management',
        'Multi-city coordination',
      ],
    },
  ],

  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      caption: 'Annual Day Performance',
    },
    {
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
      caption: 'Team Celebration',
    },
    {
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
      caption: 'Conference Flash Mob',
    },
    {
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
      caption: 'Product Launch Event',
    },
    {
      url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80',
      caption: 'Awards Ceremony',
    },
    {
      url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&q=80',
      caption: 'Team Building Workshop',
    },
  ],
}

export default function CorporatePage() {
  return <ServicePageTemplate {...corporatePageData} />
}