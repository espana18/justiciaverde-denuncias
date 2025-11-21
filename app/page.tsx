import Link from "next/link";
import Encabezado from "@/componentes/encabezado";
import TarjetaDenuncia from "@/componentes/tarjeta-denuncia";
import type { Demanda } from "@/lib/tipos";
import MapaClient from "@/componentes/mapa-client";
import ScrollToMapButton from "@/componentes/scroll-to-map-button";
import ConsultorRadicado from "@/componentes/consultor-radicado";

// Función server: obtiene denuncias destacadas
async function obtenerDenunciasDestacadas(): Promise<Demanda[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/denuncias/destacadas`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("[v0] Error al obtener denuncias destacadas:", error);
    return [];
  }
}

export default async function PaginaPrincipal() {
  const denunciasDestacadas = await obtenerDenunciasDestacadas();

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado />

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Fondo de imagen con opacidad */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-100"
          style={{ backgroundImage: "url('/imagen_inicio.jpg')" }}
        ></div>

        {/* Capa de color para contraste */}
        <div className="absolute inset-0 bg-[#0d7c66]/70"></div>

        {/* Contenido */}
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Justicia Verde</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/auth/login"
              className="bg-white text-[#0d7c66] px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2 shadow-md"
            >
              <span>📝</span>
              Hacer una denuncia
            </Link>

            {/* Botón cliente que hace scroll */}
            <ScrollToMapButton />

            <Link
              href="/guia-crear-demanda"
              className="bg-white text-[#0d7c66] px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2 shadow-md"
            >
              <span>📘</span>
              Cómo crear una demanda
            </Link>
          </div>
        </div>
      </section>

      {/* Consultor de Radicado */}
      <section className="py-8 bg-gradient-to-b from-white to-[#f8faf9]">
        <div className="container mx-auto px-4">
          <ConsultorRadicado />
        </div>
      </section>

      {/* Denuncias Recientes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Denuncias recientes</h2>
              <p className="text-gray-600">Conoce los casos más recientes reportados por la comunidad</p>
            </div>
            <Link
              href="auth/login"
              className="bg-[#0d7c66] text-white px-6 py-2 rounded-full hover:bg-[#0a5f4f] transition-colors"
            >
              Ver todas las denuncias
            </Link>
          </div>

          {denunciasDestacadas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {denunciasDestacadas.map((denuncia) => (
                <TarjetaDenuncia key={denuncia.id} denuncia={denuncia} mostrarAcciones={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No hay denuncias disponibles en este momento</p>
            </div>
          )}

          {/* Mapa General */}
          <div id="mapa-denuncias" className="mt-16 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-4">Mapa de denuncias</h2>
            <p className="text-gray-600 mb-6">Visualiza todas las denuncias ambientales reportadas en Colombia</p>
            <div className="h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-300">
              <MapaClient />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">¿Quieres ver todas las denuncias y participar en la comunidad?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Inicia sesión para acceder a todas las funcionalidades, comentar, seguir el progreso de los casos y
              colaborar en la protección del medio ambiente.
            </p>
            <Link
              href="/auth/login"
              className="bg-[#0d7c66] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0a5f4f] transition-colors inline-block"
            >
              Iniciar sesión o registrarse
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
