import Link from "next/link"
import Encabezado from "@/componentes/encabezado"

export default function GuiaCrearDemandaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Encabezado />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-[#0d7c66] mb-6">¿Cómo crear una denuncia ambiental?</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Sigue esta guía paso a paso para reportar delitos ambientales de manera efectiva y contribuir a la protección de
                    nuestro medio ambiente.
                </p>

                <div className="space-y-8">
                    {/* Paso 1 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Crea una cuenta o inicia sesión</h2>
                                <p className="text-gray-700 mb-3">
                                    Para reportar una denuncia, necesitas tener una cuenta en Justicia Verde. Si aún no tienes una, puedes
                                    registrarte de forma gratuita.
                                </p>
                                <Link
                                    href="/auth/registro"
                                    className="inline-block bg-[#0d7c66] text-white px-6 py-2 rounded-lg hover:bg-[#0a5f4f] transition-colors"
                                >
                                    Crear cuenta
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Selecciona el tipo de delito ambiental</h2>
                                <p className="text-gray-700 mb-3">Elige la categoría que mejor describe el delito que estás reportando:</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>
                                        <strong>Deforestación:</strong> Tala ilegal y pérdida de cobertura boscosa
                                    </li>
                                    <li>
                                        <strong>Minería ilegal:</strong> Extracción no autorizada de minerales
                                    </li>
                                    <li>
                                        <strong>Contaminación de agua:</strong> Vertimientos y afectaciones a fuentes hídricas
                                    </li>
                                    <li>
                                        <strong>Tráfico de fauna:</strong> Captura y comercio ilegal de especies
                                    </li>
                                    <li>
                                        <strong>Incendios forestales:</strong> Quemas e incendios en áreas naturales
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Define la prioridad del caso</h2>
                                <p className="text-gray-700 mb-3">
                                    Indica qué tan urgente es la situación para ayudarnos a priorizar las denuncias:
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                            Media
                                        </span>
                                        <span className="text-gray-700">Situación que requiere atención pero no es inmediata</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                            Alta
                                        </span>
                                        <span className="text-gray-700">Daño ambiental significativo en progreso</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                            Crítica
                                        </span>
                                        <span className="text-gray-700">Emergencia ambiental que requiere acción inmediata</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paso 4 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                4
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Describe los hechos detalladamente</h2>
                                <p className="text-gray-700 mb-3">
                                    Proporciona la mayor cantidad de información posible sobre lo que está ocurriendo:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>¿Qué está sucediendo? Describe el delito ambiental de manera clara</li>
                                    <li>¿Cuándo ocurrió? Fecha y hora aproximada del incidente</li>
                                    <li>¿Quiénes están involucrados? Personas, empresas o entidades responsables (si los conoces)</li>
                                    <li>¿Cuál es el impacto? Describe el daño al medio ambiente y las comunidades afectadas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Paso 5 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                5
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Agrega evidencia fotográfica o video</h2>
                                <p className="text-gray-700 mb-3">
                                    Las imágenes y videos son fundamentales para validar tu denuncia. Intenta incluir:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Fotos claras del área afectada desde diferentes ángulos</li>
                                    <li>Videos que muestren la actividad ilegal en curso (si es seguro hacerlo)</li>
                                    <li>Imágenes del antes y después del daño ambiental</li>
                                    <li>Evidencia de maquinaria, vehículos o personas involucradas</li>
                                </ul>
                                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                    ⚠️ <strong>Importante:</strong> Solo toma fotos o videos si es seguro hacerlo. Tu seguridad es lo primero.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Paso 6 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                6
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Marca la ubicación exacta en el mapa</h2>
                                <p className="text-gray-700 mb-3">
                                    Utiliza el mapa interactivo para indicar dónde está ocurriendo el delito ambiental:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Haz clic en el mapa para marcar la ubicación exacta</li>
                                    <li>Usa el botón "Mi ubicación" si estás en el lugar del incidente</li>
                                    <li>Escribe el nombre del lugar o referencias geográficas cercanas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Paso 7 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                7
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Decide si quieres ser anónimo</h2>
                                <p className="text-gray-700 mb-3">
                                    Puedes elegir si tu identidad será visible o no en la denuncia pública:
                                </p>
                                <div className="space-y-3">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 mb-1">✅ Denuncia con identidad</p>
                                        <p className="text-sm text-gray-600">
                                            Tu nombre y correo serán visibles. Los revisores podrán contactarte para más información.
                                        </p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 mb-1">🕶️ Denuncia anónima</p>
                                        <p className="text-sm text-gray-600">
                                            Tu identidad se mantendrá oculta. La denuncia se publicará sin tus datos personales.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paso 8 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d7c66] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                8
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">Envía tu denuncia y haz seguimiento</h2>
                                <p className="text-gray-700 mb-3">
                                    Una vez enviada tu denuncia, nuestro equipo de revisores la evaluará:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Tu denuncia aparecerá en el mapa público de Justicia Verde</li>
                                    <li>Los revisores especializados tomarán el caso y te notificarán</li>
                                    <li>Podrás ver el progreso de tu denuncia desde tu panel de ciudadano</li>
                                    <li>Recibirás actualizaciones cuando haya cambios en el estado del caso</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-3">¿Listo para hacer tu denuncia?</h3>
                    <p className="text-gray-700 mb-6">
                        Únete a nuestra comunidad y ayúdanos a proteger el medio ambiente de Colombia
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-block bg-[#0d7c66] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0a5f4f] transition-colors"
                    >
                        Crear denuncia ahora
                    </Link>
                </div>
            </div>
        </div>
    )
}
