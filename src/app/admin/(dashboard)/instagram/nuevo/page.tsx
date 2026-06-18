import type { Metadata } from "next";
import InstagramForm from "@/components/admin/InstagramForm";

export const metadata: Metadata = { title: "Añadir post" };

export default function NuevoInstagramPage() {
  return <InstagramForm />;
}
