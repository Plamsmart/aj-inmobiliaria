import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Propiedades from "@/components/Propiedades";
import TestimoniosCarrusel from "@/components/TestimoniosCarrusel";
import Manifesto from "@/components/Manifesto";
import Journal from "@/components/Journal";
import InstagramFeed from "@/components/InstagramFeed";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LocalSEO from "@/components/LocalSEO";

const realEstateAgentSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
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
  founder: [
    { "@type": "Person", name: "Jon" },
    { "@type": "Person", name: "Aroa" },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(realEstateAgentSchema),
        }}
      />
      <LocalSEO />
      <Navbar />
      <main>
        <Hero />
        <Propiedades />
        <TestimoniosCarrusel />
        <Intro />
        <Manifesto />
        <InstagramFeed />
        <Journal />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
