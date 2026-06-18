import type { Metadata } from "next";
import Link from "next/link";
import { getClientes } from "@/lib/clientes";
import DeleteClienteButton from "@/components/admin/DeleteClienteButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Clientes" };

const tipoLabels: Record<string, string> = {
  comprador: "Comprador",
  vendedor: "Vendedor",
  ambos: "Ambos",
};

function truncar(text: string | null, max: number) {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default async function ClientesPage() {
  const clientes = await getClientes();

  const web = clientes.filter((c) => c.origen === "formulario web").length;
  const manual = clientes.filter((c) => c.origen === "manual").length;

  return (
    <div className="flex flex-col flex-1">
      {/* ── Top bar ───────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-5"
        style={{ borderBottom: "1px solid #262624" }}
      >
        <div>
          <h1 className="font-serif" style={{ fontSize: 22, color: "var(--paper)" }}>
            Clientes
          </h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--mist)" }}>
            {web} desde web · {manual} manuales
          </p>
        </div>

        <Link
          href="/admin/clientes/nuevo"
          className="hidden md:inline-flex items-center gap-2 font-sans text-sm tracking-wide px-4 py-2 rounded-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--forest)", color: "var(--paper)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo cliente
        </Link>
      </header>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="flex-1 px-4 md:px-8 py-6">
        {clientes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3 rounded-sm"
            style={{ border: "1px solid #262624" }}
          >
            <p className="font-serif text-xl" style={{ color: "var(--stone)" }}>
              Sin clientes todavía
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
              Los leads del formulario y los clientes añadidos manualmente aparecerán aquí
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards ──────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-4 mb-4">
              {clientes.map((c) => {
                const isWeb = c.origen === "formulario web";
                return (
                  <div
                    key={c.id}
                    className="rounded-sm p-4 flex flex-col gap-3"
                    style={{ backgroundColor: "#111110", border: "1px solid #262624" }}
                  >
                    {/* Nombre + origen */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-sans text-sm font-medium" style={{ color: "var(--paper)" }}>
                        {c.nombre}
                      </p>
                      <span
                        className="inline-flex items-center font-sans text-xs rounded-sm px-2 py-0.5 flex-shrink-0"
                        style={{
                          backgroundColor: isWeb ? "rgba(60,110,200,0.2)" : "rgba(120,120,116,0.2)",
                          color: isWeb ? "#7eaee0" : "#a3a19a",
                        }}
                      >
                        {isWeb ? "Web" : "Manual"}
                      </span>
                    </div>

                    {/* Contact + tipo */}
                    <div className="flex flex-col gap-1">
                      <p className="font-sans text-xs" style={{ color: "var(--stone)" }}>
                        {c.email}
                      </p>
                      <p className="font-sans text-xs" style={{ color: "var(--stone)" }}>
                        {c.tipo ? tipoLabels[c.tipo] ?? c.tipo : "Sin tipo"} · {c.zona_interes ?? "—"}
                      </p>
                    </div>

                    {/* Notas */}
                    {c.notas && (
                      <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--mist)" }}>
                        {truncar(c.notas, 80)}
                      </p>
                    )}

                    {/* Actions */}
                    <div
                      className="flex items-center gap-2 pt-3"
                      style={{ borderTop: "1px solid #262624" }}
                    >
                      <Link
                        href={`/admin/clientes/${c.id}/editar`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 font-sans text-xs px-3 py-2 rounded-sm transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                      >
                        Editar
                      </Link>
                      <DeleteClienteButton id={c.id} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table ─────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <div className="rounded-sm overflow-hidden" style={{ border: "1px solid #262624" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#111110", borderBottom: "1px solid #262624" }}>
                      {["Nombre", "Email", "Teléfono", "Tipo", "Zona de interés", "Presupuesto", "Origen", "Notas", "Acciones"].map(
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
                    {clientes.map((c, i) => {
                      const isLast = i === clientes.length - 1;
                      const isWeb = c.origen === "formulario web";

                      return (
                        <tr
                          key={c.id}
                          className="hover:bg-[#191918] transition-colors duration-100"
                          style={{ borderBottom: isLast ? "none" : "1px solid #1e1e1c" }}
                        >
                          <td style={{ padding: "14px 16px", minWidth: 160 }}>
                            <p className="font-sans text-sm font-medium" style={{ color: "var(--paper)" }}>
                              {c.nombre}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", minWidth: 180 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {c.email}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {c.telefono ?? "—"}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {c.tipo ? tipoLabels[c.tipo] ?? c.tipo : "—"}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {c.zona_interes ?? "—"}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {c.presupuesto ?? "—"}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <span
                              className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5"
                              style={{
                                backgroundColor: isWeb ? "rgba(60,110,200,0.2)" : "rgba(120,120,116,0.2)",
                                color: isWeb ? "#7eaee0" : "#a3a19a",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {isWeb ? "Web" : "Manual"}
                            </span>
                          </td>

                          <td style={{ padding: "14px 16px", minWidth: 200 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {truncar(c.notas, 50)}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/clientes/${c.id}/editar`}
                                className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70"
                                style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Editar
                              </Link>

                              <DeleteClienteButton id={c.id} />
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
          {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"} en total
        </p>
      </div>

    </div>
  );
}
