"use client"

import type React from "react"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import type { TipoDemanda } from "@/lib/tipos"
import { obtenerUsuarioActual } from "@/lib/auth"
import { toast } from "sonner"
import { Copy, Check } from 'lucide-react'

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
  const [numeroRadicadoGenerado, setNumeroRadicadoGenerado] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  // Datos del formulario
  const [tipoDemandaId, setTipoDemandaId] = useState("")
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState<"medio" | "alta" | "critica">("medio")
  const [anonima, setAnonima] = useState(false)
  const [ubicacionTexto, setUbicacionTexto] = useState("")
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | null>(null)
  const [archivos, setArchivos] = useState<File[]>([])

  // Sincronizar ubicacionTexto con coordenadas en tiempo real (para clics en mapa y GPS)
  useEffect(() => {
    if (coordenadas) {
      const { lat, lng } = coordenadas
      setUbicacionTexto(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
  }, [coordenadas])

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

  const copiarRadicado = () => {
    if (numeroRadicadoGenerado) {
      navigator.clipboard.writeText(numeroRadicadoGenerado)
      setCopiado(true)
      toast.success("Número de radicado copiado")
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  // Enviar formulario
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()

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
        // ciudadano_id: anonima ? null : usuario?.id || null,
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

      console.log('Payload enviado en creación:', datos)
      console.log('anonima en estado:', anonima)  // Debug: Debería ser true si activaste el toggle

      const res = await fetch('/api/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (res.ok) {
        const resultado = await res.json()
        setNumeroRadicadoGenerado(resultado.numero_radicado)
        toast.success('¡Denuncia creada exitosamente!');
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

  if (numeroRadicadoGenerado) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">¡Denuncia creada exitosamente!</h2>
        <p className="text-gray-600">Tu denuncia ha sido registrada correctamente. Guarda este número de radicado para consultar el estado:</p>

        <div className="bg-[#0d7c66]/10 border-2 border-[#0d7c66] rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Número de radicado:</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl font-mono font-bold text-[#0d7c66]">{numeroRadicadoGenerado}</p>
            <button
              onClick={copiarRadicado}
              className="p-2 hover:bg-[#0d7c66]/20 rounded-lg transition-colors"
              title="Copiar"
            >
              {copiado ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-[#0d7c66]" />}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 Información importante:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Guarda este número para consultar el estado de tu denuncia</li>
            <li>Puedes consultarlo desde la página principal sin iniciar sesión</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => router.push('/ciudadano/panel')}
            className="bg-[#0d7c66] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors"
          >
            Ir a mi panel
          </button>
        </div>
      </div>
    )
  }

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
        <p className="text-sm text-gray-500 mt-1">Con el botón de Mi ubicación, este tomará tu ubicación actual, además puedes manipular el mapa y señalar manualmente la ubicación. El campo se actualizará automáticamente con las coordenadas.</p>
        {/* Mapa para seleccionar ubicación */}
        <div className="h-96 rounded-lg overflow-hidden border border-gray-300 mt-8">
          <SelectorUbicacionMapa coordenadas={coordenadas} onCambiarCoordenadas={setCoordenadas} />
        </div>
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
          onClick={() => {
            setAnonima(!anonima)
            console.log('Toggle anónimo cambiado a:', !anonima)  // ← Debug temporal: Remuévelo después
          }}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${anonima ? "bg-[#0d7c66]" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${anonima ? "translate-x-7" : "translate-x-1"
              }`}
          />
        </button>
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