'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreateJobModal from '@/components/admin/CreateJobModal'
// Payment actions now imported dynamically
import { createPaymentRequest, deletePaymentRequest } from './actions/payment'
import { updateJobStatus } from '@/app/admin/actions/job'

interface AdminContactsClientProps {
    initialContacts: any[]
}

export default function AdminContactsClient({ initialContacts }: AdminContactsClientProps) {
    const [selectedContact, setSelectedContact] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [generatingPayment, setGeneratingPayment] = useState<string | null>(null)

    function handleCreateJob(contact: any) {
        setSelectedContact(contact)
        setIsModalOpen(true)
    }

    async function handleStatusChange(jobId: string, newStatus: string) {
        const res = await updateJobStatus(jobId, newStatus)
        if (!res.success) {
            alert('Error updating status: ' + res.error)
        }
    }

    return (
        <>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Details</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Jobs</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialContacts.map((contact) => (
                            <tr key={contact.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '1rem', color: '#64748B' }}>
                                    {new Date(contact.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500, color: '#1E293B' }}>
                                    {contact.name}
                                    <div style={{ fontSize: '0.875rem', color: '#64748B' }}>{contact.email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        backgroundColor: '#EFF6FF',
                                        color: '#3B82F6',
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}>
                                        {contact.service_interest}
                                    </span>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#475569', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {contact.message}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {contact.jobs && contact.jobs.length > 0 ? (
                                            contact.jobs.map((job: any) => (
                                                <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <select
                                                            value={job.status}
                                                            onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                                            style={{
                                                                fontSize: '0.75rem', padding: '0.2rem', borderRadius: '0.25rem',
                                                                border: '1px solid #CBD5E1', backgroundColor: 'white', cursor: 'pointer',
                                                                color: job.status === 'COMPLETED' ? '#166534' : '#1E293B'
                                                            }}
                                                        >
                                                            <option value="PENDING">PENDING</option>
                                                            <option value="SCHEDULED">SCHEDULED</option>
                                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                            <option value="COMPLETED">COMPLETED</option>
                                                            <option value="CANCELLED">CANCELLED</option>
                                                        </select>

                                                        <Link
                                                            href={`/job/${job.id}`}
                                                            target="_blank"
                                                            style={{
                                                                fontSize: '0.75rem', textDecoration: 'none', color: '#3B82F6', fontWeight: 500
                                                            }}
                                                            title="Customer View"
                                                        >
                                                            Open As Customer ↗
                                                        </Link>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                                                        {(() => {
                                                            const quoted = parseFloat(job.quoted_price) || 0;
                                                            const paid = job.payment_requests?.filter((r: any) => r.status === 'PAID').reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0) || 0;
                                                            // Legacy support: if job.deposit_paid is true and no paid requests, assume FULL quoted price was paid via legacy method? 
                                                            // Or maybe just the deposit? Let's assume deposit_paid means fully settled if no specific requests exist, 
                                                            // OR we rely strictly on payment_requests + the legacy flag as a visual marker.
                                                            // For now, let's just sum payment_requests.
                                                            // Actually, if legacy deposit_paid is true, we should probably count it as 'settled' visually, but let's stick to math.

                                                            const due = quoted - paid;
                                                            const isFullyPaid = due <= 0.01; // tolerance
                                                            const isLegacyPaid = job.deposit_paid && (!job.payment_requests || job.payment_requests.length === 0);

                                                            return (
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.7rem', marginRight: '0.5rem' }}>
                                                                    <div title="Quoted Price">
                                                                        <span style={{ color: '#64748B' }}>Quoted:</span>
                                                                        <span style={{ fontWeight: 600, marginLeft: '2px' }}>${quoted.toFixed(2)}</span>
                                                                    </div>
                                                                    <div title="Total Paid via Stripe/Cash/etc">
                                                                        <span style={{ color: '#64748B' }}>Paid:</span>
                                                                        <span style={{ fontWeight: 600, color: '#166534', marginLeft: '2px' }}>${paid.toFixed(2)}</span>
                                                                    </div>
                                                                    {isLegacyPaid ? (
                                                                        <div style={{ color: '#166534', fontWeight: 700 }}>LEGACY PAID</div>
                                                                    ) : (
                                                                        <div title="Remaining Balance">
                                                                            <span style={{ color: '#64748B' }}>Due:</span>
                                                                            <span style={{ fontWeight: 700, color: isFullyPaid ? '#166534' : '#DC2626', marginLeft: '2px' }}>
                                                                                ${Math.max(0, due).toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Payment Requests Section */}
                                                    <div style={{ marginTop: '0.5rem' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.25rem' }}>PAYMENTS</div>

                                                        {/* Existing Requests */}
                                                        {job.payment_requests && job.payment_requests.length > 0 ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                                                {job.payment_requests.map((req: any) => (
                                                                    <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.2rem 0.4rem', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: req.status === 'PAID' ? '#F0FDF4' : 'white' }}>
                                                                        <span style={{ color: req.status === 'PAID' ? '#166534' : '#334155' }}>
                                                                            {req.description} (${req.amount})
                                                                        </span>
                                                                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                                                            {req.status === 'PAID' ? (
                                                                                <span style={{ fontWeight: 700, color: '#166534' }}>PAID</span>
                                                                            ) : (
                                                                                <>
                                                                                    <span style={{ color: '#F59E0B' }}>PENDING</span>
                                                                                    <button
                                                                                        onClick={async () => {
                                                                                            if (confirm('Delete this payment request?')) {
                                                                                                await deletePaymentRequest(req.id)
                                                                                            }
                                                                                        }}
                                                                                        style={{ color: '#EF4444', marginLeft: '0.25rem' }}
                                                                                    >✕</button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontStyle: 'italic', marginBottom: '0.5rem' }}>No payment requests yet.</div>
                                                        )}

                                                        {/* Actions */}
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm(`Request $29 Deposit for "${job.description || 'Service'}"?`)) {
                                                                        setGeneratingPayment(job.id)
                                                                        await createPaymentRequest(job.id, 29, "Initial Deposit")
                                                                        setGeneratingPayment(null)
                                                                    }
                                                                }}
                                                                disabled={generatingPayment === job.id}
                                                                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer' }}
                                                            >
                                                                +$29 Deposit
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    const amountStr = prompt("Enter amount (e.g. 50):")
                                                                    if (!amountStr) return
                                                                    const amount = parseFloat(amountStr)
                                                                    const desc = prompt("Description:", "Balance Payment") || "Balance Payment"

                                                                    if (amount > 0) {
                                                                        setGeneratingPayment(job.id)
                                                                        await createPaymentRequest(job.id, amount, desc)
                                                                        setGeneratingPayment(null)
                                                                    }
                                                                }}
                                                                disabled={generatingPayment === job.id}
                                                                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'white', color: '#3B82F6', border: '1px solid #3B82F6', cursor: 'pointer' }}
                                                            >
                                                                + Custom
                                                            </button>

                                                            {/* Legacy Manual Toggle (Optional: Can remove or keep for older records support) */}
                                                            {job.deposit_paid && !job.payment_requests?.length && (
                                                                <span style={{ fontSize: '0.7rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.2rem 0.4rem', borderRadius: '4px', marginLeft: 'auto' }}>
                                                                    Legacy Job Paid
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No jobs</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleCreateJob(contact)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        Create Job
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {initialContacts.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                                    No contacts found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedContact && (
                <CreateJobModal
                    contactId={selectedContact.id}
                    contactName={selectedContact.name}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}
