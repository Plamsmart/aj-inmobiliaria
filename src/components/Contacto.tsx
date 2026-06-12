"use client";

import { useState } from "react";
import Link from "next/link";

const contactData = [
  { icon: "📞", label: "653 011 150" },
  { icon: "📧", label: "jongasesoe@gmail.com" },
  { icon: "📍", label: "Irun, Gipuzkoa" },
  { icon: "🕐", label: "Lun–Vie  9:00–19:00" },
];

const fieldClass =
  "w-full bg-transparent border-0 border-b border-stone pb-2 text-ink font-sans text-sm placeholder:text-stone focus:outline-none focus:border-ink transition-colors duration-200";

const labelClass =
  "font-sans text-xs tracking-[0.2em] uppercase text-mist mb-2 block";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-8 md:px-16 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x md:divide-stone">
        {/* Left column */}
        <div className="md:pr-16 pb-16 md:pb-0">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-mist mb-6">
            Contacto
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-10">
            Cuéntanos qué
            <br />
            necesitas
          </h2>

          <ul className="flex flex-col gap-5 mb-12">
            {contactData.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="text-base w-5 flex-shrink-0 select-none">
                  {icon}
                </span>
                <span className="font-sans text-sm text-ink">{label}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/tasacion"
            className="inline-flex items-center gap-2 font-sans text-sm tracking-wide uppercase text-ink border-b border-ink pb-0.5 hover:opacity-50 transition-opacity"
          >
            Solicitar tasación gratuita
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right column */}
        <div className="md:pl-16">
          {enviado ? (
            <div className="h-full flex flex-col justify-center py-8">
              <p className="font-serif text-2xl text-ink mb-3">
                Mensaje recibido
              </p>
              <p className="font-sans text-sm text-mist leading-relaxed max-w-sm">
                Nos pondremos en contacto contigo en menos de 24 horas. Gracias
                por confiar en AJ Inmobiliaria.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div>
                <label htmlFor="nombre" className={labelClass}>
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="telefono" className={labelClass}>
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+34 600 000 000"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="consulta" className={labelClass}>
                  ¿Qué buscas?
                </label>
                <div className="relative">
                  <select
                    id="consulta"
                    name="consulta"
                    required
                    defaultValue=""
                    className={`${fieldClass} appearance-none pr-6 cursor-pointer`}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="comprar">Quiero comprar un piso</option>
                    <option value="vender">Quiero vender mi propiedad</option>
                    <option value="tasar">Quiero tasar mi inmueble</option>
                    <option value="otro">Tengo otra consulta</option>
                  </select>
                  <span className="absolute right-0 bottom-2.5 text-mist text-xs pointer-events-none select-none">
                    ▾
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="mensaje" className={labelClass}>
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  placeholder="Cuéntanos con más detalle lo que necesitas…"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="self-start font-sans text-sm tracking-[0.15em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--paper)",
                }}
              >
                Enviar consulta
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
