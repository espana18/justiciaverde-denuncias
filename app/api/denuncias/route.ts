import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

// Obtener todas las denuncias públicas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const estado = searchParams.get("estado")
    const prioridad = searchParams.get("prioridad")
    const tipo = searchParams.get("tipo")
    const ciudadano_id = searchParams.get("ciudadano_id")
    const limite = searchParams.get("limite") || "50"

    let query = `
      SELECT 
        d.*,
        td.nombre as tipo_demanda_nombre,
        u.nombre_completo as ciudadano_nombre
      FROM demanda d
      INNER JOIN tipo_demanda td ON d.tipo_demanda_id = td.id
      LEFT JOIN usuario u ON d.ciudadano_id = u.id
      WHERE d.publico = true
    `

    const params: any[] = []

    if (estado) {
      query += " AND d.estado = ?"
      params.push(estado)
    }

    if (prioridad) {
      query += " AND d.prioridad = ?"
      params.push(prioridad)
    }

    if (tipo) {
      query += " AND d.tipo_demanda_id = ?"
      params.push(tipo)
    }

    if (ciudadano_id) {
      query += " AND d.ciudadano_id = ?"
      params.push(ciudadano_id)
    }

    query += " ORDER BY d.creado_en DESC LIMIT ?"
    params.push(Number.parseInt(limite))

    const [rows] = await pool.query<RowDataPacket[]>(query, params)

    // Obtener fotos para cada denuncia
    for (const denuncia of rows) {
      const [fotos] = await pool.query<RowDataPacket[]>("SELECT * FROM demanda_foto WHERE demanda_id = ?", [
        denuncia.id,
      ])
      denuncia.fotos = fotos
    }

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error al obtener denuncias:", error)
    return NextResponse.json({ error: "Error al obtener denuncias" }, { status: 500 })
  }
}

// Crear nueva denuncia
export async function POST(request: NextRequest) {
  try {
    const {
      ciudadano_id,
      titulo,
      descripcion,
      tipo_demanda_id,
      prioridad,
      anonima,
      ubicacion_texto,
      latitud,
      longitud,
      fotos,
    } = await request.json()

    if (!ciudadano_id || !titulo || !descripcion || !tipo_demanda_id) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Insertar denuncia
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO demanda 
       (ciudadano_id, titulo, descripcion, tipo_demanda_id, prioridad, anonima, ubicacion_texto, latitud, longitud)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ciudadano_id,
        titulo,
        descripcion,
        tipo_demanda_id,
        prioridad || "medio",
        anonima || false,
        ubicacion_texto || null,
        latitud || null,
        longitud || null,
      ],
    )

    const demanda_id = result.insertId

    // Insertar fotos si existen
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        await pool.query("INSERT INTO demanda_foto (demanda_id, ruta, descripcion) VALUES (?, ?, ?)", [
          demanda_id,
          foto.ruta,
          foto.descripcion || null,
        ])
      }
    }

    return NextResponse.json({
      success: true,
      demanda_id,
      mensaje: "Denuncia creada exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error al crear denuncia:", error)
    return NextResponse.json({ error: "Error al crear denuncia" }, { status: 500 })
  }
}
