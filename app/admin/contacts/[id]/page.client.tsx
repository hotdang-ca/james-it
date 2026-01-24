'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreateJobModal from '@/components/admin/CreateJobModal'
import CreatePaymentModal from '@/components/admin/CreatePaymentModal'
import { deletePaymentRequest, markPaymentAsPaid } from '@/app/admin/actions/payment'
import { updateJobStatus } from '@/app/admin/actions/job'
import { useRouter } from 'next/navigation'

interface ContactDetailClientProps {
    contact: any
}

export default function ContactDetailClient({ contact }: ContactDetailClientProps) {
    const [isJobModalOpen, setIsJobModalOpen] = useState(false)
    const [paymentModalJobId, setPaymentModalJobId] = useState<string | null>(null)
    const router = useRouter()

    async function handleStatusChange(jobId: string, newStatus: string) {
        const res = await updateJobStatus(jobId, newStatus)
        if (!res.success) {
            alert('Error updating status: ' + res.error)
        } else {
            router.refresh()
        }
    }

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#64748B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    ← Back to Contacts
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>{contact.name}</h1>
                        <div style={{ color: '#64748B' }}>{contact.email}</div>
                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0', maxWidth: '600px' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: 600 }}>Message</div>
                            <div style={{ color: '#334155', lineHeight: '1.6' }}>{contact.message}</div>
                            {contact.service_interest && (
                                <div style={{ marginTop: '1rem' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        backgroundColor: '#EFF6FF',
                                        color: '#3B82F6',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        Interested in: {contact.service_interest}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsJobModalOpen(true)}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <span>+</span> Create Job
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>Jobs</h2>
                </div>

                <div>
                    {contact.jobs && contact.jobs.length > 0 ? (
                        contact.jobs.map((job: any) => (
                            <div key={job.id} style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '1.1rem' }}>
                                                {job.description || 'Untitled Job'}
                                            </span>
                                            <Link
                                                href={`/job/${job.id}`}
                                                target="_blank"
                                                style={{ fontSize: '0.75rem', color: '#3B82F6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            >
                                                Customer View ↗
                                            </Link>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                            Created: {new Date(job.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <select
                                        value={job.status}
                                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                        style={{
                                            padding: '0.5rem', borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1', backgroundColor: 'white', cursor: 'pointer',
                                            fontWeight: 500,
                                            color: job.status === 'COMPLETED' ? '#166534' : '#1E293B'
                                        }}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="SCHEDULED">SCHEDULED</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', flexWrap: 'wrap' }}>
                                    {/* Financials */}
                                    {(() => {
                                        const quoted = parseFloat(job.quoted_price) || 0;
                                        const paid = job.payment_requests?.filter((r: any) => r.status === 'PAID').reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0) || 0;
                                        const due = quoted - paid;
                                        const isFullyPaid = due <= 0.01;
                                        const isLegacyPaid = job.deposit_paid && (!job.payment_requests || job.payment_requests.length === 0);

                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Financials</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                                    <span style={{ color: '#64748B' }}>Quoted:</span>
                                                    <span style={{ fontWeight: 600 }}>${quoted.toFixed(2)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                                    <span style={{ color: '#64748B' }}>Paid:</span>
                                                    <span style={{ fontWeight: 600, color: '#166534' }}>${paid.toFixed(2)}</span>
                                                </div>
                                                {isLegacyPaid ? (
                                                    <div style={{ color: '#166534', fontWeight: 700, fontSize: '0.875rem', marginTop: '0.25rem' }}>LEGACY PAID</div>
                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                                                        <span style={{ color: '#64748B' }}>Due:</span>
                                                        <span style={{ fontWeight: 700, color: isFullyPaid ? '#166534' : '#DC2626' }}>
                                                            ${Math.max(0, due).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Payment Requests */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Payment Requests</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setPaymentModalJobId(job.id)}
                                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer' }}
                                                >
                                                    + Add Payment / Request
                                                </button>
                                            </div>
                                        </div>

                                        {job.payment_requests && job.payment_requests.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {job.payment_requests.map((req: any) => (
                                                    <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: req.status === 'PAID' ? '#F0FDF4' : 'white' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: 500, color: req.status === 'PAID' ? '#166534' : '#334155' }}>
                                                                    {req.description}
                                                                </span>
                                                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                                                    {req.payment_method === 'STRIPE' ? 'Stripe Link' : (req.payment_method?.replace(/_/g, ' ') || 'LEGACY')}
                                                                </div>
                                                            </div>
                                                            <span style={{ color: '#64748B', fontWeight: 600 }}>${req.amount}</span>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                            {req.status === 'PAID' ? (
                                                                <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.75rem', padding: '0.1rem 0.4rem', backgroundColor: '#DCFCE7', borderRadius: '4px' }}>PAID</span>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (confirm('Mark this payment as PAID manually?')) {
                                                                                await markPaymentAsPaid(req.id)
                                                                                router.refresh()
                                                                            }
                                                                        }}
                                                                        style={{ fontSize: '0.7rem', color: '#166534', cursor: 'pointer', border: '1px solid #86EFAC', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#F0FDF4' }}
                                                                        title="Mark as Paid"
                                                                    >
                                                                        Mark Paid
                                                                    </button>

                                                                    <span style={{ color: '#D97706', fontSize: '0.75rem', padding: '0.1rem 0.4rem', backgroundColor: '#FEF3C7', borderRadius: '4px' }}>PENDING</span>

                                                                    <button
                                                                        onClick={async () => {
                                                                            if (confirm('Delete this payment request?')) {
                                                                                await deletePaymentRequest(req.id)
                                                                                router.refresh()
                                                                            }
                                                                        }}
                                                                        style={{ color: '#EF4444', marginLeft: '0.5rem', cursor: 'pointer', border: 'none', background: 'none' }}
                                                                        title="Delete Request"
                                                                    >✕</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontStyle: 'italic', padding: '0.5rem 0' }}>No payment requests created.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                            No jobs found for this contact. Create one to get started.
                        </div>
                    )}
                </div>
            </div>

            <CreateJobModal
                contactId={contact.id}
                contactName={contact.name}
                isOpen={isJobModalOpen}
                onClose={() => {
                    setIsJobModalOpen(false)
                    router.refresh()
                }}
            />

            {paymentModalJobId && (
                <CreatePaymentModal
                    jobId={paymentModalJobId}
                    isOpen={!!paymentModalJobId}
                    onClose={() => {
                        setPaymentModalJobId(null)
                        router.refresh()
                    }}
                />
            )}
        </>
    )
}
