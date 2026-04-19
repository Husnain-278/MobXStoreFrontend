// Validate email format
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

// Get password strength message
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, message: 'Password is required', color: 'text-red-500' };
  if (password.length < 6) return { score: 1, message: 'Too short', color: 'text-red-500' };
  if (password.length < 8) return { score: 2, message: 'Weak', color: 'text-orange-500' };
  if (validatePassword(password)) return { score: 4, message: 'Strong', color: 'text-green-500' };
  return { score: 3, message: 'Medium', color: 'text-yellow-500' };
};

// Validate phone number (basic validation)
export const validatePhone = (phone) => {
  const re = /^[0-9+\-() ]{10,}$/;
  return re.test(phone);
};

// Validate required field
export const validateRequired = (value) => {
  return value && String(value).trim().length > 0;
};

// Validate number
export const validateNumber = (value) => {
  return !isNaN(value) && value !== '';
};

// Validate min length
export const validateMinLength = (value, minLength) => {
  return String(value).length >= minLength;
};

// Validate max length
export const validateMaxLength = (value, maxLength) => {
  return String(value).length <= maxLength;
};

// Validate price (positive number)
export const validatePrice = (price) => {
  return !isNaN(price) && price > 0;
};

// Validate postal code (basic)
export const validatePostalCode = (code) => {
  const re = /^[0-9]{4,10}$/;
  return re.test(code);
};
