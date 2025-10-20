import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener estadísticas de un revisor específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Denuncias disponibles (no asignadas a este revisor)
    const [disponibles] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM demanda d
       WHERE d.estado = 'en_revision'
       AND NOT EXISTS (
         SELECT 1 FROM demanda_revisor dr 
         WHERE dr.demanda_id = d.id AND dr.revisor_id = ?
       )`,
      [id],
    )

    // Denuncias en proceso (asignadas a este revisor con estado en_revision)
    const [enProceso] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM demanda d
       INNER JOIN demanda_revisor dr ON d.id = dr.demanda_id
       WHERE dr.revisor_id = ? AND d.estado = 'en_revision'`,
      [id],
    )

    // Denuncias resueltas (asignadas a este revisor con estado tomaron_el_caso)
    const [resueltas] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM demanda d
       INNER JOIN demanda_revisor dr ON d.id = dr.demanda_id
       WHERE dr.revisor_id = ? AND d.estado = 'tomaron_el_caso'`,
      [id],
    )

    // Total de casos (todas las denuncias asignadas)
    const [totalCasos] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM demanda_revisor
       WHERE revisor_id = ?`,
      [id],
    )

    return NextResponse.json({
      disponibles: disponibles[0].total,
      en_proceso: enProceso[0].total,
      resueltas: resueltas[0].total,
      total_casos: totalCasos[0].total,
    })
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas revisor:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
