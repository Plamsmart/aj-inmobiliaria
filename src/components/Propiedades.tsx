import Link from "next/link";
import { getActivePropiedades } from "@/lib/propiedades";
import type { Propiedad } from "@/lib/types";
import PropiedadCard from "./PropiedadCard";

export default async function Propiedades() {
  let propiedades: Propiedad[] = [];

  try {
    propiedades = await getActivePropiedades(6);
  } catch {
    // Supabase unavailable — render empty state
  }

  return (
    <section
      id="propiedades"
      className="mx-auto max-w-7xl px-8 md:px-16 py-24 md:py-32"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-mist font-sans mb-3">
            En cartera
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
            Propiedades destacadas
          </h2>
        </div>
        <Link
          href="/propiedades"
          className="font-sans text-sm tracking-wide uppercase text-ink border-b border-ink pb-0.5 hover:opacity-50 transition-opacity flex-shrink-0 ml-8"
        >
          Ver todas →
        </Link>
      </div>

      {/* Empty state */}
      {propiedades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-sand rounded-sm">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-stone"
          >
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
          <p className="font-serif text-2xl text-ink">
            Próximamente nuevas propiedades
          </p>
          <p className="font-sans text-sm text-mist max-w-xs text-center leading-relaxed">
            Estamos preparando nuestra cartera. Contacta con nosotros si buscas
            algo en concreto.
          </p>
          <Link
            href="#contacto"
            className="font-sans text-sm tracking-wide uppercase text-ink border-b border-ink pb-0.5 hover:opacity-50 transition-opacity mt-2"
          >
            Contáctanos →
          </Link>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propiedades.map((p, i) => (
            <PropiedadCard key={p.id} propiedad={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
