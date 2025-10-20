export interface UsuarioSesion {
  id: number;
  nombre_completo: string;
  correo: string;
  rol_nombre: string;
  rol_id: number;
}

export function guardarSesion(usuario: UsuarioSesion) {
  if (typeof window !== "undefined") {
    localStorage.setItem("usuario_sesion", JSON.stringify(usuario));
  }
}

export function obtenerSesion(): UsuarioSesion | null {
  if (typeof window !== "undefined") {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  }
  return null;
}

export function cerrarSesion() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("usuario_sesion");
  }
}

export function obtenerUsuarioActual(): UsuarioSesion | null {
  return obtenerSesion();
}
