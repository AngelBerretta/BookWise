import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const validate = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no soportado. Usá JPG, PNG, WEBP o GIF.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'La imagen no puede superar los 5MB.';
  }
  return null;
};

/**
 * Estado y handlers del uploader: preview local (blob URL), drag&drop,
 * validación. NO sube nada a Cloudinary — ver doc completa en index.jsx.
 */
const useImageUploader = ({ value, onFileSelect, onRemove }) => {
  const [preview, setPreview] = useState(value || '');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFile = useCallback((file) => {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;
    setPreview(localUrl);

    onFileSelect(file, localUrl);
  }, [onFileSelect]);

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
    onRemove();
  };

  return {
    preview, error, dragOver, setDragOver,
    inputRef, onInputChange, onDrop, handleRemove,
  };
};

export default useImageUploader;