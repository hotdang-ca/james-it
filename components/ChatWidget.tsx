'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage, uploadFile } from '@/app/job/actions'
import imageCompression from 'browser-image-compression'
import { FaPaperclip, FaFileDownload, FaSpinner, FaTimes } from 'react-icons/fa'

interface Message {
    id: string
    content: string
    sender_role: string
    created_at: string
    attachment_url?: string | null
    attachment_type?: string | null
    attachment_name?: string | null
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
    const [attachedFile, setAttachedFile] = useState<File | null>(null)
    const [compressing, setCompressing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [supabase] = useState(() => createClient())

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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]

            if (file.type.startsWith('image/')) {
                setCompressing(true)
                try {
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    }
                    const compressedFile = await imageCompression(file, options)
                    // Create a new file with original name to avoid blob naming issues if needed
                    const finalFile = new File([compressedFile], file.name, { type: file.type })
                    setAttachedFile(finalFile)
                } catch (error) {
                    console.error('Compression error:', error)
                    setAttachedFile(file) // Fallback to original
                } finally {
                    setCompressing(false)
                }
            } else {
                setAttachedFile(file)
            }
        }
    }

    const removeAttachment = () => {
        setAttachedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!newMessage.trim() && !attachedFile) return

        const content = newMessage
        const fileToSend = attachedFile

        // Optimistic clear
        setNewMessage('')
        setAttachedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''

        setSending(true)

        let attachmentUrl = undefined
        let attachmentType = undefined
        let attachmentName = undefined

        if (fileToSend) {
            const formData = new FormData()
            formData.append('file', fileToSend)
            const uploadRes = await uploadFile(formData)

            if (uploadRes.success) {
                attachmentUrl = uploadRes.url
                attachmentType = uploadRes.type?.startsWith('image/') ? 'image' : 'file'
                attachmentName = uploadRes.name
            } else {
                alert('Failed to upload file')
                setSending(false)
                // Restore state could be complex here, maybe just fail purely
                return
            }
        }

        const result = await sendMessage(jobUuid, content || (attachmentUrl ? 'Sent an attachment' : ''), userRole, attachmentUrl, attachmentType, attachmentName)
        setSending(false)

        if (!result.success) {
            alert('Failed to send message')
            setNewMessage(content) // Restore
            setAttachedFile(fileToSend)
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
                                {msg.attachment_url && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        {msg.attachment_type === 'image' ? (
                                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={msg.attachment_url}
                                                    alt="Attachment"
                                                    style={{ maxWidth: '100%', borderRadius: '0.5rem', maxHeight: '200px', objectFit: 'cover' }}
                                                />
                                            </a>
                                        ) : (
                                            <a
                                                href={msg.attachment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isMe ? 'white' : '#2563EB', textDecoration: 'none', background: 'rgba(0,0,0,0.05)', padding: '0.5rem', borderRadius: '0.5rem' }}
                                            >
                                                <FaFileDownload />
                                                <span style={{ fontSize: '0.85rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {msg.attachment_name || 'Download File'}
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                {attachedFile && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.85rem' }}>
                        <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {compressing ? 'Compressing...' : attachedFile.name}
                        </span>
                        <button type="button" onClick={removeAttachment} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                            <FaTimes />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        style={{
                            cursor: 'pointer',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B'
                        }}
                    >
                        <FaPaperclip />
                    </label>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', outline: 'none' }}
                        disabled={sending || compressing}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ padding: '0 1.5rem', borderRadius: '0.5rem', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        disabled={sending || compressing}
                    >
                        {sending ? <FaSpinner className="animate-spin" /> : 'Send'}
                    </button>
                </form>
            </div>
        </div >
    )
}
