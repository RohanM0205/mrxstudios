import { CheckCircle, Phone, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BookingSuccessProps {
  onReset: () => void
}

export function BookingSuccess({ onReset }: BookingSuccessProps) {
  return (
    <div className="bg-background rounded-3xl p-8 shadow-sm text-center">
      <div className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-[#25D366]" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-3 font-serif">
        Booking Request Received!
      </h2>
      
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Thank you for your interest in MRX Studios. We&apos;ve received your request 
        and will get back to you within 24 hours.
      </p>

      <div className="bg-muted/50 rounded-2xl p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
        <ol className="text-left space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-[#3A86FF] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">1</span>
            <span>Our team will review your request and event details</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-[#3A86FF] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">2</span>
            <span>We&apos;ll call or WhatsApp you to discuss your vision</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-[#3A86FF] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">3</span>
            <span>You&apos;ll receive a customized plan and quote</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-[#3A86FF] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">4</span>
            <span>Once confirmed, we begin your dance journey!</span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a
          href="tel:+919876543210"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3A86FF] text-white rounded-xl font-medium hover:bg-[#3A86FF]/90 transition-colors"
        >
          <Phone className="h-4 w-4" />
          Call Us Now
        </a>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#25D366]/90 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </div>

      <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={onReset} className="rounded-xl">
          Submit Another Request
        </Button>
        <Link href="/portfolio">
          <Button variant="ghost" className="rounded-xl">
            Browse Our Portfolio
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
