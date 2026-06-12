import Link from "next/link";

type Badge = "Nuevo" | "Venta" | "Vendido";

interface Propiedad {
  id: number;
  nombre: string;
  ubicacion: string;
  precio: string;
  habitaciones: number;
  banos: number;
  metros: number;
  badge: Badge;
  gradiente: string;
}

const propiedades: Propiedad[] = [
  {
    id: 1,
    nombre: "Piso luminoso con terraza",
    ubicacion: "Centro, Irun",
    precio: "285.000€",
    habitaciones: 3,
    banos: 2,
    metros: 98,
    badge: "Nuevo",
    gradiente: "linear-gradient(145deg, #4A5240 0%, #1E2418 100%)",
  },
  {
    id: 2,
    nombre: "Apartamento reformado",
    ubicacion: "Behobia, Irun",
    precio: "190.000€",
    habitaciones: 2,
    banos: 1,
    metros: 72,
    badge: "Venta",
    gradiente: "linear-gradient(145deg, #3B4535 0%, #161C12 100%)",
  },
  {
    id: 3,
    nombre: "Chalet con jardín",
    ubicacion: "Hondarribia",
    precio: "420.000€",
    habitaciones: 4,
    banos: 3,
    metros: 180,
    badge: "Venta",
    gradiente: "linear-gradient(145deg, #556050 0%, #222B1E 100%)",
  },
  {
    id: 4,
    nombre: "Ático con vistas al río",
    ubicacion: "Santiago, Irun",
    precio: "340.000€",
    habitaciones: 3,
    banos: 2,
    metros: 110,
    badge: "Venta",
    gradiente: "linear-gradient(145deg, #2E3D2A 0%, #0F1A0C 100%)",
  },
  {
    id: 5,
    nombre: "Casa adosada con garaje",
    ubicacion: "Anaka, Irun",
    precio: "295.000€",
    habitaciones: 4,
    banos: 2,
    metros: 130,
    badge: "Venta",
    gradiente: "linear-gradient(145deg, #415040 0%, #192018 100%)",
  },
  {
    id: 6,
    nombre: "Estudio en primera línea",
    ubicacion: "Hondarribia",
    precio: "165.000€",
    habitaciones: 1,
    banos: 1,
    metros: 48,
    badge: "Vendido",
    gradiente: "linear-gradient(145deg, #3A3E38 0%, #16191A 100%)",
  },
];

const badgeStyles: Record<Badge, string> = {
  Nuevo: "bg-forest text-paper",
  Venta: "bg-sand text-ink",
  Vendido: "bg-stone text-ink opacity-80",
};

export default function Propiedades() {
  return (
    <section id="propiedades" className="mx-auto max-w-7xl px-8 md:px-16 py-24 md:py-32">
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {propiedades.map((p) => (
          <Link
            key={p.id}
            href={`/propiedades/${p.id}`}
            className="group flex flex-col"
          >
            {/* Image placeholder with zoom */}
            <div className="relative overflow-hidden mb-4 aspect-[4/3]">
              <div
                className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ background: p.gradiente }}
              />
              {/* Badge */}
              <span
                className={`absolute top-3 left-3 text-xs tracking-[0.15em] uppercase font-sans px-2.5 py-1 ${badgeStyles[p.badge]}`}
              >
                {p.badge}
              </span>
            </div>

            {/* Card content */}
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl text-ink leading-snug">
                {p.nombre}
              </h3>

              <div className="flex items-baseline justify-between">
                <p className="font-sans text-sm text-mist">{p.ubicacion}</p>
                <p className="font-serif text-lg text-ink">{p.precio}</p>
              </div>

              <div className="flex items-center gap-4 pt-1 border-t border-sand">
                <span className="font-sans text-xs text-mist">
                  {p.habitaciones} hab.
                </span>
                <span className="font-sans text-xs text-mist">
                  {p.banos} {p.banos === 1 ? "baño" : "baños"}
                </span>
                <span className="font-sans text-xs text-mist">
                  {p.metros} m²
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
