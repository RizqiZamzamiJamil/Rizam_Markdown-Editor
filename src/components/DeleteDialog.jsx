import { AlertTriangle } from "lucide-react";

export function DeleteDialog({ documentTitle, isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-brand-panel p-5 shadow-panel">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-200">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-white">Delete document</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {documentTitle || "Untitled document"} will be removed from this browser.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-lg border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg border border-red-400/35 bg-red-500/15 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-500/25"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
