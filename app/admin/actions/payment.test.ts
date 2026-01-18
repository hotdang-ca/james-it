import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateJobPaymentLink } from './payment'
import { mockSupabaseClient } from '../../../__mocks__/@supabase/ssr'
import { stripeService } from '@/lib/payments/stripe'

// Mock dependencies
vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => mockSupabaseClient
}))

// Mock Revalidate
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}))

// Mock Stripe Service
vi.spyOn(stripeService, 'createPaymentLink').mockResolvedValue('https://checkout.stripe.com/test-link')

describe('generateJobPaymentLink Server Action', () => {
    let mockUpdateFn: any

    beforeEach(() => {
        vi.clearAllMocks()
        // Reset mockSupabaseClient for each test to ensure fresh state
        // This setup allows chaining like client.from('table').select().single()

        // Define stable mocks
        const mockSelectBuilder = {
            single: vi.fn(),
            eq: vi.fn().mockReturnThis(),
        }
        const mockUpdateBuilder = {
            eq: vi.fn(),
        }

        // This is the function we want to spy on: .update(...)
        mockUpdateFn = vi.fn().mockReturnValue(mockUpdateBuilder)

        mockSupabaseClient.from.mockImplementation((tableName: string) => {
            if (tableName === 'jobs') {
                return {
                    select: vi.fn().mockReturnValue(mockSelectBuilder),
                    update: mockUpdateFn,
                    // Add other methods if needed for other tests
                }
            }
            return {} as any // Default return for other tables if not specifically mocked
        })
    })

    it('should generate a payment link and save it to the job', async () => {
        // 1. Job Fetch Mock
        // client.from('jobs').select().single()
        const mockSelectBuilder = mockSupabaseClient.from('jobs').select()
        const mockSingle = mockSelectBuilder.single as vi.Mock
        mockSingle.mockResolvedValueOnce({
            data: { id: 'job-123', description: 'Clean up', quoted_price: 50 },
            error: null
        })

        // 2. Update Job Mock
        // Configure the builder returned by update fn
        const mockUpdateBuilder = mockUpdateFn() // get the builder instance (mockReturnValue returns same obj)
        const mockEq = mockUpdateBuilder.eq as any
        mockEq.mockResolvedValueOnce({ error: null })

        const result = await generateJobPaymentLink('job-123')

        expect(result.success).toBe(true)
        expect(result.link).toBe('https://checkout.stripe.com/test-link')
        expect(stripeService.createPaymentLink).toHaveBeenCalledWith('job-123', 50, 'Clean up')

        // Check calls
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('jobs')
        expect(mockSelectBuilder.single).toHaveBeenCalled()
        expect(mockUpdateBuilder.eq).toHaveBeenCalledWith('id', 'job-123')
        expect(mockUpdateFn).toHaveBeenCalledWith({ stripe_payment_link: 'https://checkout.stripe.com/test-link' })
    })

    it('should fail if job has no price', async () => {
        // 1. Job Fetch
        const mockSelectBuilder = mockSupabaseClient.from('jobs').select()
        const mockSingle = mockSelectBuilder.single as any
        mockSingle.mockResolvedValueOnce({
            data: { id: 'job-123', description: 'Clean up', quoted_price: null },
            error: null
        })

        const result = await generateJobPaymentLink('job-123')

        expect(result.success).toBe(false)
        expect(result.error).toContain('no price set')
        expect(stripeService.createPaymentLink).not.toHaveBeenCalled()
    })
})
