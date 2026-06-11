export function IconButton({
  id,
  label,
  icon: Icon,
  onClick,
  active = false,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-cyan/45 disabled:cursor-not-allowed disabled:opacity-45 ${
        active
          ? "border-brand-cyan/55 bg-brand-cyan/15 text-brand-cyan"
          : "border-white/10 bg-white/[0.045] text-slate-200 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 hover:text-white"
      }`}
      disabled={disabled}
      id={id}
      onClick={onClick}
      title={label}
      type={type}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
