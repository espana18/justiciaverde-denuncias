import Encabezado from "@/componentes/encabezado"
import FormularioDenuncia from "@/componentes/formulario-denuncia"

export default function PaginaCrearDenuncia() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-2">Crear denuncia</h1>
            <p className="text-gray-600 mb-8">
              Completa el formulario para reportar un delito ambiental. Tu denuncia será visible públicamente.
            </p>

            <FormularioDenuncia />
          </div>
        </div>
      </div>
    </div>
  )
}
