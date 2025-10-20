"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import type { Demanda } from "@/lib/tipos"
import { obtenerUsuarioActual } from "@/lib/auth"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFecha } from "@/lib/utilidades"

const MapaInteractivo = dynamic(() => import("@/componentes/mapa-interactivo"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">Cargando mapa...</div>
    ),
})

export default function DetallesDenunciaRevisorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [denuncia, setDenuncia] = useState<Demanda | null>(null)
    const [cargando, setCargando] = useState(true)
    const [tomandoCaso, setTomandoCaso] = useState(false)

    useEffect(() => {
        async function cargarDenuncia() {
            try {
                const res = await fetch(`/api/denuncias/${resolvedParams.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setDenuncia(data)
                } else {
                    alert("No se pudo cargar la denuncia")
                    router.push("/revisor/panel")
                }
            } catch (error) {
                console.error("[v0] Error al cargar denuncia:", error)
                alert("Error al cargar la denuncia")
            } finally {
                setCargando(false)
            }
        }
        cargarDenuncia()
    }, [resolvedParams.id, router])

    const tomarCaso = async () => {
        const usuario = obtenerUsuarioActual()
        if (!usuario) {
            alert("Debes iniciar sesión")
            return
        }

        setTomandoCaso(true)

        try {
            const res = await fetch(`/api/denuncias/${resolvedParams.id}/asignar-revisor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ revisor_id: usuario.id }),
            })

            if (res.ok) {
                alert("Caso tomado exitosamente")
                router.push("/revisor/panel")
            } else {
                const error = await res.json()
                alert(`Error: ${error.error}`)
            }
        } catch (error) {
            console.error("[v0] Error al tomar caso:", error)
            alert("Error al tomar el caso")
        } finally {
            setTomandoCaso(false)
        }
    }

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d7c66] mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando denuncia...</p>
                </div>
            </div>
        )
    }

    if (!denuncia) {
        return null
    }

    const denunciaParaMapa = denuncia.latitud && denuncia.longitud ? [denuncia] : []

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Encabezado */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-balance">{denuncia.titulo}</h1>

                        <div className="flex gap-2 flex-wrap mb-4">
                            <span className={`text-sm px-3 py-1 rounded-full border ${obtenerColorPrioridad(denuncia.prioridad)}`}>
                                {obtenerTextoPrioridad(denuncia.prioridad)}
                            </span>
                            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                {denuncia.tipo_demanda_nombre}
                            </span>
                            <span
                                className={`text-sm px-3 py-1 rounded-full ${denuncia.estado === "tomaron_el_caso"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    }`}
                            >
                                {denuncia.estado === "tomaron_el_caso" ? "En proceso" : "Disponible"}
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                        <p className="text-gray-700 leading-relaxed">{denuncia.descripcion}</p>
                    </div>

                    {/* Ubicación */}
                    {denuncia.ubicacion_texto && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
                            <p className="text-gray-700 mb-4">📍 {denuncia.ubicacion_texto}</p>

                            {denuncia.latitud && denuncia.longitud && (
                                <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                                    <MapaInteractivo denuncias={denunciaParaMapa} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Información del denunciante */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Información del denunciante</h2>
                        {denuncia.anonima ? (
                            <p className="text-gray-600">🔒 Denuncia anónima - Datos del ciudadano ocultos</p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Nombre:</span> {denuncia.ciudadano_nombre || "No disponible"}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Correo:</span> {denuncia.ciudadano_correo || "No disponible"}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Teléfono:</span> {denuncia.ciudadano_telefono || "No disponible"}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Fecha de denuncia:</span> {formatearFecha(denuncia.creado_en)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Evidencias */}
                    {(denuncia as any).fotos && (denuncia as any).fotos.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Evidencias</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(denuncia as any).fotos.map((foto: any, index: number) => (
                                    <img
                                        key={index}
                                        src={foto.ruta || "/placeholder.svg"}
                                        alt={foto.descripcion || `Evidencia ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            onClick={() => router.push("/revisor/panel")}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            ← Volver atrás
                        </button>

                        {denuncia.estado === "en_revision" && (
                            <button
                                onClick={tomarCaso}
                                disabled={tomandoCaso}
                                className="flex-1 bg-[#0d7c66] text-white py-3 rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {tomandoCaso ? "Tomando caso..." : "✓ Tomar caso"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
