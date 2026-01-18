import { createClient } from '@/utils/supabase/server'

export async function getContacts() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('contacts')
        .select('*, jobs(*)')
        .order('created_at', { ascending: false })

    return data || []
}
