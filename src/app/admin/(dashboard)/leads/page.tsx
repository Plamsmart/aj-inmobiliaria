import type { Metadata } from "next";
import { getLeads } from "@/lib/leads";
import type { LeadEstado } from "@/lib/types";
import LeadEstadoSelect from "@/components/admin/LeadEstadoSelect";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads" };

const estadoStyles: Record<LeadEstado, { bg: string; text: string; dot: string }> = {
  Pendiente: { bg: "rgba(204,164,0,0.18)", text: "#e0bd4a", dot: "#e0bd4a" },
  Contactado: { bg: "rgba(60,110,200,0.2)", text: "#7eaee0", dot: "#5c96d8" },
  Cerrado: { bg: "rgba(45,90,50,0.25)", text: "#7ec87e", dot: "#5cb85c" },
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function truncar(text: string | null, max: number) {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default async function LeadsPage() {
  const leads = await getLeads();

  const pendientes = leads.filter((l) => l.estado === "Pendiente").length;
  const contactados = leads.filter((l) => l.estado === "Contactado").length;
  const cerrados = leads.filter((l) => l.estado === "Cerrado").length;

  return (
    <div className="flex flex-col flex-1">
      {/* ── Top bar ───────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-5"
        style={{ borderBottom: "1px solid #262624" }}
      >
        <div>
          <h1 className="font-serif" style={{ fontSize: 22, color: "var(--paper)" }}>
            Leads
          </h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--mist)" }}>
            {pendientes} pendientes · {contactados} contactados · {cerrados} cerrados
          </p>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="flex-1 px-4 md:px-8 py-6">
        {leads.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3 rounded-sm"
            style={{ border: "1px solid #262624" }}
          >
            <p className="font-serif text-xl" style={{ color: "var(--stone)" }}>
              Sin leads todavía
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
              Los mensajes del formulario de contacto aparecerán aquí
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards ──────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-4 mb-4">
              {leads.map((lead) => {
                const badge = estadoStyles[lead.estado];
                return (
                  <div
                    key={lead.id}
                    className="rounded-sm p-4 flex flex-col gap-3"
                    style={{ backgroundColor: "#111110", border: "1px solid #262624" }}
                  >
                    {/* Nombre + fecha */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-sans text-sm font-medium" style={{ color: "var(--paper)" }}>
                        {lead.nombre}
                      </p>
                      <p className="font-sans text-xs flex-shrink-0" style={{ color: "var(--mist)" }}>
                        {formatFecha(lead.created_at)}
                      </p>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-1">
                      <p className="font-sans text-xs" style={{ color: "var(--stone)" }}>
                        {lead.email}
                      </p>
                      <p className="font-sans text-xs" style={{ color: "var(--stone)" }}>
                        {lead.telefono || "—"}
                      </p>
                    </div>

                    {/* Mensaje */}
                    {lead.mensaje && (
                      <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--mist)" }}>
                        {truncar(lead.mensaje, 80)}
                      </p>
                    )}

                    {/* Estado + select */}
                    <div
                      className="flex items-center justify-between gap-3 pt-3"
                      style={{ borderTop: "1px solid #262624" }}
                    >
                      <span
                        className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        <span
                          className="rounded-full flex-shrink-0"
                          style={{ width: 5, height: 5, backgroundColor: badge.dot }}
                        />
                        {lead.estado}
                      </span>
                      <LeadEstadoSelect id={lead.id} estado={lead.estado} />
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
                      {["Nombre", "Email", "Teléfono", "Qué busca", "Mensaje", "Fecha", "Estado", "Acciones"].map(
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
                    {leads.map((lead, i) => {
                      const badge = estadoStyles[lead.estado];
                      const isLast = i === leads.length - 1;

                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-[#191918] transition-colors duration-100"
                          style={{ borderBottom: isLast ? "none" : "1px solid #1e1e1c" }}
                        >
                          <td style={{ padding: "14px 16px", minWidth: 160 }}>
                            <p className="font-sans text-sm font-medium" style={{ color: "var(--paper)" }}>
                              {lead.nombre}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", minWidth: 180 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {lead.email}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {lead.telefono}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {lead.tipo ?? "—"}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", minWidth: 220 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {truncar(lead.mensaje, 50)}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-xs" style={{ color: "var(--mist)" }}>
                              {formatFecha(lead.created_at)}
                            </p>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <span
                              className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5"
                              style={{ backgroundColor: badge.bg, color: badge.text, whiteSpace: "nowrap" }}
                            >
                              <span
                                className="rounded-full flex-shrink-0"
                                style={{ width: 5, height: 5, backgroundColor: badge.dot }}
                              />
                              {lead.estado}
                            </span>
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            <LeadEstadoSelect id={lead.id} estado={lead.estado} />
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
          {leads.length} {leads.length === 1 ? "lead" : "leads"} en total
        </p>
      </div>
    </div>
  );
}
