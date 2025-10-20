"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { Demanda } from "@/lib/tipos"

interface MapaInteractivoProps {
  denuncias?: Demanda[]
  denunciaId?: number
}

const MapaContenido = dynamic(() => import("./mapa-contenido"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

export default function MapaInteractivo({ denuncias: denunciasProp, denunciaId }: MapaInteractivoProps = {}) {
  const [denuncias, setDenuncias] = useState<Demanda[]>(denunciasProp || [])
  const [cargando, setCargando] = useState(!denunciasProp)

  useEffect(() => {
    if (denunciasProp) {
      setDenuncias(denunciasProp)
      return
    }

    async function cargarDenuncias() {
      try {
        const res = await fetch("/api/denuncias/mapa")
        if (res.ok) {
          const data = await res.json()
          if (denunciaId) {
            setDenuncias(data.filter((d: Demanda) => d.id === denunciaId))
          } else {
            setDenuncias(data)
          }
        }
      } catch (error) {
        console.error("[v0] Error al cargar denuncias para mapa:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDenuncias()
  }, [denunciasProp, denunciaId])

  if (cargando) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando denuncias...</p>
      </div>
    )
  }

  return <MapaContenido denuncias={denuncias} />
}
