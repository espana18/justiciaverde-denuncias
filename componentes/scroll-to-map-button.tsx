'use client';

import { useCallback } from 'react';

export default function ScrollToMapButton() {
    const handleClick = useCallback(() => {
        const el = document.getElementById('mapa-denuncias');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <button
            onClick={handleClick}
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            aria-label="Mirar mapa de demandas actuales"
            type="button"
        >
            <span>🗺️</span>
            Mirar mapa de demandas actuales
        </button>
    );
}
