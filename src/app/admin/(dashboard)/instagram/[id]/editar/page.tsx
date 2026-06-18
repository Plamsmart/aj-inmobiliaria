import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstagramPostById } from "@/lib/instagram";
import type { InstagramPostFormData } from "@/lib/types";
import InstagramForm from "@/components/admin/InstagramForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getInstagramPostById(id);
  return { title: post ? "Editar post" : "Editar post" };
}

export default async function EditarInstagramPage({ params }: Props) {
  const { id } = await params;
  const post = await getInstagramPostById(id);

  if (!post) notFound();

  const initialData: InstagramPostFormData = {
    url: post.url,
    thumbnail_url: post.thumbnail_url ?? "",
    descripcion: post.descripcion ?? "",
    orden: String(post.orden),
    activo: post.activo,
  };

  return <InstagramForm initialData={initialData} postId={post.id} />;
}
