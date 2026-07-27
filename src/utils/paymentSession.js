const PENDING_PAYMENT_KEY = 'mobxstore_pending_paypal_payment';

export const savePendingPayPalPayment = (data) => {
  const serializedData = JSON.stringify(data);

  sessionStorage.setItem(PENDING_PAYMENT_KEY, serializedData);
  localStorage.setItem(PENDING_PAYMENT_KEY, serializedData);
};

export const getPendingPayPalPayment = () => {
  const rawValue = sessionStorage.getItem(PENDING_PAYMENT_KEY) || localStorage.getItem(PENDING_PAYMENT_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

export const clearPendingPayPalPayment = () => {
  sessionStorage.removeItem(PENDING_PAYMENT_KEY);
  localStorage.removeItem(PENDING_PAYMENT_KEY);
};