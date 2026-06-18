"use client";

import { useState } from "react";
import { deletePropiedadAction } from "@/lib/actions/propiedades";

export default function DeleteButton({ id }: { id: string }) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "loading">("idle");

  async function handleClick() {
    if (phase === "idle") {
      setPhase("confirm");
      // Auto-reset if user doesn't confirm in 3 s
      setTimeout(() => setPhase((p) => (p === "confirm" ? "idle" : p)), 3000);
      return;
    }
    if (phase === "confirm") {
      setPhase("loading");
      try {
        await deletePropiedadAction(id);
        // The Server Action revalidates the path — page re-renders automatically
      } catch {
        setPhase("idle");
      }
    }
  }

  const label =
    phase === "loading"
      ? "Eliminando…"
      : phase === "confirm"
        ? "¿Confirmar?"
        : "Eliminar";

  const icon =
    phase === "confirm" ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={phase === "loading"}
      className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-sm transition-opacity hover:opacity-70 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        backgroundColor: phase === "confirm" ? "#3d1f1f" : "#2a1a1a",
        color: phase === "confirm" ? "#f08080" : "#e07878",
        border: `1px solid ${phase === "confirm" ? "#5a2a2a" : "#3d2424"}`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
