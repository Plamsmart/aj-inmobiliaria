export type Estado = "Activa" | "Vendida";
export type PropiedadTipo = "Piso" | "Casa" | "Chalet" | "Ático" | "Local";

// Shape of the admin form fields (all strings because they come from <input>)
export interface PropiedadFormData {
  titulo: string;
  ubicacion: string;
  tipo: PropiedadTipo;
  precio: string;
  habitaciones: string;
  banos: string;
  m2: string;
  estado: Estado;
  descripcion: string;
}

export type LeadEstado = "Pendiente" | "Contactado" | "Cerrado";

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  tipo: string | null;
  mensaje: string | null;
  estado: LeadEstado;
  created_at: string;
}

export type ClienteTipo = "comprador" | "vendedor" | "ambos";
export type ClienteOrigen = "formulario web" | "manual";

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: ClienteTipo | null;
  presupuesto: string | null;
  zona_interes: string | null;
  notas: string | null;
  origen: ClienteOrigen;
  created_at: string;
}

export interface ClienteFormData {
  nombre: string;
  email: string;
  telefono: string;
  tipo: ClienteTipo | "";
  presupuesto: string;
  zona_interes: string;
  notas: string;
}

export interface InstagramPost {
  id: string;
  url: string;
  thumbnail_url: string | null;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
}

export interface InstagramPostFormData {
  url: string;
  thumbnail_url: string;
  descripcion: string;
  orden: string;
  activo: boolean;
}

export interface Testimonio {
  id: string;
  nombre: string;
  texto: string;
  valoracion: number;
  foto_url: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
}

export interface TestimonioFormData {
  nombre: string;
  texto: string;
  valoracion: number;
  foto_url: string;
  activo: boolean;
}

// Shape of a row returned from Supabase
export interface Propiedad {
  id: string;
  titulo: string;
  ubicacion: string;
  tipo: PropiedadTipo;
  precio: number;
  habitaciones: number;
  banos: number;
  m2: number;
  estado: Estado;
  descripcion: string | null;
  imagenes: string[];
  destacada: boolean;
  created_at: string;
  updated_at: string;
}
