import Encabezado from "@/componentes/encabezado"
import MapaInteractivo from "@/componentes/mapa-interactivo"

export default function PaginaMapa() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col">
      <Encabezado />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Mapa de denuncias</h1>
            <p className="text-gray-600">
              Aquí es la página donde se verá un mapa de todas las denuncias realizadas. Mapa General.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <MapaInteractivo />
        </div>
      </div>
    </div>
  )
}
