"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

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

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    // Mark this as an active browser session — SessionGuard checks this on mount
    sessionStorage.setItem("aj-admin-active", "1");
    router.push("/admin/propiedades");
    router.refresh();
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#0d0d0c", fontFamily: "var(--font-sans)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-sm rounded-sm px-8 py-9"
        style={{ backgroundColor: "#111110", border: "1px solid #262624" }}
      >
        <div>
          <p
            className="font-serif tracking-tight mb-1"
            style={{ fontSize: 18, color: "var(--paper)" }}
          >
            AJ Inmobiliaria
          </p>
          <p
            className="font-sans uppercase tracking-widest"
            style={{ fontSize: 10, color: "var(--mist)" }}
          >
            Panel de control
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-sans text-xs uppercase tracking-widest mb-2 block"
            style={{ color: "var(--mist)" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="font-sans text-xs uppercase tracking-widest mb-2 block"
            style={{ color: "var(--mist)" }}
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {errorMsg && (
          <p className="font-sans text-sm" style={{ color: "#f08080" }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="font-sans text-sm tracking-[0.15em] uppercase px-5 py-2.5 rounded-sm transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: "var(--forest)", color: "var(--paper)" }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <Link
        href="/"
        className="absolute bottom-8 font-sans text-xs transition-opacity hover:opacity-70"
        style={{ color: "#4a4a47" }}
      >
        ← Volver a la web
      </Link>
    </div>
  );
}
