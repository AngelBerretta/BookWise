import Button from '../../ui/Button';
import PostDetail from '../PostDetail';

/** Vista previa del post con los datos actuales del formulario, sin publicar aún. */
const PostFormPreview = ({ previewPost, loading, isEditing, onBack, onSubmit }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-amber-500 shrink-0">
        <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
      <p className="text-sm text-amber-700 dark:text-amber-400">
        Esta es una vista previa. El post <strong>no está publicado</strong> todavía.
      </p>
    </div>

    <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--bg)] max-h-[60vh] overflow-y-auto">
      <PostDetail post={previewPost} />
    </div>

    <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
      <Button type="button" variant="ghost" onClick={onBack}>
        ← Volver a editar
      </Button>
      <Button type="button" variant="primary" loading={loading} onClick={onSubmit}>
        {isEditing ? 'Guardar cambios' : 'Crear post'}
      </Button>
    </div>
  </div>
);

export default PostFormPreview;