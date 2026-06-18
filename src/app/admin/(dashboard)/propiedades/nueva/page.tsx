import type { Metadata } from "next";
import PropiedadForm from "@/components/admin/PropiedadForm";

export const metadata: Metadata = { title: "Nueva propiedad" };

export default function NuevaPage() {
  return <PropiedadForm />;
}
