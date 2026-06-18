import { createAdminClient } from "./supabase-server";
import type { InstagramPost } from "./types";

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActiveInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getInstagramPostById(id: string): Promise<InstagramPost | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
