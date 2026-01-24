import { getJobByUuid, getJobMessages, getJobGeolocation } from '../actions'
import { getPaymentRequests } from '@/app/admin/actions/payment'
import { notFound } from 'next/navigation'
import JobPageClient from './JobPageClient'

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
