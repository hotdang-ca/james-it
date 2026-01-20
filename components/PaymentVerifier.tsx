'use client'

import { useEffect, useRef } from 'react'
import { verifyPayment } from '@/app/admin/actions/payment'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PaymentVerifier({ sessionId }: { sessionId: string }) {
    const router = useRouter()
    const hasVerified = useRef(false)

    useEffect(() => {
        if (hasVerified.current) return
        hasVerified.current = true

        const verify = async () => {
            const toastId = toast.loading('Verifying payment...')

            try {
                const result = await verifyPayment(sessionId)

                if (result.success) {
                    toast.success('Payment verified!', { id: toastId })
                    // Refresh current route to show updated data
                    router.refresh()
                } else {
                    toast.error('Payment verification failed: ' + result.error, { id: toastId })
                }
            } catch (e) {
                toast.error('Error verifying payment.', { id: toastId })
            }
        }

        verify()
    }, [sessionId, router])

    return null // Invisible component
}
