import { vi } from 'vitest'
import { mockSupabaseClient } from '../../__mocks__/@supabase/ssr'

export const createClient = vi.fn(async () => mockSupabaseClient)
