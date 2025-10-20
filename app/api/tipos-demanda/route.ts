import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// Obtener todos los tipos de demanda disponibles
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id, nombre, descripcion FROM tipo_demanda ORDER BY nombre")

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error al obtener tipos de demanda:", error)
    return NextResponse.json({ error: "Error al obtener tipos de demanda" }, { status: 500 })
  }
}
