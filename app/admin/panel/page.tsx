import Encabezado from "@/componentes/encabezado"
import PanelAdmin from "@/componentes/panel-admin"

export default function PaginaPanelAdmin() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado
        usuarioActual={{
          nombre: "Ana Rodríguez",
          rol: "admin",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <PanelAdmin />
      </div>
    </div>
  )
}
