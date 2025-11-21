import type { NextRequest } from "next/server"; // ← Import para server-side (opcional)

export interface UsuarioSesion {
  id: number;
  nombre_completo: string;
  correo: string;
  rol_nombre: string;
  rol_id: number;
}

// Client-side: Guardar en localStorage
export function guardarSesion(usuario: UsuarioSesion): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("usuario_sesion", JSON.stringify(usuario));
  }
}

// Server-side: Guardar en cookies (usa en login API)
export function guardarSesionServer(
  usuario: UsuarioSesion,
  cookies: any
): void {
  cookies.set("usuario_sesion", JSON.stringify(usuario), {
    httpOnly: true, // Seguro contra XSS
    secure: process.env.NODE_ENV === "production", // HTTPS en prod
    sameSite: "strict", // Protege contra CSRF
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

// Client-side: Obtener de localStorage
export function obtenerSesion(): UsuarioSesion | null {
  if (typeof window !== "undefined") {
    const sesionStr = localStorage.getItem("usuario_sesion");
    if (sesionStr) {
      try {
        return JSON.parse(sesionStr) as UsuarioSesion;
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Server-side: Obtener de cookies
export function obtenerSesionServer(cookies: any): UsuarioSesion | null {
  const sesionStr = cookies.get("usuario_sesion")?.value;
  if (sesionStr) {
    try {
      return JSON.parse(sesionStr) as UsuarioSesion;
    } catch {
      return null;
    }
  }
  return null;
}

// Función unificada: Obtener usuario actual (client o server)
export function obtenerUsuarioActual(req?: NextRequest): UsuarioSesion | null {
  if (req) {
    // Server-side: Usa cookies
    const cookies = req.cookies; // Accede a cookies del request
    return obtenerSesionServer(cookies);
  } else {
    // Client-side: Usa localStorage
    return obtenerSesion();
  }
}

// Client-side: Cerrar sesión (localStorage)
export function cerrarSesion(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("usuario_sesion");
  }
}

// Server-side: Cerrar sesión (cookies, usa en logout API)
export function cerrarSesionServer(cookies: any): void {
  cookies.delete("usuario_sesion");
}
