import { getJobByUuid, getJobMessages, getJobGeolocation } from '../actions'
import { notFound } from 'next/navigation'
import ChatWidget from '@/components/ChatWidget'
import JobMapWrapper from '@/components/JobMapWrapper'

export default async function JobPage({ params }: { params: { uuid: string } }) {
    const { uuid } = await params

    // Fetch in parallel
    const jobReq = getJobByUuid(uuid)
    const messagesReq = getJobMessages(uuid)
    const geoReq = getJobGeolocation(uuid)

    const [job, initialMessages, geoLogs] = await Promise.all([jobReq, messagesReq, geoReq])

    if (!job) return notFound()

    return (
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '1rem' }}>
            <header style={{
                backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                maxWidth: '800px', margin: '0 auto 1.5rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ fontWeight: 800, color: '#1E293B' }}>JAMES-IT</div>
                <div style={{ fontSize: '0.875rem', color: '#64748B' }}>Job #{job.created_at.slice(0, 10).replace(/-/g, '')}</div>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '1.5rem' }}>

                {/* Status Card */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Current Status</h1>
                            <div style={{
                                display: 'inline-block', padding: '0.35rem 0.75rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem',
                                backgroundColor: job.status === 'COMPLETED' ? '#DCFCE7' : '#FEF9C3',
                                color: job.status === 'COMPLETED' ? '#166534' : '#854D0E',
                                textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {(job.status as string)?.replace('_', ' ')}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.875rem', color: '#64748B' }}>Quoted Price</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>${job.quoted_price}</div>
                            {job.stripe_payment_link && job.status !== 'COMPLETED' && (
                                <a
                                    href={job.stripe_payment_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#FF6B00',
                                        color: 'white',
                                        fontWeight: 600,
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        boxShadow: '0 2px 4px rgba(255, 107, 0, 0.2)'
                                    }}
                                >
                                    Pay Deposit
                                </a>
                            )}
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#F1F5F9', padding: '1rem', borderRadius: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                        {job.description}
                    </div>
                </div>

                {/* Map & Tracking Component */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', marginBottom: '1rem' }}>Live Tracking</h2>
                    <JobMapWrapper logs={geoLogs || []} />
                </div>

                {/* Chat Component */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', marginBottom: '1rem' }}>Message James</h2>
                    <ChatWidget jobUuid={uuid} jobId={job.id} initialMessages={initialMessages as any[]} userRole="CUSTOMER" />
                </div>

            </main>
        </div>
    )
}
