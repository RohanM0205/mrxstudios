import { ServicePageTemplate } from '@/components/services/service-page-template'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'College Event Choreography | MRX Studios',
  description:
    'Bring energy and excitement to college fests with dynamic group choreography and flash mobs from MRX Studios.',
}

const collegePageData = {
  // ── FIX: pass icon as a plain string key, NOT as a component reference ──
  // Passing <GraduationCap /> or the GraduationCap component directly across
  // the Server → Client boundary throws:
  // "Only plain objects can be passed to Client Components"
  // ServicePageTemplate resolves this string to the actual icon internally.
  icon: 'GraduationCap' as const,

  title: 'College Events',
  subtitle: 'Campus Entertainment',
  description:
    'Bring the energy and excitement that college events deserve with dynamic choreography that wins competitions and creates unforgettable memories.',
  heroImage:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',

  // Midnight Marigold: College = Crimson (celebration red — youth, energy, victory)
  color: '#e8175d',

  subtypes: [
    {
      name: 'Freshers',
      description:
        'Welcome the new batch with energetic performances that set the tone for their college journey.',
    },
    {
      name: 'Farewell',
      description:
        'Emotional yet fun performances that celebrate the graduating batch in style.',
    },
    {
      name: 'Annual Fest',
      description:
        'Competition-winning choreography that represents your college with pride.',
    },
    {
      name: 'Competition',
      description:
        'Innovative, judge-impressing routines designed to win inter-college dance battles.',
    },
    {
      name: 'Flash Mob',
      description:
        'Surprise performances that go viral and create buzz across campus.',
    },
  ],

  features: [
    {
      title: 'Competition-Ready',
      description:
        'Choreography designed with judges in mind, incorporating trending moves and wow factors.',
    },
    {
      title: 'Budget-Friendly',
      description:
        'Special student pricing without compromising on quality or creativity.',
    },
    {
      title: 'Quick Turnaround',
      description:
        'We understand college timelines and can prepare performances in tight schedules.',
    },
    {
      title: 'Mixed Skill Levels',
      description:
        'Routines that showcase skilled dancers while making beginners look great too.',
    },
    {
      title: 'Trending Styles',
      description:
        'Up-to-date with the latest dance trends, viral moves, and popular songs.',
    },
    {
      title: 'Formation Expertise',
      description:
        'Eye-catching formations and transitions that maximize stage impact.',
    },
  ],

  packages: [
    {
      name: 'Basic',
      price: '₹12,000',
      sessions: 4,
      features: [
        'Single song routine',
        'Up to 10 dancers',
        'Basic formations',
        'Practice videos',
        'WhatsApp support',
      ],
    },
    {
      name: 'Competition',
      price: '₹25,000',
      sessions: 8,
      popular: true,
      features: [
        '2-3 song medley',
        'Up to 20 dancers',
        'Advanced formations',
        'Music editing',
        'Costume guidance',
        'Mock judging session',
      ],
    },
    {
      name: 'Festival Package',
      price: '₹40,000',
      sessions: 12,
      features: [
        'Multiple performances',
        'Unlimited participants',
        'Full event coordination',
        'Props & costumes help',
        'Day-of support',
        'Flash mob included',
      ],
    },
  ],

  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
      caption: 'College Fest Performance',
    },
    {
      url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
      caption: 'Flash Mob Surprise',
    },
    {
      url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
      caption: 'Competition Winners',
    },
    {
      url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80',
      caption: 'Freshers Night',
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
      caption: 'Annual Day',
    },
    {
      url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&q=80',
      caption: 'Farewell Performance',
    },
  ],
}

export default function CollegePage() {
  return <ServicePageTemplate {...collegePageData} />
}