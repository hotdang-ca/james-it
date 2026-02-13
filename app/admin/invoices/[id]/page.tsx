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

    // we need to get the payment requests for the jobs as well, and apply them to the invoice.jobs
    const { data: jobPaymentRequests, error: jobPaymentRequestsError } = await supabase
        .from('payment_requests')
        .select('*')
        .in('job_id', invoice.jobs.map((j: any) => j.id))

    if (jobPaymentRequests) {
        invoice.jobs.forEach((job: any) => {
            job.payment_requests = jobPaymentRequests.filter((r: any) => r.job_id === job.id)
        })
    }

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
