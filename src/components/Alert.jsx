// Alert component for notifications
export default function Alert({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) {
  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  return (
    <div
      className={`border-l-4 p-4 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl font-bold">{typeIcons[type]}</span>
        <div className="flex-1">
          {title && <h3 className="font-semibold">{title}</h3>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl font-bold opacity-50 hover:opacity-100 transition"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
