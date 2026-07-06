"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const VIDEOS = ["/vista_bonita.mp4", "/vuelo_alto.mp4", "/cristal_clear.mp4"];

export default function Hero() {
  // slots[0] and slots[1] hold the src for each video element
  const [slots, setSlots] = useState<[string, string]>([VIDEOS[0], VIDEOS[1]]);
  // opacities[0] and opacities[1] control visibility of each video element
  const [opacities, setOpacities] = useState<[number, number]>([1, 0]);

  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1] as const;

  // Tracks which index in VIDEOS is currently the active (visible) one
  const currentIdxRef = useRef(0);

  // Start initial playback manually (no autoPlay attribute to avoid accidental
  // retrigger when we later swap the src for preloading)
  useEffect(() => {
    videoRef0.current?.play().catch(() => {});
  }, []);

  function handleEnded(slot: 0 | 1) {
    const nextIdx = (currentIdxRef.current + 1) % VIDEOS.length;
    const nextNextIdx = (nextIdx + 1) % VIDEOS.length;
    const otherSlot = (1 - slot) as 0 | 1;

    // The other slot has been preloading the next video — play it now
    videoRefs[otherSlot].current?.play().catch(() => {});

    // Crossfade: incoming slot rises to 1, outgoing drops to 0
    setOpacities(otherSlot === 0 ? [1, 0] : [0, 1]);

    // After the 800ms fade completes: advance the index and preload the
    // video-after-next into the now-invisible slot
    setTimeout(() => {
      currentIdxRef.current = nextIdx;
      setSlots((prev) => {
        const updated = [...prev] as [string, string];
        updated[slot] = VIDEOS[nextNextIdx];
        return updated;
      });
      // load() buffers the new src without playing
      videoRefs[slot].current?.load();
    }, 800);
  }

  return (
    <section className="relative flex items-end h-screen w-full overflow-hidden bg-black">
      {/* Video slot 0 */}
      <video
        ref={videoRef0}
        muted
        playsInline
        preload="auto"
        src={slots[0]}
        onEnded={() => handleEnded(0)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: opacities[0],
          transition: "opacity 800ms ease-in-out",
        }}
      />

      {/* Video slot 1 — preloads the next video while slot 0 plays */}
      <video
        ref={videoRef1}
        muted
        playsInline
        preload="auto"
        src={slots[1]}
        onEnded={() => handleEnded(1)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: opacities[1],
          transition: "opacity 800ms ease-in-out",
        }}
      />

      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="relative w-full px-8 pb-16 md:px-16 md:pb-20 flex items-end justify-between gap-8"
        style={{ zIndex: 2 }}
      >
        {/* Left: eyebrow + title + subtitle */}
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

        {/* Right: tagline + CTA */}
        <div className="flex-shrink-0 text-right">
          <p className="hidden md:block text-paper font-serif text-3xl md:text-4xl mb-5">
            Expertos locales, resultados reales
          </p>
          <Link
            href="/propiedades"
            className="hidden md:inline-flex items-center gap-2 text-paper text-sm tracking-wide uppercase border-b border-stone pb-0.5 hover:border-paper transition-colors font-sans"
          >
            Explorar propiedades →
          </Link>
        </div>
      </div>
    </section>
  );
}
