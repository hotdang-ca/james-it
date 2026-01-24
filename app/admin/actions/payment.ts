'use server'

import { createClient } from '@/utils/supabase/server'
import { stripeService } from '@/lib/payments/stripe'
import { revalidatePath } from 'next/cache'

export async function createPaymentRequest(jobId: string, amount: number, description: string, method: string = 'STRIPE') {
    const supabase = await createClient()

    // 1. Fetch Job Details (only needed for Stripe or validation)
    const { data: jobData, error: fetchError } = await supabase
        .from('jobs')
        .select('customer_uuid')
        .eq('id', jobId)
        .single()

    const job = jobData as any

    if (fetchError || !job) {
        return { success: false, error: 'Job not found' }
    }

    let stripeUrl = null
    let stripeSessionId = null
    let status = 'PENDING'

    // 2. Handle Method Logic
    if (method === 'STRIPE') {
        // Generate Link via Stripe Service
        try {
            const result = await stripeService.createPaymentLink(
                jobId,
                amount,
                description,
                job.customer_uuid || ''
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
    // method === 'E_TRANSFER_PENDING' stays PENDING with no stripe link

    // 3. Create Payment Request Record
    const { error: insertError } = await supabase
        .from('payment_requests')
        // @ts-ignore
        .insert({
            job_id: jobId,
            amount: amount,
            description: description,
            stripe_payment_link: stripeUrl,
            stripe_session_id: stripeSessionId,
            status: status,
            payment_method: method
        })

    if (insertError) {
        return { success: false, error: insertError.message }
    }

    revalidatePath('/admin')
    revalidatePath(`/job/${jobId}`)
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

        revalidatePath('/admin')
        // We need to revalidate the job page too, but we need the job ID/UUID.
        // We can fetch it or just revalidate all job pages (expensive) or assume the client refreshes.
        // Better: Fetch the job_id from the payment request we just updated.

        const { data: req } = await supabase.from('payment_requests').select('job_id').eq('stripe_session_id', sessionId).single()

        // @ts-ignore
        if (req && req.job_id) {
            // @ts-ignore
            const jobId = req.job_id

            // Revalidate job page path. 
            // NOTE: The route is typically /job/[uuid]. 
            // In our system, jobs table 'id' IS the uuid.
            revalidatePath(`/job/${jobId}`)
        }

        // Simpler: Just rely on router.refresh() in client component? 
        // The user says "when a user returns... verified... but UI does not reflect".
        // router.refresh() re-fetches server components. If the DB is updated, it should show.
        // Unless createClient() has some caching?

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
