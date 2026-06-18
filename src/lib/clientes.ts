import { createAdminClient } from "./supabase-server";
import type { Cliente } from "./types";

export async function getClientes(): Promise<Cliente[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
