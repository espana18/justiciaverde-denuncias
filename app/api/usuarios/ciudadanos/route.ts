import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener lista de ciudadanos con sus estadísticas
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        u.id,
        u.nombre_completo,
        u.correo,
        u.creado_en,
        COUNT(d.id) as total_denuncias
       FROM usuario u
       LEFT JOIN demanda d ON u.id = d.ciudadano_id
       WHERE u.rol_id = 2
       GROUP BY u.id, u.nombre_completo, u.correo, u.creado_en
       HAVING total_denuncias > 0
       ORDER BY total_denuncias DESC`,
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error al obtener ciudadanos:", error)
    return NextResponse.json({ error: "Error al obtener ciudadanos" }, { status: 500 })
  }
}
