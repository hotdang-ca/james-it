'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CreatePaymentModal from '@/components/admin/CreatePaymentModal'
import { deletePaymentRequest, markPaymentAsPaid } from '@/app/admin/actions/payment'
import { deleteInvoice } from '@/app/admin/actions/invoice'

interface InvoiceDetailClientProps {
    invoice: any
}

export default function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const router = useRouter()

    const jobsTotal = invoice.jobs?.reduce((sum: number, job: any) => sum + (parseFloat(job.quoted_price) || 0), 0) || 0

    // Calculate all payments (Invoice-level + Job-level PAID)
    const invoiceRequests = invoice.payment_requests || []
    const jobPaidRequests = invoice.jobs?.flatMap((j: any) => j.payment_requests || []).filter((r: any) => r.status === 'PAID') || []

    const allRequestsToShow = [...invoiceRequests, ...jobPaidRequests].filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.id === v.id) === i)
    allRequestsToShow.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const paidTotal = allRequestsToShow.filter((r: any) => r.status === 'PAID').reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0) || 0

    const balanceDue = jobsTotal - paidTotal
    const isFullyPaid = balanceDue <= 0.01

    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invoice/${invoice.id}`

    async function handleDelete() {
        if (confirm('Are you sure you want to delete this invoice? Jobs will be unlinked but not deleted.')) {
            const res = await deleteInvoice(invoice.id)
            if (res.success) {
                router.push(`/admin/contacts/${invoice.contact_id}`)
            } else {
                alert('Error deleting invoice: ' + res.error)
            }
        }
    }

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/admin/contacts/${invoice.contact_id}`} style={{ color: '#64748B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    ← Back to Contact
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1E293B', marginBottom: 0 }}>Invoice</h1>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                backgroundColor: isFullyPaid ? '#DCFCE7' : '#EFF6FF',
                                color: isFullyPaid ? '#166534' : '#1E40AF'
                            }}>
                                {isFullyPaid ? 'PAID' : invoice.status}
                            </span>
                        </div>
                        <div style={{ color: '#64748B', fontSize: '1.1rem' }}>{invoice.description}</div>
                        <div style={{ marginTop: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                            Created: {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <a
                            href={`/invoice/${invoice.id}`}
                            target="_blank"
                            className="btn"
                            style={{
                                padding: '0.75rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'white',
                                border: '1px solid #CBD5E1',
                                borderRadius: '0.375rem',
                                color: '#1E293B',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            Open Customer View ↗
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(magicLink)
                                alert('Link copied to clipboard!')
                            }}
                            style={{ fontSize: '0.875rem', color: '#3B82F6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Copy Magic Link
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{ fontSize: '0.875rem', color: '#EF4444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem' }}
                        >
                            Delete Invoice
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                {/* Left Column: Jobs */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>Included Jobs</h2>
                    </div>
                    <div>
                        {invoice.jobs && invoice.jobs.map((job: any) => (
                            <div key={job.id} style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{job.description}</div>
                                    <div style={{ fontWeight: 600 }}>${(parseFloat(job.quoted_price) || 0).toFixed(2)}</div>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                    Job ID: <Link href={`/job/${job.id}`} target="_blank" style={{ color: '#3B82F6' }}>{job.id.slice(0, 8)}...</Link>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                    Date: {new Date(job.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1E293B' }}>
                            <span>Total Quoted</span>
                            <span>${jobsTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payments & Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Summary Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', marginBottom: '1.5rem' }}>Summary</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#64748B' }}>
                            <span>Subtotal</span>
                            <span>${jobsTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#166534', fontWeight: 600 }}>
                            <span>Paid</span>
                            <span>-${paidTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: isFullyPaid ? '#166534' : '#1E293B' }}>
                            <span>{isFullyPaid ? 'Paid in Full' : 'Balance Due'}</span>
                            <span>${Math.max(0, balanceDue).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payments List */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>Payments</h2>
                            {!isFullyPaid && (
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '4px', backgroundColor: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    + Add
                                </button>
                            )}
                        </div>
                        <div>
                            {allRequestsToShow.length > 0 ? (
                                allRequestsToShow.map((req: any) => (
                                    <div key={req.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <div style={{ fontWeight: 600, color: req.status === 'PAID' ? '#166534' : '#334155' }}>${req.amount}</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.1rem 0.5rem', borderRadius: '999px', backgroundColor: req.status === 'PAID' ? '#DCFCE7' : '#FEF3C7', color: req.status === 'PAID' ? '#166534' : '#D97706' }}>
                                                {req.status}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.5rem' }}>
                                            {req.invoice_id ? '' : <strong>(Job) </strong>}
                                            {req.description}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{req.payment_method === 'STRIPE' ? 'Stripe' : 'Manual'} • {new Date(req.created_at).toLocaleDateString()}</span>

                                            {req.status !== 'PAID' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Mark PAID?')) {
                                                                await markPaymentAsPaid(req.id)
                                                                router.refresh()
                                                            }
                                                        }}
                                                        style={{ color: '#166534', cursor: 'pointer', border: 'none', background: 'none' }}
                                                    >
                                                        Mark Paid
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Delete?')) {
                                                                await deletePaymentRequest(req.id)
                                                                router.refresh()
                                                            }
                                                        }}
                                                        style={{ color: '#EF4444', cursor: 'pointer', border: 'none', background: 'none' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '1.5rem', color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' }}>No payments yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreatePaymentModal
                targetId={invoice.id}
                isInvoice={true}
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false)
                    router.refresh()
                }}
            />
        </>
    )
}
