import { useState } from 'react';
import { loadSavedAddress } from './storageKeys';

/**
 * Al loguearse (o cambiar de cuenta) recupera lo persistido para ESE
 * usuario — nunca el de una sesión anterior de otra cuenta en el mismo
 * navegador. Reseteo derivado durante el render (en vez de un useEffect)
 * siguiendo el patrón que recomienda React para "resetear estado cuando
 * cambia una prop/valor externo" — evita el round-trip extra de un efecto
 * disparando otro render.
 */
const useCheckoutSync = (userId) => {
  const [shippingAddress, setShippingAddressState] = useState(null);
  const [order, setOrder] = useState(null);
  // Sentinel (no `null`/`undefined`) para distinguir "todavía no
  // sincronizamos con ningún usuario" de "el usuario es null" (deslogueado).
  const [syncedUserId, setSyncedUserId] = useState('__unset__');

  if (userId !== syncedUserId) {
    setSyncedUserId(userId);
    setShippingAddressState(loadSavedAddress(userId));
    setOrder(null);
  }

  return { shippingAddress, setShippingAddressState, order, setOrder };
};

export default useCheckoutSync;