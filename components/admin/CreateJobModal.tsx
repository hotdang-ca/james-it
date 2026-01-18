'use client'

import { useState } from 'react'
import { createJob } from '@/app/admin/actions/job'

interface CreateJobModalProps {
    contactId: string
    contactName: string
    isOpen: boolean
    onClose: () => void
}

export default function CreateJobModal({ contactId, contactName, isOpen, onClose }: CreateJobModalProps) {
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        // Simple validation
        if (!description || !price) return

        const res = await createJob(contactId, description, parseFloat(price))

        setLoading(false)
        if (res.success) {
            alert('Job Created! Magic Link generated.')
            onClose()
            // Ideally trigger a toast or refresh
        } else {
            alert('Error creating job: ' + res.error)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ marginBottom: '1rem', color: '#1E293B' }}>New Job for {contactName}</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748B' }}>Job Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            rows={4}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748B' }}>Quoted Price ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Creating...' : 'Create Job'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
