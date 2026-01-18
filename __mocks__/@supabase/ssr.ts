import { vi } from 'vitest'

// -- Select Builder --
// Handles .eq().single() chains
const mockSelectBuilder = {
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(), // user should mockResolvedValue on this
}

// -- Update Builder --
// Handles .eq() termination
const mockUpdateBuilder = {
    // eq needs to be awaitable for the update chain to finish
    // So we make it return a Promise-like object or we just mockResolvedValue on the test side if possible.
    // But if we return 'this', 'this' must be thenable.
    // Easier: Make eq return a Promise by default, or an object that has .then?
    // Actually, let's just make eq a spy that we can control.
    // In the 'update' case, `eq` is final.
    eq: vi.fn()
}

// -- Insert Builder --
// Handles .select().single()
const mockInsertBuilder = {
    select: vi.fn().mockReturnThis(),
    single: vi.fn(),
}

// -- Query Builder --
// Returned by .from()
const mockQueryBuilder = {
    select: vi.fn(() => mockSelectBuilder),
    update: vi.fn(() => mockUpdateBuilder),
    insert: vi.fn(() => mockInsertBuilder),
}

export const mockSupabaseClient = {
    from: vi.fn(() => mockQueryBuilder),
    rpc: vi.fn(),
}

export const createServerClient = vi.fn(() => mockSupabaseClient)
export const createBrowserClient = vi.fn(() => mockSupabaseClient)
