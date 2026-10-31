export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;

  let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons);

  if (end - start < maxButtons) {
    start = Math.max(0, end - maxButtons);
  }

  for (let i = start; i < end; i++) {
    pages.push(i);
  }

  const btnBase = "px-3 py-2 rounded border transition text-sm font-medium";

  return (
    <div className="flex justify-center items-center gap-2 my-6 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`${btnBase} ${
          currentPage === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${btnBase} ${
            page === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`${btnBase} ${
          currentPage === totalPages - 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
      >
        Next →
      </button>
    </div>
  );
}
