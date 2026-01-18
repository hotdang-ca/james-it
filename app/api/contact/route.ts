import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { name, email, service_interest, message } = await request.json()

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('contacts')
            // @ts-ignore
            .insert({
                name,
                email,
                service_interest,
                message,
                status: 'NEW'
            })
        // .select()

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })

    } catch (err) {
        console.error('Server Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
