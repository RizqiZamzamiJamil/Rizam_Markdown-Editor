export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-brand-cyan/25 bg-slate-950/95 px-4 py-3 text-sm font-bold text-white shadow-cyan backdrop-blur">
      {message}
    </div>
  );
}
