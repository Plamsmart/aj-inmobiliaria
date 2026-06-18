import { getActiveInstagramPosts } from "@/lib/instagram";

const INSTAGRAM_PROFILE = "https://www.instagram.com/jon.gonzalez.morales?igsh=emg5dXJvYm10bTJx";
const BRAND_GRADIENT = "linear-gradient(145deg, #4A5240 0%, #1E2418 100%)";

export default async function InstagramFeed() {
  let posts = await getActiveInstagramPosts().catch(() => []);

  if (posts.length === 0) return null;

  return (
    <section
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <p
            className="font-sans text-xs uppercase tracking-widest"
            style={{ color: "var(--stone)" }}
          >
            Síguenos en Instagram
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--bark)" }}
          >
            @jon.gonzalez.morales
          </h2>
          <div
            className="h-px w-12"
            style={{ backgroundColor: "var(--forest)", opacity: 0.5 }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-items-center">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col items-center gap-3">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0"
              aria-label={post.descripcion ?? "Ver post en Instagram"}
            >
              {post.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.thumbnail_url}
                  alt={post.descripcion ?? ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="3.5" />
                    <path d="M17.5 6.5h.01" strokeWidth="2" />
                  </svg>
                </div>
              )}

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ backgroundColor: "rgba(30,36,24,0.72)" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <path d="M17.5 6.5h.01" strokeWidth="2" />
                </svg>
              </div>
            </a>
            {post.descripcion && (
              <p
                className="font-sans text-xs text-center line-clamp-2 max-w-[11rem]"
                style={{ color: "var(--mist)" }}
              >
                {post.descripcion}
              </p>
            )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-sans text-sm uppercase tracking-widest px-7 py-3 rounded-sm transition-opacity hover:opacity-70"
            style={{
              border: "1px solid var(--bark)",
              color: "var(--bark)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <path d="M17.5 6.5h.01" strokeWidth="2" />
            </svg>
            Ver perfil completo
          </a>
        </div>
      </div>
    </section>
  );
}
