import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

// Consultar denuncia por número de radicado (público, no requiere autenticación)
export async function GET(
  request: NextRequest,
  { params }: { params: { numero: string } }
) {
  try {
    const { numero } = params;

    if (!numero) {
      return NextResponse.json(
        { error: "Número de radicado requerido" },
        { status: 400 }
      );
    }

    // Consultar la denuncia con toda su información
    const [denuncias] = await pool.query<RowDataPacket[]>(
      `SELECT 
        d.*,
        td.nombre as tipo_demanda_nombre,
        u.nombre_completo as ciudadano_nombre,
        u.correo as ciudadano_correo,
        u.telefono as ciudadano_telefono
      FROM demanda d
      INNER JOIN tipo_demanda td ON d.tipo_demanda_id = td.id
      LEFT JOIN usuario u ON d.ciudadano_id = u.id
      WHERE d.numero_radicado = ?`,
      [numero]
    );

    if (denuncias.length === 0) {
      return NextResponse.json(
        { error: "No se encontró ninguna denuncia con ese número de radicado" },
        { status: 404 }
      );
    }

    const denuncia = denuncias[0];

    // Obtener fotos de la denuncia
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

    // Ocultar datos personales si es anónima
    if (denuncia.anonima) {
      denuncia.ciudadano_nombre = "Anónimo";
      denuncia.ciudadano_correo = null;
      denuncia.ciudadano_telefono = null;
    }

    return NextResponse.json(denuncia);
  } catch (error) {
    console.error("[v0] Error al consultar denuncia por radicado:", error);
    return NextResponse.json(
      { error: "Error al consultar la denuncia" },
      { status: 500 }
    );
  }
}
