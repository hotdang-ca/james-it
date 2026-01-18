'use server'

import { createClient } from '@/utils/supabase/server'
import { stripeService } from '@/lib/payments/stripe'
import { revalidatePath } from 'next/cache'

export async function generateJobPaymentLink(jobId: string) {
    const supabase = await createClient()

    // 1. Fetch Job Details
    const { data: job, error: fetchError } = await supabase
        .from('jobs')
        .select('id, description, quoted_price')
        .eq('id', jobId)
        .single()

    const listJob = job as any

    if (fetchError || !listJob || !listJob.quoted_price) {
        return { success: false, error: 'Job not found or no price set' }
    }

    // 2. Generate Link via Stripe Service
    const paymentLink = await stripeService.createPaymentLink(listJob.id, listJob.quoted_price, listJob.description || 'James-It Service')

    // 3. Save Link to DB
    const { error: updateError } = await supabase
        .from('jobs')
        // @ts-ignore
        .update({ stripe_payment_link: paymentLink })
        .eq('id', jobId)

    if (updateError) {
        return { success: false, error: updateError.message }
    }

    revalidatePath('/admin')
    return { success: true, link: paymentLink }
}
