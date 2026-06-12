import Link from "next/link";

export default function Intro() {
  return (
    <section className="mx-auto max-w-7xl px-8 md:px-16 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x md:divide-stone">
        {/* Left column */}
        <div className="md:pr-16 pb-16 md:pb-0">
          <p className="text-xs tracking-[0.25em] uppercase text-mist font-sans mb-6">
            Agencia independiente · Irun
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-ink mb-8">
            Conocemos cada barrio,
            <br />
            <em style={{ color: "var(--forest)" }}>
              el carácter de cada hogar
            </em>
          </h2>

          <p className="font-sans text-base text-mist leading-relaxed max-w-md mb-10">
            Aroa y Jon fundaron AJ Inmobiliaria con una convicción simple: cada
            propiedad merece una presentación honesta y cuidada. Como agencia
            independiente en Irun llevamos más de una década acompañando a
            familias y propietarios en la Costa Vasca con criterio, proximidad y
            sin intermediarios innecesarios.
          </p>

          <Link
            href="/nosotros"
            className="inline-flex items-center gap-2 font-sans text-sm tracking-wide uppercase text-ink border-b border-ink pb-0.5 hover:opacity-50 transition-opacity"
          >
            Conocer nuestra historia
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right column */}
        <div className="md:pl-16 flex flex-col divide-y divide-stone">
          <div className="py-10 md:pt-0 md:pb-12">
            <p className="font-serif text-6xl md:text-7xl text-ink leading-none mb-3">
              +40
            </p>
            <p className="font-sans text-sm text-mist leading-snug max-w-xs">
              Propiedades activas en cartera en Gipuzkoa y la Costa Vasca.
            </p>
          </div>

          <div className="py-10 md:pb-0 md:pt-12">
            <p className="font-serif text-6xl md:text-7xl text-ink leading-none mb-3">
              24h
            </p>
            <p className="font-sans text-sm text-mist leading-snug max-w-xs">
              Tiempo máximo de respuesta garantizado a propietarios y
              compradores.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
