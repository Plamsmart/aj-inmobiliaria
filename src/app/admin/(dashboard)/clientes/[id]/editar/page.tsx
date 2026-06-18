import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClienteById } from "@/lib/clientes";
import type { ClienteFormData } from "@/lib/types";
import ClienteForm from "@/components/admin/ClienteForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cliente = await getClienteById(id);
  return {
    title: cliente ? `Editar — ${cliente.nombre}` : "Editar cliente",
  };
}

export default async function EditarClientePage({ params }: Props) {
  const { id } = await params;
  const cliente = await getClienteById(id);

  if (!cliente) notFound();

  const initialData: ClienteFormData = {
    nombre: cliente.nombre,
    email: cliente.email,
    telefono: cliente.telefono ?? "",
    tipo: cliente.tipo ?? "",
    presupuesto: cliente.presupuesto ?? "",
    zona_interes: cliente.zona_interes ?? "",
    notas: cliente.notas ?? "",
  };

  return <ClienteForm initialData={initialData} clienteId={cliente.id} />;
}
