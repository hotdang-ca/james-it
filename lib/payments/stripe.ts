import 'server-only'
import Stripe from 'stripe'

export class StripeService {
    private stripe: Stripe

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-12-15.clover' // Matches installed SDK version
        })
    }

    async createPaymentLink(targetId: string, amount: number, description: string, customerUuid: string, isInvoice: boolean = false): Promise<{ url: string, sessionId: string }> {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'mock_key') {
            console.log(`[Stripe Mock] Creating payment link for ${isInvoice ? 'Invoice' : 'Job'} ${targetId}, Amount: $${amount}`)
            return {
                url: `https://checkout.stripe.com/mock/${targetId}?amount=${amount}`,
                sessionId: `mock_session_${Date.now()}`
            }
        }

        try {
            let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
            if (!baseUrl.startsWith('http')) {
                baseUrl = `https://${baseUrl}`
            }

            const returnPath = isInvoice ? 'invoice' : 'job';

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'cad', // Assuming CAD as requested
                            product_data: {
                                name: description || 'James-It Service',
                            },
                            unit_amount: Math.round(amount * 100), // Convert to cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${baseUrl}/${returnPath}/${targetId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/${returnPath}/${targetId}?payment_cancelled=true`,
                metadata: {
                    targetId: targetId,
                    type: isInvoice ? 'invoice' : 'job',
                    customerUuid: customerUuid
                }
            })

            return { url: session.url || '', sessionId: session.id }
        } catch (error: any) {
            console.error('Stripe Error:', error)
            throw new Error(error.message || 'Unknown Stripe Error')
        }
    }
    async verifySession(sessionId: string): Promise<boolean> {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'mock_key') {
            return true
        }
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId)
            return session.payment_status === 'paid'
        } catch (error) {
            console.error('Stripe Verify Error:', error)
            return false
        }
    }
}

export const stripeService = new StripeService()
