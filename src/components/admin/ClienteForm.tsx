"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ClienteFormData } from "@/lib/types";
import {
  createClienteAction,
  updateClienteAction,
} from "@/lib/actions/clientes";

interface Props {
  initialData?: Partial<ClienteFormData>;
  clienteId?: string;
}

const DEFAULTS: ClienteFormData = {
  nombre: "",
  email: "",
  telefono: "",
  tipo: "",
  presupuesto: "",
  zona_interes: "",
  notas: "",
};

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p
      className="font-sans text-xs uppercase tracking-widest mb-2"
      style={{ color: "var(--mist)" }}
    >
      {children}
      {required && (
        <span style={{ color: "#e07878", marginLeft: 3 }}>*</span>
      )}
    </p>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#0f0f0e",
  border: "1px solid #2a2a28",
  color: "var(--paper)",
  padding: "9px 12px",
  borderRadius: 2,
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9890' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans text-xs uppercase tracking-widest pb-3 mb-5"
      style={{ color: "var(--mist)", borderBottom: "1px solid #222220" }}
    >
      {children}
    </p>
  );
}

export default function ClienteForm({ initialData, clienteId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(clienteId);

  const [form, setForm] = useState<ClienteFormData>({
    ...DEFAULTS,
    ...initialData,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function field(key: keyof ClienteFormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("saving");

    try {
      if (isEdit && clienteId) {
        await updateClienteAction(clienteId, form);
      } else {
        await createClienteAction(form);
      }
      setStatus("success");
      setTimeout(() => router.push("/admin/clientes"), 1400);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7ec87e"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
        <p className="font-serif text-xl" style={{ color: "var(--paper)" }}>
          {isEdit ? "Cambios guardados" : "Cliente creado"}
        </p>
        <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
          Redirigiendo a clientes…
        </p>
      </div>
    );
  }

  const isLoading = status === "saving";

  return (
    <div className="flex flex-col flex-1">
      <header
        className="flex items-center px-8 py-5"
        style={{ borderBottom: "1px solid #262624" }}
      >
        <div>
          <div
            className="flex items-center gap-1.5 mb-1 font-sans text-xs"
            style={{ color: "var(--mist)" }}
          >
            <Link
              href="/admin/clientes"
              className="hover:opacity-70 transition-opacity"
            >
              Clientes
            </Link>
            <span>/</span>
            <span style={{ color: "var(--stone)" }}>
              {isEdit ? "Editar" : "Nuevo cliente"}
            </span>
          </div>
          <h1
            className="font-serif"
            style={{ fontSize: 22, color: "var(--paper)" }}
          >
            {isEdit ? "Editar cliente" : "Nuevo cliente"}
          </h1>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex-1 px-8 py-6 overflow-y-auto"
      >
        <div className="max-w-3xl flex flex-col gap-8">

          <section>
            <SectionHeading>Datos del cliente</SectionHeading>
            <div className="flex flex-col gap-5">

              <div>
                <FieldLabel required>Nombre</FieldLabel>
                <input
                  required
                  value={form.nombre}
                  onChange={field("nombre")}
                  placeholder="Nombre completo"
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={field("email")}
                    placeholder="cliente@email.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Teléfono</FieldLabel>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={field("telefono")}
                    placeholder="+34 600 000 000"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Tipo</FieldLabel>
                  <select
                    value={form.tipo}
                    onChange={field("tipo")}
                    style={selectStyle}
                  >
                    <option value="">Sin especificar</option>
                    <option value="comprador">Comprador</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Presupuesto</FieldLabel>
                  <input
                    value={form.presupuesto}
                    onChange={field("presupuesto")}
                    placeholder="Ej. 200.000 - 250.000 €"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Zona de interés</FieldLabel>
                <input
                  value={form.zona_interes}
                  onChange={field("zona_interes")}
                  placeholder="Ej. Centro, Behobia…"
                  style={inputStyle}
                />
              </div>

            </div>
          </section>

          <section>
            <SectionHeading>Notas</SectionHeading>
            <textarea
              rows={5}
              value={form.notas}
              onChange={field("notas")}
              placeholder="Notas internas sobre el cliente…"
              style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
            />
          </section>

          {status === "error" && (
            <div
              className="rounded-sm px-4 py-3 font-sans text-sm"
              style={{
                backgroundColor: "#2a1a1a",
                border: "1px solid #3d2424",
                color: "#f08080",
              }}
            >
              {errorMsg || "Ha ocurrido un error. Inténtalo de nuevo."}
            </div>
          )}

          <div
            className="flex items-center gap-3 pt-4 pb-10"
            style={{ borderTop: "1px solid #222220" }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 font-sans text-sm tracking-wide px-5 py-2.5 rounded-sm transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--forest)", color: "var(--paper)" }}
            >
              {isLoading ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              )}
              {isLoading
                ? isEdit ? "Guardando…" : "Creando…"
                : isEdit ? "Guardar cambios" : "Guardar cliente"}
            </button>

            <Link
              href="/admin/clientes"
              className="inline-flex items-center font-sans text-sm px-4 py-2.5 rounded-sm transition-opacity hover:opacity-60"
              style={{ color: "var(--mist)", backgroundColor: "#1a1a18", border: "1px solid #2a2a28" }}
            >
              Cancelar
            </Link>
          </div>

        </div>
      </form>
    </div>
  );
}
