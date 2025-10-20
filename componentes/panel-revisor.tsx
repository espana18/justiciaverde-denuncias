"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Demanda, EstadisticasRevisor } from "@/lib/tipos"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaCorta } from "@/lib/utilidades"
import { obtenerSesion } from "@/lib/auth"

interface PanelRevisorProps {
  revisorId: number
}

export default function PanelRevisor({ revisorId }: PanelRevisorProps) {
  const [estadisticas, setEstadisticas] = useState<EstadisticasRevisor | null>(null)
  const [denunciasDisponibles, setDenunciasDisponibles] = useState<Demanda[]>([])
  const [misCasos, setMisCasos] = useState<Demanda[]>([])
  const [vistaActual, setVistaActual] = useState<"disponibles" | "mis_casos">("disponibles")
  const [cargando, setCargando] = useState(true)
  const [nombreRevisor, setNombreRevisor] = useState("")

  useEffect(() => {
    const sesion = obtenerSesion()
    if (sesion) {
      setNombreRevisor(sesion.nombre_completo)
    }
    cargarDatos()
  }, [revisorId])

  async function cargarDatos() {
    try {
      const resEstadisticas = await fetch(`/api/estadisticas/revisor/${revisorId}`)
      if (resEstadisticas.ok) {
        const dataEstadisticas = await resEstadisticas.json()
        setEstadisticas(dataEstadisticas)
      }

      const resDenuncias = await fetch("/api/denuncias")
      if (resDenuncias.ok) {
        const todasDenuncias: Demanda[] = await resDenuncias.json()

        const disponibles = todasDenuncias.filter(
          (d) => d.estado === "en_revision" && (!d.revisores || d.revisores.length === 0),
        )
        setDenunciasDisponibles(disponibles)

        const casos = todasDenuncias.filter((d) => d.revisores && d.revisores.some((r) => r.id === revisorId))
        setMisCasos(casos)
      }
    } catch (error) {
      console.error("[v0] Error al cargar datos del revisor:", error)
    } finally {
      setCargando(false)
    }
  }

  async function tomarCaso(denunciaId: number) {
    try {
      const res = await fetch(`/api/denuncias/${denunciaId}/asignar-revisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisor_id: revisorId }),
      })

      if (res.ok) {
        alert("Caso tomado exitosamente")
        await cargarDatos()
        setVistaActual("mis_casos")
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Error al tomar caso:", error)
      alert("Error al tomar el caso")
    }
  }

  if (cargando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  const denunciasActuales = vistaActual === "disponibles" ? denunciasDisponibles : misCasos

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div>
            <h1 className="text-2xl font-bold">{nombreRevisor}</h1>
            <p className="text-gray-600">Grupo VerdeLex</p>
            <p className="text-sm text-gray-500">Derecho Ambiental</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span>⏱️</span>
            <span>{estadisticas?.en_proceso || 0} en revisión</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{estadisticas?.resueltas || 0} resueltas</span>
          </div>
        </div>
      </div>

      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">{estadisticas.disponibles}</div>
            <div className="text-gray-700 font-medium">Disponibles</div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="text-4xl font-bold text-green-600 mb-2">{estadisticas.resueltas}</div>
            <div className="text-gray-700 font-medium">Resueltas</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <div className="text-4xl font-bold text-purple-600 mb-2">{estadisticas.total_casos}</div>
            <div className="text-gray-700 font-medium">Total casos</div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setVistaActual("disponibles")}
          className={`px-6 py-3 font-medium transition-colors ${vistaActual === "disponibles"
              ? "border-b-2 border-[#0d7c66] text-[#0d7c66]"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Disponibles ({denunciasDisponibles.length})
        </button>
        <button
          onClick={() => setVistaActual("mis_casos")}
          className={`px-6 py-3 font-medium transition-colors ${vistaActual === "mis_casos"
              ? "border-b-2 border-[#0d7c66] text-[#0d7c66]"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Mis casos tomados ({misCasos.length})
        </button>
      </div>

      <div className="space-y-4">
        {denunciasActuales.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No hay denuncias en esta categoría</p>
          </div>
        ) : (
          denunciasActuales.map((denuncia) => (
            <div key={denuncia.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorPrioridad(denuncia.prioridad)}`}
                    >
                      {obtenerTextoPrioridad(denuncia.prioridad)}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {denuncia.tipo_demanda_nombre}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{denuncia.titulo}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{denuncia.descripcion}</p>

                  {denuncia.ubicacion_texto && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span>📍</span>
                      <span>{denuncia.ubicacion_texto}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>❤️ 456 likes</span>
                    <span>💬 1 comentarios</span>
                    <span>👁️ 2341 vistas</span>
                  </div>

                  <div className="text-sm text-gray-400">📅 {formatearFechaCorta(denuncia.creado_en)}</div>
                </div>

                <div className="flex flex-col gap-2">
                  {vistaActual === "disponibles" && (
                    <button
                      onClick={() => tomarCaso(denuncia.id)}
                      className="px-4 py-2 bg-[#0d7c66] text-white rounded-lg hover:bg-[#0a5f4f] transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                      <span>✋</span>
                      Tomar caso
                    </button>
                  )}
                  <Link
                    href={`/revisor/denuncias/${denuncia.id}`}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2 justify-center"
                  >
                    <span>👁️</span>
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
