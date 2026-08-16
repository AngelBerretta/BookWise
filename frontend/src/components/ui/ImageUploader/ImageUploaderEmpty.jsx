const ImageUploaderEmpty = () => (
  <div className="flex flex-col items-center gap-1.5 py-8 text-[var(--text)]">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-50">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3.75 3.75 0 0 1 4.157 3.7 4.5 4.5 0 0 1 .57 8.94" />
    </svg>
    <p className="text-sm">Arrastrá una imagen o hacé clic para subirla</p>
    <p className="text-xs opacity-60">JPG, PNG, WEBP o GIF · máx. 5MB</p>
  </div>
);

export default ImageUploaderEmpty;