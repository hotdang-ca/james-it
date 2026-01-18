import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createJob } from './job'
import { mockSupabaseClient } from '../../../__mocks__/@supabase/ssr'
import { notificationService } from '@/lib/notifications/service'

// Mock dependencies
vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => mockSupabaseClient
}))

// Mock Notification Service
vi.spyOn(notificationService, 'sendMagicLink').mockResolvedValue(true)

// Mock revalidatePath
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}))

describe('createJob Server Action', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create a job and send a notification when contact exists', async () => {
        // Setup Supabase Mocks

        // 1. Contact fetch: select().single()
        // However, wait. In `job.ts` code: .from('contacts').select(...).eq(...).single()
        // My mockSelectBuilder structure supports eq().single().
        // We need to grab the builders produced by .from() calls.

        // Mock the builders specifically?
        // Since mockSupabaseClient.from returns the SAME mockQueryBuilder instances (mocked in module), we can access them.

        // We need to access the builders returned by the mocks.
        // Let's just re-resolve the builders from the client for clarity in test setup.
        const queryBuilder = mockSupabaseClient.from('contacts')
        const selectBuilder = queryBuilder.select()
        selectBuilder.single.mockResolvedValueOnce({
            data: { name: 'John Doe', email: 'john@example.com' },
            error: null
        })

        // 2. Job Insert: insert().select().single()
        const insertBuilder = mockSupabaseClient.from('jobs').insert()
        // insertBuilder has .select() which returns mockSelectBuilder (WAIT! insertBuilder needs its own select mock if it chains differently?)
        // In my mock `mockInsertBuilder`: `select: vi.fn().mockReturnThis()`
        // So distinct from `mockQueryBuilder.select`.
        // And `mockInsertBuilder` has `single`.
        // Wait, in `job.ts`: .insert().select().single()

        // Let's update `mockInsertBuilder` in the previous tool call? 
        // "select: vi.fn().mockReturnThis(), single: vi.fn()" 
        // Yes, so it returns itself on select, then calls single. Correct.

        const jobInsertBuilder = mockSupabaseClient.from('jobs').insert()
        // Since we mock return instances, we need to be careful if test isolation is needed.
        // But here we can just spy on the methods.

        jobInsertBuilder.single.mockResolvedValueOnce({
            data: { id: 'job-123', customer_uuid: 'uuid-123', status: 'PENDING' },
            error: null
        })

        const result = await createJob('contact-1', 'Test Job', 100)

        expect(result.success).toBe(true)
        expect(notificationService.sendMagicLink).toHaveBeenCalledWith('john@example.com', 'uuid-123', 'John Doe')
    })

    it('should return error if contact not found', async () => {
        // Contact fetch returns error
        const queryBuilder = mockSupabaseClient.from('contacts')
        const selectBuilder = queryBuilder.select()
        selectBuilder.single.mockResolvedValueOnce({
            data: null,
            error: { message: 'Not found' }
        })

        const result = await createJob('contact-999', 'Test Job', 100)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Contact not found')
    })
})
