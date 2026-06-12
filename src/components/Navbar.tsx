"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + start - 64; // 64px = navbar height
  const distance = end - start;
  const duration = 900;
  let startTime: number | null = null;

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = `text-sm tracking-wide uppercase transition-opacity hover:opacity-60 ${
    scrolled ? "text-ink" : "text-paper"
  }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-paper shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Left links */}
        <ul className="flex items-center gap-8">
          <li>
            <button onClick={() => scrollToSection("propiedades")} className={linkClass}>
              Comprar
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("contacto")} className={linkClass}>
              Vender
            </button>
          </li>
        </ul>

        {/* Centered logo */}
        <Link
          href="/"
          className={`absolute left-1/2 -translate-x-1/2 font-serif text-xl tracking-tight transition-colors ${
            scrolled ? "text-ink" : "text-paper"
          }`}
        >
          AJ Inmobiliaria
        </Link>

        {/* Right links + CTA */}
        <ul className="flex items-center gap-8">
          <li>
            <button onClick={() => scrollToSection("revista")} className={linkClass}>
              Revista
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("nosotros")} className={linkClass}>
              Nosotros
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("contacto")}
              className={`text-sm tracking-wide uppercase px-5 py-2 border transition-colors ${
                scrolled
                  ? "border-ink text-ink hover:bg-ink hover:text-paper"
                  : "border-paper text-paper hover:bg-paper hover:text-ink"
              }`}
            >
              Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
