'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useRef } from 'react'
import ChatWidget from '@/components/ChatWidget'

export default function AdminTrackingPage() {
    const [isTracking, setIsTracking] = useState(false)
    const [status, setStatus] = useState('Idle')
    const [lastPosition, setLastPosition] = useState<{ lat: number; lng: number, timestamp: string } | null>(null)
    const [activeJobId, setActiveJobId] = useState<string>('')
    const [jobs, setJobs] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const watchId = useRef<number | null>(null)
    const supabase = createClient()

    // Fetch active jobs (NOT CANCELLED/COMPLETED)
    useEffect(() => {
        const fetchJobs = async () => {
            const { data } = await supabase
                .from('jobs')
                .select('id, description, customer_uuid, status')
                .in('status', ['IN_PROGRESS', 'PENDING', 'SCHEDULED'])

            if (data && data.length > 0) {
                setJobs(data)
            }
        }
        fetchJobs()
    }, [])

    // Fetch messages when active job changes
    useEffect(() => {
        if (!activeJobId || activeJobId === '') return

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('job_id', activeJobId)
                .order('created_at', { ascending: true })

            console.log('Fetched messages for job:', activeJobId)
            if (data) setMessages(data)
        }
        fetchMessages()
    }, [activeJobId])

    const startTracking = () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser')
            return
        }

        if (!activeJobId) {
            setStatus('No active IN_PROGRESS job selected. Cannot track.')
            return
        }

        setIsTracking(true)
        setStatus('Tracking started...')

        // Use watchPosition for real-time updates
        watchId.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const timestamp = new Date().toISOString()

                setLastPosition({ lat: latitude, lng: longitude, timestamp })
                setStatus(`Location updated at ${new Date().toLocaleTimeString()}`)

                // Write to Supabase
                const { error } = await supabase
                    .from('geolocation_logs')
                    // @ts-ignore
                    .insert({
                        job_id: activeJobId,
                        latitude,
                        longitude,
                        created_at: timestamp
                    })

                if (error) {
                    console.error('Error logging location:', error)
                    setStatus('Error logging location to DB')
                }
            },
            (error) => {
                console.error('Geo Error:', error)
                setStatus(`Error: ${error.message}`)
                setIsTracking(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
    }

    const stopTracking = () => {
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current)
            watchId.current = null
        }
        setIsTracking(false)
        setStatus('Tracking stopped')
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '1.5rem' }}>Active Jobs & Tracking</h1>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Job</label>
                {jobs.length > 0 ? (
                    <select
                        value={activeJobId}
                        onChange={(e) => {
                            setActiveJobId(e.target.value)
                            setMessages([])
                        }}
                        disabled={isTracking}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                    >
                        <option value="">-- Select a job --</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>
                                {job.description} ({job.status})
                            </option>
                        ))}
                    </select>
                ) : (
                    <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F9', borderRadius: '0.5rem', color: '#64748B' }}>
                        No active jobs found.
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        disabled={!activeJobId || jobs.find(j => j.id === activeJobId)?.status !== 'IN_PROGRESS'}
                        style={{
                            backgroundColor: (activeJobId && jobs.find(j => j.id === activeJobId)?.status === 'IN_PROGRESS') ? '#166534' : '#94A3B8',
                            color: 'white', padding: '1rem 2rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 600, border: 'none',
                            cursor: (activeJobId && jobs.find(j => j.id === activeJobId)?.status === 'IN_PROGRESS') ? 'pointer' : 'not-allowed',
                            boxShadow: '0 4px 6px rgba(22, 101, 52, 0.2)'
                        }}
                        title={jobs.find(j => j.id === activeJobId)?.status !== 'IN_PROGRESS' ? 'Job must be IN_PROGRESS to broadcast' : ''}
                    >
                        Start Broadcasting
                    </button>
                ) : (
                    <button
                        onClick={stopTracking}
                        style={{
                            backgroundColor: '#DC2626',
                            color: 'white', padding: '1rem 2rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)'
                        }}
                    >
                        Stop Broadcasting
                    </button>
                )}
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Status: <span style={{ color: isTracking ? '#166534' : '#64748B' }}>{status}</span></div>
                {lastPosition && (
                    <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                        <div>Lat: {lastPosition.lat.toFixed(6)}</div>
                        <div>Lng: {lastPosition.lng.toFixed(6)}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem' }}>Last Update: {new Date(lastPosition.timestamp).toLocaleTimeString()}</div>
                    </div>
                )}
            </div>

            {activeJobId && jobs.find(j => j.id === activeJobId) && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', marginBottom: '1rem' }}>Customer Chat</h2>
                    <ChatWidget
                        key={activeJobId}
                        jobId={activeJobId}
                        jobUuid={activeJobId}
                        initialMessages={messages}
                        userRole="ADMIN"
                    />
                </div>
            )}
        </div>
    )
}
