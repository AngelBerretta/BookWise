import { useCallback } from 'react';
import { Bold, Italic, Heading2, Quote, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code } from 'lucide-react';

/* Envuelve la selección con `before`/`after`. Si no hay selección, usa un placeholder. */
const wrapSelection = (textarea, before, after = before, placeholder = '') => {
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end) || placeholder;

  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  const cursorStart = start + before.length;
  const cursorEnd    = cursorStart + selected.length;

  return { newValue, cursorStart, cursorEnd };
};

/* Agrega un prefijo al inicio de la línea actual (para títulos, listas, citas). */
const prefixLine = (textarea, prefix) => {
  const start = textarea.selectionStart;
  const value = textarea.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;

  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const cursorPos = start + prefix.length;

  return { newValue, cursorStart: cursorPos, cursorEnd: cursorPos };
};

const ACTIONS = [
  { icon: Bold,        label: 'Negrita',        apply: (t) => wrapSelection(t, '**', '**', 'texto en negrita') },
  { icon: Italic,       label: 'Cursiva',        apply: (t) => wrapSelection(t, '_', '_', 'texto en cursiva') },
  { icon: Heading2,     label: 'Título',         apply: (t) => prefixLine(t, '## ') },
  { icon: Quote,        label: 'Cita',           apply: (t) => prefixLine(t, '> ') },
  { icon: List,         label: 'Lista',          apply: (t) => prefixLine(t, '- ') },
  { icon: ListOrdered,  label: 'Lista numerada', apply: (t) => prefixLine(t, '1. ') },
  { icon: LinkIcon,     label: 'Enlace',         apply: (t) => wrapSelection(t, '[', '](https://)', 'texto del enlace') },
  { icon: ImageIcon,    label: 'Imagen',         apply: (t) => wrapSelection(t, '![', '](https://)', 'descripción') },
  { icon: Code,         label: 'Código',         apply: (t) => wrapSelection(t, '`', '`', 'código') },
];

const MarkdownToolbar = ({ textareaRef, onInsert }) => {
  const handleClick = useCallback((action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newValue, cursorStart, cursorEnd } = action.apply(textarea);
    onInsert(newValue);

    // Restaurar foco y selección después de que React re-renderice
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  }, [textareaRef, onInsert]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 rounded-t-lg border border-b-0 border-[var(--border)] bg-[var(--bg-subtle)]">
      {ACTIONS.map(({ icon: Icon, label, apply }) => (
        <button
          key={label}
          type="button"
          onClick={() => handleClick({ apply })}
          title={label}
          aria-label={label}
          className="flex items-center justify-center w-7 h-7 rounded text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] transition-colors"
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  );
};

export default MarkdownToolbar;