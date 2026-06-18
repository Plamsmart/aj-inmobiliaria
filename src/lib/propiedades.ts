import { createAdminClient } from "./supabase-server";
import type { Propiedad } from "./types";

export async function getActivePropiedades(limit?: number): Promise<Propiedad[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("propiedades")
    .select("*")
    .eq("estado", "Activa")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPropiedades(): Promise<Propiedad[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPropiedadById(id: string): Promise<Propiedad | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // row not found
    throw new Error(error.message);
  }
  return data;
}
