import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropiedadById } from "@/lib/propiedades";
import type { PropiedadFormData } from "@/lib/types";
import PropiedadForm from "@/components/admin/PropiedadForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const propiedad = await getPropiedadById(id);
  return {
    title: propiedad ? `Editar — ${propiedad.titulo}` : "Editar propiedad",
  };
}

export default async function EditarPage({ params }: Props) {
  const { id } = await params;
  const propiedad = await getPropiedadById(id);

  if (!propiedad) notFound();

  const initialData: PropiedadFormData = {
    titulo: propiedad.titulo,
    ubicacion: propiedad.ubicacion,
    tipo: propiedad.tipo,
    precio: String(propiedad.precio),
    habitaciones: String(propiedad.habitaciones),
    banos: String(propiedad.banos),
    m2: String(propiedad.m2),
    estado: propiedad.estado,
    descripcion: propiedad.descripcion ?? "",
  };

  return <PropiedadForm initialData={initialData} propiedadId={propiedad.id} />;
}
