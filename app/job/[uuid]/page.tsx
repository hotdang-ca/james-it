import { getJobByUuid, getJobMessages, getJobGeolocation } from '../actions'
import { getPaymentRequests } from '@/app/admin/actions/payment'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import JobPageClient from './JobPageClient'

export async function generateMetadata({ params }: { params: { uuid: string } }): Promise<Metadata> {
    const { uuid } = await params
    const job = await getJobByUuid(uuid)

    if (!job) {
        return {
            title: 'Job Not Found | James IT'
        }
    }

    const shortId = job.id.slice(0, 8)
    const dateStr = job.completed_at
        ? new Date(job.completed_at).toLocaleDateString()
        : job.start_time
            ? new Date(job.start_time).toLocaleDateString()
            : 'Pending'

    return {
        title: `Job #${shortId} - ${job.description} | James IT`,
        description: `View job details and invoice. Service Date: ${dateStr}.`,
        openGraph: {
            title: `Job #${shortId} | James IT`,
            description: `View job details and invoice for ${job.description}.`,
            images: ['/assets/james.jpg']
        }
    }
}

export default async function JobPage({
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

    // Fetch in parallel
    const jobReq = getJobByUuid(uuid)
    const messagesReq = getJobMessages(uuid)
    const geoReq = getJobGeolocation(uuid)
    const paymentsReq = getPaymentRequests(uuid)

    const [job, initialMessages, geoLogs, paymentRequests] = await Promise.all([jobReq, messagesReq, geoReq, paymentsReq])

    if (!job) return notFound()

    return (
        <JobPageClient
            job={job}
            paymentRequests={paymentRequests}
            geoLogs={geoLogs}
            initialMessages={initialMessages as any[]}
            uuid={uuid}
            paymentSuccess={showSuccess}
            paymentCancelled={showCancel}
            sessionId={sessionId}
        />
    )
}
