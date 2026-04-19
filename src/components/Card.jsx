// Card component for container layouts
export default function Card({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
}) {
  const hoverClass = hover ? 'hover:shadow-xl hover:scale-105' : '';
  const cursorClass = clickable ? 'cursor-pointer' : '';
  const finalClass = `bg-white rounded-lg shadow-lg p-6 transition ${hoverClass} ${cursorClass} ${className}`;

  return (
    <div className={finalClass} onClick={onClick}>
      {children}
    </div>
  );
}
