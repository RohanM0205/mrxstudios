import { Mic } from 'lucide-react'
import { ServicePageTemplate } from '@/components/services/service-page-template'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audition Preparation | MRX Studios',
  description: 'Get camera-ready with expert coaching for reality shows, films, and professional auditions from MRX Studios.',
}

const auditionsPageData = {
  icon: Mic,
  title: 'Audition Preparation',
  subtitle: 'Professional Coaching',
  description: 'Get camera-ready with expert coaching designed to help you shine in reality shows, film auditions, music videos, and brand shoots.',
  heroImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80',
  color: '#3F3D56',
  
  subtypes: [
    {
      name: 'Reality Shows',
      description: 'Specialized training for popular dance reality shows with industry-relevant choreography.',
    },
    {
      name: 'Film Auditions',
      description: 'Camera-friendly movements and expressions that translate well on screen.',
    },
    {
      name: 'Music Videos',
      description: 'Contemporary and stylized choreography perfect for music video shoots.',
    },
    {
      name: 'Brand Shoots',
      description: 'Commercial-ready movements that highlight products while showcasing your talent.',
    },
    {
      name: 'Personal Portfolio',
      description: 'Build a professional dance portfolio with varied styles and recorded performances.',
    },
  ],

  features: [
    {
      title: 'Industry Experience',
      description: 'Learn from choreographers who have worked with major production houses.',
    },
    {
      title: 'Camera Training',
      description: 'Practice performing for camera with feedback on angles and expressions.',
    },
    {
      title: 'Versatile Styles',
      description: 'Master multiple dance styles required for professional auditions.',
    },
    {
      title: 'Mock Auditions',
      description: 'Simulate real audition environments to build confidence and reduce anxiety.',
    },
    {
      title: 'Personalized Feedback',
      description: 'One-on-one sessions with detailed feedback to accelerate improvement.',
    },
    {
      title: 'Industry Connections',
      description: 'Guidance on audition opportunities and industry networking.',
    },
  ],

  packages: [
    {
      name: 'Starter',
      price: '₹10,000',
      sessions: 5,
      features: [
        'One-on-one coaching',
        'Basic audition prep',
        'Style assessment',
        'Practice recordings',
        'Feedback sessions',
      ],
    },
    {
      name: 'Professional',
      price: '₹25,000',
      sessions: 12,
      popular: true,
      features: [
        'Intensive training',
        'Multiple style mastery',
        'Mock auditions',
        'Video portfolio',
        'Industry guidance',
        'Ongoing support',
      ],
    },
    {
      name: 'Elite',
      price: '₹50,000',
      sessions: 20,
      features: [
        'Complete transformation',
        'All dance styles',
        'Professional shoot',
        'Portfolio creation',
        'Industry introductions',
        '3-month mentorship',
      ],
    },
  ],

  gallery: [
    { url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80', caption: 'Audition Preparation' },
    { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80', caption: 'Dance Training' },
    { url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&q=80', caption: 'Camera Practice' },
    { url: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=600&q=80', caption: 'Style Exploration' },
    { url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80', caption: 'Performance Ready' },
    { url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600&q=80', caption: 'Video Shoot' },
  ],
}

export default function AuditionsPage() {
  return <ServicePageTemplate {...auditionsPageData} />
}
