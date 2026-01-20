import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// We need to wrap the interactivity in a client component since page.tsx is a Server Component
import AdminContactsClient from './page.client'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select(`
      *,
      jobs (
        *,
        payment_requests (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return <div>Error loading contacts.</div>
  }

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1E293B' }}>CRM Overview</h1>
      </div>

      <AdminContactsClient initialContacts={contacts || []} />
    </div>
  )
}
