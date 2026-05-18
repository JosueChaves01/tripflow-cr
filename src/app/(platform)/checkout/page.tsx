'use client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useTripFlowStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useI18n } from '@/i18n'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ total }: { total: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard?payment=success` },
    })
    setLoading(false)
    if (error) alert(error.message)
  }

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement />
      <Button onClick={handleSubmit} disabled={loading || !stripe}>
        {loading ? <Spinner size="sm" /> : t('payX').replace('{total}', String(total))}
      </Button>
    </div>
  )
}

export default function CheckoutPage() {
  const selectedBookings = useTripFlowStore((s) => s.selectedBookings)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()

  const total = selectedBookings.reduce((sum, b) => sum + b.total_price, 0)

  const handleProceed = async () => {
    if (selectedBookings.length === 0) return
    setLoading(true)
    try {
      const bookingId = selectedBookings[0].id
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, amount: total }),
      })
      const json = await res.json()
      if (json.clientSecret) setClientSecret(json.clientSecret)
      else alert(json.error ?? 'Payment setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">{t('checkout')}</h1>

        <Card className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">{t('orderSummary')}</h2>
          {selectedBookings.length === 0 ? (
            <p className="text-slate-500">{t('noBookingsSelected')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {selectedBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-700">{booking.activity_id}</span>
                  <span className="font-medium text-emerald-600">${booking.total_price}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3">
                <span className="font-semibold">{t('total')}</span>
                <Badge variant="success">${total}</Badge>
              </div>
            </div>
          )}
        </Card>

        {!clientSecret ? (
          <Button onClick={handleProceed} disabled={loading || selectedBookings.length === 0}>
            {loading ? <Spinner size="sm" /> : t('proceedToPayment')}
          </Button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm total={total} />
          </Elements>
        )}
      </div>
    </div>
  )
}