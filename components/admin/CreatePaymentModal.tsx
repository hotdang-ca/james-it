'use client'

import { useState } from 'react'
import { createPaymentRequest } from '@/app/admin/actions/payment'

interface CreatePaymentModalProps {
    targetId: string // jobId or invoiceId
    isInvoice?: boolean
    isOpen: boolean
    onClose: () => void
}

export default function CreatePaymentModal({ targetId, isInvoice = false, isOpen, onClose }: CreatePaymentModalProps) {
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('Balance Payment')
    const [method, setMethod] = useState('STRIPE')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        // Simple validation
        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount')
            setLoading(false)
            return
        }

        const res = await createPaymentRequest(targetId, parseFloat(amount), description, method, isInvoice)

        setLoading(false)
        if (res.success) {
            alert('Payment Request Created!')
            onClose()
        } else {
            alert('Error creating payment: ' + res.error)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60
        }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#1E293B', fontSize: '1.25rem', fontWeight: 700 }}>Add Payment Request</h2>

                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748B', fontSize: '0.875rem' }}>Payment Method</label>
                        <select
                            value={method}
                            onChange={e => setMethod(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', backgroundColor: 'white' }}
                        >
                            <option value="STRIPE">Stripe (Send Link)</option>
                            <option value="CASH">Cash (Received)</option>
                            <option value="E_TRANSFER_RECEIVED">E-Transfer (Received)</option>
                            <option value="E_TRANSFER_PENDING">E-Transfer (Pending Receipt)</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748B', fontSize: '0.875rem' }}>Amount ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748B', fontSize: '0.875rem' }}>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            placeholder="e.g. Deposit, Final Balance"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
