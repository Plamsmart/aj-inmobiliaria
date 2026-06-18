"use client";

import { useState } from "react";
import { updateLeadEstadoAction } from "@/actions/leadActions";
import type { LeadEstado } from "@/lib/types";

const ESTADOS: LeadEstado[] = ["Pendiente", "Contactado", "Cerrado"];

const selectStyle: React.CSSProperties = {
  backgroundColor: "#0f0f0e",
  border: "1px solid #2a2a28",
  color: "var(--paper)",
  padding: "5px 8px",
  borderRadius: 2,
  fontSize: 12,
  fontFamily: "var(--font-sans)",
  outline: "none",
  cursor: "pointer",
};

export default function LeadEstadoSelect({
  id,
  estado,
}: {
  id: string;
  estado: LeadEstado;
}) {
  const [value, setValue] = useState<LeadEstado>(estado);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevoEstado = e.target.value as LeadEstado;
    setValue(nuevoEstado);
    setSaving(true);
    try {
      await updateLeadEstadoAction(id, nuevoEstado);
    } catch {
      setValue(estado);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      style={{ ...selectStyle, opacity: saving ? 0.5 : 1 }}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}
