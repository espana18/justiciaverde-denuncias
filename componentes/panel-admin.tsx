"use client"

import { useEffect, useState } from "react"
import type { Demanda, EstadisticasAdmin } from "@/lib/tipos"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaCorta } from "@/lib/utilidades"

interface Revisor {
  id: number
  nombre_completo: string
  correo: string
  casos_activos: number
  casos_resueltos: number
}

interface Ciudadano {
  id: number
  nombre_completo: string
  correo: string
  total_denuncias: number
  creado_en: string
}

export default function PanelAdmin() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasAdmin | null>(null)
  const [revisores, setRevisores] = useState<Revisor[]>([])
  const [ciudadanos, setCiudadanos] = useState<Ciudadano[]>([])
  const [denuncias, setDenuncias] = useState<Demanda[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Cargar estadísticas
        const resEstadisticas = await fetch("/api/estadisticas/admin")
        if (resEstadisticas.ok) {
          const dataEstadisticas = await resEstadisticas.json()
          setEstadisticas(dataEstadisticas)
        }

        // Cargar revisores
        const resRevisores = await fetch("/api/usuarios/revisores")
        if (resRevisores.ok) {
          const dataRevisores = await resRevisores.json()
          setRevisores(dataRevisores)
        }

        // Cargar ciudadanos
        const resCiudadanos = await fetch("/api/usuarios/ciudadanos")
        if (resCiudadanos.ok) {
          const dataCiudadanos = await resCiudadanos.json()
          setCiudadanos(dataCiudadanos)
        }

        // Cargar denuncias
        const resDenuncias = await fetch("/api/denuncias?limite=20")
        if (resDenuncias.ok) {
          const dataDenuncias = await resDenuncias.json()
          setDenuncias(dataDenuncias)
        }
      } catch (error) {
        console.error("[v0] Error al cargar datos del admin:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  if (cargando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, Ana Rodríguez - Gestión completa de la plataforma</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <span className="text-sm font-medium">Ana Rodríguez</span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Administrador</span>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📄</span>
              <div className="text-3xl font-bold text-blue-600">{estadisticas.total_denuncias}</div>
            </div>
            <div className="text-gray-700 font-medium">Total denuncias</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👥</span>
              <div className="text-3xl font-bold text-green-600">{estadisticas.usuarios_activos}</div>
            </div>
            <div className="text-gray-700 font-medium">Usuarios activos</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">✅</span>
              <div className="text-3xl font-bold text-purple-600">{estadisticas.casos_resueltos}</div>
            </div>
            <div className="text-gray-700 font-medium">Casos resueltos</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⏱️</span>
              <div className="text-3xl font-bold text-yellow-600">{estadisticas.en_proceso}</div>
            </div>
            <div className="text-gray-700 font-medium">En proceso</div>
          </div>
        </div>
      )}

      {/* Revisores y Ciudadanos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revisores activos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>👨‍⚖️</span>
            Revisores activos ({revisores.length})
          </h2>
          <div className="space-y-3">
            {revisores.slice(0, 3).map((revisor) => (
              <div key={revisor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">👤</div>
                  <div>
                    <div className="font-semibold">{revisor.nombre_completo}</div>
                    <div className="text-xs text-gray-500">{revisor.correo}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{revisor.casos_activos} activas</div>
                  <div className="text-xs text-gray-500">{revisor.casos_resueltos} resueltas</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demandantes activos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>👥</span>
            Demandantes activos ({ciudadanos.length})
          </h2>
          <div className="space-y-3">
            {ciudadanos.slice(0, 3).map((ciudadano) => (
              <div key={ciudadano.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">👤</div>
                  <div>
                    <div className="font-semibold">{ciudadano.nombre_completo}</div>
                    <div className="text-xs text-gray-500">{ciudadano.correo}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">{ciudadano.total_denuncias} denuncias</div>
                  <div className="text-xs text-gray-500">Desde {formatearFechaCorta(ciudadano.creado_en)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gestión de denuncias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📋</span>
            Gestión de denuncias
          </h2>
          <button className="px-4 py-2 bg-[#0d7c66] text-white rounded-lg hover:bg-[#0a5f4f] transition-colors flex items-center gap-2">
            <span>⬇️</span>
            Exportar todo
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar denuncias..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent">
            <option>Todos los estados</option>
            <option>En revisión</option>
            <option>Tomaron el caso</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent">
            <option>Todas las prioridades</option>
            <option>Crítica</option>
            <option>Alta</option>
            <option>Media</option>
          </select>
        </div>

        <div className="space-y-3">
          {denuncias.slice(0, 5).map((denuncia) => (
            <div
              key={denuncia.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium border ${obtenerColorPrioridad(denuncia.prioridad)}`}
                  >
                    {obtenerTextoPrioridad(denuncia.prioridad)}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      denuncia.estado === "en_revision"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {denuncia.estado === "en_revision" ? "En proceso" : "Resueltas"}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{denuncia.titulo}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>❤️ 234 likes</span>
                  <span>💬 2 comentarios</span>
                  <span>👁️ 1523 vistas</span>
                  <span>📅 {formatearFechaCorta(denuncia.creado_en)}</span>
                </div>
                {denuncia.revisores && denuncia.revisores.length > 0 && (
                  <div className="text-sm text-gray-600 mt-1">Revisor: {denuncia.revisores[0].nombre_completo}</div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Ver">
                  👁️
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
