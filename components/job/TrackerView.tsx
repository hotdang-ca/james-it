'use client'

import ChatWidget from '@/components/ChatWidget'
import JobMapWrapper from '@/components/JobMapWrapper'

interface TrackerViewProps {
    job: any
    paymentRequests: any[]
    geoLogs: any[]
    initialMessages: any[]
    uuid: string
}

export default function TrackerView({ job, paymentRequests, geoLogs, initialMessages, uuid }: TrackerViewProps) {
    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '1.5rem' }}>

            {/* Status Card */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
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
                    </div>
                </div>

                {/* Payment Requests */}
                {paymentRequests && paymentRequests.length > 0 && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Payments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {paymentRequests.map((req: any) => (
                                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{req.description}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>${req.amount}</div>
                                    </div>
                                    <div>
                                        {req.status === 'PAID' ? (
                                            <div style={{
                                                display: 'inline-block',
                                                backgroundColor: '#DCFCE7',
                                                color: '#166534',
                                                fontWeight: 600,
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.8rem',
                                                border: '1px solid #86EFAC'
                                            }}>
                                                ✓ Paid
                                            </div>
                                        ) : (
                                            req.stripe_payment_link && (
                                                <a
                                                    href={req.stripe_payment_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-block',
                                                        backgroundColor: '#FF6B00',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        padding: '0.35rem 1rem',
                                                        borderRadius: '0.35rem',
                                                        textDecoration: 'none',
                                                        fontSize: '0.85rem',
                                                        boxShadow: '0 2px 4px rgba(255, 107, 0, 0.2)'
                                                    }}
                                                >
                                                    Pay ${req.amount}
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                <ChatWidget jobUuid={uuid} jobId={job.id} initialMessages={initialMessages} userRole="CUSTOMER" />
            </div>

        </main>
    )
}
