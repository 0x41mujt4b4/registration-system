"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto mt-16 max-w-xl rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
      <h2 className="font-semibold">Dashboard failed to load</h2>
      <p className="mt-1 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="mt-3 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-500"
      >
        Retry
      </button>
    </div>
  );
}
