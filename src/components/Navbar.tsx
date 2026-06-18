"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CalButton from "./CalButton";

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + start - 64;
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

const NAV_LINKS = [
  { label: "Comprar", id: "propiedades" },
  { label: "Vender", id: "contacto" },
  { label: "Revista", id: "revista" },
  { label: "Nosotros", id: "nosotros" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function handleNavClick(id: string) {
    setIsMenuOpen(false);
    scrollToSection(id);
  }

  const linkClass = `text-sm tracking-wide uppercase transition-opacity hover:opacity-60 ${
    scrolled ? "text-ink" : "text-paper"
  }`;

  const iconStroke = scrolled ? "var(--ink)" : "var(--paper)";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-paper shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          {/* Left links — desktop only */}
          <ul className="hidden md:flex items-center gap-8">
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

          {/* Right links + CTA — desktop only */}
          <ul className="hidden md:flex items-center gap-8">
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
              <CalButton
                text="Solicitar visita"
                className="text-sm tracking-wide uppercase px-5 py-2 transition-opacity hover:opacity-80"
              />
            </li>
          </ul>

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden ml-auto"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconStroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu overlay */}
      <div
        className="fixed inset-0 flex flex-col md:hidden"
        style={{
          backgroundColor: "var(--ink)",
          zIndex: 60,
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      >
        {/* Top bar: logo + close button */}
        <div className="flex items-center justify-between px-6 h-16 flex-shrink-0">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="font-serif text-xl tracking-tight"
            style={{ color: "var(--paper)" }}
          >
            AJ Inmobiliaria
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="transition-opacity hover:opacity-60"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--paper)"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links: centered vertically */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-10">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="font-serif text-4xl tracking-tight transition-opacity hover:opacity-50"
              style={{ color: "var(--paper)" }}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => handleNavClick("contacto")}
            className="mt-4 font-sans text-sm tracking-[0.15em] uppercase px-8 py-3 border transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--stone)",
              color: "var(--paper)",
            }}
          >
            Contacto
          </button>
        </nav>

        {/* Bottom padding for safe area */}
        <div className="h-8 flex-shrink-0" />
      </div>
    </>
  );
}
