'use client'

import Link from 'next/link'

interface AdminContactsClientProps {
    initialContacts: any[]
}

export default function AdminContactsClient({ initialContacts }: AdminContactsClientProps) {

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Service</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Jobs</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialContacts.map((contact) => (
                            <tr key={contact.id} style={{ borderBottom: '1px solid #E2E8F0', cursor: 'pointer', transition: 'background-color 0.2s' }} className="hover:bg-slate-50">
                                <td style={{ padding: '1rem', color: '#64748B' }}>
                                    {new Date(contact.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500, color: '#1E293B' }}>
                                    <Link href={`/admin/contacts/${contact.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div>{contact.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748B' }}>{contact.email}</div>
                                    </Link>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {contact.service_interest ? (
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            backgroundColor: '#EFF6FF',
                                            color: '#3B82F6',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}>
                                            {contact.service_interest}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {contact.jobs && contact.jobs.length > 0 ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {contact.jobs.length} Job{contact.jobs.length === 1 ? '' : 's'}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <Link
                                        href={`/admin/contacts/${contact.id}`}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #E2E8F0',
                                            color: '#64748B',
                                            fontSize: '0.875rem',
                                            textDecoration: 'none',
                                            backgroundColor: 'white',
                                            fontWeight: 500
                                        }}
                                    >
                                        View Details
                                    </Link>
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
        </div>
    )
}
