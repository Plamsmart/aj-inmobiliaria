"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PropiedadFormData } from "@/lib/types";
import {
  createPropiedadAction,
  updatePropiedadAction,
} from "@/lib/actions/propiedades";
import { uploadImageAction } from "@/lib/actions/storage";

export type { PropiedadFormData };

interface Props {
  initialData?: Partial<PropiedadFormData>;
  propiedadId?: string;
}

const DEFAULTS: PropiedadFormData = {
  titulo: "",
  ubicacion: "",
  tipo: "Piso",
  precio: "",
  habitaciones: "",
  banos: "",
  m2: "",
  estado: "Activa",
  descripcion: "",
};

// ── Shared field primitives ───────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function PropiedadForm({ initialData, propiedadId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(propiedadId);

  const [form, setForm] = useState<PropiedadFormData>({
    ...DEFAULTS,
    ...initialData,
  });
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function field(key: keyof PropiedadFormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImagenes((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function removeFile(i: number) {
    setImagenes((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      // 1. Upload images to Supabase Storage
      let imageUrls: string[] = [];
      if (imagenes.length > 0) {
        setStatus("uploading");
        setUploadProgress({ done: 0, total: imagenes.length });

        imageUrls = await Promise.all(
          imagenes.map(async (file, i) => {
            const fd = new FormData();
            fd.append("file", file);
            const url = await uploadImageAction(fd);
            setUploadProgress((p) => ({ ...p, done: i + 1 }));
            return url;
          })
        );
      }

      // 2. Save property to database
      setStatus("saving");
      if (isEdit && propiedadId) {
        await updatePropiedadAction(propiedadId, form, imageUrls);
      } else {
        await createPropiedadAction(form, imageUrls);
      }

      setStatus("success");
      setTimeout(() => router.push("/admin/propiedades"), 1400);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
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
          {isEdit ? "Cambios guardados" : "Propiedad creada"}
        </p>
        <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
          Redirigiendo a propiedades…
        </p>
      </div>
    );
  }

  const isLoading = status === "uploading" || status === "saving";

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1">
      {/* Top bar */}
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
              href="/admin/propiedades"
              className="hover:opacity-70 transition-opacity"
            >
              Propiedades
            </Link>
            <span>/</span>
            <span style={{ color: "var(--stone)" }}>
              {isEdit ? "Editar" : "Nueva propiedad"}
            </span>
          </div>
          <h1
            className="font-serif"
            style={{ fontSize: 22, color: "var(--paper)" }}
          >
            {isEdit ? "Editar propiedad" : "Nueva propiedad"}
          </h1>
        </div>
      </header>

      {/* Form body */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 px-8 py-6 overflow-y-auto"
      >
        <div className="max-w-3xl flex flex-col gap-8">

          {/* ── Información general ──────────────────────────── */}
          <section>
            <SectionHeading>Información general</SectionHeading>
            <div className="flex flex-col gap-5">

              <div>
                <FieldLabel required>Título</FieldLabel>
                <input
                  required
                  value={form.titulo}
                  onChange={field("titulo")}
                  placeholder="Ej. Piso reformado en Calle Mayor"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel required>Ubicación</FieldLabel>
                <input
                  required
                  value={form.ubicacion}
                  onChange={field("ubicacion")}
                  placeholder="Ej. Irun, Gipuzkoa"
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FieldLabel required>Precio (€)</FieldLabel>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1000"
                    value={form.precio}
                    onChange={field("precio")}
                    placeholder="285000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel required>Tipo</FieldLabel>
                  <select
                    required
                    value={form.tipo}
                    onChange={field("tipo")}
                    style={selectStyle}
                  >
                    <option value="Piso">Piso</option>
                    <option value="Casa">Casa</option>
                    <option value="Chalet">Chalet</option>
                    <option value="Ático">Ático</option>
                    <option value="Local">Local</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Estado</FieldLabel>
                  <select
                    required
                    value={form.estado}
                    onChange={field("estado")}
                    style={selectStyle}
                  >
                    <option value="Activa">Activa</option>
                    <option value="Vendida">Vendida</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Habitaciones</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    value={form.habitaciones}
                    onChange={field("habitaciones")}
                    placeholder="3"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Baños</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    value={form.banos}
                    onChange={field("banos")}
                    placeholder="1"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Metros cuadrados</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    value={form.m2}
                    onChange={field("m2")}
                    placeholder="94"
                    style={inputStyle}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ── Descripción ───────────────────────────────────── */}
          <section>
            <SectionHeading>Descripción</SectionHeading>
            <div>
              <FieldLabel>Descripción</FieldLabel>
              <textarea
                rows={5}
                value={form.descripcion}
                onChange={field("descripcion")}
                placeholder="Describe la propiedad: características, reformas, vistas, orientación…"
                style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
              />
            </div>
          </section>

          {/* ── Imágenes ──────────────────────────────────────── */}
          <section>
            <SectionHeading>Imágenes</SectionHeading>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-sm transition-colors"
              style={{
                border: "2px dashed #2a2a28",
                padding: "28px 20px",
                backgroundColor: "#0d0d0c",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#4d604e")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#2a2a28")}
            >
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                style={{ color: "var(--mist)" }}
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                Haz clic para añadir imágenes
              </p>
              <p className="font-sans text-xs" style={{ color: "#4a4a47" }}>
                JPG, PNG, WebP · Máx. 10 MB por imagen
              </p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
              />
            </button>

            {imagenes.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {imagenes.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-sm px-3 py-2"
                    style={{ backgroundColor: "#111110", border: "1px solid #222220" }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--mist)", flexShrink: 0 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <p className="font-sans text-xs truncate" style={{ color: "var(--stone)" }}>
                        {file.name}
                      </p>
                      <p className="font-sans text-xs flex-shrink-0" style={{ color: "#4a4a47" }}>
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="flex-shrink-0 ml-3 transition-opacity hover:opacity-60"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "#e07878" }}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Error ─────────────────────────────────────────── */}
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

          {/* ── Actions ────────────────────────────────────────── */}
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
              {status === "uploading"
                ? `Subiendo ${uploadProgress.done}/${uploadProgress.total}…`
                : status === "saving"
                  ? isEdit ? "Guardando…" : "Creando…"
                  : isEdit ? "Guardar cambios" : "Guardar propiedad"}
            </button>

            <Link
              href="/admin/propiedades"
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
