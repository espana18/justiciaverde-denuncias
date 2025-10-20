// Tipos y interfaces para la aplicación

export type RolUsuario = "admin" | "ciudadano" | "revisor";

export type PrioridadDemanda = "medio" | "alta" | "critica";

export type EstadoDemanda = "en_revision" | "tomaron_el_caso";

export interface Usuario {
  id: number;
  rol_id: number;
  rol_nombre?: RolUsuario;
  nombre_completo: string;
  correo: string;
  telefono: string | null;
  creado_en: string;
}

export interface TipoDemanda {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Demanda {
  id: number;
  ciudadano_id: number;
  titulo: string;
  descripcion: string;
  tipo_demanda_id: number;
  tipo_demanda_nombre?: string;
  prioridad: PrioridadDemanda;
  estado: EstadoDemanda;
  anonima: boolean;
  ubicacion_texto: string | null;
  latitud: number | null;
  longitud: number | null;
  publico: boolean;
  creado_en: string;
  actualizado_en: string | null;
  ciudadano_nombre?: string;
  ciudadano_correo?: string;
  ciudadano_telefono?: string;
  fotos?: DemandaFoto[];
  revisores?: (Usuario & { asignado_en?: string })[];
}

export interface DemandaFoto {
  id: number;
  demanda_id: number;
  ruta: string;
  descripcion: string | null;
  subido_en: string;
}

export interface DemandaRevisor {
  id: number;
  demanda_id: number;
  revisor_id: number;
  asignado_en: string;
}

export interface Notificacion {
  id: number;
  usuario_id: number;
  demanda_id: number;
  revisor_id: number | null;
  titulo: string;
  mensaje: string;
  leida: boolean;
  creado_en: string;
}

export interface EstadisticasAdmin {
  total_denuncias: number;
  usuarios_activos: number;
  casos_resueltos: number;
  en_proceso: number;
}

export interface EstadisticasRevisor {
  disponibles: number;
  en_proceso: number;
  resueltas: number;
  total_casos: number;
}

export interface EstadisticasCiudadano {
  total_denuncias: number;
  en_proceso: number;
  resueltas: number;
}
