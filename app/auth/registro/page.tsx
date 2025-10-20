"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PaginaRegistro() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        nombre_completo: "",
        correo: "",
        contrasena: "",
        confirmar_contrasena: "",
    })
    const [cargando, setCargando] = useState(false)

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const manejarRegistro = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.contrasena !== formData.confirmar_contrasena) {
            alert("Las contraseñas no coinciden")
            return
        }

        if (formData.contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres")
            return
        }

        setCargando(true)

        try {
            const res = await fetch("/api/auth/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre_completo: formData.nombre_completo,
                    correo: formData.correo,
                    contrasena: formData.contrasena,
                }),
            })

            if (res.ok) {
                alert("Registro exitoso. Ahora puedes iniciar sesión")
                router.push("/auth/login")
            } else {
                const error = await res.json()
                alert(`Error: ${error.error}`)
            }
        } catch (error) {
            console.error("[v0] Error en registro:", error)
            alert("Error al registrarse")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d7c66] to-[#0a5f4f] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#0d7c66] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🌿</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Justicia Verde</h1>
                    <p className="text-gray-600">Crea tu cuenta</p>
                </div>

                <form onSubmit={manejarRegistro} className="space-y-6">
                    <div>
                        <label htmlFor="nombre_completo" className="block text-sm font-semibold mb-2">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            id="nombre_completo"
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={manejarCambio}
                            placeholder="Juan Pérez"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="correo" className="block text-sm font-semibold mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={manejarCambio}
                            placeholder="tu@correo.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="contrasena" className="block text-sm font-semibold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={manejarCambio}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                    </div>

                    <div>
                        <label htmlFor="confirmar_contrasena" className="block text-sm font-semibold mb-2">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmar_contrasena"
                            name="confirmar_contrasena"
                            value={formData.confirmar_contrasena}
                            onChange={manejarCambio}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-[#0d7c66] text-white py-3 rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {cargando ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/auth/login" className="text-[#0d7c66] font-semibold hover:underline">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-600 hover:text-[#0d7c66]">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
