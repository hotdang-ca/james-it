'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import InvoiceReceiptView from '@/components/invoice/InvoiceReceiptView'
import { verifyPayment } from '@/app/admin/actions/payment'

interface InvoicePageClientProps {
    invoice: any
    paymentSuccess?: boolean
    paymentCancelled?: boolean
    sessionId?: string
}

export default function InvoicePageClient({ invoice, paymentSuccess, paymentCancelled, sessionId }: InvoicePageClientProps) {
    const router = useRouter()
    const [verifying, setVerifying] = useState(false)

    useEffect(() => {
        if (paymentSuccess && sessionId && !verifying) {
            setVerifying(true)
            verifyPayment(sessionId)
                .then(res => {
                    if (res.success) {
                        alert('Payment Successful! Thank you.')
                        // Remove query params
                        router.replace(`/invoice/${invoice.id}`)
                    } else {
                        alert('Error verifying payment: ' + res.error)
                    }
                })
                .finally(() => setVerifying(false))
        }
    }, [paymentSuccess, sessionId, invoice.id, router, verifying])

    useEffect(() => {
        if (paymentCancelled) {
            alert('Payment Cancelled.')
            router.replace(`/invoice/${invoice.id}`)
        }
    }, [paymentCancelled, invoice.id, router])

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', padding: '2rem 1rem' }}>
            <InvoiceReceiptView invoice={invoice} />

            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                &copy; {new Date().getFullYear()} James IT. All rights reserved.
            </div>
        </div>
    )
}
