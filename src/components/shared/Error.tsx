interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({ message = 'Une erreur est survenue', onRetry }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Oops!
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
