"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import type { InstagramPostFormData } from "@/lib/types";

const BUCKET = "instagram";

export async function uploadInstagramImageAction(
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

function toDbRow(data: InstagramPostFormData) {
  return {
    url: data.url.trim(),
    thumbnail_url: data.thumbnail_url.trim() || null,
    descripcion: data.descripcion.trim() || null,
    orden: parseInt(data.orden, 10) || 0,
    activo: data.activo,
  };
}

export async function createInstagramPostAction(
  data: InstagramPostFormData
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("instagram_posts").insert(toDbRow(data));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function updateInstagramPostAction(
  id: string,
  data: InstagramPostFormData
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("instagram_posts")
    .update(toDbRow(data))
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function deleteInstagramPostAction(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("instagram_posts")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}
