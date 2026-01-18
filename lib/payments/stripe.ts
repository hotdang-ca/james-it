export class StripeService {
    private apiKey: string

    constructor() {
        this.apiKey = process.env.STRIPE_SECRET_KEY || 'mock_key'
    }

    async createPaymentLink(jobId: string, amount: number, description: string): Promise<string> {
        if (this.apiKey === 'mock_key') {
            console.log(`[Stripe Mock] Creating payment link for Job ${jobId}, Amount: $${amount}`)
            // Return a mock link that, in a real app, would redirect to Stripe Checkout
            return `https://checkout.stripe.com/mock/${jobId}?amount=${amount}`
        }

        // TODO: Real Stripe Implementation
        // const session = await stripe.checkout.sessions.create(...)
        // return session.url
        return ''
    }
}

export const stripeService = new StripeService()
