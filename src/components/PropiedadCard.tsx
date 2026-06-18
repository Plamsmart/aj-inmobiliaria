import Link from "next/link";
import Image from "next/image";
import type { Propiedad } from "@/lib/types";

const GRADIENTES = [
  "linear-gradient(145deg, #4A5240 0%, #1E2418 100%)",
  "linear-gradient(145deg, #3B4535 0%, #161C12 100%)",
  "linear-gradient(145deg, #556050 0%, #222B1E 100%)",
  "linear-gradient(145deg, #2E3D2A 0%, #0F1A0C 100%)",
  "linear-gradient(145deg, #415040 0%, #192018 100%)",
  "linear-gradient(145deg, #3A3E38 0%, #16191A 100%)",
];

function formatPrecio(n: number): string {
  return n.toLocaleString("es-ES") + "€";
}

function esBadgeNuevo(createdAt: string): boolean {
  const diasDesdeCreacion =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return diasDesdeCreacion <= 60;
}

export default function PropiedadCard({
  propiedad,
  index,
}: {
  propiedad: Propiedad;
  index: number;
}) {
  const thumb = propiedad.imagenes?.[0];
  const esNuevo = esBadgeNuevo(propiedad.created_at);

  return (
    <Link href={`/propiedades/${propiedad.id}`} className="group flex flex-col">
      {/* Image / placeholder */}
      <div className="relative overflow-hidden mb-4 aspect-[4/3]">
        {thumb ? (
          <Image
            src={thumb}
            alt={propiedad.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
            style={{ background: GRADIENTES[index % GRADIENTES.length] }}
          />
        )}

        {/* Badge */}
        <span
          className={`absolute top-3 left-3 text-xs tracking-[0.15em] uppercase font-sans px-2.5 py-1 ${
            esNuevo ? "bg-forest text-paper" : "bg-sand text-ink"
          }`}
        >
          {esNuevo ? "Nuevo" : "En venta"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-xl text-ink leading-snug">
          {propiedad.titulo}
        </h3>

        <div className="flex items-baseline justify-between">
          <p className="font-sans text-sm text-mist">{propiedad.ubicacion}</p>
          <p className="font-serif text-lg text-ink">
            {formatPrecio(propiedad.precio)}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-1 border-t border-sand">
          <span className="font-sans text-xs text-mist">
            {propiedad.habitaciones} hab.
          </span>
          <span className="font-sans text-xs text-mist">
            {propiedad.banos} {propiedad.banos === 1 ? "baño" : "baños"}
          </span>
          <span className="font-sans text-xs text-mist">{propiedad.m2} m²</span>
        </div>
      </div>
    </Link>
  );
}
