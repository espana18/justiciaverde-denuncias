"use client"

import type React from "react"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import type { TipoDemanda } from "@/lib/tipos"
import { obtenerUsuarioActual } from "@/lib/auth"
import { toast } from "sonner"

// Importar selector de mapa dinámicamente
const SelectorUbicacionMapa = dynamic(() => import("./selector-ubicacion-mapa"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">Cargando mapa...</div>
  ),
})

export default function FormularioDenuncia() {
  const router = useRouter()
  const [tiposDemanda, setTiposDemanda] = useState<TipoDemanda[]>([])
  const [enviando, setEnviando] = useState(false)

  // Datos del formulario
  const [tipoDemandaId, setTipoDemandaId] = useState("")
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState<"medio" | "alta" | "critica">("medio")
  const [anonima, setAnonima] = useState(false)
  const [ubicacionTexto, setUbicacionTexto] = useState("")
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | null>(null)
  const [archivos, setArchivos] = useState<File[]>([])

  // Cargar tipos de demanda
  useEffect(() => {
    async function cargarTipos() {
      try {
        const res = await fetch("/api/tipos-demanda")
        if (res.ok) {
          const data = await res.json()
          setTiposDemanda(data)
          if (data.length > 0) {
            setTipoDemandaId(data[0].id.toString())
          }
        }
      } catch (error) {
        console.error("[v0] Error al cargar tipos de demanda:", error);
        toast.error('No se pudieron cargar los tipos de denuncia');
      }
    }
    cargarTipos()
  }, [])

  // Obtener ubicación actual del usuario
  const obtenerUbicacionActual = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordenadas({ lat: position.coords.latitude, lng: position.coords.longitude });
          setUbicacionTexto(
            `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          );
          toast.success('Ubicación detectada correctamente');
        },
      );
    } else {
      toast.error('Tu navegador no soporta geolocalización');
    }
  };

  // Manejar cambio de archivos
  const manejarArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivos(Array.from(e.target.files))
    }
  }

  // Enviar formulario
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()

    // // ✅ Validación: todos menos evidencias
    // if (!titulo.trim() || !descripcion.trim() || !tipoDemandaId || !ubicacionTexto.trim()) {
    //   toast.error('Por favor completa todos los campos obligatorios');
    //   return;
    // }
    if (!coordenadas) {
      toast.error('Selecciona una ubicación en el mapa');
      return;
    }

    setEnviando(true);
    try {
      const usuario = obtenerUsuarioActual();

      const fotosData = archivos.map((archivo) => ({
        ruta: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(archivo.name)}`,
        descripcion: archivo.name,
      }));

      const datos = {
        ciudadano_id: anonima ? null : usuario?.id || null,
        titulo,
        descripcion,
        tipo_demanda_id: Number.parseInt(tipoDemandaId),
        prioridad,
        anonima,
        ubicacion_texto: ubicacionTexto || null,
        latitud: coordenadas?.lat || null,
        longitud: coordenadas?.lng || null,
        fotos: fotosData,
      };

      const res = await fetch('/api/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (res.ok) {
        toast.success('Denuncia creada exitosamente');
        router.push('/ciudadano/panel');
      } else {
        const error = await res.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('[v0] Error al crear denuncia:', error);
      toast.error('Ocurrió un error al crear la denuncia');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="space-y-6">
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
          placeholder="Ej: Tala ilegal en el Parque Nacional"
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
          placeholder="Cuenta qué ocurrió, cuándo y quiénes podrían estar implicados."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent resize-none"
          required
        />
        <p className="text-sm text-gray-500 mt-1">Cuenta qué ocurrió, cuándo y quiénes podrían estar implicados.</p>
      </div>

      {/* Evidencia (fotos) */}
      <div>
        <label htmlFor="evidencia" className="block text-sm font-semibold mb-2">
          Evidencia (fotos) --opcional--
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0d7c66] transition-colors">
          <input
            type="file"
            id="evidencia"
            multiple
            accept="image/*,video/*"
            onChange={manejarArchivos}
            className="hidden"
          />
          <label htmlFor="evidencia" className="cursor-pointer">
            <div className="text-[#0d7c66] mb-2">📁 Elegir archivos</div>
            <p className="text-sm text-gray-500">
              {archivos.length > 0 ? `${archivos.length} archivo(s) seleccionado(s)` : "Sin archivos"}
            </p>
          </label>
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <label htmlFor="ubicacion" className="block text-sm font-semibold mb-2">
          Ubicación <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="ubicacion"
            // value={ubicacionTexto}
            // onChange={(e) => setUbicacionTexto(e.target.value)}
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

        {/* Mapa para seleccionar ubicación */}
        <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
          <SelectorUbicacionMapa coordenadas={coordenadas} onCambiarCoordenadas={setCoordenadas} />
        </div>
      </div>

      {/* Anonimato */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <label htmlFor="anonima" className="flex items-center gap-3 cursor-pointer flex-1">
          <div className="relative">
            <input
              type="checkbox"
              id="anonima"
              checked={anonima}
              onChange={(e) => setAnonima(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#0d7c66] transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
          <div className="flex-1">
            <span className="font-semibold">Denuncia anónima</span>
            <p className="text-sm text-gray-600">Si se activa. Tu identidad no será revelada en esta denuncia.</p>
          </div>
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={enviando}
          className="flex-1 bg-[#0d7c66] text-white py-3 rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {enviando ? "Enviando..." : "Enviar denuncia"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
