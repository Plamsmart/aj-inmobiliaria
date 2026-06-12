"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const VIDEOS = ["/vista_bonita.mp4", "/vuelo_alto.mp4", "/cristal_clear.mp4"];

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(false);

  // Load and play when currentVideo changes (skip initial mount — autoPlay handles it)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [currentVideo]);

  function handleEnded() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % VIDEOS.length);
      setIsTransitioning(false);
    }, 500);
  }

  return (
    <section className="relative flex items-end h-screen w-full overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop={false}
        playsInline
        onEnded={handleEnded}
        src={VIDEOS[currentVideo]}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      />

      {/* Overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-8 pb-16 md:px-16 md:pb-20 flex items-end justify-between gap-8">
        {/* Left: label + title + subtitle */}
        <div className="max-w-2xl">
          <p className="text-stone text-xs tracking-[0.25em] uppercase mb-4 font-sans">
            Encuentra tu hogar en la Costa Vasca
          </p>
          <h1 className="font-serif text-paper text-5xl md:text-7xl leading-none mb-5">
            <em>Propiedades únicas</em>
            <br />
            en Euskadi
          </h1>
          <p className="text-mist text-base md:text-lg font-sans max-w-md leading-relaxed">
            Casas, pisos y propiedades seleccionadas en Gipuzkoa y la Costa
            Vasca.
          </p>
        </div>

        {/* Right: tagline + link */}
        <div className="flex-shrink-0 text-right">
          <p className="text-paper font-serif text-3xl md:text-4xl mb-5">
            Te ayudamos a encontrar el lugar perfecto para vivir cerca del mar.
          </p>
          <Link
            href="/propiedades/casa-palermo-chico"
            className="inline-flex items-center gap-2 text-paper text-sm tracking-wide uppercase border-b border-stone pb-0.5 hover:border-paper transition-colors font-sans"
          >
            Explorar propiedades →
          </Link>
        </div>
      </div>
    </section>
  );
}
