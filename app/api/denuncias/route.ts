import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { generarNumeroRadicado } from "@/lib/utilidades";
import { obtenerUsuarioActual } from "@/lib/auth";

// Obtener todas las denuncias públicas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estado = searchParams.get("estado");
    const prioridad = searchParams.get("prioridad");
    const tipo = searchParams.get("tipo");
    const ciudadano_id = searchParams.get("ciudadano_id");
    const limite = searchParams.get("limite") || "50";

    let query = `
      SELECT 
        d.*,
        td.nombre as tipo_demanda_nombre,
        CASE 
          WHEN d.anonima = 1 THEN 'Anónimo'
          ELSE u.nombre_completo
        END as ciudadano_nombre,
        CASE 
          WHEN d.anonima = 1 THEN NULL
          ELSE u.correo
        END as ciudadano_correo,
        CASE 
          WHEN d.anonima = 1 THEN NULL
          ELSE u.telefono
        END as ciudadano_telefono
      FROM demanda d
      INNER JOIN tipo_demanda td ON d.tipo_demanda_id = td.id
      LEFT JOIN usuario u ON d.ciudadano_id = u.id
      WHERE d.publico = true
    `;

    const params: any[] = [];

    if (estado) {
      query += " AND d.estado = ?";
      params.push(estado);
    }

    if (prioridad) {
      query += " AND d.prioridad = ?";
      params.push(prioridad);
    }

    if (tipo) {
      query += " AND d.tipo_demanda_id = ?";
      params.push(tipo);
    }

    if (ciudadano_id) {
      query += " AND d.ciudadano_id = ?";
      params.push(ciudadano_id);
    }

    query += " ORDER BY d.creado_en DESC LIMIT ?";
    params.push(Number.parseInt(limite));

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    for (const denuncia of rows) {
      const [fotos] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM demanda_foto WHERE demanda_id = ?",
        [denuncia.id]
      );
      denuncia.fotos = fotos;

      // Obtener revisores asignados con todos sus datos
      const [revisores] = await pool.query<RowDataPacket[]>(
        `SELECT u.id, u.nombre_completo, u.correo, u.telefono, dr.asignado_en
         FROM demanda_revisor dr
         INNER JOIN usuario u ON dr.revisor_id = u.id
         WHERE dr.demanda_id = ?`,
        [denuncia.id]
      );
      denuncia.revisores = revisores;
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[v0] Error al obtener denuncias:", error);
    return NextResponse.json(
      { error: "Error al obtener denuncias" },
      { status: 500 }
    );
  }
}

// Crear nueva denuncia
export async function POST(request: NextRequest) {
  try {
    const {
      titulo,
      descripcion,
      tipo_demanda_id,
      prioridad,
      anonima,
      ubicacion_texto,
      latitud,
      longitud,
      fotos,
    } = await request.json(); // Removí ciudadano_id del destructuring, ya que lo obtenemos del auth

    if (!titulo || !descripcion || !tipo_demanda_id) {
      return NextResponse.json(
        { error: "Campos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Obtener usuario logueado (pasamos request para server-side auth)
    const usuario = obtenerUsuarioActual(request);
    if (!usuario?.id) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const ciudadanoIdFinal = usuario.id; // ← Siempre asignar ID del usuario, incluso anónimo

    // Generar numero_radicado único
    const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM demanda WHERE numero_radicado LIKE ?`,
      [`RAD-${fechaActual}%`]
    );
    const contador = (rows[0].count || 0) + 1;
    const numeroRadicado = `RAD-${fechaActual}-${contador
      .toString()
      .padStart(4, "0")}`;

    console.log(
      "ciudadanoIdFinal para INSERT:",
      ciudadanoIdFinal,
      "anonima:",
      anonima
    ); // Debug temporal

    // Insertar denuncia
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO demanda 
       (ciudadano_id, titulo, descripcion, tipo_demanda_id, prioridad, anonima, ubicacion_texto, latitud, longitud, numero_radicado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ciudadanoIdFinal, // Siempre el ID del usuario
        titulo,
        descripcion,
        tipo_demanda_id,
        prioridad || "medio",
        anonima ? 1 : 0, // Flag solo para visualización/ocultar identidad
        ubicacion_texto || null,
        latitud || null,
        longitud || null,
        numeroRadicado,
      ]
    );

    const demanda_id = result.insertId;

    // Insertar fotos si existen
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        await pool.query(
          "INSERT INTO demanda_foto (demanda_id, ruta, descripcion) VALUES (?, ?, ?)",
          [demanda_id, foto.ruta, foto.descripcion || null]
        );
      }
    }

    return NextResponse.json({
      success: true,
      demanda_id,
      numero_radicado: numeroRadicado,
      mensaje: "Denuncia creada exitosamente",
    });
  } catch (error) {
    console.error("[v0] Error al crear denuncia:", error);
    return NextResponse.json(
      { error: "Error al crear denuncia" },
      { status: 500 }
    );
  }
}
