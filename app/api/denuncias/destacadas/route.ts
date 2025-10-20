import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener las 3 denuncias más recientes para la página principal
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        d.*,
        td.nombre as tipo_demanda_nombre,
        u.nombre_completo as ciudadano_nombre
       FROM demanda d
       INNER JOIN tipo_demanda td ON d.tipo_demanda_id = td.id
       LEFT JOIN usuario u ON d.ciudadano_id = u.id
       WHERE d.publico = true
       ORDER BY d.creado_en DESC
       LIMIT 3`,
    )

    // Obtener fotos para cada denuncia
    for (const denuncia of rows) {
      const [fotos] = await pool.query<RowDataPacket[]>("SELECT * FROM demanda_foto WHERE demanda_id = ? LIMIT 1", [
        denuncia.id,
      ])
      denuncia.fotos = fotos
    }

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error al obtener denuncias destacadas:", error)
    return NextResponse.json({ error: "Error al obtener denuncias destacadas" }, { status: 500 })
  }
}
