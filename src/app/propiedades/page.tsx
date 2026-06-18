import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PropiedadesListado from "@/components/PropiedadesListado";
import { getActivePropiedades } from "@/lib/propiedades";
import type { Propiedad } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propiedades en venta en Irun · AJ Inmobiliaria",
  description:
    "Explora todas las propiedades en venta en Irun, Hondarribia y la comarca del Bidasoa. Pisos, casas, chalets, áticos y locales.",
};

export default async function PropiedadesPage() {
  let propiedades: Propiedad[] = [];

  try {
    propiedades = await getActivePropiedades();
  } catch {
    // Supabase unavailable — render empty state
  }

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className="flex flex-col items-center justify-center text-center px-8"
          style={{
            height: "40vh",
            background: "linear-gradient(145deg, #4A5240 0%, #1E2418 100%)",
          }}
        >
          <h1 className="font-serif text-paper text-4xl md:text-5xl mb-4">
            Propiedades en venta
          </h1>
          <p className="font-sans text-stone text-sm tracking-[0.25em] uppercase">
            Irun · Hondarribia · Bidasoa
          </p>
        </section>

        {/* ── Filtros + grid ───────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-8 md:px-16 py-16 md:py-24">
          <PropiedadesListado propiedades={propiedades} />
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
