"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import type { ClienteFormData } from "@/lib/types";

function toDbRow(data: ClienteFormData) {
  return {
    nombre: data.nombre.trim(),
    email: data.email.trim(),
    telefono: data.telefono.trim() || null,
    tipo: data.tipo || null,
    presupuesto: data.presupuesto.trim() || null,
    zona_interes: data.zona_interes.trim() || null,
    notas: data.notas.trim() || null,
  };
}

export async function createClienteAction(data: ClienteFormData): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("clientes")
    .insert({ ...toDbRow(data), origen: "manual" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
}

export async function updateClienteAction(
  id: string,
  data: ClienteFormData
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("clientes")
    .update(toDbRow(data))
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}/editar`);
}

export async function deleteClienteAction(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
}
