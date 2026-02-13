'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvoice(contactId: string, jobIds: string[], dueDate?: string, description?: string) {
    const supabase = await createClient()

    // 1. Create Invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        // @ts-ignore
        .insert({
            contact_id: contactId,
            due_date: dueDate,
            description: description,
            status: 'DRAFT'
        })
        .select()
        .single()

    if (invoiceError) {
        return { success: false, error: invoiceError.message }
    }

    const newInvoice: any = invoice

    // 2. Link Jobs to Invoice
    const { error: jobsError } = await supabase
        .from('jobs')
        // @ts-ignore
        .update({ invoice_id: newInvoice.id })
        .in('id', jobIds)

    if (jobsError) {
        // Rollback? ideally yes, but for now just return error. 
        // Realistically we might want to delete the invoice if this fails.
        await supabase.from('invoices').delete().eq('id', newInvoice.id)
        return { success: false, error: jobsError.message }
    }

    revalidatePath(`/admin/contacts/${contactId}`)

    // 3. Send Notification
    // Fetch Contact & Jobs to get details for email
    const { data: contactRaw } = await supabase.from('contacts').select('name, email').eq('id', contactId).single()
    const { data: jobsRaw } = await supabase.from('jobs').select('quoted_price').in('id', jobIds)

    const contact: any = contactRaw
    const jobs: any = jobsRaw

    if (contact && contact.email && jobs) {
        const totalAmount = jobs.reduce((sum: number, job: any) => sum + (job.quoted_price || 0), 0)
        const { notificationService } = await import('@/lib/notifications/service')

        // @ts-ignore
        await notificationService.notificationService.sendInvoice(contact.email, newInvoice.id, contact.name, totalAmount)
    }

    return { success: true, invoiceId: newInvoice.id }
}

export async function getInvoice(invoiceId: string) {
    const supabase = await createClient()

    const { data: invoice, error } = await supabase
        .from('invoices')
        .select(`
            *,
            contact:contacts(*),
            jobs(*, payment_requests(*)),
            payment_requests(*)
        `)
        .eq('id', invoiceId)
        .single()

    if (error) {
        return null
    }

    return invoice
}

export async function deleteInvoice(invoiceId: string) {
    const supabase = await createClient()

    // 1. Unlink jobs (Supabase set null on delete cascade might handle this if configured, 
    // but our schema said ON DELETE SET NULL for the FK, so deleting invoice sets job.invoice_id to null automatically.
    // However, explicit update is safer if we want to be sure before deleting.)

    // Actually, SQL `ON DELETE SET NULL` handles it. 
    // We just delete the invoice.

    const { error } = await supabase.from('invoices').delete().eq('id', invoiceId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function getInvoicesForContact(contactId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}
