const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "AJ Inmobiliaria",
  description:
    "Especialistas en compraventa de viviendas en Irun, Hondarribia y la comarca del Bidasoa.",
  url: "https://aj-inmobiliaria.vercel.app",
  telephone: "+34653011150",
  email: "jongasesoe@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Irun",
    addressRegion: "Gipuzkoa",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.3378,
    longitude: -1.7891,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Irun" },
    { "@type": "City", name: "Hondarribia" },
    { "@type": "AdministrativeArea", name: "Comarca del Bidasoa" },
  ],
};

export default function LocalSEO() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
