import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener información de un usuario específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.rol_id, u.nombre_completo, u.correo, u.telefono, u.creado_en, r.nombre as rol_nombre
       FROM usuario u
       INNER JOIN rol r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}
