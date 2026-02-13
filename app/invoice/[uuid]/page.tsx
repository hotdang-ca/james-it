import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import InvoicePageClient from './InvoicePageClient'
import { getInvoice } from '@/app/admin/actions/invoice'

export async function generateMetadata({ params }: { params: { uuid: string } }): Promise<Metadata> {
    const { uuid } = await params
    const invoice: any = await getInvoice(uuid)

    if (!invoice) {
        return {
            title: 'Invoice Not Found | James IT'
        }
    }

    const shortId = invoice.id.slice(0, 8)
    const dateStr = new Date(invoice.created_at).toLocaleDateString()

    return {
        title: `Invoice #${shortId} | James IT`,
        description: `View invoice details. Date: ${dateStr}.`,
    }
}

export default async function InvoicePage({
    params,
    searchParams
}: {
    params: { uuid: string },
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { uuid } = await params
    const qp = await searchParams
    const showSuccess = qp?.payment_success === 'true'
    const showCancel = qp?.payment_cancelled === 'true'
    const sessionId = qp?.session_id as string

    const invoice = await getInvoice(uuid)

    if (!invoice) return notFound()

    return (
        <InvoicePageClient
            invoice={invoice}
            paymentSuccess={showSuccess}
            paymentCancelled={showCancel}
            sessionId={sessionId}
        />
    )
}
