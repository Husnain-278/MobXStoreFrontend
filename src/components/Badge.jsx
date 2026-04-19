// Badge component for status display
export default function Badge({
  children,
  variant = 'primary',
  className = '',
}) {
  const variantStyles = {
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const baseStyles = 'inline-block px-3 py-1 rounded-full text-sm font-semibold';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
