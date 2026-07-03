import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTestimonios } from "@/lib/testimonios";
import DeleteTestimonioButton from "@/components/admin/DeleteTestimonioButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Testimonios" };

function Stars({ n }: { n: number }) {
  return (
    <span className="font-sans text-xs" style={{ color: "#c9a84c", letterSpacing: 1 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function truncar(text: string | null, max: number) {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default async function TestimoniosPage() {
  const testimonios = await getTestimonios();
  const activos = testimonios.filter((t) => t.activo).length;

  return (
    <div className="flex flex-col flex-1">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 md:px-8 py-5" style={{ borderBottom: "1px solid #262624" }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: 22, color: "var(--paper)" }}>Testimonios</h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--mist)" }}>
            {activos} activos · {testimonios.length} en total
          </p>
        </div>
        <Link
          href="/admin/testimonios/nuevo"
          className="inline-flex items-center gap-2 font-sans text-sm tracking-wide px-4 py-2 rounded-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--forest)", color: "var(--paper)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo testimonio
        </Link>
      </header>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex-1 px-4 md:px-8 py-6">
        {testimonios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 rounded-sm" style={{ border: "1px solid #262624" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--stone)" }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className="font-serif text-xl" style={{ color: "var(--stone)" }}>Sin testimonios todavía</p>
            <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>Añade el primero con el botón de arriba</p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards ──────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-4 mb-4">
              {testimonios.map((t) => (
                <div key={t.id} className="rounded-sm overflow-hidden" style={{ backgroundColor: "#111110", border: "1px solid #262624" }}>
                  <div className="flex gap-3 p-4">
                    <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 48, height: 48, backgroundColor: "var(--forest)" }}>
                      {t.foto_url ? (
                        <Image src={t.foto_url} alt={t.nombre} width={48} height={48} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif text-lg" style={{ color: "var(--paper)" }}>
                          {t.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-sans text-sm font-medium truncate" style={{ color: "var(--paper)" }}>{t.nombre}</p>
                        <span className="font-sans text-xs rounded-sm px-1.5 py-0.5 flex-shrink-0" style={{ backgroundColor: t.activo ? "rgba(45,90,50,0.25)" : "rgba(80,80,76,0.25)", color: t.activo ? "#7ec87e" : "#9a9890" }}>
                          {t.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <Stars n={t.valoracion} />
                      <p className="font-sans text-xs" style={{ color: "var(--mist)" }}>{truncar(t.texto, 70)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: "1px solid #262624" }}>
                    <Link href={`/admin/testimonios/${t.id}/editar`} className="flex-1 inline-flex items-center justify-center gap-1.5 font-sans text-xs px-3 py-2 rounded-sm transition-opacity hover:opacity-70" style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}>
                      Editar
                    </Link>
                    <DeleteTestimonioButton id={t.id} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table ─────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <div className="rounded-sm overflow-hidden" style={{ border: "1px solid #262624" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#111110", borderBottom: "1px solid #262624" }}>
                      {["Foto", "Nombre", "Texto", "Valoración", "Estado", "Acciones"].map((col) => (
                        <th key={col} className="font-sans text-xs uppercase tracking-widest text-left" style={{ color: "var(--mist)", padding: "11px 16px", fontWeight: 500, whiteSpace: "nowrap" }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {testimonios.map((t, i) => {
                      const isLast = i === testimonios.length - 1;
                      return (
                        <tr key={t.id} className="hover:bg-[#191918] transition-colors duration-100" style={{ borderBottom: isLast ? "none" : "1px solid #1e1e1c" }}>
                          <td style={{ padding: "14px 16px" }}>
                            <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: "var(--forest)" }}>
                              {t.foto_url ? (
                                <Image src={t.foto_url} alt={t.nombre} width={40} height={40} className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-serif text-base" style={{ color: "var(--paper)" }}>
                                  {t.nombre.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>{t.nombre}</p>
                          </td>
                          <td style={{ padding: "14px 16px", minWidth: 240 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>{truncar(t.texto, 60)}</p>
                          </td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <Stars n={t.valoracion} />
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5" style={{ backgroundColor: t.activo ? "rgba(45,90,50,0.25)" : "rgba(80,80,76,0.25)", color: t.activo ? "#7ec87e" : "#9a9890", whiteSpace: "nowrap" }}>
                              <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, backgroundColor: t.activo ? "#5cb85c" : "#6a6a66" }} />
                              {t.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div className="flex items-center gap-2">
                              <Link href={`/admin/testimonios/${t.id}/editar`} className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70" style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Editar
                              </Link>
                              <DeleteTestimonioButton id={t.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        <p className="font-sans text-xs mt-4" style={{ color: "var(--mist)" }}>
          {testimonios.length} {testimonios.length === 1 ? "testimonio" : "testimonios"} en total
        </p>
      </div>
    </div>
  );
}
