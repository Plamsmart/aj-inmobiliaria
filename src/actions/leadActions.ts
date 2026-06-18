"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import type { ClienteTipo, LeadEstado } from "@/lib/types";

function mapTipoLeadACliente(tipo: string): ClienteTipo | null {
  switch (tipo) {
    case "comprar":
      return "comprador";
    case "vender":
    case "tasar":
      return "vendedor";
    default:
      return null;
  }
}

export async function createLead(formData: FormData): Promise<void> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();

  if (!nombre || !telefono || !email) {
    throw new Error("Nombre, teléfono y email son obligatorios");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    nombre,
    telefono,
    email,
    tipo: tipo || null,
    mensaje: mensaje || null,
  });

  if (error) throw new Error(error.message);

  const { error: clienteError } = await supabase.from("clientes").insert({
    nombre,
    email,
    telefono: telefono || null,
    tipo: mapTipoLeadACliente(tipo),
    notas: mensaje || null,
    origen: "formulario web",
  });

  if (clienteError) throw new Error(clienteError.message);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/clientes");
}

export async function updateLeadEstadoAction(
  id: string,
  estado: LeadEstado
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("leads")
    .update({ estado })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}
