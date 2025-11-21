"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Encabezado from "@/componentes/encabezado"
import PanelAdmin from "@/componentes/panel-admin"
import { obtenerUsuarioActual } from "@/lib/auth"

export default function PaginaPanelAdmin() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const usuarioActual = obtenerUsuarioActual()

    if (!usuarioActual) {
      alert("Debes iniciar sesión")
      router.push("/auth/login")
      return
    }

    if (usuarioActual.rol_nombre !== "admin") {
      alert("No tienes permisos para acceder a esta página")
      router.push("/")
      return
    }

    setUsuario(usuarioActual)
    setCargando(false)
  }, [router])

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado
        usuarioActual={{
          nombre: usuario.nombre_completo,
          rol: usuario.rol_nombre,
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <PanelAdmin usuario={usuario} />
      </div>
    </div>
  )
}
