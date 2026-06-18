import type { Metadata } from "next";
import Link from "next/link";
import { getPropiedades } from "@/lib/propiedades";
import type { Estado } from "@/lib/types";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Propiedades" };

const estadoStyles: Record<Estado, { bg: string; text: string; dot: string }> =
  {
    Activa: { bg: "rgba(45,90,50,0.25)", text: "#7ec87e", dot: "#5cb85c" },
    Vendida: { bg: "rgba(80,80,76,0.25)", text: "#9a9890", dot: "#6a6a66" },
  };

const PLACEHOLDER_COLORS = [
  "#3b4a35", "#2e3d30", "#3a4840",
  "#323430", "#404e38", "#364435",
];

function formatPrecio(n: number) {
  return n.toLocaleString("es-ES") + " €";
}

export default async function PropiedadesPage() {
  const propiedades = await getPropiedades();

  const activas = propiedades.filter((p) => p.estado === "Activa").length;
  const vendidas = propiedades.filter((p) => p.estado === "Vendida").length;

  return (
    <div className="flex flex-col flex-1">
      {/* ── Top bar ───────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-5"
        style={{ borderBottom: "1px solid #262624" }}
      >
        <div>
          <h1
            className="font-serif"
            style={{ fontSize: 22, color: "var(--paper)" }}
          >
            Propiedades
          </h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--mist)" }}>
            {activas} activas · {vendidas} vendidas
          </p>
        </div>

        <Link
          href="/admin/propiedades/nueva"
          className="hidden md:inline-flex items-center gap-2 font-sans text-sm tracking-wide px-4 py-2 rounded-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--forest)", color: "var(--paper)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva propiedad
        </Link>
      </header>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="flex-1 px-4 md:px-8 py-6">
        {propiedades.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3 rounded-sm"
            style={{ border: "1px solid #262624" }}
          >
            <p className="font-serif text-xl" style={{ color: "var(--stone)" }}>
              Sin propiedades
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
              Crea tu primera propiedad con el botón de arriba
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards ──────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-4 mb-4">
              {propiedades.map((p, i) => {
                const thumb = p.imagenes?.[0];
                const badge = estadoStyles[p.estado];
                const placeholder = PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length];

                return (
                  <div
                    key={p.id}
                    className="flex flex-col rounded-sm overflow-hidden"
                    style={{ backgroundColor: "#111110", border: "1px solid #262624" }}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={p.titulo}
                        className="w-full object-cover"
                        style={{ height: 160 }}
                      />
                    ) : (
                      <div style={{ height: 160, background: placeholder }} />
                    )}

                    <div className="p-4 flex flex-col gap-3">
                      <div>
                        <p className="font-sans text-sm font-medium" style={{ color: "var(--paper)" }}>
                          {p.titulo}
                        </p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--mist)" }}>
                          {p.tipo} · {p.habitaciones} hab. · {p.m2} m²
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="font-serif text-lg" style={{ color: "var(--paper)" }}>
                          {formatPrecio(p.precio)}
                        </p>
                        <span
                          className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5"
                          style={{ backgroundColor: badge.bg, color: badge.text }}
                        >
                          <span
                            className="rounded-full flex-shrink-0"
                            style={{ width: 5, height: 5, backgroundColor: badge.dot }}
                          />
                          {p.estado}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-2 pt-3"
                        style={{ borderTop: "1px solid #262624" }}
                      >
                        <Link
                          href={`/admin/propiedades/${p.id}/editar`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 font-sans text-xs px-3 py-2 rounded-sm transition-opacity hover:opacity-70"
                          style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                        >
                          Editar
                        </Link>
                        <DeleteButton id={p.id} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table ─────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <div
                className="rounded-sm overflow-hidden"
                style={{ border: "1px solid #262624" }}
              >
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#111110", borderBottom: "1px solid #262624" }}>
                      {["Imagen", "Título", "Tipo", "Ubicación", "Precio", "Estado", "Acciones"].map(
                        (col) => (
                          <th
                            key={col}
                            className="font-sans text-xs uppercase tracking-widest text-left"
                            style={{ color: "var(--mist)", padding: "11px 16px", fontWeight: 500, whiteSpace: "nowrap" }}
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {propiedades.map((p, i) => {
                      const badge = estadoStyles[p.estado];
                      const isLast = i === propiedades.length - 1;
                      const thumb = p.imagenes?.[0];
                      const placeholder = PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length];

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-[#191918] transition-colors duration-100"
                          style={{ borderBottom: isLast ? "none" : "1px solid #1e1e1c" }}
                        >
                          {/* Imagen */}
                          <td style={{ padding: "14px 16px" }}>
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumb}
                                alt={p.titulo}
                                className="rounded-sm object-cover flex-shrink-0"
                                style={{ width: 48, height: 36 }}
                              />
                            ) : (
                              <div
                                className="rounded-sm flex-shrink-0"
                                style={{ width: 48, height: 36, backgroundColor: placeholder }}
                              />
                            )}
                          </td>

                          {/* Título */}
                          <td style={{ padding: "14px 16px", minWidth: 200 }}>
                            <p className="font-sans text-sm font-medium" style={{ color: "var(--paper)" }}>
                              {p.titulo}
                            </p>
                            <p className="font-sans text-xs mt-0.5" style={{ color: "var(--mist)" }}>
                              {p.habitaciones} hab. · {p.m2} m²
                            </p>
                          </td>

                          {/* Tipo */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {p.tipo}
                            </p>
                          </td>

                          {/* Ubicación */}
                          <td style={{ padding: "14px 16px", minWidth: 160 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {p.ubicacion}
                            </p>
                          </td>

                          {/* Precio */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm font-medium tabular-nums" style={{ color: "var(--paper)" }}>
                              {formatPrecio(p.precio)}
                            </p>
                          </td>

                          {/* Estado */}
                          <td style={{ padding: "14px 16px" }}>
                            <span
                              className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5"
                              style={{ backgroundColor: badge.bg, color: badge.text, whiteSpace: "nowrap" }}
                            >
                              <span
                                className="rounded-full flex-shrink-0"
                                style={{ width: 5, height: 5, backgroundColor: badge.dot }}
                              />
                              {p.estado}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td style={{ padding: "14px 16px" }}>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/propiedades/${p.id}/editar`}
                                className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70"
                                style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Editar
                              </Link>

                              <DeleteButton id={p.id} />
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
          {propiedades.length} {propiedades.length === 1 ? "propiedad" : "propiedades"} en total
        </p>
      </div>

    </div>
  );
}
