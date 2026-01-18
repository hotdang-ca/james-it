'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage } from '@/app/job/actions'

interface Message {
    id: string
    content: string
    sender_role: string
    created_at: string
}

interface ChatWidgetProps {
    jobUuid: string
    jobId: string
    initialMessages: any[]
    userRole: 'CUSTOMER' | 'ADMIN' // New prop
}

export default function ChatWidget({ jobUuid, jobId, initialMessages, userRole }: ChatWidgetProps) {
    const [messages, setMessages] = useState<any[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        // Scroll to bottom on load and new messages
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages])

    useEffect(() => {
        // Realtime Subscription
        const channel = supabase
            .channel('chat-room')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `job_id=eq.${jobId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message
                    setMessages((current) => {
                        if (current.find(m => m.id === newMsg.id)) return current
                        return [...current, newMsg]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [jobId, supabase])

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!newMessage.trim()) return

        const content = newMessage
        setNewMessage('') // Optimistic clear
        setSending(true)

        // Optimistic UI update (optional, but Realtime is fast so maybe skip for simplicity/accuracy)
        // We will wait for Realtime to push it back to us or the revalidation. 
        // Actually, Realtime is best source of truth.

        const result = await sendMessage(jobUuid, content, userRole)
        setSending(false)

        if (!result.success) {
            alert('Failed to send message')
            setNewMessage(content) // Restore
        } else {
            // Force cast to avoid strict union type issues with 'data' property
            const res = result as any
            if (res.data) {
                setMessages((current) => {
                    // Deduplicate just in case Realtime arrived first (rare since we await)
                    if (current.find(m => m.id === res.data.id)) return current
                    return [...current, res.data]
                })
            }
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '2rem' }}>No messages yet. Start the conversation!</div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.sender_role === userRole
                    return (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
                            <div style={{
                                maxWidth: '75%',
                                padding: '0.75rem 1rem',
                                borderRadius: '1rem',
                                backgroundColor: isMe ? '#FF6B00' : 'white',
                                color: isMe ? 'white' : '#1E293B',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                borderTopRightRadius: isMe ? '0' : '1rem',
                                borderTopLeftRadius: isMe ? '1rem' : '0'
                            }}>
                                <div style={{ fontSize: '0.95rem' }}>{msg.content}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0 1.5rem', borderRadius: '0.5rem' }}
                    disabled={sending}
                >
                    {sending ? '...' : 'Send'}
                </button>
            </form>
        </div>
    )
}
