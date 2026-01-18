import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="admin-layout" style={{ minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
            <header style={{ backgroundColor: '#1E293B', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#FF6B00' }}>JAMES-IT ADMIN</div>
                <nav style={{ display: 'flex', gap: '2rem' }}>
                    <Link href="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>CRM & Jobs</Link>
                    <Link href="/admin/tracking" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Active Jobs</Link>
                    <form action="/auth/signout" method="post">
                        <button style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}>Sign Out</button>
                    </form>
                </nav>
            </header>
            <main style={{ padding: '2rem' }}>
                {children}
            </main>
        </div>
    )
}
