import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CalButton from "@/components/CalButton";
import { getPropiedadById } from "@/lib/propiedades";

const BRAND_GRADIENT = "linear-gradient(145deg, #4A5240 0%, #1E2418 100%)";

function formatPrecio(n: number): string {
  return n.toLocaleString("es-ES") + " €";
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const propiedad = await getPropiedadById(id);

  if (!propiedad) return { title: "Propiedad no encontrada" };

  const description =
    propiedad.descripcion?.slice(0, 160) ||
    `${propiedad.titulo} en ${propiedad.ubicacion} — ${propiedad.habitaciones} hab., ${propiedad.banos} baños, ${propiedad.m2} m². ${formatPrecio(propiedad.precio)}.`;

  return {
    title: propiedad.titulo,
    description,
    openGraph: {
      title: propiedad.titulo,
      description,
      images: propiedad.imagenes?.[0] ? [propiedad.imagenes[0]] : undefined,
    },
  };
}

export default async function PropiedadPage({ params }: Props) {
  const { id } = await params;
  const propiedad = await getPropiedadById(id);

  if (!propiedad) notFound();

  const [portada, ...resto] = propiedad.imagenes ?? [];

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative h-screen w-full overflow-hidden">
          {portada ? (
            <Image
              src={portada}
              alt={propiedad.titulo}
              fill
              loading="eager"
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: BRAND_GRADIENT }} />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 45%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          <div className="absolute inset-0 flex items-end px-8 pb-16 md:px-16 md:pb-20">
            <div className="max-w-3xl">
              <p className="text-stone text-xs tracking-[0.25em] uppercase mb-4 font-sans">
                {propiedad.ubicacion}
              </p>
              <h1 className="font-serif text-paper text-4xl md:text-6xl leading-tight">
                {propiedad.titulo}
              </h1>
            </div>
          </div>
        </section>

        {/* ── Detalles ──────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-8 md:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Left: details */}
            <div className="md:col-span-2">
              <p className="font-serif text-4xl md:text-5xl text-ink mb-8">
                {formatPrecio(propiedad.precio)}
              </p>

              <div className="grid grid-cols-3 gap-6 pb-8 mb-8 border-b border-sand">
                <div>
                  <p className="font-serif text-2xl text-ink mb-1">
                    {propiedad.habitaciones}
                  </p>
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist">
                    {propiedad.habitaciones === 1 ? "Habitación" : "Habitaciones"}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-ink mb-1">
                    {propiedad.banos}
                  </p>
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist">
                    {propiedad.banos === 1 ? "Baño" : "Baños"}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-ink mb-1">
                    {propiedad.m2}
                  </p>
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist">
                    m²
                  </p>
                </div>
              </div>

              <p className="font-sans text-sm tracking-[0.2em] uppercase text-mist mb-3">
                Ubicación
              </p>
              <p className="font-sans text-base text-ink mb-10">
                {propiedad.ubicacion}
              </p>

              {propiedad.descripcion && (
                <>
                  <p className="font-sans text-sm tracking-[0.2em] uppercase text-mist mb-3">
                    Descripción
                  </p>
                  <p className="font-sans text-base text-ink leading-relaxed whitespace-pre-line">
                    {propiedad.descripcion}
                  </p>
                </>
              )}
            </div>

            {/* Right: CTAs */}
            <div className="md:col-span-1">
              <div className="md:sticky md:top-28 flex flex-col gap-4 p-8 bg-sand">
                <p className="font-serif text-xl text-ink mb-2">
                  ¿Te interesa esta propiedad?
                </p>
                <CalButton text="Solicitar visita" className="w-full text-center font-sans text-sm tracking-[0.15em] uppercase px-8 py-3 transition-opacity hover:opacity-80" />
                <a
                  href="https://wa.me/34653011150"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center font-sans text-sm tracking-[0.15em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Galería ───────────────────────────────────────── */}
        {resto.length > 0 && (
          <section className="mx-auto max-w-7xl px-8 md:px-16 pb-20 md:pb-28">
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-mist mb-6">
              Galería
            </p>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                resto.length >= 5 ? "lg:grid-cols-3" : ""
              } gap-4`}
            >
              {resto.map((src, i) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={src}
                    alt={`${propiedad.titulo} — foto ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
