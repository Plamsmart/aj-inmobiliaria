import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Propiedades from "@/components/Propiedades";
import Manifesto from "@/components/Manifesto";
import Journal from "@/components/Journal";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Propiedades />
        <Manifesto />
        <Journal />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
