# Documentación de APIs - Justicia Verde

## Índice

1. [Introducción](#introducción)
2. [Configuración de Base de Datos](#configuración-de-base-de-datos)
3. [Estructura de APIs](#estructura-de-apis)
4. [Endpoints Disponibles](#endpoints-disponibles)
5. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Introducción

Este documento explica cómo funcionan las APIs del sistema Justicia Verde, cómo se conectan a la base de datos MySQL y cómo utilizarlas desde el frontend.

### Tecnologías Utilizadas

- **Next.js 15** - Framework de React con App Router
- **MySQL 2** - Cliente de base de datos para Node.js
- **TypeScript** - Tipado estático para mayor seguridad

---

## Configuración de Base de Datos

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=justicia_verde
\`\`\`

### 2. Conexión a la Base de Datos

El archivo `lib/db.ts` maneja la conexión mediante un pool de conexiones:

\`\`\`typescript
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
})

export default pool
\`\`\`

**Ventajas del Pool de Conexiones:**

- Reutiliza conexiones existentes
- Maneja múltiples peticiones simultáneas
- Mejor rendimiento que crear conexiones individuales

### 3. Ejecutar el Schema SQL

Antes de usar las APIs, ejecuta el archivo SQL proporcionado en MySQL Workbench:

\`\`\`bash

# Desde MySQL Workbench, abre y ejecuta:

justicia_verde_schema_funcional.sql
\`\`\`

---

## Estructura de APIs

### Ubicación de los Archivos

Las APIs en Next.js App Router se ubican en la carpeta `app/api/`:

\`\`\`
app/
├── api/
│ ├── auth/
│ │ ├── login/route.ts
│ │ └── registro/route.ts
│ ├── denuncias/
│ │ ├── route.ts
│ │ ├── [id]/route.ts
│ │ ├── [id]/asignar-revisor/route.ts
│ │ ├── destacadas/route.ts
│ │ └── mapa/route.ts
│ ├── usuarios/
│ │ ├── [id]/route.ts
│ │ ├── revisores/route.ts
│ │ └── ciudadanos/route.ts
│ ├── tipos-demanda/route.ts
│ └── estadisticas/
│ ├── admin/route.ts
│ ├── revisor/[id]/route.ts
│ └── ciudadano/[id]/route.ts
\`\`\`

### Anatomía de una API Route

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

// GET - Obtener datos
export async function GET(request: NextRequest) {
try {
const [rows] = await pool.query<RowDataPacket[]>(
'SELECT \* FROM demanda WHERE publico = 1'
)
return NextResponse.json(rows)
} catch (error) {
console.error('[v0] Error:', error)
return NextResponse.json(
{ error: 'Error al obtener datos' },
{ status: 500 }
)
}
}

// POST - Crear datos
export async function POST(request: NextRequest) {
try {
const body = await request.json()
const { titulo, descripcion } = body

    const [result] = await pool.query(
      'INSERT INTO demanda (titulo, descripcion) VALUES (?, ?)',
      [titulo, descripcion]
    )

    return NextResponse.json({ success: true, id: result.insertId })

} catch (error) {
return NextResponse.json(
{ error: 'Error al crear' },
{ status: 500 }
)
}
}
\`\`\`

---

## Endpoints Disponibles

### Autenticación

#### POST `/api/auth/login`

Inicia sesión de un usuario.

**Request Body:**
\`\`\`json
{
"correo": "usuario@ejemplo.com",
"contrasena": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
"id": 1,
"nombre_completo": "Juan Pérez",
"correo": "usuario@ejemplo.com",
"rol_nombre": "ciudadano",
"rol_id": 2
}
\`\`\`

#### POST `/api/auth/registro`

Registra un nuevo usuario.

**Request Body:**
\`\`\`json
{
"nombre_completo": "María González",
"correo": "maria@ejemplo.com",
"contrasena": "password123",
"telefono": "3001234567"
}
\`\`\`

---

### Denuncias

#### GET `/api/denuncias`

Obtiene todas las denuncias públicas.

**Query Parameters:**

- `ciudadano_id` (opcional): Filtra por ciudadano
- `estado` (opcional): Filtra por estado (en_revision, tomaron_el_caso)

**Response:**
\`\`\`json
[
{
"id": 1,
"titulo": "Tala ilegal en Parque Nacional",
"descripcion": "Se observa tala masiva...",
"tipo_demanda_nombre": "Deforestación",
"prioridad": "critica",
"estado": "en_revision",
"ubicacion_texto": "Parque Nacional Natural",
"latitud": 4.5709,
"longitud": -74.2973,
"creado_en": "2025-01-15T10:30:00.000Z"
}
]
\`\`\`

#### POST `/api/denuncias`

Crea una nueva denuncia.

**Request Body:**
\`\`\`json
{
"ciudadano_id": 2,
"titulo": "Contaminación de río",
"descripcion": "Empresa vertiendo químicos...",
"tipo_demanda_id": 3,
"prioridad": "alta",
"anonima": false,
"ubicacion_texto": "Río Bogotá, Sector Industrial",
"latitud": 4.6097,
"longitud": -74.0817,
"fotos": [
{
"ruta": "/uploads/foto1.jpg",
"descripcion": "Evidencia de contaminación"
}
]
}
\`\`\`

#### GET `/api/denuncias/[id]`

Obtiene una denuncia específica con todos sus detalles.

**Response:**
\`\`\`json
{
"id": 1,
"titulo": "Tala ilegal",
"descripcion": "...",
"tipo_demanda_nombre": "Deforestación",
"ciudadano_nombre": "Juan Pérez",
"fotos": [...],
"revisores": [...]
}
\`\`\`

#### PUT `/api/denuncias/[id]`

Actualiza una denuncia existente.

**Request Body:**
\`\`\`json
{
"titulo": "Nuevo título",
"descripcion": "Nueva descripción",
"prioridad": "critica"
}
\`\`\`

#### DELETE `/api/denuncias/[id]`

Elimina una denuncia.

#### POST `/api/denuncias/[id]/asignar-revisor`

Asigna un revisor a una denuncia.

**Request Body:**
\`\`\`json
{
"revisor_id": 3
}
\`\`\`

#### GET `/api/denuncias/destacadas`

Obtiene las 3 denuncias más destacadas (simulado con las más recientes).

#### GET `/api/denuncias/mapa`

Obtiene todas las denuncias con coordenadas para mostrar en el mapa.

---

### Usuarios

#### GET `/api/usuarios/[id]`

Obtiene información de un usuario específico.

#### GET `/api/usuarios/revisores`

Obtiene lista de revisores con estadísticas.

**Response:**
\`\`\`json
[
{
"id": 3,
"nombre_completo": "Dr. Carlos Mendoza",
"correo": "carlos@ejemplo.com",
"organizacion": "Grupo VerdeLex",
"especialidad": "Derecho Ambiental",
"casos_activos": 8,
"casos_resueltos": 45
}
]
\`\`\`

#### GET `/api/usuarios/ciudadanos`

Obtiene lista de ciudadanos activos.

---

### Tipos de Demanda

#### GET `/api/tipos-demanda`

Obtiene todos los tipos de denuncia disponibles.

**Response:**
\`\`\`json
[
{
"id": 1,
"nombre": "Deforestación",
"descripcion": "Tala ilegal de bosques"
},
{
"id": 2,
"nombre": "Minería ilegal",
"descripcion": "Extracción no autorizada"
}
]
\`\`\`

---

### Estadísticas

#### GET `/api/estadisticas/admin`

Obtiene estadísticas globales para el administrador.

**Response:**
\`\`\`json
{
"total_denuncias": 1247,
"usuarios_activos": 3420,
"casos_resueltos": 456,
"en_proceso": 312
}
\`\`\`

#### GET `/api/estadisticas/revisor/[id]`

Obtiene estadísticas de un revisor específico.

#### GET `/api/estadisticas/ciudadano/[id]`

Obtiene estadísticas de un ciudadano específico.

---

## Ejemplos de Uso

### Desde el Frontend (React/Next.js)

#### Ejemplo 1: Obtener Denuncias

\`\`\`typescript
'use client'

import { useState, useEffect } from 'react'
import type { Demanda } from '@/lib/tipos'

export default function ListaDenuncias() {
const [denuncias, setDenuncias] = useState<Demanda[]>([])
const [cargando, setCargando] = useState(true)

useEffect(() => {
async function cargarDenuncias() {
try {
const res = await fetch('/api/denuncias')
if (res.ok) {
const data = await res.json()
setDenuncias(data)
}
} catch (error) {
console.error('Error:', error)
} finally {
setCargando(false)
}
}
cargarDenuncias()
}, [])

if (cargando) return <div>Cargando...</div>

return (
<div>
{denuncias.map(denuncia => (
<div key={denuncia.id}>{denuncia.titulo}</div>
))}
</div>
)
}
\`\`\`

#### Ejemplo 2: Crear Denuncia

\`\`\`typescript
async function crearDenuncia(datos: any) {
try {
const res = await fetch('/api/denuncias', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(datos)
})

    if (res.ok) {
      const resultado = await res.json()
      console.log('Denuncia creada:', resultado.demanda_id)
      return resultado
    } else {
      const error = await res.json()
      throw new Error(error.error)
    }

} catch (error) {
console.error('Error al crear denuncia:', error)
throw error
}
}
\`\`\`

#### Ejemplo 3: Actualizar Denuncia

\`\`\`typescript
async function actualizarDenuncia(id: number, cambios: any) {
try {
const res = await fetch(`/api/denuncias/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(cambios)
})

    if (res.ok) {
      return await res.json()
    } else {
      throw new Error('Error al actualizar')
    }

} catch (error) {
console.error('Error:', error)
throw error
}
}
\`\`\`

#### Ejemplo 4: Eliminar Denuncia

\`\`\`typescript
async function eliminarDenuncia(id: number) {
if (!confirm('¿Estás seguro de eliminar esta denuncia?')) {
return
}

try {
const res = await fetch(`/api/denuncias/${id}`, {
method: 'DELETE'
})

    if (res.ok) {
      alert('Denuncia eliminada exitosamente')
      // Recargar lista o redirigir
    }

} catch (error) {
console.error('Error:', error)
alert('Error al eliminar la denuncia')
}
}
\`\`\`

---

## Manejo de Errores

Todas las APIs siguen un patrón consistente de manejo de errores:

\`\`\`typescript
try {
// Lógica de la API
return NextResponse.json({ success: true, data })
} catch (error) {
console.error('[v0] Error:', error)
return NextResponse.json(
{ error: 'Mensaje descriptivo del error' },
{ status: 500 }
)
}
\`\`\`

### Códigos de Estado HTTP

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en los datos enviados
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

---

## Seguridad

### Validación de Datos

Siempre valida los datos antes de insertarlos en la base de datos:

\`\`\`typescript
if (!titulo || !descripcion || !tipo_demanda_id) {
return NextResponse.json(
{ error: 'Faltan campos requeridos' },
{ status: 400 }
)
}
\`\`\`

### Consultas Preparadas

Usa siempre consultas preparadas para prevenir SQL Injection:

\`\`\`typescript
// ✅ CORRECTO
await pool.query('SELECT \* FROM demanda WHERE id = ?', [id])

// ❌ INCORRECTO
await pool.query(`SELECT * FROM demanda WHERE id = ${id}`)
\`\`\`

---

## Conclusión

Este sistema de APIs proporciona una interfaz completa para gestionar denuncias ambientales. Todas las operaciones están documentadas y siguen patrones consistentes para facilitar el mantenimiento y la extensión del sistema.

Para más información sobre Next.js App Router y Route Handlers, consulta la [documentación oficial de Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).
