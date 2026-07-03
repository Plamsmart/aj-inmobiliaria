import { createAdminClient } from "./supabase-server";
import type { Testimonio } from "./types";

export async function getActiveTestimonios(): Promise<Testimonio[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonios")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTestimonios(): Promise<Testimonio[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonios")
    .select("*")
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTestimonioById(id: string): Promise<Testimonio | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createTestimonio(row: {
  nombre: string;
  texto: string;
  valoracion: number;
  foto_url: string | null;
  activo: boolean;
}): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonios").insert(row);
  if (error) throw new Error(error.message);
}

export async function updateTestimonio(
  id: string,
  row: {
    nombre: string;
    texto: string;
    valoracion: number;
    foto_url: string | null;
    activo: boolean;
  }
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonios").update(row).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTestimonio(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonios").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
