import { useState } from 'react';

/**
 * Mantiene un buffer de texto ("draft") sincronizado con un valor externo,
 * salvo mientras el usuario está tipeando en él (evita pisar lo que está
 * escribiendo). Ajusta el estado durante el render en vez de usar un
 * efecto con setState síncrono.
 */
const useSyncedDraft = (externalValue, editing) => {
  const [draft, setDraft] = useState(() => String(externalValue));
  const [prevValue, setPrevValue] = useState(externalValue);
  const [prevEditing, setPrevEditing] = useState(editing);

  if (externalValue !== prevValue || editing !== prevEditing) {
    setPrevValue(externalValue);
    setPrevEditing(editing);
    if (!editing) setDraft(String(externalValue));
  }

  return [draft, setDraft];
};

/** Inputs numéricos de precio — con buffer local para no pelear con el clamp mientras se tipea. */
const PriceNumberInputs = ({ min, max, value, onChange }) => {
  const [lo, hi] = value;
  const [editingLo, setEditingLo] = useState(false);
  const [editingHi, setEditingHi] = useState(false);

  const [draftLo, setDraftLo] = useSyncedDraft(lo, editingLo);
  const [draftHi, setDraftHi] = useSyncedDraft(hi, editingHi);

  const commitLo = () => {
    setEditingLo(false);
    const parsed = Number(draftLo);
    const clamped = Number.isNaN(parsed) ? lo : Math.min(Math.max(parsed, min), hi);
    onChange([clamped, hi]);
    setDraftLo(String(clamped));
  };

  const commitHi = () => {
    setEditingHi(false);
    const parsed = Number(draftHi);
    const clamped = Number.isNaN(parsed) ? hi : Math.max(Math.min(parsed, max), lo);
    onChange([lo, clamped]);
    setDraftHi(String(clamped));
  };

  const inputCls = 'bw-input text-xs';
  const labelCls = 'text-[10px] uppercase tracking-wide';

  return (
    <div className="flex items-center gap-3">
      <label className="flex flex-col gap-1 flex-1">
        <span className={labelCls} style={{ color: 'var(--text-muted)' }}>Mín.</span>
        <input
          type="number"
          inputMode="numeric"
          value={draftLo}
          onFocus={() => setEditingLo(true)}
          onChange={(e) => setDraftLo(e.target.value)}
          onBlur={commitLo}
          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
          aria-label="Precio mínimo exacto"
          className={inputCls}
          style={{ padding: '0.4rem 0.6rem' }}
        />
      </label>
      <span className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>–</span>
      <label className="flex flex-col gap-1 flex-1">
        <span className={labelCls} style={{ color: 'var(--text-muted)' }}>Máx.</span>
        <input
          type="number"
          inputMode="numeric"
          value={draftHi}
          onFocus={() => setEditingHi(true)}
          onChange={(e) => setDraftHi(e.target.value)}
          onBlur={commitHi}
          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
          aria-label="Precio máximo exacto"
          className={inputCls}
          style={{ padding: '0.4rem 0.6rem' }}
        />
      </label>
    </div>
  );
};

export default PriceNumberInputs;