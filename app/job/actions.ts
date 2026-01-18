'use server'

import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'

type Job = Database['public']['Tables']['jobs']['Row']
type Message = Database['public']['Tables']['messages']['Row']
type GeoLog = Database['public']['Tables']['geolocation_logs']['Row']

export async function getJobByUuid(uuid: string): Promise<Job | null> {
    const supabase = await createClient()

    // RPC return type inference can be tricky. We cast to unknown -> Job for safety.
    // @ts-ignore
    const { data, error } = await supabase.rpc('get_job_by_uuid', { job_uuid: uuid }).single()

    if (error) {
        console.error('Error fetching job:', error)
        return null
    }
    return data as unknown as Job
}

export async function getJobMessages(uuid: string): Promise<Message[]> {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await supabase.rpc('get_job_messages', { job_uuid: uuid })

    if (error) {
        console.error('Error fetching messages:', error)
        return []
    }
    return (data as unknown as Message[]) || []
}

export async function getJobGeolocation(uuid: string): Promise<GeoLog[]> {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await supabase.rpc('get_job_geolocation', { job_uuid: uuid })

    if (error) {
        console.error('Error fetching geo:', error)
        return []
    }
    return (data as unknown as GeoLog[]) || []
}

export async function sendMessage(jobUuid: string, content: string, senderRole: 'CUSTOMER' | 'ADMIN') {
    const supabase = await createClient()

    // 1. Verify existence and get ID
    const job = await getJobByUuid(jobUuid)
    if (!job) return { success: false, error: 'Invalid Job UUID' }

    // 2. Insert Message
    const { data, error } = await supabase
        .from('messages')
        .insert({
            job_id: job.id,
            sender_role: senderRole,
            content,
            is_read: false
        } as any)
        .select()
        .single()

    if (error) {
        console.error('Send Message Error:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data }
}
