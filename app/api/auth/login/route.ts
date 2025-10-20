import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function POST(request: NextRequest) {
  try {
    const { correo, contrasena } = await request.json()

    if (!correo || !contrasena) {
      return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario por correo
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.rol_id, u.nombre_completo, u.correo, u.telefono, u.creado_en, r.nombre as rol_nombre
       FROM usuario u
       INNER JOIN rol r ON u.rol_id = r.id
       WHERE u.correo = ? AND u.contrasena = ?`,
      [correo, contrasena],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const usuario = rows[0]

    // En producción, aquí se debería crear un JWT o sesión
    // Por ahora, devolvemos los datos del usuario
    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        rol_id: usuario.rol_id,
        rol_nombre: usuario.rol_nombre,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        telefono: usuario.telefono,
        creado_en: usuario.creado_en,
      },
    })
  } catch (error) {
    console.error("[v0] Error en login:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
