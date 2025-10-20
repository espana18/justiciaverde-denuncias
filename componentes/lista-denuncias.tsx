"use client"

import { useEffect, useState } from "react"
import TarjetaDenuncia from "./tarjeta-denuncia"
import type { Demanda } from "@/lib/tipos"

export default function ListaDenuncias() {
  const [denuncias, setDenuncias] = useState<Demanda[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDenuncias() {
      try {
        const res = await fetch("/api/denuncias")
        if (res.ok) {
          const data = await res.json()
          setDenuncias(data)
        }
      } catch (error) {
        console.error("[v0] Error al cargar denuncias:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDenuncias()
  }, [])

  if (cargando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando denuncias...</p>
      </div>
    )
  }

  if (denuncias.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No hay denuncias disponibles</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {denuncias.map((denuncia) => (
        <TarjetaDenuncia key={denuncia.id} denuncia={denuncia} mostrarAcciones={true} />
      ))}
    </div>
  )
}
