import Link from "next/link"
import type { Demanda } from "@/lib/tipos"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaCorta } from "@/lib/utilidades"

interface TarjetaDenunciaProps {
  denuncia: Demanda
  mostrarAcciones?: boolean
}

export default function TarjetaDenuncia({ denuncia, mostrarAcciones = false }: TarjetaDenunciaProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {denuncia.fotos && denuncia.fotos.length > 0 && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={denuncia.fotos[0].ruta || "/placeholder.svg"}
            alt={denuncia.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${obtenerColorPrioridad(denuncia.prioridad)}`}>
            {obtenerTextoPrioridad(denuncia.prioridad)}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {denuncia.tipo_demanda_nombre}
          </span>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2">{denuncia.titulo}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{denuncia.descripcion}</p>

        {denuncia.ubicacion_texto && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <span>📍</span>
            <span className="line-clamp-1">{denuncia.ubicacion_texto}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span>❤️ 456</span>
          <span>💬 1</span>
          <span>👁️ 2341 vistas</span>
        </div>

        <div className="text-xs text-gray-400 mb-3">{formatearFechaCorta(denuncia.creado_en)}</div>

        {mostrarAcciones && (
          <Link
            href={'auth/login'}
            className="block w-full text-center bg-[#0d7c66] text-white py-2 rounded-lg hover:bg-[#0a5f4f] transition-colors"
          >
            Ver detalles
          </Link>
        )}
      </div>
    </div>
  )
}
