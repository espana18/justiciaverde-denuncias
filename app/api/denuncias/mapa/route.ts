import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener todas las denuncias con coordenadas para el mapa
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        d.id,
        d.titulo,
        d.descripcion,
        d.prioridad,
        d.latitud,
        d.longitud,
        d.ubicacion_texto,
        d.creado_en,
        td.nombre as tipo_demanda_nombre
       FROM demanda d
       INNER JOIN tipo_demanda td ON d.tipo_demanda_id = td.id
       WHERE d.publico = true 
       AND d.latitud IS NOT NULL 
       AND d.longitud IS NOT NULL
       ORDER BY d.creado_en DESC`,
    )

    // Obtener primera foto de cada denuncia
    for (const denuncia of rows) {
      const [fotos] = await pool.query<RowDataPacket[]>("SELECT ruta FROM demanda_foto WHERE demanda_id = ? LIMIT 1", [
        denuncia.id,
      ])
      denuncia.foto_principal = fotos.length > 0 ? fotos[0].ruta : null
    }

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error al obtener denuncias para mapa:", error)
    return NextResponse.json({ error: "Error al obtener denuncias para mapa" }, { status: 500 })
  }
}
