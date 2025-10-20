'use client';

import dynamic from 'next/dynamic';

const MapaInteractivo = dynamic(() => import('@/componentes/mapa-interactivo'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Cargando mapa...</p>
        </div>
    ),
});

export default function MapaClient() {
    return <MapaInteractivo />;
}
