// Spinner/Loading component
export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-b-indigo-600 ${sizeClasses[size]} ${className}`}></div>
  );
}
