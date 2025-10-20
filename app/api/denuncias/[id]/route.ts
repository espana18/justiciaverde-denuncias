import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// Obtener una denuncia específica con todos sus detalles
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        d.*,
        td.nombre as tipo_demanda_nombre,
        u.nombre_completo as ciudadano_nombre
       FROM demanda d
       INNER JOIN tipo_demanda td ON d.tipo_demanda_id = td.id
       LEFT JOIN usuario u ON d.ciudadano_id = u.id
       WHERE d.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Denuncia no encontrada" },
        { status: 404 }
      );
    }

    const denuncia = rows[0];

    // Obtener fotos
    const [fotos] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM demanda_foto WHERE demanda_id = ?",
      [id]
    );
    denuncia.fotos = fotos;

    // Obtener revisores asignados
    const [revisores] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.nombre_completo, u.correo, dr.asignado_en
       FROM demanda_revisor dr
       INNER JOIN usuario u ON dr.revisor_id = u.id
       WHERE dr.demanda_id = ?`,
      [id]
    );
    denuncia.revisores = revisores;

    return NextResponse.json(denuncia);
  } catch (error) {
    console.error("[v0] Error al obtener denuncia:", error);
    return NextResponse.json(
      { error: "Error al obtener denuncia" },
      { status: 500 }
    );
  }
}

// Actualizar una denuncia
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      tipo_demanda_id,
      titulo,
      descripcion,
      prioridad,
      estado,
      ubicacion_texto,
      latitud,
      longitud,
    } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (tipo_demanda_id !== undefined) {
      updates.push("tipo_demanda_id = ?");
      values.push(tipo_demanda_id);
    }
    if (titulo !== undefined) {
      updates.push("titulo = ?");
      values.push(titulo);
    }
    if (descripcion !== undefined) {
      updates.push("descripcion = ?");
      values.push(descripcion);
    }
    if (prioridad !== undefined) {
      updates.push("prioridad = ?");
      values.push(prioridad);
    }
    if (estado !== undefined) {
      updates.push("estado = ?");
      values.push(estado);
    }
    if (ubicacion_texto !== undefined) {
      updates.push("ubicacion_texto = ?");
      values.push(ubicacion_texto);
    }
    if (latitud !== undefined) {
      updates.push("latitud = ?");
      values.push(latitud);
    }
    if (longitud !== undefined) {
      updates.push("longitud = ?");
      values.push(longitud);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    values.push(id);

    await pool.query<ResultSetHeader>(
      `UPDATE demanda SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      mensaje: "Denuncia actualizada exitosamente",
    });
  } catch (error) {
    console.error("[v0] Error al actualizar denuncia:", error);
    return NextResponse.json(
      { error: "Error al actualizar denuncia" },
      { status: 500 }
    );
  }
}

// Eliminar una denuncia
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await pool.query<ResultSetHeader>("DELETE FROM demanda WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      mensaje: "Denuncia eliminada exitosamente",
    });
  } catch (error) {
    console.error("[v0] Error al eliminar denuncia:", error);
    return NextResponse.json(
      { error: "Error al eliminar denuncia" },
      { status: 500 }
    );
  }
}
