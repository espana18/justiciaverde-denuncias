import Encabezado from "@/componentes/encabezado"
import ListaDenuncias from "@/componentes/lista-denuncias"

export default function PaginaDenuncias() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Todas las denuncias</h1>
          <p className="text-gray-600">Explora todas las denuncias ambientales reportadas por la comunidad</p>
        </div>

        <ListaDenuncias />
      </div>
    </div>
  )
}
