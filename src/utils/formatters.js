// Format currency to USD or custom currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date to readable format
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Format date to short format (e.g., Jan 15, 2024)
export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Truncate text to specified length
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Convert slug to readable text
export const slugToText = (slug) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
};

// Format rating (e.g., 4.5/5)
export const formatRating = (rating) => {
  return `${Number(rating).toFixed(1)}/5`;
};

// Get initials from full name
export const getInitials = (fullName) => {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();
};
