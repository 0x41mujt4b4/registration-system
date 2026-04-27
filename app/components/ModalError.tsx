"use client";

import { useEffect } from "react";

interface ModalErrorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  message?: string;
}

export default function ModalError({ open, setOpen, title, message }: ModalErrorProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-error-title"
      aria-describedby="modal-error-description"
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-black/50"
        aria-label="Close dialog"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-md rounded-md bg-white px-4 py-6 shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 id="modal-error-title" className="mt-3 text-center text-lg font-medium text-slate-800">
          {title ?? "Error Occurred"}
        </h2>
        <p id="modal-error-description" className="mt-1 text-center text-sm leading-relaxed text-slate-500">
          {message ??
            "We encountered an unexpected issue. Please try again or contact support if the problem persists."}
        </p>
        <div className="mt-3 sm:flex sm:items-center sm:gap-2">
          <button
            type="button"
            className="mt-2 w-full flex-1 rounded-md bg-red-600 p-2.5 text-white outline-none ring-red-600 ring-offset-2 focus:ring-2"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
