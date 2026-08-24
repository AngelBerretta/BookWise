export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const authorName = (author) =>
  typeof author === 'object' ? (author?.username ?? '—') : (author ?? '—');