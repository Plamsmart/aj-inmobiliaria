"use client";

import { useState, useEffect } from "react";
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
  const [autoKey, setAutoKey] = useState(0);

  function goTo(idx: number) {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 220);
  }

  function handleNext() {
    setAutoKey((k) => k + 1);
    goTo((current + 1) % total);
  }

  function handlePrev() {
    setAutoKey((k) => k + 1);
    goTo((current - 1 + total) % total);
  }

  useEffect(() => {
    if (total <= 1) return;
    let alive = true;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        if (!alive) return;
        setCurrent((c) => (c + 1) % total);
        setFading(false);
      }, 220);
    }, 4000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [autoKey, total]);

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--stone)" }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Card */}
        <div
          className="flex-1 max-w-2xl"
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 220ms ease",
          }}
        >
          <div
            className="flex flex-col items-center text-center gap-6 rounded-sm px-8 py-10 md:px-12 md:py-12"
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

            {/* Quote */}
            <blockquote
              className="font-serif text-lg md:text-xl leading-relaxed"
              style={{ color: "var(--bark, #3a3228)" }}
            >
              <em>&ldquo;{t.texto}&rdquo;</em>
            </blockquote>

            {/* Name */}
            <p
              className="font-sans text-sm uppercase tracking-widest"
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--stone)" }}>
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
              onClick={() => { setAutoKey((k) => k + 1); goTo(i); }}
              aria-label={`Testimonio ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                backgroundColor: i === current ? "var(--forest)" : "var(--stone)",
                opacity: i === current ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
