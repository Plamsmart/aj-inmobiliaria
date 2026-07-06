"use client";

import { useState } from "react";
import Image from "next/image";
import type { Testimonio } from "@/lib/types";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i <= n ? "#c9a84c" : "none"}
          stroke={i <= n ? "#c9a84c" : "#c8c5bc"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimoniosCarruselSlider({
  testimonios,
}: {
  testimonios: Testimonio[];
}) {
  const total = testimonios.length;
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  function goTo(idx: number) {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 440);
  }

  function handleNext() {
    goTo((current + 1) % total);
  }

  function handlePrev() {
    goTo((current - 1 + total) % total);
  }

  const t = testimonios[current];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Carousel row */}
      <div className="relative w-full flex items-center justify-center gap-4">
        {/* Prev */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Anterior"
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(0,0,0,0.06)]"
            style={{ border: "1px solid var(--stone)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--stone)" }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Card */}
        <div
          className="flex-1 max-w-2xl"
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 440ms ease",
          }}
        >
          <div
            className="flex flex-col items-center justify-center text-center gap-5 rounded-sm px-8 py-8 md:px-12 h-96"
            style={{
              backgroundColor: "var(--paper)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            {/* Photo or initial */}
            <div className="flex-shrink-0">
              {t.foto_url ? (
                <Image
                  src={t.foto_url}
                  alt={t.nombre}
                  width={72}
                  height={72}
                  className="rounded-full object-cover"
                  style={{ width: 72, height: 72 }}
                />
              ) : (
                <div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-serif text-2xl"
                  style={{
                    backgroundColor: "var(--forest)",
                    color: "var(--paper)",
                  }}
                >
                  {t.nombre.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Stars */}
            <Stars n={t.valoracion} />

            {/* Quote — scrollable if text is very long */}
            <div className="overflow-y-auto max-h-36 w-full px-1">
              <blockquote
                className="font-serif text-lg md:text-xl leading-relaxed"
                style={{ color: "var(--bark, #3a3228)" }}
              >
                <em>&ldquo;{t.texto}&rdquo;</em>
              </blockquote>
            </div>

            {/* Name */}
            <p
              className="font-sans text-sm uppercase tracking-widest flex-shrink-0"
              style={{ color: "var(--stone)" }}
            >
              {t.nombre}
            </p>
          </div>
        </div>

        {/* Next */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente"
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(0,0,0,0.06)]"
            style={{ border: "1px solid var(--stone)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--stone)" }}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="flex gap-2">
          {testimonios.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Testimonio ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                backgroundColor:
                  i === current ? "var(--forest)" : "var(--stone)",
                opacity: i === current ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
