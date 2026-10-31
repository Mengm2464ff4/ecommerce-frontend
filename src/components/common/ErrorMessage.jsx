export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 my-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span>{message}</span>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition whitespace-nowrap"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
