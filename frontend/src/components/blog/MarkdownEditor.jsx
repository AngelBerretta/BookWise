import { useRef } from 'react';
import MarkdownToolbar from '../ui/MarkdownToolbar';

const MarkdownEditor = ({
  label,
  name,
  value,
  onChange,
  error,
  rows = 12,
  placeholder,
  className = '',
}) => {
  const textareaRef = useRef(null);
  const textareaId  = name ?? 'markdown-editor';

  // Reusa la misma forma de evento que espera onChange en PostForm
  const handleToolbarInsert = (newValue) => {
    onChange({ target: { name, value: newValue } });
  };

  const baseTextarea = [
    'w-full rounded-b-lg border px-3 py-2.5 text-sm resize-y',
    'bg-[var(--bg)] text-[var(--text-h)] font-[var(--mono)]',
    'placeholder:text-[var(--text)] placeholder:opacity-60 placeholder:font-[var(--sans)]',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2',
    error
      ? 'border-red-500 focus:ring-red-400'
      : 'border-[var(--border)] focus:ring-[var(--accent)] focus:border-[var(--accent-border)]',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-[var(--text-h)]">
          {label}
        </label>
      )}

      <div>
        <MarkdownToolbar textareaRef={textareaRef} onInsert={handleToolbarInsert} />
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseTextarea}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
        />
      </div>

      <p className="text-xs text-[var(--text)] opacity-60">
        Admite Markdown: **negrita**, _cursiva_, ## títulos, listas, &gt; citas y [enlaces](url).
      </p>

      {error && (
        <p id={`${textareaId}-error`} role="alert" className="text-xs text-red-500 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm7.25-3.25a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default MarkdownEditor;