import type { Metadata } from "next";
import Link from "next/link";
import { getInstagramPosts } from "@/lib/instagram";
import DeleteInstagramButton from "@/components/admin/DeleteInstagramButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Instagram" };

function truncar(text: string | null, max: number) {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

const BRAND_GRADIENT = "linear-gradient(145deg, #4A5240 0%, #1E2418 100%)";

export default async function InstagramPage() {
  const posts = await getInstagramPosts();
  const activos = posts.filter((p) => p.activo).length;

  return (
    <div className="flex flex-col flex-1">
      {/* ── Top bar ───────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-5"
        style={{ borderBottom: "1px solid #262624" }}
      >
        <div>
          <h1 className="font-serif" style={{ fontSize: 22, color: "var(--paper)" }}>
            Instagram
          </h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--mist)" }}>
            {activos} activos · {posts.length} en total
          </p>
        </div>

        <Link
          href="/admin/instagram/nuevo"
          className="inline-flex items-center gap-2 font-sans text-sm tracking-wide px-4 py-2 rounded-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--forest)", color: "var(--paper)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Añadir post
        </Link>
      </header>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="flex-1 px-4 md:px-8 py-6">
        {posts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3 rounded-sm"
            style={{ border: "1px solid #262624" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--stone)" }}
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <path d="M17.5 6.5h.01" strokeWidth="2" />
            </svg>
            <p className="font-serif text-xl" style={{ color: "var(--stone)" }}>
              Sin posts todavía
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--mist)" }}>
              Añade el primer post con el botón de arriba
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards ──────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-4 mb-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-sm overflow-hidden"
                  style={{ backgroundColor: "#111110", border: "1px solid #262624" }}
                >
                  <div className="flex gap-3 p-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 rounded-sm overflow-hidden" style={{ width: 56, height: 56 }}>
                      {post.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: BRAND_GRADIENT }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="font-sans text-xs truncate" style={{ color: "var(--stone)" }}>
                        {post.url}
                      </p>
                      <p className="font-sans text-xs" style={{ color: "var(--mist)" }}>
                        {truncar(post.descripcion, 60)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-sans text-xs" style={{ color: "var(--mist)" }}>
                          Orden: {post.orden}
                        </span>
                        <span
                          className="font-sans text-xs rounded-sm px-1.5 py-0.5"
                          style={{
                            backgroundColor: post.activo ? "rgba(45,90,50,0.25)" : "rgba(80,80,76,0.25)",
                            color: post.activo ? "#7ec87e" : "#9a9890",
                          }}
                        >
                          {post.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-3"
                    style={{ borderTop: "1px solid #262624" }}
                  >
                    <Link
                      href={`/admin/instagram/${post.id}/editar`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 font-sans text-xs px-3 py-2 rounded-sm transition-opacity hover:opacity-70"
                      style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                    >
                      Editar
                    </Link>
                    <DeleteInstagramButton id={post.id} />
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
                      {["Miniatura", "URL", "Descripción", "Orden", "Estado", "Acciones"].map((col) => (
                        <th
                          key={col}
                          className="font-sans text-xs uppercase tracking-widest text-left"
                          style={{ color: "var(--mist)", padding: "11px 16px", fontWeight: 500, whiteSpace: "nowrap" }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {posts.map((post, i) => {
                      const isLast = i === posts.length - 1;
                      return (
                        <tr
                          key={post.id}
                          className="hover:bg-[#191918] transition-colors duration-100"
                          style={{ borderBottom: isLast ? "none" : "1px solid #1e1e1c" }}
                        >
                          {/* Miniatura */}
                          <td style={{ padding: "14px 16px" }}>
                            <div className="rounded-sm overflow-hidden flex-shrink-0" style={{ width: 48, height: 48 }}>
                              {post.thumbnail_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={post.thumbnail_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full" style={{ background: BRAND_GRADIENT }} />
                              )}
                            </div>
                          </td>

                          {/* URL */}
                          <td style={{ padding: "14px 16px", minWidth: 220 }}>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-sm hover:opacity-70 transition-opacity"
                              style={{ color: "var(--stone)" }}
                            >
                              {truncar(post.url, 40)}
                            </a>
                          </td>

                          {/* Descripción */}
                          <td style={{ padding: "14px 16px", minWidth: 200 }}>
                            <p className="font-sans text-sm" style={{ color: "var(--stone)" }}>
                              {truncar(post.descripcion, 50)}
                            </p>
                          </td>

                          {/* Orden */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <p className="font-sans text-sm tabular-nums" style={{ color: "var(--stone)" }}>
                              {post.orden}
                            </p>
                          </td>

                          {/* Estado */}
                          <td style={{ padding: "14px 16px" }}>
                            <span
                              className="inline-flex items-center gap-1.5 font-sans text-xs rounded-sm px-2 py-0.5"
                              style={{
                                backgroundColor: post.activo ? "rgba(45,90,50,0.25)" : "rgba(80,80,76,0.25)",
                                color: post.activo ? "#7ec87e" : "#9a9890",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                className="rounded-full flex-shrink-0"
                                style={{
                                  width: 5,
                                  height: 5,
                                  backgroundColor: post.activo ? "#5cb85c" : "#6a6a66",
                                }}
                              />
                              {post.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td style={{ padding: "14px 16px" }}>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/instagram/${post.id}/editar`}
                                className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70"
                                style={{ backgroundColor: "#1e2a1f", color: "#7ec87e", border: "1px solid #2a3d2b" }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Editar
                              </Link>
                              <DeleteInstagramButton id={post.id} />
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
          {posts.length} {posts.length === 1 ? "post" : "posts"} en total
        </p>
      </div>
    </div>
  );
}
