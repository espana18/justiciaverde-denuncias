"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { obtenerSesion, cerrarSesion } from "@/lib/auth"

export default function Encabezado() {
  const router = useRouter()
  const [usuarioActual, setUsuarioActual] = useState<any>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const sesion = obtenerSesion()
    setUsuarioActual(sesion)
  }, [])

  const manejarCerrarSesion = () => {
    cerrarSesion()
    setMenuAbierto(false)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="bg-[#0d7c66] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#0d7c66] text-xl">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">JUSTICIA VERDE</h1>
              <p className="text-xl text-green-100">Denuncias ambientales</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {/* <Link href="/" className="hover:text-green-200 transition-colors">
              Inicio
            </Link> */}

            {usuarioActual ? (
              <>
                {usuarioActual.rol_nombre === "ciudadano" && (
                  <Link href="/ciudadano/panel" className="hover:text-green-200 transition-colors">
                    Mis Denuncias
                  </Link>
                )}
                {usuarioActual.rol_nombre === "revisor" && (
                  <Link href="/revisor/panel" className="hover:text-green-200 transition-colors">
                    Panel Revisor
                  </Link>
                )}
                {usuarioActual.rol_nombre === "admin" && (
                  <Link href="/admin/panel" className="hover:text-green-200 transition-colors">
                    Administración
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <span className="text-sm">{usuarioActual.nombre_completo}</span>
                    <span className="text-xs">▼</span>
                  </button>

                  {menuAbierto && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <button
                        onClick={manejarCerrarSesion}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-white text-[#0d7c66] font-bold px-4 py-2 rounded-full hover:bg-green-50 transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
