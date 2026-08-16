const ImageUploaderPreview = ({ preview, onRemove }) => (
  <>
    <img src={preview} alt="Vista previa" loading="lazy" className="w-full h-40 object-cover" />
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onRemove(); }}
      className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
      aria-label="Quitar imagen"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
      </svg>
    </button>
  </>
);

export default ImageUploaderPreview;