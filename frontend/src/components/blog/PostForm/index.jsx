import Input from '../../ui/Input';
import Button from '../../ui/Button';
import FormErrorBanner from '../../ui/FormErrorBanner';
import MarkdownEditor from '../MarkdownEditor';
import ImageUploader from '../../ui/ImageUploader';
import usePostForm from './usePostForm';
import PostFormPreview from './PostFormPreview';
import PostPublishedToggle from './PostPublishedToggle';

const PostForm = ({ post, onSuccess, onCancel }) => {
  const {
    isEditing, fields, fieldErrors, loading, error, preview,
    onChange, onSubmit, imageUploaderProps,
    openPreview, closePreview, previewPost,
  } = usePostForm({ post, onSuccess });

  return (
    <>
      {/*
        OJO: el formulario NO se desmonta al activar "Vista previa" — solo
        se oculta con CSS (`hidden`). Si se desmontara (ej. con un
        `if (preview) return <PostFormPreview/>` temprano), ImageUploader
        perdería su estado interno (la imagen recién seleccionada, que
        vive como blob URL) y al volver del preview aparecería vacío.
        Mantenerlo montado preserva ese estado intacto.
      */}
      <form
        onSubmit={onSubmit}
        noValidate
        className={`flex flex-col gap-4 ${preview ? 'hidden' : ''}`}
      >
        <FormErrorBanner message={error} />

        <Input
          label="Título *"
          name="title"
          placeholder="Título del artículo"
          value={fields.title}
          onChange={onChange}
          error={fieldErrors.title}
        />

        <ImageUploader
          key={post?._id || 'new'}
          label="Imagen de portada"
          {...imageUploaderProps}
        />

        <Input
          label="Tags (separados por coma)"
          name="tags"
          placeholder="reseña, ficción, recomendado"
          value={fields.tags}
          onChange={onChange}
          error={fieldErrors.tags}
        />

        <MarkdownEditor
          label="Contenido *"
          name="content"
          rows={12}
          placeholder="Escribí el contenido del artículo aquí… (admite Markdown)"
          value={fields.content}
          onChange={onChange}
          error={fieldErrors.content}
        />

        <PostPublishedToggle checked={fields.published} onChange={onChange} />

        <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="button" variant="secondary" disabled={loading} onClick={openPreview}>
            Vista previa
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditing ? 'Guardar cambios' : 'Crear post'}
          </Button>
        </div>
      </form>

      {preview && (
        <PostFormPreview
          previewPost={previewPost}
          loading={loading}
          isEditing={isEditing}
          onBack={closePreview}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default PostForm;