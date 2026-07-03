import { getActiveTestimonios } from "@/lib/testimonios";
import TestimoniosCarruselSlider from "./TestimoniosCarruselSlider";

export default async function TestimoniosCarrusel() {
  const testimonios = await getActiveTestimonios().catch(() => []);

  if (testimonios.length === 0) return null;

  return (
    <section
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "var(--sand)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <p
            className="font-sans text-xs uppercase tracking-widest"
            style={{ color: "var(--stone)" }}
          >
            Clientes satisfechos
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "var(--bark, #3a3228)" }}
          >
            Lo que dicen nuestros clientes
          </h2>
          <div
            className="h-px w-12"
            style={{ backgroundColor: "var(--forest)", opacity: 0.4 }}
          />
        </div>

        <TestimoniosCarruselSlider testimonios={testimonios} />
      </div>
    </section>
  );
}
