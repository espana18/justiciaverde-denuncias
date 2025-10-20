"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import type { Demanda, TipoDemanda } from "@/lib/tipos"

const SelectorUbicacionMapa = dynamic(() => import("@/componentes/selector-ubicacion-mapa"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">Cargando mapa...</div>
    ),
})

export default function EditarDenunciaPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [denuncia, setDenuncia] = useState<Demanda | null>(null)
    const [tiposDemanda, setTiposDemanda] = useState<TipoDemanda[]>([])
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [cambiosRealizados, setCambiosRealizados] = useState(false)

    // Datos del formulario
    const [tipoDemandaId, setTipoDemandaId] = useState("")
    const [titulo, setTitulo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [prioridad, setPrioridad] = useState<"medio" | "alta" | "critica">("medio")
    const [ubicacionTexto, setUbicacionTexto] = useState("")
    const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | null>(null)
    const [anonima, setAnonima] = useState(false)

    // Cargar denuncia y tipos de demanda
    useEffect(() => {
        async function cargarDatos() {
            try {
                // Cargar tipos de demanda
                const resTipos = await fetch("/api/tipos-demanda")
                if (resTipos.ok) {
                    const tipos = await resTipos.json()
                    setTiposDemanda(tipos)
                }

                // Cargar denuncia
                const resDenuncia = await fetch(`/api/denuncias/${resolvedParams.id}`)
                if (resDenuncia.ok) {
                    const data = await resDenuncia.json()
                    setDenuncia(data)
                    setTipoDemandaId(data.tipo_demanda_id.toString())
                    setTitulo(data.titulo)
                    setDescripcion(data.descripcion)
                    setPrioridad(data.prioridad)
                    setUbicacionTexto(data.ubicacion_texto || "")
                    setAnonima(data.anonima)
                    if (data.latitud && data.longitud) {
                        setCoordenadas({ lat: data.latitud, lng: data.longitud })
                    }
                } else {
                    alert("No se pudo cargar la denuncia")
                    router.push("/ciudadano/panel")
                }
            } catch (error) {
                console.error("[v0] Error al cargar datos:", error)
                alert("Error al cargar la denuncia")
            } finally {
                setCargando(false)
            }
        }
        cargarDatos()
    }, [resolvedParams.id, router])

    // Detectar cambios
    useEffect(() => {
        if (!denuncia) return

        const hayCambios =
            tipoDemandaId !== denuncia.tipo_demanda_id.toString() ||
            titulo !== denuncia.titulo ||
            descripcion !== denuncia.descripcion ||
            prioridad !== denuncia.prioridad ||
            ubicacionTexto !== (denuncia.ubicacion_texto || "") ||
            coordenadas?.lat !== denuncia.latitud ||
            coordenadas?.lng !== denuncia.longitud ||
            anonima !== denuncia.anonima

        setCambiosRealizados(hayCambios)
    }, [tipoDemandaId, titulo, descripcion, prioridad, ubicacionTexto, coordenadas, anonima, denuncia])

    // Obtener ubicación actual
    const obtenerUbicacionActual = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordenadas({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                    setUbicacionTexto(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
                },
                (error) => {
                    console.error("[v0] Error al obtener ubicación:", error)
                    alert("No se pudo obtener tu ubicación")
                },
            )
        }
    }

    // Guardar cambios
    const manejarActualizacion = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!cambiosRealizados) {
            alert("No hay cambios para guardar")
            return
        }

        setGuardando(true)

        try {
            const datos = {
                tipo_demanda_id: Number.parseInt(tipoDemandaId),
                titulo,
                descripcion,
                prioridad,
                ubicacion_texto: ubicacionTexto || null,
                latitud: coordenadas?.lat || null,
                longitud: coordenadas?.lng || null,
                anonima,
            }

            const res = await fetch(`/api/denuncias/${resolvedParams.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            })

            if (res.ok) {
                alert("Denuncia actualizada exitosamente")
                router.push("/ciudadano/panel")
            } else {
                const error = await res.json()
                alert(`Error: ${error.error}`)
            }
        } catch (error) {
            console.error("[v0] Error al actualizar denuncia:", error)
            alert("Error al actualizar la denuncia")
        } finally {
            setGuardando(false)
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Denuncia</h1>

                    <form onSubmit={manejarActualizacion} className="space-y-6">
                        {/* Tipo de denuncia */}
                        <div>
                            <label htmlFor="tipo" className="block text-sm font-semibold mb-2">
                                Tipo de denuncia <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="tipo"
                                value={tipoDemandaId}
                                onChange={(e) => setTipoDemandaId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                                required
                            >
                                {tiposDemanda.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Prioridad */}
                        <div>
                            <label htmlFor="prioridad" className="block text-sm font-semibold mb-2">
                                Prioridad
                            </label>
                            <select
                                id="prioridad"
                                value={prioridad}
                                onChange={(e) => setPrioridad(e.target.value as "medio" | "alta" | "critica")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                            >
                                <option value="medio">Media</option>
                                <option value="alta">Alta</option>
                                <option value="critica">Crítica</option>
                            </select>
                        </div>

                        {/* Título */}
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-semibold mb-2">
                                Título de la denuncia <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent resize-none"
                                required
                            />
                        </div>

                        {/* Ubicación */}
                        <div>
                            <label htmlFor="ubicacion" className="block text-sm font-semibold mb-2">
                                Ubicación
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    id="ubicacion"
                                    value={ubicacionTexto}
                                    onChange={(e) => setUbicacionTexto(e.target.value)}
                                    placeholder="Ej: Parque Central Bogotá"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={obtenerUbicacionActual}
                                    className="px-4 py-2 bg-[#0d7c66] text-white rounded-lg hover:bg-[#0a5f4f] transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    📍 Mi ubicación
                                </button>
                            </div>

                            {/* Toggle anónimo */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Denuncia anónima</p>
                                    <p className="text-sm text-gray-600">
                                        Si está desactivado mostrará info de sus datos con los que se registró
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAnonima(!anonima)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${anonima ? "bg-[#0d7c66]" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${anonima ? "translate-x-7" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Mapa */}
                            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                                <SelectorUbicacionMapa coordenadas={coordenadas} onCambiarCoordenadas={setCoordenadas} />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={guardando || !cambiosRealizados}
                                className="flex-1 bg-[#0d7c66] text-white py-3 rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {guardando ? "Guardando..." : cambiosRealizados ? "Actualizar denuncia" : "Sin cambios"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/ciudadano/panel")}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
