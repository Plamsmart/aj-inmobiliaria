"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

const CAL_LINK = "pedro-lambarri/visita-a-propiedad";
const CAL_NAMESPACE = "visita-a-propiedad";

interface CalButtonProps {
  text: string;
  className?: string;
}

export default function CalButton({ text, className }: CalButtonProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#2d3b2e" },
          dark: { "cal-brand": "#2d3b2e" },
        },
      });
    })();
  }, []);

  return (
    <button
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
      className={
        className ??
        "font-sans text-sm tracking-[0.15em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
      }
      style={{
        backgroundColor: "var(--forest)",
        color: "var(--paper)",
      }}
    >
      {text}
    </button>
  );
}
