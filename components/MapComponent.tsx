'use client'

import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import L from 'leaflet'

// Fix Leaflet marker icons in Next.js
// We moved this inside the component to avoid global side-effects during SSR or module eval

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, 13)
    }, [center, map])
    return null
}

interface MapComponentProps {
    logs: any[] // GeolocationLogs
}

export default function MapComponent({ logs }: MapComponentProps) {
    // logs are ordered oldest to newest? Or newest to oldest?
    // Let's assume we receive them ordered by date.

    const [sliderValue, setSliderValue] = useState(logs.length - 1)
    const [currentLog, setCurrentLog] = useState(logs[logs.length - 1])

    useEffect(() => {
        // Fix Leaflet icons
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/assets/marker-icon-2x.png',
            iconUrl: '/assets/marker-icon.png',
            shadowUrl: '/assets/marker-shadow.png',
        });

        if (logs.length > 0) {
            setSliderValue(logs.length - 1)
            setCurrentLog(logs[logs.length - 1])
        }
    }, [logs])

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = parseInt(e.target.value)
        setSliderValue(idx)
        setCurrentLog(logs[idx])
    }

    if (!logs || logs.length === 0) {
        return <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>No location data available yet.</div>
    }

    const polylinePositions = logs.map(l => [l.latitude, l.longitude] as [number, number])

    return (
        <div style={{ height: '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                center={[currentLog.latitude, currentLog.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Polyline positions={polylinePositions} color="#FF6B00" />

                <Marker position={[currentLog.latitude, currentLog.longitude]}>
                    <Popup>
                        Status: {currentLog.created_at}
                    </Popup>
                </Marker>

                <MapUpdater center={[currentLog.latitude, currentLog.longitude]} />
            </MapContainer>

            {/* History Control */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 1000,
                backgroundColor: 'rgba(255,255,255,0.9)', padding: '1rem', borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    <span>Timeline</span>
                    <span>{new Date(currentLog.created_at).toLocaleString()}</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max={logs.length - 1}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
            </div>
        </div>
    )
}
