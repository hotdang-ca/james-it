'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./MapComponent'), {
    loading: () => <div style={{ height: '400px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>,
    ssr: false
})

export default function JobMapWrapper({ logs }: { logs: any[] }) {
    return <MapComponent logs={logs} />
}
