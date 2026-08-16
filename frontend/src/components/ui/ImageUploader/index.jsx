import useImageUploader from './useImageUploader';
import ImageUploaderPreview from './ImageUploaderPreview';
import ImageUploaderEmpty from './ImageUploaderEmpty';
import ImageUploaderError from './ImageUploaderError';

/**
 * Widget de carga de imágenes con preview inmediato.
 *
 * OJO: este componente YA NO sube nada a Cloudinary. Solo valida el
 * archivo, genera un preview local (blob URL) y se lo pasa al padre
 * vía onFileSelect(file, previewUrl). El padre es responsable de subir
 * ese File a Cloudinary recién en el submit real del formulario.
 *
 * Por qué: si el upload se dispara apenas se elige el archivo (como
 * antes), cada vez que el usuario prueba/cambia/cancela una imagen
 * ANTES de guardar, esa imagen queda subida y huérfana en Cloudinary
 * — nunca queda asociada a ningún producto/post, así que nada la
 * borra. Subiendo recién al guardar, solo existe UN upload por cada
 * imagen que realmente termina persistida.
 *
 * @param {string}   value        - URL actual ya persistida (modo edición)
 * @param {Function} onFileSelect - (file: File, previewUrl: string) => void
 * @param {Function} onRemove     - () => void — se llamó a "quitar imagen"
 * @param {string}   label
 *
 * IMPORTANTE: el padre debe montar este componente con `key={record?._id || 'new'}`
 * para que, al cambiar de producto/post editado, el preview se resetee solo
 * (remount limpio) en vez de necesitar un efecto para sincronizar estado.
 */
const ImageUploader = ({ value, onFileSelect, onRemove, label = 'Imagen' }) => {
  const {
    preview, error, dragOver, setDragOver,
    inputRef, onInputChange, onDrop, handleRemove,
  } = useImageUploader({ value, onFileSelect, onRemove });

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--text-h)]">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
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
          <ImageUploaderPreview preview={preview} onRemove={handleRemove} />
        ) : (
          <ImageUploaderEmpty />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onInputChange}
        className="hidden"
      />

      <ImageUploaderError message={error} />
    </div>
  );
};

export default ImageUploader;