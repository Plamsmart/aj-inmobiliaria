"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const SESSION_KEY = "aj-admin-active";
const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutos

export default function SessionGuard() {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function forceSignOut() {
      sessionStorage.removeItem(SESSION_KEY);
      await supabase.auth.signOut();
      window.location.href = "/admin/login";
    }

    // ── sessionStorage check ────────────────────────────────────
    // sessionStorage is NEVER restored by browsers after close/restart.
    // If the key is missing we know this is a restored or unauthorized session.
    if (!sessionStorage.getItem(SESSION_KEY)) {
      forceSignOut();
      return;
    }

    let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

    // ── visibilitychange: 5-min inactivity timer ────────────────
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        inactivityTimer = setTimeout(forceSignOut, INACTIVITY_MS);
      } else {
        if (inactivityTimer !== null) {
          clearTimeout(inactivityTimer);
          inactivityTimer = null;
        }
      }
    }

    // ── beforeunload: best-effort clear ─────────────────────────
    // async won't fully resolve, but clearing sessionStorage is synchronous
    // and prevents the session from being reused if the browser restores cookies.
    function handleBeforeUnload() {
      sessionStorage.removeItem(SESSION_KEY);
      supabase.auth.signOut();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (inactivityTimer !== null) clearTimeout(inactivityTimer);
    };
  }, []);

  return null;
}
