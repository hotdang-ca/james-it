'use client'

interface ReceiptViewProps {
    job: any
    paymentRequests: any[]
}

export default function ReceiptView({ job, paymentRequests }: ReceiptViewProps) {
    const quoted = parseFloat(job.quoted_price) || 0;
    const paid = paymentRequests?.filter((r: any) => r.status === 'PAID').reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0) || 0;
    const due = quoted - paid;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minHeight: '800px', color: '#1E293B' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>JAMES-IT</h1>
                    <div style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                        Wpg, MB<br />
                        Winnipeg, Manitoba<br />
                        james@james-it.ca
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '1rem' }}>RECEIPT / INVOICE</h2>
                    <div style={{ color: '#64748B', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 600 }}>Date:</span>
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <span style={{ fontWeight: 600 }}>Job #:</span>
                            <span>{job.created_at.slice(0, 10).replace(/-/g, '')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bill To</h3>
                <div style={{ fontWeight: 600 }}>{job.customer_name || 'Customer'}</div>
                <div style={{ color: '#64748B' }}>{job.customer_email || ''}</div>
            </div>

            {/* Line Items */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                        <th style={{ textAlign: 'left', padding: '1rem 0', color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>DESCRIPTION</th>
                        <th style={{ textAlign: 'right', padding: '1rem 0', color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '1.5rem 0' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{job.description || 'Service Request'}</div>
                            <div style={{ color: '#64748B', fontSize: '0.875rem' }}>Job ID: {job.id}</div>
                        </td>
                        <td style={{ textAlign: 'right', padding: '1.5rem 0', fontWeight: 600 }}>${quoted.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                <div style={{ minWidth: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                        <span>Subtotal</span>
                        <span>${quoted.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E2E8F0', color: '#166534', fontWeight: 600 }}>
                        <span>Paid to Date</span>
                        <span>-${paid.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#1E293B' }}>
                        <span>Balance Due</span>
                        <span>${Math.max(0, due).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            {paymentRequests && paymentRequests.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '1rem' }}>Payment History</h3>
                    <div style={{ fontSize: '0.875rem' }}>
                        {paymentRequests.filter((r: any) => r.status === 'PAID').map((req: any) => (
                            <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F1F5F9' }}>
                                <div>
                                    <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{new Date(req.created_at).toLocaleDateString()}</span>
                                    <span style={{ color: '#64748B' }}>{req.description} ({req.payment_method === 'STRIPE' ? 'Credit Card' : req.payment_method?.replace('_', ' ') || 'Manual'})</span>
                                </div>
                                <div style={{ fontWeight: 600 }}>${req.amount}</div>
                            </div>
                        ))}
                        {paymentRequests.filter((r: any) => r.status === 'PAID').length === 0 && (
                            <div style={{ fontStyle: 'italic', color: '#94A3B8' }}>No payments recorded yet.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="print-hidden" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px dashed #CBD5E1', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                    onClick={() => window.print()}
                    style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                    🖨 Print / Save as PDF
                </button>

                {/* Show Pending Payment Links */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {paymentRequests?.filter((r: any) => r.status !== 'PAID' && r.stripe_payment_link).map((req: any) => (
                        <a
                            key={req.id}
                            href={req.stripe_payment_link}
                            target="_blank"
                            style={{
                                backgroundColor: '#1E293B', color: 'white', padding: '0.75rem 1.5rem',
                                borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem'
                            }}
                        >
                            Pay Balance (${req.amount})
                        </a>
                    ))}
                </div>
            </div>

            {/* Styles are now handled globally, but keeping scoped override if needed */}
        </div>
    )
}
