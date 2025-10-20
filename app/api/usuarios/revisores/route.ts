import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener lista de revisores con sus estadísticas
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        u.id,
        u.nombre_completo,
        u.correo,
        u.telefono,
        COUNT(DISTINCT dr.demanda_id) as casos_activos,
        COUNT(DISTINCT CASE WHEN d.estado = 'tomaron_el_caso' THEN dr.demanda_id END) as casos_resueltos
       FROM usuario u
       LEFT JOIN demanda_revisor dr ON u.id = dr.revisor_id
       LEFT JOIN demanda d ON dr.demanda_id = d.id
       WHERE u.rol_id = 3
       GROUP BY u.id, u.nombre_completo, u.correo, u.telefono
       ORDER BY casos_activos DESC`,
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error al obtener revisores:", error)
    return NextResponse.json({ error: "Error al obtener revisores" }, { status: 500 })
  }
}
