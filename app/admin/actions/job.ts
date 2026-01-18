'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { notificationService } from '@/lib/notifications/service'

export async function createJob(contactId: string, description: string, quotedPrice: number) {
    const supabase = await createClient()

    // 1. Fetch Contact Details for Notification
    const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .select('name, email')
        .eq('id', contactId)
        .single()

    if (contactError || !contact) {
        return { success: false, error: 'Contact not found' }
    }

    const contactData = contact as { name: string, email: string } // Explicit cast

    // 2. Create the job record. 
    // RLS allows insert for authenticated users (Admin).
    const { data: job, error } = await supabase
        .from('jobs')
        .insert({
            contact_id: contactId,
            description,
            quoted_price: quotedPrice,
            status: 'PENDING'
        } as any)
        .select()
        .single()

    if (error) {
        console.error('Create Job Error', error)
        return { success: false, error: error.message }
    }

    const jobData = job as any // Explicit cast to avoid 'never' on customer_uuid

    // 3. Trigger Notification
    await notificationService.sendMagicLink(contactData.email, jobData.customer_uuid, contactData.name)

    revalidatePath('/admin')
    return { success: true, data: job }
}

export async function updateJobStatus(jobId: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('jobs')
        // @ts-ignore
        .update({ status })
        .eq('id', jobId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}
