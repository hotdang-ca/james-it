import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import InvoiceDetailClient from './page.client'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: invoiceRaw, error } = await supabase
        .from('invoices')
        .select(`
            *,
            contact:contacts(*),
            jobs(*),
            payment_requests(*)
        `)
        .eq('id', id)
        .single()

    const invoice: any = invoiceRaw

    if (error || !invoice) {
        notFound()
    }

    // Sort payment requests by date
    if (invoice.payment_requests) {
        invoice.payment_requests.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <InvoiceDetailClient invoice={invoice} />
        </div>
    )
}
