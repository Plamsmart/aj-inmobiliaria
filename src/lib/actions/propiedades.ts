"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import type { PropiedadFormData } from "@/lib/types";

function toDbRow(data: PropiedadFormData) {
  return {
    titulo: data.titulo.trim(),
    ubicacion: data.ubicacion.trim(),
    tipo: data.tipo,
    precio: parseInt(data.precio, 10) || 0,
    habitaciones: parseInt(data.habitaciones, 10) || 0,
    banos: parseInt(data.banos, 10) || 0,
    m2: parseInt(data.m2, 10) || 0,
    estado: data.estado,
    descripcion: data.descripcion.trim() || null,
  };
}

export async function createPropiedadAction(
  data: PropiedadFormData,
  imageUrls: string[] = []
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("propiedades")
    .insert({ ...toDbRow(data), imagenes: imageUrls });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/propiedades");
}

export async function updatePropiedadAction(
  id: string,
  data: PropiedadFormData,
  imageUrls: string[] = []
): Promise<void> {
  const supabase = createAdminClient();
  const update = {
    ...toDbRow(data),
    // Only overwrite imagenes if new images were uploaded
    ...(imageUrls.length > 0 ? { imagenes: imageUrls } : {}),
  };
  const { error } = await supabase
    .from("propiedades")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${id}/editar`);
}

export async function deletePropiedadAction(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("propiedades")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/propiedades");
}
