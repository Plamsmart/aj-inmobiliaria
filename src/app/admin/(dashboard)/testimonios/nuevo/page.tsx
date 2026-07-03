import type { Metadata } from "next";
import TestimonioForm from "@/components/admin/TestimonioForm";

export const metadata: Metadata = { title: "Nuevo testimonio" };

export default function NuevoTestimonioPage() {
  return <TestimonioForm />;
}
