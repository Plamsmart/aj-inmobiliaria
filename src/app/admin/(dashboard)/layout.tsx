import type { Metadata } from "next";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import SessionGuard from "@/components/admin/SessionGuard";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin AJ" },
  robots: { index: false, follow: false },
};

const NAV = [
  {
    href: "/admin/propiedades",
    label: "Propiedades",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0116 0v1" />
      </svg>
    ),
  },
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/admin/instagram",
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "/admin/testimonios",
    label: "Testimonios",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col min-h-screen md:flex-row"
      style={{ backgroundColor: "#0d0d0c", color: "var(--paper)", fontFamily: "var(--font-sans)" }}
    >
      <SessionGuard />
      {/* ── Mobile header ────────────────────────────────────── */}
      <AdminMobileHeader />

      {/* ── Sidebar (desktop only) ──────────────────────────── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0"
        style={{ width: 232, backgroundColor: "#111110", borderRight: "1px solid #262624" }}
      >
        {/* Brand */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid #262624" }}>
          <Link
            href="/"
            className="font-serif tracking-tight"
            style={{ fontSize: 16, color: "var(--paper)" }}
          >
            AJ Inmobiliaria
          </Link>
          <p
            className="font-sans uppercase tracking-widest"
            style={{ fontSize: 10, color: "var(--mist)", marginTop: 4 }}
          >
            Panel de control
          </p>
        </div>

        {/* Nav */}
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          <p
            className="font-sans uppercase tracking-widest"
            style={{ fontSize: 10, color: "var(--mist)", padding: "0 10px", marginBottom: 6 }}
          >
            Gestión
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV.map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-[#1d1d1b]"
                  style={{ color: "var(--paper)" }}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to site + logout */}
        <div
          className="flex flex-col gap-0.5"
          style={{ padding: "12px 10px", borderTop: "1px solid #262624" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-opacity hover:opacity-60"
            style={{ color: "var(--mist)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Ver web
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────── */}
      <main className="flex flex-col flex-1 min-h-screen" style={{ backgroundColor: "#131312" }}>
        {children}
      </main>
    </div>
  );
}
