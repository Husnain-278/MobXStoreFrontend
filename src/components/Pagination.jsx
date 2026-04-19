import Button from './Button';

// Pagination component
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) {
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first, last, and surrounding pages
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
      >
        ← Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={disabled || currentPage === page}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
      >
        Next →
      </Button>
    </div>
  );
}
