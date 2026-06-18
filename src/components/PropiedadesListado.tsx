"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PropiedadCard from "./PropiedadCard";
import type { Propiedad, PropiedadTipo } from "@/lib/types";

const TIPOS: Array<"Todas" | PropiedadTipo> = [
  "Todas",
  "Piso",
  "Casa",
  "Chalet",
  "Ático",
  "Local",
];

const PRECIOS_MAX = [
  { label: "Precio máximo", value: 0 },
  { label: "Hasta 150.000 €", value: 150000 },
  { label: "Hasta 250.000 €", value: 250000 },
  { label: "Hasta 350.000 €", value: 350000 },
  { label: "Hasta 500.000 €", value: 500000 },
  { label: "Hasta 750.000 €", value: 750000 },
];

export default function PropiedadesListado({
  propiedades,
}: {
  propiedades: Propiedad[];
}) {
  const [tipo, setTipo] = useState<"Todas" | PropiedadTipo>("Todas");
  const [precioMax, setPrecioMax] = useState(0);

  const filtradas = useMemo(() => {
    return propiedades.filter((p) => {
      if (tipo !== "Todas" && p.tipo !== tipo) return false;
      if (precioMax > 0 && p.precio > precioMax) return false;
      return true;
    });
  }, [propiedades, tipo, precioMax]);

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className="font-sans text-xs tracking-[0.15em] uppercase px-4 py-2 transition-colors"
              style={
                tipo === t
                  ? { backgroundColor: "var(--forest)", color: "var(--paper)" }
                  : { backgroundColor: "var(--sand)", color: "var(--ink)" }
              }
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={precioMax}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
          aria-label="Precio máximo"
          className="font-sans text-sm border border-stone bg-paper text-ink px-3 py-2 cursor-pointer focus:outline-none"
        >
          {PRECIOS_MAX.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid / empty state */}
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
            href="/#contacto"
            className="font-sans text-sm tracking-wide uppercase text-ink border-b border-ink pb-0.5 hover:opacity-50 transition-opacity mt-2"
          >
            Contáctanos →
          </Link>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-sand rounded-sm">
          <p className="font-serif text-2xl text-ink">Sin resultados</p>
          <p className="font-sans text-sm text-mist max-w-xs text-center leading-relaxed">
            Prueba a cambiar el tipo de propiedad o ampliar el precio máximo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtradas.map((p, i) => (
            <PropiedadCard key={p.id} propiedad={p} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
