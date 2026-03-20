import { ServicePageTemplate } from '@/components/services/service-page-template'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guest Performance | MRX Studios',
  description:
    'Elevate any event with a show-stopping professional guest performance by MRX Studios — weddings, corporate nights, private parties and more.',
}

const guestPerformancePageData = {
  // ServicePageTemplate resolves this string to the actual icon internally.
  icon: 'Star' as const,

  title: 'Guest Performance',
  subtitle: 'Live Entertainment',
  description:
    'Blow your audience away with a high-energy, fully-produced live performance by MRX Studios. From Bollywood medleys to fusion spectaculars — we bring the wow factor to any stage.',
  heroImage:
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',

  // Midnight Marigold: Guest Performance = Ember (burnished orange — stage fire, spectacle)
  color: '#ff6b35',

  subtypes: [
    {
      name: 'Wedding Reception',
      description:
        'A professionally choreographed surprise act that becomes the most talked-about moment of the night.',
    },
    {
      name: 'Corporate Gala',
      description:
        'Polished, brand-safe performances that raise the prestige of awards nights and annual dinners.',
    },
    {
      name: 'Private Party',
      description:
        'Custom themed performances tailored to birthdays, anniversaries, and milestone celebrations.',
    },
    {
      name: 'Cultural Festival',
      description:
        'Vibrant folk, classical, or fusion acts that celebrate heritage and entertain large crowds.',
    },
    {
      name: 'Brand Activation',
      description:
        'High-impact live performances designed to create viral moments at product launches and expos.',
    },
  ],

  features: [
    {
      title: 'Fully Produced Act',
      description:
        'Professional costumes, props, lighting cues, and custom music editing included in every package.',
    },
    {
      title: 'Versatile Styles',
      description:
        "Bollywood, contemporary, folk, fusion, western — we match the act to your event's vibe perfectly.",
    },
    {
      title: 'Surprise-Ready',
      description:
        'We coordinate discreetly with event planners to pull off seamless surprise performances.',
    },
    {
      title: 'Scalable Cast',
      description:
        'Solo acts to full ensembles of 20+ dancers — sized exactly to your stage and budget.',
    },
    {
      title: 'Venue Coordination',
      description:
        'We liaise directly with venue teams for sound checks, stage setup, and cue sheets.',
    },
    {
      title: 'Memorable Finales',
      description:
        'Signature crowd-participation endings that get every guest on their feet.',
    },
  ],

  packages: [
    {
      name: 'Solo Act',
      price: '₹20,000',
      sessions: 1,
      features: [
        '10–15 min performance',
        '1–2 performers',
        'Custom choreography',
        'Costume included',
        'Music editing',
      ],
    },
    {
      name: 'Group Show',
      price: '₹45,000',
      sessions: 1,
      popular: true,
      features: [
        '20–30 min performance',
        '6–10 performers',
        'Themed production',
        'Costumes & props',
        'Lighting cue sheet',
        'Sound check & rehearsal',
      ],
    },
    {
      name: 'Grand Spectacular',
      price: '₹90,000',
      sessions: 1,
      features: [
        '45–60 min full show',
        '15–25 performers',
        'Multi-act production',
        'Full costume design',
        'Live music option',
        'Complete event takeover',
      ],
    },
  ],

  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
      caption: 'Wedding Reception Performance',
    },
    {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      caption: 'Corporate Gala Show',
    },
    {
      url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80',
      caption: 'Festival Stage Act',
    },
    {
      url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80',
      caption: 'Brand Activation',
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
      caption: 'Private Party Surprise',
    },
    {
      url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
      caption: 'Ensemble Finale',
    },
  ],
}

export default function GuestPerformancePage() {
  return <ServicePageTemplate {...guestPerformancePageData} />
}