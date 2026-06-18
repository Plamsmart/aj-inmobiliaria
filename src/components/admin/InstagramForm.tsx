"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { InstagramPostFormData } from "@/lib/types";
import {
  createInstagramPostAction,
  updateInstagramPostAction,
  uploadInstagramImageAction,
} from "@/lib/actions/instagram";

interface Props {
  initialData?: Partial<InstagramPostFormData>;
  postId?: string;
}

const DEFAULTS: InstagramPostFormData = {
  url: "",
  thumbnail_url: "",
  descripcion: "",
  orden: "0",
  activo: true,
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
    <p
      className="font-sans text-xs uppercase tracking-widest pb-3 mb-5"
      style={{ color: "var(--mist)", borderBottom: "1px solid #222220" }}
    >
      {children}
    </p>
  );
}

export default function InstagramForm({ initialData, postId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<InstagramPostFormData>({
    ...DEFAULTS,
    ...initialData,
  });

  // Staged file (not yet uploaded) and its local preview URL
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Clean up object URL on unmount / file change
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  function field(key: keyof InstagramPostFormData) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
      }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function clearThumbnail() {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setForm((prev) => ({ ...prev, thumbnail_url: "" }));
  }

  // The effective thumbnail to show in the preview area
  const displayThumbnail = thumbnailPreview ?? form.thumbnail_url ?? null;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    let finalUrl = form.thumbnail_url;

    try {
      // Upload staged file if present
      if (thumbnailFile) {
        setStatus("uploading");
        const fd = new FormData();
        fd.append("file", thumbnailFile);
        finalUrl = await uploadInstagramImageAction(fd);
      }

      setStatus("saving");
      const payload: InstagramPostFormData = { ...form, thumbnail_url: finalUrl };

      if (isEdit && postId) {
        await updateInstagramPostAction(postId, payload);
      } else {
        await createInstagramPostAction(payload);
      }

      setStatus("success");
      setTimeout(() => router.push("/admin/instagram"), 1400);
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
          {isEdit ? "Cambios guardados" : "Post añadido"}
        </p>
        <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
          Redirigiendo…
        </p>
      </div>
    );
  }

  const isLoading = status === "uploading" || status === "saving";

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
            <Link href="/admin/instagram" className="hover:opacity-70 transition-opacity">
              Instagram
            </Link>
            <span>/</span>
            <span style={{ color: "var(--stone)" }}>
              {isEdit ? "Editar post" : "Añadir post"}
            </span>
          </div>
          <h1 className="font-serif" style={{ fontSize: 22, color: "var(--paper)" }}>
            {isEdit ? "Editar post" : "Añadir post"}
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-3xl flex flex-col gap-8">

          <section>
            <SectionHeading>Post de Instagram</SectionHeading>
            <div className="flex flex-col gap-5">

              <div>
                <FieldLabel required>URL del post</FieldLabel>
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={field("url")}
                  placeholder="https://www.instagram.com/p/..."
                  style={inputStyle}
                />
              </div>

              {/* ── Miniatura ──────────────────────────────────── */}
              <div>
                <FieldLabel>Miniatura</FieldLabel>

                {displayThumbnail ? (
                  // Preview of current / staged image
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 rounded-sm overflow-hidden"
                      style={{ width: 96, height: 96, border: "1px solid #2a2a28" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayThumbnail}
                        alt="Miniatura"
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Cambiar imagen
                      </button>
                      <button
                        type="button"
                        onClick={clearThumbnail}
                        className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "#2a1a1a", color: "#e07878", border: "1px solid #3d2424" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Quitar
                      </button>
                      {thumbnailFile && (
                        <p className="font-sans text-xs" style={{ color: "#4a4a47" }}>
                          {thumbnailFile.name} · {(thumbnailFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Drop zone
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
                      Haz clic para subir una miniatura
                    </p>
                    <p className="font-sans text-xs" style={{ color: "#4a4a47" }}>
                      JPG, PNG, WebP · Máx. 10 MB · Imagen cuadrada recomendada
                    </p>
                  </button>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={field("descripcion")}
                  placeholder="Breve descripción del post…"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Orden</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    value={form.orden}
                    onChange={field("orden")}
                    placeholder="0"
                    style={inputStyle}
                  />
                  <p className="font-sans text-xs mt-2" style={{ color: "var(--mist)" }}>
                    Menor número = antes en el grid.
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.activo}
                      onChange={field("activo")}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: "var(--forest)" }}
                    />
                    <span className="font-sans text-sm" style={{ color: "var(--paper)" }}>
                      Visible en la web
                    </span>
                  </label>
                </div>
              </div>

            </div>
          </section>

          {status === "error" && (
            <div
              className="rounded-sm px-4 py-3 font-sans text-sm"
              style={{ backgroundColor: "#2a1a1a", border: "1px solid #3d2424", color: "#f08080" }}
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
              {status === "uploading"
                ? "Subiendo imagen…"
                : status === "saving"
                  ? isEdit ? "Guardando…" : "Añadiendo…"
                  : isEdit ? "Guardar cambios" : "Añadir post"}
            </button>

            <Link
              href="/admin/instagram"
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
