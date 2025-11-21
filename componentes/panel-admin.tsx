"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
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

interface PanelAdminProps {
  usuario: {
    id: number
    nombre_completo: string
    correo: string
    rol_nombre: string
  }
}

export default function PanelAdmin({ usuario }: PanelAdminProps) {
  const router = useRouter()
  const [estadisticas, setEstadisticas] = useState<EstadisticasAdmin | null>(null)
  const [revisores, setRevisores] = useState<Revisor[]>([])
  const [ciudadanos, setCiudadanos] = useState<Ciudadano[]>([])
  const [denuncias, setDenuncias] = useState<Demanda[]>([])
  const [denunciasFiltradas, setDenunciasFiltradas] = useState<Demanda[]>([])
  const [cargando, setCargando] = useState(true)

  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos")

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [denuncias, busqueda, filtroEstado, filtroPrioridad])

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

      const resDenuncias = await fetch("/api/denuncias?limite=100")
      if (resDenuncias.ok) {
        const dataDenuncias = await resDenuncias.json()
        setDenuncias(dataDenuncias)
      }
    } catch (error) {
      console.error("[v0] Error al cargar datos del admin:", error)
      alert("Error al cargar los datos")
    } finally {
      setCargando(false)
    }
  }

  function aplicarFiltros() {
    let resultado = [...denuncias]

    // Filtro por búsqueda
    if (busqueda.trim()) {
      resultado = resultado.filter(d =>
        d.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    }

    // Filtro por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter(d => d.estado === filtroEstado)
    }

    // Filtro por prioridad
    if (filtroPrioridad !== "todos") {
      resultado = resultado.filter(d => d.prioridad === filtroPrioridad)
    }

    setDenunciasFiltradas(resultado)
  }

  async function eliminarDenuncia(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta denuncia?")) {
      return
    }

    try {
      const res = await fetch(`/api/denuncias/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("Denuncia eliminada correctamente")
        // Recargar denuncias
        const resDenuncias = await fetch("/api/denuncias?limite=100")
        if (resDenuncias.ok) {
          const dataDenuncias = await resDenuncias.json()
          setDenuncias(dataDenuncias)
        }
      } else {
        alert("Error al eliminar la denuncia")
      }
    } catch (error) {
      console.error("[v0] Error al eliminar:", error)
      alert("Error al eliminar la denuncia")
    }
  }

  function exportarDatos() {
    const datosExportar = denunciasFiltradas.map(d => ({
      id: d.id,
      titulo: d.titulo,
      tipo: d.tipo_demanda_nombre,
      prioridad: d.prioridad,
      estado: d.estado,
      ubicacion: d.ubicacion_texto,
      fecha: formatearFechaCorta(d.creado_en),
      revisor: d.revisores?.[0]?.nombre_completo || "Sin asignar"
    }))

    const json = JSON.stringify(datosExportar, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `denuncias_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (cargando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando panel de administración...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {usuario.nombre_completo} - Gestión completa de la plataforma</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-md">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <div className="font-semibold text-sm">{usuario.nombre_completo}</div>
            <div className="text-xs text-gray-500">{usuario.correo}</div>
          </div>
          <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
            Administrador
          </span>
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
            {revisores.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay revisores registrados</p>
            ) : (
              revisores.slice(0, 5).map((revisor) => (
                <div key={revisor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
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
              ))
            )}
          </div>
        </div>

        {/* Demandantes activos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>👥</span>
            Demandantes activos ({ciudadanos.length})
          </h2>
          <div className="space-y-3">
            {ciudadanos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay ciudadanos registrados</p>
            ) : (
              ciudadanos.slice(0, 5).map((ciudadano) => (
                <div key={ciudadano.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
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
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📋</span>
            Gestión de denuncias ({denunciasFiltradas.length})
          </h2>
          <button
            onClick={exportarDatos}
            className="px-4 py-2 bg-[#0d7c66] text-white rounded-lg hover:bg-[#0a5f4f] transition-colors flex items-center gap-2"
          >
            <span>⬇️</span>
            Exportar JSON
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="en_revision">En revisión</option>
            <option value="tomaron_el_caso">Tomaron el caso</option>
          </select>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
          >
            <option value="todos">Todas las prioridades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="medio">Media</option>
          </select>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {denunciasFiltradas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No se encontraron denuncias con los filtros aplicados</p>
          ) : (
            denunciasFiltradas.map((denuncia) => (
              <div
                key={denuncia.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500">#{denuncia.id}</span>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium border ${obtenerColorPrioridad(denuncia.prioridad)}`}
                    >
                      {obtenerTextoPrioridad(denuncia.prioridad)}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${denuncia.estado === "en_revision"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                        }`}
                    >
                      {denuncia.estado === "en_revision" ? "En revisión" : "Caso tomado"}
                    </span>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {denuncia.tipo_demanda_nombre}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{denuncia.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{denuncia.descripcion}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📍 {denuncia.ubicacion_texto}</span>
                    <span>📅 {formatearFechaCorta(denuncia.creado_en)}</span>
                    {denuncia.revisores && denuncia.revisores.length > 0 && (
                      <span>👨‍⚖️ {denuncia.revisores[0].nombre_completo}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/denuncias/${denuncia.id}`)}
                    className="p-2 text-white font-bold hover:bg-blue-200 hover:text-blue-500 rounded-lg transition-colors bg-blue-500"
                    title="Ver detalles"
                  >
                    👁️ visualizar
                  </button>
                  <button
                    onClick={() => eliminarDenuncia(denuncia.id)}
                    className="p-2 text-white font-bold hover:bg-red-200 hover:text-red-500 rounded-lg transition-colors bg-red-500"
                    title="Eliminar"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
