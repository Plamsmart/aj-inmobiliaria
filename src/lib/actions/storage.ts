"use server";

import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase-server";

const BUCKET = "propiedades";

export async function uploadImageAction(formData: FormData): Promise<string> {
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
