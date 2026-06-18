import Image from "next/image";

export default function Manifesto() {
  return (
    <section
      id="nosotros"
      className="px-8 md:px-16 py-28 md:py-40"
      style={{ backgroundColor: "var(--forest)" }}
    >
      <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
        {/* Eyebrow */}
        <p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-10"
          style={{ color: "rgba(249,248,245,0.4)" }}
        >
          Nuestra filosofía
        </p>

        {/* Quote */}
        <blockquote
          className="font-serif text-2xl md:text-4xl leading-snug md:leading-snug"
          style={{ color: "var(--paper)" }}
        >
          <em>
            &ldquo;Creemos que cada casa tiene algo único que merece ser contado
            y reconocido. Nuestro trabajo es encontrar a la persona que lo
            valore tanto como tú.&rdquo;
          </em>
        </blockquote>

        {/* Separator */}
        <div
          className="w-16 h-px my-12"
          style={{ backgroundColor: "rgba(249,248,245,0.2)" }}
        />

        {/* Avatars */}
        <div className="flex items-center gap-10">
          {[
            {
              src: "/aroa.png",
              name: "Aroa",
              role: "Fundadora · Agente inmobiliaria",
            },
            {
              src: "/jon.png",
              name: "Jon",
              role: "Fundador · Agente inmobiliario",
            },
          ].map(({ src, name, role }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <Image
                src={src}
                alt={name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="font-sans text-sm"
                  style={{ color: "rgba(249,248,245,0.85)" }}
                >
                  {name}
                </span>
                <span
                  className="font-sans text-xs"
                  style={{ color: "rgba(249,248,245,0.4)" }}
                >
                  {role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
