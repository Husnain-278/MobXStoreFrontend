// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/accounts/register/',
    LOGIN: '/accounts/login/',
    VERIFY_EMAIL: '/accounts/verify-email/',
    PROFILE: '/accounts/profile/',
  },
  PRODUCTS: {
    LIST: '/products/mobiles/',
    DETAIL: '/products/mobiles/',
    CATEGORIES: '/products/categories/',
    BRANDS: '/products/brands/',
    ADD_REVIEW: '/products/add-review/',
  },
  CART: {
    LIST: '/cart/',
    ADD: '/cart/add-to-cart/',
    UPDATE: '/cart/update/',
    REMOVE: '/cart/remove/',
    ORDER: '/cart/order/',
    ORDERS: '/cart/orders/',
  },
  ADDRESSES: {
    LIST: '/addresses/',
    CREATE: '/addresses/',
    DELETE: '/addresses/',
    SET_DEFAULT: '/addresses/set-default/',
  },
  WISHLIST: {
    LIST: '/wishlist/',
    ADD: '/wishlist/add/',
    REMOVE: '/wishlist/remove/',
  },
};

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
};

// Payment methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  PAYPAL: 'paypal',
};

// Product status
export const PRODUCT_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  LIMITED: 'limited',
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  PASSWORD_MISMATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  ADD_TO_CART_ERROR: 'Failed to add item to cart. Please try again.',
  CHECKOUT_ERROR: 'Failed to process checkout. Please try again.',
  ORDER_ERROR: 'Failed to create order. Please try again.',
  WISHLIST_ERROR: 'Failed to update wishlist. Please try again.',
  ADDRESS_ERROR: 'Failed to update address. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTERED: 'Account created successfully! Please check your email to verify your account.',
  LOGIN_SUCCESS: 'Logged in successfully!',
  EMAIL_VERIFIED: 'Email verified successfully! You can now login.',
  ADD_TO_CART: 'Item added to cart successfully!',
  REMOVE_FROM_CART: 'Item removed from cart successfully!',
  CHECKOUT_SUCCESS: 'Order placed successfully!',
  ADDRESS_CREATED: 'Address added successfully!',
  ADDRESS_DELETED: 'Address deleted successfully!',
  ADDRESS_DEFAULT: 'Default address updated successfully!',
  WISHLIST_ADD: 'Added to wishlist!',
  WISHLIST_REMOVE: 'Removed from wishlist!',
  REVIEW_ADDED: 'Review added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
};

// App settings
export const APP_SETTINGS = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MobXStore',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
};
