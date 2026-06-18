"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/propiedades/nueva", label: "+ Nueva propiedad" },
  { href: "/admin/instagram", label: "Instagram" },
];

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      {/* ── Top bar (mobile only) ────────────────────────── */}
      <header
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 flex-shrink-0"
        style={{ height: 56, backgroundColor: "#111110", borderBottom: "1px solid #262624" }}
      >
        <Link
          href="/"
          className="font-serif tracking-tight"
          style={{ fontSize: 16, color: "var(--paper)" }}
        >
          AJ Inmobiliaria
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex items-center justify-center p-1"
          style={{ color: "var(--stone)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── Drawer overlay ───────────────────────────────── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
            onClick={close}
          />

          {/* Panel */}
          <nav
            className="absolute top-0 right-0 h-full flex flex-col"
            style={{ width: 272, backgroundColor: "#111110", borderLeft: "1px solid #262624" }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 flex-shrink-0"
              style={{ height: 56, borderBottom: "1px solid #262624" }}
            >
              <p
                className="font-sans text-xs uppercase tracking-widest"
                style={{ color: "var(--mist)" }}
              >
                Panel de control
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú"
                className="flex items-center justify-center"
                style={{ color: "var(--stone)" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 px-3 py-4">
              <p
                className="font-sans text-xs uppercase tracking-widest px-3 mb-3"
                style={{ color: "var(--mist)" }}
              >
                Gestión
              </p>
              <ul className="flex flex-col gap-0.5">
                {NAV_ITEMS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      className="flex items-center rounded-sm px-3 py-3 font-sans text-sm transition-colors hover:bg-[#1d1d1b]"
                      style={{ color: "var(--paper)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-5" style={{ borderTop: "1px solid #262624" }}>
                <Link
                  href="/"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-sm px-3 py-3 font-sans text-sm transition-opacity hover:opacity-60"
                  style={{ color: "var(--mist)" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                  </svg>
                  Ver web
                </Link>
              </div>
            </div>

            {/* Logout */}
            <div
              className="px-3 pb-8 pt-3 flex-shrink-0"
              style={{ borderTop: "1px solid #262624" }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-sm px-3 py-3 font-sans text-sm transition-opacity hover:opacity-60 text-left"
                style={{ color: "var(--mist)" }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
