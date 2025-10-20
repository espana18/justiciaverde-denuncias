import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener estadísticas generales para el panel de administración
export async function GET(request: NextRequest) {
  try {
    // Total de denuncias
    const [totalDenuncias] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM demanda")

    // Usuarios activos (con al menos una denuncia o asignación)
    const [usuariosActivos] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT u.id) as total
       FROM usuario u
       WHERE u.rol_id IN (2, 3)
       AND (
         EXISTS (SELECT 1 FROM demanda d WHERE d.ciudadano_id = u.id)
         OR EXISTS (SELECT 1 FROM demanda_revisor dr WHERE dr.revisor_id = u.id)
       )`,
    )

    // Casos resueltos
    const [casosResueltos] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM demanda WHERE estado = 'tomaron_el_caso'",
    )

    // Casos en proceso
    const [enProceso] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM demanda WHERE estado = 'en_revision'",
    )

    return NextResponse.json({
      total_denuncias: totalDenuncias[0].total,
      usuarios_activos: usuariosActivos[0].total,
      casos_resueltos: casosResueltos[0].total,
      en_proceso: enProceso[0].total,
    })
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas admin:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
