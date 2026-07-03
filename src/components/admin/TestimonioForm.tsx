"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { TestimonioFormData } from "@/lib/types";
import {
  createTestimonioAction,
  updateTestimonioAction,
  uploadTestimonioImageAction,
} from "@/lib/actions/testimonios";

interface Props {
  initialData?: Partial<TestimonioFormData>;
  testimonioId?: string;
}

const DEFAULTS: TestimonioFormData = {
  nombre: "",
  texto: "",
  valoracion: 5,
  foto_url: "",
  activo: true,
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "var(--mist)" }}>
      {children}
      {required && <span style={{ color: "#e07878", marginLeft: 3 }}>*</span>}
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs uppercase tracking-widest pb-3 mb-5" style={{ color: "var(--mist)", borderBottom: "1px solid #222220" }}>
      {children}
    </p>
  );
}

function StarSelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${i} estrella${i > 1 ? "s" : ""}`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={i <= (hover || value) ? "#c9a84c" : "none"}
            stroke={i <= (hover || value) ? "#c9a84c" : "#4a4a47"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      <span className="font-sans text-sm self-center ml-1" style={{ color: "var(--mist)" }}>
        {hover || value}/5
      </span>
    </div>
  );
}

export default function TestimonioForm({ initialData, testimonioId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(testimonioId);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<TestimonioFormData>({ ...DEFAULTS, ...initialData });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return () => { if (fotoPreview) URL.revokeObjectURL(fotoPreview); };
  }, [fotoPreview]);

  function field(key: keyof TestimonioFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
      }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function clearFoto() {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoFile(null);
    setFotoPreview(null);
    setForm((prev) => ({ ...prev, foto_url: "" }));
  }

  const displayFoto = fotoPreview ?? form.foto_url ?? null;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    let finalUrl = form.foto_url;

    try {
      if (fotoFile) {
        setStatus("uploading");
        const fd = new FormData();
        fd.append("file", fotoFile);
        finalUrl = await uploadTestimonioImageAction(fd);
      }

      setStatus("saving");
      const payload: TestimonioFormData = { ...form, foto_url: finalUrl };

      if (isEdit && testimonioId) {
        await updateTestimonioAction(testimonioId, payload);
      } else {
        await createTestimonioAction(payload);
      }

      setStatus("success");
      setTimeout(() => router.push("/admin/testimonios"), 1400);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#7ec87e" strokeWidth="1.5" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
        <p className="font-serif text-xl" style={{ color: "var(--paper)" }}>
          {isEdit ? "Cambios guardados" : "Testimonio añadido"}
        </p>
        <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>Redirigiendo…</p>
      </div>
    );
  }

  const isLoading = status === "uploading" || status === "saving";

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center px-8 py-5" style={{ borderBottom: "1px solid #262624" }}>
        <div>
          <div className="flex items-center gap-1.5 mb-1 font-sans text-xs" style={{ color: "var(--mist)" }}>
            <Link href="/admin/testimonios" className="hover:opacity-70 transition-opacity">Testimonios</Link>
            <span>/</span>
            <span style={{ color: "var(--stone)" }}>{isEdit ? "Editar" : "Nuevo testimonio"}</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: 22, color: "var(--paper)" }}>
            {isEdit ? "Editar testimonio" : "Nuevo testimonio"}
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-3xl flex flex-col gap-8">

          <section>
            <SectionHeading>Testimonio</SectionHeading>
            <div className="flex flex-col gap-5">

              <div>
                <FieldLabel required>Nombre del cliente</FieldLabel>
                <input
                  required
                  value={form.nombre}
                  onChange={field("nombre")}
                  placeholder="Ej. María García"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel required>Texto</FieldLabel>
                <textarea
                  required
                  rows={4}
                  value={form.texto}
                  onChange={field("texto")}
                  placeholder="Escribe aquí el testimonio del cliente…"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                />
              </div>

              <div>
                <FieldLabel required>Valoración</FieldLabel>
                <StarSelector
                  value={form.valoracion}
                  onChange={(n) => setForm((prev) => ({ ...prev, valoracion: n }))}
                />
              </div>

              {/* Foto */}
              <div>
                <FieldLabel>Foto del cliente</FieldLabel>
                {displayFoto ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 72, height: 72, border: "1px solid #2a2a28" }}>
                      <Image
                        src={displayFoto}
                        alt="Foto"
                        width={72}
                        height={72}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                      >
                        Cambiar foto
                      </button>
                      <button
                        type="button"
                        onClick={clearFoto}
                        className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "#2a1a1a", color: "#e07878", border: "1px solid #3d2424" }}
                      >
                        Quitar
                      </button>
                      {fotoFile && (
                        <p className="font-sans text-xs" style={{ color: "#4a4a47" }}>
                          {fotoFile.name} · {(fotoFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 rounded-sm transition-colors"
                    style={{ border: "2px dashed #2a2a28", padding: "24px 20px", backgroundColor: "#0d0d0c", cursor: "pointer" }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "#4d604e")}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "#2a2a28")}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--mist)" }}>
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>Subir foto del cliente</p>
                    <p className="font-sans text-xs" style={{ color: "#4a4a47" }}>JPG, PNG, WebP · Máx. 5 MB · Imagen cuadrada recomendada</p>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={field("activo")}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: "var(--forest)" }}
                  />
                  <span className="font-sans text-sm" style={{ color: "var(--paper)" }}>Visible en la web</span>
                </label>
              </div>

            </div>
          </section>

          {status === "error" && (
            <div className="rounded-sm px-4 py-3 font-sans text-sm" style={{ backgroundColor: "#2a1a1a", border: "1px solid #3d2424", color: "#f08080" }}>
              {errorMsg || "Ha ocurrido un error. Inténtalo de nuevo."}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 pb-10" style={{ borderTop: "1px solid #222220" }}>
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
              {status === "uploading" ? "Subiendo foto…" : status === "saving" ? (isEdit ? "Guardando…" : "Añadiendo…") : isEdit ? "Guardar cambios" : "Añadir testimonio"}
            </button>
            <Link
              href="/admin/testimonios"
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
