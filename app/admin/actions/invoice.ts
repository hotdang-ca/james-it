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

    // 2. Link Jobs to Invoice
    const { error: jobsError } = await supabase
        .from('jobs')
        // @ts-ignore
        .update({ invoice_id: invoice.id })
        .in('id', jobIds)

    if (jobsError) {
        // Rollback? ideally yes, but for now just return error. 
        // Realistically we might want to delete the invoice if this fails.
        await supabase.from('invoices').delete().eq('id', invoice.id)
        return { success: false, error: jobsError.message }
    }

    revalidatePath(`/admin/contacts/${contactId}`)
    return { success: true, invoiceId: invoice.id }
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
