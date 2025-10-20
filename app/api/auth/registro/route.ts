import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { ResultSetHeader } from "mysql2"

export async function POST(request: NextRequest) {
  try {
    const { nombre_completo, correo, telefono, contrasena, rol_id } = await request.json()

    if (!nombre_completo || !correo || !contrasena) {
      return NextResponse.json({ error: "Nombre, correo y contraseña son requeridos" }, { status: 400 })
    }

    // Por defecto, los nuevos usuarios son ciudadanos (rol_id = 2)
    const rolFinal = rol_id || 2

    // Insertar nuevo usuario
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuario (rol_id, nombre_completo, correo, telefono, contrasena)
       VALUES (?, ?, ?, ?, ?)`,
      [rolFinal, nombre_completo, correo, telefono || null, contrasena],
    )

    return NextResponse.json({
      success: true,
      usuario_id: result.insertId,
      mensaje: "Usuario registrado exitosamente",
    })
  } catch (error: any) {
    console.error("[v0] Error en registro:", error)

    // Verificar si es error de correo duplicado
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 })
    }

    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
