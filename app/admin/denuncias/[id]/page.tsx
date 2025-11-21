"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from 'next/navigation'
import dynamic from "next/dynamic"
import Encabezado from "@/componentes/encabezado"
import { obtenerUsuarioActual } from "@/lib/auth"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaLarga } from "@/lib/utilidades"
import type { Demanda } from "@/lib/tipos"

const MapaInteractivo = dynamic(() => import("@/componentes/mapa-interactivo"), { ssr: false })

export default function PaginaDenunciaAdmin() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [usuario, setUsuario] = useState<any>(null)
    const [denuncia, setDenuncia] = useState<Demanda | null>(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const usuarioActual = obtenerUsuarioActual()

        if (!usuarioActual || usuarioActual.rol_nombre !== "admin") {
            alert("No tienes permisos para acceder a esta página")
            router.push("/auth/login")
            return
        }

        setUsuario(usuarioActual)
        cargarDenuncia()
    }, [id, router])

    async function cargarDenuncia() {
        try {
            const res = await fetch(`/api/denuncias/${id}`)
            if (res.ok) {
                const data = await res.json()
                setDenuncia(data)
            } else {
                alert("No se pudo cargar la denuncia")
                router.push("/admin/panel")
            }
        } catch (error) {
            console.error("[v0] Error al cargar denuncia:", error)
            alert("Error al cargar la denuncia")
        } finally {
            setCargando(false)
        }
    }

    async function eliminarDenuncia() {
        if (!confirm("¿Estás seguro de eliminar esta denuncia?")) {
            return
        }

        try {
            const res = await fetch(`/api/denuncias/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                alert("Denuncia eliminada correctamente")
                router.push("/admin/panel")
            } else {
                alert("Error al eliminar la denuncia")
            }
        } catch (error) {
            console.error("[v0] Error al eliminar:", error)
            alert("Error al eliminar la denuncia")
        }
    }

    if (cargando) {
        return (
            <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
                <p className="text-gray-500">Cargando...</p>
            </div>
        )
    }

    if (!denuncia || !usuario) {
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
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 text-[#0d7c66] hover:underline flex items-center gap-2"
                    >
                        ← Volver atrás
                    </button>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-3">{denuncia.titulo}</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded text-sm font-medium border ${obtenerColorPrioridad(denuncia.prioridad)}`}
                                    >
                                        {obtenerTextoPrioridad(denuncia.prioridad)}
                                    </span>
                                    <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                                        {denuncia.tipo_demanda_nombre}
                                    </span>
                                    <span
                                        className={`inline-block px-3 py-1 rounded text-sm font-medium ${denuncia.estado === "en_revision"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {denuncia.estado === "en_revision" ? "En revisión" : "Caso tomado"}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={eliminarDenuncia}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Eliminar denuncia
                            </button>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                            <p className="text-gray-700 leading-relaxed">{denuncia.descripcion}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
                            <p className="text-gray-600 mb-4">📍 {denuncia.ubicacion_texto}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Coordenadas: {denuncia.latitud}, {denuncia.longitud}
                            </p>

                            {denuncia.latitud && denuncia.longitud && (
                                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                                    <MapaInteractivo
                                        denuncias={[denuncia]}
                                        centroInicial={[denuncia.latitud, denuncia.longitud]}
                                        zoomInicial={13}
                                    />
                                </div>
                            )}
                        </div>

                        {/* {denuncia.fotos && denuncia.fotos.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Evidencias</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {denuncia.fotos.map((foto, index) => (
                                        <img
                                            key={index}
                                            src={foto.url_foto || "/placeholder.svg"}
                                            alt={`Evidencia ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        />
                                    ))}
                                </div>
                            </div>
                        )} */}

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Información del denunciante</h2>
                            {denuncia.anonima ? (
                                <p className="text-gray-600">Esta denuncia es anónima</p>
                            ) : (
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Nombre:</span> {denuncia.ciudadano_nombre || "No disponible"}</p>
                                    <p><span className="font-medium">Correo:</span> {denuncia.ciudadano_correo || "No disponible"}</p>
                                    <p><span className="font-medium">Teléfono:</span> {denuncia.ciudadano_telefono || "No disponible"}</p>
                                    <p><span className="font-medium">Fecha de denuncia:</span> {formatearFechaLarga(denuncia.creado_en)}</p>
                                </div>
                            )}
                        </div>

                        {denuncia.revisores && denuncia.revisores.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h2 className="text-xl font-semibold mb-3">Revisor asignado</h2>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Nombre:</span> {denuncia.revisores[0].nombre_completo}</p>
                                    <p><span className="font-medium">Correo:</span> {denuncia.revisores[0].correo}</p>
                                    <p><span className="font-medium">Teléfono:</span> {denuncia.revisores[0].telefono || "No disponible"}</p>
                                    {/* <p><span className="font-medium">Grupo:</span> {denuncia.revisores[0].grupo || "No especificado"}</p> */}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
