import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useCart from '../../../hooks/useCart';
import useCheckout from '../../../hooks/useCheckout';
import useForm from '../../../hooks/useForm';
import useToast from '../../../hooks/useToast';

const emptyAddress = (user) => ({
  fullName: user?.username ?? '',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Argentina',
  notes: '',
});

const validate = (fields) => {
  const errors = {};
  if (!fields.fullName.trim() || fields.fullName.trim().length < 3) {
    errors.fullName = 'Ingresá tu nombre completo.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Ingresá un email válido.';
  }
  if (!fields.phone.trim() || fields.phone.trim().length < 6) {
    errors.phone = 'Ingresá un teléfono válido.';
  }
  if (!fields.address.trim() || fields.address.trim().length < 5) {
    errors.address = 'Ingresá tu dirección completa.';
  }
  if (!fields.city.trim()) errors.city = 'Ingresá tu ciudad.';
  if (!fields.province.trim()) errors.province = 'Ingresá tu provincia.';
  if (!fields.postalCode.trim()) errors.postalCode = 'Ingresá tu código postal.';
  if (!fields.country.trim()) errors.country = 'Ingresá tu país.';
  return errors;
};

/**
 * Estado, validación y submit del formulario de dirección de envío.
 * Crea el pedido en el backend al confirmar y arma el resumen del carrito.
 */
const useShippingForm = () => {
  const { user } = useAuth();
  const { cart, products, itemCount, loading: cartLoading, total: cartTotal } = useCart();
  const { shippingAddress, setShippingAddress, startOrder } = useCheckout();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fields, setFields] = useState(() => shippingAddress ?? emptyAddress(user));
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!cartLoading && itemCount === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartLoading, itemCount, navigate]);

  const { handleSubmit, loading, error } = useForm(
    useCallback(
      async (data) => {
        setShippingAddress(data);
        await startOrder(cart._id, data);
        navigate('/checkout/payment');
      },
      [cart, setShippingAddress, startOrder, navigate]
    )
  );

  useEffect(() => {
    if (error) showToast({ type: 'error', message: error });
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

  const summaryItems = useMemo(
    () =>
      products.map((line) => ({
        title: line.product?.title ?? '',
        thumbnail: line.product?.thumbnails?.[0] ?? line.product?.url ?? '',
        price: line.product?.price ?? 0,
        quantity: line.quantity,
      })),
    [products]
  );

  return {
    fields, fieldErrors, onChange, onSubmit, loading,
    cartLoading, cartTotal, summaryItems,
  };
};

export default useShippingForm;