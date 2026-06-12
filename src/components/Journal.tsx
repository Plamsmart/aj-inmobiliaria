import Image from "next/image";
import Link from "next/link";

interface Articulo {
  titulo: string;
  link: string;
  fecha: string;
  fuente: string;
  imageUrl: string | null;
}

const GRADIENTES = [
  "linear-gradient(160deg, #4A5240 0%, #2D3B2E 100%)",
  "linear-gradient(160deg, #3D4A3A 0%, #1A261C 100%)",
  "linear-gradient(160deg, #47503E 0%, #1E2A1A 100%)",
];

const FALLBACK: Articulo[] = [
  {
    titulo:
      "Irun, el municipio guipuzcoano con mayor crecimiento en valor de vivienda en 2026",
    link: "#",
    fecha: "8 junio 2026",
    fuente: "Mercado local",
    imageUrl: null,
  },
  {
    titulo: "Cómo preparar tu casa para venderla al mejor precio",
    link: "#",
    fecha: "2 junio 2026",
    fuente: "Consejos",
    imageUrl: null,
  },
  {
    titulo: "Las mejores zonas para comprar en la comarca del Bidasoa",
    link: "#",
    fecha: "28 mayo 2026",
    fuente: "Hondarribia",
    imageUrl: null,
  },
];

// ─── RSS helpers ─────────────────────────────────────────────────────────────

function extraer(xml: string, tag: string): string {
  const m = xml.match(
    new RegExp(
      `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
      "i"
    )
  );
  return m ? m[1].trim() : "";
}

function extractRssImage(itemXml: string): string | null {
  // <media:content url="...">
  const media = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (media) return media[1];

  // <enclosure url="..." type="image/...">
  const enclosure = itemXml.match(
    /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\//i
  );
  if (enclosure) return enclosure[1];

  return null;
}

function parseRSS(
  xml: string
): Array<Omit<Articulo, "imageUrl"> & { imageUrl: string | null }> {
  const result: Array<Omit<Articulo, "imageUrl"> & { imageUrl: string | null }> = [];
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  for (const match of items) {
    const item = match[1];
    const rawTitle = extraer(item, "title");
    const link = extraer(item, "link") || extraer(item, "guid");
    const rawDate = extraer(item, "pubDate");
    const fuente = extraer(item, "source");
    const imageUrl = extractRssImage(item);

    if (!rawTitle || !link) continue;

    const titulo = fuente
      ? rawTitle
          .replace(
            new RegExp(
              `\\s*-\\s*${fuente.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`
            ),
            ""
          )
          .trim()
      : rawTitle;

    const date = rawDate ? new Date(rawDate) : null;
    const fecha =
      date && !isNaN(date.getTime())
        ? new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(date)
        : rawDate;

    result.push({ titulo, link, fecha, fuente: fuente || "Noticias", imageUrl });
    if (result.length === 3) break;
  }

  return result;
}

// ─── Microlink image fetcher ──────────────────────────────────────────────────

interface MicrolinkResponse {
  status: string;
  data?: { image?: { url: string } | null };
}

async function fetchMicrolinkImage(articleUrl: string): Promise<string | null> {
  if (!articleUrl || articleUrl === "#") return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const api = `https://api.microlink.io?url=${encodeURIComponent(articleUrl)}`;
    const res = await fetch(api, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as MicrolinkResponse;
    if (json.status !== "success") return null;
    const url = json.data?.image?.url ?? null;
    // Reject Google CDN images — these are channel logos, not article photos
    if (url && (url.includes("googleusercontent.com") || url.includes("gstatic.com"))) return null;
    return url;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Main data fetch ──────────────────────────────────────────────────────────

async function getNoticias(): Promise<Articulo[]> {
  const res = await fetch(
    "https://news.google.com/rss/search?q=vivienda+Irun+Hondarribia&hl=es&gl=ES&ceid=ES:es",
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`RSS error ${res.status}`);

  const xml = await res.text();
  const parsed = parseRSS(xml);
  if (parsed.length === 0) throw new Error("sin resultados");

  // Fetch image via Microlink in parallel for items without an RSS image
  const imageResults = await Promise.allSettled(
    parsed.map((item) =>
      item.imageUrl
        ? Promise.resolve(item.imageUrl)
        : fetchMicrolinkImage(item.link)
    )
  );

  return parsed.map((item, i) => ({
    ...item,
    imageUrl:
      imageResults[i].status === "fulfilled"
        ? (imageResults[i] as PromiseFulfilledResult<string | null>).value
        : null,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default async function Journal() {
  let noticias: Articulo[];

  try {
    noticias = await getNoticias();
  } catch {
    noticias = FALLBACK;
  }

  return (
    <section
      id="revista"
      className="px-8 md:px-16 py-24 md:py-32"
      style={{ backgroundColor: "var(--sand)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-mist mb-3">
              Revista
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
              Noticias e inspiración
            </h2>
          </div>
          <Link
            href="/revista"
            className="font-sans text-sm tracking-wide uppercase text-ink border-b border-ink pb-0.5 hover:opacity-50 transition-opacity flex-shrink-0 ml-8"
          >
            Ver todo →
          </Link>
        </div>

        {/* Grid 1.5fr · 1fr · 1fr */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-6">
          {noticias.map((articulo, i) => (
            <a
              key={articulo.link + i}
              href={articulo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-paper"
            >
              {/* Image area */}
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ height: i === 0 ? "300px" : "220px" }}
              >
                {articulo.imageUrl ? (
                  <Image
                    src={articulo.imageUrl}
                    alt={articulo.titulo}
                    fill
                    sizes={
                      i === 0
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ background: GRADIENTES[i % GRADIENTES.length] }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-mist">
                  {articulo.fuente}
                </p>
                <h3
                  className={`font-serif text-ink leading-snug ${
                    i === 0 ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                  }`}
                >
                  {articulo.titulo}
                </h3>
                <p className="font-sans text-xs text-stone mt-auto pt-3 border-t border-sand">
                  {articulo.fecha}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
