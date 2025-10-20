"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Encabezado from "@/componentes/encabezado"
import PanelCiudadano from "@/componentes/panel-ciudadano"
import { obtenerSesion } from "@/lib/auth"

export default function PaginaPanelCiudadano() {
  const router = useRouter()
  const [usuarioId, setUsuarioId] = useState<number | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const sesion = obtenerSesion()

    if (!sesion) {
      router.push("/auth/login")
      return
    }

    if (sesion.rol_nombre !== "ciudadano") {
      alert("No tienes permisos para acceder a esta página")
      router.push("/")
      return
    }

    setUsuarioId(sesion.id)
    setCargando(false)
  }, [router])

  if (cargando || !usuarioId) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado />

      <div className="container mx-auto px-4 py-8">
        <PanelCiudadano usuarioId={usuarioId} />
      </div>
    </div>
  )
}
