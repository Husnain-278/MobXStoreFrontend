// Extract error message from API response
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.detail) {
    return error.detail;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error) {
    return error.error;
  }

  // Handle Django REST Framework errors (dict of field errors)
  if (typeof error === 'object') {
    const firstKey = Object.keys(error)[0];
    if (firstKey && Array.isArray(error[firstKey])) {
      return error[firstKey][0];
    }
    if (firstKey && typeof error[firstKey] === 'string') {
      return error[firstKey];
    }
  }

  return 'An error occurred. Please try again.';
};

// Extract field-level errors
export const getFieldErrors = (error) => {
  const errors = {};

  if (typeof error === 'object') {
    Object.keys(error).forEach((key) => {
      if (Array.isArray(error[key])) {
        errors[key] = error[key][0];
      } else {
        errors[key] = error[key];
      }
    });
  }

  return errors;
};

// Check if it's a validation error (4xx status)
export const isValidationError = (error) => {
  return error?.status >= 400 && error?.status < 500;
};

// Check if it's a server error (5xx status)
export const isServerError = (error) => {
  return error?.status >= 500;
};

// Check if it's a network error
export const isNetworkError = (error) => {
  return Boolean(error?.request && !error?.response);
};

// Format error message for display
export const formatErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }

  if (isServerError(error)) {
    return 'Server error. Please try again later.';
  }

  return getErrorMessage(error?.response?.data || error);
};
