import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener estadísticas de un ciudadano específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Total de denuncias
    const [totalDenuncias] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM demanda WHERE ciudadano_id = ?",
      [id],
    )

    // Denuncias en proceso
    const [enProceso] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM demanda WHERE ciudadano_id = ? AND estado = 'en_revision'",
      [id],
    )

    // Denuncias resueltas
    const [resueltas] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM demanda WHERE ciudadano_id = ? AND estado = 'tomaron_el_caso'",
      [id],
    )

    return NextResponse.json({
      total_denuncias: totalDenuncias[0].total,
      en_proceso: enProceso[0].total,
      resueltas: resueltas[0].total,
    })
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas ciudadano:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
