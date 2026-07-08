import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadImage } from '../../services/uploadService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Widget de carga de imágenes con preview inmediato.
 * Sube el archivo apenas se selecciona/arrastra y devuelve la URL
 * optimizada de Cloudinary vía onChange(url).
 *
 * @param {string}   value  - URL actual (para edición)
 * @param {Function} onChange - (url: string) => void
 * @param {'product'|'post'} type - carpeta destino en Cloudinary
 * @param {string}   label
 */
const ImageUploader = ({ value, onChange, type = 'product', label = 'Imagen' }) => {
  const [preview, setPreview]   = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [dragOver, setDragOver] = useState(false);

  const inputRef     = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const validate = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Formato no soportado. Usá JPG, PNG, WEBP o GIF.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'La imagen no puede superar los 5MB.';
    }
    return null;
  };

  const handleFile = useCallback(async (file) => {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    // Preview local instantáneo mientras se sube
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;
    setPreview(localUrl);

    setUploading(true);
    try {
      const data = await uploadImage(file, type);
      setPreview(data.url);
      onChange(data.url, data.publicId);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Error al subir la imagen.'
      );
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  }, [onChange, type, value]);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setPreview('');
    setError('');
    onChange('', '');
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--text-h)]">{label}</label>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          'relative flex flex-col items-center justify-center gap-2',
          'rounded-lg border-2 border-dashed cursor-pointer overflow-hidden',
          'transition-colors min-h-[160px]',
          dragOver
            ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
            : 'border-[var(--border)] bg-[var(--bg)]',
        ].join(' ')}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Vista previa"
              loading="lazy"
              className="w-full h-40 object-cover"
              style={{ opacity: uploading ? 0.5 : 1 }}
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Quitar imagen"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-8 text-[var(--text)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3.75 3.75 0 0 1 4.157 3.7 4.5 4.5 0 0 1 .57 8.94" />
            </svg>
            <p className="text-sm">Arrastrá una imagen o hacé clic para subirla</p>
            <p className="text-xs opacity-60">JPG, PNG, WEBP o GIF · máx. 5MB</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm7.25-3.25a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;