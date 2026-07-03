"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import {
  createTestimonio,
  updateTestimonio,
  deleteTestimonio,
} from "@/lib/testimonios";
import type { TestimonioFormData } from "@/lib/types";

const BUCKET = "testimonios";

function toDbRow(data: TestimonioFormData) {
  return {
    nombre: data.nombre.trim(),
    texto: data.texto.trim(),
    valoracion: data.valoracion,
    foto_url: data.foto_url.trim() || null,
    activo: data.activo,
  };
}

function revalidate() {
  revalidatePath("/admin/testimonios");
  revalidatePath("/");
}

export async function createTestimonioAction(
  data: TestimonioFormData
): Promise<void> {
  await createTestimonio(toDbRow(data));
  revalidate();
}

export async function updateTestimonioAction(
  id: string,
  data: TestimonioFormData
): Promise<void> {
  await updateTestimonio(id, toDbRow(data));
  revalidate();
}

export async function deleteTestimonioAction(id: string): Promise<void> {
  await deleteTestimonio(id);
  revalidate();
}

export async function uploadTestimonioImageAction(
  formData: FormData
): Promise<string> {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No se ha proporcionado ningún archivo");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${randomUUID()}.${ext}`;

  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) throw new Error(`Error al subir imagen: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}
