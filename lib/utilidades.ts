import type { PrioridadDemanda } from "./tipos"

// Función para obtener el color según la prioridad
export function obtenerColorPrioridad(prioridad: PrioridadDemanda): string {
  switch (prioridad) {
    case "critica":
      return "bg-red-100 text-red-800 border-red-200"
    case "alta":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medio":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Función para obtener el texto de la prioridad
export function obtenerTextoPrioridad(prioridad: PrioridadDemanda): string {
  switch (prioridad) {
    case "critica":
      return "CRÍTICA"
    case "alta":
      return "Alta"
    case "medio":
      return "Media"
    default:
      return prioridad
  }
}

// Función para formatear fecha
export function formatearFecha(fecha: string): string {
  const date = new Date(fecha)
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Función para formatear fecha corta
export function formatearFechaCorta(fecha: string): string {
  const date = new Date(fecha)
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}
