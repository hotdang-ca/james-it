'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreateJobModal from '@/components/admin/CreateJobModal'
import { generateJobPaymentLink } from '@/app/admin/actions/payment'
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

    async function handleGenerateLink(jobId: string) {
        setGeneratingPayment(jobId)
        const res = await generateJobPaymentLink(jobId)
        setGeneratingPayment(null)

        if (res.success) {
            alert('Payment Link Generated: ' + res.link)
            // The page will revalidate, so the UI should update automatically if we used router.refresh() or rely on revalidatePath
        } else {
            alert('Error: ' + res.error)
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
                                                            href={`/job/${job.customer_uuid}`}
                                                            target="_blank"
                                                            style={{
                                                                fontSize: '0.75rem', textDecoration: 'none', color: '#3B82F6', fontWeight: 500
                                                            }}
                                                            title="Customer View"
                                                        >
                                                            Open As Customer ↗
                                                        </Link>
                                                    </div>

                                                    {/* Payment Action */}
                                                    {!job.stripe_payment_link ? (
                                                        <button
                                                            onClick={() => handleGenerateLink(job.id)}
                                                            disabled={generatingPayment === job.id}
                                                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderRadius: '0.2rem', border: '1px solid #CBD5E1', cursor: 'pointer', backgroundColor: '#F1F5F9' }}
                                                        >
                                                            {generatingPayment === job.id ? '...' : '$ Link'}
                                                        </button>
                                                    ) : (
                                                        <span style={{ fontSize: '0.7rem', color: '#166534' }}>$ Active</span>
                                                    )}
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
