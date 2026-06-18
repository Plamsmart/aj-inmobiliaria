import type { Metadata } from "next";
import ClienteForm from "@/components/admin/ClienteForm";

export const metadata: Metadata = { title: "Nuevo cliente" };

export default function NuevoClientePage() {
  return <ClienteForm />;
}
