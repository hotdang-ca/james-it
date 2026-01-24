import { createClient } from '@/utils/supabase/server'
import ContactDetailClient from './page.client'
import { notFound } from 'next/navigation'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: contact, error } = await supabase
        .from('contacts')
        .select(`
            *,
            jobs (
                *,
                payment_requests (*)
            )
        `)
        .eq('id', id)
        .single()

    if (error || !contact) {
        console.error('Error fetching contact:', error)
        notFound()
    }

    const contactData = contact as any

    // Sort jobs by created_at desc
    if (contactData.jobs) {
        contactData.jobs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <ContactDetailClient contact={contactData} />
        </div>
    )
}
