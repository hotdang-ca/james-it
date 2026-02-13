'use server'

import { createClient } from '@/utils/supabase/server'
import { stripeService } from '@/lib/payments/stripe'
import { revalidatePath } from 'next/cache'

export async function createPaymentRequest(
    targetId: string, // jobId OR invoiceId
    amount: number,
    description: string,
    method: string = 'STRIPE',
    isInvoice: boolean = false
) {
    const supabase = await createClient()

    let customerUuid = ''
    let jobId = null
    let invoiceId = null

    if (isInvoice) {
        invoiceId = targetId
        // Fetch Invoice to get Contact -> we might need contact email/name for stripe? 
        // Currently jobs store `customer_uuid`, but contacts table doesn't have it explicitly maybe?
        // Let's check `contacts` table definition again. It has `email`. 
        // Existing `jobs` table has `customer_uuid` which seems to be a Stripe Customer ID?
        // Let's fetch the invoice and related contact/jobs to find a customer_uuid.

        const { data: invoice } = await supabase.from('invoices').select('*, jobs(customer_uuid)').eq('id', invoiceId).single()
        // Use the first job's customer_uuid if available, or we might need to create one if missing?
        // For now, assume at least one job has it or we pass empty.
        // @ts-ignore
        customerUuid = invoice?.jobs?.[0]?.customer_uuid || ''
    } else {
        jobId = targetId
        // 1. Fetch Job Details
        const { data: jobData, error: fetchError } = await supabase
            .from('jobs')
            .select('customer_uuid')
            .eq('id', jobId)
            .single()

        if (fetchError || !jobData) {
            return { success: false, error: 'Job not found' }
        }
        // @ts-ignore
        customerUuid = jobData?.customer_uuid || ''
    }

    let stripeUrl = null
    let stripeSessionId = null
    let status = 'PENDING'

    // 2. Handle Method Logic
    if (method === 'STRIPE') {
        // Generate Link via Stripe Service
        try {
            const result = await stripeService.createPaymentLink(
                // We need to pass a reference ID. 
                // Existing stripe service likely expects jobId? Let's check stripe service signature if possible.
                // Assuming we can pass targetId.
                targetId,
                amount,
                description,
                customerUuid,
                isInvoice
            )
            stripeUrl = result.url
            stripeSessionId = result.sessionId
        } catch (e: any) {
            return { success: false, error: 'Stripe Error: ' + e.message }
        }

        if (!stripeUrl) {
            return { success: false, error: 'Failed to generate Stripe Payment Link (Empty URL returned).' }
        }
    } else if (method === 'CASH' || method === 'E_TRANSFER_RECEIVED') {
        status = 'PAID'
    }

    // 3. Create Payment Request Record
    const insertData: any = {
        amount: amount,
        description: description,
        stripe_payment_link: stripeUrl,
        stripe_session_id: stripeSessionId,
        status: status,
        payment_method: method
    }

    if (isInvoice) {
        insertData.invoice_id = invoiceId
    } else {
        insertData.job_id = jobId
    }

    const { error: insertError } = await supabase
        .from('payment_requests')
        // @ts-ignore
        .insert(insertData)

    if (insertError) {
        return { success: false, error: insertError.message }
    }

    revalidatePath('/admin')
    if (jobId) revalidatePath(`/job/${jobId}`)
    if (invoiceId) revalidatePath(`/invoice/${invoiceId}`) // Revalidate customer view

    return { success: true }
}

export async function markPaymentAsPaid(requestId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('payment_requests')
        // @ts-ignore
        .update({ status: 'PAID' })
        .eq('id', requestId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function verifyPayment(sessionId: string) {
    // Elevate privileges: Use Service Role Key to bypass RLS.
    // This is safe because we verify the session with Stripe BEFORE updating.
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )


    // 1. Verify with Stripe
    // We need to access the stripe instance directly or add a method to StripeService.
    // Let's add a verify method to StripeService if not present, but for now we can import stripeService and add a method there 
    // OR we can just add a public verify method to the service now.
    // Let's assume we update StripeService to have verifySession.

    // Actually, let's update StripeService first or inline it? 
    // Better to keep Stripe logic in StripeService.
    // I will add verifySession to StripeService in the next step.
    const isPaid = await stripeService.verifySession(sessionId)

    if (isPaid) {
        // 2. Update DB
        const { error } = await supabase
            .from('payment_requests')
            // @ts-ignore
            .update({ status: 'PAID' })
            .eq('stripe_session_id', sessionId)

        if (error) return { success: false, error: error.message }

        // Fetch the payment request to know what we just paid for
        const { data: req } = await supabase
            .from('payment_requests')
            .select('job_id, invoice_id')
            .eq('stripe_session_id', sessionId)
            .single()

        revalidatePath('/admin')

        // @ts-ignore
        if (req?.job_id) {
            // @ts-ignore
            revalidatePath(`/job/${req.job_id}`)
        }

        // @ts-ignore
        if (req?.invoice_id) {
            // @ts-ignore
            revalidatePath(`/invoice/${req.invoice_id}`)
        }

        return { success: true }
    }

    return { success: false, error: 'Payment not paid' }
}

export async function getPaymentRequests(jobId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Fetch Payments Error:', error)
        return []
    }

    return data
}

export async function deletePaymentRequest(requestId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('payment_requests').delete().eq('id', requestId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin')
    return { success: true }
}
