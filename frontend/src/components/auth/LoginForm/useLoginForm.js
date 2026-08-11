import { useState, useCallback, useEffect, useRef } from 'react';
import useAuth from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import useToast from '../../../hooks/useToast';

const validate = (fields) => {
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Ingresá un email válido.';
  }
  if (!fields.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (fields.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres.';
  }
  return errors;
};

/** Estado, validación y submit del formulario de login. */
const useLoginForm = (onSuccess) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [fields, setFields] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { handleSubmit, loading, error } = useForm(
    useCallback(async (data) => {
      const result = await login(data);
      onSuccess?.(result?.user);
    }, [login, onSuccess])
  );

  const prevErrorRef = useRef(null);
  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      showToast({ type: 'error', message: error });
    }
    prevErrorRef.current = error;
  }, [error, showToast]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate(fields);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    handleSubmit(fields);
  };

  const notifyForgotPassword = () => showToast({
    type: 'info',
    message: 'La recuperación de contraseña estará disponible próximamente. Mientras tanto, probá el acceso demo para explorar la plataforma.',
  });

  return {
    fields, fieldErrors, showPassword, setShowPassword,
    onChange, onSubmit, loading, notifyForgotPassword,
  };
};

export default useLoginForm;