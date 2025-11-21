"use client"

import { useState } from "react"
import { Search, X, MapPin, Calendar, User, Phone, Mail, AlertCircle } from 'lucide-react'
import dynamic from "next/dynamic"
import type { Demanda } from "@/lib/tipos"
import { formatearFechaLarga, obtenerColorPrioridad, obtenerTextoPrioridad } from "@/lib/utilidades"

// Importar mapa dinámicamente
const MapaInteractivo = dynamic(() => import("./mapa-interactivo"), {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />,
})

export default function ConsultorRadicado() {
    const [numeroRadicado, setNumeroRadicado] = useState("")
    const [consultando, setConsultando] = useState(false)
    const [denuncia, setDenuncia] = useState<Demanda | null>(null)
    const [error, setError] = useState("")

    const consultarRadicado = async () => {
        if (!numeroRadicado.trim()) {
            setError("Por favor ingresa un número de radicado")
            return
        }

        setConsultando(true)
        setError("")
        setDenuncia(null)

        try {
            const res = await fetch(`/api/denuncias/radicado/${numeroRadicado.trim()}`)

            if (res.ok) {
                const data = await res.json()
                setDenuncia(data)
            } else {
                const errorData = await res.json()
                setError(errorData.error || "No se encontró la denuncia")
            }
        } catch (err) {
            console.error("[v0] Error al consultar radicado:", err)
            setError("Error al consultar. Intenta nuevamente")
        } finally {
            setConsultando(false)
        }
    }

    const limpiarConsulta = () => {
        setNumeroRadicado("")
        setDenuncia(null)
        setError("")
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#0d7c66] rounded-lg">
                    <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Consulta el estado de tu denuncia</h3>
                    <p className="text-sm text-gray-600">Ingresa el número de radicado para ver el estado actualizado</p>
                </div>
            </div>

            {/* Buscador */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={numeroRadicado}
                    onChange={(e) => setNumeroRadicado(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && consultarRadicado()}
                    placeholder="Ej: RAD-2025-000001"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                />
                <button
                    onClick={consultarRadicado}
                    disabled={consultando}
                    className="px-6 py-3 bg-[#0d7c66] text-white rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Search className="w-5 h-5" />
                    {consultando ? "Consultando..." : "Consultar"}
                </button>
                {(denuncia || error) && (
                    <button
                        onClick={limpiarConsulta}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-900">Error</p>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Resultado */}
            {denuncia && (
                <div className="border-t border-gray-200 pt-6 space-y-6">
                    {/* Encabezado de la denuncia */}
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                        {denuncia.numero_radicado}
                                    </span>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${obtenerColorPrioridad(denuncia.prioridad)}`}>
                                        {obtenerTextoPrioridad(denuncia.prioridad)}
                                    </span>
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">{denuncia.titulo}</h4>
                                <p className="text-gray-600 leading-relaxed">{denuncia.descripcion}</p>
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-600 font-semibold mb-1">Estado</p>
                                <p className="text-lg font-bold text-blue-900">
                                    {denuncia.estado === "en_revision" ? "En revisión" : "Caso tomado"}
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-600 font-semibold mb-1">Tipo de denuncia</p>
                                <p className="text-lg font-bold text-green-900">{denuncia.tipo_demanda_nombre}</p>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="text-sm text-purple-600 font-semibold mb-1">Fecha de creación</p>
                                <p className="text-sm font-semibold text-purple-900">{formatearFechaLarga(denuncia.creado_en)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación con mapa */}
                    {denuncia.latitud && denuncia.longitud && (
                        <div>
                            <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#0d7c66]" />
                                Ubicación
                            </h5>
                            <p className="text-gray-600 mb-3">{denuncia.ubicacion_texto}</p>
                            <div className="h-[525px] rounded-lg overflow-hidden border border-gray-300">
                                <MapaInteractivo
                                    denuncias={[denuncia]}
                                    denunciaSeleccionada={denuncia.id}
                                    onSeleccionarDenuncia={() => { }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Revisor asignado */}
                    {denuncia.revisores && denuncia.revisores.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h5 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Revisor asignado
                            </h5>
                            {denuncia.revisores.map((revisor) => (
                                <div key={revisor.id} className="space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Nombre:</span> {revisor.nombre_completo}
                                    </p>
                                    <p className="text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {revisor.correo}
                                    </p>
                                    <p className="text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {revisor.telefono || "No disponible"}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Asignado: {formatearFechaLarga(revisor.asignado_en || "")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Evidencias */}
                    {denuncia.fotos && denuncia.fotos.length > 0 && (
                        <div>
                            <h5 className="font-bold text-gray-900 mb-3">Evidencias</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {denuncia.fotos.map((foto) => (
                                    <img
                                        key={foto.id}
                                        src={foto.ruta || ""}
                                        alt={foto.descripcion || "Evidencia"}
                                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Información del denunciante (si no es anónima) */}
                    {!denuncia.anonima && denuncia.ciudadano_nombre && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h5 className="font-bold text-gray-900 mb-3">Información del denunciante</h5>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Nombre:</span> {denuncia.ciudadano_nombre}
                                </p>
                                {denuncia.ciudadano_correo && (
                                    <p className="text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {denuncia.ciudadano_correo}
                                    </p>
                                )}
                                {denuncia.ciudadano_telefono && (
                                    <p className="text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {denuncia.ciudadano_telefono}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
