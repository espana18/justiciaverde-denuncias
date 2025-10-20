"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Configurar iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface SelectorUbicacionMapaProps {
  coordenadas: { lat: number; lng: number } | null
  onCambiarCoordenadas: (coords: { lat: number; lng: number }) => void
}

// Componente para manejar clics en el mapa
function ManejadorClicMapa({ onCambiarCoordenadas }: { onCambiarCoordenadas: (coords: { lat: number; lng: number }) => void }) {
  const map = useMapEvents({
    click(e) {
      onCambiarCoordenadas({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })

  return null
}

export default function SelectorUbicacionMapa({ coordenadas, onCambiarCoordenadas }: SelectorUbicacionMapaProps) {
  const mapRef = useRef<any>(null)

  // Centro por defecto (Bogotá, Colombia)
  const centroDefecto: [number, number] = [4.7110, -74.0721]
  const centro: [number, number] = coordenadas ? [coordenadas.lat, coordenadas.lng] : centroDefecto

  // Actualizar vista del mapa cuando cambien las coordenadas
  useEffect(() => {
    if (mapRef.current && coordenadas) {
      mapRef.current.setView([coordenadas.lat, coordenadas.lng], 13)
    }
  }, [coordenadas])

  return (
    <MapContainer
      center={centro}
      zoom={coordenadas ? 13 : 6}
      className="w-full h-full"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ManejadorClicMapa onCambiarCoordenadas={onCambiarCoordenadas} />

      {coordenadas && <Marker position={[coordenadas.lat, coordenadas.lng]} />}
    </MapContainer>
  )
}
