'use client'

import { useState } from 'react'
import TrackerView from '@/components/job/TrackerView'
import ReceiptView from '@/components/job/ReceiptView'
import PaymentVerifier from '@/components/PaymentVerifier'

interface JobPageClientProps {
    job: any
    paymentRequests: any[]
    geoLogs: any[]
    initialMessages: any[]
    uuid: string
    paymentSuccess: boolean
    paymentCancelled: boolean
    sessionId?: string
}

export default function JobPageClient({
    job,
    paymentRequests,
    geoLogs,
    initialMessages,
    uuid,
    paymentSuccess,
    paymentCancelled,
    sessionId
}: JobPageClientProps) {
    const [viewMode, setViewMode] = useState<'TRACKER' | 'RECEIPT'>('TRACKER')

    return (
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '1rem' }}>
            {/* Verify Payment Effect */}
            {paymentSuccess && sessionId && (
                <PaymentVerifier sessionId={sessionId} />
            )}

            <header style={{
                backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                maxWidth: '800px', margin: '0 auto 1.5rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 800, color: '#1E293B' }}>JAMES-IT</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Job #{job.created_at.slice(0, 10).replace(/-/g, '')}</div>
                </div>

                {/* View Toggle */}
                <div className="print:hidden" style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '0.5rem' }}>
                    <button
                        onClick={() => setViewMode('TRACKER')}
                        style={{
                            padding: '0.35rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                            backgroundColor: viewMode === 'TRACKER' ? 'white' : 'transparent',
                            color: viewMode === 'TRACKER' ? '#1E293B' : '#64748B',
                            boxShadow: viewMode === 'TRACKER' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        Track Job
                    </button>
                    <button
                        onClick={() => setViewMode('RECEIPT')}
                        style={{
                            padding: '0.35rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                            backgroundColor: viewMode === 'RECEIPT' ? 'white' : 'transparent',
                            color: viewMode === 'RECEIPT' ? '#1E293B' : '#64748B',
                            boxShadow: viewMode === 'RECEIPT' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        Receipt / Invoice
                    </button>
                </div>
            </header>

            {/* Notifications */}
            <div className="print:hidden" style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
                {paymentSuccess && (
                    <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #BBF7D0', fontWeight: 600, textAlign: 'center', marginBottom: '1rem' }}>
                        ✅ Payment Successful! Thank you.
                    </div>
                )}
                {paymentCancelled && (
                    <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #FECACA', fontWeight: 600, textAlign: 'center', marginBottom: '1rem' }}>
                        ⚠️ Payment Cancelled.
                    </div>
                )}
            </div>

            {viewMode === 'TRACKER' ? (
                <TrackerView
                    job={job}
                    paymentRequests={paymentRequests}
                    geoLogs={geoLogs}
                    initialMessages={initialMessages}
                    uuid={uuid}
                />
            ) : (
                <ReceiptView
                    job={job}
                    paymentRequests={paymentRequests}
                />
            )}

            <style jsx global>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    header { display: none !important; } /* Hide main app header, ReceiptView has its own */
                }
            `}</style>
        </div>
    )
}
