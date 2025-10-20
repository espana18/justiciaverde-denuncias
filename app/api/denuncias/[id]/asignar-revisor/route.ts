import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { ResultSetHeader, RowDataPacket } from "mysql2"

// Asignar un revisor a una denuncia
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { revisor_id } = await request.json()

    if (!revisor_id) {
      return NextResponse.json({ error: "revisor_id es requerido" }, { status: 400 })
    }

    // Verificar si ya está asignado
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM demanda_revisor WHERE demanda_id = ? AND revisor_id = ?",
      [id, revisor_id],
    )

    if (existing.length > 0) {
      return NextResponse.json({ error: "El revisor ya está asignado a esta denuncia" }, { status: 409 })
    }

    // Asignar revisor
    await pool.query<ResultSetHeader>("INSERT INTO demanda_revisor (demanda_id, revisor_id) VALUES (?, ?)", [
      id,
      revisor_id,
    ])

    // Actualizar estado de la denuncia
    await pool.query<ResultSetHeader>("UPDATE demanda SET estado = 'tomaron_el_caso' WHERE id = ?", [id])

    // Obtener información de la denuncia y revisor para crear notificación
    const [denunciaRows] = await pool.query<RowDataPacket[]>("SELECT titulo, ciudadano_id FROM demanda WHERE id = ?", [
      id,
    ])
    const [revisorRows] = await pool.query<RowDataPacket[]>("SELECT nombre_completo FROM usuario WHERE id = ?", [
      revisor_id,
    ])

    if (denunciaRows.length > 0 && revisorRows.length > 0) {
      const denuncia = denunciaRows[0]
      const revisor = revisorRows[0]

      // Crear notificación para el ciudadano
      await pool.query<ResultSetHeader>(
        `INSERT INTO notificacion (usuario_id, demanda_id, revisor_id, titulo, mensaje)
         VALUES (?, ?, ?, ?, ?)`,
        [
          denuncia.ciudadano_id,
          id,
          revisor_id,
          "Revisor asignado a tu denuncia",
          `${revisor.nombre_completo} ha tomado tu caso: ${denuncia.titulo}`,
        ],
      )
    }

    return NextResponse.json({
      success: true,
      mensaje: "Revisor asignado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error al asignar revisor:", error)
    return NextResponse.json({ error: "Error al asignar revisor" }, { status: 500 })
  }
}
