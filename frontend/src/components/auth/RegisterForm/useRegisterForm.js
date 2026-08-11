import { useState, useCallback, useEffect, useRef } from 'react';
import useAuth from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import useToast from '../../../hooks/useToast';

const validate = (fields) => {
  const errors = {};
  if (!fields.username.trim()) {
    errors.username = 'El nombre es obligatorio.';
  } else if (fields.username.trim().length < 2) {
    errors.username = 'Mínimo 2 caracteres.';
  }
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
  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Confirmá tu contraseña.';
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }
  return errors;
};

/** Estado, validación y submit del formulario de registro. */
const useRegisterForm = (onSuccess) => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [fields, setFields] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleSubmit, loading, error } = useForm(
    useCallback(async (data) => {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      await register(payload);
      onSuccess?.();
    }, [register, onSuccess])
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

  return {
    fields, fieldErrors, loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    onChange, onSubmit,
  };
};

export default useRegisterForm;