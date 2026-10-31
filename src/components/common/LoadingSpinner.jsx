export default function LoadingSpinner({ size = "md", message = "" }) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-20 w-20 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-blue-500`}
      />
      {message && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
