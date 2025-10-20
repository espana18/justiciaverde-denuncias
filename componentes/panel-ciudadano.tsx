"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Demanda, EstadisticasCiudadano } from "@/lib/tipos"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaCorta } from "@/lib/utilidades"
import { obtenerSesion } from "@/lib/auth"

interface PanelCiudadanoProps {
  usuarioId: number
}

export default function PanelCiudadano({ usuarioId }: PanelCiudadanoProps) {
  const router = useRouter()
  const [estadisticas, setEstadisticas] = useState<EstadisticasCiudadano | null>(null)
  const [denuncias, setDenuncias] = useState<Demanda[]>([])
  const [filtro, setFiltro] = useState<"todas" | "en_proceso" | "resueltas">("todas")
  const [cargando, setCargando] = useState(true)
  const [nombreUsuario, setNombreUsuario] = useState("")

  useEffect(() => {
    const sesion = obtenerSesion()
    if (sesion) {
      setNombreUsuario(sesion.nombre_completo)
    }
    cargarDatos()
  }, [usuarioId])

  async function cargarDatos() {
    try {
      const resEstadisticas = await fetch(`/api/estadisticas/ciudadano/${usuarioId}`)
      if (resEstadisticas.ok) {
        const dataEstadisticas = await resEstadisticas.json()
        setEstadisticas(dataEstadisticas)
      }

      const resDenuncias = await fetch(`/api/denuncias?ciudadano_id=${usuarioId}`)
      if (resDenuncias.ok) {
        const dataDenuncias = await resDenuncias.json()
        setDenuncias(dataDenuncias)
      }
    } catch (error) {
      console.error("[v0] Error al cargar datos del ciudadano:", error)
    } finally {
      setCargando(false)
    }
  }

  async function eliminarDenuncia(denunciaId: number) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta denuncia?")) {
      return
    }

    try {
      const res = await fetch(`/api/denuncias/${denunciaId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("Denuncia eliminada exitosamente")
        cargarDatos()
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Error al eliminar denuncia:", error)
      alert("Error al eliminar la denuncia")
    }
  }

  const denunciasFiltradas = denuncias.filter((d) => {
    if (filtro === "todas") return true
    if (filtro === "en_proceso") return d.estado === "en_revision"
    if (filtro === "resueltas") return d.estado === "tomaron_el_caso"
    return true
  })

  if (cargando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis denuncias</h1>
        <p className="text-gray-600">Bienvenido, {nombreUsuario}</p>
      </div>

      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">{estadisticas.total_denuncias}</div>
            <div className="text-gray-700 font-medium">Total denuncias</div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{estadisticas.en_proceso}</div>
            <div className="text-gray-700 font-medium">En proceso</div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="text-4xl font-bold text-green-600 mb-2">{estadisticas.resueltas}</div>
            <div className="text-gray-700 font-medium">Resueltas</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro("todas")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === "todas" ? "bg-[#0d7c66] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro("en_proceso")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === "en_proceso" ? "bg-[#0d7c66] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            En proceso
          </button>
          <button
            onClick={() => setFiltro("resueltas")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === "resueltas" ? "bg-[#0d7c66] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Resueltas
          </button>
        </div>

        <Link
          href="/denuncias/crear"
          className="bg-[#0d7c66] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0a5f4f] transition-colors flex items-center gap-2"
        >
          ➕ Crear denuncia
        </Link>
      </div>

      <div className="space-y-4">
        {denunciasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No tienes denuncias en esta categoría</p>
          </div>
        ) : (
          denunciasFiltradas.map((denuncia) => (
            <div key={denuncia.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${denuncia.estado === "en_revision"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                    >
                      {denuncia.estado === "en_revision" ? "En proceso" : "Resueltas"}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorPrioridad(denuncia.prioridad)}`}
                    >
                      Prioridad: {obtenerTextoPrioridad(denuncia.prioridad)}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {denuncia.tipo_demanda_nombre}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{denuncia.titulo}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{denuncia.descripcion}</p>

                  {denuncia.ubicacion_texto && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>📍</span>
                      <span>{denuncia.ubicacion_texto}</span>
                    </div>
                  )}

                  <div className="text-sm text-gray-400">{formatearFechaCorta(denuncia.creado_en)}</div>

                  {denuncia.estado === "tomaron_el_caso" && denuncia.revisores && denuncia.revisores.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Revisor asignado: {denuncia.revisores[0].nombre_completo}
                      </p>
                      <p className="text-xs text-green-700">📧 {denuncia.revisores[0].correo}</p>
                      <p className="text-xs text-green-700">📞 {denuncia.revisores[0].telefono || "No disponible"}</p>
                      <p className="text-xs text-green-600 mt-1">Grupo VerdeLex - Derecho Ambiental</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/denuncias/${denuncia.id}/editar`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-center"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => eliminarDenuncia(denuncia.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
