import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestimonioById } from "@/lib/testimonios";
import type { TestimonioFormData } from "@/lib/types";
import TestimonioForm from "@/components/admin/TestimonioForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTestimonioById(id);
  return { title: t ? `Editar · ${t.nombre}` : "Editar testimonio" };
}

export default async function EditarTestimonioPage({ params }: Props) {
  const { id } = await params;
  const t = await getTestimonioById(id);

  if (!t) notFound();

  const initialData: TestimonioFormData = {
    nombre: t.nombre,
    texto: t.texto,
    valoracion: t.valoracion,
    foto_url: t.foto_url ?? "",
    activo: t.activo,
  };

  return <TestimonioForm initialData={initialData} testimonioId={t.id} />;
}
