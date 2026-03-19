'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_NUMBER = '919876543210' // Replace with actual number
const DEFAULT_MESSAGE = 'Hi! I\'m interested in choreography services from MRX Studios.'

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="animate-fade-in bg-white rounded-2xl shadow-xl p-4 max-w-[200px] relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Close tooltip"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-sm text-foreground font-medium">
            Need help? Chat with us!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            We typically reply within minutes
          </p>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover-lift',
          'animate-pulse-glow hover:animate-none',
          isHovered && 'scale-110'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </a>
    </div>
  )
}
